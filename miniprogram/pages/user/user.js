// miniprogram/pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
      var userinfo = wx.getStorageSync('userinfo')
      this.setData({
        userInfo: userinfo
      })
    }
  },
  // 查看记录
  toOrder(e){
    // console.log(e.currentTarget.dataset.id)
    // 去订单页数据库筛选数据
    wx.navigateTo({
      url: '/pages/order/list?id=' + e.currentTarget.dataset.id
    })
  },
  // 退出登录
  logout(){
    wx.showModal({
      title: '操作确认',
      content: '确认退出登录?',
      success(res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          wx.removeStorageSync('userinfo');
          wx.redirectTo({
            url: '/pages/login/login'
          })
        } else if (res.cancel) {
          // console.log('用户点击取消')
          return;
        }
      }
    })
   
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})