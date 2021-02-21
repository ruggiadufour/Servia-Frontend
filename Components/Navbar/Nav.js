//Material-UI
import { AppBar, Toolbar, Typography } from "@material-ui/core/";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useContext, useEffect } from "react";

import Filters from "./Filters";
import styles from "../../styles/Navbar.module.css";
import { FilterState } from "../../States/Filter";
export default function Navbar() {
  const { FState, FDispatch } = useContext(FilterState);
  const router = useRouter();

  //State variables
  const [openFilters, setOpenFilters] = useState(false);
  const [word, setWord] = useState("");
  const [filters, setFilters] = useState(null);

  useEffect(()=>{
    if(filters!==null)
    FDispatch({ type: "setFilter", payload: {...filters, word:""} });
  },[filters])

  function search() {
    if (word !== "") {
      let aux_filters = {};
      if (filters) {
        aux_filters = { ...filters };
      }

      aux_filters["word"] = word;

      FDispatch({ type: "setFilter", payload: aux_filters });

      if (router.pathname !== "/busqueda") {
        router.push("/busqueda");
      }
    }
  }

  function cleanFilters(){
    FDispatch({ type: "setFilter", payload: {word: word}});
    setFilters(null)
  }

  return (
    <div className="background-primary-1">
      <div className={`centering general-width ${styles.navbar_container}`}>
        <Typography component="h1" variant="h5">
          <Link href="/">Servia</Link>
        </Typography>

        {/* Publication filter */}
        <div className={styles.filters}>
          {/* Input and buttons */}
          <div className={styles.filters__input}>
            <input
              type="text"
              className={styles.input_search}
              placeholder="¡Buscá un servicio!"
              value={word}
              onChange={(e) => {
                setWord(e.target.value);
              }}
            />
            <button
              className="button-left background-secondary-2"
              onClick={search}
            >
              🔎
            </button>
            <button
              onClick={() => {
                setOpenFilters(true);
              }}
              className="button-right background-secondary-2"
            >
              <span>🚩</span>
            </button>
          </div>

          {/* Data displayed on selecting filters */}
          <div className={styles.filters__info}>
            {FState && FState.state.category_id && (
              <>
                <button className={`${styles.button_clean}`} onClick={cleanFilters}>❌</button>
                <span className={styles.span}>{"Buscando: "}</span>
                <span className={`${styles.span} ${styles.type}`}>
                  {FState.state.is_profile
                    ? "Perfiles"
                    : FState.state.typePublication
                    ? "Publicaciones"
                    : "Solicitudes de usuarios"}
                </span>
                <span className={`${styles.span} ${styles.category}`}>
                  {FState.state.category}
                </span>
                {!FState.state.is_profile &&
                  FState.state.typePublication &&
                  FState.state.services.map((service, i) => (
                    <span
                      className={`${styles.span} ${styles.services}`}
                      key={i}
                    >
                      {service.name}
                    </span>
                  ))}
              </>
            )}
          </div>

          {/* Filters modal */}
          <Filters
            open={openFilters}
            setOpen={setOpenFilters}
            applyFilters={setFilters}
          />
        </div>

        {/* Login buttons */}
        <div className={styles.login_buttons}>
          <button className="button-left  background-secondary-2">
            Iniciar
          </button>
          <button className="button-right background-secondary-2">
            Registrar
          </button>
        </div>
      </div>
    </div>
  );
}
