import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, MaskedViewIOS, Animated } from 'react-native';
import firebase from 'firebase';

const LoadingScreen = props => {
  const [loadingProgress] = useState(() => new Animated.Value(0));
  const [animationDone, setAnimationDone] =  useState(false);
  const { navigation } = props;


  useEffect(() => {
    Animated.timing(loadingProgress, {
      toValue: 100,
      duration: 1000,
      useNativeDriver: true,
      delay: 400
    }).start(() => {
      setAnimationDone(true);
    })
      if ( animationDone ) {
        firebase.auth().onAuthStateChanged(user => {
          navigation.navigate(user ? 'App' : 'Auth');
        })
      }
    
    return () => {
      
    }
  })

  
  const colorLayer =  animationDone ? null : (<View style = {[ StyleSheet.absoluteFill, {backgroundColor: '#E9446A'}]}/>);
  const whiteLayer =  animationDone ? null : (<View style = {[ StyleSheet.absoluteFill, {backgroundColor: '#FFF'}]}/>);
  const imageScale = {
    transform: [
      {
        scale: loadingProgress.interpolate({
          inputRange: [0, 15, 100],
          outputRange: [0.1, 0.06, 16]
        })
      }
    ]
  };
  const opacity = {
    opacity: loadingProgress.interpolate({
      inputRange: [0,25,50],
      outputRange: [0,0,1],
      extrapolate: 'clamp'
    })
  }

  return(
  <View style = {{ flex: 1}}>
    {colorLayer}
    <MaskedViewIOS 
      style = {{ flex: 1}} 
      maskElement = {
        <View style = {styles.centered}>
          <Animated.Image
            source = {require('../assets/Blob_BG.png')}
            style = {[{ width: 1000}, imageScale]}
            resizeMode = 'contain'
          />
        </View>
      }
    >
      {whiteLayer}
      <Animated.View style = {[opacity, styles.centered]}>
      </Animated.View>
    </MaskedViewIOS>
  </View>
  );
}

export default LoadingScreen;


const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})