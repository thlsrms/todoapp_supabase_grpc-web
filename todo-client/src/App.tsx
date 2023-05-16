import { Router, useRoutes } from '@solidjs/router'
import { routes } from './routes';
import { Navbar } from './components';
import { GlobalContextProvider } from './context/global';
import { AuthContextProvider } from './context/auth';
import { TodoContextProvider } from './context/todo';

export default function App() {
  const Route = useRoutes(routes);

  return (
    <Router>
      <GlobalContextProvider theme='light'>
        <AuthContextProvider>
          <TodoContextProvider>
            <Navbar />
            <main class='uk-margin-left'>
              <Route />
            </main>
          </TodoContextProvider>
        </AuthContextProvider>
      </GlobalContextProvider>
    </Router>
  );
};

