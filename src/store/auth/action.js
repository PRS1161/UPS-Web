import * as Types from './type';

export function onUserLogInSuccess() {
  return { type: Types.success };
}

export function onUserLogOut() {
  return { type: Types.logout };
}
