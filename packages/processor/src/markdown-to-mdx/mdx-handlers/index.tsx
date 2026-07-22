import { RunOptions } from '@mdx-js/mdx';
import { Fragment, jsx, jsxDEV, jsxs } from 'preact/jsx-runtime';

import { Article } from '../../plugins/article/article';
import { CalloutIcon } from '../../plugins/callout/mdx-callout-icon';
import { OrcidLink } from '../../plugins/cover/orcid-link';
import { Maths } from '../../plugins/maths/md-to-mdx/mdx-handlers/Maths';
import { ClickToShowTheorem } from '../../plugins/theorems-proofs/md-to-mdx/mdx-handlers';
import { WarnSpan } from '../../plugins/warn/mdx-warn';
import { Options } from '../options';
import { MdxState } from './mdx-state';
import { Task } from './task/mdx-task';
import { Section } from './toc-highlight/section';
import { TocListItem } from './toc-highlight/toc-list-item';

export function createRunOptions(
  { article, maths }: MdxState,
  { noIcons }: Pick<Options, 'noIcons'>,
): RunOptions {
  return {
    Fragment,
    useMDXComponents: () => ({
      article(props) {
        return <Article state={article} {...props} />;
      },
      a(props) {
        const href = String(props?.href || '');
        const className = String(props?.class || '');
        if (className === 'orcid') {
          return <OrcidLink {...props} />;
        } else if (href.startsWith('#')) {
          return <a {...props} />;
        } else {
          // this is to ensure external links open in the
          // default browser and not the tauri app window
          return <a {...props} target="_blank" />;
        }
      },
      span(props) {
        const className = String(props.class || '');
        if (!noIcons && className.includes('callout-icon')) {
          return <CalloutIcon {...props} />;
        } else if (className.startsWith('warn')) {
          return <WarnSpan {...props} />;
        } else {
          return <span {...props} />;
        }
      },
      div(props) {
        const className = String(props.class || '');
        if (className.includes('task')) {
          return <Task {...props} />;
        } else if (className.includes('exsol-solution')) {
          return <ClickToShowTheorem {...props} />;
        } else {
          return <div {...props} />;
        }
      },
      code(props) {
        const className = String(props.class || '');
        if (className.includes('mathml')) {
          return (
            <Maths
              expr={props.children}
              latex={props['data-latex']}
              format="inline"
              maths={maths}
              article={article}
            />
          );
        }
        return <code {...props} />;
      },
      p(props) {
        const className = String(props.class || '');
        if (className.includes('maths')) {
          const childCodeElem = props.children;
          if (className.includes('in-sidenote')) {
            return (
              <span className="maths">
                <Maths
                  expr={childCodeElem.props.children}
                  latex={childCodeElem.props['data-latex']}
                  format="display"
                  maths={maths}
                  article={article}
                />
              </span>
            );
          } else {
            return (
              <p className="maths">
                <Maths
                  expr={childCodeElem.props.children}
                  latex={childCodeElem.props['data-latex']}
                  format="display"
                  maths={maths}
                  article={article}
                />
              </p>
            );
          }
        }
        return <p {...props} />;
      },
      section: Section,
    }),
    jsx,
    jsxs,
    jsxDEV,
  };
}

export function createSidebarRunOptions(_state: MdxState): RunOptions {
  return {
    Fragment,
    jsx,
    jsxs,
    jsxDEV,
    useMDXComponents: () => ({
      li: TocListItem,
      // code(props) {
      //   const className = String(props.class || '');

      //   // if (className.includes('math-inline')) {
      //   //   return (
      //   //     <Maths
      //   //       expr={props.children}
      //   //       format="inline"
      //   //       maths={maths}
      //   //       article={article}
      //   //     />
      //   //   );
      //   // }

      //   // if (className.startsWith('language')) {
      //   //   const match = className.match(/language-(\S+)/);
      //   //   if (match !== null) {
      //   //     console.log('code:', match[1]);
      //   //     return <code>{props.children}</code>;
      //   //   }
      //   // }

      //   return <code {...props} />;
      // },
    }),
  };
}
