import * as ReactDOM from 'react-dom/client';
import { AppRouter } from './router/routes';
import './styles/main.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(<AppRouter />);
