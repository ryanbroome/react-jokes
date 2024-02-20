import React, { useState } from "react";
import Joke from "./Joke";

const JokeList2 = () => {
  const [jokes, setJokes] = useState([{ id: 123, text: "TestJoke", votes: 0 }]);

  const vote = (id, amt) => {
    // Find index of joke via passed in id
    const jokeIndex = jokes.findIndex((joke) => joke.id === id);

    // clone jokes array and update the object / joke we want based on id
    const updatedJokes = [...jokes];

    // Update the number of votes for our joke
    updatedJokes[jokeIndex] = {
      ...updatedJokes[jokeIndex],
      votes: updatedJokes[jokeIndex].votes + amt,
    };

    // Update jokes with the new array including updated joke
    setJokes(updatedJokes);
  };

  return (
    <>
      <Joke
        id={jokes[0].id}
        text={jokes[0].text}
        vote={vote}
        votes={jokes[0].votes}
      />
      <div>This is a JokeList</div>
    </>
  );
};

export default JokeList2;
