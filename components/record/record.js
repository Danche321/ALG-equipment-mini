const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext();

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
    hasRecord: false, //是否已录音
    isSaying: false, //录音中
    isListen: false, //播放框显示or隐藏
    listenState: false, //播放状态
    recordInterVal: '', //录音定时器
    interValObj: null, //播放定时器
    recordSecond: 0, //录音时长
    voiceSecond: 0, //播放时长
    recordlocalId: '', //录音localid
    loop: '', //判断长按
    recordPath: '', //录音临时文件路径
  },

  /**
   * 组件的方法列表
   */
  methods: {
    checkAuth() {
      wx.getSetting({
        success: (res) => {
          if (res.authSetting["scope.record"] === false) {
            wx.showModal({
              title: '提示',
              content: '是否开启录音权限',
              success: tip => {
                if (tip.confirm) {
                  wx.openSetting({
                    success: data => {
                      if (data.authSetting["scope.record"] === true) {
                        wx.showToast({
                          title: '授权成功',
                          icon: 'success',
                          duration: 1000
                        })
                        this.startRecord();
                      } else {
                        wx.showToast({
                          title: '授权失败',
                          icon: 'success',
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
      });
    },

    recordingTimer: function() {
      this.data.setInter = setInterval(
        () => {
          let time = this.data.recordSecond + 1;
          this.setData({
            recordSecond: time
          });
        }, 1000);
    },

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
          isSaying: true,
        });
        // 在此处做倒计时
        this.recordingTimer();
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
      recorderManager.stop();
      recorderManager.onStop(res => {
        clearInterval(this.data.setInter);
        this.data.recordPath = res.tempFilePath;
        console.warn('=v.duration===', recorderManager.duration)
        this.playConfig(res.tempFilePath);
        this.triggerEvent('recordConfirm', JSON.stringify({
          file: res.tempFilePath,
          second: this.data.recordSecond
        }))
      })
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
        this.showListenBox();
      });
      innerAudioContext.onPlay(() => {
        this.setData({
          listenState: true,
        })
        this.data.interValObj = setInterval(()=>{
          console.warn(this.data.voiceSecond)
          if(this.data.voiceSecond > 0) {
            this.setData({
              voiceSecond: --this.data.voiceSecond
            });
          } else {
            clearInterval(this.data.interValObj);
            this.setData({
              listenState: false,
              voiceSecond: this.data.recordSecond,
            })
          }
          
        },1000);
        console.log('开始播放')
      });
      innerAudioContext.onStop(() => {
        clearInterval(this.data.interValObj);
        this.setData({
          listenState: false,
          voiceSecond: this.data.recordSecond
        });
      });
      innerAudioContext.onEnded(() => {
        console.warn('结束播放');
        clearInterval(this.data.interValObj);
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
    changeListenState() {
      if (!this.data.listenState) {
        // 需要播放的音频的本地录音
        innerAudioContext.play();
      } else {
        // 需要暂停的音频的本地录音，
        innerAudioContext.stop();
      }
    },
    countDown() {
      let count = this.data.voiceSecond - 1;
      if (this.data.voiceSecond > 0) {
        this.setData({
          voiceSecond: count
        });
      } else {
        clearInterval(this.data.interValObj);
        this.setData({
          listenState: false,
          voiceSecond: this.data.recordSecond,
        });
      }
    },
    confirm() {
      this.setData({
        hasRecord: true,
        isListen: false,
        listenState: false,
        voiceSecond: this.data.recordSecond
      });
    },

    //  重新录制
    recordAgain() {
      innerAudioContext.destroy();
      this.setData({
        hasRecord: false,
        isListen: false,
        hasVoice: false,
        recordSecond: 0,
        recordPath: '',
      });

      this.triggerEvent('recordConfirm', JSON.stringify({
        file: '',
        second: ''
      }))
    }
  }
})