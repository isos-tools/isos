import { Element } from 'hast';

export function createWarn(type: string, name: string): Element {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`unhandled ${type}:`, name);
  }
  return {
    type: 'element',
    tagName: 'span',
    properties: {
      className: ['warn'],
    },
    children: [
      {
        type: 'element',
        tagName: 'strong',
        properties: {},
        children: [
          {
            type: 'text',
            value: `unhandled ${type}: ${name}`,
          },
        ],
      },
      // {
      //   type: 'text',
      //   value: ' ',
      // },
      // {
      //   type: 'inlineCode',
      //   value: toString(toMdast(node)),
      // },
    ],
  };
}
