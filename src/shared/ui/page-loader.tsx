import Coin from '../assets/sprites/solana.png';

export const PageLoader = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <img className="w-[50px] h-[50px] animate-pulse" src={Coin} />
    </div>
  );
};
