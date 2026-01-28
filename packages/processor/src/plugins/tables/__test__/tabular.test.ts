import { expect, test } from 'vitest';

import { testProcessor, unindentStringAndTrim } from '@isos/test-utils';

test('tabular', async () => {
  const latex = String.raw`
    \begin{tabular}{lcr}
    Beep & Pharetra & Commodo Pellentesque \\
    beep & 1024 & xyz \\
    \end{tabular}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(`
    | Beep | Pharetra | Commodo Pellentesque |
    | :--- | :------: | -------------------: |
    | beep |   1024   |                  xyz |
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(expectedMarkdown);
  // console.log(html);

  const expected = unindentStringAndTrim(`
    <table>
      <thead>
        <tr>
          <th style="text-align:left;">Beep</th>
          <th style="text-align:center;">Pharetra</th>
          <th style="text-align:right;">Commodo Pellentesque</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="text-align:left;">beep</td>
          <td style="text-align:center;">1024</td>
          <td style="text-align:right;">xyz</td>
        </tr>
      </tbody>
    </table>
  `);

  expect(html).toBe(expected);
});

test('table with unsupported formatting', async () => {
  const latex = String.raw`
    \begin{tabular}{ | m{4em} | m{3cm}| m{3cm} | }
      \hline
      Area & Number of dogs inspected & Number of dogs with a flea infestation \\
      \hline
      Urban Clinic & 213 & 30 \\
      \hline
      Rural Clinic & 156 & 43 \\
      \hline
    \end{tabular}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(`
    | Area         | Number of dogs inspected | Number of dogs with a flea infestation |
    | ------------ | ------------------------ | -------------------------------------- |
    | Urban Clinic | 213                      | 30                                     |
    | Rural Clinic | 156                      | 43                                     |
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(expectedMarkdown);
  // console.log(html);

  const expected = unindentStringAndTrim(`
    <table>
      <thead>
        <tr>
          <th>Area</th>
          <th>Number of dogs inspected</th>
          <th>Number of dogs with a flea infestation</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Urban Clinic</td>
          <td>213</td>
          <td>30</td>
        </tr>
        <tr>
          <td>Rural Clinic</td>
          <td>156</td>
          <td>43</td>
        </tr>
      </tbody>
    </table>
  `);

  expect(html).toBe(expected);
});

test('tabularx', async () => {
  const latex = String.raw`
    \begin{tabularx}{\textwidth}{|c|X|X|}
    Beep & Pharetra & Commodo Pellentesque \\
    beep & 1024 & xyz \\
    \end{tabularx}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(`
    | Beep | Pharetra | Commodo Pellentesque |
    | :--: | -------- | -------------------- |
    | beep | 1024     | xyz                  |
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(expectedMarkdown);
  // console.log(html);

  const expected = unindentStringAndTrim(`
    <table>
      <thead>
        <tr>
          <th style="text-align:center;">Beep</th>
          <th>Pharetra</th>
          <th>Commodo Pellentesque</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="text-align:center;">beep</td>
          <td>1024</td>
          <td>xyz</td>
        </tr>
      </tbody>
    </table>
  `);

  expect(html).toBe(expected);
});
