// miniprogram/pages/home/listDetail/listDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodList: null,
    inList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options)
    var id = options.id
    const db = wx.cloud.database()
    db.collection('goods').where({
      _id: id
    }).get().then(res => {
      // console.log(res)
      this.setData({
        goodList: res.data
      })
      var list = this.data.goodList[0].list
      // var inList = []
      // console.log(list)
      var inList = list.filter(item=>{
        return item.isStork > 0
      })
      // console.log(inList)
      this.setData({
        inList: inList
      })
    })
  },
  // 借出
  toBorw(e){
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../detail/detail?id=' + e.currentTarget.dataset.id
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