// import { createElement } from 'preact';
import { useMemo } from 'preact/hooks';

import { mmlToSvg, render } from '@isos/maths';

import { ArticleState } from '../../../../article/mdx-state';
import { WarnSpan } from '../../../../warn/mdx-warn';
import { MathsFormat, MathsState } from '../../mdx-state';

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
  // const [label, setLabel] = useState<string>();
  // const [braille, setBraille] = useState<string>();

  // console.log('expr:', expr);

  // const mml = useMemo(() => {
  //   const latex = formatLaTeX(expr || '');
  //   const refs = JSON.parse(labels || '[]') as Label[];
  //   const mml = texToMml(latex, refs);
  //   return mml;
  // }, [expr, labels]);

  const svg = useMemo(() => {
    // if (!mml.error) {
    const containerWidth = inSidenote
      ? article.marginWidth.value
      : article.mainWidth.value;
    // console.log({ containerWidth });
    return mmlToSvg(expr, {
      font: maths.mathsFontName.value,
      display: format === 'display' ? true : false,
      width: format === 'display' ? containerWidth : undefined,
    });
    // } else {
    //   return {
    //     error: true,
    //     html: mml.mml,
    //   };
    // }
  }, [
    expr,
    inSidenote,
    article.marginWidth.value,
    article.mainWidth.value,
    maths.mathsFontName.value,
  ]);

  // console.log('svg:', svg.html);

  // useEffect(() => {
  //   (async () => {
  //     // significant slowdown when updating document on change
  //     // so disabling in the Tauri app. should be solved when
  //     // processor is moved to a worker/thread
  //     if (!isTauri()) {
  //       let label;
  //       let braille;

  //       if (maths.ariaMode.value !== 'braille-only') {
  //         label = await mmlToSpeech(expr, {
  //           locale: maths.speechLocale.value,
  //           domain: 'clearspeak',
  //         });
  //       }

  //       if (maths.ariaMode.value !== 'speech-only') {
  //         braille = await mmlToBraille(expr, {
  //           locale: maths.brailleLocale.value,
  //         });
  //       }
  //       setLabel(label);
  //       setBraille(braille);
  //     }
  //   })();
  //   return () => {};
  // }, [expr, maths.brailleLocale.value, maths.speechLocale.value]);

  // if (mml.error) {
  //   return (
  //     <WarnSpan>
  //       <strong>{mml.mml}</strong>
  //     </WarnSpan>
  //   );
  // }
  if (svg.error) {
    return (
      <WarnSpan>
        <strong>{svg.html}</strong>
      </WarnSpan>
    );
  }

  return <>{render([svg.html])}</>;

  // const brailleOnly = maths.ariaMode.value === 'braille-only';
  return (
    <code
      className={className}
      // aria-label={brailleOnly ? braille : label}
      // aria-braillelabel={brailleOnly ? undefined : braille}
      dangerouslySetInnerHTML={{ __html: svg.html }}
    />
  );
}

// function formatLaTeX(expr: string) {
//   return expr.replace(/\\qedhere/g, '');
// }

// function isTauri() {
//   return !!((globalThis as any) || window).isTauri;
// }
