import { Jimp } from 'jimp';

export async function optimiseBitmap(
  img: ArrayBuffer,
  maxSize = 800,
  quality = 75,
) {
  const image = await Jimp.fromBuffer(img);
  // console.log(image.mime);

  // resize
  const { width, height } = image.bitmap;
  // console.log({ width, height });
  const maxSide = width >= height ? 'width' : 'height';
  if (image.bitmap[maxSide] > maxSize) {
    const side = maxSide.slice(0, 1) as 'w' | 'h';
    const opts = {
      [side]: maxSize,
    };
    //@ts-expect-error
    image.resize(opts);
  }

  //@ts-expect-error
  return image.getBase64(image.mime, { quality });

  // bitmap to base64 without Jimp
  // works but for unknown reasons the file size is 35x larger!
  // const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
  // node.properties.href = `data:${mime};base64,${base64}`;

  // TODO: try window.createImageBitmap()
  // https://developer.mozilla.org/en-US/docs/Web/API/Window/createImageBitmap
}

// function scaleSource(sw: number, sh: number, dw: number, dh: number) {
//   const hRatio = dw / sw;
//   const vRatio = dh / sh;
//   const ratio = Math.max(hRatio, vRatio);
//   const x = (sw - dw / ratio) / 2;
//   const y = (sh - dh / ratio) / 2;
//   return { x, y, w: sw - x * 2, h: sh - y * 2, ratio };
// }
