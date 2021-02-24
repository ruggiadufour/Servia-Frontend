import { useReducer, createContext } from "react";
const initState = {
  desc: "¡Bienvenido a Servia!",
  type: "success",
  open: true,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "setAlert":
      return action.payload ;
    case "cleanAlert":
      return { ...initState, open: false };
    default:
      return state;
  }
};

const AlertState = createContext(initState);

function ProviderAlertState({ children }) {
  const [state, dispatch] = useReducer(reducer, initState);

  return (
    <AlertState.Provider value={{ AState: state, ADispatch: dispatch }}>
      {children}
    </AlertState.Provider>
  );
}

export { AlertState, ProviderAlertState };
