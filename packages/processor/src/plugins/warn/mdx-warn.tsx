// import { styled } from '@linaria/react';
import { hexoid } from 'hexoid';
import { HTMLAttributes } from 'preact/compat';
import { useEffect, useRef } from 'preact/hooks';

const toID = hexoid();

type Detail = {
  id: string;
  top: number;
};

export function WarnSpan(props: HTMLAttributes<HTMLSpanElement>) {
  const ref = useRef<HTMLSpanElement>(null);
  // const [id, setId] = useState('');

  useEffect(() => {
    if (ref.current) {
      const id = toID();
      const { y } = ref.current.getBoundingClientRect();
      const top = Math.round(y);
      // const id = toID();
      // setTooltipHeight(height);
      window.dispatchEvent(
        new CustomEvent<Detail>('warning', { detail: { id, top } }),
      );
      return () => {
        window.dispatchEvent(
          new CustomEvent<string>('warning-remove', { detail: id }),
        );
      };
    }
  }, []);

  // useLayoutEffect(() => {
  //   if (ref.current) {
  //     console.log('yo!');
  //     const { y } = ref.current.getBoundingClientRect();
  //     const top = Math.round(y);
  //     // const id = toID();
  //     // setTooltipHeight(height);
  //     window.dispatchEvent(
  //       new CustomEvent<Detail>('warning', { detail: { id, top } }),
  //     );
  //     return () => {
  //       window.dispatchEvent(
  //         new CustomEvent<string>('warning-remove', { detail: id }),
  //       );
  //     };
  //   }
  // }, []);

  // const ref: RefCallback<HTMLSpanElement> = useCallback((element) => {
  //   if (element !== null) {
  //     const { y } = element.getBoundingClientRect();
  //     window.dispatchEvent(
  //       new CustomEvent<number>('warning', { detail: Math.round(y) }),
  //     );
  //   }
  // }, []);
  return (
    <>
      {' '}
      <span {...props} className="warn" ref={ref} />{' '}
    </>
  );
}

// const Warn = styled.span`
//   display: inline-block;
//   padding: 0 0.5em;
//   font-size: 0.8em;
//   background: orange;
//   color: black;
//   border-radius: 0.2em;
// `;
