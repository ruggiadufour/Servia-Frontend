import { useReducer, createContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { getChats } from "../Api/chats";

const initState = null;

const userReducer = (state, action) => {
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
const notificationsReducer = (state, action) => {
  switch (action.type) {
    case "setNotifications":
      return action.payload;
    case "pushNotification":
      return [action.payload, ...state];
    default:
      return { ...state };
  }
};
const chatsReducer = (state, action) => {
  switch (action.type) {
    case "setChats":
      return action.payload;
    case "pushChat":
      return [...state, action.payload];
    case "pushMessage":
      return [...state];
    default:
      return [...state];
  }
};

const UserState = createContext(initState);

function ProviderUserState({ children, session }) {
  const [UState, UDispatch] = useReducer(userReducer, session);
  const [NState, NDispatch] = useReducer(
    notificationsReducer,
    session ? session.user?.notifications.reverse() : []
  );
  const [CState, CDispatch] = useReducer(chatsReducer, []);
  const [socket, setSocket] = useState(null);

  useEffect(async () => {
    console.log(CState);
  }, [CState]);

  useEffect(async () => {
    console.log(UState);
    //If this false means the user is not logged
    if (socket === null && UState) {
      //Initialize the socket connection
      const socket_aux = io.connect(process.env.NEXT_PUBLIC_API);
      socket_aux.emit(
        "setUser",
        JSON.stringify({ id: UState.user.id, role: UState.user.role.id })
      );

      socket_aux.on("updateUserData", (data) => {
        console.log(data);
        UDispatch({ type: "setUser", payload: { user: JSON.parse(data) } });
      });

      //Setting socket state
      setSocket(socket_aux);

      //Setting chats
      const { data } = await getChats(UState.user.public_user.id, UState.jwt);
      CDispatch({ type: "setChats", payload: data });
    }
  }, [UState]);

  return (
    <UserState.Provider
      value={{
        UState,
        UDispatch,
        NState,
        NDispatch,
        CState,
        CDispatch,
        socket,
      }}
    >
      {children}
    </UserState.Provider>
  );
}

export { UserState, ProviderUserState };
