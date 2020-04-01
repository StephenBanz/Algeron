import React from 'react';
import { View, Text, StyleSheet, LayoutAnimation, FlatList, Image  } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import { AntDesign } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';

let heartCount =1

export default class HeartScreen extends React.Component {

  state ={
    hearts: []
  }

  addHeart = () => {
    this.setState(
      {
        hearts: [
          ...this.state.hearts,
          {
            id: heartCount
          }
        ]
      },
    () => {
      heartCount++;
    }
    )
  }
  
  render() {
    return(
      <View style = {styles.container}>
        {this.state.hearts.map( heart => {
          return (
            <HeartContainer key = {heart.id} />
          );
        })}
      </View>
    );
  }
}

class HeartContainer extends React.Component {
  render() {
    return (
      <Animated.View style ={styles.heartContainer}>
        <HeartIcon color = 'purple'/>
      </Animated.View>
    );
  }
}

const HeartIcon = props => (
  <View {...props} style= {styles.heart, props.style}>
    <AntDesign name = 'heart' size = {48} color = {props.color} />
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFECF4'
  },
  heartContainer: {
    position: 'absolute',
    bottom: 30,
    backgroundColor: 'transparent'
  },
  heart: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  }
})