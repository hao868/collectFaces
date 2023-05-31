<template>
  <van-dialog v-model="show" title="人脸服务协议" @close="close">
    <div class="content">
      <h3>第一条 总则</h3>
      <p>1、本服务协议(以下称“本协议”)是广西筑波智慧科技有限公司(以下简称“服务提供方”)与“一卡通”持卡用户 (以下简称“用户或“您”)就“人脸服务” (以下简称“本服务”)的使用等相关事项所订立的有效合约；</p>
      <p>2、在接受本协议之前，请您仔细阅读本协议的全部内容，如果您不同意本协议的任意内容，或者无法准确理解条款的解释，请不要进行后续操作。您通过网络页面点击确认或以其他方式选择接受本协议，即表示您与服务提供方已达成协议并同意接受本协议的全部约定内容。</p>
      <h3>第二条 定义</h3>
      <p>1、人脸采集:指用户通过上传本地相册图片、自拍完成本人人脸图片的采集，并完成与您的一卡通帐户信息绑定；</p>
      <p>2、刷脸服务:指用户开通刷脸服务并完成人脸图片的采集后，用户可通过在商家处扫描人脸即识别您的一卡通账户信息，并完成相关O20服务;</p>
      <p>3、020服务:指在本服务特约商户的线下门店中开展的消费、充值、门禁、自助设备等。</p>
      <h3>第三条 基础条款</h3>
      <p>1、您同意，在您开通刷脸服务后，本服务需要采集并保存您的脸部图片。您应根据页面的提示上传您本人的照片，系统判断您的照片符合要求后，即可完成脸部信息采集。</p>
    </div>
  </van-dialog>
</template>

<script>
import { Dialog } from 'vant';
export default {
  name: 'protocol',
  components: {
    [Dialog.Component.name]: Dialog.Component,
  },
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
  data() {
    return {
      show: false
    }
  },
  watch: {
    value: {
      handler(value) {
        this.show = value
      },
      immediate: true
    },
    //value为编辑框输入的内容，这里我监听了一下值，当父组件调用得时候，如果给value赋值了，子组件将会显示父组件赋给的值
  },
  methods: {
    close() {
      this.$emit('change', false)
    }
  }
}
</script>

<style lang="stylus" scoped>
.content {
  box-sizing: border-box;
  padding: 0 16px 10px;
  overflow-y: auto;
  max-height: 72vh;
}

::v-deep .van-dialog__header {
  padding: 8px 0;
}

h3 {
  text-align: center;
  font-weight: 600;
  font-size: .28rem;
  margin: 10px 0;
}

p {
  font-size: .25rem;
  letter-spacing: 1.5px;
  margin-bottom: 10px;
  line-height: 16px;
}
</style>