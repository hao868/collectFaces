<template>
  <div class="homeWrapper">
    <h2>我的信息</h2>
    <div class="cardInfo">
      <div class="isUse">
        <template v-if="isUse">
          <van-icon name="passed" size="17" />
          <span style="padding-left: .1rem;">使用中</span>
        </template>
        <template v-else>
          <van-icon name="warning-o" size="17" />
          <span style="padding-left: .1rem;">未开通</span>
        </template>
      </div>
      <div class="cardContent">
        <div class="avatar">
          <img :src="faceAvatar" alt="" class="myAvatar" v-if="isUse" />
          <img src="@/assets/images/avatar.svg" alt="" class="myAvatar" v-if="!isUse" />
        </div>
        <div class="infoBox">
          <div class="info">
            <div class="name" v-if="userInfo.AccName">{{userInfo.AccName}}</div>
            <div class="studentNum" v-if="userInfo.AccIdentifier">{{userInfo.AccIdentifier}}</div>
          </div>
          <div class="btn" @click.stop="jump">{{isUse?'重新采集':'立即采集'}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUrlSearchParams } from '@/utils/utils'
import { login, loginByYzm, getFace } from '@/api/api'

export default {
  name: 'Home',
  data() {
    return {
      isUse: false,
      faceAvatar: '', // 人脸照片
      userInfo: localStorage.getItem('faceUserInfo')?JSON.parse(localStorage.getItem('faceUserInfo')):{}
    }
  },
  async created() {
    // 之前要检查token的 现在就只管验证码了
    await this.getYzmLogin()
    // this.loginByUser()
    if(JSON.stringify(this.userInfo) == '{}') return
    this.getFace()
  },
  methods: {
    getFace() {
      const param = {studentNumber: this.userInfo.AccIdentifier, mechanismId: window['mechanismId']}
      getFace(param).then(res => {
        console.log(res)
        if(res.isSuccess) {
          this.isUse = true
          const photo = res.dataModel.photo
          if(photo.indexOf('base64') != -1) {
            this.faceAvatar = photo
          } else {
            this.faceAvatar = 'data:image/jpeg;base64,' + photo
          }
        }
      })
    },
    jump() {
      this.$router.push({path: '/collectFace'})
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

      if (!urlParams) return

      console.log(urlParams)
      const newUrlParams = urlParams.substr(0, urlParams.length - 1) // 不知道为什么参数不是拼在#/之后
      // this.$dialog.alert({
      //   title: '登陆验证码',
      //   message: newUrlParams
      // })
      // console.log(newUrlParams)
      if (newUrlParams) {
        loginByYzm({ YZM: newUrlParams })
          .then(res => {
            // this.$toast(res.rows.Token)
            if (res.Bs === 1) {
              console.log(res)
              this.userInfo = res.Rows.UserInfo
              this.getFace()
              localStorage.setItem('faceUserInfo', JSON.stringify(res.Rows.UserInfo))
              history.pushState({}, '', location.origin + location.pathname)
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
    // 测试使用的账号
    loginByUser() {
      if (!localStorage.getItem('token')) {
        login({
          account: '13878819596',
          accPW: '123456',
          sourceCode: '',
          keyId: ''
        })
          .then(res => {
            if (res.BS === '1') {
              localStorage.setItem('token', res.rows.Token)
            } else {
              this.$toast({
                type: 'fail',
                message: res.Msg,
                forbidClick: true
              })
            }
          })
          .catch(err => {
            this.$toast({
              type: 'fail',
              message: '登陆信息失效，请重试',
              forbidClick: true
            })
            console.log(err)
          })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.homeWrapper {
  padding: .2rem;
  box-sizing: border-box;
}
h2 {
  font-size: 0.4rem;
  margin: .2rem auto .2rem .2rem;
  font-weight: 400;
  font-family: PingFang SC,PingFang SC-Regular;
}
.cardInfo {
  width: 100%;
  height: 2.6rem;
  background: #2347bd;
  border-radius: .18rem;
  box-shadow: 0 0.06rem 0.09rem 0 rgba(196,214,255,.9);
  box-sizing: border-box;
  color: #fff;
  font-size: .25rem;
  padding: .35rem;
}

.isUse {
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.cardContent {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.avatar {
  margin-right: .2rem;
  box-sizing: border-box;
}

.avatar img {
  width: 1.4rem;
  height: 1.4rem;
}

.avatar .myAvatar {
  border-radius: 50%
}

.infoBox {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.info {
  font-size: .25rem;
}

.name {
  margin-bottom: .2rem;
}

.btn {
  background: #fff;
  padding: .2rem .4rem;
  color: #2347bd;
  border-radius: .6rem;
  cursor: pointer;
}
</style>
