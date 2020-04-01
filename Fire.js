import FireBaseKeys from './config.js'
import firebase from 'firebase'
require('firebase/firestore');
import PushNotifications from './utilities/PushNotifications';

class Fire {
  
  constructor() {
    firebase.initializeApp(FireBaseKeys);
  }

  addPost = async ({text, localUri, userName, userAvatar}) => {
    const remoteUri = await this.uploadPhotoAsync(localUri, `photos/${this.uid}/${Date.now()}`)
    return new Promise((res, rej) => {
      this.firestore.collection('posts').add({
        text,
        uid: this.uid,
        timestamp: this.timestamp,
        image: remoteUri,
        userName,
        userAvatar
      })
      .then(ref => {
        res(ref)
      })
      .catch(error => {
        console.log(error.message);
        rej(error);
      });
    });
  };

  uploadPhotoAsync = async (uri, filename) => {
    //const path = `photos/${this.uid}/${Date.now()}.jpg`
    return new Promise(async (res, rej) =>{
      const response = await fetch(uri);
      const file = await response.blob();
      let upload = firebase.storage().ref(filename).put(file);
      upload.on(
        'state_changed', 
        snapshot => {}, 
        err => {
          rej(err);
        }, 
        async () => {
          const url = await upload.snapshot.ref.getDownloadURL();
          res(url);
        }
      );
    });
  };

  createUser = async user => {
    let remoteUri = null;

    try {
      await firebase.auth().createUserWithEmailAndPassword(user.email, user.password);

      let db = this.firestore.collection('users').doc(this.uid);
      db.set({
        name: user.name,
        email: user.email,
        avatar: null
      });

      if(user.avatar) {
        remoteUri = await this.uploadPhotoAsync(user.avatar, `avatars/${this.uid}`);

        db.set({avatar: remoteUri}, {merge:true});
      }
    } catch (error) {
      alert(`Error:` , error);
    }
  };

  signOut = () => {
    firebase.auth().signOut();
  }

  sendMessage = messages => {
    messages.forEach(item => {
      const message = {
        text: item.text,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        user: item.user
      };

      this.messageDb.push(message);
    });

    this.firestore
    .collection('users')
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        if (doc.id !== this.uid) {
          PushNotifications.sendMessageNotification(doc.data().push_token);
        }
        
      });
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
    
  };

  
  parse = message => {
    const { user, text, timestamp } = message.val();
    const { key: _id } = message;
    const createdAt = new Date(timestamp);

    return {
      _id,
      createdAt,
      text,
      user
    };
  };

  getMessage = callback => {
    this.messageDb.on('child_added', snapshot => callback(this.parse(snapshot)));
  }

  off() {
    this.messageDb.off();
  }


  get messageDb() {
    return firebase.database().ref('messages');
  }


  get firestore() {
    return firebase.firestore();
  }

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get timestamp() { 
    return Date.now();
  }
}

Fire.shared = new Fire();
export default Fire;