import { Game } from '@/widgets/game';
import { createRoute } from 'atomic-router';

export const goToLeaderBoardPage = createRoute();

export const Page = () => {
  return <Game />;
};
