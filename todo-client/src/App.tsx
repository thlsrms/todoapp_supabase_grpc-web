import { Router, useRoutes } from '@solidjs/router'
import { routes } from './routes';
import { Navbar } from './components';
import { GlobalContextProvider } from './context/global';
import { AuthContextProvider } from './context/auth';

export default function App() {
  const Route = useRoutes(routes);

  return (
    <Router>
      <GlobalContextProvider theme='light'>
        <AuthContextProvider>
          <Navbar />
          <main class='uk-margin-left'>
            <Route />
          </main>
        </AuthContextProvider>
      </GlobalContextProvider>
    </Router>
  );
};

