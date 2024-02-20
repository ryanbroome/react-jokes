import React from "react";

const Joke = (props) => {
  const { id, text, vote, votes } = props;
  return (
    <>
      <div className="Joke-textarea">
        <h3>Joke</h3>
        This is a joke component it has props.
        <p>State.id = {id}</p>
        <p>State.text = {text}</p>
        <p>State.votes = {votes}</p>
      </div>
      <button
        onClick={() => {
          vote(id, -1);
        }}>
        Vote -
      </button>
      <button
        onClick={() => {
          vote(id, 1);
        }}>
        Vote +
      </button>
    </>
  );
};

export default Joke;
