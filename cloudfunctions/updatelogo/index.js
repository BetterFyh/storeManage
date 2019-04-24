// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const _ = db.command
  try {
    return await db.collection('user').doc(event.id)
      .update({
        data: {
          user_logo: event.logo,
          openid: event.openid
        }, success: res => {
          console.log('上传成功'+res)
        }
      })
  } catch (e) {
    console.error('上传错误'+ e)
  }
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}