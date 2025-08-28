import { createHistoryRouter } from 'atomic-router';
import { createBrowserHistory } from 'history';

import { GamePage } from '../../pages/game';
import { Route, RouterProvider } from 'atomic-router-react';

export const routes = [{ path: '/', route: [GamePage.route] }];

export const history = createBrowserHistory();

export const router = createHistoryRouter({
  routes,
});

router.setHistory(history);

export const AppRouter = () => {
  return (
    <RouterProvider router={router}>
      <Route route={GamePage.route} view={GamePage.Page} />
    </RouterProvider>
  );
};
