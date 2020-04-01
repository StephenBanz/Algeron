// based on reddit community
// https://www.reddit.com/r/reactnative/comments/cq525b/react_native_how_can_i_animate_like_this_in_react/

// YouTube video: https://youtu.be/qLTXnJVSXgM

import React, { useState } from 'react';
import {
  Animated,
  Dimensions,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const COLORS = {
  yellow: '#FFC46B',
  pink: '#FF82C3',
  violet: '#8A00D4',
  magenta: '#D527B7',
};

// sizes
const SQUARE_SIZE = 60;
const SQUARE_OFFSET = 45;
const VERTICAL = (height - SQUARE_SIZE) / 2;
const HORIZONTAL = (width - SQUARE_SIZE) / 2;
const TOGGLE_VALUE = new Animated.Value(0);

export default () => {
  const [toggle, setToggle] = useState(false);

  const handleToggle = () => {
    setToggle(!toggle);
    Animated.timing(TOGGLE_VALUE, {
      toValue: !toggle ? 1 : 0,
      duration: 500,
    }).start();
  };

  const square1 = TOGGLE_VALUE.interpolate({
    inputRange: [0, 0.5, 0.75, 1],
    outputRange: [
      VERTICAL,
      VERTICAL + SQUARE_OFFSET * 1.2,
      VERTICAL + SQUARE_OFFSET,
      VERTICAL + SQUARE_OFFSET * 1.1,
    ],
  });

  const square2 = TOGGLE_VALUE.interpolate({
    inputRange: [0, 0.5, 0.75, 1],
    outputRange: [
      HORIZONTAL,
      HORIZONTAL - SQUARE_OFFSET * 1.2,
      HORIZONTAL - SQUARE_OFFSET,
      HORIZONTAL - SQUARE_OFFSET * 1.1,
    ],
  });

  const square3 = TOGGLE_VALUE.interpolate({
    inputRange: [0, 0.5, 0.75, 1],
    outputRange: [
      VERTICAL,
      VERTICAL - SQUARE_OFFSET * 1.2,
      VERTICAL - SQUARE_OFFSET,
      VERTICAL - SQUARE_OFFSET * 1.1,
    ],
  });

  const square4 = TOGGLE_VALUE.interpolate({
    inputRange: [0, 0.5, 0.75, 1],
    outputRange: [
      HORIZONTAL,
      HORIZONTAL + SQUARE_OFFSET * 1.2,
      HORIZONTAL + SQUARE_OFFSET,
      HORIZONTAL + SQUARE_OFFSET * 1.1,
    ],
  });

  const rotate = TOGGLE_VALUE.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['45deg', '180deg', '45deg'],
  });

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ textAlign: 'center', fontSize: 18 }}>
        Did you like this?
      </Text>
      <TouchableOpacity activeOpacity={1} onPress={() => handleToggle()}>
        <Animated.View
          style={StyleSheet.flatten([
            styles.square,
            styles.square1,
            // { top: square1, transform: [{ rotate }] },
            { top: square1 },
          ])}
        />
        <Animated.View
          style={StyleSheet.flatten([
            styles.square,
            styles.square2,
            { left: square2 },
          ])}
        />
        <Animated.View
          style={StyleSheet.flatten([
            styles.square,
            styles.square3,
            { top: square3 },
          ])}
        />
        <Animated.View
          style={StyleSheet.flatten([
            styles.square,
            styles.square4,
            { left: square4 },
          ])}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // position absolute
  square: {
    position: 'absolute',
    top: VERTICAL,
    left: HORIZONTAL,
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
    borderRadius: 8,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowRadius: 4,
    shadowOpacity: 0.2,
    transform: [{ rotate: '45deg' }],
  },
  square1: {
    backgroundColor: COLORS.yellow,
    shadowColor: COLORS.yellow,
    zIndex: 4,
  },
  square2: {
    backgroundColor: COLORS.pink,
    shadowColor: COLORS.pink,
    zIndex: 2,
  },
  square3: {
    backgroundColor: COLORS.violet,
    shadowColor: COLORS.violet,
    zIndex: 2,
  },
  square4: {
    backgroundColor: COLORS.magenta,
    shadowColor: COLORS.magenta,
    zIndex: 1,
  },
});
