import { Dispatch, FC, PropsWithChildren } from "react";
import './button.css';

export enum EButtonType {
  load = 'load',
  clear = 'clear',
  group = 'group',
}

export interface ExtendedButtonProps {
  value: boolean;
  setterGroup: Dispatch<React.SetStateAction<boolean>>;
}

export interface ButtonProps {
  type: EButtonType;
  data: ExtendedButtonProps;
  clickHandle(items: string[], group: boolean): void;
}

export const Button: FC<PropsWithChildren<ButtonProps>> = ({ type, data, clickHandle, children }) => {
  return <button onClick={() => {
    data.setterGroup(data.value)
    clickHandle([''], false);
  }} className={`button-common ${type}`}>{children}</button>
};
