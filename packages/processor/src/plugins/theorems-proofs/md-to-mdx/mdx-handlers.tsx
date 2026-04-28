import { HTMLAttributes } from 'preact/compat';
import { useState } from 'preact/hooks';

// import { Context } from '../../context';

type Props = HTMLAttributes<HTMLDivElement> & {
  'data-hideable'?: string;
  'data-lowertitle'?: string;
};

export function ClickToShowTheorem({ children, ...props }: Props) {
  const [show, setShow] = useState(false);
  const hideable = props['data-hideable'] || '';
  const lowerTitle = props['data-lowertitle'] || 'Solution';

  if (hideable === 'show') {
    return <>{children}</>;
  }

  if (show) {
    return (
      <>
        {children}
        <p>
          <button className="clicktoshow" onClick={() => setShow(false)}>
            Hide {lowerTitle}
          </button>
        </p>
      </>
    );
  } else {
    return (
      <p>
        <button className="clicktoshow" onClick={() => setShow(true)}>
          Show {lowerTitle}
        </button>
      </p>
    );
  }
}
