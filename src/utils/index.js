import { checkPattern } from './zipcode.js';
import store from '../store/index.js';
import { ElMessage } from 'element-plus';

//时间戳转换成时间格式
export const timestampToTime = (timestamp, isShow = true) => {
  if (timestamp !== 0 && timestamp !== undefined) {
    let date = new Date(timestamp * 1000);
    let year = `${date.getFullYear()}-`;
    let month = `${
      date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    }-`;
    let day = `${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()} `;
    if (isShow) {
      let hour = `${
        date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
      }:`;
      let minute = `${
        date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
      }:`;
      let second = `${
        date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
      }`;
      return year + month + day + hour + minute + second;
    } else {
      return year + month + day;
    }
  } else {
    return '';
  }
};

// 时间转换成时间戳
export const timeToTimestamp = (time) => {
  return Date.parse(new Date(time)) / 1000;
};

// 将类型为daterange的日期选择器绑定的值做处理
export const handleDateRange = (form, prop) => {
  if (form[prop]) {
    form[`start_${prop}`] = timeToTimestamp(form[prop][0]);
    let endDate = new Date(timestampToTime(form[prop][1] / 1000));
    form[`end_${prop}`] = timeToTimestamp(endDate.setHours(23, 59, 59));
  } else {
    form[`start_${prop}`] = '';
    form[`end_${prop}`] = '';
  }
  return form;
};

//最新轨迹时长输入校验
export const checkStayTime = (number) => {
  let reg = /^[0-9]+$/;
  if (!reg.test(number) && number) {
    ElMessage.warning('最新轨迹停留时长必须为整数');
    return false;
  } else {
    return true;
  }
};

//统一处理日期
export const handleTimestamp = (obj, propArr) => {
  propArr.forEach((i) => {
    obj[i] = timestampToTime(obj[i]);
  });
};

//时效显示处理
export const handleDays = (arr, obj) => {
  arr.forEach((item) => {
    if (obj[item] === 0) {
      obj[item] = '';
    } else if (obj[item] === -1) {
      obj[item] = -1;
    } else {
      obj[item] = `${obj[item]}天`;
    }
  });
};

// 获取缓存下拉数据
export const cache = (key, value, seconds) => {
  let timestamp = Date.parse(new Date()) / 1000;
  let expire = null;
  if (key && value === null) {
    localStorage.removeItem(key);
  } else if (key && value) {
    if (!seconds) {
      expire = timestamp + 3600 * 24 * 7;
    } else {
      expire = timestamp + seconds;
    }
    let new_value = `${value}|${expire}`;
    localStorage.setItem(key, new_value);
  } else if (key) {
    let val = localStorage.getItem(key);
    if (val) {
      let tmp = val.split('|');
      if (!tmp[1] || timestamp >= parseInt(tmp[1])) {
        localStorage.removeItem(key);
        return false;
      } else {
        return tmp[0];
      }
    }
  }
};

//获取国家的iso3
export const getCountryIso3 = (waybillForm, countryArr) => {
  let form = waybillForm;
  if (form.country_id) {
    let selectedCountry = countryArr.find((item) => {
      return item.id === form.country_id;
    });
    return new RegExp(checkPattern(selectedCountry.iso3));
  }
};

//导出
export const download = (res, type, filename, suffix) => {
  const a = document.createElement('a');
  const blob = new Blob([res], { type });
  const url = URL.createObjectURL(blob);
  a.target = '_ blank';
  a.setAttribute('href', url);
  a.setAttribute(
    'download',
    `${filename}-${timestampToTime(new Date().getTime() / 1000)}.${suffix}`
  );
  a.click();
};

//合格率颜色
export const changeRateColor = (val) => {
  let rate = parseFloat(val);
  if (rate < 97) {
    return '#EA1D1D';
  } else if (rate > 98) {
    return '#379F0D';
  } else {
    return '#F78113';
  }
};

export const adminStateColor = (key) => {
  if (key === 1) {
    return '#379f0d';
  } else if (key === 2) {
    return '#ea1d1d';
  } else {
    return '#999999';
  }
};

//百分号
export const toPercent = (item, arr) => {
  arr.forEach((i) => {
    if (item[i] === '-') {
      item[i] = '-';
    } else {
      item[i] = `${item[i]}%`;
    }
  });
};

//数组转置
export const transposeArray = (val, title) => {
  let data = [];
  let matrixData = val.map((row) => {
    let arr = [];
    for (let key in row) {
      arr.push(row[key]);
    }
    return arr;
  });
  data = matrixData[0].map((col, i) => {
    return [
      title[i],
      ...matrixData.map((row) => {
        return row[i];
      })
    ];
  });
  return data;
};

//获取周
export const getWeek = async (year) => {
  if (year) {
    try {
      await store.dispatch('statistics/getWeek', {
        params: {
          year
        }
      });
      let week = store.state.statistics.week;
      return week;
    } catch (err) {
      return;
    }
  }
};

//获取年份
export const setYearOption = () => {
  let currentYear = new Date().getFullYear();
  let option = [];
  for (let year = 2018; year <= currentYear + 1; year++) {
    option.push({
      value: year,
      key: year
    });
  }
  return option;
};

//图表无数据
export const getEmptyList = (val) => {
  if (val.length) {
    let emptyArr = [];
    for (const index in val) {
      emptyArr.push(val[index].name);
    }
    return `${emptyArr.join('、')}无数据`;
  }
};

//设置时间的起始和结束时分秒
export const defaultTime = (days) => {
  let date = new Date();
  let start = date.setHours(0, 0, 0);
  let end = date.setHours(23, 59, 59);
  start = start - 3600 * 1000 * 24 * days;
  return [start, end];
};
