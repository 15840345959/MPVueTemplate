<template>
  <div>
    <!-- login部分 -->
    <div style="width:100%;height:250px;position:relative;border-bottom:1px solid #f7f7f7;">
      <div style="width:100%;text-align:center;position:absolute;top:40px;">
        <img src="/static/images/logo.png" style="width:120px;height:120px;">
      </div>
      <div style="width:100%;text-align:center;position:absolute;top:190px;">
        <text style="font-size:24px;">康复云平台</text>
      </div>
    </div>
    <!-- 授权 -->
    <div>
      <div style="margin-left:30px;margin-top:20px;">
        <div style="100%">
          <text style="color:#888">登陆后该应用将会获取以下权限</text>
        </div>
        <div>
          <text style="color:#888">-获得你的公开信息（昵称、头像等）</text>
        </div>
      </div>
      <div style="width:100%;position:absolute;bottom:80px;">
        <div style="text-align:center;margin-left:20%;margin-right:20%">
          <button
            plain="true"
            style="background:#1AAc19;color:#fff;border:none"
            open-type="getUserInfo"
            @getuserinfo="onGotUserInfo"
          >登录</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { decryptData, wxLogin } from "../utils/wxUtil";

export default {
  data() {
    return {
      code: ""
    };
  },
  methods: {
    //授权
    async onGotUserInfo(e) {
      // console.log("获取用户信息" + JSON.stringify(e));
      var errMsg = e.mp.detail.errMsg;
      if (errMsg == "getUserInfo:fail auth deny") {
        console.log("登录失败");
      } else {
        let encryptedData = e.mp.detail.encryptedData;
        let iv = e.mp.detail.iv;
        let userInfo = await decryptData(encryptedData, iv, this.code);
        this.$router.push({
          path: "/pages/index",
          reLaunch: true
        });
      }
    }
  },
  async beforeMount() {
    this.code = await wxLogin();
  }
};
</script>
<style scoped>
</style>