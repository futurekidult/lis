//公共方法,比如时间转换
export const timestampToTime = (timestamp) => {
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
};

export const timeToTimestamp = (time) => {
  let date = new Date(time);
  return date.getTime() / 1000;
};
