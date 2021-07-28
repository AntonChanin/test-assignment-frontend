import { FC } from 'react';
import { ImgList } from '../img-list';
import './img-group.css';

export const ImgGroup: FC<{
  tag: string;
  items: string[]
}> = ({ tag, items }) => {
  return (
    <div className="img-group">
      <span className="img-group-tag">{tag}</span>
      <ImgList items={items} />
    </div>
  );
}