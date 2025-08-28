import Barrel from '@/shared/assets/sprites/barrel.png';
import { CSSProperties } from 'react';
import { cn } from '@/shared/utils/cn';

const objects = [
  {
    img: Barrel,
    width: 35,
    height: 65,
  },
];

export const Obstacle = () => {
  const activeObject = objects[0];

  return (
    <div
      className={cn(
        'absolute obstacle bottom-0 opacity-0 bg-no-repeat bg-cover bg-center will-change-transform'
      )}
      style={
        {
          '--obs-w': `${activeObject.width}px`,
          backgroundImage: `url(${activeObject.img})`,
          width: activeObject.width,
          height: activeObject.height,
        } as CSSProperties
      }
    >
      <div className="obstacle-box absolute w-full h-full" />
    </div>
  );
};
