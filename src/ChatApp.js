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
        "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3VzZXJkYXRhIjoiMiIsImdpdmVuX25hbWUiOiJhbHVkcmEtZGItcHJvZC5kYXRhYmFzZS53aW5kb3dzLm5ldCIsImZhbWlseV9uYW1lIjoiREJfQ29jaGV6IiwidW5pcXVlX25hbWUiOiJpbmZvQGh5cGVybm92YWxhYnMuY29tIiwiZW1haWwiOiJpbmZvQGh5cGVybm92YWxhYnMuY29tIiwic3ViIjoiZWQ5MWM4YmQtM2MyZC00ODI1LTg2Y2ItY2Y2MTlhZTlkYjY3IiwianRpIjoiOTBjOTg4Y2EtNjQyMS00YjNjLWE5NDMtODVkMTQzMzQyOGU1IiwiQWx1ZHJhL3Blcm1pc3Npb24iOlsiYm9hcmQuaG9tZSIsImJvYXJkLnNhbGVzIiwiY3VzdG9tZXIubGlzdCIsImN1c3RvbWVyLnBhcnRpY3VsYXIiLCJjdXN0b21lci5jb21wYW55Iiwic2FsZXMuZWxlY3Ryb25pY2JpbGwiLCJzYWxlcy5pbnZvaWNlIiwic2FsZXMuaW52b2NlbGlzdCIsInNhbGVzLnNhbGVvcmRlciIsInNhbGVzLnNhbGVvcmRlcmxpc3QiLCJzYWxlcy5xdW90ZSIsInNhbGVzLnF1b3RlbGlzdCIsInNhbGVzLnF1b3RlY3JlYXRlIiwicHJpY2VzUnVsZXMubGlzdCIsInByaWNlc1J1bGVzLmFkZCIsInByb2R1Y3QubGlzdCIsInByb2R1Y3QuYWRkIiwicHJvZHVjdC5waW0ubWFuYWdlX2F0dHJpYnV0ZXNfZ3JvdXAiLCJwcm9kdWN0LnBpbS5tYW5hZ2VfY2F0YWxvZ3VlcyIsInByb2R1Y3QucGltLmFkZF9wcm9kdWN0IiwicHJvbW90aW9uLmxpc3QiLCJwcm9tb3Rpb24uYWRkIiwidGFzay5saXN0IiwidGFzay5hc3NpZ25lZCIsInRhc2suY2FsZW5kYXIiLCJ0YXNrLmJvYXJkIiwidGFzay5uZXciLCJ0YXNrLm5ld3RlbXBsYXRlIiwicm91dGUucGxhbiIsInJvdXRlLnBsYW5saXN0Iiwicm91dGUucGxhbmNyZWF0ZSIsInJvdXRlLmFnZW50Iiwicm91dGUuYWdlbnRsaXN0Iiwicm91dGUuYWdlbnRjcmVhdGUiLCJyb3V0ZS5kZWxpdmVyaWVzIiwiZW1wbG95ZWVzLnNhbGVhZ2VudCIsImVtcGxveWVlcy5zYWxlYWdlbnRsaXN0IiwiZW1wbG95ZWVzLnNhbGVhZ2VudGFkZCIsInByaWNlbGlzdC5saXN0IiwicHJpY2VsaXN0LmFkZCIsImNsdWIuY2xpZW50Ym9hcmQiLCJjbHViLmFkbWluYm9hcmQiLCJjbHViLnJlZ2lzdGVyZHJhdyIsImludmVudG9yeS5hZGQiLCJsb3lhbHR5LnJ1bGVzIiwibG95YWx0eS5wcm9kdWN0YXNzb2NpYXRpb25zIiwibG95YWx0eS5yZWplY3Rpb25yZWFzb25zIiwibG95YWx0eS5wb2ludHJlcXVlc3QiLCJpbnRlZ3JhdGlvbnMuYm9hcmQiLCJhZG1pbi5hcGlrZXkiLCJhZG1pbi5yb2xlcyIsImFkbWluLmNvbXBhbmllcyIsInByb2R1Y3QucHVyY2hhc2UuZWRpdCIsInByb2R1Y3QuZ2VuZXJhbC5lZGl0IiwicHJvZHVjdC5tZXJjaC5lZGl0IiwicHJvZHVjdC5wcmljZXMuZWRpdCIsInByb2R1Y3QubWVkaWEuZWRpdCIsIm9yZGVydHJhY2tpbmcubGlzdCIsIm9yZGVyZWNvbW1lcmNlLmxpc3QiXSwiQ01GL3Blcm1pc3Npb24iOlsiY21mLmxvZ2luIiwiY21mLnByb2ZpbGUiLCJjbWYuc2Nhbi5pZCIsImNtZi5vbmJvYXJkaW5nIiwiY21mLm9uYm9hcmRpbmcubGlzdCIsImNtZi5zY2FuLmJhY2siXSwiQWx1ZHJhU2FsZXNBcHAvcGVybWlzc2lvbiI6WyJxdW90ZS5lbmFibGVkIiwic28uZW5hYmxlZCIsImludm9pY2UuZW5hYmxlZCIsImN1c3RvbWVyLmNyZWF0ZS5lbmFibGVkIl0sImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyIEFkbWluIiwibmJmIjoxNTkxOTY5NDM3LCJleHAiOjE1OTI1NzQyMzcsImlzcyI6IkFsdWRyYUlzc3VlciIsImF1ZCI6IkFsdWRyYUF1ZGllbmNlIn0.UvjqNHn_2RA2iQNv45qG39Biu0JOpnxGyV5dZks740U",
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
