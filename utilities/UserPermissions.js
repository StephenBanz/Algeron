import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { Notifications } from 'expo';
import Fire from '../Fire';

class UserPermissions {
  getCameraPermission = async () => {
    if (Constants.platform.ios){
      const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);

      if (status !== 'granted') {
        alert('We need your permission to access your camera');
      }
    }
  }

  registerForPushNotificationsAsync = async (userUid) => {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
       finalStatus = status;
    }
    // only asks if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    // On Android, permissions are granted on app installation, so
    // `askAsync` will never prompt the user
  
    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      alert('No notification permissions!');
      return;
    }
  
    try{
      // Get the token that identifies this device
      let token = await Notifications.getExpoPushTokenAsync();
      console.log(token);
      // POST the token to your backend server from where you can retrieve it to send push notifications.

      Fire.shared.firestore
        .collection('users')
        .doc(userUid)
        .set({
          push_token: token
      }, { merge: true });
    }
    catch(error) {
      console.log(error);
    };
    
  }

}

UserPermissions = new UserPermissions();
export default UserPermissions;
   