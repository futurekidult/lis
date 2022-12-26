//时间戳转换成时间格式
export const timestampToTime = (timestamp) => {
  if (timestamp !== 0 && timestamp !== undefined) {
    let date = new Date(timestamp * 1000);
    let year = `${date.getFullYear()}-`;
    let month = `${
      date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    }-`;
    let day = `${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()} `;
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
    return '';
  }
};

// 时间转换成时间戳
export const timeToTimestamp = (time) => {
  return Date.parse(time) / 1000;
};

// 将类型为daterange的日期选择器绑定的值做处理
export const handleDateRange = (form, prop) => {
  if (form[prop]) {
    form[`start_${prop}`] = timeToTimestamp(form[prop][0]);
    form[`end_${prop}`] = timeToTimestamp(form[prop][1]);
  } else {
    form[`start_${prop}`] = '';
    form[`end_${prop}`] = '';
  }
  return form;
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
