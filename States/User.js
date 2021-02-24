import { useReducer, createContext } from "react";
const initState = null;

const reducer = (state, action) => {
  switch (action.type) {
    case "setUser":
      return action.payload ;
    case "cleanUser":
      return null;
    default:
      return { ...state };
  }
};

const UserState = createContext(initState);

function ProviderUserState({ children, session }) {
  const [state, dispatch] = useReducer(reducer, session);

  return (
    <UserState.Provider value={{ UState: state, UDispatch: dispatch }}>
      {children}
    </UserState.Provider>
  );
}

export { UserState, ProviderUserState };
