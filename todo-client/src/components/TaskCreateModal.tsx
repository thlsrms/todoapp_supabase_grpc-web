import { createEffect, createSignal } from "solid-js";
import { useGlobalContext } from "../context/global";
import { RpcError, useTodoContext } from "../context/todo";

export default function TaskCreateModal() {
  const globalCtx = useGlobalContext();
  const todoCtx = useTodoContext();
  const [theme, setTheme] = createSignal('uk-dark uk-background-default');
  let taskTitle: HTMLInputElement | undefined;
  let taskDescription: HTMLTextAreaElement | undefined;

  createEffect(() => {
    globalCtx.theme() === 'light' ?
      setTheme('uk-background-default uk-dark ') :
      setTheme('uk-background-secondary uk-light ')
  })

  function handleCreateTask(event: Event) {
    event.preventDefault();

    todoCtx.client().createTask(taskTitle.value ?? '', taskDescription.value ?? '')
      .then((response) => {
        if (response instanceof RpcError) {
          alert(`
                Task creation failed: ${response.message.replaceAll('%20', ' ')}
                Code: ${response.code}`
          );
        } else {
          taskTitle.value = ''
          taskDescription.value = ''
          todoCtx.refetch();
        }
      });
  }

  return (
    <>
      <a uk-toggle href='#create-task-modal'
        class='uk-button uk-button-link uk-text-bold uk-flex uk-flex-middle'
      >
        <span class='i-mdi-note-plus-outline w-10 h-5 uk-button uk-button-small' />
        New Task
      </a>

      <div id='create-task-modal' uk-modal>
        <div class={`uk-modal-dialog ${theme()}`}>

          <button class='uk-modal-close-default' type='button' uk-close></button>

          <div class={`uk-modal-header ${theme()}`}>
            <h4 class='uk-modal-title uk-text-lighter'>New Task</h4>
          </div>

          <form onSubmit={handleCreateTask} class='uk-form-stacked'>
            <div class='uk-modal-body' uk-overflow-auto>
              <div>
                <label class='uk-form-label uk-text-bold'>
                  Title<span class='text-red uk-text-bold'>*</span>
                </label>
                <div class='uk-form-controls'>
                  <input ref={taskTitle} name='taskTitle' type='text' placeholder='New Task' required
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
                    class='uk-input h-40 '
                  />
                </div>
              </div>
            </div>

            <div class={`uk-modal-footer uk-text-right ${theme()}`}>
              <button class='uk-button uk-button-default uk-modal-close' type='button'>
                Cancel
              </button>
              <button type='submit' class='uk-button uk-button-primary uk-text-bold '>
                Create
              </button>
            </div>
          </form>

        </div>
      </div>
    </>
  );
}
