import React, { useState, useEffect, useRef } from "react";

const API_URL = "http://swapi.dev/api/people/";

function App() {
  const inputSearch = useRef(null);
  const [people, setPeople] = useState([]);
  const [details, setDetails] = useState({});
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPeople();
  }, [page]);

  const fetchPeople = async () => {
    try {
      const response = await fetch(`${API_URL}?page=${page}`);
      if (!response.ok) {
        throw new Error("Error fetching data");
      }
      const data = await response.json();
      setPeople(data.results);
      setError(null);
    } catch (err) {
      setError("Error fetching data");
    }
  };

  const showDetails = async (character) => {
    try {
      const response = await fetch(character.url);
      if (!response.ok) {
        throw new Error("Error fetching character details");
      }
      const data = await response.json();
      setDetails(data);
      setError(null);
    } catch (err) {
      setError("Error fetching character details");
    }
  };

  const onSearchSubmit = (event) => {
    if (event.key !== "Enter") return;

    const text = inputSearch.current.value;
    if (text.trim() === "") {
      setError("Please enter a character name");
      return;
    }

    setDetails({});
    fetchSearchResults(text);
  };

  const fetchSearchResults = async (name) => {
    try {
      const response = await fetch(`${API_URL}?search=${name}`);
      if (!response.ok) {
        throw new Error("Error fetching search results");
      }
      const data = await response.json();
      setPeople(data.results);
      setError(null);
    } catch (err) {
      setError("Error fetching search results");
    }
  };

  const onChangePage = (next) => {
    setPage((prevPage) => prevPage + next);
  };

  return (
    <div>
      <input
        ref={inputSearch}
        onKeyDown={onSearchSubmit}
        type="text"
        placeholder="Search for a character"
      />
      {error && <div>{error}</div>}
      <ul>
        {people.map((character) => (
          <li key={character.name} onClick={() => showDetails(character)}>
            {character.name}
          </li>
        ))}
      </ul>

      <section>
        <button onClick={() => onChangePage(-1)} disabled={page === 1}>
          Prev
        </button>{" "}
        | {page} |{" "}
        <button onClick={() => onChangePage(1)} disabled={!people.length}>
          Next
        </button>
      </section>

      {details && (
        <aside>
          <h1>{details.name}</h1>
          <ul>
            <li>height: {details.height}</li>
            <li>mass: {details.mass}</li>
            <li>Year of Birth: {details.birth_year}</li>
          </ul>
        </aside>
      )}
    </div>
  );
}

export default App;
