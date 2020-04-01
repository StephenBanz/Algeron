import React from 'react';
import {
  StyleSheet,
  View,
  Alert,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { Fumi } from 'react-native-textinput-effects';
import { FontAwesome } from '@expo/vector-icons';  
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
// 略
class AddPostModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgUrl: '',
      phrase: '',
      addedPost: [],
    };
  }

  // 投稿時の処理
  async onPressAdd() {
    await this.uploadPostImg();
    const { imgUrl, phrase, postIndex } = await this.state;
    this.uploadPost(imgUrl, phrase, postIndex);
    this.setState(
      {
        addedPost: [
          {
            imgUrl,
            phrase,
            postIndex,
          },
        ],
      },
      () => this.updateAddedPostState(),
      this.props.togglePostModal(),
    );
  }

  uploadPostImg = async () => {
    const metadata = {
      contentType: 'image/jpeg',
    };
    const postIndex = Date.now().toString();
    const storage = firebase.storage();
    const imgURI = this.state.imgUrl;
    const response = await fetch(imgURI);
    const blob = await response.blob();
    const uploadRef = storage.ref('images').child(`${postIndex}`);

    // storageに画像を保存
    await uploadRef.put(blob, metadata).catch(() => {
      alert('画像の保存に失敗しました');
    });

    // storageのダウンロードURLをsetStateする
    await uploadRef
      .getDownloadURL()
      .then(url => {
        this.setState({
          imgUrl: url,
          postIndex,
        });
      })
      .catch(() => {
        alert('失敗しました');
      });
  };

  // stateに入っているダウンロードURLなどをFirestoreに記述する
  uploadPost(url, phrase, postIndex) {
    Fire.shared.uploadPost({
      url,
      phrase,
      postIndex,
    });
  }

  // PostScreen.jsで投稿データのstateを管理する
  updateAddedPostState() {
    this.props.updateAddedPostState(this.state.addedPost);
  }


onAddImagePressed = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === 'granted') {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });
      if (!result.cancelled) {
        // ImageManipulatorでリサイズ処理
        const actions = [];
        actions.push({ resize: { width: 350 } });
        const manipulatorResult = await ImageManipulator.manipulateAsync(
          result.uri,
          actions,
          {
            compress: 0.4,
          },
        );
        this.setState({
          imgUrl: manipulatorResult.uri,
        });
      }
    }
  };

render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={() => this.onAddImagePressed()}
        >
          {this.state.imgUrl ? (
            <Image style={styles.image} source={{ uri: this.state.imgUrl }} />
          ) : (
            <Icon
              name="camera-retro"
              type="font-awesome"
              size={50}
              containerStyle={styles.cameraIcon}
              color="gray"
            />
          )}
        </TouchableOpacity>
        {/* react-native-textinput-effectsでテキストインプットにアニメーションを実装 */}
        <Fumi
          label={'キャッチコピーをつけてね'}
          iconClass={FontAwesome}
          iconName={'hashtag'}
          iconColor={'#f4d29a'}
          inputPadding={16}
          inputStyle={{ color: '#444' }}
          labelStyle={{ color: '#ddd' }}
          style={styles.textContainer}
          onChangeText={phrase => this.setState({ phrase })}
          value={this.state.phrase}
        />
        <Button
          buttonStyle={[
            styles.addPostBtn,
            { display: this.state.imgUrl ? 'flex' : 'none' },
          ]}
          title="追加"
          onPress={() => {
            if (this.state.phrase.length >= 1) {
              this.onPressAdd();
            } else {
              Alert.alert('キャッチコピーを入力してね', '');
            }
          }}
        />
      </View>
    );
  }
}