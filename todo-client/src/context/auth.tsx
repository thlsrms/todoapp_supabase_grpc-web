import { Accessor, createContext, useContext, createSignal, JSX } from "solid-js";
import { Auth_v1, UserToken, RpcError } from '../api/auth_v1';
export { RpcError };

interface AuthContextProps {
  auth: Accessor<Auth_v1>,
  setAuth: Function,
}
const AuthContext = createContext<AuthContextProps>();
type Props<P = {}> = P & { children?: JSX.Element };

export function AuthContextProvider(props: Props): JSX.Element {
  const [auth, setAuthApi] = createSignal(new Auth_v1());

  const setAuth = (userToken?: UserToken) => {
    if (userToken !== undefined) {
      setAuthApi(new Auth_v1(userToken));
    } else {
      setAuthApi(new Auth_v1());
    }
  }

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)!;
