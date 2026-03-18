import { useEffect, useState } from 'preact/hooks';

type Props = {
  loading: boolean;
};

type Detail = {
  id: string;
  top: number;
};

export function WarningLineHighlight({ loading }: Props) {
  const [warnings, setWarnings] = useState<Detail[]>([]);
  const [articleHeight, setArticleHeight] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  // const { height, ref } = useElementDimensions();
  // console.log({ loading, warnings });

  useEffect(() => {
    function addWarning(e: CustomEventInit<Detail>) {
      setWarnings((prev) => {
        if (e.detail === undefined) {
          return prev;
        }

        const { id } = e.detail;
        const idx = prev.findIndex((o) => o.id === id);
        if (idx > -1) {
          return [...prev.slice(0, idx), e.detail, ...prev.slice(idx + 1)];
        } else {
          return [...prev, e.detail];
        }
      });
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
      // console.log('dismount');
      window.removeEventListener('warning', addWarning);
      window.removeEventListener('warning-remove', removeWarning);
    };
  }, []);

  useEffect(() => {
    if (loading) {
      // setWarnings([]);
    } else {
      const article = document.querySelector('article');
      const scroll = document.getElementById('scroll-wrap');

      if (article) {
        const rect = article.getBoundingClientRect();
        setArticleHeight(rect.height);
      }
      if (scroll) {
        setScrollY(scroll.scrollTop);
      }
    }
  }, [loading]);

  // if (loading) {
  //   return null;
  // }

  // console.log(warnings);

  return (
    <div id="warnings">
      {warnings.map((o) => {
        const top = o.top + scrollY;
        const ratio = articleHeight / top;
        return (
          <div
            key={o.id}
            className="warning"
            style={{ top: `${100 / ratio}%` }}
          />
        );
      })}
    </div>
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
