
class PushNotifications {

  sendMessageNotification = (token) => { 
    let response = fetch('https://exp.host/--/api/v2/push/send',{
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify ({
        to: token,
        sound: 'default',
        title: 'Social App',
        body:'You have a new Message'
      })
    }); 
  };
}

PushNotifications = new PushNotifications();
export default PushNotifications;