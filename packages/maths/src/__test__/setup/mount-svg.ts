import { page } from 'vitest/browser';

const testId = 'svg-target';

export function mountSvg(svg: string) {
  const host = document.createElement('div');
  host.dataset.testid = 'svg-target';
  host.style.display = 'inline-block';
  host.style.padding = '5px';
  host.innerHTML = svg;
  document.body.innerHTML = host.outerHTML;
  return page.getByTestId(testId);
}
