import { createEffect, createSignal, For, Show } from "solid-js";
import { useGlobalContext } from "../context/global";
import { useTodoContext, Task, RpcError } from "../context/todo";
import TaskComponent from "./TaskComponent";

export default function TasksList() {
  const todoCtx = useTodoContext();
  const [editingTask, changeEditingTask] = createSignal<Task>();
  const globalCtx = useGlobalContext();
  const [theme, setTheme] = createSignal('uk-dark uk-background-default');
  let taskTitle: HTMLInputElement | undefined;
  let taskDescription: HTMLTextAreaElement | undefined;

  createEffect(() => {
    globalCtx.theme() === 'light' ?
      setTheme('uk-background-default uk-dark ') :
      setTheme('uk-background-secondary uk-light ')
  })

  createEffect(() => todoCtx.refetch())

  function handleEditTask(event: Event) {
    event.preventDefault();

    todoCtx.client().updateTask({
      id: editingTask().id,
      title: taskTitle.value ?? '',
      completed: editingTask().completed,
      description: taskDescription.value ?? undefined,
    })
      .then((response) => {
        if (response instanceof RpcError) {
          alert(`
                Task update failed: ${response.message.replaceAll('%20', ' ')}
                Code: ${response.code}`
          );
        } else {
          todoCtx.refetch();
        }
      });
  }

  function handleTaskDeletion(id: number) {
    todoCtx.client().deleteTask(id)
      .then((response) => {
        if (response instanceof RpcError) {
          alert(`
                Task deletion failed: ${response.message.replaceAll('%20', ' ')}
                Code: ${response.code}`
          );
        } else {
          todoCtx.refetch();
        }
      });
  }

  return (
    <div class='uk-flex uk-flex-column uk-flex-middle uk-flex-top uk-width-3-4'>

      <Show when={todoCtx.tasks()} fallback={<p>Fetching Tasks...</p>} >
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

            <Show when={todoCtx.tasks()} keyed>
              {(task) => (
                <For each={task}>
                  {(t) => {
                    return (
                      <TaskComponent task={t} editTask={changeEditingTask} />
                    )
                  }}
                </For>
              )}
            </Show>

          </tbody>
        </table>
      </Show>

      <Show when={todoCtx.tasks()}>
        <div id='edit-task-modal' uk-modal>
          <div class={`uk-modal-dialog ${theme()}`}>

            <button class='uk-modal-close-default' type='button' uk-close></button>

            <div class={`uk-modal-header ${theme()}`}>
              <h4 class='uk-modal-title uk-text-lighter'>Update Task Details</h4>
            </div>

            <form onSubmit={handleEditTask} class='uk-form-stacked'>
              <div class='uk-modal-body' uk-overflow-auto>
                <div>
                  <label class='uk-form-label uk-text-bold'>
                    Title<span class='text-red uk-text-bold'>*</span>
                  </label>
                  <div class='uk-form-controls'>
                    <input ref={taskTitle} name='taskTitle' type='text' required
                      value={editingTask() ? editingTask().title : ''}
                      class='uk-input'
                    />
                  </div>
                </div>

                <div class='mt-8'>
                  <label class='uk-form-label uk-text-bold'>
                    Description
                  </label>
                  <div class='uk-form-controls'>
                    <textarea ref={taskDescription} rows='4' name='taskDescription'
                      value={
                        editingTask()
                          ? (editingTask().description != undefined ? editingTask().description : '')
                          : ''
                      }
                      class='uk-input h-40 '
                    />
                  </div>
                </div>
              </div>

              <div class={`uk-modal-footer uk-flex ${theme()}`}>
                <div class='uk-text-left uk-width-3-3'>
                  <button type='button' onClick={() => handleTaskDeletion(editingTask().id)}
                    class='uk-button uk-button-danger uk-modal-close'
                  >
                    Delete
                  </button>
                </div>
                <div class='uk-text-right uk-width-3-3'>
                  <button class='uk-button uk-button-default uk-modal-close' type='button'>
                    Cancel
                  </button>
                  <button type='submit' class='uk-button uk-button-primary uk-text-bold '>
                    Update
                  </button>
                </div>
              </div>
            </form>

          </div>
        </div>
      </Show>

    </div>
  );
}
