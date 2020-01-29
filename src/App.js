import React from 'react'
import { BrowserRouter, Switch } from 'react-router-dom'
import Game from './Components/Game'
import Landingpage from './Components/Landingpage/Landingpage'
import Scoreboard from './Components/Scoreboard/Scoreboard'
import PublicRoute from './Route/Publicroute';
class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <PublicRoute component={Landingpage} path="/" exact />
          <PublicRoute component={Game} path="/game" exact />
          <PublicRoute component={Scoreboard} path="/scoreboard" exact />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;