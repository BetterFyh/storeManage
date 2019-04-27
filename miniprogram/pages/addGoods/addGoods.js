// miniprogram/pages/addGoods/addGoods.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectArray: [],
    imagePath: '',
    name: '',
    num: 0,
    cateId: ''
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
  click(e) {
    // console.log(e.detail.id)
    this.setData({
      cateId: e.detail.id
    })
  },
  upImage() {
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths[0]
        // console.log(tempFilePaths)
        that.setData({
          imagePath: tempFilePaths
        })
      }
    })
  },
  // 确认入库
  confirm() {
    let that = this
    if (!this.data.cateId || !this.data.name || !this.data.num || !this.data.imagePath) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none',
        image: '../../images/icon_http_error.png',
        mask: true
      })
    } else {
      var list = []
      for (var i = 0; i < this.data.num; i++) {
        var id = this.uuid();
        var obj = {
          id: id,
          isStork: 1,
          info: '全新'
        }
        list.push(obj)
      }
      // console.log(list)
      wx.showLoading({
        title: '入库中...',
        mask: true
      })
      wx.cloud.uploadFile({
        // 指定上传到的云路径
        cloudPath: 'goodsLogo/' + that.data.name + '.jpg',
        // 指定要上传的文件的小程序临时文件路径
        filePath: that.data.imagePath,
        // 成功回调
        success: res => {
          // console.log('上传成功', res)
          that.setData({
            imagePath: 'https://7374-storemange-7be934-1259027697.tcb.qcloud.la/goodsLogo/' + that.data.name + '.jpg'
          })
          wx.cloud.callFunction({
            name: 'addGoods',
            data: {
              id: that.data.cateId,
              list: list,
              logo: that.data.imagePath,
              name: that.data.name
            },
            complete: res => {
              console.log(res)
              wx.showToast({
                title: '入库成功'
              })
              wx.hideLoading()
              wx.switchTab({
                url: '/pages/manage/manage'
              })
            }
          })

        },
      })
      // wx.showToast({
      //   title: '完美'

      // })
    }
  },
  nameInput(e) {
    // console.log(e)
    this.setData({
      name: e.detail.value
    })
  },
  numInput(e) {
    // console.log(e)
    this.setData({
      num: e.detail.value
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