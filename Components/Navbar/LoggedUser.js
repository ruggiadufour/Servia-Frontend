import { useContext, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
} from "@material-ui/core";

import { UserState } from "../../States/User";
import { destroyCookie } from "nookies";
import { useRouter } from "next/router";
import { getTypeIcon } from "../../Api/notifications";

export default function LoggedUser() {
  const { UState, NState, UDispatch } = useContext(UserState);
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API;

  const [noRead, setNoRead] = useState(
    NState.filter((notif) => notif.read === false)
  );
  const [profileImage, setProfileImage] = useState("/Icono1.png");

  //Setting the no read notifications
  useEffect(() => {
    const noRead_ = NState.filter((notif) => notif.read === false);
    setNoRead(noRead_);
  }, [NState]);

  //Setting profile image
  useEffect(() => {
    const isImage = UState.user.public_user.profile?.formats?.thumbnail?.url;
    let img = isImage
      ? API + UState.user.public_user.profile.formats.thumbnail.url
      : "/Icono1.png";
    setProfileImage(img);
  }, []);

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
    destroyCookie(null, "session");
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
      >
        {/* <AccountCircle /> */}

        <img
          className="background-secondary-1"
          src={profileImage}
          alt="Icono profile logo"
        />

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
              goTo("/perfil/mi-perfil");
            }}
          >
            <Typography variant="inherit">
              👩‍🏫 Ver mi perfil de proveedor
            </Typography>
          </MenuItem>
        </div>

        <div>
          <MenuItem
            onClick={() => {
              goTo("/perfil/verificar-identidad");
            }}
          >
            <Typography variant="inherit">🕵️‍♂️ Verificar mi identidad</Typography>
          </MenuItem>
        </div>

        <MenuItem onClick={logOut}>
          <Typography variant="inherit">👋 Cerrar sesión</Typography>
        </MenuItem>
      </Menu>

      {/*Desplegar notificaciones*/}
      <IconButton color="inherit" onClick={openNotifContext}>
        <Badge badgeContent={noRead.length} color="secondary">
          {/* <NotificationsIcon /> */}
          🔔
        </Badge>
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={despNoti}
        open={Boolean(despNoti)}
        onClose={closeNotifContext}
      >
        <div className="p-15">
          {noRead.length === 0 ? (
            <Typography component="h3" variant="h6">
              No tenés nuevas notificaciones 🤷‍♂️
            </Typography>
          ) : (
            <Typography component="h3" variant="h6">
              🔔 Últimas notificaciones
            </Typography>
          )}
          {noRead.map((notif, i) => (
            <div className="flex" key={i}>
              <span className="type-notification">
                {getTypeIcon(notif.type)}
              </span>
              <div className="notification">
                <ReactMarkdown source={notif.description} />
              </div>
            </div>
          ))}
          <MenuItem
            onClick={() => {
              closeNotifContext();
              router.push("/notificaciones");
            }}
          >
            <Typography variant="inherit" color="secondary" align="center">
              Ver mis todas mis notificaicones
            </Typography>
          </MenuItem>
        </div>
      </Menu>

      {/*Componente chats*/}
      <IconButton
        color="inherit"
        onClick={() => {
          router.push("/chats");
        }}
      >
        <Badge badgeContent={1} color="secondary">
          {/* <Chat /> */}
          📩
        </Badge>
      </IconButton>
      <style jsx>
        {`
          .flex {
            display: flex;
            align-items: center;
          }
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
