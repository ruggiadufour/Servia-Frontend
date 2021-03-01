import { useContext, useEffect, useState } from "react";
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
} from "@material-ui/core";
import {
  Chat,
  Notifications as NotificationsIcon,
} from "@material-ui/icons";

import { UserState } from "../../States/User";
import { destroyCookie } from "nookies";
import {useRouter} from "next/router";

export default function LoggedUser() {
  const { UState, UDispatch } = useContext(UserState);
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API;
  
  const [profileImage, setProfileImage] = useState("/Icono1.png");
  useEffect(() => {
    const isImage = UState.user.public_user.profile?.formats?.thumbnail?.url;
    let img = isImage
      ? API + UState.user.public_user.profile.formats.thumbnail.url
      : "/Icono1.png";

    setProfileImage(img);
  }, [UState]);

  const [despPerf, setdespPerf] = useState(null);
  const [despNoti, setdespNoti] = useState(null);

  //Métodos utilizados cuando se despliegan y pliegan los menúes de la barrad de navegación
  const openProfileContext = (event) => {
    setdespPerf(event.currentTarget);
  };
  const closeProfileContext = () => {
    setdespPerf(null);
  };
  const openNotifContext = (event) => {
    setdespNoti(event.currentTarget);
  };
  const closeNotifContext = () => {
    setdespNoti(null);
  };

  async function logOut() {
    await destroyCookie(null, "session");
    UDispatch({ type: "cleanUser" });
    setdespPerf(null);
    router.push("/");
  }

  function goTo(url) {
    closeProfileContext();
    router.push(url);
  }

  return (
    <div className="logged">
      {/*Desplegar perfil*/}
      <IconButton
        edge="end"
        aria-label="account of current user"
        aria-haspopup="true"
        color="inherit"
        onClick={openProfileContext}
        style={{ position: "relative" }}
        className="background-secondary-2"
      >
        {/* <AccountCircle /> */}

        <img className="background-secondary-2" src={profileImage} alt="Icono profile logo" />

        <p className="icon-profile">🔨</p>
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={despPerf}
        keepMounted
        open={Boolean(despPerf)}
        onClose={closeProfileContext}
      >
        <MenuItem
          onClick={() => {
            goTo("/perfil/modificar");
          }}
        >
          <Typography variant="inherit">👨‍🔧 Modificar mi perfil</Typography>
        </MenuItem>

        <div>
          <MenuItem
            onClick={() => {
              goTo("/perfiles?id=" + UState?.user.public_user.id);
            }}
          >
            <Typography variant="inherit">
              👩‍🏫 Ver mi perfil de proveedor
            </Typography>
          </MenuItem>
        </div>

        <div>
          <MenuItem onClick={() => {
              goTo("/perfil/verificar-identidad");
            }}>
              <Typography variant="inherit">🕵️‍♂️ Verificar mi identidad</Typography>
          </MenuItem>
        </div>

        <MenuItem onClick={logOut}>
          <Typography variant="inherit">👋 Cerrar sesión</Typography>
        </MenuItem>
      </Menu>

      {/*Desplegar notificaciones*/}
      <IconButton color="inherit" onClick={openNotifContext}>
        <Badge badgeContent={1} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={despNoti}
        keepMounted
        open={Boolean(despNoti)}
        onClose={closeNotifContext}
      >
        Notification component
      </Menu>

      {/*Componente chats*/}
      <a href="#">
        <IconButton color="inherit">
          <Badge badgeContent={0} color="secondary">
            <Chat />
          </Badge>
        </IconButton>
      </a>

      <style jsx>
        {`
          .logged {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            gap: 15px;
          }
          .icon-profile {
            position: absolute;
            top: 0;
            right: 0;
          }
          img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            object-fit: cover;
          }
        `}
      </style>
    </div>
  );
}
