const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext();
const app = getApp()
// components/record.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    recordPath: String,
    hasRecord: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    ICON_URL: app.globalData.ICON_URL,
    innerAudioContext: '', // 录音对象
    hasRecord: false, //是否已录音
    isSaying: false, //录音中
    isListen: false, //播放框显示or隐藏
    listenState: false, //播放状态
    recordInterVal: '', //录音定时器
    playingTimer: null, //播放定时器
    recordSecond: 0, //录音时长
    voiceSecond: 0, //播放时长
    recordlocalId: '', //录音localid
    recordPath: '', //录音临时文件路径
    isSayingTimer: null // 是否已经在录音定时器
  },

  /**
   * 组件的方法列表
   */
  methods: {
    checkAuth() {
      wx.getSetting({
        success: (res) => {
          console.log(res)
          if (res.authSetting["scope.record"] === false) { // 拒绝
            wx.showModal({
              title: '提示',
              content: '是否开启录音权限',
              success: tip => {
                if (tip.confirm) {
                  wx.openSetting({
                    success: data => {
                      console.log(data)
                      console.log(data.authSetting["scope.record"])
                      if (data.authSetting["scope.record"] === true) {
                        wx.showToast({
                          title: '授权成功',
                          icon: 'success',
                          duration: 1000
                        })
                        this.setData({
                          isAuth: true
                        })
                      } else {
                        wx.showToast({
                          title: '授权失败',
                          icon: 'none',
                          duration: 1000
                        });
                      }
                    }
                  })
                }
              }
            })
          } else {
            this.startRecord();
          }
        },
        fail: err => {
          console.warn('权限获取失败====', err)
        }
      })
    },

    // 开始录音
    startRecord() {
      const options = {
        duration: 60000, //指定录音的时长，单位 ms，最大为10分钟（600000），默认为1分钟（60000）
        sampleRate: 16000, //采样率
        numberOfChannels: 1, //录音通道数
        encodeBitRate: 96000, //编码码率
        format: 'mp3', //音频格式，有效值 aac/mp3
        frameSize: 50, //指定帧大小，单位 KB
      }
      recorderManager.start();
      recorderManager.onStart(() => {
        this.setData({
          isSaying: true
        });
        // 在此处做倒计时
        this.data.setInter = setInterval(() => {
          this.setData({
            recordSecond: ++this.data.recordSecond
          });
        }, 1000)
        console.warn('开始录音，弹出计时弹窗');
      });
      recorderManager.onError(res => {
        console.warn('录音错误', res);
        clearInterval(this.data.setInter);
        this.setData({
          isSaying: false,
          recordSecond: 0,
        })
      });
    },

    stopRecord() {
      // 由于开启录音是异步的，所以轮询是否在录音中，如果是才停止
      this.data.isSayingTimer = setInterval(() => {
        if (this.data.isSaying) {
          recorderManager.stop();
          console.log(`时间：${this.data.recordSecond}`)
          clearInterval(this.data.setInter);
          if (this.data.recordSecond < 3) {
            wx.showToast({
              title: '录制时间过短',
              icon: 'none'
            })
            this.setData({
              isSaying: false,
              recordSecond: 0,
            })
          } else {
            recorderManager.onStop(res => {
              this.data.recordPath = res.tempFilePath;
              console.warn('=v.duration===', recorderManager.duration)
              this.playConfig(res.tempFilePath);
              this.triggerEvent('recordConfirm', JSON.stringify({
                file: res.tempFilePath,
                second: this.data.recordSecond
              }))
            })
          }
          clearInterval(this.data.isSayingTimer)
        }
      }, 500)
    },

    showListenBox() {
      this.setData({
        isSaying: false,
        isListen: true,
        voiceSecond: this.data.recordSecond
      });
    },

    playConfig(path) {
      innerAudioContext.src = path;
      innerAudioContext.onCanplay(() => {
        console.log('可以出来了')
        this.showListenBox()
      });
      innerAudioContext.onPlay(() => {
        console.log('我要播放啦')
        this.setData({
          listenState: true,
        })
        this.data.playingTimer = setInterval(() => {
          console.warn(this.data.voiceSecond)
          if (this.data.voiceSecond > 0) {
            this.setData({
              voiceSecond: --this.data.voiceSecond
            });
          } else {
            clearInterval(this.data.playingTimer);
            console.log('放完了1')
            this.setData({
              listenState: false,
              voiceSecond: this.data.recordSecond,
            })
          }
        }, 1000);
        console.log('开始播放')
      });
      innerAudioContext.onStop(() => {
        clearInterval(this.data.playingTimer);
        console.log('别放了')
        this.setData({
          listenState: false,
          voiceSecond: this.data.recordSecond
        });
      });
      innerAudioContext.onEnded(() => {
        console.warn('结束播放');
        console.log('快停下')
        clearInterval(this.data.playingTimer);
        this.setData({
          listenState: false,
          voiceSecond: this.data.recordSecond,
        })
      });
      innerAudioContext.onError((res) => {
        console.log(res.errMsg)
        console.log(res.errCode)
      })
    },

    // 播放/暂停
    changeListenState() {
      if (!this.data.listenState) {
        // 需要播放的音频的本地录音
        innerAudioContext.play();
      } else {
        // 需要暂停的音频的本地录音，
        innerAudioContext.stop();
      }
    },

    // 确定
    confirm() {
      this.setData({
        hasRecord: true,
        isListen: false,
        listenState: false,
        voiceSecond: this.data.recordSecond
      });
      innerAudioContext.stop();
    },

    //  重新录制
    recordAgain() {
      innerAudioContext.destroy();
      this.setData({
        listenState: false,
        hasRecord: false,
        isListen: false,
        hasVoice: false,
        recordSecond: 0,
        voiceSecond: 0,
        recordPath: '',
      });
      this.triggerEvent('recordConfirm', JSON.stringify({
        file: '',
        second: ''
      }))
    }
  }
})