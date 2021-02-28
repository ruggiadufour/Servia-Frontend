import { useState, useEffect, useContext } from "react";
//Material-UI
import {
  Typography,
  TextField,
  FormControl,
  Button,
  Grid,
  LinearProgress
} from "@material-ui/core";
import UploadImage from "../../Components/UploadImage";
import { UserState } from "../../States/User";
//API client
import { getCategories } from "../../Api/categories";
import { deleteFile } from "../../Api/uploadAPI";

import {useRouter} from 'next/router'

export default function CreateModify({
  type,
  modify,
  loading,
  setLoading,
  submit,
  publicationModify,
}) {
  const router = useRouter()
  const { UState } = useContext(UserState);
  //States
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [toDeleteIds, setToDeleteIds] = useState([]);
  const [data, setData] = useState({
    title: modify ? publicationModify.title : "",
    price: modify ? publicationModify.price : 0,
    description: modify ? publicationModify.description : "",
    type: type,
    category: modify ? publicationModify.category.id : "",
    public_user: UState?.user.public_user.id,
  });

  useEffect(async () => {
    //Setting select categories 
    const cat = await getCategories();
    setCategories(cat);
    if (!modify) {
      setData({
        ...data,
        category: cat[0].id,
      });
    }
  }, []);

  //Handle input change
  function handleChange(e) {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  }

  //Setting selected category
  function selectCategory(e) {
    const category = JSON.parse(e.target.value);
    setData({
      ...data,
      category: category,
    });
  }

  //Save the data
  async function save(e) {
    e.preventDefault();
    setLoading(true);

    await Promise.all(toDeleteIds.map(async (id_delete)=>{
      await deleteFile(id_delete, UState.jwt)
    }))
    
    submit(data, images);
  }

  //If the user deleted a preload image, then we save the id to later delete from the server
  function toDelete(id){
    setToDeleteIds((prev)=>[...prev, id])
  }

  function cancel() {
    router.push(`/publicaciones?type=${type}&public_users=${UState.user.id}`)
  }

  return (
    <>
      <form onSubmit={save} className="medium-width centering-t ">
        <FormControl color="primary" fullWidth>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={1}
          >
            <Grid item xs={12}>
              <Typography variant="h5" component="h1" align="center">
                {modify
                  ? `Modificar ${type ? "publicación" : "solicitud"}`
                  : `Crear ${type ? "publicación" : "solicitud"}`}
              </Typography>
            </Grid>

            <Grid item sm={8} xs={12}>
              <TextField
                onChange={handleChange}
                value={data.title}
                name="title"
                label="Título de la publicación"
                variant="filled"
                maxLength={50}
                required
                className="w-100"
              />
            </Grid>

            <Grid item sm={4} xs={12}>
              <TextField
                onChange={handleChange}
                value={data.price}
                name="price"
                type="number"
                id="formatted-numberformat-input"
                label="Precio estimado"
                variant="filled"
                className="w-100"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography component="h2" align="left">
                Categoría
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <select
                name="select"
                className="w-100 select"
                onChange={selectCategory}
                value={data.category}
              >
                {categories.map((cat, i) => (
                  <option key={i} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </Grid>

            <Grid item xs={12}>
              <TextField
                onChange={handleChange}
                value={data.description}
                name="description"
                label="Descripción"
                maxLength={400}
                multiline
                variant="filled"
                className="w-100"
              />
            </Grid>

            <Grid item xs={12}>
              <UploadImage
                setFiles={setImages}
                Files={images}
                amount={5}
                preloadImages={modify?publicationModify.images:[]}
                setToDelete={toDelete}
              />
            </Grid>

            <Grid item xs={12}>
              {loading && <LinearProgress />}
            </Grid>

            <Grid item xs={6} align="center">
              <Button
                disabled={loading}
                type="submit"
                size="large"
                variant="contained"
                color="primary"
              >
                Guardar
              </Button>
            </Grid>
            <Grid item xs={6} align="center">
              <Button
                onClick={cancel}
                size="large"
                variant="contained"
                color="secondary"
              >
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </FormControl>
      </form>
    </>
  );
}
