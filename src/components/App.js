//Estilos
import "../styles/App.scss";
//Hooks
import { useEffect, useState } from "react";
import { Routes, Route, matchPath, useLocation } from "react-router-dom";
//Componentes
import fetchDataApi from "../services/Api";
import Header from "./Header";
import Filters from "./Filters";
import CharacterList from "./CharacterList";
import CharacterDetail from "./CharacterDetail";
import ErrorId from "./ErrorId";

function App() {
  //___________________________________________ VARIABLES ESTADO____________________________________________________________________
  //Datos de la Api.
  const [data, setData] = useState([]);
  // Filter nombre
  const [name, setName] = useState("");
  //Filter especie
  const [filterSpecie, setFilterSpecie] = useState([]);

  //________________________________________________ USEEFFECT_________________________________________________________________________

  useEffect(() => {
    fetchDataApi().then((dataResults) => {
      setData(dataResults);
    });
  }, []);

  //________________________________________ FUNCIONES HANDLER_______________________________________________________________________

  const handleForm = (ev) => {
    ev.preventDefault();
  };

  const handleSearchName = (value) => {
    setName(value);
  };

  const handleFilterSpecies = (value) => {
    if (filterSpecie.includes(value)) {
      const position = filterSpecie.indexOf(value);
      filterSpecie.splice(position, 1);
      setFilterSpecie([...filterSpecie]);
    } else {
      setFilterSpecie([...filterSpecie, value]);
    }
  };

  //_____________________________________FUNCIONES Y VARIABLES QUE AYUDEN A RENDERIZAR_______________________________________________
  //Map para traernos a FilterBySpecie solo los species
  const getSpecies = () => {
    const characterSpecie = data.map((character) => character.species);
    //la primera posicion del elemento del array
    const uniqueSpecies = characterSpecie.filter((character, index) => {
      return characterSpecie.indexOf(character) === index;
    });
    return uniqueSpecies;
  };
  // Filtro por nombre
  const filteredCharacters = data
    .filter((searchCharacter) =>
      searchCharacter.name
        .toLocaleLowerCase()
        .includes(name.toLocaleLowerCase())
    )
    //Filtrar especies
    .filter((character) => {
      if (filterSpecie.length === 0) {
        return true;
      } else {
        return filterSpecie.includes(character.species);
      }
    });

  //------------------------------- OBTENIENDO RUTAS. Accedemos a la propiedad del objeto URL.----------------------
  const { pathname } = useLocation();
  //MatchPath. Si consoleamos vemos que dentro de params está el characterId que nos interesa
  const dataUrl = matchPath("/character/:characterId", pathname);

  // Vamos a hacer una validación , así conseguimos el id
  const characterId = dataUrl !== null ? dataUrl.params.characterId : null;

  //Find. para encontrar en el array el elemento con el id. Nos debería devolver un elemento(un objeto en este caso). Lo pasamos a numero con parseInt
  const characterFoundId = data.find(
    (character) => character.id === parseInt(characterId)
  );

  //_____________________________________________________ RETURN_______________________________________________________________
  return (
    <div className="App">
      <Header></Header>
      <Routes>
        {/* Ruta home */}
        <Route
          path="/"
          element={
            <main>
              <Filters
                handleForm={handleForm}
                name={name}
                handleSearchName={handleSearchName}
                filterSpecie={filterSpecie}
                species={getSpecies()}
                handleFilterSpecies={handleFilterSpecies}
              ></Filters>

              <CharacterList
                characters={filteredCharacters}
                name={name}
              ></CharacterList>
            </main>
          }
        ></Route>
        {/* Creamos una nueva ruta dinámina .1.Se compone de la parte estática. 2. la dinámica (el id)*/}
        <Route
          path="/character/:characterId"
          element={<CharacterDetail character={characterFoundId} />}
        ></Route>
        <Route path="*" element={<ErrorId></ErrorId>}></Route>
      </Routes>
    </div>
  );
}

export default App;
