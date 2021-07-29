import { FC } from 'react';
import './img-item.css';

export const ImgItem: FC<{
  images: string;
}> = ({ images }) => {
  return (
    <div className="img-item">
      {images.includes(' , ') ? (
        images
          .split(' , ')
          .map(
            image => <img alt="" src={image} key={image} style={{ height: `calc(${5000 / images.length}%)` }} />
          )
      ) : (
        <img alt="" src={images} key={images} />
      )}
    </div>
  );
}