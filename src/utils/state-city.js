import { cache } from './index.js';
import store from '../store/index.js';

export const getState = async (country) => {
  let state = cache(`logistics-state-${country}`);
  let stateArr = [
    {
      id: 0,
      origin: '请选择',
      disabled: true
    }
  ];
  if (state) {
    stateArr = stateArr.concat(JSON.parse(state));
  } else {
    try {
      await store.dispatch('getState', {
        params: {
          country_id: country
        }
      });
      if (cache(`logistics-state-${country}`)) {
        stateArr = stateArr.concat(
          JSON.parse(cache(`logistics-state-${country}`))
        );
      }
    } catch (err) {
      return;
    }
  }
  return stateArr;
};

export const getCity = async (country, state) => {
  let city = cache(`logistics-city-${state}-${country}`);
  let cityArr = [
    {
      id: 0,
      origin: '请选择',
      disabled: true
    }
  ];
  if (city) {
    cityArr = cityArr.concat(JSON.parse(city));
  } else {
    try {
      await store.dispatch('getCity', {
        params: {
          country_id: country,
          state_id: state
        }
      });
      if (cache(`logistics-city-${state}-${country}`)) {
        cityArr = cityArr.concat(
          JSON.parse(cache(`logistics-city-${state}-${country}`))
        );
      }
    } catch (err) {
      return;
    }
  }
  return cityArr;
};
