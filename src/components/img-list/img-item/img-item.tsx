import { FC } from 'react';
import './img-item.css';

export const ImgItem: FC<{
  image: string;
}> = ({ image }) => {
  return <div className="img-item"><img alt="" src={image} key={image} /></div>;
}