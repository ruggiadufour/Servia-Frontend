import { useReducer, createContext, useEffect, useContext } from "react";
import {UserState} from './User'

const initState = {
  desc: "¡Bienvenido a Servia!",
  type: "success",
  open: true,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "setAlert":
      return action.payload;
    case "cleanAlert":
      return { ...state, open: false };
    default:
      return state;
  }
};

const AlertState = createContext(initState);

function ProviderAlertState({ children }) {
  const [state, dispatch] = useReducer(reducer, initState);
  const {socket} = useContext(UserState)

  useEffect(() => {
    //Response event. When we send something from client, we need to know if the server got it
    if (socket !== null){
      socket.on("received", (data) => {
        const Data = JSON.parse(data)
        dispatch({
          type: "setAlert",
          payload: {
            desc: Data.desc,
            type: Data.type,
            open: true,
          },
        });
      });
    }
  }, [socket]);

  return (
    <AlertState.Provider value={{ AState: state, ADispatch: dispatch }}>
      {children}
    </AlertState.Provider>
  );
}

export { AlertState, ProviderAlertState };
