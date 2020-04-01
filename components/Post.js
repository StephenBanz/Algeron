import React from 'react';
import { View, Text, StyleSheet, LayoutAnimation, FlatList, Image, Dimensions, Animated, Easing , TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/AntDesign';
import Fire from '../Fire';

const colors = {
  transparent: 'transparent',
  white: '#fff',
  heartColor: '#e92f3c',
  textPrimary: '#515151',
  black: '#000', 
}
const AnimatedIcon = Animatable.createAnimatableComponent(Icon)

 class Post extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      liked: false,

    }

    this.lastPress = 0
  }

  componentDidMount() {
    
  }

  handleLargeAnimatedIconRef = (ref) => {
    this.largeAnimatedIcon = ref
  }

  handleSmallAnimatedIconRef = (ref) => {
    this.smallAnimatedIcon = ref
  }

  animateIcon = () => {
    const { liked } = this.state
    this.largeAnimatedIcon.stopAnimation()

    if (liked) {
      this.largeAnimatedIcon.bounceIn()
        .then(() => this.largeAnimatedIcon.bounceOut())
      this.smallAnimatedIcon.pulse(200)
    } else {
      this.largeAnimatedIcon.bounceIn()
        .then(() => {
          this.largeAnimatedIcon.bounceOut()
          this.smallAnimatedIcon.bounceIn()
        })
        .then(() => {
          if (!liked) {
            this.setState(prevState => ({ liked: !prevState.liked }))
          }
        })
    }
  }

  handleOnPress = () => {
    const time = new Date().getTime()
    const delta = time - this.lastPress
    const doublePressDelay = 400

    if (delta < doublePressDelay) {
      this.animateIcon()
    }
    this.lastPress = time
  }

  handleOnPressLike = () => {
    this.smallAnimatedIcon.bounceIn()
    this.setState(prevState => ({ liked: !prevState.liked }))
  }

  renderPost = post => {
    const { liked } = this.state
   // console.log(post);
    return(
      <TouchableOpacity
          activeOpacity={1}
          style={styles.card}
          onPress={this.handleOnPress}
        >
          <AnimatedIcon
            ref={this.handleLargeAnimatedIconRef}
            name="heart"
            color={colors.white}
            size={80}
            style={styles.animatedIcon}
            duration={500}
            delay={200}
          />
        
      
      <View style ={styles.feedItem}>

        <Image source={{uri: post.userAvatar}} style={styles.avatar}/>

        <View style = {{ flex: 1 }}>
          <View style = { { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <View>
              <Text style = {styles.name}>{post.userName}</Text>
              <Text style = {styles.timestamp}>{moment(post.timestamp).fromNow()}</Text>
            </View>

            <Ionicons name = 'ios-more' size={24} color = '#73788B' />
          </View>

          <Text style ={styles.post}>{post.text}</Text>

          <Image source ={ {uri: post.image} } style={styles.postImage} resizeMode='cover' />

          <View style ={{ flexDirection: 'row'}}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={this.handleOnPressLike}
          >
            <AnimatedIcon
              ref={this.handleSmallAnimatedIconRef}
              name={liked ? 'heart' : 'hearto'}
              color={liked ? colors.heartColor : colors.textPrimary}
              size={18}
              style={styles.icon}
            />
          </TouchableOpacity>
            <Ionicons name = 'ios-chatboxes' size={24} color = '#73788B'  />
          </View>
        </View>
      </View>

      </TouchableOpacity>
    );
  };

}

Post = new Post();
export default Post;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFECF4'
  },
  header: {
    paddingTop: 64,
    paddingBottom: 16,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EBECF4',
    shadowColor: '#454D65',
    shadowOffset: { height: 5},
    shadowRadius: 15,
    shadowOpacity: 0.2,
    zIndex: 10
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500'
  },
  feed: {
    marginHorizontal: 16
  },
  feedItem: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    padding: 8,
    flexDirection: 'row',
    marginVertical: 8
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 16
  },
  name: {
    fontSize: 15,
    fontWeight: '500',
    color: '#454D65'
  },
  timestamp: {
    fontSize: 11,
    color: '#C4C6CE',
    marginTop: 4
  },
  post: {
    marginTop: 16,
    fontSize: 14,
    color: '#838899'
  },
  postImage: {
    width: undefined,
    height: 150,
    borderRadius: 5,
    marginVertical: 16
  },
  icon: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  animatedIcon: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    borderRadius: 160,
    opacity: 0
  }
})