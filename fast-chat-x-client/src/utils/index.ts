import moment from 'moment-timezone'

// 日期格式化
export const formatDate = (date: Date) => {
  //   console.log(date)
  return moment.utc(date).format('YYYY-MM-DD HH:mm:ss')
}

// 消息盒子日期格式化
export const formatMessageDate = (date: Date) => {
  // 计算时间是否大于一天
  //   console.log(date)
  if (-moment(date).diff(moment(), 'days') === 1) {
    return '昨天'
  }
  if (-moment(date).diff(moment(), 'days') > 0) {
    return moment.utc(date).format('MM-DD')
  }
  return moment.utc(date).format('HH:mm')
}
