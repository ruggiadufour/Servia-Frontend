import {useContext, useState} from 'react'
import {IconButton, MenuItem, Menu} from '@material-ui/core'
import {Menu as MenuIcon} from '@material-ui/icons'

import {UserState} from '../../States/User'
export default function Hamburg() {
  const {UState} = useContext(UserState)

  const [despMenu, setdespMenu] = useState(null);
  const desplegarMenu = (event) => {
    setdespMenu(event.currentTarget);
  };
  const plegarMenu = () => {
    setdespMenu(null);
  };
  return (
    <div>
      <IconButton
        onClick={desplegarMenu}
        color="inherit"
        edge="end"
        aria-label="menu hamburguesa"
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={despMenu}
        keepMounted
        open={Boolean(despMenu)}
        onClose={plegarMenu}
      >
        {/*Usuario*/}
        <div>
          <a
            href="#"
          >
            <MenuItem onClick={plegarMenu}>Solicitar servicio</MenuItem>
          </a>
          <a
            href="#"
          >
            <MenuItem onClick={plegarMenu}>Mis servicios solicitados</MenuItem>
          </a>
        </div>

        {/*Proveedor*/}
        <div hidden={UState?.user.type===1}>
          <a
            href="#"
          >
            <MenuItem onClick={plegarMenu}>Crear publicación</MenuItem>
          </a>
          <a
            href="#"
          >
            <MenuItem onClick={plegarMenu}>Mis publicaciones</MenuItem>
          </a>
        </div>

        {/*Administrador*/}
        <div hidden={UState?.user.role.id!==2}>
          <a
            href="#"
          >
            <MenuItem onClick={plegarMenu}>Gestionar reportes</MenuItem>
          </a>
          <a
            href="#"
          >
            <MenuItem onClick={plegarMenu}>Verificar identidades </MenuItem>
          </a>
          {/*<a to={state.ruta+"/administrar-categorias"} className={classes.Estiloa}><MenuItem onClick={plegarMenu}>Administrar categorías </MenuItem></Link>*/}
        </div>
      </Menu>
    </div>
  );
}
