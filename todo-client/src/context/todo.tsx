import {
  Accessor, createContext, useContext, createSignal, JSX, createResource, Setter
} from "solid-js";
import { Todo_v1, RpcError, UserToken, Task } from '../api/todo_v1';
export { RpcError, Task };

interface TodoClientContextProps {
  client: Accessor<Todo_v1>,
  setClient: Function,
  tasks: Accessor<Task[]>,
  mutate: Setter<Task[]>,
  refetch: (info?: unknown) => Task[] | Promise<Task[]> | undefined,
}
const TodoContext = createContext<TodoClientContextProps>();
type Props<P = {}> = P & { children?: JSX.Element };

export function TodoContextProvider(props: Props): JSX.Element {
  const [client, setTodoApi] = createSignal<Todo_v1>();
  const [tasks, { refetch, mutate }] = createResource<Task[] | undefined>(
    async () => {
      if (!client()) return;
      const fetchResponse = await client().fetchTask();
      if (fetchResponse instanceof RpcError) {
        console.error(`Tasks fetch error: ${fetchResponse.message.replaceAll('%20', ' ')}`)
      } else {
        return fetchResponse.taskList.tasks;
      }
    }
  )

  const setClient = (userToken?: UserToken) => {
    if (userToken !== undefined) {
      setTodoApi(new Todo_v1(userToken));
    } else {
      setTodoApi();
    }
  }

  return (
    <TodoContext.Provider value={{ client, setClient, tasks, refetch, mutate }}>
      {props.children}
    </TodoContext.Provider>
  )
}

export const useTodoContext = () => useContext(TodoContext)!;
