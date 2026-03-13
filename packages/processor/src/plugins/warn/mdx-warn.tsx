// import { styled } from '@linaria/react';
import { HTMLAttributes } from 'preact/compat';
import { useLayoutEffect, useRef } from 'preact/hooks';

export function WarnSpan(props: HTMLAttributes<HTMLSpanElement>) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (ref.current) {
      const { y } = ref.current.getBoundingClientRect();
      const top = Math.round(y);
      // setTooltipHeight(height);
      window.dispatchEvent(
        new CustomEvent<number>('warning', { detail: top }),
      );
      return () => {
        window.dispatchEvent(
          new CustomEvent<number>('warning-remove', { detail: top }),
        );
      };
    }
  }, []);

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
