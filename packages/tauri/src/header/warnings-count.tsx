import { useEffect, useState } from 'preact/hooks';

type Props = {
  loading: boolean;
};

type Detail = {
  id: string;
  top: number;
};

export function WarningsCount({}: Props) {
  const [warnings, setWarnings] = useState<Detail[]>([]);

  useEffect(() => {
    function addWarning(e: CustomEventInit<Detail>) {
      if (e.detail !== undefined) {
        setWarnings((prev) => {
          if (e.detail === undefined) {
            return prev;
          }

          const { id } = e.detail;
          const idx = prev.findIndex((o) => o.id === id);
          if (idx > -1) {
            return [
              ...prev.slice(0, idx),
              e.detail,
              ...prev.slice(idx + 1),
            ];
          } else {
            return [...prev, e.detail];
          }
        });
      }
    }

    function removeWarning(e: CustomEventInit<string>) {
      setWarnings((prev) => {
        if (e.detail === undefined) {
          return prev;
        }

        const id = e.detail;
        return prev.find((o) => o.id === id)
          ? prev.filter((o) => o.id !== id)
          : prev;
      });
    }

    window.addEventListener('warning', addWarning);
    window.addEventListener('warning-remove', removeWarning);
    return () => {
      window.removeEventListener('warning', addWarning);
      window.removeEventListener('warning-remove', removeWarning);
    };
  }, []);

  // useEffect(() => {
  //   if (loading) {
  //     setWarnings([]);
  //   }
  // }, [loading]);

  if (warnings.length === 0) {
    return null;
  }

  return (
    <div id="warning-count">
      <WarningIcon /> {warnings.length} warning
      {warnings.length === 1 ? '' : 's'}
    </div>
  );
}

function WarningIcon() {
  return (
    <svg viewBox="0 0 512 512">
      <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
    </svg>
  );
}

// function useElementDimensions() {
//   const ref = useRef<HTMLDivElement>(null);
//   const [height, setHeight] = useState(0);

//   const refresh = useCallback(() => {
//     const domRect = ref.current?.getBoundingClientRect();

//     if (domRect) {
//       setHeight(domRect.height);
//     }
//   }, []);

//   useEventListener('resize', refresh);
//   // useEventListener('scroll', refresh, true);

//   return { height, ref, refresh };
// }

// function useEventListener(
//   event: string,
//   listener: () => void,
//   useCapture?: boolean,
// ) {
//   useEffect(() => {
//     listener();
//     window.addEventListener(event, listener, useCapture);
//     return () => {
//       window.removeEventListener(event, listener, useCapture);
//     };
//   }, [event, listener, useCapture]);
// }
