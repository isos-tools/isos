export type Note = {
  name: string;
  macros: string[];
  definition: string;
  label: string;
  labelPlural: string;
  prefix: string;
};

export const noteConfig: Note[] = [
  {
    name: 'footnote',
    macros: ['footnote'],
    definition: 'footnotecontent',
    label: 'Footnote',
    labelPlural: 'Footnotes',
    prefix: 'fn',
  },
  {
    name: 'sidenote',
    macros: ['sidenote', 'marginnote', 'framedsidenote'],
    definition: 'sidenotecontent',
    label: 'Sidenote',
    labelPlural: 'Sidenotes',
    prefix: 'sn',
  },
  {
    name: 'endnote',
    macros: ['postnote', 'endnote'],
    definition: 'endnotecontent',
    label: 'Note',
    labelPlural: 'Notes',
    prefix: 'en',
  },
];

export const printMacros = ['printendnotes', 'printpostnotes'];

export function configByMacroName(name: string) {
  return noteConfig.find((n) => n.macros.includes(name));
}
