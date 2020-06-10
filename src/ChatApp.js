import React, { Component } from 'react';
import Chat from 'twilio-chat';
import { Chat as ChatUI } from '@progress/kendo-react-conversational-ui';

class ChatApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoading: true,
      messages: []
    };

    this.user = {
      id: props.username,
      name: props.username
    };

    this.setupChatClient = this.setupChatClient.bind(this);
    this.messagesLoaded = this.messagesLoaded.bind(this);
    this.messageAdded = this.messageAdded.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.handleError = this.handleError.bind(this);

  }

  componentDidMount() {


    console.log("channel " + this.props.channel);
    console.log("information " + this.props.information);
    fetch("https://aludra-api-management.azure-api.net/orchestration/qa/chat/token", {
      "method": "POST",
      "headers": {
        "content-type": "application/json",
        "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3VzZXJkYXRhIjoiMCIsImdpdmVuX25hbWUiOiJhbHVkcmEtZGItcWEuZGF0YWJhc2Uud2luZG93cy5uZXQiLCJmYW1pbHlfbmFtZSI6IkRCX0h5cGVybm92YUxhYnMiLCJ1bmlxdWVfbmFtZSI6ImluZm8iLCJlbWFpbCI6ImluZm9AaHlwZXJub3ZhbGFicy5jb20iLCJzdWIiOiJlZDkxYzhiZC0zYzJkLTQ4MjUtODZjYi1jZjYxOWFlOWRiNjciLCJqdGkiOiI2NjIyMjJjYy05ZGUyLTQwNWItYjI0NC1iNWI0OTkyMjI0MWIiLCJBbHVkcmEvcGVybWlzc2lvbiI6WyJib2FyZC5ob21lIiwiYm9hcmQuc2FsZXMiLCJjdXN0b21lci5saXN0IiwiY3VzdG9tZXIucGFydGljdWxhciIsImN1c3RvbWVyLmNvbXBhbnkiLCJzYWxlcy5lbGVjdHJvbmljYmlsbCIsInNhbGVzLmludm9pY2UiLCJzYWxlcy5pbnZvY2VsaXN0Iiwic2FsZXMuc2FsZW9yZGVyIiwic2FsZXMuc2FsZW9yZGVybGlzdCIsInNhbGVzLnF1b3RlIiwic2FsZXMucXVvdGVsaXN0Iiwic2FsZXMucXVvdGVjcmVhdGUiLCJwcmljZXNSdWxlcy5saXN0IiwicHJpY2VzUnVsZXMuYWRkIiwicHJvZHVjdC5saXN0IiwicHJvZHVjdC5hZGQiLCJwcm9kdWN0LnBpbS5tYW5hZ2VfYXR0cmlidXRlc19ncm91cCIsInByb2R1Y3QucGltLm1hbmFnZV9jYXRhbG9ndWVzIiwicHJvZHVjdC5waW0uYWRkX3Byb2R1Y3QiLCJwcm9tb3Rpb24ubGlzdCIsInByb21vdGlvbi5hZGQiLCJ0YXNrLmxpc3QiLCJ0YXNrLmFzc2lnbmVkIiwidGFzay5jYWxlbmRhciIsInRhc2suYm9hcmQiLCJ0YXNrLm5ldyIsInRhc2submV3dGVtcGxhdGUiLCJyb3V0ZS5wbGFuIiwicm91dGUucGxhbmxpc3QiLCJyb3V0ZS5wbGFuY3JlYXRlIiwicm91dGUuYWdlbnQiLCJyb3V0ZS5hZ2VudGxpc3QiLCJyb3V0ZS5hZ2VudGNyZWF0ZSIsInJvdXRlLmRlbGl2ZXJpZXMiLCJlbXBsb3llZXMuc2FsZWFnZW50IiwiZW1wbG95ZWVzLnNhbGVhZ2VudGxpc3QiLCJlbXBsb3llZXMuc2FsZWFnZW50YWRkIiwicHJpY2VsaXN0Lmxpc3QiLCJwcmljZWxpc3QuYWRkIiwiY2x1Yi5jbGllbnRib2FyZCIsImNsdWIuYWRtaW5ib2FyZCIsImNsdWIucmVnaXN0ZXJkcmF3IiwiaW52ZW50b3J5LmFkZCIsImxveWFsdHkucnVsZXMiLCJsb3lhbHR5LnByb2R1Y3Rhc3NvY2lhdGlvbnMiLCJsb3lhbHR5LnJlamVjdGlvbnJlYXNvbnMiLCJsb3lhbHR5LnBvaW50cmVxdWVzdCIsImludGVncmF0aW9ucy5ib2FyZCIsImFkbWluLmFwaWtleSIsImFkbWluLnJvbGVzIiwiYWRtaW4uY29tcGFuaWVzIiwicHJvZHVjdC5wdXJjaGFzZS5lZGl0IiwicHJvZHVjdC5nZW5lcmFsLmVkaXQiLCJwcm9kdWN0Lm1lcmNoLmVkaXQiLCJwcm9kdWN0LnByaWNlcy5lZGl0IiwicHJvZHVjdC5tZWRpYS5lZGl0Iiwib3JkZXJ0cmFja2luZy5saXN0Iiwib3JkZXJlY29tbWVyY2UubGlzdCJdLCJDTUYvcGVybWlzc2lvbiI6WyJjbWYubG9naW4iLCJjbWYucHJvZmlsZSIsImNtZi5zY2FuLmlkIiwiY21mLm9uYm9hcmRpbmciLCJjbWYub25ib2FyZGluZy5saXN0IiwiY21mLnNjYW4uYmFjayJdLCJBbHVkcmFTYWxlc0FwcC9wZXJtaXNzaW9uIjpbInF1b3RlLmVuYWJsZWQiLCJzby5lbmFibGVkIiwiaW52b2ljZS5lbmFibGVkIiwiY3VzdG9tZXIuY3JlYXRlLmVuYWJsZWQiLCJjcmVkaXQubWVtby5lbmFibGVkIl0sImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyIEFkbWluIiwibmJmIjoxNTkxNTc1NDQ5LCJleHAiOjE1OTIxODAyNDksImlzcyI6IkFsdWRyYUlzc3VlciIsImF1ZCI6IkFsdWRyYUF1ZGllbmNlIn0.5jYlkGkRuJ6Y4WREcLGmdtv4MCOyoQXECAmvQKWXzcc",
        "ocp-apim-subscription-key": "367e1ca0d506466bbcfda6e712c23bad"
      },
      "body": JSON.stringify({
        "identity": encodeURIComponent(this.props.username)
      })
    })
      .then(res => res.json())
      .then(data => Chat.create(data.token))
      .then(this.setupChatClient)
      .catch(this.handleError);
  }

  handleError(error) {
    this.setState({
      error: 'Could not load chat.'
    });
  }

  setupChatClient(client) {
    this.client = client;
    this.client
      .getChannelByUniqueName(this.props.channel || 'general2')
      .then(channel => channel)
      .catch(error => {
        if (error.body.code === 50300) {
          return this.client.createChannel({ uniqueName: this.props.channel || 'general2' });
        } else {
          this.handleError(error);
        }
      })
      .then(channel => {
        this.channel = channel;
        return this.channel.join().catch(() => { });
      })
      .then(() => {
        this.setState({ isLoading: false });
        this.channel.getMessages().then(this.messagesLoaded);
        this.channel.on('messageAdded', this.messageAdded);
      })
      .catch(this.handleError);
  }

  twilioMessageToKendoMessage(message) {
    return {
      text: message.body,
      author: { id: message.author, name: message.author },
      timestamp: message.timestamp
    };
  }

  messagesLoaded(messagePage) {
    this.setState({
      messages: messagePage.items.map(this.twilioMessageToKendoMessage)
    });
  }

  messageAdded(message) {
    this.setState(prevState => ({
      messages: [
        ...prevState.messages,
        this.twilioMessageToKendoMessage(message)
      ]
    }));
  }

  sendMessage(event) {
    this.channel.sendMessage(event.message.text);
  }

  componentWillUnmount() {
    this.client.shutdown();
  }

  render() {
    if (this.state.error) {
      return <p>{this.state.error}</p>;
    } else if (this.state.isLoading) {
      return <p>Loading chat...</p>;
    }
    return (
      <ChatUI
        user={this.user}
        messages={this.state.messages}
        onMessageSend={this.sendMessage}
        width={400}
      />
    );
  }
}

export default ChatApp;
