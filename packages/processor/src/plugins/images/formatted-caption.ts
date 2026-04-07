// @ts-expect-error
import parseAttr from 'md-attr-parser';

export function altToCaptionAttribute(markdown: string) {
  // console.log('md regex: altToCaptionAttribute');
  // console.log(markdown);

  const regex = /!\[(.*?)\]\((.+?)\)({(.*?)})?/g;

  return markdown.replace(regex, (...match) => {
    const caption = match[1];
    const url = match[2];
    const attrs = parseAttr(match[4] || '').prop;
    const attributes = serialiseAttributes({ ...attrs, caption });
    let result = `![](${url})`;
    if (attributes) {
      result += `\`${attributes}\``;
    }
    return result;
  });
}

export function captionAttributeToAlt(markdown: string) {
  // console.log('md regex: captionAttributeToAlt');
  // console.log(markdown);

  const regex = /!\[(.*?)\]\((.+?)\)`(.*?)`/g;

  return markdown.replace(regex, (...match) => {
    const url = match[2];
    const { caption, ...attrs } = parseAttr(match[3]).prop;
    const attributes = serialiseAttributes(attrs);
    return `![${caption || ''}](${url})${attributes}`;
  });
}

// function extractId(rest: string) {
//   const match = rest.match(/:label\[(.+)\]/);
//   return match === null ? null : match[1];
// }

export function serialiseAttributes(attributes: Record<string, string>) {
  const properties = Object.entries(attributes)
    .reduce((acc, [k, v]) => {
      if (!v) {
        return acc;
      }
      if (['id', 'class'].includes(k)) {
        return getAttribute(k, v) + acc;
      }
      return acc + getAttribute(k, v);
    }, '')
    .trim();

  return properties.length ? `{${properties}}` : '';
}

function getAttribute(key: string, value: string) {
  switch (key) {
    case 'id':
      return `#${value} `;
    case 'class':
      return `.${value} `;
    default:
      return `${key}="${value}" `;
  }
}
