import { localStorageKeys } from './constants';

export const loginDetails = () => {
  const isLoggedIn = localStorage.getItem(localStorageKeys.isLoggedIn);
  let result = false;
  if (isLoggedIn) {
    result = JSON.parse(isLoggedIn);
  }
  return result;
};
