import thunkMiddleware from 'redux-thunk';
import loggerMiddleware from './middleware/loggerMiddleware';

// define store middlewares as an array
export default [
  // thunkMiddleware, redux starter kitでmiddleware扱いになるためコメントアウト
  loggerMiddleware,
];
