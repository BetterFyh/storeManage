// miniprogram/pages/login/login.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: 'fyh',
    pwd: '123456',
    openid: '',
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getOpenid();
  },
  accountInput: function(e) {
    this.setData({
      username: e.detail.value
    })
  },
  pwdInput: function(e) {
    this.setData({
      pwd: e.detail.value
    })
  },
  // 获取用户openid
  getOpenid() {
    let that = this;
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        // console.log('云函数获取到的openid: ', res.result.userInfo.openId)
        var openId = res.result.userInfo.openId;
        app.globalData.openid = openId
        that.setData({
          openid: openId
        })
      }
    })
  },
  login: function() {
    var that = this;
    if (!that.data.username || !that.data.pwd) {
      wx.showToast({
        title: '账号或密码不能为空',
        icon: 'none',
        image: '../../images/icon_http_error.png',
        mask: true
      })
    }
     else {
      const db = wx.cloud.database()
      db.collection('user').where({
        user_name: this.data.username,
        user_password: this.data.pwd
      }).get().then(res => {
        // console.log(res)
        // 正常登录  有且只有一条数据
        if(res.data.length === 1){
          wx.login({
            success: function(data){
              wx.getUserInfo({
                success: function(result){
                   
                  // console.log(res)
                  that.setData({
                    userInfo: res.data[0],
                    'userInfo.user_logo': result.userInfo.avatarUrl
                  })
                  wx.showToast({
                    title: '登录成功',
                    icon: 'success',
                    mask: true
                  })
                  // 第一次登陆才绑定头像和openid
                  if (!that.data.userInfo.openid){
                    var id = res.data[0]._id
                    var logo = result.userInfo.avatarUrl
                    wx.cloud.callFunction({
                      name: 'updatelogo',
                      data: {
                        id: id,
                        logo: logo,
                        openid: app.globalData.openid
                      },
                      complete: res => {
                        console.log(res)
                      }
                    })
                  }
                  
                  
                  // console.log(this.data.userInfo)
                  // 将用户信息存在本地  保持登录状态
                  wx.setStorageSync('userinfo', that.data.userInfo)
                  wx.switchTab({
                    url: '/pages/home/home'
                  })
                }
              })
            }
          })
        }else{
          wx.showToast({
            title: '账号或密码错误!',
            icon: 'none',
            image: '../../images/icon_http_error.png',
            mask: true
          })
        }
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