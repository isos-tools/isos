// import { logger } from '@isos/logger';
import { sha256 as getHash } from 'crypto-hash';
import mimes from 'mime/lite';

import { Fs } from '@isos/fs/types';

// const log = logger('file cache');

type File = {
  hash: string | null;
  type: 'text' | 'image';
  data: ArrayBufferView | null;
  content: string | null;
  error: string;
};

type Store = Record<string, File>;

type Waiting = [string, ArrayBufferView][];

export type FileCache = {
  upsert: (filePath: string, content?: string) => Promise<boolean>;
  getData: (filePath: string) => ArrayBufferView | null;
  getContent: (filePath: string) => string | null;
  setContent: (filePath: string, content: string) => void;
  getError: (filePath: string) => string | null;
  setError: (filePath: string, error: string) => void;
  resetContent: (filePath: string) => void;
  remove: (filePath: string) => void;
  getFilePaths: () => string[];
  getChangedImages: () => Waiting;
  getStore: () => Store;
  destroy: () => void;
};

export function createFileCache(fs: Fs): FileCache {
  const store: Record<string, File> = {};

  async function getFile(fp: string, _content?: string) {
    let hash: string | null = null;
    let data: File['data'] = null;
    let content: File['content'] = _content || null;
    let error = null;

    if (content === null) {
      try {
        data = await fs.readBinaryFile(fp);
        if (data) {
          hash = await getHash(data);
        }
      } catch (err: any) {
        // console.log(err);
        // log.error(err?.message);
        error = err?.message;
      }
    }

    return { hash, data, content, error };
  }

  return {
    async upsert(fp, _content) {
      const { hash, data, content, error } = await getFile(fp, _content);
      const type = getType(fp);

      if (!store[fp]) {
        // console.log(`create: ${fp}`);
        // log.info(`create: ${fp}`);
        store[fp] = {
          hash,
          type,
          data: type === 'text' ? null : data,
          content: content === null ? getContent(type, data) : content,
          error,
        };
        return true;
      }

      if (hash !== store[fp].hash) {
        // console.log(`update: ${fp}`);
        // log.info(`update: ${fp}`);
        store[fp].hash = hash;
        store[fp].type = type;
        store[fp].data = type === 'text' ? null : data;
        store[fp].content = getContent(type, data);
        store[fp].error = error;
        return true;
      }

      return false;
    },
    remove(fp) {
      // log.info(`remove: ${fp}`);
      delete store[fp];
    },
    getData(fp) {
      return store[fp].data;
    },
    getContent(fp) {
      return store[fp].content;
    },
    setContent(fp, content) {
      // console.log(`set content: ${fp}`);
      // log.info(`set content: ${fp}`);
      store[fp].content = content;
    },
    getError(fp) {
      return store[fp].error;
    },
    setError(fp, error) {
      // console.log(`set error: ${fp}`);
      // log.info(`set error: ${fp}`);
      store[fp].error = error;
    },
    resetContent(fp) {
      // log.info(`reset content: ${fp}`);
      store[fp].content = null;
    },
    getFilePaths() {
      return Object.keys(store);
    },
    getChangedImages() {
      return Object.entries(store).reduce((acc: Waiting, [fp, o]) => {
        if (o.type === 'image' && o.data !== null && o.content === null) {
          acc.push([fp, o.data]);
        }
        return acc;
      }, []);
    },
    getStore() {
      return store;
    },
    destroy() {
      for (const fp of Object.keys(store)) {
        // log.info(`remove: ${fp}`);
        delete store[fp];
      }
    },
  };
}

function getType(fp: string): File['type'] {
  const mime = mimes.getType(fp) as string;
  return mime === null ? 'text' : 'image';
}

function getContent(type: File['type'], data: ArrayBufferView | null) {
  if (type === 'text' && data !== null) {
    return new TextDecoder().decode(data);
  }
  return null;
}
