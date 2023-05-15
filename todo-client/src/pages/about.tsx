import { createEffect, Suspense } from 'solid-js';
import { useRouteData } from '@solidjs/router';

export default function About() {
  const name = useRouteData<() => string>();

  createEffect(() => {
    console.log(name());
  });

  return (
    <section class='uk-flex uk-flex-column uk-flex-middle'>
      <h1>About</h1>
      <p>A page all about this website.</p>
      <p>
        <span>We love</span>
        <Suspense fallback={<span>...</span>}>
          <span>&nbsp;{name()}</span>
        </Suspense>
      </p>
    </section>
  )
}
