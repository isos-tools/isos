import { RunOptions } from '@mdx-js/mdx';
import classNames from 'classnames';
import { VNode } from 'preact';
import { Fragment, jsx, jsxDEV, jsxs } from 'preact/jsx-runtime';

import { Article } from '../../plugins/article/article';
import { CalloutIcon } from '../../plugins/callout/mdx-callout-icon';
// import { Authors } from '../../plugins/cover/mdx-authors';
import { OrcidLink } from '../../plugins/cover/orcid-link';
import { Maths } from '../../plugins/maths/mdx-handlers/Maths';
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
        // console.log(props);
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

        if (className.includes('math-inline')) {
          return (
            <Maths
              expr={props.children}
              format="inline"
              maths={maths}
              article={article}
            />
          );
        }

        // if (className.startsWith('language')) {
        //   const match = className.match(/language-(\S+)/);
        //   if (match !== null) {
        //     console.log('code:', match[1]);
        //     return <code>{props.children}</code>;
        //   }
        // }

        return <code {...props} />;
      },
      pre(props) {
        let children: VNode[] = [];
        if (Array.isArray(props.children)) {
          children = props.children;
        } else if (props.children?.props) {
          children.push(props.children);
        } else {
          children = [];
        }

        const child = children[0];
        const count = children[1];
        // @ts-expect-error
        const className = String(child.props?.class || '');

        // if (className.startsWith('language')) {
        //   const match = className.match(/language-(\S+)/);
        //   if (match !== null) {
        //     console.log('pre:', match[1]);
        //     return <pre>{children}</pre>;
        //   }
        // }

        if (className.includes('math-display')) {
          const id = props['data-id'];
          const className = classNames('maths', { 'env-equation': count });
          const inSidenote = (props.class || '').includes('in-sidenote');

          if (inSidenote) {
            return (
              <span id={id} className={className}>
                <Maths
                  expr={child.props.children}
                  format="display"
                  maths={maths}
                  article={article}
                  inSidenote={inSidenote}
                />
                {count}
              </span>
            );
          } else {
            return (
              <p id={id} className={className}>
                <Maths
                  expr={child.props.children}
                  format="display"
                  maths={maths}
                  article={article}
                  inSidenote={inSidenote}
                />
                {count}
              </p>
            );
          }
        }

        return <pre {...props} />;
      },
      // ul(props) {
      //   const className = String(props.class || '');
      //   if (className === 'authors') {
      //     return <Authors {...props} />;
      //   } else {
      //     return <ul {...props} />;
      //   }
      // },
      section: Section,
    }),
    jsx,
    jsxs,
    jsxDEV,
  };
}

export function createSidebarRunOptions({
  article,
  maths,
}: MdxState): RunOptions {
  return {
    Fragment,
    jsx,
    jsxs,
    jsxDEV,
    useMDXComponents: () => ({
      li: TocListItem,
      code(props) {
        const className = String(props.class || '');

        if (className.includes('math-inline')) {
          return (
            <Maths
              expr={props.children}
              format="inline"
              maths={maths}
              article={article}
            />
          );
        }

        // if (className.startsWith('language')) {
        //   const match = className.match(/language-(\S+)/);
        //   if (match !== null) {
        //     console.log('code:', match[1]);
        //     return <code>{props.children}</code>;
        //   }
        // }

        return <code {...props} />;
      },
    }),
  };
}
