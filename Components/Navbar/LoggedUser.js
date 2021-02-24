import { useContext, useState } from "react";
import {
  IconButton,
  Badge,
  Menu,
  ListItemIcon,
  MenuItem,
  Typography,
  Avatar,
} from "@material-ui/core";
import {
  Person as Perfil,
  ExitToApp as ExitToAppIcon,
  Create as ModificarPerfil,
  Chat,
  AccountCircle,
  Notifications as NotificationsIcon,
  PriorityHigh as PriorityHighIcon,
} from "@material-ui/icons";

import { UserState } from "../../States/User";
import { destroyCookie } from "nookies";

export default function LoggedUser() {
  const { UState, UDispatch } = useContext(UserState);
  const API = process.env.NEXT_PUBLIC_API;

  const [despPerf, setdespPerf] = useState(null);
  const [despNoti, setdespNoti] = useState(null);

  //Métodos utilizados cuando se despliegan y pliegan los menúes de la barrad de navegación
  const desplegarPerfil = (event) => {
    setdespPerf(event.currentTarget);
  };
  const plegarPerfil = () => {
    setdespPerf(null);
  };
  const desplegarNoti = (event) => {
    setdespNoti(event.currentTarget);
  };
  const plegarNoti = () => {
    setdespNoti(null);
  };

  function logOut() {
    UDispatch({ type: "cleanUser" });
    destroyCookie(null, "session");
    setdespPerf(null);
  }
  return (
    <div className="logged">
      {/*Desplegar perfil*/}
      <IconButton
        edge="end"
        aria-label="account of current user"
        aria-haspopup="true"
        color="inherit"
        onClick={desplegarPerfil}
        style={{ position: "relative" }}
      >
        {/* <AccountCircle /> */}
        <img
          src={API + UState.user.public_user.profile?.formats?.thumbnail?.url}
        />
        <p className="icon-profile">🔨</p>
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={despPerf}
        keepMounted
        open={Boolean(despPerf)}
        onClose={plegarPerfil}
      >
        <MenuItem onClick={plegarPerfil}>
          <a href="#">
            <ListItemIcon>
              <Avatar
                style={{ color: "gray", width: "20px", height: "20px" }}
                src="/IconoV3.png"
                variant="square"
                fontSize="small"
              />
            </ListItemIcon>
            <Typography variant="inherit">Modificar mi perfil</Typography>
          </a>
        </MenuItem>

        <div>
          <MenuItem onClick={plegarPerfil}>
            <ListItemIcon>
              <ModificarPerfil fontSize="small" />
            </ListItemIcon>
            <a href="#">
              <Typography variant="inherit">
                Modificar mi perfil de proveedor
              </Typography>
            </a>
          </MenuItem>
        </div>

        <div>
          <MenuItem onClick={plegarPerfil}>
            <ListItemIcon>
              <Perfil fontSize="small" />
            </ListItemIcon>
            <a href="#">
              <Typography variant="inherit">
                Ver mi perfil de proveedor
              </Typography>
            </a>
          </MenuItem>
        </div>

        <div>
          <MenuItem onClick={plegarPerfil}>
            <ListItemIcon>
              <PriorityHighIcon fontSize="small" />
            </ListItemIcon>
            <a href="#">
              <Typography variant="inherit">Verificar mi identidad</Typography>
            </a>
          </MenuItem>
        </div>

        <MenuItem onClick={logOut}>
          <ListItemIcon>
            <ExitToAppIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">Cerrar sesión</Typography>
        </MenuItem>
      </Menu>

      {/*Desplegar notificaciones*/}
      <IconButton color="inherit" onClick={desplegarNoti}>
        <Badge badgeContent={1} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={despNoti}
        keepMounted
        open={Boolean(despNoti)}
        onClose={plegarNoti}
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
          img{
            width: 40px;
            height: 40px;
            border-radius: 50%;
          }
        `}
      </style>
    </div>
  );
}
