import { styled } from '@linaria/react';
import { Signal } from '@preact/signals';
import classNames from 'classnames';
import type { TargetedInputEvent, TargetedMouseEvent } from 'preact';

import { ViewOptionsParam } from '../../constants';

type Props = ViewOptionsParam & {
  value: Signal<string>;
  onInput: (value: string) => unknown;
};

export function RangeInput(props: Props) {
  const name = props.label.toLowerCase();
  return (
    <RangeInputWrapper>
      <Label for={name}>{props.label}</Label>
      <Input
        type="range"
        id={name}
        name={name}
        min={props.min}
        max={props.max}
        step={props.increment}
        defaultValue={props.initial}
        value={props.value}
        onInput={(e: TargetedInputEvent<HTMLInputElement>) => {
          props.onInput(e.currentTarget.value);
        }}
      />
      <Button
        className={classNames({
          disabled: props.value.value === props.initial,
        })}
        onClick={(e: TargetedMouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          props.onInput(props.initial);
        }}>
        Reset
      </Button>
    </RangeInputWrapper>
  );
}

const RangeInputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.3em 0;
`;

const Label = styled.label`
  font-size: 0.9em;
  width: 7em;
  flex: 0 0 auto;
`;

const Input = styled.input`
  flex: 1;
  width: 5em;
`;

const Button = styled.button`
  width: 4em;
  flex: 0 0 auto;
  margin-left: 1em;
  padding: 0.4em;

  border-radius: 0.4em;
  font-weight: 800;

  border: 0;
  background: var(--textColor);
  color: var(--bg);
  cursor: pointer;

  &.disabled {
    font-weight: 400;
    background: color-mix(in srgb, var(--textColor) 10%, transparent);
    color: var(--textColor);
    cursor: default;
  }
`;
