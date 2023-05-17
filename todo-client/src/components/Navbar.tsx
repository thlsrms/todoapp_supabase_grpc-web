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
    <nav uk-navbar class='uk-navbar-container uk-navbar-transparent uk-box-shadow-small' >
      <div class='uk-navbar-left pl-5'>
        <Link href='/' class='uk-navbar-item uk-logo'>
          Todo
        </Link>
      </div>
      <div class='uk-navbar-center'>
        <ul class='uk-navbar-nav'>
          <Show when={!todoCtx.client()}>
            <li>
              <Link href='/signin' class='uk-text-emphasis'>
                Login
              </Link>
            </li>
            <li>
              <Link href='/signup' class='uk-text-emphasis'>
                Sign Up
              </Link>
            </li>
          </Show>
        </ul>
      </div>
      <div class='uk-navbar-right pr-5'>
        <Show when={todoCtx.client()}>
          <button onClick={logout} class='uk-button uk-button-link uk-flex uk-flex-middle'>
            Logout
            <span class='i-mdi-exit-to-app w-10 h-5 uk-button uk-button-small' />
          </button>
          <hr class='uk-divider-vertical max-h-5 mt-5' />
        </Show>
        <button onClick={() => globalCtx.toggleTheme()}
          class='uk-button uk-button-link uk-button-small'
        >
          <span class={
            `${globalCtx.theme() === 'light' ?
              'i-mdi-moon-waxing-crescent' : 'i-mdi-white-balance-sunny'}
               h-5 uk-button uk-button-small`}
          />
        </button>
      </div>
    </nav>
  );
};
