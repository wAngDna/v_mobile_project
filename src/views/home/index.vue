<template>
  <div class='container'>
    <van-nav-bar fixed title="嘎嘎头条" right-text="搜索" @click-right="$router.push('/search')" />
    <van-tabs :lazy-render="false"
     animated swipeable @change="changeChannel"
     v-model="activeIndex" >
      <van-tab :key="item.id" v-for="item in channelsList"
       :title="item.name">
        <div ref="scroll-wrapper" class="scroll-wrapper"
         @scroll="remember($event)">
          <van-cell-group>
            <van-pull-refresh v-model="activeChannel.downLoading"
            :success-text="downLoadText"
             @refresh="onRefresh">
              <van-list v-model="activeChannel.upLoading" :finished="activeChannel.finished"
                finished-text="没有更多了"
                @load="onLoad">
                <van-cell
                :key="items.art_id"
                :to="{name:'article',params:{id:items.art_id.toString()}}"
                v-for="items in activeChannel.articles" >
                  <div class="article_item">
                    <h3 class="van-ellipsis">
                      {{items.title}}
                      </h3>
                    <div class="img_box" v-if="items.cover.type===3">
                      <van-image lazy-load v-for="(img,index) in items.cover.images" class="w33" fit="cover" :src="img" :key="index" />
                    </div>
                    <div class="img_box" v-if="items.cover.type===1">
                      <van-image lazy-load v-for="(img,index) in items.cover.images" class="w100" fit="cover" :src="img" :key="index" />
                    </div>
                    <div class="info_box">
                      <div class="info">
                        <span>
                          作者 /
                          {{items.aut_name}}
                        </span>
                        <span>
                          评论数:
                          {{items.comm_count}}
                        </span>
                        <span>
                          {{items.pubdate | relTime}}
                        </span>
                      </div>
                      <div class="handle">
                        <span
                          v-if="user.token"
                          class="close"
                          @click.stop="openMoreAction(items.art_id.toString())">
                          <van-icon name="ellipsis"></van-icon>
                        </span>
                      </div>
                    </div>
                  </div>
                </van-cell>
              </van-list>
            </van-pull-refresh>
          </van-cell-group>
        </div>
       </van-tab>
    </van-tabs>
    <span class="bar_btn" slot="nav-right" @click="showChannel">
      <van-icon name="wap-nav" ></van-icon>
    </span>
    <more-action v-if="user.token"
     v-model="showMoreAction"
     @on-dislike="removeArticle"
      @on-report="removeArticle"
     :articleId="articleId" >
     </more-action>
    <channel-edit
    v-model="showEditChannel"
    :channelsList="channelsList"
    @updateChannel="updateChannel"
    :activeIndex="activeIndex"></channel-edit>
  </div>
</template>

<script>
import { channels } from '@/api/channels'
import { getArticles } from '@/api/articles'
import moreAction from '@/components/more-action'
import channelEdit from './components/channel-edit'
import { mapState } from 'vuex'
export default {
  name: 'article-list',
  components: {
    moreAction,
    channelEdit
  },
  data () {
    return {
      channelsList: [],
      articles: [], // 文章列表
      downLoadText: '', // 刷新提示
      activeIndex: 0, // 当前分页索引
      showMoreAction: false,
      articleId: null,
      showEditChannel: false
    }
  },
  // 组件开启缓存生效，激活组件(初始化和激活都执行)
  activated () {
    // 驼峰获取dom无效问题
    if (this.$refs['scroll-wrapper']) {
      const dom = this.$refs['scroll-wrapper'][this.activeIndex]
      dom.scrollTop = this.activeChannel.scrollTop
    }
  },
  created () {
    this.getChannelList()
  },
  watch: {
    user () {
      this.activeIndex = 0
      this.getChannelList()
      this.onLoad()
    }
  },
  computed: {
    activeChannel () {
      return this.channelsList[this.activeIndex]
    },
    ...mapState(['user'])
  },
  methods: {
    updateChannel (i) {
      this.activeIndex = i
    },
    // 打开频道管理列表
    showChannel () {
      this.showEditChannel = true
    },
    // 删除文章
    removeArticle () {
      const articles = this.activeChannel.articles
      // item.art_id.toString()为数值类型，需要类型转换才能删除
      const index = articles.findIndex(item => item.art_id.toString() === this.articleId)
      articles.splice(index, 1)
    },
    // 打开更多操作栏
    openMoreAction (articleId) {
      this.showMoreAction = true
      this.articleId = articleId
    },
    // 切换频道
    changeChannel () {
      // （当前频道下无文章数据）主动加载一次数据
      if (!this.activeChannel.articles.length) {
        // 开启加载中效果
        this.activeChannel.upLoading = true
        // 清除之前没有数据的提示
        this.activeChannel.finished = false
        this.onLoad()
      } else {
        // 下一帧：延时一会执行，定位到以往阅读位置
        this.$nextTick(() => {
          const dom = this.$refs['scroll-wrapper'][this.activeIndex]
          dom.scrollTop = this.activeChannel.scrollTop
        })
      }
    },
    // 监听滚动事件
    remember (e) {
      this.activeChannel.scrollTop = e.target.scrollTop
    },
    // 获取频道列表
    async getChannelList () {
      try {
        let res = await channels()
        this.channelsList = [] // 清除tabs组件的排序（缓存）
        this.$nextTick(() => {
          this.channelsList = res.channels.map(item => {
            return {
              id: item.id,
              name: item.name,
              articles: [],
              upLoading: false, // true->上拉加载中
              downLoading: false, // 下拉刷新中
              finished: false, // 数据是否全部加载完
              timestamp: Date.now(),
              // 阅读位置
              scrollTop: 0
            }
          })
        })
      } catch (e) {
        this.$toast('网络开小差啦~')
      }
    },
    // 触底加载数据
    async onLoad () {
      /**
       * @load事件默认初始化组件时触发一次，获取第一次数据
       */
      // （频道数据没有加载完成）如果没有当前频道  严谨处理
      if (!this.activeChannel) return false
      let res = await getArticles(this.activeChannel.id, this.activeChannel.timestamp)
      this.activeChannel.articles.push(...res.results)
      this.activeChannel.upLoading = false
      if (!res.pre_timestamp) {
        // 已经没有更多数据了
        this.activeChannel.finished = true
      } else {
        // 把后端返回的时间戳 记录下来  下次请求需要使用
        this.activeChannel.timestamp = res.pre_timestamp
      }
    },
    // 下拉刷新
    async onRefresh () {
      // @refresh 当你下拉刷新 松开手指的时候触发
      this.activeChannel.timestamp = Date.now()
      const res = await getArticles(this.activeChannel.id, this.activeChannel.timestamp)
      // 结束下拉刷新效果
      this.activeChannel.downLoading = false
      // 判断是否有数据
      if (res.results.length) {
        this.activeChannel.articles = res.results
        // 加载有数据的文案
        this.downLoadText = '更新成功'
        // 防止看到 没有更多了 信息 （重新刷新列表，下一页应该是有数据的）
        this.activeChannel.finished = false
        // 加上时间戳 加载下一页数据
        this.activeChannel.timestamp = res.pre_timestamp
        // 防止数据不够一屏 再来一次上拉加载数据 onLoad
        this.onLoad()
      } else {
        // 加载没有数据的文案
        this.downLoadText = '暂无更新'
      }
    }
  }
}
</script>

<style scoped lang='less'>
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap{
     height: 40px;
     padding-right:20px;
  }
  /deep/ .van-tab--active{
    font-size: 15px;
    font-weight:700;
    color:#3296fa;
  }
  /deep/ .van-tabs__line{
    display: none;
  }
  /deep/ .van-tabs__content{
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane{
    height: 100%;
    .scroll-wrapper{
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
.article_item{
  h3{
    font-weight: normal;
    line-height: 2;
  }
  .img_box{
    display: flex;
    justify-content: space-between;
    .w33{
      width: 33%;
      height: 90px;
    }
    .w100{
      width: 100%;
      height: 180px;
    }
  }
  .info_box{
    height: 25px;
    display: flex;
    align-items: center;
    color: #999;
    font-size: 12px;
    .info{
      display: flex;
      align-items: center;
      flex: 90%;
      span{
        display: flex;
        align-items: center;
        text-align: center;
        margin: 0 7px;
      }
    }
    .handle{
      display: flex;
      align-items: center;
      justify-content:flex-end;
      flex:10%;
      span{
        &.close{
          line-height: 20px;
          height: 20px;
          width: 20px;
          text-align: center;
          padding-right: 0;
          font-size: 20px;
          right: 0;
          top: 7px;
        }
      }
    }

  }
}
</style>
