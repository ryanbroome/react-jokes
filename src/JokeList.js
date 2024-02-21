import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";

import "./JokeList.css";

const JokeList = ({ numJokesToGet = 5 }) => {
  const [jokes, setJokes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(
    function getJokesWhenMounted() {
      async function getJokes() {
        //? Start
        let j = [...jokes];
        let seenJokes = new Set();
        //! End
        try {
          while (j.length < numJokesToGet) {
            const res = await axios.get(`https://icanhazdadjoke.com`, {
              headers: { Accept: "application/json" },
            });

            let { ...jokeObj } = res.data;

            if (!seenJokes.has(jokeObj.id)) {
              seenJokes.add(jokeObj.id);
              j.push({ ...jokeObj, votes: 0 });
            } else {
              console.error("duplicate found!");
            }
          }

          setJokes(j);
          setIsLoading(false);
        } catch (err) {
          console.error(err);
        }
      }
      // ? Start
      if (jokes.length === 0) getJokes();
      //   ! End
    },
    [numJokesToGet, jokes]
  );

  function generateNewJokes() {
    setJokes([]);
    setIsLoading(true);
  }

  //   ?Start
  function vote(id, delta) {
    setJokes((allJokes) => allJokes.map((j) => (j.id === id ? { ...j, votes: j.votes + delta } : j)));
  }
  // !End

  if (isLoading) {
    return (
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    );
  }

  let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

  return (
    <div className="JokeList">
      <button
        className="JokeList-getmore"
        onClick={generateNewJokes}>
        Get New Jokes
      </button>

      {sortedJokes.map((j) => (
        <Joke
          text={j.joke}
          key={j.id}
          id={j.id}
          votes={j.votes}
          vote={vote}
        />
      ))}
    </div>
  );
};

export default JokeList;
