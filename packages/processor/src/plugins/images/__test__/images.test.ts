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

test('figure with only label', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{graphicx}
    \begin{document}

    \begin{figure}
      \includegraphics[width=60mm]{fig/ex1-1.png}
      \label{fig:sphere}
    \end{figure}

    as shown in \cref{fig:sphere}.

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(`
    ![](fig/ex1-1.png){#fig-sphere}

    as shown in @fig-sphere.
  `);
  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(String.raw`
    <figure id="fig-sphere"><img src="fig/ex1-1.png" alt="Image" />
      <figcaption><strong>Figure 1</strong></figcaption>
    </figure>
    <p>as shown in <a href="#fig-sphere" class="ref">Figure 1</a>.</p>
  `);

  expect(html).toBe(expectedHtml);
});

test('center inside theorem causes error', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{graphicx}
    \begin{document}

    \begin{solution}
      as shown in \cref{fig:sphere}.

      \begin{center}
        \includegraphics[width=60mm]{fig/ex1-1.png}
        \label{fig:sphere}
      \end{center}
    \end{solution}

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(`
    ::: {#sol-fig-sphere}
    as shown in @fig-sphere.

    ![](fig/ex1-1.png)

    :::
  `);
  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(String.raw`
    <div class="remark solution" id="sol-fig-sphere">
      <p><span class="title"><em>Solution 1</em>. </span>as shown in <span class="warn"><strong>unknown ref:</strong> <code>fig-sphere</code></span>.</p>
      <p><img src="fig/ex1-1.png" alt="Image" /></p>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});

test('figure inside theorem', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{graphicx}
    \begin{document}

    \begin{solution}
      as shown in \cref{fig:sphere}.

      \begin{figure}[H]
        \includegraphics[width=60mm]{fig/ex1-1.png}
        \label{fig:sphere}
      \end{figure}
    \end{solution}

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(`
    ::: {#sol-1}
    as shown in @fig-sphere.

    ![](fig/ex1-1.png){#fig-sphere}

    :::
  `);
  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(String.raw`
    <div class="remark solution" id="sol-1">
      <p><span class="title"><em>Solution 1</em>. </span>as shown in <a href="#fig-sphere" class="ref">Figure 1</a>.</p>
      <figure id="fig-sphere"><img src="fig/ex1-1.png" alt="Image" />
        <figcaption><strong>Figure 1</strong></figcaption>
      </figure>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});

test('syntax bug', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{graphicx}
    \begin{document}

    We can see
    $$\frac{x}$$
    giving.\\
    \includegraphics[width=40mm]{fig/ex1-4a.png}\\
    \quad
    \includegraphics[width=40mm]{fig/ex1-4b.png}
    \quad
    \includegraphics[width=50mm]{fig/ex1-4c.png}

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    We can see

    $$
    \frac{x}
    $$

    giving.

    ![](fig/ex1-4a.png)

    ![](fig/ex1-4b.png)

    ![](fig/ex1-4c.png)
  `);
  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(String.raw`
    <p>We can see</p>
    <p class="maths"><code class="latex">\frac{x}</code></p>
    <p>giving.</p>
    <p><img src="fig/ex1-4a.png" alt="Image" /></p>
    <p><img src="fig/ex1-4b.png" alt="Image" /></p>
    <p><img src="fig/ex1-4c.png" alt="Image" /></p>
  `);

  expect(html).toBe(expectedHtml);
});

test('images with no label or caption', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{graphicx}
    \begin{document}

    \begin{figure}
      \includegraphics*[width=45mm]{fig/ex1-2a.png}
      \includegraphics*[width=45mm]{fig/ex1-2b.png}
      \includegraphics*[width=45mm]{fig/ex1-2c.png}
    \end{figure}

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(`
    ::: {.fig}

    ![](fig/ex1-2a.png)

    ![](fig/ex1-2b.png)

    ![](fig/ex1-2c.png)

    :::
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(String.raw`
    <figure>
      <p><img src="fig/ex1-2a.png" alt="Image" /></p>
      <p><img src="fig/ex1-2b.png" alt="Image" /></p>
      <p><img src="fig/ex1-2c.png" alt="Image" /></p>
      <figcaption><strong>Figure 1</strong></figcaption>
    </figure>
  `);

  expect(html).toBe(expectedHtml);
});

test('images with includegraphics*', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{graphicx}
    \begin{document}

    \begin{figure}
      \includegraphics*[alt={Alpha}]{fig/ex1-2a.png}
      \includegraphics*[alt={Bravo}]{fig/ex1-2b.png}
      \includegraphics*[alt={Charlie}]{fig/ex1-2c.png}
    \end{figure}

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(`
    ::: {.fig}

    ![](fig/ex1-2a.png){alt="Alpha"}

    ![](fig/ex1-2b.png){alt="Bravo"}

    ![](fig/ex1-2c.png){alt="Charlie"}

    :::
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(String.raw`
    <figure>
      <p><img src="fig/ex1-2a.png" alt="Alpha" /></p>
      <p><img src="fig/ex1-2b.png" alt="Bravo" /></p>
      <p><img src="fig/ex1-2c.png" alt="Charlie" /></p>
      <figcaption><strong>Figure 1</strong></figcaption>
    </figure>
  `);

  expect(html).toBe(expectedHtml);
});
