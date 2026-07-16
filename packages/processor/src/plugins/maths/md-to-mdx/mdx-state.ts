import { Signal, signal } from '@preact/signals';

export type MathsFont = 'fira' | 'computerModern';
export type MathsFormat = 'display' | 'inline';
type MathsAriaMode = 'both' | 'braille-only' | 'speech-only';
export type BrailleLocale = 'nemeth' | 'euro';
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

export type MathsStateType = {
  mathsRendering: 'svg' | 'mathml' | 'latex-code' | 'mathml-code';
  syntaxHighlight: boolean;
  mathsFontName: MathsFont;
  ariaMode: MathsAriaMode;
  brailleLocale: BrailleLocale;
  speechLocale: SpeechLocale;
};

export type MathsState = {
  mathsRendering: Signal<MathsStateType['mathsRendering']>;
  syntaxHighlight: Signal<MathsStateType['syntaxHighlight']>;
  mathsFontName: Signal<MathsStateType['mathsFontName']>;
  ariaMode: Signal<MathsStateType['ariaMode']>;
  brailleLocale: Signal<MathsStateType['brailleLocale']>;
  speechLocale: Signal<MathsStateType['speechLocale']>;
};

export const mathsInitial: MathsStateType = {
  mathsRendering: 'svg',
  syntaxHighlight: true,
  mathsFontName: 'computerModern',
  ariaMode: 'both',
  brailleLocale: 'euro',
  speechLocale: 'en',
};

export function mathsSignalState(initial: MathsStateType): MathsState {
  return {
    mathsRendering: signal(initial.mathsRendering),
    mathsFontName: signal(initial.mathsFontName),
    syntaxHighlight: signal(initial.syntaxHighlight),
    ariaMode: signal(initial.ariaMode),
    brailleLocale: signal(initial.brailleLocale),
    speechLocale: signal(initial.speechLocale),
  };
}
