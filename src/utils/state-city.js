import { cache } from './index.js';
import store from '../store/index.js';

export const getState = async (country) => {
  let state = cache(`logistics-state-${country}`);
  let stateObj = {};
  if (state) {
    stateObj = JSON.parse(state);
  } else {
    try {
      await store.dispatch('getState', {
        params: {
          country_id: country
        }
      });
      stateObj = JSON.parse(cache(`logistics-state-${country}`));
    } catch (err) {
      return;
    }
  }
  return stateObj;
};

export const getCity = async (country, state) => {
  let city = cache(`logistics-city-${state}-${country}`);
  let cityObj = {};
  if (city) {
    cityObj = JSON.parse(city);
  } else {
    try {
      await store.dispatch('getCity', {
        params: {
          country_id: country,
          state_id: state
        }
      });
      cityObj = JSON.parse(cache(`logistics-city-${state}-${country}`));
    } catch (err) {
      return;
    }
  }
  return cityObj;
};
