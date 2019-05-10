// miniprogram/pages/order/list.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    list: [],
    goodInfo: {},
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      userInfo: wx.getStorageSync('userinfo')
    })
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    if (options.id) {
      this.setData({
        active: options.id
      })
    }
    if (this.data.active == 0) {
      this.allList();
      return
    }
    const db = wx.cloud.database()
    db.collection('order').where({
      status: this.data.active
    }).get().then(res => {
      // console.log(res)
      if (res.data) {
        this.setData({
          list: res.data
        })
        wx.hideLoading()
        // const db = wx.cloud.database()
        // db.collection('goods').where({ 'list.id': this.data.list[0].goodId }).get().then(res2 => {
        //   console.log(res2)
        //   var list = res2.data[0].list.filter(item=>{
        //     return item.id == this.data.list[0].goodId
        //   })
        //   console.log(res2.data[0])

        //   var tempObj = res2.data[0]
        //   tempObj.list = list
        //   this.setData({
        //     goodInfo: tempObj
        //   })

        // })
      }

    })

  },
  activeId(e) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    this.setData({
      active: e.target.dataset.idx
    })
    if (e.target.dataset.idx == 0) {
      this.allList();
      return
    }
    const db = wx.cloud.database()
    db.collection('order').where({
      status: this.data.active
    }).get().then(res => {
      // console.log(res)
      wx.hideLoading()
      if (res.data) {
        this.setData({
          list: res.data
        })
      }

    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  // all
  allList() {
    const db = wx.cloud.database()
    db.collection('order').get().then(res => {
      wx.hideLoading()
      // console.log(res)
      if (res.data) {
        this.setData({
          list: res.data
        })
      }
    })
  },
  // 归还
  reBack(e) {
    var that = this
    // console.log(e.currentTarget.dataset.id)
    // console.log(e.currentTarget.dataset.orderid)

    wx.showModal({
      title: '操作确认',
      content: '确认归还编号【' + this.data.list[0].goodInfo.list[0].id + '】物品?',
      success: res => {
        wx.showLoading({
          title: '归还中...',
        })
        wx.cloud.callFunction({
          name: 'reBack',
          data: {
            orderId: e.currentTarget.dataset.orderid,
            backManager: that.data.userInfo.user_name,
            backManagerId: that.data.userInfo._id
          }
        }).then(res1 => {
          console.log(res1)
        })

        const db = wx.cloud.database()
        db.collection('goods').where({
          'list.id': e.currentTarget.dataset.id
        }).get().then(res2 => {
          var tempArr = res2.data[0].list.filter(item => {
            return item.id == this.data.list[0].goodId
          })
          tempArr[0].isStork = 1
          var list = res2.data[0].list;
          list[tempArr[0].index] = tempArr[0]
          // console.log(list)
          wx.cloud.callFunction({
            name: 'updateStork',
            data: {
              goodId: e.currentTarget.dataset.id,
              list: list
            }
          }).then(res2 => {
            console.log(res2)
          })
        })

        wx.showToast({
          title: '归还成功!'
        })
        // wx.hideLoading()
        console.log('确认归还')
        setTimeout(function(){
          wx.switchTab({
            url: '/pages/user/user'
          })
        },1000)
       
      },
      fail: res => {
        return;
      }
    })

  },
  toMore(e) {

    wx.navigateTo({
      url: '/pages/order/orderInfo?info=' + JSON.stringify(e.currentTarget.dataset.info)
    })
  },
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