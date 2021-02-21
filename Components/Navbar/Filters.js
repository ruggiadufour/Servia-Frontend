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
  const [services, setServices] = useState({ data: [], category_id: null });
  const [filters, setFilters] = useState({
    is_profile: false,
    typePublication: false,
  });

  function handleClose() {
    setOpen(false);
  }

  useEffect(async () => {
    let res = await getCategories();
    if (res.length !== 0) {
      setServices({ data: res[0].services, category_id: res[0].id, category: res[0].name });
    }
    setCategories(res);
  }, []);

  function selectCategory(e) {
    let aux_cat = JSON.parse(e.target.value);
    let aux_services = aux_cat.services.map((service) => {
      service["selected"] = false;
      return service;
    });
    let services_ = {};
    services_["data"] = aux_services;
    services_["category_id"] = aux_cat.id;
    services_["category"] = aux_cat.name;

    setServices(services_);
  }

  function handleSelect(index) {
    let aux_services = [...services.data];
    aux_services[index].selected = !aux_services[index].selected;
    setServices({ ...services, data: aux_services });
  }

  function saveFilters(){
    let aux_services = services.data.filter(service => service.selected === true)
    applyFilters({...filters, category_id: services.category_id, category: services.category, services: aux_services})
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
                  label="Filtrar por publicaciones de solicitudes de servicios de usuarios."
                />
              </ListItem>
            </>
          )}

          <ListItem>
            <select
              name="select"
              className="w-100 select"
              onChange={selectCategory}
            >
              {categories.map((category, i) => (
                <option key={i} value={JSON.stringify(category)}>
                  {category.name}
                </option>
              ))}
            </select>
          </ListItem>

          {!filters.is_profile && (
            <>
              <ListItem>
                {filters.typePublication && (
                  <Grid
                    container
                    spacing={2}
                    justify="space-around"
                    alignItems="center"
                  >
                    {services &&
                      services.data.map((service, i) => (
                        <Grid key={i} item xs={6} sm={4} md={3} lg={2}>
                          <SelectService
                            service={service}
                            handleSelect={handleSelect}
                            index={i}
                          />
                        </Grid>
                      ))}
                  </Grid>
                )}
              </ListItem>
            </>
          )}
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

function SelectService({ service, handleSelect, index }) {
  const handleClick = () => {
    handleSelect(index);
  };

  return (
    <div>
      <Chip
        clickable
        color="primary"
        label={service.name}
        icon={service.selected ? <Done /> : <Clear />}
        onClick={handleClick}
      />
    </div>
  );
}
