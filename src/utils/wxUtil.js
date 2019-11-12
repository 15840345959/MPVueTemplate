import { base64encode, judgeIsAnyNullStr } from "@/utils/api-common"
import fly from './api-manager'
import { api } from './project-api'
// import store from '../store/index'
import qiniuUploader from '../utils/qiniuUploader'

//获取七牛上传token 并 初始化七牛相关参数
export async function getQiniuToken() {
    let res = await fly
        .request({
            method: api.getQiniuToken.method,
            url: api.getQiniuToken.url,
            body: {}
        })
    // console.log("qiniu upload token:" + qnToken)
    let qnToken = res.ret

    let options = {
        region: 'ECN', // 华东区
        uptoken: qnToken
    };
    qiniuUploader.init(options);
}


// 微信拍照并七牛上传图片
export function chooseImage() {
    return new Promise((resolve, reject) => {
        wx.chooseImage({
            sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
            count: 1,
            success: function (res) {
                let tempFilePaths = res.tempFilePaths[0];
                wx.showLoading({
                    title: '正在上传图片',
                })
                qiniuUploader.upload(
                    tempFilePaths,
                    res => {
                        wx.hideLoading()
                        let image = getImgRealUrl(res.key);
                        resolve(image)
                    },
                    error => {
                        console.error("七牛上传图片err: " + JSON.stringify(error));
                        reject(error)
                    }
                );
            },
            fail: function (err) {
                console.error("微信上传图片err: " + JSON.stringify(error));
            }
        });
    })
}

export function uploadImg(img) {
    return new Promise((resolve, reject) => {
        qiniuUploader.upload(
            img,
            res => {
                wx.hideLoading()
                let image = getImgRealUrl(res.key);
                resolve(image)
            },
            error => {
                console.error("七牛上传图片err: " + JSON.stringify(error));
                reject(error)
            }
        );
    })
}

//图片下载到本地
export function saveImage(image) {
    return new Promise((resolve, reject) => {
        console.log("图片下载到本地：" + JSON.stringify(image));
        //下载到本地
        wx.downloadFile({
            url: image,
            success: function (res) {
                if (res.statusCode === 200) {
                    wx.saveImageToPhotosAlbum({
                        filePath: res.tempFilePath,
                        success(res) {
                            wx.hideLoading();
                            console.log("保存成功");
                            resolve(true);
                        },
                        fail(e) {
                            wx.hideLoading();
                            // if (e.errMsg == "saveImageToPhotosAlbum:fail auth deny") {}
                            if (e.errMsg != "saveImageToPhotosAlbum:fail cancel") {
                                // vm.showDialog()
                            }
                            console.log("saveImageToPhotosAlbum错误:" + JSON.stringify(e));
                            resolve(false);
                        }
                    });
                }
            },
            fail: function (e) {
                resolve(false);
                console.log("downloadFile错误：：：" + JSON.stringify(e));
            }
        });
    });
}

// 七牛上传图片
export function ctxQiniuUpload() {
    return new Promise((resolve, reject) => {
        showLoading("上传中")
        const ctx = wx.createCameraContext();
        ctx.takePhoto({
            quality: "high",
            success: res => {
                qiniuUploader.upload(res.tempImagePath, res => {
                    wx.hideLoading()
                    let image = getImgRealUrl(res.key);
                    wx.hideLoading()
                    resolve(image)
                }, error => {
                    console.error("七牛上传图片err: " + JSON.stringify(error));
                    wx.hideLoading()
                    reject(error)
                }
                );
            },
            fail: err => {
                wx.hideLoading()
                console.log("拍照错误：：" + JSON.stringify(err));
            }
        });
    })
}

//七牛上传视频
export function chooseVideo() {
    return new Promise((resolve, reject) => {
        wx.chooseVideo({
            sourceType: ['album', 'camera'],
            maxDuration: 60,
            camera: 'back',
            success: function (res) {
                var tempFilePath = res.tempFilePath
                wx.showLoading({
                    title: '正在上传视频',
                })
                qiniuUploader.upload(tempFilePath, (res) => {
                    wx.hideLoading();
                    var video = getImgRealUrl(res.key)
                    resolve(video)
                }, (error) => {
                    reject(error)
                    console.error("七牛上传视频err: " + JSON.stringify(error));
                })
            },
            fail: function (error) {
                reject(error)
                console.error("微信上传图片err: " + JSON.stringify(error));
            }
        })
    });
}

// 转换真实地址
function getImgRealUrl(key) {
    return 'http://twst.isart.me/' + key
}

//微信支付
export function wxPay(payParam) {
    return new Promise((resolve, reject) => {
        wx.requestPayment({
            timeStamp: payParam.timeStamp,
            nonceStr: payParam.nonceStr,
            package: payParam.package,
            signType: payParam.signType,
            paySign: payParam.paySign,
            success(res) {
                resolve(res)
                showToast("支付成功")
            },
            fail(err) {
                showToast("您取消了支付")
                console.log("微信支付错误:" + JSON.stringify(err));
                reject(err)
            }
        })
    })
}

//获取窗口可用高度
export function getWindowHeight() {
    try {
        const res = wx.getSystemInfoSync()
        return res.windowHeight;//可用窗口高度
    } catch (e) {
        console.log("获取可用窗口高度错误:" + JSON.stringify(e));
    }
}

// 微信登陆拿code
export function wxLogin() {
    return new Promise((resolve, reject) => {
        //登录
        wx.login({
            success: res => {
                // console.log("wxlogin成功:" + JSON.stringify(res.code));
                resolve(res.code)
            },
            fail: err => {
                console.log("wxlogin错误:" + JSON.stringify(err));
                reject(err)
            }
        });
    })
}
//根据code查询用户信息
export async function auth_login() {
    let code = await wxLogin()
    console.log("code::：" + JSON.stringify(code));
    let ret = await fly
        .request({
            method: api.wechat_login.method,
            url: api.wechat_login.url,
            body: {
                account_type: "xcx",
                code
            }
        })

    let wechat_login_res = ret.ret
    console.log("登陆成功接口调用成功：" + JSON.stringify(wechat_login_res));

    if (wechat_login_res) {
        wx.setStorageSync('userInfo', wechat_login_res)
    } else {
        wx.removeStorageSync('userInfo')
    }

    return wechat_login_res
}

/*
 *根据等级校验用户信息
 *
 */

// export async function byLevelGetUserInfo(level) {
//     switch (level) {
//         case 1:
//             return await verifyUserInfoStorage();
//             break;
//         case 2:
//             let userInfo = await verifyUserInfoStorage();
//             await verifyUserInfo();
//             return userInfo
//             break;
//     }
// }

/*
 *根据等级校验用户信息
 *    1  校验本地缓存中有无用户信息
 *    2  校验本地缓存中有无用户信息 并 校验用户信息中有无名字头像等信息
 *    3  校验用户信息中是否有电话号码
 *    4  不校验直接使用code登录 并 校验用户信息中有无名字头像等信息
 */
export async function byLevelGetUserInfo(level) {
    switch (level) {
        case 1:
            return await verifyUserInfoStorage();
        case 2:
            var userInfo = await verifyUserInfoStorage();
            await verifyUserInfo();
            return userInfo
        case 3:
            return await verifyPhonenum();
        case 4:
            var userInfo = await auth_login();
            await verifyUserInfo();
            return userInfo
        case 5:
            var userInfo = await auth_login();
            return userInfo
    }
}

//校验是否本地是否有用户缓存
export async function verifyUserInfoStorage() {
    let userInfo = wx.getStorageSync("userInfo");
    if (userInfo) {
        return userInfo
    }
    console.log("首页111:");
    let userInfo_login = await auth_login();
    return userInfo_login
}
//校验是否获取过用户信息
export function verifyUserInfo() {
    let userInfo = wx.getStorageSync("userInfo");
    // console.log("-----" + JSON.stringify(userInfo));
    if (!userInfo.nick_name) {
        console.log("没有nick_name:::" + JSON.stringify(userInfo));
        wx.navigateTo({ url: "/pages/authorization" });
        return false
    }
    return true
}
//调用微信的getUserInfo获取用户信息
async function wxGetUserInfo() {
    return new Promise((resolve, reject) => {
        wx.getUserInfo({
            success: function (res) {
                var userInfo = res.userInfo
                resolve(userInfo)
            },
            fail: function (err) {
                console.log("微信的getUserInfo错误：" + JSON.stringify(err))
            }
        })
    })
}
//根据编号更新用户信息
export async function updateUserinfo() {
    let userInfo_new = await wxGetUserInfo()
    let param = {
        gender: userInfo_new.gender,               //性别 0：未知、1：男、2：女
        nick_name: userInfo_new.nickName,
        avatar: userInfo_new.avatarUrl,
        country: userInfo_new.country,
        province: userInfo_new.province,
        city: userInfo_new.city,
        language: userInfo_new.language,
    }
    let userInfo = await post(config.auth_updateById, param)
    wx.setStorageSync('userInfo', userInfo)
    console.log("根据编号更新用户信息:" + JSON.stringify(userInfo))
    return userInfo
}
//消息解密
export async function decryptData(encrypted_data, iv, code) {
    let ret = await fly.request({
        method: api.wechat_decryptData.method,
        url: api.wechat_decryptData.url,
        body: {
            code,
            encryptedData: base64encode(encrypted_data),
            iv: base64encode(iv)
        }
    })
    let userInfo = ret.ret
    console.log("消息解密" + JSON.stringify(userInfo));
    if (userInfo) {
        wx.setStorageSync('userInfo', userInfo)
    }
    return userInfo
}

//更新小程序
export function updataXcx() {
    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
        const updateManager = wx.getUpdateManager()
        updateManager.onCheckForUpdate(function (res) {
            // console.log("是否有更新：" + JSON.stringify(res.hasUpdate))
            // 请求完新版本信息的回调
            if (res.hasUpdate) {
                updateManager.onUpdateReady(function () {
                    wx.showModal({
                        title: '更新提示',
                        content: '新版本已经准备好，是否重启应用？',
                        success: function (res) {
                            if (res.confirm) {
                                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                                updateManager.applyUpdate()
                            }
                        }
                    })
                })
                updateManager.onUpdateFailed(function () {
                    // 新的版本下载失败
                    wx.showModal({
                        title: '已经有新版本了哟~',
                        content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
                    })
                })
            }
        })
    } else {
        // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
        wx.showModal({
            title: '提示',
            content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
        })
    }
}

//判断是否授权过
export function getSetting(authType) {
    return new Promise((resolve, reject) => {
        wx.getSetting({
            success: (res) => {
                // 是否授权过
                if (!res.authSetting[authType]) {
                    wx.authorize({
                        scope: authType,
                        success(res) {
                            resolve(true)
                        },
                        fail() {
                            console.log("授权失败：" + authType)
                            reject(false)
                        }
                    })
                } else {
                    resolve(true)
                }
            },
            fail: (err) => {
                console.log("getSetting错误：" + JSON.stringify(err))
                reject(false)
            }
        })
    })
}

export function showToast(title) {
    wx.showToast({
        title,
        icon: 'none',
        duration: 2000
    })
}

//搜索历史相关操作
// 将搜索历史存入本地缓存，在获取搜索历史时从本地缓存中获取
//本地缓存名称为seach_word_storage_arr，数组形式

/*
 * 获取缓存数据
 *
 * By TerryQi
 * 2019-09-15
 * 
 * @param max_history_words_num：需要获取的最多的历史纪录数目
 * 
 * @return [];
 * 
 */
export function getSearchHistoryWords(max_history_words_num) {
    var search_history_word_arr = wx.getStorageSync("search_history_word_arr");
    //首次搜索，没有搜索历史，返回空数组
    if (!search_history_word_arr) {
        return [];
    }
    if (search_history_word_arr.length > max_history_words_num) {
        search_history_word_arr = search_history_word_arr.slice(0, max_history_words_num - 1);
    }
    return search_history_word_arr;
}

/*
 * 将搜索历史存入数组
 *
 * @param search_word
 * 
 * @return [],存入后的最新历史搜索数组
 *
 */
export function storeSearchHistoryWord(search_word, max_history_words_num = 10) {
    let search_history_word_arr = wx.getStorageSync("search_history_word_arr");
    //首次搜索，没有搜索历史，返回空数组
    if (!search_history_word_arr) {
        search_history_word_arr = [];
    }
    search_history_word_arr.unshift(search_word); //插入到首位
    wx.setStorageSync("search_history_word_arr", search_history_word_arr);
    getSearchHistoryWords(max_history_words_num);
}


//展示Modal
export function showModal(title, content, showCancel = false, call) {
    wx.showModal({
        title,
        content,
        showCancel,
        success(res) {
            if (res.confirm) {
                call(true)
            } else if (res.cancel) {
                call(false)
            }
        }
    })
}

//设置分享参数
export function setShareInfo(shareJson) {
    let userInfo = wx.getStorageSync("userInfo");
    return {
        title: shareJson.title,
        imageUrl: shareJson.imageUrl,
        path: `${shareJson.path}a_user_id=${userInfo.id}&mch_code=${
            userInfo.mch_code
            }`
    };
}

//获取分享参数
export function getShareInfo(appParam) {
    let scene = appParam.scene;
    scene = decodeURIComponent(scene);
    let shareInfo = {};
    if (!judgeIsAnyNullStr(scene)) {
        let mch_code = getQueryString("code", scene); //scene中code
        let id = getQueryString("id", scene); //文章详情页面文章id
        if (!judgeIsAnyNullStr(mch_code)) {
            shareInfo.mch_code = mch_code;
        }
        if (!judgeIsAnyNullStr(id)) {
            shareInfo.id = id;
        }
    }

    if (!judgeIsAnyNullStr(appParam.a_user_id)) {
        shareInfo.a_user_id = appParam.a_user_id;
        fly
            .request({
                method: api.userInvite_record.method,
                url: api.userInvite_record.url,
                body: { a_user_id: appParam.a_user_id }
            }).then(res => {
                console.log("被邀请记录分享信息：" + JSON.stringify(res))
                if (res) {
                    if (res.is_popup_flag) {
                        showModal('邀请成功', '您通过好友的邀请进入小程序,成功为好友助力~', false, ret => { })
                    }
                }
            });
    }
    if (!judgeIsAnyNullStr(appParam.shop_store_id)) {
        shareInfo.shop_store_id = appParam.shop_store_id;
    }
    return shareInfo;
}

//获取参数
export function getQueryString(name, url) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = url.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

//展示loadding
export function showLoading(title) {
    if (!wx.canIUse('showLoading')) {
        return;
    }
    if (judgeIsAnyNullStr(title)) {
        title = "加载中";
    }
    wx.showLoading({
        title
    })
}
export default {
    wxLogin,
    auth_login,
    getWindowHeight,
    getQiniuToken,
    chooseImage
}