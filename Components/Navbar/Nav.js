//Material-UI
import { Button } from "@material-ui/core/";
//Framework
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import Image from "next/image";
//Components
import Filters from "./Filters";
import LoggedUser from "./LoggedUser";
import Hamburg from "./Hamburg";
import ThemeSelector from "./ThemeSelector";

import { UserState } from "../../States/User";
import { AlertState } from "../../States/Alert";

import styles from "../../styles/Navbar.module.css";

import { getCategories } from "../../Api/categories";

export default function Navbar({ setLDTheme }) {
  const router = useRouter();
  const { UState, NDispatch, CDispatch, CState, socket } = useContext(
    UserState
  );
  const { ADispatch } = useContext(AlertState);

  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);

  //Setting categories
  useEffect(async () => {
    let res = await getCategories();
    setCategories(res);
  }, []);

  //On select a category, set filters
  function selectCategory(e) {
    const cat_ = JSON.parse(e.target.value);
    setSelectedCat(e.target.value);
    setFilters({ ...filters, category_id: cat_.id, category: cat_.name });
  }

  //When the user receives a message, then update the chat state
  useEffect(() => {
    if (socket) {
      socket.once("push_message", (data) => {
        const parsed_message = JSON.parse(data);

        const update_chat = CState.map((chat) => {
          if (chat.id === parsed_message.chat.id) {
            chat.messages = [...chat.messages, parsed_message];
            const who = chat.who_start_it == parsed_message.sent_by;
            console.log(who);

            chat[!who ? "noread_sender" : "noread_receiver"] =
              chat[!who ? "noread_sender" : "noread_receiver"] + 1;
            return chat;
          } else {
            return chat;
          }
        });
        CDispatch({ type: "setChats", payload: update_chat });
      });

      socket.once("push_chat", (data) => {
        const parsed_chat = JSON.parse(data);
        console.log(parsed_chat);
        CDispatch({ type: "pushChat", payload: parsed_chat });
      });
    }
  }, [CState]);

  //Notifications handler
  useEffect(() => {
    if (socket) {
      socket.on("push_notification", (data) => {
        const parsed_notif = JSON.parse(data);
        NDispatch({ type: "pushNotification", payload: parsed_notif });
        ADispatch({
          type: "setAlert",
          payload: {
            desc: "¡Tenés una nueva notificación!",
            type: "info",
            open: true,
          },
        });
      });
    }
  }, [socket]);

  //State variables
  const [openFilters, setOpenFilters] = useState(false);
  const [word, setWord] = useState("");
  const [filters, setFilters] = useState(null);

  //Filters
  function search() {
    let aux_filters = {};
    if (filters) {
      aux_filters = { ...filters };
    }
    aux_filters["word"] = word;

    let query = "?";

    if (aux_filters.category_id) {
      query += `${aux_filters.is_profile == true ? "categories" : "category"}=${
        aux_filters.category_id
      }&`;
    }

    if (
      !aux_filters.is_profile === undefined ||
      aux_filters.is_profile === true
    ) {
      query += `location.province=${filters.province}&location.city=${filters.city}`;
      router.push(`/perfiles${query}`);
    } else {
      query += `public_user.location.province=${filters.province}&public_user.location.city=${filters.city}&`;
      query += word !== "" ? "&title_contains=" + word + "&" : "";
      if (aux_filters.category_id)
        query += `type=${aux_filters.typePublication}`;

      router.push(`/publicaciones${query}`);
    }
  }

  function cleanFilters() {
    setFilters({
      province: filters.province,
      city: filters.city,
      is_profile: true,
    });
  }

  function setFiltersCall(filters_) {
    setFilters(filters_);
  }

  return (
    <>
      <div
        className={`background-primary-1 centering  ${styles.navbar_container}`}
      >
        <div className={styles.brand}>
          <Image src="/icono2.png" layout="intrinsic" width={75} height={75} />
          <Link href="/">
            <a className="servia servia-font text-same-ever">Servia</a>
          </Link>
        </div>

        {/* Publication filter */}
        <div className={`${styles.filters} flex-col`}>
          {/* Input and buttons */}
          <div className={`${styles.filters__input}`}>
            {filters?.is_profile ? (
              <select
                name="select"
                className={`${styles.input_search} select`}
                onChange={selectCategory}
                value={selectedCat ? selectedCat : ""}
              >
                {categories.map((category, i) => (
                  <option key={i} value={JSON.stringify(category)}>
                    {category.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                className={styles.input_search}
                placeholder="¡Buscá un servicio!"
                value={word}
                onChange={(e) => {
                  setWord(e.target.value);
                }}
              />
            )}

            <button
              className="button-center"
              onClick={() => {
                setOpenFilters(true);
              }}
            >
              🚩
            </button>
            <button onClick={search} className="button-right">
              <span>🔎</span>
            </button>
          </div>

          {/* Data displayed on selecting filters */}
          <div className={`${styles.filters__info} `}>
            <strong>
              <span className={styles.span}>{"🚩 Filtros: "}</span>
            </strong>
            {filters && (
              <>
                <span className={`${styles.span} ${styles.province}`}>
                  {filters.province}
                </span>
                <span className={`${styles.span} ${styles.city}`}>
                  {filters.city}
                </span>
              </>
            )}
            <span className={`${styles.span} ${styles.type}`}>
              {filters?.is_profile
                ? "Perfiles"
                : filters?.typePublication
                ? "Publicaciones"
                : "Solicitudes de usuarios"}
            </span>
            {filters?.category_id && (
              <>
                <button
                  className={`${styles.button_clean}`}
                  onClick={cleanFilters}
                >
                  ❌
                </button>
                <span className={`${styles.span} ${styles.category}`}>
                  {filters.category}
                </span>
              </>
            )}
          </div>

          {/* Filters modal */}
          <Filters
            open={openFilters}
            setOpen={setOpenFilters}
            applyFilters={setFiltersCall}
            categories={categories}
          />
        </div>

        {UState?.jwt && (
          <>
            <LoggedUser />
            <Hamburg />
          </>
        )}

        {/* Login buttons */}
        {!UState?.jwt && (
          <div className={styles.login_buttons}>
            <Button
              variant="outlined"
              onClick={() => {
                router.push("/sesion");
              }}
            >
              Iniciar
            </Button>
            <Button
              onClick={() => {
                router.push("/sesion/registrar");
              }}
            >
              Registrar
            </Button>
          </div>
        )}

        <ThemeSelector setLDTheme={setLDTheme} />
      </div>

      <style jsx>{`
        .servia {
          font-size: 2.5rem;
        }
      `}</style>
    </>
  );
}
