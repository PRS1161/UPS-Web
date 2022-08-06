export const { REACT_APP_API_URL } = process.env;

export const localStorageKeys = {
  isLoggedIn: 'isLoggedIn',
  token: 'token'
};

export const paginationKeys = {
  page: 1,
  limit: 10,
  search: ''
};

export const toastMessages = {
  inputMainFail: 'Input mains fail. Load on battery',
  inputMainFailAndBatteryLow: 'UPS tripped. Battery discharged'
};

export const minMainVoltage = 0;
export const minBatteryVoltage = 10;

export const backgrounds = {
  link: '#00B6F0',
  button: '#053984',
  error: '#FCCACF',
  success: '#CAFCEB'
};
