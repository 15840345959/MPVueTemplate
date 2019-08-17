<template>
  <div>
    <div style="width:750rpx;text-align:center;margin-top:200rpx;">我是首页啊</div>
    <div>{{test}}</div>
    <i-button>我是iview的组件</i-button>
  </div>
</template>
<script>
import { byLevelGetUserInfo } from "../utils/wxUtil";
import { user_getXCXOpenId } from "../utils/project-api";
export default {
  data() {
    return {
      ads: [],
      test:"测试",
      value: ""
    };
  },
  //点击获取用户信息接口返回信息
  methods: {
    getAd() {
      user_getXCXOpenId({}, res => {
        if (res.result) {
          console.log("---------");
        }
      });
    }
  },

  async beforeMount() {
    this.test = "efaef";
    let userInfo = await byLevelGetUserInfo(2);
  },
  // 分享小程序
  onShareAppMessage(res) {
    let shareJson = this.$shareUtil({
      title: mch_info.name,
      path: `/pages/index/main?`
    });
    console.log("分享:" + JSON.stringify(shareJson));
    return shareJson;
  }
};
</script>
<style scoped>
</style>


