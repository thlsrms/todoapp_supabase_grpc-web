import { Accessor, createContext, useContext, createSignal, JSX, Setter } from "solid-js";
import { Todo_v1, RpcError, UserToken } from '../api/todo_v1';
export { RpcError };

interface TodoClientContextProps {
  todoApi: Accessor<Todo_v1>,
  setTodoClient: Function,
}
const TodoContext = createContext<TodoClientContextProps>();
type Props<P = {}> = P & { children?: JSX.Element };

export function TodoContextProvider(props: Props): JSX.Element {
  const [todoApi, setTodoApi]: [Accessor<Todo_v1>, Setter<Todo_v1>] = createSignal();

  const setTodoClient = (userToken?: UserToken) => {
    if (userToken !== undefined) {
      setTodoApi(new Todo_v1(userToken));
    } else {
      setTodoApi();
    }
  }

  return (
    <TodoContext.Provider value={{ todoApi, setTodoClient }}>
      {props.children}
    </TodoContext.Provider>
  )
}

export const useTodoContext = () => useContext(TodoContext)!;
