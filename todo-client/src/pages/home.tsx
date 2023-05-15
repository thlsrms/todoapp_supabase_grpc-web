import { createSignal } from 'solid-js';

export default function Home() {
  const [count, setCount] = createSignal(0);

  return (
    <section class='uk-flex uk-flex-column uk-flex-middle'>
      <h1>Home</h1>
      <div class='uk-card uk-card-body'>
        <p>This is the home page.</p>

        <div class='uk-flex uk-flex-middle uk-text-center'>
          <button class='uk-margin-right uk-button uk-button-default uk-button-small'
            onClick={() => setCount(count() - 1)}>
            -
          </button>
          <output class='text-center'>Count: {count()}</output>
          <button class='uk-margin-left uk-button uk-button-default uk-button-small'
            onClick={() => setCount(count() + 1)}>
            +
          </button>
        </div>
      </div>
    </section>
  );
}
