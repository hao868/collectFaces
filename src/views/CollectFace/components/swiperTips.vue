<template>
  <div>
    <h2>采集人脸</h2>
    <div class="dec">采集清晰的面部照片使人脸身份认证更安全</div>
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="#2347bd">
      <van-swipe-item v-for="(item, index) in swiperList" :key="index">
        <div class="swItem">
          <img :src="require('@/assets/images/' + item.imgName + '.svg')" alt="">
          <div class="desc">
            <span>{{ item.txt }}</span>
            <img :src="require('@/assets/images/' + item.iconName + '.svg')" alt="">
          </div>
        </div>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
export default {
  name: 'swiperTips',
  data() {
    return {
      swiperList: [
        { imgName: 'sw1', txt: '正确人脸', iconName: 'yes' },
        { imgName: 'sw2', txt: '脸部遮挡', iconName: 'no' },
        { imgName: 'sw3', txt: '光线不足', iconName: 'no' },
        { imgName: 'sw4', txt: '脸部不完整', iconName: 'no' }
      ]
    }
  }
}
</script>

<style scoped>
h2 {
  font-size: 0.4rem;
  padding: .4rem;
  font-weight: 400;
  font-family: PingFang SC,PingFang SC-Regular;
}

.dec {
  color: #aaa;
  font-size: .25rem;
  margin: .4rem;
}

.my-swipe {
  margin: 1rem 0;
}
.my-swipe .van-swipe-item {
  color: #bbb;
  font-size: .2rem;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.swItem {
  width: 90%; 
}

.swItem>img {
  width: 3rem;
  height: 5rem;
}

.desc {
  padding: .7rem 0;
}
.desc img {
  margin-left: 0.1rem;
}

::v-deep .van-swipe__indicator {
  background-color: #999;
}

</style>