import { expect, test } from 'vitest';

import { testProcessor, unindentStringAndTrim } from '@isos/test-utils';

test('footnote', async () => {
  const latex = String.raw`
    Foot\footnote{Alpha \textbf{strong} $x$ \[x=y\] \textit{em} end.

    Paragraph OK.} yes \footnote{\label{fn:test2}Bravo} is ok.

    See \zcref{fn:test2}.
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    Foot:footnote[fn-1] yes :footnote[fn-2] is ok.

    :::footnotecontent[fn-1]
    Alpha **strong** $x$

    $$
    x=y
    $$

    *em* end.

    Paragraph OK.
    :::

    :::footnotecontent[fn-2]{#fn-test-2}
    Bravo
    :::

    See @fn-test-2.
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(String.raw`
    <p>Foot<sup class="footnote"><a id="fn-ref-fn-1" href="#fn-def-fn-1">1</a></sup> yes <sup class="footnote"><a id="fn-ref-fn-test-2" href="#fn-test-2">2</a></sup> is ok.</p>
    <aside class="footnotes">
      <dl>
        <dt><sup><a id="fn-def-fn-1" href="#fn-ref-fn-1">1</a></sup></dt>
        <dd>
          <p>Alpha <strong>strong</strong> <code class="latex">x</code></p>
          <p class="maths"><code class="latex">x=y</code></p>
          <p><em>em</em> end.</p>
          <p>Paragraph OK.</p>
        </dd>
        <dt><sup><a id="fn-test-2" href="#fn-ref-fn-test-2">2</a></sup></dt>
        <dd>
          <p>Bravo</p>
        </dd>
      </dl>
    </aside>
    <p>See <a href="#fn-test-2" class="ref">Footnote 2</a>.</p>
  `);

  expect(html).toBe(expectedHtml);
});

test('multiply defined footnote marks', async () => {
  const latex = String.raw`
    Foot\footnote[1]{Alpha} and\footnote[1]{Bravo}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    Foot:footnote[1] and:warn[**Multiply defined footnote mark: 1**]

    :::footnotecontent[1]
    Alpha
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(String.raw`
    <p>Foot<sup class="footnote"><a id="fn-ref-1" href="#fn-def-1">1</a></sup> and <span class="warn"><strong>Multiply defined footnote mark: 1</strong></span> </p>
    <aside class="footnotes">
      <dl>
        <dt><sup><a id="fn-def-1" href="#fn-ref-1">1</a></sup></dt>
        <dd>
          <p>Alpha</p>
        </dd>
      </dl>
    </aside>
  `);

  expect(html).toBe(expectedHtml);
});

test('sepfootnote', async () => {
  const latex = String.raw`
    Foot\sepfootnote{xyz}.

    \sepfootnotecontent{xyz}{\label{fn:test1}Alpha}

    See \zcref{fn:test1}.
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    Foot:footnote[xyz].

    :::footnotecontent[xyz]{#fn-test-1}
    Alpha
    :::

    See @fn-test-1.
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(String.raw`
    <p>Foot<sup class="footnote"><a id="fn-ref-fn-test-1" href="#fn-test-1">1</a></sup>.</p>
    <aside class="footnotes">
      <dl>
        <dt><sup><a id="fn-test-1" href="#fn-ref-fn-test-1">1</a></sup></dt>
        <dd>
          <p>Alpha</p>
        </dd>
      </dl>
    </aside>
    <p>See <a href="#fn-test-1" class="ref">Footnote 1</a>.</p>
  `);

  expect(html).toBe(expectedHtml);
});

test('footnotes combined', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage[after]{sepfootnotes}
    \usepackage{snotez}
    \usepackage{postnotes}

    \usepackage{zref-clever}
    \zcsetup{noabbrev, cap, nameinlink}
    \usepackage[colorlinks]{hyperref}

    \begin{document}

    Alpha\footnote{\label{fn:a}Alpha} bravo\sidenote{\label{sn:b}Bravo} charlie\postnote{\label{en:c}Charlie}

    See \zcref{fn:a} and \zcref{sn:b} and \zcref{en:c}.

    \printpostnotes

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    Alpha:footnote[fn-1] bravo:sidenote[sn-2] charlie:endnote[en-3]

    :::footnotecontent[fn-1]{#fn-a}
    Alpha
    :::

    :::sidenotecontent[sn-2]{#sn-b}
    Bravo
    :::

    :::endnotecontent[en-3]{#en-c}
    Charlie
    :::

    See @fn-a and @sn-b and @en-c.

    ::printendnotes
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(String.raw`
    <p>Alpha<sup class="footnote"><a id="fn-ref-fn-a" href="#fn-a">1</a></sup> bravo<span class="sidenote"><sup><a id="sn-ref-sn-b" href="#sn-b">2</a></sup><span class="sidenote-label"> (sidenote: </span><small class="sidenote-content"><span><sup><a id="sn-b" href="#sn-ref-sn-b">2</a></sup>Bravo</span></small><span class="sidenote-label">)</span></span> charlie<sup class="endnote"><a id="en-ref-en-c" href="#en-c">3</a></sup></p>
    <aside class="footnotes">
      <dl>
        <dt><sup><a id="fn-a" href="#fn-ref-fn-a">1</a></sup></dt>
        <dd>
          <p>Alpha</p>
        </dd>
      </dl>
    </aside>
    <p>See <a href="#fn-a" class="ref">Footnote 1</a> and <a href="#sn-b" class="ref">Sidenote 2</a> and <a href="#en-c" class="ref">Note 3</a>.</p>
    <aside class="notes">
      <h2>Notes</h2>
      <dl>
        <dt><sup><a id="en-c" href="#en-ref-en-c">3</a></sup></dt>
        <dd>
          <p>Charlie</p>
        </dd>
      </dl>
    </aside>
  `);

  expect(html).toBe(expectedHtml);
});

test('sidenotes', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{snotez}

    \usepackage{zref-clever}
    \zcsetup{noabbrev, cap, nameinlink}
    \usepackage[colorlinks]{hyperref}

    \begin{document}

    Side\sidenote{Alpha \textbf{strong} $x$ \[x=y\] \textit{em} end. Paragraphs not OK.} yes.

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    Side:sidenote[sn-1] yes.

    :::sidenotecontent[sn-1]
    Alpha **strong** $x$

    $$
    x=y
    $$

    *em* end. Paragraphs not OK.
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(String.raw`
    <p>Side<span class="sidenote"><sup><a id="sn-ref-sn-1" href="#sn-def-sn-1">1</a></sup><span class="sidenote-label"> (sidenote: </span><small class="sidenote-content"><span><sup><a id="sn-def-sn-1" href="#sn-ref-sn-1">1</a></sup>Alpha <strong>strong</strong> <code class="latex">x</code></span><span class="maths"><code class="latex">x=y</code></span><span><em>em</em> end. Paragraphs not OK.</span></small><span class="sidenote-label">)</span></span> yes.</p>
  `);

  expect(html).toBe(expectedHtml);
});

test('endnotes', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{postnotes}

    \usepackage{zref-clever}
    \zcsetup{noabbrev, cap, nameinlink}
    \usepackage[colorlinks]{hyperref}

    \begin{document}

    End\postnote{\label{en:test1}Alpha \textbf{strong} $x$ \[x=y\] \textit{em} end.

    Paragraph OK.} and\postnote{\label{en:test2}Bravo} yes.

    See \zcref{en:test1} and \zcref{en:test2}.

    \printpostnotes

    End\postnote{\label{en:test3}Charlie} and\postnote{\label{en:test4}Delta} yes.

    \printpostnotes

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    End:endnote[en-1] and:endnote[en-2] yes.

    :::endnotecontent[en-1]{#en-test-1}
    Alpha **strong** $x$

    $$
    x=y
    $$

    *em* end.

    Paragraph OK.
    :::

    :::endnotecontent[en-2]{#en-test-2}
    Bravo
    :::

    See @en-test-1 and @en-test-2.

    ::printendnotes

    End:endnote[en-3] and:endnote[en-4] yes.

    :::endnotecontent[en-3]{#en-test-3}
    Charlie
    :::

    :::endnotecontent[en-4]{#en-test-4}
    Delta
    :::

    ::printendnotes
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(String.raw`
    <p>End<sup class="endnote"><a id="en-ref-en-test-1" href="#en-test-1">1</a></sup> and<sup class="endnote"><a id="en-ref-en-test-2" href="#en-test-2">2</a></sup> yes.</p>
    <p>See <a href="#en-test-1" class="ref">Note 1</a> and <a href="#en-test-2" class="ref">Note 2</a>.</p>
    <aside class="notes">
      <h2>Notes</h2>
      <dl>
        <dt><sup><a id="en-test-1" href="#en-ref-en-test-1">1</a></sup></dt>
        <dd>
          <p>Alpha <strong>strong</strong> <code class="latex">x</code></p>
          <p class="maths"><code class="latex">x=y</code></p>
          <p><em>em</em> end.</p>
          <p>Paragraph OK.</p>
        </dd>
        <dt><sup><a id="en-test-2" href="#en-ref-en-test-2">2</a></sup></dt>
        <dd>
          <p>Bravo</p>
        </dd>
      </dl>
    </aside>
    <p>End<sup class="endnote"><a id="en-ref-en-test-3" href="#en-test-3">3</a></sup> and<sup class="endnote"><a id="en-ref-en-test-4" href="#en-test-4">4</a></sup> yes.</p>
    <aside class="notes">
      <h2>Notes</h2>
      <dl>
        <dt><sup><a id="en-test-3" href="#en-ref-en-test-3">3</a></sup></dt>
        <dd>
          <p>Charlie</p>
        </dd>
        <dt><sup><a id="en-test-4" href="#en-ref-en-test-4">4</a></sup></dt>
        <dd>
          <p>Delta</p>
        </dd>
      </dl>
    </aside>
  `);

  expect(html).toBe(expectedHtml);
});

test('footnotes, sidenotes and endnotes', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage[after]{sepfootnotes}
    \usepackage{snotez}
    \usepackage{postnotes}

    \usepackage{zref-clever}
    \zcsetup{noabbrev, cap, nameinlink}
    \usepackage[colorlinks]{hyperref}

    \begin{document}

    Foot\footnote{\label{fn:test1}Alpha \textbf{strong} $x$ \[x=y\] \textit{em} end.

    Paragraph OK.} and\sepfootnote{xyz} and\sepfootnote{abc} yes.

    \sepfootnotecontent{abc}{\label{fn:test3}Charlie \textbf{strong} $x$ \[x=y\] \textit{em} end.

    Paragraph OK.}
    \sepfootnotecontent{xyz}{\label{fn:test2}Bravo}

    See \zcref{fn:test1} and \zcref{fn:test2} and \zcref{fn:test3}.

    Side\sidenote{Delta \textbf{strong} $x$ \[x=y\] \textit{em} end. Paragraphs not OK.} yes.

    End\postnote{\label{en:test1}Echo \textbf{strong} $x$ \[x=y\] \textit{em} end.

    Paragraph OK.} and\postnote{\label{en:test2}Foxtrot} yes.

    See \zcref{en:test1} and \zcref{en:test2}.

    \printpostnotes

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    Foot:footnote[fn-1] and:footnote[xyz] and:footnote[abc] yes.

    :::footnotecontent[fn-1]{#fn-test-1}
    Alpha **strong** $x$

    $$
    x=y
    $$

    *em* end.

    Paragraph OK.
    :::

    :::footnotecontent[xyz]{#fn-test-2}
    Bravo
    :::

    :::footnotecontent[abc]{#fn-test-3}
    Charlie **strong** $x$

    $$
    x=y
    $$

    *em* end.

    Paragraph OK.
    :::

    See @fn-test-1 and @fn-test-2 and @fn-test-3.

    Side:sidenote[sn-2] yes.

    :::sidenotecontent[sn-2]
    Delta **strong** $x$

    $$
    x=y
    $$

    *em* end. Paragraphs not OK.
    :::

    End:endnote[en-3] and:endnote[en-4] yes.

    :::endnotecontent[en-3]{#en-test-1}
    Echo **strong** $x$

    $$
    x=y
    $$

    *em* end.

    Paragraph OK.
    :::

    :::endnotecontent[en-4]{#en-test-2}
    Foxtrot
    :::

    See @en-test-1 and @en-test-2.

    ::printendnotes
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(String.raw`
    <p>Foot<sup class="footnote"><a id="fn-ref-fn-test-1" href="#fn-test-1">1</a></sup> and<sup class="footnote"><a id="fn-ref-fn-test-2" href="#fn-test-2">2</a></sup> and<sup class="footnote"><a id="fn-ref-fn-test-3" href="#fn-test-3">3</a></sup> yes.</p>
    <aside class="footnotes">
      <dl>
        <dt><sup><a id="fn-test-1" href="#fn-ref-fn-test-1">1</a></sup></dt>
        <dd>
          <p>Alpha <strong>strong</strong> <code class="latex">x</code></p>
          <p class="maths"><code class="latex">x=y</code></p>
          <p><em>em</em> end.</p>
          <p>Paragraph OK.</p>
        </dd>
        <dt><sup><a id="fn-test-2" href="#fn-ref-fn-test-2">2</a></sup></dt>
        <dd>
          <p>Bravo</p>
        </dd>
        <dt><sup><a id="fn-test-3" href="#fn-ref-fn-test-3">3</a></sup></dt>
        <dd>
          <p>Charlie <strong>strong</strong> <code class="latex">x</code></p>
          <p class="maths"><code class="latex">x=y</code></p>
          <p><em>em</em> end.</p>
          <p>Paragraph OK.</p>
        </dd>
      </dl>
    </aside>
    <p>See <a href="#fn-test-1" class="ref">Footnote 1</a> and <a href="#fn-test-2" class="ref">Footnote 2</a> and <a href="#fn-test-3" class="ref">Footnote 3</a>.</p>
    <p>Side<span class="sidenote"><sup><a id="sn-ref-sn-2" href="#sn-def-sn-2">4</a></sup><span class="sidenote-label"> (sidenote: </span><small class="sidenote-content"><span><sup><a id="sn-def-sn-2" href="#sn-ref-sn-2">4</a></sup>Delta <strong>strong</strong> <code class="latex">x</code></span><span class="maths"><code class="latex">x=y</code></span><span><em>em</em> end. Paragraphs not OK.</span></small><span class="sidenote-label">)</span></span> yes.</p>
    <p>End<sup class="endnote"><a id="en-ref-en-test-1" href="#en-test-1">5</a></sup> and<sup class="endnote"><a id="en-ref-en-test-2" href="#en-test-2">6</a></sup> yes.</p>
    <p>See <a href="#en-test-1" class="ref">Note 5</a> and <a href="#en-test-2" class="ref">Note 6</a>.</p>
    <aside class="notes">
      <h2>Notes</h2>
      <dl>
        <dt><sup><a id="en-test-1" href="#en-ref-en-test-1">5</a></sup></dt>
        <dd>
          <p>Echo <strong>strong</strong> <code class="latex">x</code></p>
          <p class="maths"><code class="latex">x=y</code></p>
          <p><em>em</em> end.</p>
          <p>Paragraph OK.</p>
        </dd>
        <dt><sup><a id="en-test-2" href="#en-ref-en-test-2">6</a></sup></dt>
        <dd>
          <p>Foxtrot</p>
        </dd>
      </dl>
    </aside>
  `);

  expect(html).toBe(expectedHtml);
});

test('footnotes as sidenotes', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage[after]{sepfootnotes}
    \usepackage[footnote]{snotez}

    \begin{document}

    Hello\footnote{Hey!} and\sepfootnote{xyz} and\sepfootnote{abc} yes.

    \sepfootnotecontent{abc}{Bravo \textbf{strong} $x$ \[x=y\] \textit{em} end. Paragraphs not OK.}
    \sepfootnotecontent{xyz}{Alpha}

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    Hello:sidenote[sn-1] and:sidenote[xyz] and:sidenote[abc] yes.

    :::sidenotecontent[sn-1]
    Hey!
    :::

    :::sidenotecontent[xyz]
    Alpha
    :::

    :::sidenotecontent[abc]
    Bravo **strong** $x$

    $$
    x=y
    $$

    *em* end. Paragraphs not OK.
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return

  const expectedHtml = unindentStringAndTrim(String.raw`
    <p>Hello<span class="sidenote"><sup><a id="sn-ref-sn-1" href="#sn-def-sn-1">1</a></sup><span class="sidenote-label"> (sidenote: </span><small class="sidenote-content"><span><sup><a id="sn-def-sn-1" href="#sn-ref-sn-1">1</a></sup>Hey!</span></small><span class="sidenote-label">)</span></span> and<span class="sidenote"><sup><a id="sn-ref-xyz" href="#sn-def-xyz">2</a></sup><span class="sidenote-label"> (sidenote: </span><small class="sidenote-content"><span><sup><a id="sn-def-xyz" href="#sn-ref-xyz">2</a></sup>Alpha</span></small><span class="sidenote-label">)</span></span> and<span class="sidenote"><sup><a id="sn-ref-abc" href="#sn-def-abc">3</a></sup><span class="sidenote-label"> (sidenote: </span><small class="sidenote-content"><span><sup><a id="sn-def-abc" href="#sn-ref-abc">3</a></sup>Bravo <strong>strong</strong> <code class="latex">x</code></span><span class="maths"><code class="latex">x=y</code></span><span><em>em</em> end. Paragraphs not OK.</span></small><span class="sidenote-label">)</span></span> yes.</p>
  `);

  expect(html).toBe(expectedHtml);
});

test('footnote referencing other footnote', async () => {
  const latex = String.raw`
    \documentclass{article}
    \begin{document}

    a\footnote{\label{Com2}b.} and c\footnote{d \zcref{Com2}.}

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    a:footnote[fn-1] and c:footnote[fn-2]

    :::footnotecontent[fn-1]{#com-2}
    b.
    :::

    :::footnotecontent[fn-2]
    d @com-2.
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(String.raw`
    <p>a<sup class="footnote"><a id="fn-ref-com-2" href="#com-2">1</a></sup> and c<sup class="footnote"><a id="fn-ref-fn-2" href="#fn-def-fn-2">2</a></sup></p>
    <aside class="footnotes">
      <dl>
        <dt><sup><a id="com-2" href="#fn-ref-com-2">1</a></sup></dt>
        <dd>
          <p>b.</p>
        </dd>
        <dt><sup><a id="fn-def-fn-2" href="#fn-ref-fn-2">2</a></sup></dt>
        <dd>
          <p>d <a href="#com-2" class="ref">Footnote 1</a>.</p>
        </dd>
      </dl>
    </aside>
  `);

  expect(html).toBe(expectedHtml);
});

test('framedsidenote', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{amsthm}
    \newtheorem{definition}{Definition}
    \begin{document}

    \begin{framed}
    \begin{definition}
    Let $S$ be a set.
    \begin{enumerate}
    \item We say that\framedsidenote{def}.
    \item We say that\framedsidenote{ghi}.
    \end{enumerate}
    \end{definition}
    \end{framed}

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    ---
    theorems:
      definition:
        heading: Definition
    ---

    :::::framed
    ::::definition
    Let $S$ be a set.

    1. We say that:sidenote[sn-1].

       :::sidenotecontent[sn-1]
       def
       :::

    2. We say that:sidenote[sn-2].

       :::sidenotecontent[sn-2]
       ghi
       :::
    ::::
    :::::
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(String.raw`
    <div class="framed">
      <div class="theorem definition">
        <p><span class="title"><strong>Definition 1.</strong></span> Let <code class="latex">S</code> be a set.</p>
        <ol>
          <li>
            <p>We say that<span class="sidenote"><sup><a id="sn-ref-sn-1" href="#sn-def-sn-1">1</a></sup><span class="sidenote-label"> (sidenote: </span><small class="sidenote-content"><span><sup><a id="sn-def-sn-1" href="#sn-ref-sn-1">1</a></sup>def</span></small><span class="sidenote-label">)</span></span>.</p>
          </li>
          <li>
            <p>We say that<span class="sidenote"><sup><a id="sn-ref-sn-2" href="#sn-def-sn-2">2</a></sup><span class="sidenote-label"> (sidenote: </span><small class="sidenote-content"><span><sup><a id="sn-def-sn-2" href="#sn-ref-sn-2">2</a></sup>ghi</span></small><span class="sidenote-label">)</span></span>.</p>
          </li>
        </ol>
      </div>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});

test('sidenote with \\mintinline', async () => {
  const latex = String.raw`
    Matrix\sidenote{inbuilt \mintinline{matlab}{H=hess(A)}} we.
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(`
    Matrix:sidenote[sn-1] we.

    :::sidenotecontent[sn-1]
    inbuilt \`{matlab} 'H=hess(A)'\`
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(String.raw`
    <p>Matrix<span class="sidenote"><sup><a id="sn-ref-sn-1" href="#sn-def-sn-1">1</a></sup><span class="sidenote-label"> (sidenote: </span><small class="sidenote-content"><span><sup><a id="sn-def-sn-1" href="#sn-ref-sn-1">1</a></sup>inbuilt <code class="language-matlab">H<span class="token operator">=</span><span class="token function">hess</span><span class="token punctuation">(</span>A<span class="token punctuation">)</span></code></span></small><span class="sidenote-label">)</span></span> we.</p>
  `);

  expect(html).toBe(expectedHtml);
});
