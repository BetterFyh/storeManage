// miniprogram/pages/addGoods/addGoods.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectArray: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.click(options)
    const that = this
    const db = wx.cloud.database()
    db.collection('category').get().then(res => {
      that.setData({
        selectArray: res.data
      })
    })
  },
  // 随机生成永不重复的id  9位16进制
  uuid() {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [];
    // i;
    for (var i = 0; i < 9; i++) {
      uuid[i] = chars[0 | Math.random() * 16];
    }
    return uuid.join('');
  },
  click(e){
    console.log(e.detail.id)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})