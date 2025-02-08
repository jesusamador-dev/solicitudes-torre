import React, {useEffect, useState} from 'react';
import './Skeleton.scss';
interface Props {
  height?: number;
  width?: number;
  square?: boolean;
  rounded?: boolean;
  circle?: boolean;
  className?: string;
}
const NUMBER_20 = 20;
const NUMBER_100 = 100;
export const Skeleton: React.FC<Props> = ({
  height = NUMBER_20,
  width = NUMBER_100,
  square = false,
  rounded = false,
  circle = false,
  className = '',
}) => {
  const [localHeight, setLocalHeight] = useState(height);
  const squareSyle = {
    height: `${width}px`,
    width: `${width}px`,
    borderRadius: '12px',
  };
  useEffect(() => {
    if (circle && width !== height) {
      setLocalHeight(width);
    }
  }, []);

  const style = {
    height: `${localHeight}px`,
    width: `${width}%`,
    borderRadius: circle ? '50%' : rounded ? '45px' : '0%',
  };
  return (
    <span className={`${className}`} aria-live='polite' aria-busy='true'>
      {square ? (
        <span className='AurumSkeleton' style={squareSyle}>
          &zwnj;
        </span>
      ) : (
        <span className='AurumSkeleton' style={style}>
          &zwnj;
        </span>
      )}
      <br />
    </span>
  );
};
export default Skeleton;
