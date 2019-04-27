// miniprogram/pages/addGoods/addGoods.js
let QRCode = require('../../util/qrcode.js')
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
    cateId: '',
    canvasHidden: false,
    qeCordPath: [],
    list: []
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
      // var list = []
      for (var i = 0; i < this.data.num; i++) {
        var id = this.uuid();
        var size = this.setCanvasSize()
        console.log(size);
        this.createQrCode(id, "mycanvas", size.w, size.h); 
        // var path = this.data.qeCordPath
        // console.log(path)
        // console.log(qrCodeLogo)
       

      }
      console.log(that.data.list)
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
          // console.log(list)
          that.setData({
            imagePath: 'https://7374-storemange-7be934-1259027697.tcb.qcloud.la/goodsLogo/' + that.data.name + '.jpg'
          })
          wx.cloud.callFunction({
            name: 'addGoods',
            data: {
              id: that.data.cateId,
              list: that.data.list,
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
  setCanvasSize: function () {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 686; //不同屏幕下canvas的适配比例；设计稿是750宽 686是因为样式wxss文件中设置的大小
      var width = res.windowWidth / scale;
      var height = width; //canvas画布为正方形
      size.w = width;
      size.h = height;
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
  },
  /**
   * 绘制二维码图片
   */
  createQrCode: function(url, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
    QRCode.api.draw(url, canvasId, cavW, cavH);
    setTimeout(() => {
      this.canvasToTempImage(url);
    }, 1000);
  },
  /**
   * 获取临时缓存照片路径，存入data中
   */
  canvasToTempImage: function(id) {
    var that = this;
    var path = ''
    //把当前画布指定区域的内容导出生成指定大小的图片，并返回文件路径。
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function(res) {
        var tempFilePath = res.tempFilePath;
        that.setData({
          qeCordPath: tempFilePath
        });
       
        wx.cloud.uploadFile({
          cloudPath: 'Qrcode/' + that.data.name + id + '.png',
          // 指定要上传的文件的小程序临时文件路径
          filePath: that.data.qeCordPath,
          success: res => {
            var obj = {
              id: id,
              isStork: 1,
              qrCodeLogo: 'https://7374-storemange-7be934-1259027697.tcb.qcloud.la/Qrcode/' + that.data.name + id + '.png',
              info: '全新'
            }
            that.data.list.push(obj)
          }
        })
        console.log(that.data.list)
      },
      fail: function(res) {
        console.log(res);
      }
    });
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