import React from 'react';
import { View, Text, StyleSheet,SafeAreaView, TouchableOpacity, Image, TextInput } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import Constants from 'expo-constants';
import UserPermissions from '../utilities/UserPermissions';
import Fire from '../Fire';
import * as ImagePicker from 'expo-image-picker';

const firebase = require('firebase');
require('firebase/firestore')

export default class PostScreen extends React.Component {

  state = {
    text: '',
    image: null,
    user: {}
  }

  componentDidMount() {
    const user  = this.props.uid || Fire.shared.uid;

    this.unsubscribe = Fire.shared.firestore
      .collection('users')
      .doc(user)
      .onSnapshot(doc => {
        this.setState({ user: doc.data() });
      })
  }

  handlePost = () => {
    Fire.shared.addPost({ 
      text: this.state.text.trim(), 
      localUri: this.state.image,
      userName: this.state.user.name,
      userAvatar: this.state.user.avatar
      }).then(ref => {
      this.setState({ text: '', image: null});
      this.props.navigation.goBack();
    }).catch(error => {
      alert(error.message);
    });
  };

  pickImage = async () => {
    UserPermissions.getCameraPermission();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3]
    });

    if (!result.cancelled) {
      this.setState({ image: result.uri})
    }
  }

  render() {
    return (
      <SafeAreaView style = {styles.container}>
        <View style = {styles.header}>
          
          <TouchableOpacity onPress = { () => this.props.navigation.goBack()}>
            <Ionicons name='md-arrow-back' size ={ 24 } color = '#D8D9DB' ></Ionicons>
          </TouchableOpacity>
          
          <TouchableOpacity onPress ={ this.handlePost}>
            <Text style = {{ fontWeight: '500'}}>Post</Text>
          </TouchableOpacity>

        </View>

        <View style= {styles.inputContainer}>
          <Image source={{uri: this.state.user.avatar}} style = { styles.avatar}></Image>
          <TextInput 
            autoFocus={true} 
            multiline = {true} 
            numberOfLines = {4} 
            style = {{ flex:1 }} 
            placeholder = 'Want to share Something?'
            onChangeText = {text => this.setState({text})}
            value = {this.state.text}
          ></TextInput>
        </View>

        <TouchableOpacity style = {styles.photo} onPress = {this.pickImage}>
          <Ionicons name= 'md-camera' size = {32} color = '#D8D9DB'></Ionicons>
        </TouchableOpacity>

        <View style = {{ marginHorizontal:32, marginTop: 32, height: 150}}>
          <Image source = { this.state.image != null ? {uri: this.state.image} : null} style = {{ width: '100%', height: '100%'}}></Image>
        </View>

      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#D8D9DB'
  },
  inputContainer: {
    margin: 32,
    flexDirection: 'row'
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16
  },
  photo: {
    alignItems: 'flex-end',
    marginHorizontal: 32
  }
})