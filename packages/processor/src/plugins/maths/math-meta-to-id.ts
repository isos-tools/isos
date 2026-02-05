// @ts-expect-error
import parseAttr from 'md-attr-parser';
import { Root } from 'mdast';
import { visit } from 'unist-util-visit';

export function mathMetaToId() {
  return (tree: Root) => {
    // console.log('mathMetaToId');
    // console.dir(tree, { depth: null });
    visit(tree, 'math', (node) => {
      const meta = node.meta;

      if (meta) {
        const attr = parseAttr(meta).prop;

        if (attr) {
          const properties = {
            'data-id': attr.id,
          };

          node.data = {
            ...(node.data || {}),
            hProperties: {
              ...(node.data?.hProperties || {}),
              ...properties,
            },
          };
        }
      }
    });
  };
}
