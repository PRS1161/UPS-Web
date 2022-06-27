import * as Types from './type';
import { localStorageKeys } from '../../common/constants';

const initialState = {
  isLoggedIn: !!localStorage.getItem(localStorageKeys.isLoggedIn)
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.success:
      return {
        ...state,
        isLoggedIn: true
      };
    case Types.logout:
      return {
        ...state,
        isLoggedIn: false
      };
    default:
  }
  return state;
};

export default authReducer;
