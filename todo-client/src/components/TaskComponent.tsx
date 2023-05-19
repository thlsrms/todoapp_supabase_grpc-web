import { JSX, Setter } from "solid-js";
import { useTodoContext, Task, RpcError } from "../context/todo";

type Props = {
  task: Task,
  editTask: Setter<Task>,
};

export default function TaskCompononent(props: Props): JSX.Element {
  const todoCtx = useTodoContext();

  function toggleTaskCompletion() {
    todoCtx.client().updateTask({
      id: props.task.id,
      completed: !props.task.completed,
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

  return (
    <tr id={`task_${props.task.id}`}>
      <td>
        <input type='checkbox' class='uk-checkbox' checked={props.task.completed}
          onChange={toggleTaskCompletion}
        />

      </td>
      <td class='uk-table-middle'>
        <span class={`${props.task.completed ? 'line-through' : ''}`}>
          {props.task.title}
        </span>
      </td>
      <td class='uk-table-middle uk-text-truncate'>
        {props.task.description}
      </td>
      <td>
        <a uk-toggle href='#edit-task-modal' onClick={() => props.editTask(props.task)}
          class='uk-button uk-button-default uk-button-small uk-button-link'>
          <span class='i-mdi-note-edit-outline w-10 h-5 uk-button uk-button-small' />
        </a>
      </td>
    </tr>
  );
}
