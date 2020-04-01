
import { connect } from 'react-redux';
import { compose } from 'recompose';
import HomeScreen from '../screens/HomeScreen';
import UserModule from '../redux/modules/Home/UserModule';

export default compose(
  connect(
    state => ({
      avatar: state.user.avatar,
      email: state.user.email,
      name: state.user.name, 
      push_token: state.user.push_token,
      
    }),
    dispatch => ({
      setChangeUser: (avatar, email, name, push_token) =>
        dispatch(
          UserModule.actions.setChangeUser({
            avatar: avatar,
            email: email,
            name: name,
            push_token: push_token
          })
        ),
      clear: () =>
        dispatch(
          UserModule.actions.clear()
        ),
    }),
  ),
)(HomeScreen);
