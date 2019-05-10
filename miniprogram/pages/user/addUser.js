// miniprogram/pages/user/addUser.js
var util = require('../../util/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    pwd: '',
    secondPwd: '',
    phone: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  accountInput: function (e) {
    this.setData({
      username: e.detail.value
    })
  },
  pwdInput: function (e) {
    this.setData({
      pwd: e.detail.value
    })
  },
  secondPwdInput: function(e){
    this.setData({
      secondPwd: e.detail.value
    })
  },
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  add(){
    let isPhone = util.isCheckMobile(this.data.phone);
    if (!this.data.username || !this.data.pwd || !this.data.secondPwd || !this.data.phone){
      wx.showToast({
        title: '请填写全部信息',
        icon: 'none',
        image: '../../images/icon_http_error.png'
      })
    } else if (this.data.pwd.length < 6){
      wx.showToast({
        title: '密码长度须>6',
        icon: 'none',
        image: '../../images/icon_http_error.png'
      })
    }else if (this.data.pwd != this.data.secondPwd){
      wx.showToast({
        title: '密码不一致',
        icon: 'none',
        image: '../../images/icon_http_error.png'
      })
    } else if (!isPhone) {
      console.log(this.data.phone)
      console.log(isPhone)
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    }else{
      let that = this;
      wx.showModal({
        title: '操作确认',
        content: '确认添加【' + this.data.username +'】为管理员?',
        success(res) {
          if (res.confirm) {
            // console.log('用户点击确定')
            wx.showLoading({
              title: '添加中...'
            })
            wx.cloud.callFunction({
              name: 'addUser',
              data: {
                username: that.data.username,
                pwd: that.data.pwd,
                phone: that.data.pwd
              },success: res =>{
                wx.showToast({
                  title: '添加成功!',
                  duration: 2000,
                  mask: true
                })
                setTimeout(function(){
                  wx.switchTab({
                    url: '/pages/user/user'
                  })
                }, 1000)
                
              },
              complete: res => {
                // console.log('云函数获取到的openid: ', res.result.userInfo.openId)
                console.log(res)
              }
            })
          } else if (res.cancel) {
            console.log('取消添加!')
          }
        }
      })
    }
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