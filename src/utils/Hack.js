const pageDatas = {}

export default {
  install(_Vue) {
    // 添加全局方法或属性
    _Vue.prototype.$isPage = function isPage() {
      return this.$mp && this.$mp.mpType === 'page'
    }

    _Vue.prototype.$pageId = function pageId() {
      let pid = null
      try {
        pid = this.$isPage() ? this.$mp.page.__wxWebviewId__ : null
      } catch (e) { }
      return pid
    }

    // 注入组件
    _Vue.mixin({

      methods: {
        stashPageData() {
          return { data: { ...this.$data } }
        },
        restorePageData(oldData) {
          Object.assign(this.$data, oldData.data)
        },
      },

      onLoad() {
        if (this.$isPage()) {
          // 新进入页面
          Object.assign(this.$data, this.$options.data())
        }
      },

      onUnload() {
        if (this.$isPage()) {
          // 退出页面，删除数据
          delete pageDatas[this.$pageId()]
          this.$needReloadPageData = true
        }
      },

      onHide() {
        if (this.$isPage()) {
          // 将要隐藏时，备份数据
          pageDatas[this.$pageId()] = this.stashPageData()
        }
      },

      onShow() {
        if (this.$isPage()) {
          // 如果是后退回来的，拿出历史数据来设置data
          if (this.$needReloadPageData) {
            const oldData = pageDatas[this.$pageId()]
            if (oldData) {
              this.restorePageData(oldData)
            }
            this.$needReloadPageData = false
          }
        }
      },

    })
  },
}