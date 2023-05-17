import { Navigate } from "@solidjs/router";
import { Show } from "solid-js";
import { RpcError, useAuthContext } from "../context/auth";
import { useTodoContext } from "../context/todo";

export default function SignUp() {
  const authCtx = useAuthContext();
  const todoCtx = useTodoContext();
  let email: HTMLInputElement | undefined;
  let password: HTMLInputElement | undefined;

  function handleSubmit(event: Event) {
    event.preventDefault();

    authCtx.client().signupEmailPassword(email?.value ?? '', password?.value ?? '')
      .then((response) => {
        if (response instanceof RpcError) {
          alert(`
                Signup failed: ${response.message.replaceAll('%20', ' ')}
                Code: ${response.code}`
          );
        } else {
          authCtx.setClient(response);
          todoCtx.setClient(response);
        }
      })
  }

  return (
    <section class='uk-flex uk-flex-center'>
      <div class='uk-card uk-card-body uk-flex-column uk-text-center uk-width-1-3'>
        <form onSubmit={handleSubmit} class='uk-form-horizontal'>
          <fieldset class='uk-fieldset'>
            <legend class='uk-legend'>
              Sign Up
            </legend>
            <div class='uk-margin'>
              <label for='email' class='uk-form-label uk-margin-top'>
                Email
              </label>
              <div class='uk-inline uk-margin-left uk-box-shadow-small'>
                <span class='uk-form-icon i-mdi-at uk-text-middle h-60% mt-2'></span>
                <input ref={email} name='email' type='text' placeholder='user@email.com'
                  aria-label='Not clickable icon' required
                  class='uk-input uk-form-blank '
                />
              </div>
            </div>
            <div class='uk-margin'>
              <label for='password' class='uk-form-label uk-margin-top'>
                Password
              </label>
              <div class='uk-inline uk-margin-left uk-box-shadow-small'>
                <span class='uk-form-icon i-mdi-lock uk-text-middle h-60% mt-2'></span>
                <input ref={password} name='password' type='password' placeholder='**********'
                  aria-label='Not clickable icon' required
                  class='uk-input uk-form-blank '
                />
              </div>
            </div>
            <button type='submit'
              class='uk-button uk-button-default uk-margin-top uk-box-shadow-small'
            >
              Signup
            </button>
          </fieldset>
        </form>
      </div>
      <Show when={todoCtx.client()}>
        <Navigate href={'/tasks'} />
      </Show>
    </section>
  );
}
