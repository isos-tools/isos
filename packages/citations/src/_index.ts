// @ts-expect-error
import { Cite, plugins } from '@citation-js/core'
import '@citation-js/plugin-bibtex'
import '@citation-js/plugin-doi'
import '@citation-js/plugin-csl'

import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';
import type { ElementContent } from 'hast';

import enGB from '../bibtex/en-GB.xml?raw'

const defaultTemplateName = 'apa'
const defaultLocaleName = 'en-GB'

const config = plugins.config.get('@csl')
config.locales.add(defaultLocaleName, enGB)

// console.log(plugins)

type Options = {
  localeName?: string,
  locale?: string,
  templateName?: string,
  template?: string
}

type CitationItem = {
  citation: string;
  bibliography: string;
}

const processor = unified().use(rehypeParse).use(rehypeStringify);

export function getStyledCitations(bibTex: string, opts: Options = {}) {
  const cite = new Cite(bibTex)
  const templateName = opts.templateName || defaultTemplateName
  const localeName = opts.localeName || defaultLocaleName

  if (opts.locale) {
    config.locales.add(localeName, opts.locale)
  }
  if (opts.template) {
    config.templates.add(templateName, opts.template)
  }

  const ids: string[] = cite.getIds()

  return ids.reduce((acc: Record<string, CitationItem>, id) => {
    const citation = cite.format('citation', {
      entry: id,
      template: templateName,
      lang: localeName
    }).replace(/^\((.+)\)$/, '$1')

    const html = cite.format('bibliography', {
      entry: id,
      format: 'html',
      template: templateName,
      lang: localeName
    })
    const parsed = processor.parse(html);
    const children: ElementContent[] = [];

    visit(parsed, 'element', (node) => {
      const className = String(node.properties.className || '')
      if (node.tagName === 'div' && className === 'csl-entry') {
        children.push(...node.children);
      }
      if (node.tagName === 'i') {
        node.tagName = 'em'
      }
    });

    const bibliography = processor
      .stringify({ type: 'root', children })
      .replace(/\\/g, '');

    acc[id] = { citation, bibliography }
    return acc
  }, {})
}
