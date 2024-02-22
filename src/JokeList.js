/** JOKELIST COMPONENT - NO CURRENT TESTING
 *? modules:
 * react, { useState, useEffect }
 * axios
 *
 *? other components:
 * <Joke - props: { id, text, votes, vote } />
 *
 *? styling sheet:
 *  "./JokeList.css"
 *
 *? Example:
 * <JokesList numJokesToGet={ 5 } />
 *
 * **/

import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

const JokeList = ({ numJokesToGet = 5 }) => {
  //?create a piece of state called jokes and method to update jokes called setJokes, using useState, start with an initialValue of an empty array. We will be filling this with jokes, clearing out and filling again as needed
  const [jokes, setJokes] = useState([]);
  //?create a pice of state called isLoading and method to update isLoading called setIsLoading, using useState, start with an intialValue of an empty array. We will be toggling this back and forth true to false false to true and will determine whether the user sees a spinner DOM element or the jokes mapped out into elements in the DOM.
  const [isLoading, setIsLoading] = useState(true);

  useEffect(
    function getJokesWhenMounted() {
      async function getJokes() {
        //? create copy of state, to get a stable version, since state updates are async
        let j = [...jokes];
        //? create a set / no duplicate values to list all joke ids that have been seen, to avoid seeing duplicate jokes
        let seenJokes = new Set();

        //? try making an ajax calls, lots can go wrong here API could be down, this will catch and print errors if so
        try {
          //? logic to say how many jokes to get in this case however many are in array vs defaultproperty numJokesToGet
          while (j.length < numJokesToGet) {
            //? axios ajax call, w/options object  to get joke save to variable res
            const res = await axios.get(`https://icanhazdadjoke.com`, {
              headers: { Accept: "application/json" },
            });
            //? destructure all contents of res.data into jokeObj variable. jokeObj will equal an object with all data in it
            let { ...jokeObj } = res.data;
            //? check joke id set for res.data.id / jokeObj.id
            if (!seenJokes.has(jokeObj.id)) {
              //? if the id is not there, add it to the set
              seenJokes.add(jokeObj.id);
              //? and if the id is not there push the joke into the j / aka. copy of jokes state array
              j.push({ ...jokeObj, votes: 0 });
            } else {
              //? if id is there already console.log a message "duplicate found"
              console.error("duplicate found!");
            }
          }
          //? setJokes state to be the copy array we worked with in the useEffect by passing in to the setter function setJokes
          setJokes(j);
          //? set isLoading state to equal false since we aren't loading anymore
          setIsLoading(false);
          //? catch any errors or any issues with the ajax call, API down, bad URL, etc. and console.error those errors
        } catch (err) {
          console.error(err);
        }
      }

      //? if jokes / piece of state .length strictly equals zero run the getJokes function
      if (jokes.length === 0) getJokes();
    },
    //? if numJokesToGet or jokes changes re-render the component / this whole script / function
    [numJokesToGet, jokes]
  );
  //? generate new jokes function, set two pieces of state back to starting value, setJokes to empty array, setIsLoading to back to true
  function generateNewJokes() {
    //? set "jokes" piece of state to be an empty array, with length 0. Triger a rerun of getJokes.
    setJokes([]);
    //? set piece of state isLoading to true, so a spinner is displayed while jokes are fetched
    setIsLoading(true);
  }

  //? vote function, when executed and pass in an id and an amount to change by will update pice of state. It
  //? updates particular joke, finds it by the id then updates it's property votes by delta amount
  function vote(id, delta) {
    setJokes((allJokes) => allJokes.map((j) => (j.id === id ? { ...j, votes: j.votes + delta } : j)));
  }
  // !End
  //? if isLoading piece of state returns true then render/return these "loading spinner" DOM elements
  if (isLoading) {
    return (
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    );
  }
  //? create an array called sortedJokes, like this, first spread what elements are in piece of state jokes array into a new array, then sort that array returning an array with the highest "votes" first to least "votes"
  let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);
  //? if isLoading piece of state returns false then render/return these DOM elements, including a Component called Joke which accepts props : {joke, id, votes, vote}
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
//? export component for other Components to use
export default JokeList;
