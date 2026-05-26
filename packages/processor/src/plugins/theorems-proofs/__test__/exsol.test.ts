import { expect, test } from 'vitest';

import { testProcessor, unindentStringAndTrim } from '@isos/test-utils';

test('newexsol show', async () => {
  const latex = unindentStringAndTrim(String.raw`
    \documentclass{article}

    \usepackage{lipsum}
    \usepackage[most]{tcolorbox}
    \usepackage{ifthen}

    \NewDocumentCommand{\newexsol}{sO{show}mmmmO{}}{%
      \NewTColorBox[auto counter,#6]{#3}{}{%
        enhanced,
        breakable,
        coltitle=black,
        fonttitle=\bfseries,
        title={\IfBooleanTF{#1}{#4}{#4~\thetcbcounter}},
        attach title to upper=\quad,
        before lower={\textbf{\IfBooleanTF{#1}{#5}{#5~\thetcbcounter}\quad}},%
        #7
      }

      \IfValueT{#2}{
        \ifthenelse{\equal{#2}{hide}}{
          \tcbset{lowerbox=ignored}
        }{}
        \ifthenelse{\equal{#2}{emptybox}}{
          \tcbset{lowerbox=invisible}
        }{}
      }
    }

    \theoremstyle{definition}
    % show, hide or emptybox
    \newexsol[show]{exercise}{Exercise}{Solution}{number within=section}[
      colback={white!80!yellow},
      colframe=red,
    ]

    \begin{document}

    \section{Alpha}

    \begin{exercise}
    abc
    \tcblower
    def
    \end{exercise}

    \end{document}
  `);

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(`
    ---
    theorems:
      exercise:
        style: definition
        framed: true
        hideable: show
        heading: Exercise
        lowerTitle: Solution
        numberWithin: h2
    ---

    ## Alpha

    ::::exercise
    abc

    ***

    :::solution
    def
    :::
    ::::
  `);

  expect(markdown).toBe(expectedMarkdown);
  // return;

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(`
    <h2 id="alpha"><span class="count">1</span> Alpha</h2>
    <div class="theorem exercise style-definition framed hideable-show">
      <p><span class="title"><strong>Exercise 1.1.</strong></span> abc</p>
      <hr />
      <p><span class="title"><strong>Solution 1.1.</strong></span> def</p>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});

test('newexsol', async () => {
  const latex = unindentStringAndTrim(String.raw`
    \documentclass{article}

    \usepackage{lipsum}
    \usepackage[most]{tcolorbox}
    \usepackage{ifthen}

    \NewDocumentCommand{\newexsol}{sO{show}mmmmO{}}{%
      \NewTColorBox[auto counter,#6]{#3}{}{%
        enhanced,
        breakable,
        coltitle=black,
        fonttitle=\bfseries,
        title={\IfBooleanTF{#1}{#4}{#4~\thetcbcounter}},
        attach title to upper=\quad,
        before lower={\textbf{\IfBooleanTF{#1}{#5}{#5~\thetcbcounter}\quad}},%
        #7
      }

      \IfValueT{#2}{
        \ifthenelse{\equal{#2}{hide}}{
          \tcbset{lowerbox=ignored}
        }{}
        \ifthenelse{\equal{#2}{emptybox}}{
          \tcbset{lowerbox=invisible}
        }{}
      }
    }

    \theoremstyle{definition}
    % show, hide or emptybox
    \newexsol{exercise}{Exercise}{Solution}{number within=section}[
      colback={white!80!yellow},
      colframe=red,
    ]

    \begin{document}

    \section{Alpha}

    \begin{exercise}
    abc
    \tcblower
    def
    \end{exercise}

    \end{document}
  `);

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(`
    ---
    theorems:
      exercise:
        style: definition
        framed: true
        hideable: clicktoshow
        heading: Exercise
        lowerTitle: Solution
        numberWithin: h2
    ---

    ## Alpha

    ::::exercise
    abc

    ***

    :::solution
    def
    :::
    ::::
  `);

  expect(markdown).toBe(expectedMarkdown);
  // return;

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(`
    <h2 id="alpha"><span class="count">1</span> Alpha</h2>
    <div class="theorem exercise style-definition framed hideable-clicktoshow">
      <p><span class="title"><strong>Exercise 1.1.</strong></span> abc</p>
      <hr />
      <p><button class="clicktoshow">Show Solution</button></p>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});

test('newexsol unnumbered', async () => {
  const latex = unindentStringAndTrim(String.raw`
    \documentclass{article}

    \usepackage{lipsum}
    \usepackage[most]{tcolorbox}
    \usepackage{ifthen}

    \NewDocumentCommand{\newexsol}{sO{show}mmmmO{}}{%
      \NewTColorBox[auto counter,#6]{#3}{}{%
        enhanced,
        breakable,
        coltitle=black,
        fonttitle=\bfseries,
        title={\IfBooleanTF{#1}{#4}{#4~\thetcbcounter}},
        attach title to upper=\quad,
        before lower={\textbf{\IfBooleanTF{#1}{#5}{#5~\thetcbcounter}\quad}},%
        #7
      }

      \IfValueT{#2}{
        \ifthenelse{\equal{#2}{hide}}{
          \tcbset{lowerbox=ignored}
        }{}
        \ifthenelse{\equal{#2}{emptybox}}{
          \tcbset{lowerbox=invisible}
        }{}
      }
    }

    \theoremstyle{definition}
    % show, hide or emptybox
    \newexsol*{exercise}{Exercise}{Solution}{number within=section}[
      colback={white!80!yellow},
      colframe=red,
    ]

    \begin{document}

    \section{Alpha}

    \begin{exercise}
    abc
    \tcblower
    def
    \end{exercise}

    \end{document}
  `);

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(`
    ---
    theorems:
      exercise:
        style: definition
        framed: true
        unnumbered: true
        hideable: clicktoshow
        heading: Exercise
        lowerTitle: Solution
        numberWithin: h2
    ---

    ## Alpha

    ::::exercise
    abc

    ***

    :::solution
    def
    :::
    ::::
  `);

  expect(markdown).toBe(expectedMarkdown);
  // return;

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(`
    <h2 id="alpha"><span class="count">1</span> Alpha</h2>
    <div class="theorem exercise style-definition framed hideable-clicktoshow">
      <p><span class="title"><strong>Exercise.</strong></span> abc</p>
      <hr />
      <p><button class="clicktoshow">Show Solution</button></p>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});

test('newexsol emptybox', async () => {
  const latex = unindentStringAndTrim(String.raw`
    \documentclass{article}

    \usepackage{lipsum}
    \usepackage[most]{tcolorbox}
    \usepackage{ifthen}

    \NewDocumentCommand{\newexsol}{sO{show}mmmmO{}}{%
      \NewTColorBox[auto counter,#6]{#3}{}{%
        enhanced,
        breakable,
        coltitle=black,
        fonttitle=\bfseries,
        title={\IfBooleanTF{#1}{#4}{#4~\thetcbcounter}},
        attach title to upper=\quad,
        before lower={\textbf{\IfBooleanTF{#1}{#5}{#5~\thetcbcounter}\quad}},%
        #7
      }

      \IfValueT{#2}{
        \ifthenelse{\equal{#2}{hide}}{
          \tcbset{lowerbox=ignored}
        }{}
        \ifthenelse{\equal{#2}{emptybox}}{
          \tcbset{lowerbox=invisible}
        }{}
      }
    }

    \theoremstyle{definition}
    % show, hide or emptybox
    \newexsol[emptybox]{exercise}{Exercise}{Solution}{number within=section}[
      colback={white!80!yellow},
      colframe=red,
    ]

    \begin{document}

    \section{Alpha}

    \begin{exercise}
    abc
    \tcblower
    def
    \end{exercise}

    \end{document}
  `);

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(`
    ---
    theorems:
      exercise:
        style: definition
        framed: true
        hideable: hide
        heading: Exercise
        lowerTitle: Solution
        numberWithin: h2
    ---

    ## Alpha

    :::exercise
    abc
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);
  // return;

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(`
    <h2 id="alpha"><span class="count">1</span> Alpha</h2>
    <div class="theorem exercise style-definition framed hideable-hide">
      <p><span class="title"><strong>Exercise 1.1.</strong></span> abc</p>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});

test('newexsol with label', async () => {
  const latex = unindentStringAndTrim(String.raw`
    \documentclass{article}

    \usepackage{lipsum}
    \usepackage[most]{tcolorbox}
    \usepackage{ifthen}

    \NewDocumentCommand{\newexsol}{sO{show}mmmmO{}}{%
      \NewTColorBox[auto counter,#6]{#3}{}{%
        enhanced,
        breakable,
        coltitle=black,
        fonttitle=\bfseries,
        title={\IfBooleanTF{#1}{#4}{#4~\thetcbcounter}},
        attach title to upper=\quad,
        before lower={\textbf{\IfBooleanTF{#1}{#5}{#5~\thetcbcounter}\quad}},%
        #7
      }

      \IfValueT{#2}{
        \ifthenelse{\equal{#2}{hide}}{
          \tcbset{lowerbox=ignored}
        }{}
        \ifthenelse{\equal{#2}{emptybox}}{
          \tcbset{lowerbox=invisible}
        }{}
      }
    }

    \theoremstyle{definition}
    % show, hide or emptybox
    \newexsol[show]{exercise}{Exercise}{Solution}{number within=section}[
      colback={white!80!yellow},
      colframe=red,
    ]

    \begin{document}

    \section{Alpha}

    \begin{exercise}\label{exr:curl}
    abc
    \tcblower
    def
    \end{exercise}

    \end{document}
  `);

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(`
    ---
    theorems:
      exercise:
        style: definition
        framed: true
        hideable: show
        heading: Exercise
        lowerTitle: Solution
        numberWithin: h2
    ---

    ## Alpha

    ::::exercise{#exr-curl}
    abc

    ***

    :::solution
    def
    :::
    ::::
  `);

  expect(markdown).toBe(expectedMarkdown);
  // return;

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(`
    <h2 id="alpha"><span class="count">1</span> Alpha</h2>
    <div class="theorem exercise style-definition framed hideable-show" id="exr-curl">
      <p><span class="title"><strong>Exercise 1.1.</strong></span> abc</p>
      <hr />
      <p><span class="title"><strong>Solution 1.1.</strong></span> def</p>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});
