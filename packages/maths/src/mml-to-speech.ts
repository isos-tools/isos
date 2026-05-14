// @ts-expect-error
import { engineReady, setupEngine, toSpeech } from 'speech-rule-engine';

import { clearspeakFix } from './siunitx/clearspeak-fix';

export type SpeechLocale =
  | 'af'
  | 'ca'
  | 'da'
  | 'de'
  | 'en'
  | 'es'
  | 'fr'
  | 'hi'
  | 'it'
  | 'ko'
  | 'nb'
  | 'nn'
  | 'sv';

export type SpeechDomain = 'clearspeak' | 'mathspeak';

export type SpeechOptions = {
  locale: SpeechLocale;
  domain: SpeechDomain;
};

const speechOptions: SpeechOptions = {
  locale: 'en',
  domain: 'clearspeak',
};

export async function mmlToSpeech(
  mml: string,
  options: Partial<SpeechOptions> = {},
) {
  await setupEngine({ ...speechOptions, ...options, modality: 'speech' });
  await engineReady();
  return toSpeech(clearspeakFix(mml));
}

export type BrailleLocale = 'nemeth' | 'euro';

export type BrailleOptions = {
  locale: BrailleLocale;
};

const brailleOptions: BrailleOptions = {
  locale: 'nemeth',
};

export async function mmlToBraille(
  mml: string,
  options: Partial<BrailleOptions> = {},
) {
  await setupEngine({
    ...brailleOptions,
    ...options,
    modality: 'braille',
  });
  await engineReady();
  return toSpeech(mml);
}
