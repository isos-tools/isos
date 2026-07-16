import { styled } from '@linaria/react';
import { Signal } from '@preact/signals';
import classNames from 'classnames';
import { useContext } from 'preact/hooks';

import { MathsState, MathsStateType } from '@isos/processor';

import { actions, rootEl } from '../../constants';
import * as constants from '../../constants';
import { mdxState } from '../../mdx-state';
// import { MathsOptionsContext } from '@isos/processor';
import { Checkbox } from './checkbox';
import { DarkModeToggle } from './dark-mode-toggle';
import { RangeInput } from './range-input';
import { Select } from './select';
import { ViewOptionsContext } from './state';
import { useFullScreenHandle } from './use-fullscreen';

export function ViewOptions() {
  const viewOptions = useContext(ViewOptionsContext);
  // const mathsOptions = useContext(MathsOptionsContext);
  const handle = useFullScreenHandle(rootEl);

  // if (viewOptions.data.showViewOptions.value === false) {
  //   return null;
  // }

  return (
    <ViewOptionsForm
      className={classNames({
        show: viewOptions.data.showViewOptions.value,
      })}>
      <Fieldset>
        <Legend>Theme</Legend>
        <DarkModeToggle
          value={viewOptions.data.theme as Signal<'light' | 'dark'>}
          onChange={viewOptions.setTheme}
        />
        <RangeInput
          {...constants.contrast}
          value={viewOptions.data.contrast as Signal<string>}
          onInput={viewOptions.setContrast}
        />
        <RangeInput
          {...constants.brightness}
          value={viewOptions.data.brightness as Signal<string>}
          onInput={viewOptions.setBrightness}
        />
        {viewOptions.data.theme.value === 'dark' ? (
          <Select
            name="textColor"
            label="Text Colour"
            value={viewOptions.data.textColor as Signal<string>}
            options={constants.colourOptions}
            onChange={viewOptions.setTextColor}
          />
        ) : (
          <Select
            name="bgColor"
            label="Background"
            value={viewOptions.data.bgColor as Signal<string>}
            options={constants.colourOptions}
            onChange={viewOptions.setBgColor}
          />
        )}
      </Fieldset>
      <Fieldset>
        <Legend>Readability</Legend>
        {handle.active ? (
          <Checkbox
            label="Exit full screen"
            value={true}
            onChange={() => handle.exit()}
          />
        ) : (
          <Checkbox
            label="Enter full screen"
            value={false}
            onChange={() => handle.enter()}
          />
        )}

        <RangeInput
          {...constants.fontSize}
          value={viewOptions.data.fontSize}
          onInput={viewOptions.setFontSize}
        />
        <RangeInput
          {...constants.lineHeight}
          value={viewOptions.data.lineHeight}
          onInput={viewOptions.setLineHeight}
        />
        <RangeInput
          {...constants.letterSpacing}
          value={viewOptions.data.letterSpacing}
          onInput={viewOptions.setLetterSpacing}
        />
        <RangeInput
          {...constants.lineWidth}
          value={viewOptions.data.lineWidth}
          onInput={viewOptions.setLineWidth}
        />
      </Fieldset>
      <Fieldset>
        <Legend>Maths</Legend>
        <Select
          name="mathsRendering"
          label="Rendering"
          value={
            mdxState.maths.mathsRendering as MathsState['mathsRendering']
          }
          options={['svg', 'mathml', 'latex-code', 'mathml-code']}
          onChange={(val: string) => {
            mdxState.maths.mathsRendering.value =
              val as MathsStateType['mathsRendering'];
          }}
        />

        {mdxState.maths.mathsRendering.value === 'svg' && (
          <Checkbox
            label="Sans-serif font"
            value={mdxState.maths.mathsFontName.value === 'fira'}
            onChange={(sansSerif) => {
              mdxState.maths.mathsFontName.value = sansSerif
                ? 'fira'
                : 'computerModern';
            }}
          />
        )}

        {['latex-code', 'mathml-code'].includes(
          mdxState.maths.mathsRendering.value,
        ) && (
          <Checkbox
            label="Syntax highlighting"
            value={mdxState.maths.syntaxHighlight.value}
            onChange={(on) => {
              mdxState.maths.syntaxHighlight.value = on;
            }}
          />
        )}
        {/* <Checkbox
          label="Set Aria label to braille"
          value={mdxState.maths.ariaMode.value === 'braille-only'}
          onChange={(brailleOnly) => {
            mdxState.maths.ariaMode.value = brailleOnly
              ? 'braille-only'
              : 'both';
          }}
        />
        <Select
          name="bgColor"
          label="Braille locale"
          value={
            mdxState.maths.brailleLocale as MathsState['brailleLocale']
          }
          options={['nemeth', 'euro']}
          onChange={(val: string) => {
            mdxState.maths.brailleLocale.value =
              val as MathsStateType['brailleLocale'];
          }}
        /> */}
      </Fieldset>
    </ViewOptionsForm>
  );
}

const ViewOptionsForm = styled.form`
  display: none;
  &.show {
    display: block;
  }
`;

const Fieldset = styled.fieldset`
  padding: 0 ${actions.x};
  border: 0;
  margin-bottom: 2em;
`;

const Legend = styled.legend`
  padding: 0 0 0.5em 0;
  font-size: 1.2em;
  font-weight: 700;
`;
