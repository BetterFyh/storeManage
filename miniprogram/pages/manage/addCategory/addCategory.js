// miniprogram/pages/manage/addCategory/addCategory.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    category_name: "",
    categoryList: [],
    id: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadCategory();
  },
  loadCategory() {
    const that = this
    const db = wx.cloud.database()
    db.collection('category').get().then(res => {
      var cateList = res.data;

      var cateNameList = [];
      if (cateList.length > 0) {
        cateList.forEach(item => {
          cateNameList.push(item.name)
        })
      }

      that.setData({
        categoryList: cateNameList,
        id: cateList[cateList.length - 1].id
      })
      // console.log(this.data.categoryList)
    })
  },
  categoryInput: function(e) {
    this.setData({
      category_name: e.detail.value
    })
  },
  add() {
    var that = this
    if (!this.data.category_name) {
      wx.showToast({
        title: '请输入名称！',
        icon: 'none',
        image: '../../../images/icon_http_error.png'

      })
    } else if (this.data.categoryList.includes(this.data.category_name)) {
      wx.showToast({
        title: '该类别已存在！',
        icon: 'none',
        image: '../../../images/icon_http_error.png'
      })
    } else {
      const db = wx.cloud.database()
      db.collection('category').add({
        data: {
          id: that.data.id + 1,
          name: that.data.category_name
        }
      }).then(res => {

      })
      wx.showToast({
        title: '添加成功！',
        duration: 2000,
        mask: true
      })
     setTimeout(function(){
       wx.switchTab({
         url: '/pages/manage/manage'
       })
     },2000)
      
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