import { Accessor, createContext, useContext, createSignal, JSX } from "solid-js";
import { Auth_v1, UserToken, RpcError } from '../api/auth_v1';
export { RpcError };

interface AuthContextProps {
  client: Accessor<Auth_v1>,
  setClient: Function,
}
const AuthContext = createContext<AuthContextProps>();
type Props<P = {}> = P & { children?: JSX.Element };

export function AuthContextProvider(props: Props): JSX.Element {
  const [client, setAuthApi] = createSignal(new Auth_v1());

  const setClient = (userToken?: UserToken) => {
    if (userToken !== undefined) {
      setAuthApi(new Auth_v1(userToken));
    } else {
      setAuthApi(new Auth_v1());
    }
  }

  return (
    <AuthContext.Provider value={{ client, setClient }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)!;
