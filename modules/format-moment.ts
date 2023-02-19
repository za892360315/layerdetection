/*
 * @Author: liul
 * @Date: 2022-09-01 09:40:50
 * @Discription:
 */
import moment, { MomentInput, unitOfTime, DurationInputArg1, DurationInputArg2 } from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");

/**
 * @Author: liul
 * @param {string} timeStr：时间字符串
 * @return  返回时间戳
 */
export function getTimeStamp(timeStr?: MomentInput) {
  return moment(timeStr).valueOf();
}
/**
 * @Author: liul
 * @param {*} timestamp
 * @param {*} momentFormat
 * @return  返回格式化后的时间
 */
export function formatTimeByStr(momentFormat = "YYYY-MM-DD", timestamp?: string | number) {
  return moment(timestamp).format(momentFormat);
}

/**
 * @Author: liul
 * 时间回退
 * @param {DurationInputArg1} num 回退的时间数字，可以为负数，前进
 * @param {DurationInputArg2} format 'days','week','months','year'
 * @return 回退后的时间
 */
export function formatTimeInterval(num: DurationInputArg1, format: DurationInputArg2, momentInputStr?: string) {
  const time = new Date().getTime();
  return moment(time).subtract(num, format).format(momentInputStr);
}

/**
 * @Author: liul
 * @param str 起始的范围的单位，year，month，day
 * @param momentFormat moment的格式
 * @return  当前范围的开始的时间
 */
export function getStartOfByTimeStr(str: unitOfTime.StartOf = "year", momentFormat = "YYYY-MM-DD") {
  const startTime = moment().year(moment().year()).startOf(str).valueOf();
  return moment(startTime).format(momentFormat);
}

/**
 * @Author: liul
 * @param {MomentInput} str 时间戳
 * @return  返回周几的数字格式
 */
export function getWeekDay(str?: MomentInput) {
  return moment(str).format("E");
}
