import { useEffect, useState } from "react";
import List from "@material-ui/core/List";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import {
  Chip,
  Grid,
  Button,
  ListItem,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core/";
import { Done as Done, Clear as Clear } from "@material-ui/icons";
import { getCategories } from "../../Api/categories";

export default function Filters({ open, setOpen, applyFilters }) {
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [filters, setFilters] = useState({
    is_profile: false,
    typePublication: true,
  });

  function handleClose() {
    setOpen(false);
  }

  useEffect(async () => {
    let res = await getCategories();
    if (res.length !== 0) {
      setSelectedCat(res[0])
      setFilters({...filters, category: res[0].name, category_id: res[0].id})
    }
    setCategories(res);
  }, []);

  function selectCategory(e) {
    let aux_cat = JSON.parse(e.target.value);
    setSelectedCat(aux_cat)

    let filters_ = {}
    filters_["category_id"] = aux_cat.id;
    filters_["category"] = aux_cat.name;

    setFilters({...filters, ...filters_});
  }

  function saveFilters(){
    applyFilters({...filters})
    setOpen(false);
  }
  
  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
      >
        <DialogTitle id="simple-dialog-title">
          Seleccione los filtros deseados
        </DialogTitle>
        <List>
          <ListItem>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.is_profile}
                  name="type"
                  onChange={() => {
                    setFilters({ ...filters, is_profile: !filters.is_profile });
                  }}
                />
              }
              label="Filtrar por perfiles de proveedores de servicio"
            />
          </ListItem>

          {!filters.is_profile && (
            <>
              <ListItem>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!filters.typePublication}
                      name="type"
                      onChange={() => {
                        setFilters({
                          ...filters,
                          typePublication: !filters.typePublication,
                        });
                      }}
                    />
                  }
                  label="Filtrar por publicaciones de solicitudes de servicios de usuarios (estas publicaciones son creadas por personas que están buscando un servicio en especial)."
                />
              </ListItem>
            </>
          )}

          <ListItem>
            <select
              name="select"
              className="w-100 select"
              onChange={selectCategory}
              value={selectedCat?selectedCat.name:""}
            >
              {categories.map((category, i) => (
                <option key={i} value={JSON.stringify(category)}>
                  {category.name}
                </option>
              ))}
            </select>
          </ListItem>
        </List>
        <Button
          onClick={() => {
            setOpen(false);
          }}
          variant="contained"
          color="inherit"
        >
          Cancelar
        </Button>
        <Button onClick={saveFilters} variant="contained" color="secondary">
          Guardar
        </Button>
      </Dialog>
    </div>
  );
}