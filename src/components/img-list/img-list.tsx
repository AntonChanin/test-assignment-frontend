import { FC } from 'react';
import { ImgItem } from './img-item/img-item';
import './img-list.css';

export const ImgList: FC<{ items: string[] }> = ({ items }) => {
  return <div className="img-list">{items.map((item) => <ImgItem images={item} key={`${item}`} />)}</div>;
}