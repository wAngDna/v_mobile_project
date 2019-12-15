<template>
  <div class='container' @scroll="remember($event)" ref="container">
    <van-nav-bar fixed :title="article.title" left-arrow @click-left="$router.back()" />
    <!-- 文章详情 -->
    <div class="detail" v-if="article">
      <div class="author">
        <van-image round width="1rem" height="1rem" fit="fill" :src="article.aut_photo" />
        <div class="text">
          <p class="name">{{article.aut_name}}</p>
          <p class="time">{{article.pubdate|relTime}}</p>
        </div>
        <van-button @click="followed" round size="small" type="info">
           {{article.is_followed?'已关注':'+ 关注'}}
        </van-button>
      </div>
      <div class="content" v-html="article.content"></div>
      <div class="zan">
        <van-button round size="small" @click="toggleAttitude(1)" :class="{active:article.attitude===1}" plain icon="like-o">点赞</van-button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <van-button round size="small" @click="toggleAttitude(0)" :class="{active:article.attitude===0}" plain icon="delete">不喜欢</van-button>
      </div>
    </div>
    <!-- 评论组件 -->
    <comm-list></comm-list>

  </div>
</template>

<script>
import { getArticleDetail, disLikes, unDisLikes, likings, unLikings } from '@/api/articles'
import { followed, unFollowed } from '@/api/user'
import commList from './components/comm-list'
export default {
  name: 'article-item',
  components: {
    commList
  },
  data () {
    return {
      // 文章详情
      article: {
        art_id: ''
      },
      // 阅读位置
      scrollTop: 0

    }
  },
  activated () {
    // 当前文章ID：this.$route.params.id  (类型：字符串)
    // 之前文章ID：this.article.art_id.toString()  (art_id 有值)
    if (this.$route.params.id !== this.article.art_id.toString()) {
      // 重置阅读位置
      this.scrollTop = 0
      // 获取文章数据
      this.getArticle()
    } else {
      // 跳转阅读位置
      this.$refs['container'].scrollTop = this.scrollTop
    }
  },
  created () {
  },
  methods: {
    // 记录阅读位置
    remember (e) {
      this.scrollTop = e.target.scrollTop
    },
    // 获取文章详情
    async getArticle () {
      try {
        this.article = {
          art_id: ''
        }
        const data = await getArticleDetail(this.$route.params.id)
        this.article = data
      } catch (e) {
        if (e.response.status === 404) {
          this.$toast.fail('文章获取失败')
        }
      }
    },
    // 关注/取关
    async followed () {
      try {
        if (this.article.is_followed) {
          // 取关
          await unFollowed(this.article.aut_id)
          this.$toast.success('取消关注')
          this.article.is_followed = false
        } else {
          // 进行关注
          await followed(this.article.aut_id)
          this.$toast.success('关注成功')
          this.article.is_followed = true
        }
      } catch (e) {
        if (e.response.status !== 401) {
          this.$toast.fail('操作失败')
        }
      }
    },
    // 点赞 取消点赞  不喜欢  取消不喜欢
    async toggleAttitude (btnType) {
      try {
        if (btnType === 1) {
          if (this.article.attitude === 1) {
          // 取消点赞
            await unLikings(this.article.art_id)
            this.article.attitude = -1
          } else {
          // 点赞
            await likings(this.article.art_id)
            this.article.attitude = 1
          }
        } else {
          if (this.article.attitude === 0) {
          // 取消不喜欢
            await unDisLikes(this.article.art_id)
            this.article.attitude = -1
          } else {
          // 不喜欢
            await disLikes(this.article.art_id)
            this.article.attitude = 0
          }
        }
        // 统一提示
        this.$toast.success('操作成功')
      } catch (e) {
        if (e.response.status !== 401) {
          this.$toast.fail('操作失败')
        }
      }
    }
  }
}
</script>

<style scoped lang='less'>
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  padding: 46px 10px 44px;
}
.detail {
  .title {
    font-size: 18px;
    line-height: 2;
  }
  .zan{
    text-align: center;
    padding: 10px 0;
    .active{
      border-color:red;
      color: red;
    }
  }
  .author {
    padding: 10px 0;
    display: flex;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.5;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  // 内容中包含：img 特别宽  code pre 不能换行
  .content {
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img{
      max-width:100%;
      background: #f9f9f9;
    }
    /deep/ code{
      white-space: pre-wrap;
    }
    /deep/ pre{
      white-space: pre-wrap;
    }
  }
}

</style>
