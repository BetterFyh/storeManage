// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const _ = db.command
  try {
    return await db.collection('user').add({
      data: {
        levelInfo: '管理员',
        openid: "",
        user_level: 1,
        user_logo: "",
        user_name: event.username,
        user_password: event.pwd,
        user_phone: event.phone
      }
    })
  } catch (e) {
    console.error('上传错误' + e)
  }
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}