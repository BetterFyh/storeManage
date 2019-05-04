// miniprogram/pages/home/detail/detail.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    good: {},
    goodList: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var id = options.id
    console.log(id)
    const db = wx.cloud.database()
    db.collection('goods').where({
      'list.id': id
    }).get().then(res => {
      console.log(res)
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

  // 确认借出
  confirm() {
    var that = this
    wx.showModal({
        title: '操作确认',
        content: '确认借出编号【' + this.data.good.id + '】物品?',
        success: res => {
          const db = wx.cloud.database()
          db.collection('goods').where({
            'list.id': id
          }).get().then(res => {
            console.log(res)
            var list = res.data[0].list
            var good = list.filter(item => {
              return item.id == id
            })
            console.log(good)
            if(!good.isStork){
              wx.showToast({
                title: '物品已被借出!',
                mask: true,
                icon: 'none',
                image: '../../../images/icon_http_error.png'
              })
            }else{
              
            }
          })
        }
    })
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