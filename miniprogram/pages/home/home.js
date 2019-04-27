// miniprogram/pages/home/home.js

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    if (!wx.getStorageSync('userinfo')) {
      wx.showToast({
        title: '请先登录!',
        icon: 'none',
        image: '../../images/icon_http_error.png',
        mask: true
      })
      wx.redirectTo({
        url: '/pages/login/login',
      })
    } else {
      // console.log(wx.getStorageSync('userinfo'))
      const db = wx.cloud.database()
      db.collection('goods').get().then(res => {
        console.log(res);
      })
    }

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