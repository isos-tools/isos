import { Context } from '../../input-to-markdown/context';

export function createHeadingDepths(
  documentClass?: string,
  hasPart?: boolean,
): Context['sectionToHeading'] {
  if (['report', 'book'].includes(documentClass || '')) {
    if (hasPart) {
      return {
        title: 'h1',
        part: 'h2',
        chapter: 'h3',
        section: 'h4',
        subsection: 'h5',
        subsubsection: 'h6',
        paragraph: 'h6',
        subparagraph: 'h6',
      };
    } else {
      return {
        title: 'h1',
        chapter: 'h2',
        section: 'h3',
        subsection: 'h4',
        subsubsection: 'h5',
        paragraph: 'h6',
        subparagraph: 'h6',
      };
    }
  } else {
    return {
      title: 'h1',
      section: 'h2',
      subsection: 'h3',
      subsubsection: 'h4',
      paragraph: 'h5',
      subparagraph: 'h6',
    };
  }
}
