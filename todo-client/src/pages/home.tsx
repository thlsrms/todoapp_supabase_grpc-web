import { Navigate } from '@solidjs/router';

export default function Home() {
  return (
    <section class='uk-flex uk-flex-column uk-flex-middle'>
      <h1>Home</h1>
      <div class='uk-card uk-card-body'>
        <p>This is the home page.</p>
      </div>
      <Navigate href={'/tasks'} />
    </section>
  );
}
