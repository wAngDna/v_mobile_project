<template>
  <div class='container'>
    <van-nav-bar title="搜索结果" left-arrow @click-left="$router.back()" />
    <!-- 文章列表 -->
    <!-- 文章列表 -->
    <van-list @load="onLoad" v-model="loading" :finished="finished" finished-text="没有更多了">
      <van-cell-group>
        <van-cell :to="{name:'article',params:{id:item.art_id.toString()}}" v-for="item in articles" :key="item.art_id.toString()">
          <div class="article_item">
            <h3 class="van-ellipsis">{{item.title}}</h3>
            <div class="img_box" v-if="item.cover.type===3">
              <van-image class="w33" fit="cover" :src="item.cover.images[0]" />
              <van-image class="w33" fit="cover" :src="item.cover.images[1]" />
              <van-image class="w33" fit="cover" :src="item.cover.images[2]" />
            </div>
            <div class="img_box" v-if="item.cover.type===1">
              <van-image class="w100" fit="cover" :src="item.cover.images[0]" />
            </div>
            <div class="info_box">
              <div class="info">
                <span>
                  作者 /
                  {{item.aut_name}}
                </span>
                <span>
                  评论数:
                  {{item.comm_count}}
                </span>
                <span>
                  {{item.pubdate | relTime}}
                </span>
              </div>
              <div class="handle">
                <!-- <span
                  v-if="user.token"
                  class="close"
                  @click.stop="openMoreAction(item.art_id.toString())">
                  <van-icon name="ellipsis"></van-icon>
                </span> -->
              </div>
            </div>
          </div>
        </van-cell>
      </van-cell-group>
    </van-list>
  </div>
</template>

<script>
import { searchArticles } from '@/api/articles'
import { mapState } from 'vuex'
export default {
  name: 'search-result',
  data () {
    return {
      loading: false,
      finished: false,
      // 查询条件
      reqParams: {
        page: 1,
        q: this.$route.query.q
      },
      // 文章列表
      articles: []
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created () {

  },
  methods: {
    async onLoad () {
      // 加载数据
      const data = await searchArticles(this.reqParams)
      this.articles.push(...data.results)
      // 结束加载中效果
      this.loading = false
      // 加载下一页 page自增
      if (data.results.length) {
        this.reqParams.page++
      } else {
        this.finished = true
      }
    }
  }
}
</script>

<style scoped lang='less'>
.container {
  padding-top: 45px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.van-nav-bar{
  width: 100%;
  position: fixed;
  top: 0;
}
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      height: 180px;
      width: 100%;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    span {
      padding-right: 10px;
    }
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

</style>
