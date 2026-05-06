import {
  Root as LatexAstRoot,
  Macro,
  Node,
} from '@unified-latex/unified-latex-types';
import { toString as latexAstToString } from '@unified-latex/unified-latex-util-to-string';
import kebabCase from 'lodash.kebabcase';
import { BlockContent, DefinitionContent, Paragraph, Root } from 'mdast';
import { ContainerDirective } from 'mdast-util-directive';
import { toString } from 'mdast-util-to-string';
import rehypeRemark from 'rehype-remark';
import { unified } from 'unified';
import { BuildVisitor, visit } from 'unist-util-visit';

import { unifiedLatexToHast } from '@isos/unified-latex-to-hast';

import { Context } from '../../../input-to-markdown/context';
import { createHastTransforms } from '../../../input-to-markdown/hast-transforms';
import { createRehypeRemarkHandlers } from '../../../input-to-markdown/rehyperemark-handlers';
import { createRemarkProcessor } from '../../../remark-processor';
import { noteConfig } from '../config';

export function noteContentBelowMark(ctx: Context) {
  return (tree: Root) => {
    // console.dir(tree, { depth: null });
    visit(tree, 'paragraph', paragraph(ctx), true);
  };
}

function paragraph(ctx: Context): BuildVisitor<Root, 'paragraph'> {
  const macroNames = noteConfig.flatMap((o) => o.macros);
  // console.log(macroNames);

  return (p, idx = 0, parent) => {
    const notes: ContainerDirective[] = [];

    visit(p, 'textDirective', (node) => {
      if (macroNames.includes(node.name)) {
        const mark = toString(node);
        const config = noteConfig.find((o) => o.name === node.name);

        if (mark && ctx.notes[mark] && config) {
          const content = ctx.notes[mark];

          const attributes: Record<string, string> = {};

          const label = extractLabel(content);
          if (label) {
            attributes.id = kebabCase(label);
          }

          const container: ContainerDirective = {
            type: 'containerDirective',
            name: config.definition,
            attributes,
            children: [
              createDirectiveLabel(mark),
              ...noteToMdAst(content, ctx),
            ],
          };

          // node.name = config.name;
          notes.push(container);
        }
      }
    });

    if (parent) {
      parent.children.splice(idx + 1, 0, ...notes);
    }
  };
}

function extractLabel(nodes: Node[]) {
  const idx = nodes.findIndex(
    (o) => o.type === 'macro' && o.content === 'label',
  );
  if (idx > -1) {
    const label = nodes[idx] as Macro;
    const args = label.args || [];
    const lastArg = args[args.length - 1];
    if (lastArg) {
      nodes.splice(idx, 1);
      return latexAstToString(lastArg.content);
    }
  }
  return null;
}

function createDirectiveLabel(mark: string): Paragraph {
  return {
    type: 'paragraph',
    data: { directiveLabel: true },
    children: [{ type: 'text', value: mark }],
  };
}

function noteToMdAst(nodes: Node[], ctx: Context) {
  // console.log(nodes);

  // const latexAst: LatexAstRoot = {
  //   type: 'root',
  //   content: nodes,
  // };
  // const htmlAst = toHtml(latexAst, ctx)
  // const mdAst = toMd(htmlAst, ctx)

  const root: LatexAstRoot = {
    type: 'root',
    content: nodes,
  };
  const hastTransforms = createHastTransforms(ctx);
  const htmlAst = unified()
    .use([unifiedLatexToHast, ...hastTransforms])
    .runSync(root);
  const handlers = createRehypeRemarkHandlers(ctx);
  const processor = createRemarkProcessor([[rehypeRemark, { handlers }]]);
  const mdAst = processor.runSync(htmlAst) as Root;

  // console.dir(mdAst, { depth: null });

  return mdAst.children as (BlockContent | DefinitionContent)[];
}
