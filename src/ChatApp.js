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
        "api-key": "wSeH0tSavs8kgdARJULz78MKs8nRo3C1ypiMb+v4tYvM6i0N80m6BYSQVTQMWAbZm8hJjBPP27Cg1iDp+5xozuUd0g8OEr+4xy8HYJih5I/jV6Gozwy0sLeneiD9yLiyfJukDBA0Rv07MPX42lQa6PED/+xJ6Q+GfNcv6t7iRVgreJ323bZexWDA6gqo+JRFyT/4dD2TAxUJEMGIjpmOdYHxWsIwO1Kjuqh0MipNjIR+cIDiMhWxStC4FBIl/sYuNFRLqSerD11SgAaZ07UFgIa9swnXJPXhx5wINv6P+7/ZYr+M4Kb69e0BKBLQ22uc9sDrhWXFfi6pJMnfyc0XHA==",
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
          return this.client.createChannel(
            {
              uniqueName: this.props.channel || 'general2',
              friendlyName: this.props.channel || 'general2'
            }
          );
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
