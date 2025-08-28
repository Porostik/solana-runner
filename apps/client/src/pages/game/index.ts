import { createRoute } from 'atomic-router';
import { Page, goToLeaderBoardPage } from './page';

const route = createRoute();

export const GamePage = { route, goToLeaderBoardPage, Page };
