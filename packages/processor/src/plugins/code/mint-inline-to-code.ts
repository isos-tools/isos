import { ElementContent, Parent, Root, Text } from 'hast';
import { visit } from 'unist-util-visit';

export function mintInlineToCode() {
  return (tree: Root) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'span') {
        const className = node.properties?.className || [];
        if (
          Array.isArray(className) &&
          className.includes('macro-mintinline')
        ) {
          const languageParent = node.children[0] as Parent;
          const language = languageParent.children[0] as Text;
          const contentParent = node.children[1] as Parent;
          const content = contentParent.children as ElementContent[];

          Object.assign(node, {
            tagName: 'code',
            children: [
              {
                type: 'text',
                value: `{${language.value}} '`,
              },
              ...content,
              {
                type: 'text',
                value: `'`,
              },
            ],
          });
        }
      }
    });
  };
}
