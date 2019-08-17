// 配置项
import { http_flyio } from "./api-manager";

/*
 * 需要使用async同步调用接口时 需要使用fly及api
 * Acker
 * 19-04-30
 */

export const api = {
    //根据code获取用户openid
    user_getXCXOpenId: {
        url: `/user/getXCXOpenId`,
        method: `post`,
    },
    //更新用户信息
    user_updateById: {
        url: `/user/updateById`,
        method: `post`,
    },
    //登陆
    wechat_login: {
        url: `/user/login`,
        method: `post`,
    },
    // 绑定unionid 并更新用户信息
    wechat_decryptData: {
        url: `/user/bindUnionId`,
        method: `post`,
    },
    //获取七牛token
    getQiniuToken: {
        url: `/getQiniuToken`,
        method: `get`,
    },
}

/*
 * 需要使用回调获取数据时使用下面封装好的方法
 * Acker
 * 19-04-30
 */

//获取测试列表
export function user_getXCXOpenId(param, callback, loadding_flag = true, loadding_text = "加载中...") {
    http_flyio("/user/getXCXOpenId", "post", param, callback, loadding_flag);
}

export default {
    api,
    user_getXCXOpenId
}