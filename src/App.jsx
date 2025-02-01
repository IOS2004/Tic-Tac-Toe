import './App.css';
import { useState } from 'react';

function Square({value, onSquareClick, style}) {
  return (
    <button className="square" onClick={onSquareClick} style={style}>
      {value}
    </button>
  );
}

function Board({xIsNext, squares, onPlay}) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares).length != 0) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext)
      nextSquares[i] = "X";
    else
      nextSquares[i] = "O";
    onPlay(nextSquares);
  }
  const winners = calculateWinner(squares);
  let status;
  if (winners.length == 0) {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  else if (winners[0] == -1) {
    status = "It's a draw!";
  }
  else {
    status = "Winner: " + squares[winners[0]];
  } 
  let draw = [];
  for (let i = 0; i < 9; i += 3)
  {
    let row = [];
    for (let j = 0; j < 3; j++)
    {
      if (winners.includes(i + j))
        row.push(<Square key={i + j} value={squares[i + j]} onSquareClick={() => handleClick(i + j)} style={{background: 'yellow'}}/>);
      else
        row.push(<Square key={i + j} value={squares[i + j]} onSquareClick={() => handleClick(i + j)} style={null}/>);
    }
    draw.push(<div key={i} className="board-row"> {row} </div>);
  }
  return (
    <>
      <div className="status">{status}</div>
      {draw}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const [sortasc, setSortasc] = useState(true);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function toggle()
  {
    setSortasc(!sortasc);
  }

  const moves = history.map((squares, move) => {
    move = sortasc ? move : history.length - move - 1;
    let discription;
    let cell = calculateCell(history, move);
    let row = Math.floor(cell / 3);
    let col = cell % 3;
    if (move == currentMove)
    {
      if (move == 0)
        discription = 'You are at game start';
      else
        discription = 'You are at move # ' + move + ' (' + row + ', ' + col + ')';
      return (
        <li key={move}> {discription}</li>
      )
    }
    if (move > 0)
      discription = 'Go to move #' + move + ' (' + row + ', ' + col + ')';
    else
      discription = 'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{discription}</button>
      </li>
    )
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={currentMove % 2 == 0} squares={currentSquares} onPlay={handlePlay} />      </div>
      <div className="game-info">
        <ul>{moves}</ul>
      </div>
      <button onClick={toggle} className='toggle'>Toggle</button>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  for (let i = 0; i < 9; i++)
  {
    if (!squares[i])
      return [];
  }
  return [-1];
}

function calculateCell(history, move)
{
  if (move == 0)
    return -1;
  const current = history[move];
  const previous = history[move - 1];
  for (let i = 0; i < 9; i++)
  {
    if (current[i] != previous[i])
      return i;
  }
}