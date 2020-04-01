import React from 'react';
import { Platform, KeyboardAvoidingView, SafeAreaView } from "react-native";
import { GiftedChat } from 'react-native-gifted-chat';
import Fire from '../Fire';
import { Notifications } from 'expo';
import UserPermissions from '../utilities/UserPermissions';

export default class MessageScreen extends React.Component {

  state = {
    messages: [],
    user: {}
  }

  unsubscribe = null;

  async componentDidMount() {

    Fire.shared.getMessage(message => 
      this.setState(previous => ({
        messages: GiftedChat.append(previous.messages, message)
      }))
    );

    const user  = this.props.uid || Fire.shared.uid;

    this.unsubscribe = Fire.shared.firestore
      .collection('users')
      .doc(user)
      .onSnapshot(doc => {
        this.setState({ user: doc.data() });
      })
    
      await UserPermissions.registerForPushNotificationsAsync(user);
      this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  _handleNotification = notification => {
    // do whatever you want to do with the notification
    if(notification.origin === 'received') {
    this.props.navigation.navigate('Message');
    }
    else if (notification.origin === 'selected') {
      this.props.navigation.navigate('Message');
    }
  };

  get user() {
    return {
      _id: this.props.uid || Fire.shared.uid,
      name: this.state.user.name,
      avatar: this.state.user.avatar
    }
  }

  componentWillUnmount() {
    Fire.shared.off();
    this.unsubscribe();
  }

  render() {
    const chat = <GiftedChat messages = {this.state.messages} onSend = {Fire.shared.sendMessage} user = {this.user} />;
    if(Platform.OS === 'android') {
      return (
        <KeyboardAvoidingView style = {{flex:1}} behavior = 'padding' keyboardVerticalOffset = {30} enabled>
          {chat}
        </KeyboardAvoidingView>
      )
    }

    return (
    <SafeAreaView style = {{ flex: 1 }}>{ chat }</SafeAreaView>
    );
  }
}
