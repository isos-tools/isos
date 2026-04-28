import { expect, test } from 'vitest';

import { testProcessor, unindentStringAndTrim } from '@isos/test-utils';

// @ts-ignore
// import { markdownToQuartoHtml } from '@isos/test-utils/md-to-quarto-html';

test('callout', async () => {
  const latex = unindentStringAndTrim(String.raw`
    \documentclass{article}
    \usepackage{awesomebox}
    \begin{document}

    \notebox{I'm a note \emph{callout} box}

    \tipbox{I'm a tip \emph{callout} box}

    \warningbox{I'm a warning \emph{callout} box}

    \cautionbox{I'm a caution \emph{callout} box}

    \importantbox{I'm an important \emph{callout} box}

    \end{document}
  `);

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(`
    ::: {.callout-note}
    I’m a note *callout* box
    :::

    ::: {.callout-tip}
    I’m a tip *callout* box
    :::

    ::: {.callout-warning}
    I’m a warning *callout* box
    :::

    ::: {.callout-caution}
    I’m a caution *callout* box
    :::

    ::: {.callout-important}
    I’m an important *callout* box
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);

  // const quartoHtml = await markdownToQuartoHtml(markdown);
  // console.log(quartoHtml);

  const html = await testProcessor.md(markdown, { noIcons: true });
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(`
    <div class="callout note">
      <div class="callout-header"><span class="callout-icon-note"></span><span class="callout-title">Note</span></div>
      <div class="callout-content">
        <p>I’m a note <em>callout</em> box</p>
      </div>
    </div>
    <div class="callout tip">
      <div class="callout-header"><span class="callout-icon-tip"></span><span class="callout-title">Tip</span></div>
      <div class="callout-content">
        <p>I’m a tip <em>callout</em> box</p>
      </div>
    </div>
    <div class="callout warning">
      <div class="callout-header"><span class="callout-icon-warning"></span><span class="callout-title">Warning</span></div>
      <div class="callout-content">
        <p>I’m a warning <em>callout</em> box</p>
      </div>
    </div>
    <div class="callout caution">
      <div class="callout-header"><span class="callout-icon-caution"></span><span class="callout-title">Caution</span></div>
      <div class="callout-content">
        <p>I’m a caution <em>callout</em> box</p>
      </div>
    </div>
    <div class="callout important">
      <div class="callout-header"><span class="callout-icon-important"></span><span class="callout-title">Important</span></div>
      <div class="callout-content">
        <p>I’m an important <em>callout</em> box</p>
      </div>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});

test('callout with title', async () => {
  const markdown = unindentStringAndTrim(`
    ::: {.callout-note}
    I’m a note *callout* box
    :::

    ::: {.callout-tip title="Tip with Title"}
    I’m a tip *callout* box
    :::

    ::: {.callout-warning}
    I’m a warning *callout* box
    :::

    ::: {.callout-caution}
    I’m a caution *callout* box
    :::

    ::: {.callout-important}
    I’m an important *callout* box
    :::
  `);

  // const quartoHtml = await markdownToQuartoHtml(markdown);
  // console.log(quartoHtml);

  const html = await testProcessor.md(markdown, { noIcons: true });
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(`
    <div class="callout note">
      <div class="callout-header"><span class="callout-icon-note"></span><span class="callout-title">Note</span></div>
      <div class="callout-content">
        <p>I’m a note <em>callout</em> box</p>
      </div>
    </div>
    <div class="callout tip">
      <div class="callout-header"><span class="callout-icon-tip"></span><span class="callout-title">Tip with Title</span></div>
      <div class="callout-content">
        <p>I’m a tip <em>callout</em> box</p>
      </div>
    </div>
    <div class="callout warning">
      <div class="callout-header"><span class="callout-icon-warning"></span><span class="callout-title">Warning</span></div>
      <div class="callout-content">
        <p>I’m a warning <em>callout</em> box</p>
      </div>
    </div>
    <div class="callout caution">
      <div class="callout-header"><span class="callout-icon-caution"></span><span class="callout-title">Caution</span></div>
      <div class="callout-content">
        <p>I’m a caution <em>callout</em> box</p>
      </div>
    </div>
    <div class="callout important">
      <div class="callout-header"><span class="callout-icon-important"></span><span class="callout-title">Important</span></div>
      <div class="callout-content">
        <p>I’m an important <em>callout</em> box</p>
      </div>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});

test('callout with icons', async () => {
  const latex = unindentStringAndTrim(String.raw`
    \documentclass{article}
    \usepackage{awesomebox}
    \begin{document}

    \notebox{I'm a note \emph{callout} box}

    \tipbox{I'm a tip \emph{callout} box}

    \warningbox{I'm a warning \emph{callout} box}

    \cautionbox{I'm a caution \emph{callout} box}

    \importantbox{I'm an important \emph{callout} box}

    \end{document}
  `);

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(`
    ::: {.callout-note}
    I’m a note *callout* box
    :::

    ::: {.callout-tip}
    I’m a tip *callout* box
    :::

    ::: {.callout-warning}
    I’m a warning *callout* box
    :::

    ::: {.callout-caution}
    I’m a caution *callout* box
    :::

    ::: {.callout-important}
    I’m an important *callout* box
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);

  // const quartoHtml = await markdownToQuartoHtml(markdown);
  // console.log(quartoHtml);

  const html = await testProcessor.md(markdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(`
    <div class="callout note">
      <div class="callout-header"><svg viewBox="0 0 512 512">
          <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"></path>
        </svg><span class="callout-title">Note</span></div>
      <div class="callout-content">
        <p>I’m a note <em>callout</em> box</p>
      </div>
    </div>
    <div class="callout tip">
      <div class="callout-header"><svg viewBox="0 0 384 512">
          <path d="M297.2 248.9C311.6 228.3 320 203.2 320 176c0-70.7-57.3-128-128-128S64 105.3 64 176c0 27.2 8.4 52.3 22.8 72.9c3.7 5.3 8.1 11.3 12.8 17.7c0 0 0 0 0 0c12.9 17.7 28.3 38.9 39.8 59.8c10.4 19 15.7 38.8 18.3 57.5L109 384c-2.2-12-5.9-23.7-11.8-34.5c-9.9-18-22.2-34.9-34.5-51.8c0 0 0 0 0 0s0 0 0 0c-5.2-7.1-10.4-14.2-15.4-21.4C27.6 247.9 16 213.3 16 176C16 78.8 94.8 0 192 0s176 78.8 176 176c0 37.3-11.6 71.9-31.4 100.3c-5 7.2-10.2 14.3-15.4 21.4c0 0 0 0 0 0s0 0 0 0c-12.3 16.8-24.6 33.7-34.5 51.8c-5.9 10.8-9.6 22.5-11.8 34.5l-48.6 0c2.6-18.7 7.9-38.6 18.3-57.5c11.5-20.9 26.9-42.1 39.8-59.8c0 0 0 0 0 0s0 0 0 0s0 0 0 0c4.7-6.4 9-12.4 12.7-17.7zM192 128c-26.5 0-48 21.5-48 48c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-44.2 35.8-80 80-80c8.8 0 16 7.2 16 16s-7.2 16-16 16zm0 384c-44.2 0-80-35.8-80-80l0-16 160 0 0 16c0 44.2-35.8 80-80 80z"></path>
        </svg><span class="callout-title">Tip</span></div>
      <div class="callout-content">
        <p>I’m a tip <em>callout</em> box</p>
      </div>
    </div>
    <div class="callout warning">
      <div class="callout-header"><svg viewBox="0 0 512 512">
          <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"></path>
        </svg><span class="callout-title">Warning</span></div>
      <div class="callout-content">
        <p>I’m a warning <em>callout</em> box</p>
      </div>
    </div>
    <div class="callout caution">
      <div class="callout-header"><svg viewBox="0 0 384 512">
          <path d="M153.6 29.9l16-21.3C173.6 3.2 180 0 186.7 0C198.4 0 208 9.6 208 21.3V43.5c0 13.1 5.4 25.7 14.9 34.7L307.6 159C356.4 205.6 384 270.2 384 337.7C384 434 306 512 209.7 512H192C86 512 0 426 0 320v-3.8c0-48.8 19.4-95.6 53.9-130.1l3.5-3.5c4.2-4.2 10-6.6 16-6.6C85.9 176 96 186.1 96 198.6V288c0 35.3 28.7 64 64 64s64-28.7 64-64v-3.9c0-18-7.2-35.3-19.9-48l-38.6-38.6c-24-24-37.5-56.7-37.5-90.7c0-27.7 9-54.8 25.6-76.9z"></path>
        </svg><span class="callout-title">Caution</span></div>
      <div class="callout-content">
        <p>I’m a caution <em>callout</em> box</p>
      </div>
    </div>
    <div class="callout important">
      <div class="callout-header"><svg viewBox="0 0 512 512">
          <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24l0 112c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-112c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"></path>
        </svg><span class="callout-title">Important</span></div>
      <div class="callout-content">
        <p>I’m an important <em>callout</em> box</p>
      </div>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});
