import { Accessor, createContext, useContext, createSignal, JSX, createEffect } from "solid-js";

interface ContextProps {
  theme: Accessor<string>,
  toggleTheme: Function,
}
const GlobalContext = createContext<ContextProps>();
type Props<P = { theme?: string }> = P & { children?: JSX.Element };

export function GlobalContextProvider(props: Props): JSX.Element {
  const [theme, setTheme] = createSignal(props.theme || 'light');

  createEffect(() => {
    const body = document.getElementById('body');
    if (theme() === 'light') {
      body.classList.replace('uk-light', 'uk-dark');
      body.classList.replace('uk-background-secondary', 'uk-background-default');
    } else {
      body.classList.replace('uk-dark', 'uk-light');
      body.classList.replace('uk-background-default', 'uk-background-secondary');
    }
  })

  const toggleTheme = () => {
    theme() === 'dark' ? setTheme('light') : setTheme('dark')
  }

  return (
    <GlobalContext.Provider value={{ theme, toggleTheme }}>
      {props.children}
    </GlobalContext.Provider>
  )
}

export const useGlobalContext = () => useContext(GlobalContext)!;
