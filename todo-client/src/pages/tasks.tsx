import { Navigate } from '@solidjs/router';
import { Show } from 'solid-js';
import { useTodoContext } from '../context/todo';
import SearchForm from '../components/TaskSearchForm';
import TaskCreateModal from '../components/TaskCreateModal';

export default function Tasks() {
  const todoCtx = useTodoContext();

  return (
    <section class='uk-flex uk-flex-column uk-flex-middle h-100% w-90% mx-5%'>
      <h2 class='uk-heading-divider w-full text-center uk-text-lighter'>
        Tasks
      </h2>
      <div class='w-full uk-flex uk-flex-between uk-flex-middle'>
        <TaskCreateModal />
        <hr class='uk-divider-vertical max-h-4 max-w-4' />
        <SearchForm />
      </div>
      <hr class='uk-divider-icon w-full' />

      <div class='uk-flex uk-flex-column uk-flex-middle uk-flex-top uk-width-3-4'>

        <table class='uk-table uk-table-small uk-table-striped uk-table-hover'>
          <caption></caption>
          <thead>
            <tr>
              <th class='uk-table-shrink'>Done?</th>
              <th class='uk-table-middle'>Task</th>
              <th class='uk-table-middle'>Description</th>
              <th class='uk-table-shrink'></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><input type='checkbox' class='uk-checkbox' checked={false} /></td>
              <td class='uk-table-middle'>Test</td>
              <td class='uk-table-middle uk-text-truncate'>Testing testing</td>
              <td>
                <button class='uk-button uk-button-default uk-button-small uk-button-link'>
                  <span class='i-mdi-note-edit-outline w-10 h-5 uk-button uk-button-small' />
                </button>
              </td>
            </tr>
            <tr>
              <td><input type='checkbox' class='uk-checkbox' checked={false} /></td>
              <td class='uk-table-middle'>Test</td>
              <td class='uk-table-middle uk-text-truncate'>
                Testing testing testing testing testing testing testing testing
              </td>
              <td>
                <button class='uk-button uk-button-default uk-button-small uk-button-link'>
                  <span class='i-mdi-note-edit-outline w-10 h-5 uk-button uk-button-small' />
                </button>
              </td>
            </tr>
            <tr>
              <td><input type='checkbox' class='uk-checkbox' checked={false} /></td>
              <td class='uk-table-middle'>Test</td>
              <td class='uk-table-middle uk-text-truncate'>
                Testing testing testing testing testing testing testing testing
              </td>
              <td>
                <button class='uk-button uk-button-default uk-button-small uk-button-link'>
                  <span class='i-mdi-note-edit-outline w-10 h-5 uk-button uk-button-small' />
                </button>
              </td>
            </tr>
            <tr>
              <td><input type='checkbox' class='uk-checkbox' checked={false} /></td>
              <td class='uk-table-middle'>Test</td>
              <td class='uk-table-middle uk-text-truncate'>
                Testing testing testing testing testing testing testing testing
              </td>
              <td>
                <button class='uk-button uk-button-default uk-button-small uk-button-link'>
                  <span class='i-mdi-note-edit-outline w-10 h-5 uk-button uk-button-small' />
                </button>
              </td>
            </tr>
            <tr>
              <td><input type='checkbox' class='uk-checkbox' checked={false} /></td>
              <td class='uk-table-middle'>Test</td>
              <td class='uk-table-middle uk-text-truncate'>
                Testing testing testing testing testing testing testing testing
              </td>
              <td>
                <button class='uk-button uk-button-default uk-button-small uk-button-link'>
                  <span class='i-mdi-note-edit-outline w-10 h-5 uk-button uk-button-small' />
                </button>
              </td>
            </tr>
          </tbody>
        </table>

      </div>

      <Show when={!todoCtx.client()}>
        <Navigate href={'/signin'} />
      </Show>
    </section>
  );
}
