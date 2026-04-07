// @ts-expect-error
import Session from 'svg-text-to-path';
// @ts-expect-error
import ConfigProvider from 'svg-text-to-path/providers/config/ConfigProvider.js';
// @ts-expect-error
import OpenTypeJsFont from 'svg-text-to-path/renderer/OpenTypeJsFont.js';
// @ts-expect-error
import { shims } from 'svg-text-to-path/src/shims/index.js';

import { getShims } from './shims';

Object.assign(shims, await getShims(), {
  getBufferFromSource: (alreadyBuf: ArrayBuffer) => alreadyBuf,
});

Session.defaultRenderer = OpenTypeJsFont;
Session.defaultProviders = [ConfigProvider];

type Props = {
  svg: string;
  fonts: Record<string, ArrayBuffer>;
};

type Font = {
  source: ArrayBuffer;
};

type Fonts = Record<string, Font[]>;

export async function outlineFonts({
  svg,
  fonts,
}: Props): Promise<string> {
  if (Object.keys(fonts).length === 0) {
    return svg;
  }

  const session = new Session(svg, {
    fonts: Object.entries(fonts).reduce((acc: Fonts, [id, source]) => {
      acc[id] = [{ source }];
      return acc;
    }, {}),
  });

  // @ts-expect-error
  const stats = await session.replaceAll();
  // console.log(stats)

  return session.getSvgString();
}
