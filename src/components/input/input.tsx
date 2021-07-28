import { Dispatch, FC, useCallback, useState } from 'react';
import './input.css';

interface InputProps {
  setTags: Dispatch<React.SetStateAction<string[]>>;
  setIsClear: Dispatch<React.SetStateAction<boolean>>;
  value?: string;
}

export const Input: FC<InputProps> = ({ setTags, setIsClear, value }) => {
  console.log('value ', value, setIsClear)
  const changeHandle = useCallback((event: { target: { value: string; }; }) => {
    setIsClear(false);
    setTags(event.target.value.replace(/\s/g, '').split(','));
  }, [setTags, setIsClear]);

  return value !== '' ? (
    <input className="input" placeholder="введите тег" pattern="A-Za-z," onChange={changeHandle} value={value}></input>
  ) : (
    <input className="input" placeholder="введите тег" pattern="A-Za-z," onChange={changeHandle} value="" ></input>
  );
}