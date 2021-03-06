import { useReducer, createContext, useEffect , useState} from "react";
import io from "socket.io-client";

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
      return [ action.payload, ...state];
    default:
      return { ...state };
  }
};

const UserState = createContext(initState);

function ProviderUserState({ children, session }) {
  const [UState, UDispatch] = useReducer(userReducer, session);
  const [NState, NDispatch] = useReducer(notificationsReducer, session?session.user.notifications.reverse():null);

  const [socket, setSocket] = useState(null)

  useEffect(()=>{
    console.log(UState)
    //If this false means the user is not logged
    if(socket===null && UState){
      //Initialize the socket connection
      const socket_aux = io.connect(process.env.NEXT_PUBLIC_API)
      socket_aux.emit("setUser",JSON.stringify({id: UState.user.id, role: UState.user.role.id}))
      
      socket_aux.on("updateUserData",(data)=>{
        console.log(data)
        UDispatch({type:"setUser",payload:{user:JSON.parse(data)}})
      })

      //store the socket object
      setSocket(socket_aux)
    }
  },[UState])

  return (
    <UserState.Provider value={{ UState: UState, UDispatch: UDispatch, NState: NState, NDispatch: NDispatch, socket:socket }}>
      {children}
    </UserState.Provider>
  );
}

export { UserState, ProviderUserState };
