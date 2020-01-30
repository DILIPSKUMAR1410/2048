import React from 'react'
import './Landingpage.css'
import {
  UserSession,
  AppConfig,
} from 'blockstack';
const appConfig = new AppConfig()
const userSession = new UserSession({ appConfig: appConfig })
class Landingpage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    }
  }
  handleSignin = (e) => {
    e.preventDefault();
    userSession.redirectToSignIn();
  }
  handleSignOut(e) {
    e.preventDefault();
    localStorage.removeItem("cirulli");
    userSession.signUserOut(window.location.origin);
  }
  fetchdata = () => {
    if (userSession.isUserSignedIn()) {
      // const option={encrypt : false};
      // var temp=[];
      // userSession.putFile("Journaldata.json",JSON.stringify(temp),option); 
      const options = { decrypt: false };
      userSession.getFile('Cirulli.json', options)
        .then((file) => {
          if (file)
            localStorage.setItem("cirulli", file);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.setState({ loading: false });
        });
    }
  }
  componentDidMount() {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        this.props.history.push("/");
        window.history.replaceState({}, document.title, "/");
        this.setState({ loading: true });
      }).finally(() => {
        this.fetchdata();
      })
    }
  }
  render() {

    return (
      <div className="land">
        <div className="header">
        <h2>Cirulli</h2>
        </div>
        <div className="rowland">
          <div className="leftrow">
            <p>Play the famous sliding block puzzle game founded by Gabrielle Cirulli. </p>
            <p>It is built on Blockstack Platform</p>
            <p>Save your scores on Decentralized web.</p>
          </div>
          <div className="rightrow">
            {!userSession.isUserSignedIn() ?
              <button onClick={this.handleSignin}>Login using blockstack</button> :
              <div>
                <button onClick={this.handleSignOut}>Logout</button>
                <a href="/tictactoe">Let's Play</a>
                <a href="/scoreboard">Scoreboard</a>
              </div>}
          </div>
        </div>
        <div className="footerland">Copyright@cirulli2019</div>
        {this.state.loading ? <div className="loadcontainer"><div className="loader" /></div> : null}
      </div>
    )
  }
}
export default Landingpage;