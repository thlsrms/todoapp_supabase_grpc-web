import { Link } from '@solidjs/router'
import { Show } from 'solid-js';
import { RpcError, useAuthContext } from '../context/auth';
import { useGlobalContext } from '../context/global';
import { useTodoContext } from '../context/todo';

export default function Navbar() {
  const globalCtx = useGlobalContext();
  const todoCtx = useTodoContext();
  const authCtx = useAuthContext();

  function logout() {
    authCtx.client().logout().then((response) => {
      if (response instanceof RpcError) {
        alert(`
                Logout failed: ${response.message.replaceAll('%20', ' ')}
                Code: ${response.code}`
        );
      }
      authCtx.setClient();
      todoCtx.setClient()
    })
  }

  return (
    <nav class='uk-flex uk-flex-center uk-margin'>
      <ul class='uk-flex uk-flex-row uk-flex-around uk-width-xlarge'>
        <li><Link href='/'>Home</Link></li>
        <Show when={todoCtx.client()} fallback={
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
        <button onClick={() => globalCtx.toggleTheme()} class='uk-button uk-button-link mb-2'>
          <span class={
            `${globalCtx.theme() === 'light' ?
              'i-mdi-moon-waxing-crescent' : 'i-mdi-white-balance-sunny'}
               w-10 h-5 uk-button uk-button-small`}
          />
          {globalCtx.theme() === 'light' ? 'Dark' : 'Light'} mode
        </button>
      </div>
    </nav>
  );
};
