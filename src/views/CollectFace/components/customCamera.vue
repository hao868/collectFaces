<template>
  <van-popup v-model="show" position="top" :style="{ height: '100%' }">
    <div class="box">
      <video id="camera" :width="videoW" :height="videoH" autoplay playsinline webkit-playsinline></video>
      <div class="maskBox">
        <div class="tipsTop">请将人脸保持在取景框内</div>
        <div class="tips">
          <h3>拍照提示</h3>
          <div class="tipsDec">免冠、无墨镜、无口罩、光线均匀、目视前方</div>
        </div>
      </div>
      <div class="handlerBox">
        <van-icon name="exchange" @click="transFacingMode" size="24" />
        <van-icon name="photograph" @click="takeSnapshot" size="36" />
        <div class="album" @click="selectFile">
          <van-icon name="photo-o" size="24" />
          <input id="file" type="file" accept="image/jpg,image/jpeg,image/png" class="face-input" />
        </div>
        
        <van-icon name="cross" class="close" size="24" @click.stop="close" />
      </div>
    </div>
  </van-popup>
</template>

<script>
import tracking from "tracking"
import Compressor from 'compressorjs';
export default {
  name: 'customCamera',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  watch: {
    value: {
      immediate: true,
      handler(value) {
        this.show = value
        if(value) {
          this.invokingCamera()
        }
      }
    }
  },
  data() {
    return {
      show: false,
      videoW: window.innerWidth,
      videoH: window.innerHeight - 120,
      front: true, // 前摄像
    }
  },
  methods: {
    // 照片读取之前
    beforeRead(file) {
      if(file.size / 1024 < 30) {
        this.customAlert('提示', '照片大小必须大于等于30K')
        return false
      } else {
        return true
      }
    },
    // 选择照片
    selectFile() {
      const file = document.getElementById('file')
      file.addEventListener('change', res => {
        const currentFile = res.target.files[0]
        if (!currentFile) {
          this.customAlert('提示', '未选择任何图片')
          return;
        }
        
        if(this.beforeRead(currentFile)) {
          const _this = this
          // compressorjs 默认开启 checkOrientation 选项
          // 会将图片修正为正确方向
          new Compressor(currentFile, {
            checkOrientation: true,
            quality: 1,
            // The compression process is asynchronous,
            // which means you have to access the `result` in the `success` hook function.
            success(result) {
              // 转为base64
              const reader = new FileReader()
              reader.readAsDataURL(result)
              reader.onloadend = () => {
                _this.$emit('photoChange', {content: reader.result, file: result, message: "", status: ""})
                _this.close()
              }
            },
            error(err) {
              console.log(err.message);
            },
          });
        }
      })
      // 每次选文件之后清空value值  不然重复上传同一个文件不会触发change
      file.value = ''
    },
    close() {
      this.$emit('change', false)
      const video = document.getElementById("camera");
      if(video.srcObject) {
        video.srcObject.getTracks()[0].stop()
      }
    },
    invokingCamera() {
      // 注意本例需要在HTTPS协议网站中运行，新版本Chrome中getUserMedia接口在http下不再支持。

      // 老的浏览器可能根本没有实现 mediaDevices，所以我们可以先设置一个空的对象
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
      }

      // 一些浏览器部分支持 mediaDevices。我们不能直接给对象设置 getUserMedia
      // 因为这样可能会覆盖已有的属性。这里我们只会在没有getUserMedia属性的时候添加它。
      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function (constraints) {
          // 首先，如果有getUserMedia的话，就获得它
          const getUserMedia =
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia;

          // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
          if (!getUserMedia) {
            return Promise.reject(
              new Error("getUserMedia is not implemented in this browser")
            );
          }

          // 否则，为老的navigator.getUserMedia方法包裹一个Promise
          return new Promise(function (resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
          });
        };
      }

      this.openCamera()
    },
    transFacingMode() {
      this.front = !this.front
      this.openCamera()
    },
    openCamera() {
      // 手机可视区域宽度（请通过相关API获取真实宽度）
      const windowWidth = window.innerWidth;
      // 手机可视区域高度（请通过相关API获取真实高度）
      const windowHeight = window.innerHeight;

      const constraints = {
        audio: false,
        video: {
          // 前置摄像头
          facingMode: (this.front ? "user" : "environment"),
          // 该属性相当于手机端的高
          width: Math.max(windowWidth, windowHeight) - 120, // 减去 120 用于在页面底部放置拍照等功能按钮
          // 该属性相当于手机端的宽
          height: Math.min(windowWidth, windowHeight),
        },
      };

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function (stream) {
          const video = document.getElementById("camera");
          // 旧的浏览器可能没有srcObject
          if ("srcObject" in video) {
            video.srcObject = stream;
          } else {
            // 防止在新的浏览器里使用它，应为它已经不再支持了
            video.src = window.URL.createObjectURL(stream);
          }
          video.onloadedmetadata = function (e) {
            setTimeout(() => {
              video.play();
            }, 500)
          };
        })
        .catch(function (err) {
          alert(`${err.name}: 打开摄像头失败，你可以选择点击右下角的图标选择照片上传或关闭网页重新打开`)
          console.log(err.name + ":- " + err.message);
        });
    },
    takeSnapshot() {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const video = document.querySelector("video");
      canvas.width = Math.min(video.videoWidth, video.videoHeight);
      canvas.height = Math.max(video.videoWidth, video.videoHeight);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // ****** 镜像处理 ******
      const getPixel = (imageData, row, column) => {
        const uint8ClampedArray = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        const pixel = [];
        for (let i = 0; i < 4; i++) {
          pixel.push(uint8ClampedArray[row * width * 4 + column * 4 + i]);
        }
        return pixel;
      }

      const setPixel = (imageData, row, column, pixel) => {
        const uint8ClampedArray = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        for (let i = 0; i < 4; i++) {
          uint8ClampedArray[row * width * 4 + column * 4 + i] = pixel[i];
        }
      }

      const mirrorImageData = ctx.createImageData(canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let h = 0; h < canvas.height; h++) {
        for (let w = 0; w < canvas.width; w++) {
          const pixel = getPixel(imageData, h, canvas.width - w - 1);
          setPixel(mirrorImageData, h, w, pixel);
        }
      }
      ctx.putImageData(mirrorImageData, 0, 0);
      // ****** 镜像处理 ******

      const base64 = canvas.toDataURL("image/jpeg");
      const blob =  this.dataURLtoBlob(base64);
      const fileName = `faceImg-${new Date().getTime()}`;
      const file = this.blobToFile(blob,fileName);
      this.$emit('photoChange', {content: base64, file, message: "", status: ""})
      this.close()
    },
    //1,先将base64转换为blob
    dataURLtoBlob(dataurl) {
      let arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },
    //2,再将blob转换为file
    blobToFile(theBlob, fileName){
      theBlob.lastModifiedDate = new Date();  // 文件最后的修改日期
      theBlob.name = fileName;                // 文件名
      return new File([theBlob], fileName, {type: theBlob.type, lastModified: Date.now()});
    },
    customAlert(title = '提示', msg = '') {
      this.$dialog.alert({
        title: title,
        message: msg
      })
    },
  },
}
</script>

<style scoped>
.box {
  background: antiquewhite;
  overflow: hidden;
}
.maskBox {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: calc(100vh - 120px);
  z-index: 1;
}
.maskBox:after {
  position: absolute;
  height: 5.4rem;
  width: 5.4rem;
  left: 50%;
  top: 18%;
  content: '';
  transform: translateX(-50%);
  border-radius: 50%;
  box-shadow: 0 0 0 calc(100vh - 120px) rgba(255, 255, 255, 0.7);
  z-index: 1;
}

.tipsTop {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  font-size: 0.3rem;
  margin-top: 14%;
  color: #333;
  z-index: 2;
}

.tips {
  position: absolute;
  top: calc(16vh + 5.8rem);
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.28rem;
  color: #333;
  font-weight: 600;
  text-align: center;
  width: 100vw;
  z-index: 2;
}

.tipsDec {
  color: #999;
  font-size: 0.25rem;
  font-weight: 400;
  margin-top: 10px;
}

.handlerBox {
  position: relative;
  width: 100vw;
  height: 116px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 2;
}

.close {
  position: absolute;
  top: 8px;
  right: 8px;
}

.album {
  position: relative;
}

.face-input {
  position:absolute;
  width: 30px;
  height :30px;
  left :0;
  top :0;
  z-index : 1;
  clip:inherit;
  opacity :0;
  border-radius: .4rem;
}
</style>