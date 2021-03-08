import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import Router from "next/router";
import { UserState } from "../../States/User";
import { deleteFile } from "../../Api/uploadAPI";
import { getProvinces, getCities } from "../../Api/locations";
import { getCategories } from "../../Api/categories";
import { getUser } from "../../Api/users";

//Material UI
import {
  LinearProgress,
  Typography,
  TextField,
  Button,
  Divider,
  Grid,
  Checkbox,
  FormControlLabel,
  Hidden,
} from "@material-ui/core/";
import UploadImage from "../../Components/UploadImage";

export default function RegisterModify({
  submit,
  loading,
  setLoading,
  message,
  setMessage,
  setProfile,
  profile,
  register,
}) {
  const { UState, UDispatch } = useContext(UserState);

  //States
  const [profile_link, setProfile_link] = useState([]);
  const [isProvider, setIsProvider] = useState(
    UState?.user?.type === 2 ? true : false
  );
  const [categories, setCategories] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [user, setUser] = useState({
    username: UState?.user?.username || "",
    email: UState?.user?.email || "",
    password: "",
    password_again: "",
    type: UState?.user?.type || 1,
    waiting_verification: UState?.user?.waiting_verification || false,
    name: UState?.user?.public_user?.name || "",
    surname: UState?.user?.public_user?.surname || "",
    show_phone: UState?.user?.public_user?.show_phone || false,
    verified: UState?.user?.public_user?.verified || false,
    phone: UState?.user?.public_user?.phone || "",
    description: UState?.user?.public_user?.description || "",
    state: UState?.user?.public_user?.state || false,
    province: UState?.user?.public_user?.province || "Chaco",
    city: UState?.user?.public_user?.city || "PRESIDENCIA ROQUE SAENZ PENA",
  });
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);

  //Get provinces and set state
  useEffect(async () => {
    if (register) {
      setProvinces(await getProvinces());
      setCities(await getCities("Chaco"));
    } else {
      setProvinces(await getProvinces());
      setCities(await getCities(user.province));

      setUser({
        ...user,
        province: user.province,
        city: user.city,
      });
    }
  }, []);

  //On select a province it has to update the city select
  async function selectProvince(e) {
    const province_ = e.target.value;
    const cities_ = await getCities(province_);
    setCities(cities_);

    setUser({
      ...user,
      province: province_,
      city: cities_[0].nombre,
    });
  }

  //This sets the profile image link to see the image loaded in UploadImage component
  useEffect(() => {
    if (UState?.user?.public_user) {
      if (UState.user.public_user?.profile) {
        setProfile_link([UState.user.public_user.profile]);
      }
    }
  }, [UState]);

  //Handle change of inputs
  const handleChange = (e) => {
    if (message !== "") setMessage("");
    let value = e.target.value;
    let name = e.target.name;
    setUser({
      ...user,
      [name]: value,
    });
  };

  //The user saves the data
  const save = (e) => {
    e.preventDefault();
    if (
      user.email.search("[.][a-z][a-z]") === -1 ||
      user.email.search("[.].*[0-9].*") !== -1
    ) {
      setMessage("El email se encuentra escrito incorrectamente");
    } else {
      if (register && user.password !== user.password_again) {
        setMessage("Las contraseñas no coinciden");
      } else if (register && user.password.length < 8) {
        setMessage("La contraseña debe tener al menos 8 caracteres");
      } else {
        send();
      }
    }
  };

  function send() {
    setLoading(true);
    let user_ = { ...user };
    user_["type"] = isProvider ? 2 : 1;
    user_["categories"] = categories;

    //If the user deleted a image what was uploaded in the server, then that file image has to be deleted
    if (deleteId) {
      deleteFile(
        deleteId,
        UState.jwt,
        () => {
          console.log("image deleted");
          submit(user_);
        },
        () => {
          console.log("Error al borrar la imagen de perfil");
        }
      );
    } else {
      submit(user_);
    }
  }

  //Set the image id deleted
  function setToDelete(id) {
    setDeleteId(id);
  }

  //Handle change checkboxes
  const changeCheckbox = (e) => {
    let value = e.target.checked;
    let name = e.target.name;
    setUser({
      ...user,
      [name]: value,
    });
  };

  return (
    <div className="medium-width centering-t">
      <form onSubmit={save}>
        <Grid spacing={2} container justify="space-between" alignItems="center">
          <Grid item xs={12}>
            <Typography variant="h5" component="h1" align="center">
              {register ? "Registrar usuario" : "Modificar perfil"}
            </Typography>
          </Grid>

          <Grid item xs={12} lg={6} md={6} sm={6}>
            <TextField
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              label="Nombre"
              variant="filled"
              required
              className="w-100"
              disabled={!register && UState?.user?.public_user.verified}
            />
          </Grid>

          <Grid item xs={12} lg={6} md={6} sm={6}>
            <TextField
              type="text"
              name="surname"
              value={user.surname}
              onChange={handleChange}
              label=" Apellido"
              variant="filled"
              required
              className="w-100"
              disabled={!register && UState?.user?.public_user.verified}
            />
          </Grid>
          <Grid item xs={12}>
            {!register && UState?.user?.public_user.verified && (
              <Typography color="error">
                Los usuarios modificados no pueden modificar su nombre y
                apellido. Si realmente quiere modificarlos, contacte a un
                administrador.
              </Typography>
            )}
          </Grid>

          {/* Locations */}
          <Grid item xs={12} lg={6} md={6} sm={12}>
            <select
              name="select"
              className="w-100 select"
              onChange={selectProvince}
              value={user.province}
              required={true}
            >
              {provinces.map((province, i) => (
                <option key={i} value={province.nombre}>
                  {province.nombre}
                </option>
              ))}
            </select>
          </Grid>
          <Grid item xs={12} lg={6} md={6} sm={12}>
            <select
              name="select"
              className="w-100 select"
              onChange={(e) => {
                setUser({
                  ...user,
                  city: e.target.value,
                });
              }}
              value={user.city}
              required={true}
            >
              {cities.map((city, i) => (
                <option key={i} value={city.nombre}>
                  {city.nombre}
                </option>
              ))}
            </select>
          </Grid>

          <Grid item xs={12}>
            <UploadImage
              setFiles={setProfile}
              Files={profile}
              amount={1}
              preloadImages={profile_link}
              setToDelete={setToDelete}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="email"
              value={user.email}
              onChange={handleChange}
              label="📧 Correo electrónico"
              variant="filled"
              type="email"
              required
              className="w-100"
            />
          </Grid>

          <Grid item xs={12} lg={6} md={6} sm={6}>
            <TextField
              name="username"
              value={user.username}
              onChange={handleChange}
              label="👩 Usuario"
              variant="filled"
              required
              className="w-100"
            />
          </Grid>

          <Grid item xs={12} lg={6} md={6} sm={6}>
            <TextField
              type="number"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              label="📱 Telefono"
              variant="filled"
              className="w-100"
            />
          </Grid>
          <Divider />

          {register && (
            <>
              <Grid item xs={12} lg={6} md={6} sm={6}>
                <TextField
                  required={register}
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  type="password"
                  label="Contraseña"
                  variant="filled"
                  className="w-100"
                />
              </Grid>

              <Grid item xs={12} lg={6} md={6} sm={6}>
                <TextField
                  required={register}
                  name="password_again"
                  value={user.password_again}
                  onChange={handleChange}
                  type="password"
                  label="Repetir contraseña"
                  variant="filled"
                  className="w-100"
                />
              </Grid>
            </>
          )}

          <Hidden xlDown={message === ""}>
            <Grid item xs={12}>
              <Typography color="error">{message}</Typography>
            </Grid>
          </Hidden>

          <Grid item xs={12}>
            <OkProveedor
              isProvider={isProvider}
              setIsProvider={setIsProvider}
            />
          </Grid>

          {isProvider && (
            <>
              <Grid item xs={12} lg={6} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={user.state}
                      name="state"
                      onChange={changeCheckbox}
                    />
                  }
                  label="Pausar mis servicios (no aparecerás en las búsquedas)"
                />
              </Grid>

              <Grid item xs={12} lg={6} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="show_phone"
                      checked={user.show_phone}
                      onChange={changeCheckbox}
                    />
                  }
                  label="Mostrar mi número de teléfono"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  onChange={handleChange}
                  name="description"
                  value={user.description}
                  id="filled-basic"
                  label="📄 Descripción sobre mi trabajo"
                  multiline
                  variant="filled"
                  className="w-100"
                />
              </Grid>

              <div className="flex-row">
                <SetCategoriesToProvide
                  UState={UState?.user}
                  setCategories={setCategories}
                  categories={categories}
                  register={register}
                />
              </div>
            </>
          )}

          <Grid item xs={6} align="center">
            <Button
              type="submit"
              size="large"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {register ? "Registrar" : "Guardar"}
            </Button>
          </Grid>
          <Grid item xs={6} align="center">
            <Button
              size="large"
              variant="contained"
              color="secondary"
              onClick={() => {
                Router.push("/");
              }}
            >
              Cancelar
            </Button>
          </Grid>

          <div hidden={!loading} className="w-100">
            <LinearProgress />
          </div>
          {register && (
            <Grid item xs={12}>
              <Link href="/sesion">
                <a className="centering text-secondary-1">
                  ¿Ya tenés una cuenta?
                </a>
              </Link>
            </Grid>
          )}
        </Grid>
      </form>
    </div>
  );
}

function OkProveedor({ setIsProvider, isProvider }) {
  const manejarCambio = () => {
    setIsProvider(!isProvider);
  };

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={isProvider}
          onChange={manejarCambio}
          name="is_provider"
          color="primary"
        />
      }
      label="👷‍♂️ Soy proveedor de servicios"
    />
  );
}

function SetCategoriesToProvide({
  UState,
  categories,
  setCategories,
  register,
}) {
  const [allCategories, setAllCategories] = useState([]);

  useEffect(async () => {
    let cat_aux = {};

    if (!register) {
      const public_user = await getUser(UState.public_user.id);

      public_user.categories.map((pu_cat) => {
        if (!cat_aux.hasOwnProperty(String(pu_cat.id))) {
          cat_aux[String(pu_cat.id)] = { ...pu_cat, selected: true };
        }
      });
      setCategories(public_user.categories.map((cat) => cat.id));
    }

    const categories = await getCategories();
    categories.map((pu_cat) => {
      if (!cat_aux.hasOwnProperty(String(pu_cat.id))) {
        cat_aux[String(pu_cat.id)] = { ...pu_cat, selected: false };
      }
    });

    setAllCategories(cat_aux);
  }, []);

  function select(id) {
    let aux = { ...allCategories };
    aux[id] = { ...aux[id], selected: !aux[id].selected };
    setAllCategories(aux);

    //let is = userCategories.some(cat=> cat===Number(id))
    let is = categories.some((cat) => cat === Number(id));

    if (!is) {
      setCategories([...categories, Number(id)]);
    } else {
      setCategories(categories.filter((cat) => cat !== Number(id)));
    }
  }

  return (
    <>
      {Object.entries(allCategories).map((cat, i) => (
        <span
          onClick={() => {
            select(cat[0]);
          }}
          className={`rounded-span ${
            cat[1].selected ? "selected" : "unselected"
          }`}
          key={i}
        >{`${cat[1].selected ? "👍" : "👎"} ${cat[1].name}`}</span>
      ))}
      <style jsx>
        {`
          .selected {
            background-color: lightgreen;
          }
          .unselected {
            background-color: salmon;
          }
        `}
      </style>
    </>
  );
}
