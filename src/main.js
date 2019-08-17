import Vue from 'vue'
import App from './App'
import Hack from './utils/Hack'

Vue.use(Hack)

Vue.config.productionTip = false
App.mpType = 'app'

import fly from './utils/api-manager'
Vue.prototype.$fly = fly

import MpvueRouterPatch from 'mpvue-router-patch'
Vue.use(MpvueRouterPatch)

//全局引入api配置
import api from './utils/project-api'
Vue.prototype.$api = api;

import wxUtil from './utils/wxUtil'
Vue.prototype.$is_userInfo = wxUtil.verifyUserInfoStorage;
Vue.prototype.$is_nickname = wxUtil.verifyUserInfo;
Vue.prototype.$shareUtil = wxUtil.setShareInfo;

import common from './utils/wxUtil'
Vue.prototype.$is_null = common.judgeIsAnyNullStr;

const app = new Vue(App)
app.$mount()
