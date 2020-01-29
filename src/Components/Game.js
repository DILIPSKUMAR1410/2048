import React from 'react';
import Board from './Board';
import { getNewGameState } from './actions/getNewGameState';
import { generateNewTile } from './actions/generateTileHandler';
import { getKeyHandler } from './inputHandlers/keyboard';
import { getTouchHandler } from './inputHandlers/touch';
import {
  UserSession,
  AppConfig,
} from 'blockstack';
const appConfig = new AppConfig()
const userSession = new UserSession({ appConfig: appConfig })
class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = getNewGameState(4);
    this.rewind = this.rewind.bind(this);
    this.reset = this.reset.bind(this);
    this.keyPressed = this.keyPressed.bind(this);
    this.touchStart = this.touchStart.bind(this);
    this.touchEnd = this.touchEnd.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.save = this.save.bind(this);
  }

  touchStart(event) {
    let touch = event.touches[0];
    if (!touch)
      return;

    this.setState(() => {
      return { touch : { X : touch.clientX, Y : touch.clientY }};
    });
  }

  touchEnd(event) {
    const handler = getTouchHandler(event, this.state.touch);
    this.handleMove(handler);
  }

  keyPressed(event) {
    if (event.keyCode === 81) {
      this.rewind();
      return;
    }
    const handler = getKeyHandler(event);
    this.handleMove(handler);
  }

  rewind() {
    if (this.state.history.length > 0) {
      this.setState((state) => {
        const { squares, score } = state.history[state.history.length - 1];
        state.history.splice(-1, 1);
        return { squares : squares, score : score, rewinds : state.rewinds + 1 };
      });
    }
  }

  reset() {
    this.setState(() => {
      return getNewGameState(4);
    });
  }

  writeHistory(state) {
    const { squares, score } = state;
    this.setState(() => {    
      return { history : [...this.state.history, { squares : squares, score : score }] }
    });
  }

  handleMove(handler) {
    let { squares, isMoved, isStarted, score } = handler(this.state);
    if (isMoved) {
      this.writeHistory({ squares : this.state.squares, score : this.state.score });
      squares = generateNewTile(squares);
      this.setState(() => {
        if(this.state.max>=score)
          return { squares : squares, isMoved : isMoved, isStarted : isStarted, score : score };
        else
          return { squares : squares, isMoved : isMoved, isStarted : isStarted, score : score, max: score };
      });

      return;
    }

    this.setState(() => {
      return { isMoved : false };
    });
  }

  // just a hack for iOS bouncing effect
  handleTouchMove(event) {
    const className = event.target.className;
    if (className.includes('square')) {
      event.preventDefault();;
      return;
    }
  }

  componentDidMount() {
    document.addEventListener("touchmove", this.handleTouchMove, { passive : false });
    document.addEventListener("keydown", this.keyPressed, false);

    const doc = document.getElementById("game-board");
    doc.addEventListener("touchstart", this.touchStart, false);
    doc.addEventListener("touchend", this.touchEnd, false);
  }

  componentWillUnmount(){
    document.removeEventListener("touchmove", this.handleTouchMove, { passive : false });
    document.removeEventListener("keydown", this.keyPressed, false);

    const doc = document.getElementById("game-board");
    doc.removeEventListener("touchstart", this.touchStart, false);
    doc.removeEventListener("touchend", this.touchEnd, false);
  }
  save() {
    var tempDate = new Date();
    var date = tempDate.getDate() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getFullYear();
    var temp=[];
    if(localStorage.getItem("cirulli"))
    {
      temp=JSON.parse(localStorage.getItem("cirulli"));
    }
    temp.push([date, this.state.score]);
    var scorelist=[];
    var i,j;
    for(i=0;i<temp.length;i++)
      scorelist.push(temp[i][1]);
    scorelist.sort(function(a,b){return b-a;}); 
    // scorelist.reverse();
    var allscores=[];
    for(i=0;i<temp.length;i++)
    {
      for(j=0;j<temp.length;j++)
      {
        if(temp[j][1]==scorelist[i])
        {
          allscores.push(temp[j]);
          break;
        }
      }
      if(allscores.length==10)
        break;
    }
    localStorage.setItem("cirulli",JSON.stringify(allscores));
    const options = { encrypt: false };
    userSession.putFile('Cirulli.json', JSON.stringify(allscores),options)
  }
  render() {
    return (
      <div className="game" id="game">
        <div className="game-board" id="game-board">
          <div className="status">
            <span>Score: {this.state.score}</span>
          </div>
          <div className="status">
            {this.state.rewinds > 0 ? <span>Rewinds used: {this.state.rewinds}</span> : null}
          </div>
          <div className="game-info">
            <span>{(this.state.isStarted && !this.state.isMoved) ? "Nothing has moved" : null}</span>
          </div>
          <Board
            squares={this.state.squares}
          />
        </div>
        <div className="game-buttons">
          <ul>
            <button className="veryBoringButton" onClick={this.reset}>New game</button>
            <button className="veryBoringButton" onClick={this.save}>Save</button>
          </ul>
        </div>
      </div>
    );
  }
}

export default Game;