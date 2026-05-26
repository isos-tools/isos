import { expect, test } from 'vitest';

import { testProcessor, unindentStringAndTrim } from '@isos/test-utils';

test('newframedtheorem', async () => {
  const latex = unindentStringAndTrim(String.raw`
    \documentclass{report}
    \usepackage{amsthm}
    \usepackage[most]{tcolorbox}

    \NewDocumentCommand{\newframedtheorem}{O{}momo}{%
      \IfNoValueTF{#3}
      {%
        \IfNoValueTF{#5}
        {\newtheorem{#2}{#4}}
        {\newtheorem{#2}{#4}[#5]}%
        }
      {\newtheorem{#2}[#3]{#4}}
      \tcolorboxenvironment{#2}{#1}%
    }

    \theoremstyle{definition}
    \newframedtheorem[
      colback=white!80!yellow,
      colframe=blue!50!black,
    ]{exercise}{Example}[chapter]

    \begin{document}

    \begin{exercise}
    Hello
    \end{exercise}

    \end{document}
  `);

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(`
    ---
    documentClass: report
    theorems:
      exercise:
        style: definition
        heading: Example
        numberWithin: h2
        framed: true
    ---

    :::exercise
    Hello
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(`
    <div class="theorem exercise style-definition framed">
      <p><span class="title"><strong>Example 0.1.</strong></span> Hello</p>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});
