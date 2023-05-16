import { Link } from '@solidjs/router'
import { createEffect, Show } from 'solid-js';
import { RpcError, useAuthContext } from '../context/auth';
import { useGlobalContext } from '../context/global';
import { useTodoContext } from '../context/todo';

export default function Navbar() {
  const { theme, setTheme } = useGlobalContext();
  const todoClient = useTodoContext();
  const authClient = useAuthContext();

  function toggleDarkMode() {
    theme() === 'dark' ? setTheme('light') : setTheme('dark')
  }

  function logout() {
    authClient.auth().logout().then((response) => {
      if (response instanceof RpcError) {
        alert(`
                Logout failed: ${response.message.replaceAll('%20', ' ')}
                Code: ${response.code}`
        );
      }
      authClient.setAuth();
      todoClient.setTodoClient()
    })
  }

  return (
    <nav class='uk-flex uk-flex-center uk-margin'>
      <ul class='uk-flex uk-flex-row uk-flex-around uk-width-xlarge'>
        <li><Link href='/'>Home</Link></li>
        <Show when={todoClient.todoApi()} fallback={
          <>
            <li><Link href='/signin'>Login</Link></li>
            <li><Link href='/signup'>Sign Up</Link></li>
          </>
        }>
          <li class='uk-flex uk-flex-middle'>
            <button onClick={logout} class='uk-button uk-button-link'>
              Logout
              <span class='i-mdi-exit-to-app w-10 h-5 uk-button uk-button-small' />
            </button>
          </li>
        </Show>
      </ul>
      <div class='uk-inline uk-position-right uk-margin-right'>
        <button onClick={() => toggleDarkMode()} class='uk-button uk-button-link mb-2'>
          <span class={
            `${theme() === 'light' ? 'i-mdi-moon-waxing-crescent' : 'i-mdi-white-balance-sunny'}
                w-10 h-5 uk-button uk-button-small`}
          />
          {theme() === 'light' ? 'Dark' : 'Light'} mode
        </button>
      </div>
    </nav>
  );
};
