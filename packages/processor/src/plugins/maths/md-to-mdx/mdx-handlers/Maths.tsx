import { ArticleState } from '../../../article/mdx-state';
import { MathsFormat, MathsState } from '../mdx-state';
import { formatLaTeX, formatMathMl, syntaxHighlight } from './code';
import { MathJaxPrerender } from './mathjax-prerender';

type Props = {
  expr: any;
  latex: string;
  maths: MathsState;
  article: ArticleState;
  inSidenote?: boolean;
  format: MathsFormat;
  asComponents?: boolean;
};

export function Maths({
  expr,
  latex,
  maths,
  article,
  inSidenote,
  format,
  // asComponents = true,
}: Props) {
  // console.log({ expr });
  switch (maths.mathsRendering.value) {
    case 'mathml':
      return (
        <span
          className="mathml"
          dangerouslySetInnerHTML={{ __html: expr }}
        />
      );
    case 'latex-code': {
      const formatted = formatLaTeX(latex);
      if (maths.syntaxHighlight.value) {
        return (
          <CodeElement
            className="latex"
            html={syntaxHighlight(formatted, 'latex')}
          />
        );
      } else {
        return <CodeElement className="latex" html={formatted} />;
      }
    }
    case 'mathml-code': {
      if (typeof expr !== 'string') {
        return null;
      }

      const formatted = formatMathMl(expr);
      if (maths.syntaxHighlight.value) {
        return (
          <CodeElement
            className="mathml"
            html={syntaxHighlight(formatted, 'markup')}
          />
        );
      } else {
        return <code className="mathml">{formatted}</code>;
      }
    }
  }

  // if (asComponents) {
  //   return (
  //     <MathJaxComponentsDisplay
  //       expr={expr}
  //       // format={format}
  //       mathsFont={maths.mathsFontName.value}
  //     />
  //   );
  // }

  return (
    <MathJaxPrerender
      className="maths"
      // labels={labels}
      format={format}
      expr={expr}
      maths={maths}
      article={article}
      inSidenote={inSidenote}
    />
  );
}

type MathsProps = {
  className: string;
  html: string;
};

function CodeElement({ className, html }: MathsProps) {
  return (
    <code
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
