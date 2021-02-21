import React, { useReducer, createContext} from "react";

const initialState = {
    estadoEditado: false,
};

const reducer = (state, action) => {
    switch (action.type) {
        case "setFalso":
            return {...state, estadoEditado: false};
        case "setVerdad":
            return {...state, estadoEditado: true};
        default:
            return { ...state };
    }
};

const ObtenerEstado = createContext(initialState);

function ProveerEstadoCategoria({ children }) {
    const [stateCategoria, dispatchCategoria] = useReducer(reducer, initialState);

    return (
        <ObtenerEstado.Provider value={{ stateCategoria, dispatchCategoria }}>
            {children}
        </ObtenerEstado.Provider>
    );
}

export { ObtenerEstado, ProveerEstadoCategoria };