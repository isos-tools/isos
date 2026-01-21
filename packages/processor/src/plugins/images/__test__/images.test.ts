import { expect, test } from 'vitest';

import { testProcessor, unindentStringAndTrim } from '@isos/test-utils';

// import { markdownToPandocHtml } from '@isos/test-utils/md-to-pandoc-html';
// import { markdownToQuartoHtml } from '@isos/test-utils/md-to-quarto-html';
// import { pdfLatexToHtml } from '../../../test-utils/pdflatex-to-html';

test('image', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{graphicx}
    \begin{document}
    \includegraphics[]{image.png}
    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(`
    ![](image.png)
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(`
    <p><img src="image.png" alt="Image" /></p>
  `);

  expect(html).toBe(expectedHtml);

  // const quartoHtml = await markdownToQuartoHtml(markdown);
  // console.log(quartoHtml);
});

test('image with alt text', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{graphicx}
    \begin{document}
    \includegraphics[alt={My \textbf{alt} text}]{image.png}
    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(`
    ![](image.png){alt="My alt text"}
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(`
    <p><img src="image.png" alt="My alt text" /></p>
  `);

  expect(html).toBe(expectedHtml);

  // const quartoHtml = await markdownToQuartoHtml(markdown);
  // console.log(quartoHtml);
});

test('image with caption', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{graphicx}
    \begin{document}
    \begin{figure}
      \includegraphics[]{image.png}
      \caption{My \textbf{caption} text}
    \end{figure}
    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(`
    ![My **caption** text](image.png)
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(`
    <figure><img src="image.png" alt="Image" />
      <figcaption><strong>Figure 1:</strong> My <strong>caption</strong> text</figcaption>
    </figure>
  `);

  expect(html).toBe(expectedHtml);

  // const quartoHtml = await markdownToQuartoHtml(markdown);
  // console.log(quartoHtml);
});

test('image with alt text and caption', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{graphicx}
    \begin{document}
    \begin{figure}
      \includegraphics[alt={My \textbf{alt} text}]{image.png}
      \caption{My \textbf{caption} text}
    \end{figure}
    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(`
    ![My **caption** text](image.png){alt="My alt text"}
  `);

  expect(markdown).toBe(expectedMarkdown);

  // const quartoMarkdown = unindentStringAndTrim(`
  //   ![My **caption** text](image.png){fig-alt="My alt text"}
  // `);

  // const quartoHtml = await markdownToQuartoHtml(quartoMarkdown);
  // // console.log(quartoHtml);

  // const expectedQuartoHtml = unindentStringAndTrim(`
  //   <div class="quarto-figure quarto-figure-center">
  //     <figure class="figure">
  //       <p><img src="image.png" class="img-fluid figure-img" alt="My alt text"></p>
  //       <figcaption>My <strong>caption</strong> text</figcaption>
  //     </figure>
  //   </div>
  // `);

  // expect(quartoHtml).toBe(expectedQuartoHtml);

  // const markdown2 = await testProcessor.mdToMd(quartoMarkdown);
  // // console.log(markdown2);

  // expect(markdown2).toBe(expectedMarkdown);

  // const pandocHtml = await markdownToPandocHtml(markdown);
  // // console.log(pandocHtml);

  // const expectedPandocHtml = unindentStringAndTrim(`
  //   <figure>
  //   <img src="image.png" alt="My alt text" />
  //   <figcaption>My <strong>caption</strong> text</figcaption>
  //   </figure>
  // `);

  // expect(pandocHtml).toBe(expectedPandocHtml);

  const html = await testProcessor.md(markdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(`
    <figure><img src="image.png" alt="My alt text" />
      <figcaption><strong>Figure 1:</strong> My <strong>caption</strong> text</figcaption>
    </figure>
  `);

  expect(html).toBe(expectedHtml);
});

test('image with alt text, caption and label', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{graphicx}
    \begin{document}

    \begin{figure}
    \label{fig:logo}
    \includegraphics[alt={My alt text}]{image.png}
    \caption{My \textbf{caption} text}
    \end{figure}

    Refer to \cref{fig:logo}.

    \end{document}
  `;

  // const latexHtml = await pdfLatexToHtml.mupdf(latex);
  // console.log(latexHtml);

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(`
    ![My **caption** text](image.png){#fig-logo alt="My alt text"}

    Refer to @fig-logo.
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(`
    <figure id="fig-logo"><img src="image.png" alt="My alt text" />
      <figcaption><strong>Figure 1:</strong> My <strong>caption</strong> text</figcaption>
    </figure>
    <p>Refer to <a href="#fig-logo" class="ref">Figure 1</a>.</p>
  `);

  expect(html).toBe(expectedHtml);

  // const quartoHtml = await markdownToQuartoHtml(markdown);
  // console.log(quartoHtml);
});

test('image with maths in the caption and label', async () => {
  const latex = String.raw`
    \begin{figure}[hbt]
      \begin{center}
        \includegraphics[width=80mm]{../fig/3ddom.png}
      \end{center}
      \caption{The graph of $f\colon D\to\mathbb{R}$.}
      \label{fig:f(x,y)}
    \end{figure}

    \cref{fig:f(x,y)} illustrates the graph of a function of two variables.
  `;

  // const latexHtml = await pdfLatexToHtml.mupdf(latex);
  // console.log(latexHtml);

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    ![The graph of $f\colon D\to\mathbb{R}$.](../fig/3ddom.png){#fig-f-x-y}

    @fig-f-x-y illustrates the graph of a function of two variables.
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(expectedMarkdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(String.raw`
    <figure id="fig-f-x-y"><img src="../fig/3ddom.png" alt="Image" />
      <figcaption><strong>Figure 1:</strong> The graph of <code class="latex">f\colon D\to\mathbb{R}</code>.</figcaption>
    </figure>
    <p><a href="#fig-f-x-y" class="ref">Figure 1</a> illustrates the graph of a function of two variables.</p>
  `);

  expect(html).toBe(expectedHtml);

  // const quartoHtml = await markdownToQuartoHtml(markdown);
  // console.log(quartoHtml);
});

test('figure with image and text', async () => {
  const latex = String.raw`
    \begin{figure}[hbt]
      \begin{center}
        \includegraphics{image.png}
      \end{center}
      \begin{flushright}
        \textcolor{purple}{\small{\href{https://moodle.gla.ac.uk}{Interactive plot $\rightarrow$}}}
      \end{flushright}
      \caption{The graph of $f\colon D\to\mathbb{R}$.}
      \label{fig:f(x,y)}
    \end{figure}

    \cref{fig:f(x,y)} illustrates the graph of a function of two variables.
  `;

  // // const latexHtml = await pdfLatexToHtml.mupdf(latex);
  // // console.log(latexHtml);

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    ::: {#fig-f-x-y}

    ![](image.png)

    [Interactive plot $\rightarrow$](https://moodle.gla.ac.uk)

    The graph of $f\colon D\to\mathbb{R}$.
    :::

    @fig-f-x-y illustrates the graph of a function of two variables.
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown, {
    // state: {
    //   maths: {
    //     mathsAsTex: false,
    //     mathsFontName: 'computerModern',
    //     syntaxHighlight: false,
    //   },
    // },
  });
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(String.raw`
    <figure id="fig-f-x-y">
      <p><img src="image.png" alt="Image" /></p>
      <p><a href="https://moodle.gla.ac.uk" target="_blank">Interactive plot <code class="latex">\rightarrow</code></a></p>
      <figcaption><strong>Figure 1:</strong> The graph of <code class="latex">f\colon D\to\mathbb{R}</code>.</figcaption>
    </figure>
    <p><a href="#fig-f-x-y" class="ref">Figure 1</a> illustrates the graph of a function of two variables.</p>
  `);

  expect(html).toBe(expectedHtml);

  // const quartoHtml = await markdownToQuartoHtml(markdown);
  // console.log(quartoHtml);
});

test('figure with two images with alt text and caption', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{graphicx}
    \begin{document}
    \begin{figure}
      \includegraphics[alt={My \textbf{alt} text}]{image.png}
      \includegraphics[alt={My \textbf{alt} text2}]{image2.png}
      \caption{My \textbf{caption} text}
    \end{figure}
    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(`
    ::: {.fig}

    ![](image.png){alt="My alt text"}

    ![](image2.png){alt="My alt text2"}

    My **caption** text
    :::
  `);
  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(expectedMarkdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(String.raw`
    <figure>
      <p><img src="image.png" alt="My alt text" /></p>
      <p><img src="image2.png" alt="My alt text2" /></p>
      <figcaption><strong>Figure 1:</strong> My <strong>caption</strong> text</figcaption>
    </figure>
  `);

  expect(html).toBe(expectedHtml);
});

test('figure with two images with alt text, caption and label', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{graphicx}
    \begin{document}
    \begin{figure}
      \includegraphics[alt={My \textbf{alt} text}]{image.png}
      \includegraphics[alt={My \textbf{alt} text2}]{image2.png}
      \label{fig:logo}
      \caption{My \textbf{caption} text}
    \end{figure}
    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(`
    ::: {#fig-logo}

    ![](image.png){alt="My alt text"}

    ![](image2.png){alt="My alt text2"}

    My **caption** text
    :::
  `);
  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(String.raw`
    <figure id="fig-logo">
      <p><img src="image.png" alt="My alt text" /></p>
      <p><img src="image2.png" alt="My alt text2" /></p>
      <figcaption><strong>Figure 1:</strong> My <strong>caption</strong> text</figcaption>
    </figure>
  `);

  expect(html).toBe(expectedHtml);
});

