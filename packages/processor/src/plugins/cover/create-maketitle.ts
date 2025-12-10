import { ContainerDirective } from 'mdast-util-directive';

export function createMakeTitle(): ContainerDirective {
  return {
    type: 'containerDirective',
    name: 'make-title',
    children: [],
  };
}
