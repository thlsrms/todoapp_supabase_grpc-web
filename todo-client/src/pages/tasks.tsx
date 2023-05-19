import { Navigate } from '@solidjs/router';
import { Show } from 'solid-js';
import { useTodoContext } from '../context/todo';
import SearchForm from '../components/TaskSearchForm';
import TaskCreateModal from '../components/TaskCreateModal';
import TasksList from "../components/TasksList";

export default function Tasks() {
  const todoCtx = useTodoContext();

  return (
    <section class='uk-flex uk-flex-column uk-flex-middle h-100% w-90% mx-5%'>
      <Show when={todoCtx.client()} fallback={<Navigate href={'/signin'} />}>

        <h2 class='uk-heading-divider w-full text-center uk-text-lighter'>
          Tasks
        </h2>
        <div class='w-full uk-flex uk-flex-between uk-flex-middle'>
          <TaskCreateModal />
          <hr class='uk-divider-vertical max-h-4 max-w-4' />

          <button onClick={(e) => {
            e.preventDefault();
            todoCtx.refetch()
          }}
            class='uk-button uk-button-link uk-button-small'>
            <span class='i-mdi-reload w-10 h-5 uk-button uk-button-small' />
          </button>

          <hr class='uk-divider-vertical max-h-4 max-w-4' />
          <SearchForm />
        </div>
        <hr class='uk-divider-icon w-full' />

        <TasksList />
      </Show>

    </section>
  );
}
