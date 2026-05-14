import { expect, test } from 'vitest';

import { mmlToBraille, mmlToSpeech, mmlToSvg, texToMml } from '..';
import { mountSvg } from './setup/mount-svg';

test('a-plus-b', async ({ task }) => {
  const latex = String.raw`a + b`;

  const { mml } = texToMml(latex);
  // console.log(mml);

  const { html } = mmlToSvg(mml);
  const target = mountSvg(html);
  await expect.element(target).toMatchScreenshot(task.name);

  expect(await mmlToSpeech(mml)).toBe('a plus b');
  expect(await mmlToBraille(mml)).toBe('⠁⠬⠃');
});

test('a-plus-b-fira', async ({ task }) => {
  const latex = String.raw`a + b`;

  const { mml } = texToMml(latex);
  // console.log(mml);

  const { html } = mmlToSvg(mml, { font: 'fira' });
  const target = mountSvg(html);
  await expect.element(target).toMatchScreenshot(task.name);

  expect(await mmlToSpeech(mml)).toBe('a plus b');
  expect(await mmlToBraille(mml)).toBe('⠁⠬⠃');
});
