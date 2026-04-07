import { ArticleState } from '../../article/mdx-state';
import { MathsFormat, MathsState } from '../mdx-state';
import { formatLaTeX, syntaxHighlight } from './latex';
import { MathJaxPrerender } from './mathjax-prerender';

type Props = {
  expr: any;
  maths: MathsState;
  article: ArticleState;
  inSidenote?: boolean;
  format: MathsFormat;
  asComponents?: boolean;
};

export function Maths({
  expr,
  maths,
  article,
  inSidenote,
  format,
  // asComponents = true,
}: Props) {
  if (maths.mathsAsTex.value) {
    // console.log({ expr });
    if (typeof expr !== 'string') {
      return null;
    }

    const formatted = formatLaTeX(expr);
    if (maths.syntaxHighlight.value) {
      return (
        <CodeElement className="latex" html={syntaxHighlight(formatted)} />
      );
    } else {
      return <CodeElement className="latex" html={formatted} />;
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
