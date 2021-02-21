import { useReducer, createContext } from "react";
const initState = null;

const reducer = (state, action) => {
    console.log(action.payload)
  switch (action.type) {
    case "setFilter":
      return { state: action.payload };
    case "cleanFilter":
      return null;
    default:
      return { ...state };
  }
};

const FilterState = createContext(initState);

function ProvideFilterState({ children }) {
  const [state, dispatch] = useReducer(reducer, initState);

  return (
    <FilterState.Provider value={{ FState: state, FDispatch: dispatch }}>
      {children}
    </FilterState.Provider>
  );
}

export { FilterState, ProvideFilterState };
