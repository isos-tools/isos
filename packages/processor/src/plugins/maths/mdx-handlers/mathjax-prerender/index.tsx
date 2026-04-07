import { useEffect, useMemo, useState } from 'preact/hooks';

import { ArticleState } from '../../../article/mdx-state';
import { WarnSpan } from '../../../warn/mdx-warn';
import { MathsFormat, MathsState } from '../../mdx-state';
import { mmlToSpeech } from './mml-to-speech';
import { mmlToSvg } from './mml-to-svg';
import { texToMml } from './tex-to-mml';

type MathsProps = {
  expr: string;
  className: string;
  maths: MathsState;
  article: ArticleState;
  format: MathsFormat;
  inSidenote?: boolean;
};

export type LayoutOptions = {
  containerWidth?: number;
};

// const layoutOptions: LayoutOptions = {
//   containerWidth: 225,
// };

export function MathJaxPrerender({
  format,
  expr,
  className,
  maths,
  article,
  inSidenote,
}: MathsProps) {
  const [label, setLabel] = useState<string>();
  const [braille, setBraille] = useState<string>();

  const mml = useMemo(() => texToMml(formatLaTeX(expr || '')), [expr]);

  const svg = useMemo(() => {
    if (!mml.error) {
      const containerWidth = inSidenote
        ? article.marginWidth.value
        : article.mainWidth.value;
      return mmlToSvg(mml.mml, maths, {
        containerWidth: format === 'display' ? containerWidth : undefined,
      });
    } else {
      return {
        error: true,
        html: mml.mml,
      };
    }
  }, [
    mml.error,
    mml.mml,
    inSidenote,
    article.marginWidth.value,
    article.mainWidth.value,
    maths.mathsFontName.value,
  ]);

  useEffect(() => {
    (async () => {
      // significant slowdown when updating document on change
      // so disabling in the Tauri app. should be solved when
      // processor is moved to a worker/thread
      if (!isTauri() && !mml.error && mml.mml !== undefined) {
        const speech = await mmlToSpeech(mml.mml, maths);
        setLabel(speech.label);
        setBraille(speech.braille);
        // console.log(speech.braille);
      }
    })();
    return () => {};
  }, [
    mml.error,
    mml.mml,
    maths.brailleLocale.value,
    maths.speechLocale.value,
  ]);

  if (mml.error) {
    return <WarnSpan>{mml.mml}</WarnSpan>;
  }
  if (svg.error) {
    return <WarnSpan>{svg.html}</WarnSpan>;
  }

  const brailleOnly = maths.ariaMode.value === 'braille-only';
  return (
    <code
      className={className}
      aria-label={brailleOnly ? braille : label}
      aria-braillelabel={brailleOnly ? undefined : braille}
      dangerouslySetInnerHTML={{ __html: svg.html }}
    />
  );
}

function formatLaTeX(expr: string) {
  return expr.replace(/\\qedhere/g, '');
}
function isTauri() {
  return !!((globalThis as any) || window).isTauri;
}
