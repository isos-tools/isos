import { describe, expect, test } from 'vitest';

import { mmlToSpeech } from '../../mml-to-speech';
import { mmlToSvg } from '../../mml-to-svg';
import { texToMml } from '../../tex-to-mml';
import { testSections } from './fixtures';

for (const section of testSections) {
  describe(section.title, () => {
    for (const testCase of section.cases) {
      test(testCase.label, async () => {
        const mml = texToMml(testCase.latex);
        expect(mml.mml).toMatchSnapshot();
        const svg = mmlToSvg(mml.mml);
        expect(svg.html).toMatchSnapshot();
        expect(
          await mmlToSpeech(mml.mml, {
            locale: 'en',
            domain: 'mathspeak',
          }),
        ).toBe(testCase.mathspeak);
        expect(
          await mmlToSpeech(mml.mml, {
            locale: 'en',
            domain: 'clearspeak',
          }),
        ).toBe(testCase.clearspeak);
      });
    }
  });
}
