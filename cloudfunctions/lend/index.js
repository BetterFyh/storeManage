// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const _ = db.command
  try {
    return await db.collection('order').add({
      data: {
        goodId: event.goodId,
        manageId: event.manageId,
        manager: event.manager,
        backManager: '',
        backManagerId: '',
        goodInfo: event.goodInfo,
        borrower: event.borrower,
        borrowerPhone: event.borrowerPhone,
        time: db.serverDate(),
        backTime: '',
        status: String(1),
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