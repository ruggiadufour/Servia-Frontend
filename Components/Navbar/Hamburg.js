import {useState} from 'react'
import {IconButton, MenuItem, Typography, Menu} from '@material-ui/core'
import {Menu as MenuIcon} from '@material-ui/icons'
export default function Hamburg() {
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
        <a
          href="#"
        >
          <MenuItem onClick={plegarMenu}>Crear una nueva cuenta</MenuItem>
          <hr />
        </a>

        <a
          href="#"
        >
          <MenuItem onClick={plegarMenu}>
            <Typography variant="inherit">Explorar servicios</Typography>
          </MenuItem>
        </a>

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
        <div>
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
        <div >
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
