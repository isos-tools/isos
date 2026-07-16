// import { ComponentChildren, RefCallback } from 'preact';
// import { useCallback, useContext } from 'preact/hooks';

// import { MathsFont } from '../../mdx-state';
// import { MathsElementsContext } from './state';

// type Props = {
//   expr: string;
//   mathsFont: MathsFont;
// };

// export function MathJaxComponentsInline({ expr, mathsFont }: Props) {
//   return <Maths mathsFont={mathsFont}>${expr}$</Maths>;
// }

// export function MathJaxComponentsDisplay({ expr, mathsFont }: Props) {
//   return (
//     <Maths mathsFont={mathsFont}>
//       $$
//       <br />
//       {expr}
//       <br />
//       $$
//     </Maths>
//   );
// }

// type MathProps = {
//   children: ComponentChildren;
//   mathsFont: MathsFont;
// };

// function Maths({ children, mathsFont }: MathProps) {
//   const { queueMathJaxRender } = useContext(MathsElementsContext);

//   const ref: RefCallback<HTMLSpanElement> = useCallback((element) => {
//     if (element !== null) {
//       queueMathJaxRender(element, mathsFont);
//     }
//   }, []);

//   return (
//     <span ref={ref} className="maths">
//       {children}
//     </span>
//   );
// }
