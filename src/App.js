import React, { Component } from 'react';
import Login from './Login';
import ChatApp from './ChatApp';
import '@progress/kendo-theme-material/dist/all.css';
import * as qs from 'query-string';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      channel: '',
      information: '',
      loggedIn: false
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
  }

  handleLogin(event) {
    event.preventDefault();
    this.setState({ loggedIn: true });
  }

  handleUsernameChange(event) {
    this.setState({ username: event.target.value });
    const parsed = qs.parse(window.location.pathname.replace('/', ''));
    const channel = parsed.channel;
    const information = parsed.information;
    this.setState({ channel: channel });
    this.setState({ information: information });
  }

  render() {
    let loginOrChat;

    //console.log(parsed);



    if (this.state.loggedIn) {
      loginOrChat = <ChatApp
        username={this.state.username}
        channel={this.state.channel}
        information={this.state.information}
      />;
    } else {
      loginOrChat = (
        <Login
          handleLogin={this.handleLogin}
          handleUsernameChange={this.handleUsernameChange}
          username={this.state.username}
          channel={this.state.channel}
          information={this.state.information}

        />

      );
    }
    return (
      <div className="container">
        <div className="row mt-3 justify-content-center">{loginOrChat}</div>
      </div>
    );
  }
}

export default App;
