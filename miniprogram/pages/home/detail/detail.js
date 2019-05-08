// miniprogram/pages/home/detail/detail.js
const app = getApp()
var util = require('../../../util/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    good: {},
    goodList: {},
    userInfo: {},
    borrowerName: '',
    borrowerPhone: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (wx.getStorageSync('userinfo')) {
      this.setData({
        userInfo: wx.getStorageSync('userinfo')
      })
    }
    var id = options.id
    // console.log(id)
    const db = wx.cloud.database()
    db.collection('goods').where({
      'list.id': id
    }).get().then(res => {
      // console.log(res)
      var list = res.data[0].list
      var good = list.filter(item => {
        return item.id == id
      })
      // console.log(good)
      this.setData({
        good: good[0],
        goodList: res.data[0]
      })
    })
  },
  nameInput(e) {
    // console.log(e)
    this.setData({
      borrowerName: e.detail.value
    })
  },
  phoneInput(e) {
    this.setData({
      borrowerPhone: e.detail.value
    })
  },
  // 确认借出
  confirm() {
    if(!this.data.good.isStork){
      wx.showToast({
        title: '物品不在库！',
        icon: 'none',
        image: '../../../images/icon_http_error.png'
      })
      return;
    }
    var that = this
    let isPhone = util.isCheckMobile(this.data.borrowerPhone);
    if (!this.data.borrowerName || !this.data.borrowerPhone) {
      wx.showToast({
        title: '请填写完整信息！',
        icon: 'none',
        image: '../../../images/icon_http_error.png'
      })
    } else if (!isPhone) {
      wx.showToast({
        title: '错误的手机号！',
        icon: 'none',
        image: '../../../images/icon_http_error.png'
      })
    } else {
      wx.showModal({
        title: '操作确认',
        content: '确认借出编号【' + this.data.good.id + '】物品?',
        success: res => {
          wx.showLoading({
            title: '借出中...',
            mask: true
          })
          const db = wx.cloud.database()
          db.collection('goods').where({
            'list.id': that.data.good.id
          }).get().then(res => {
            // console.log(res)
            var list = res.data[0].list
            var good = list.filter(item => {
              return item.id == that.data.good.id
            })
            that.setData({
              ['goodList.list']: good
            })
            // console.log(good)  长度为1的数组
            if (!good[0].isStork) {
              wx.showToast({
                title: '物品已被借出!',
                mask: true,
                icon: 'none',
                image: '../../../images/icon_http_error.png'
              })
            } else {
              // console.log(that.data.good.id)
              wx.cloud.callFunction({
                name: 'lend',
                data: {
                  goodId: that.data.good.id,
                  manageId: that.data.userInfo._id,
                  manager: that.data.userInfo.user_name,
                  goodInfo: that.data.goodList,
                  borrower: that.data.borrowerName,
                  borrowerPhone: that.data.borrowerPhone
                }
              }).then(res1 => {
                wx.showToast({
                  title: '借出成功!'
                })
                console.log(res1)
              })
              db.collection('goods').where({
                'list.id': that.data.good.id
              }).get().then(res2 => {
                var tempArr = res2.data[0].list.filter(item => {
                  return item.id == that.data.good.id
                })
                tempArr[0].isStork = 0
                var list = res2.data[0].list;
                list[tempArr[0].index] = tempArr[0]
                // console.log(list)
                wx.cloud.callFunction({
                  name: 'updateStork',
                  data: {
                    goodId: that.data.good.id,
                    list: list
                  }
                }).then(res2 => {
                  wx.hideLoading()
                  wx.switchTab({
                    url: '/pages/home/home'
                  })
                  // console.log(res2)
                })
              })
            }
          })
        },
        fail: res => {
          console.log('取消')
          return
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