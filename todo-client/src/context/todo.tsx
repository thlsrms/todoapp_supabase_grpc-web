import { Accessor, createContext, useContext, createSignal, JSX, Setter } from "solid-js";
import { Todo_v1, RpcError, UserToken } from '../api/todo_v1';
export { RpcError };

interface TodoClientContextProps {
  client: Accessor<Todo_v1>,
  setClient: Function,
}
const TodoContext = createContext<TodoClientContextProps>();
type Props<P = {}> = P & { children?: JSX.Element };

export function TodoContextProvider(props: Props): JSX.Element {
  const [client, setTodoApi]: [Accessor<Todo_v1>, Setter<Todo_v1>] = createSignal();

  const setClient = (userToken?: UserToken) => {
    if (userToken !== undefined) {
      setTodoApi(new Todo_v1(userToken));
    } else {
      setTodoApi();
    }
  }

  return (
    <TodoContext.Provider value={{ client, setClient }}>
      {props.children}
    </TodoContext.Provider>
  )
}

export const useTodoContext = () => useContext(TodoContext)!;
