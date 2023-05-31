<template>
  <div class="home-wrapper">
    <swiper-tips />

    <div class="checkedbox" @click="isChecked = !isChecked">
      <span v-show="!isChecked" class="circle"></span>
      <svg v-show="isChecked" t="1681376980703" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4209" width="20" height="20">
        <path d="M511.322571 63.620993c-246.971881 0-447.189925 200.206788-447.189925 447.184809s200.218044 447.184809 447.189925 447.184809c246.978021 0 447.189925-200.206788 447.189925-447.184809S758.300592 63.620993 511.322571 63.620993L511.322571 63.620993zM767.82041 394.804834 478.605426 684.031075l-0.011256 0.016373c-13.331633 13.331633-33.667797 15.410991-49.185212 6.249331-2.87856-1.699712-5.584182-3.790326-8.055466-6.249331-0.005117-0.005117-0.005117-0.005117-0.005117-0.005117L254.825756 517.519714c-15.796778-15.808034-15.796778-41.432645 0-57.245795 15.808034-15.808034 41.437761-15.808034 57.245795 0l137.90279 137.90279 260.611529-260.611529c15.802918-15.802918 41.437761-15.802918 57.240679 0C783.628444 353.378329 783.628444 379.001917 767.82041 394.804834L767.82041 394.804834zM767.82041 394.804834" fill="#4698ea" p-id="4210"></path>
      </svg>
      <span class="txt">我已认真阅读并同意</span>
      <span class="blue" @click.stop="show = true">《人脸服务协议》</span>
    </div>
    <div class="btn" @click="showCamera = true" v-if="isChecked">
      <span>采集人脸</span>
    </div>
    <!-- <van-uploader ref="uploadImg" v-if="isChecked" capture="camera" accept="image/*" :max-count="1" :before-read="beforeRead" :after-read="afterRead">
      <div class="btn">采集人脸</div>
    </van-uploader> -->
    <div class="btn unCkecked" v-else>
      <span>采集人脸</span>
    </div>

    <customCamera v-model="showCamera" @photoChange="afterRead" />

    <cropperDialog v-model="showCropper" :initImg="initImg" @confirm="confirm" />

    <protocol v-model="show" />

    <van-dialog v-model="showPreViewImg" show-cancel-button @confirm="submitFace">
      <van-image :src="cropperImg" fit="scale-down" />
    </van-dialog>
  </div>
</template>

<script>
import { Dialog } from 'vant';
import SwiperTips from './components/swiperTips.vue'
import protocol from './components/protocol'
import cropperDialog from './components/cropperDialog'
import customCamera from './components/customCamera'
import { getUrlSearchParams } from '@/utils/utils'
import { login, loginByYzm, upLoadFace } from '@/api/api'


export default {
  name: 'Home',
  data() {
    return {
      show: false,
      isChecked: false,
      user: localStorage.getItem('faceUserInfo')?JSON.parse(localStorage.getItem('faceUserInfo')):{},
      showCropper: false,
      initImg: '', // 初始化传给裁剪组件的图片
      cropperImg: '', // 裁剪后的照片
      showCamera: false,
      showPreViewImg: false
    }
  },
  created() {
    // this.getYzmLogin()
  },
  methods: {
    // 照片读取之后
    afterRead(file) {
      const { size } = file.file
      const sizeKb = size / 1024
      console.log(sizeKb, file)
      if(sizeKb > 200) {
        this.initImg = file.content
        this.showCropper = true
      } else {
        this.cropperImg = file.content
        this.showPreViewImg = true
      }
    },
    // 确定裁剪事件
    confirm(img) {
      this.cropperImg = img
      this.submitFace()
    },
    // 提交
    submitFace() {
      this.$toast({
        type: 'loading',
        forbidClick: true,
        duration: 0,
        message: '照片处理中...'
      })
      // 上传之前去掉“data:image/jpeg;base64,”
      const subStrBase64Img = this.cropperImg.substring(this.cropperImg.indexOf('base64') + 7)

      const param = { 
        studentNumber: this.user.AccIdentifier, 
        mechanismId: window['mechanismId'], 
        faceBase64: subStrBase64Img
      }
      upLoadFace(param).then(res => {
        if(res.isSuccess) {
          this.$toast.clear()
          this.$toast.success('上传成功')
          let i = setTimeout(() => {
            this.$router.back(-1)
            clearTimeout(i)
          }, 2000)
        } else {
          this.$toast.clear()
          this.customAlert('失败', res.message)
        }
      })
    },
    customAlert(title = '提示', msg = '') {
      this.$dialog.alert({
        title: title,
        message: msg
      })
    },
    // 检查yzm 并且执行登录
    async getYzmLogin() {
      let urlParams = getUrlSearchParams('Yzm')
      if (!urlParams) {
        urlParams = getUrlSearchParams('yzm')
      }
      if (!urlParams) {
        urlParams = getUrlSearchParams('YZM')
      }
      if (!urlParams) {
        return
      }
      console.log(urlParams)
      const newUrlParams = urlParams.substr(0, urlParams.length - 1) // 不知道为什么参数不是拼在#/之后
      
      if (newUrlParams) {
        loginByYzm({ yzm: newUrlParams })
          .then(res => {
            // this.$toast(res.rows.Token)
            if (res.BS === '1') {
              localStorage.setItem('token', res.rows.Token)
            } else {
              this.$toast({
                type: 'fail',
                message: res.Msg
              })
            }
          })
          .catch(err => {
            console.log(err)
            this.$toast({
              type: 'fail',
              message: '服务器繁忙',
              forbidClick: true
            })
          })
      }
    },
  },
  components: {
    [Dialog.Component.name]: Dialog.Component,
    protocol,
    SwiperTips,
    cropperDialog,
    customCamera
  }
}
</script>

<style lang="stylus" scoped>
.home-wrapper {
  padding-bottom: .25rem
}
.checkedbox{
  display: flex;
  justify-content: center;
  align-items: center;
  color: #aaa;
  font-size: 0.25rem;
  margin: 1rem 0 .4rem;
  .circle {
    display: inline-block;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 1px solid #4698ea;
  }
  .blue {
    color: #4698ea;
  }
  .txt {
    margin-left: 0.1rem;
  }
}
// ::v-deep .van-uploader {
//   position: absolute;
//   left: 50%;
//   transform: translateX(-50%);
// }
.btn {
  position: relative;
  margin: 0 auto;
  width: 60vw;
  height: 0.8rem;
  line-height: 0.8rem;
  text-align: center;
  background: #4698ea;
  font-size: .3rem;
  color: #fff;
  letter-spacing: 4px;
  border-radius: .4rem;
  overflow: hidden;
}
.unCkecked {
  background: rgba(70, 152, 234, .5);
}
</style>
