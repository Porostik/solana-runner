import Coin from '../assets/sprites/solana.png';

export const PageLoader = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-background">
      <img
        className="w-[50px] h-[50px] animate-pulse border rounded-full border-secondary"
        src={Coin}
      />
    </div>
  );
};
