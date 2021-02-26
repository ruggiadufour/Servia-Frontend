import { useReducer, createContext, useEffect } from "react";
//import io from "socket.io-client";
const initState = null;

const reducer = (state, action) => {
  switch (action.type) {
    case "setUser":
      return { ...state, ...action.payload };
    case "cleanProfileImage":
      return {
        ...state,
        user: {
          ...state.user,
          public_user: { ...state.user.public_user, profile: null },
        },
      };
    case "cleanUser":
      return null;
    default:
      return { ...state };
  }
};

const UserState = createContext(initState);

function ProviderUserState({ children, session }) {
  const [state, dispatch] = useReducer(reducer, session);

  useEffect(async () => {
    // const socket = io.connect(process.env.NEXT_PUBLIC_API);
    // socket.on("updateUser", (data) => {
    //   console.log("updateUser", data);
    // });
  }, []);

  return (
    <UserState.Provider value={{ UState: state, UDispatch: dispatch }}>
      {children}
    </UserState.Provider>
  );
}

export { UserState, ProviderUserState };
