import { describe, expect, test } from 'vitest';

import { mmlToSvg, texToMml } from '../..';
import { mountSvg } from '../../__test__/setup/mount-svg';
import { testSections } from './fixtures';

for (const section of testSections) {
  describe(section.title, () => {
    for (const testCase of section.cases) {
      test(testCase.label, async ({ task }) => {
        const { mml } = texToMml(testCase.latex);
        const { html } = mmlToSvg(mml);
        const target = mountSvg(html);
        await expect.element(target).toMatchScreenshot(task.name);
      });
    }
  });
}
