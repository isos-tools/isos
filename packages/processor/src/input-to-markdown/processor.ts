import debounce from 'lodash.debounce';

import { Fs } from '@isos/fs/types';
import { logger } from '@isos/logger';

import { inputToMarkdown } from '.';
import { embedIncludes } from '../embed-includes';
import { createFileCache } from '../embed-includes/file-cache';
import { getDataUrl } from '../embed-includes/inline-image';
import { Context, createContext } from './context';
import { Options, createDefaultOptions } from './options';

const log = logger('processor');

export type Processed = {
  markdown: string;
  ctx: Context;
};

export type Processor = {
  process: () => Promise<void>;
  destroy: () => void;
};

type Handlers = {
  onError: (err: any) => unknown;
  onComplete: (res: Processed) => unknown;
  onLoading: (isLoading: boolean) => unknown;
  onStatus: (status: string) => unknown;
};

export function createProcessor(
  srcFilePath: string,
  fs: Fs,
  handlers: Handlers,
  _options?: Partial<Options>,
): Processor {
  const fileCache = createFileCache(fs);
  const watcher = fs.createWatcher(srcFilePath, debounce(process, 200));
  let controller: AbortController | null = null;

  async function process() {
    handlers.onLoading(true);

    // if process() is called again while it's still running,
    // abort the current process as soon as possible and
    // start the new one
    if (controller instanceof AbortController) {
      controller.abort();
      controller = null;
    }

    controller = new AbortController();

    function createAborted() {
      let aborted = false;
      return {
        aborted() {
          return aborted;
        },
        abort() {
          log.info(`aborted, restarting...`);
          aborted = true;
        },
      };
    }

    const token = createAborted();

    controller.signal.addEventListener('abort', token.abort, {
      once: true,
    });

    try {
      // step 1: create context object
      const ctx = await createContext(srcFilePath, fileCache);

      // step 2: read srcFile contents
      handlers.onStatus('Checking for changes...');
      log.info(`reading source file: ${ctx.srcFilePath}`);
      ctx.content = await fs.readTextFile(ctx.srcFilePath);
      if (token.aborted()) return;

      // step 3: recursively combine included files
      // handlers.onStatus('compiling source files...');
      log.info(`compiling source files`);
      const { subFiles } = await embedIncludes(ctx, fs);
      const len = subFiles.length;
      log.info(`found ${len} sub file${len === 1 ? '' : 's'}`);
      if (token.aborted()) return;

      const filePaths = [srcFilePath, ...subFiles];

      // step 4: check if something has changed and duck out early if not
      log.info(`checking for changes in ${filePaths.length} files`);
      const hasChanges = await hasChanged(filePaths);

      if (hasChanges) {
        log.info('found changes');
      } else {
        log.info('no changes found');
        handlers.onLoading(false);
        return;
      }
      if (token.aborted()) return;

      // step 5: watch all referenced files
      log.info(`watching ${filePaths.length} files for updates`);
      watcher.watch(filePaths);

      // step 6: transform waiting fileCache files
      const changedImages = fileCache.getChangedImages();
      if (changedImages.length > 0) {
        handlers.onStatus('Optimising images...');
        const len = changedImages.length;
        log.info(`found ${len} new image${len === 1 ? '' : 's'}`);

        let fileIdx = 0;
        for (const [filePath, buffer] of changedImages) {
          log.info(`${++fileIdx} processing ${filePath}`);

          const url = await getDataUrl(filePath, buffer);
          if (url.error) {
            fileCache.setError(filePath, url.data);
          } else {
            fileCache.setContent(filePath, url.data);
          }

          if (token.aborted()) return;
        }
      }

      // step 7: processor
      handlers.onStatus(`Converting ${ctx.type} to markdown...`);
      log.info(`${ctx.type} to markdown`);
      const options = createDefaultOptions(ctx, _options);
      const markdown = await inputToMarkdown(ctx.content, options);
      if (token.aborted()) return;

      handlers.onStatus(`Converting ${ctx.type} to html...`);
      handlers.onComplete({ markdown, ctx });
    } catch (err: any) {
      handlers.onLoading(false);
      handlers.onError(err);
    } finally {
      // handlers.onLoading(false);
      controller.signal.removeEventListener('abort', token.abort);
    }
  }

  let prevFilePaths: string[] = [];

  async function hasChanged(filePaths: string[]) {
    let changed = false;

    for (const fp of prevFilePaths) {
      if (!filePaths.includes(fp)) {
        fileCache.remove(fp);
        changed = true;
      }
    }

    for (const fp of filePaths) {
      if (await fileCache.upsert(fp)) {
        changed = true;
      }
    }

    prevFilePaths = filePaths;
    return changed;
  }

  return {
    process,
    destroy() {
      fileCache.destroy();
      watcher.destroy();
    },
  };
}
