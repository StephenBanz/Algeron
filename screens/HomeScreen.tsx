import React from 'react';
import { View, Text, StyleSheet, LayoutAnimation, FlatList, Image, Dimensions, Easing , TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import Fire from '../Fire';
import Lightbox from 'react-native-lightbox';


interface IHomeScreenProps {
  navigation: any;
  avatar: string;
  email: string;
  name: string;
  push_token: string;
  setChangeUser: (avatar: string, email: string, name: string, push_token: string) => void;
}

interface IHomeScreenState {
  liked: boolean;
  posts: any [];
  user:  {
    avatar: string;
    email: string;
    name: string;
    push_token: string;
  };
  imageWidth: number;
  imageHeight: number;
}

export default class HomeScreen extends React.Component < 
IHomeScreenProps,
IHomeScreenState
> {

  constructor(props) {
    super(props)
    
    this.state = {
      liked: false,
      posts: [],
      user: {
        avatar: this.props.name,
        email: '',
        name: '',
        push_token: '',
      },
      imageWidth: 0,
      imageHeight: 0
    }
  
  }

  unsubscribe = null;
  getpost = () => {
    Fire.shared.firestore
      .collection('posts')
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          this.setState((prevState) => ({
            posts: [...prevState.posts, {
                id: doc.id,
                text: doc.data().text,
                image: doc.data().image,
                timestamp: doc.data().timestamp,
                uid: doc.data().uid,
                userName: doc.data().userName,
                userAvatar: doc.data().userAvatar
            }]
          }))
        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
  }

  componentDidMount() {
    
    this.getpost();
    const user  = this.props.uid || Fire.shared.uid;
    
    this.unsubscribe = Fire.shared.firestore
      .collection('users')
      .doc(user)
      .onSnapshot(doc => {
        this.setState({ user: doc.data() });
      })
      
  }

  componentDidUpdate() {
    const avatar = this.state.user.avatar;
    const email = this.state.user.email;
    const name = this.state.user.name;
    const push_token = this.state.user.push_token;
    this.props.setChangeUser(avatar, email, name, push_token);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  

  renderPost = post => {
    
    
    return(
      
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
          <Lightbox 
            underlayColor="white"
            renderHeader={close => (
              <TouchableOpacity onPress={close}>
                <Text style={styles.closeButton}>Close</Text>
              </TouchableOpacity>
            )}
            
            renderContent = {() => (
              <Image source ={ {uri: post.image} } style= {{ width: Dimensions.get('window').width, height: 300}} resizeMode = 'cover' />
            )}
          >
            <Image source ={ {uri: post.image} } style={styles.postImage} resizeMode = 'cover'/>
          </Lightbox>
          

          <View style ={{ flexDirection: 'row'}}>
          
            <Ionicons name = 'ios-chatboxes' size={24} color = '#73788B'  />
          </View>
        </View>
      </View>

   
    );
  };

  render() {
    LayoutAnimation.easeInEaseOut();
    return(
      <View style = {styles.container}>

        <View style = {styles.header}>
          <Text style = {styles.headerTitle}>Feed</Text>
        </View>
        
        <FlatList 
          style = {styles.feed}
          data = {this.state.posts}
          renderItem = {({item}) => this.renderPost(item)}
          keyExtractor = {item => item.id}
          showsVerticalScrollIndicator = {false}
        >
        </FlatList>
  
      </View>
    );
  }
}

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
    shadowOffset: { height: 5, width: undefined},
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
  },
  closeButton: {
    color: 'white',
    borderWidth: 1,
    borderColor: 'white',
    padding: 8,
    borderRadius: 3,
    textAlign: 'center',
    margin: 10,
    alignSelf: 'flex-end',
    marginTop: 25,
  },
})