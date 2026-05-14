import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { mmlToSpeech } from '../../mml-to-speech';
import { mmlToSvg } from '../../mml-to-svg';
import { texToMml } from '../../tex-to-mml';
import { testSections } from './fixtures';

async function createReport() {
  const tableRows: string[] = [];

  for (const section of testSections) {
    const bodyRows: string[] = [];

    for (const { label, latex } of section.cases) {
      const mml = texToMml(latex);
      bodyRows.push(`
        <tr>
          <th>${label}</th>
          <td class="latex"><pre>${latex}</pre></td>
          <td class="svgcell">${mmlToSvg(mml.mml)}</td>
          <td class="mathspeak">${await mmlToSpeech(mml.mml, { locale: 'en', domain: 'mathspeak' })}</td>
          <td class="clearspeak">${await mmlToSpeech(mml.mml, { locale: 'en', domain: 'clearspeak' })}</td>
        </tr>
      `);
    }

    tableRows.push(`
      <h2>${section.title}</h2>
      <table>
        <thead>
          <tr>
            <th>Label</th>
            <th>LaTeX</th>
            <th>SVG</th>
            <th>Mathspeak</th>
            <th>Clearspeak</th>
          </tr>
        </thead>
        <tbody>
          ${bodyRows.join('')}
        </tbody>
      </table>
    `);
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8"/>
      <title>siunitx-pcc — Node.js report</title>
      <style>
        .container {
          margin: 0 2rem;
        }
        table {
          border: 1px solid;
          border-collapse: collapse;
          width: 100%;
        }
        table th,
        table td {
          border: 1px solid;
        }
        .latex pre {
          white-space: pre-wrap;
          word-break: break-word;
        }
        .svgcell svg {
          display: block;
        }
        g[data-mml-node="merror"] > g {
          fill: red;
          stroke: red;
        }
        g[data-mml-node="merror"] > rect[data-background] {
          fill: yellow;
          stroke: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>siunitx (MathJax Node)</h1>
        ${tableRows.join('\n')}
      </div>
    </body>
    </html>
  `;
}

createReport().then((reportHtml) => {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const reportPath = join(__dirname, 'report.html');
  writeFileSync(reportPath, reportHtml, 'utf8');
  console.log(`\nWrote ${reportPath}`);
});
