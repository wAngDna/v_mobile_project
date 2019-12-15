<template>
  <div class='commList' @scroll="remember($event)" ref="container">
    <van-list v-model="loading"
     :immediate-check="false"
     @load="loadComments()"
     :finished="finished" finished-text="没有更多了">
      <div class="comm_item" v-for="item in comments" :key="item.id">
        <div class="img">
           <van-image round width="1rem" height="1rem" fit="fill"  :src="item.aut_photo" />
           <span class="name">{{item.aut_name}}</span>
        </div>
        <div class="info">
          <p class="inner">{{item.content}}</p>
          <p>
            <span class="time">{{item.pubdate|relTime}}</span>&nbsp;
            <van-tag  @click="openReplyDailog(item.com_id.toString())" plain>{{item.reply_count}} 回复</van-tag>
          </p>
        </div>
      </div>
    </van-list>
    <!-- 回复 -->
    <van-action-sheet v-model="showReply" class="reply_dailog" title="回复评论">
        <van-list v-model="reply.loading" :finished="reply.finished" finished-text="没有更多了">
            <div class="item van-hairline--bottom van-hairline--top" v-for="item in reply.list" :key="item.com_id.toString()">
                <van-image round width="1rem" height="1rem" fit="fill" :src="item.aut_photo"/>
                <div class="info">
                    <p><span class="name">{{item.aut_name}}</span></p>
                    <p>{{item.content}}</p>
                    <p><span class="time">{{item.pubdate|relTime}}</span></p>
                </div>
            </div>
        </van-list>
    </van-action-sheet>
    <!-- 底部输入框 -->
    <div class="commComponent">
      <div class="comm_ipt">
        <van-field v-model="replyText" placeholder="文明发言..." />
      </div>
      <div class="comm_btn" @click="send()">
        <van-icon name="upgrade" />
      </div>
    </div>
  </div>
</template>

<script>
import { getCommOrReplys, commOrReply } from '@/api/articles'
export default {
  name: 'comm-list',
  data () {
    return {
      replyText: '', // 输入框
      loading: false,
      finished: false,
      comments: [], // 评论列表
      // 显示回复对话框
      showReply: false,
      // 回复相关数据
      reply: {
        loading: false,
        finished: false
      },
      commentId: null // 评论id
    }
  },
  activated () {
    this.comments = []
    this.upLoading = true
    this.finished = false
    this.loadComments()
  },
  created () {
  },
  methods: {
    // 评论或回复
    async send () {
      try {
        if (!this.replyText) return false
        if (this.commentId) {
          // 提交回复
          const data = await commOrReply(this.commentId, this.replyText, this.$route.params.id)
          // 成功
          this.$toast.success('回复成功')
          this.reply.list.unshift(data.new_obj)// new_obj为刚评论的信息
          // 需要给当前的评论总回复数据加1
          const currCom = this.comments.find(item => item.com_id.toString() === this.commentId)
          currCom.reply_count++
        } else {
          // 提交评论
          const data = await commOrReply(this.$route.params.id, this.replyText)
          // 成功
          this.$toast.success('评论成功')
          this.comments.unshift(data.new_obj)
        }
        this.replyText = ''
      } catch (e) {
        this.$toast.fail('操作失败')
      }
    },
    // 打开回复
    openReplyDailog (comId) {
      this.showReply = true
      this.commentId = comId
      // 重置一些数据
      this.reply.list = []
      this.reply.finished = false
      this.reply.loading = true
      // 加载回复
      this.loadReplys()
    },
    // 获取评论回复
    async loadReplys () {
      const data = await getCommOrReplys({
        type: 'c',
        source: this.commentId,
        offset: this.reply.offset
      })
      this.reply.list.push(...data.results)
      // 上拉加载逻辑
      this.reply.loading = false
      if (data.last_id > data.end_id) {
        this.reply.offset = data.last_id
      } else {
        this.reply.finished = true
      }
    },
    // 获取评论列表
    async loadComments (comId) {
      // 调用API获取评论列表数据
      const data = await getCommOrReplys({
        type: 'a',
        source: this.$route.params.id,
        offset: this.offset
      })
      // 回复总数一直为0
      //   console.log(data)
      // 追加数据
      this.comments.push(...data.results)
      // 结束加载
      this.loading = false
      if (data.last_id > data.end_id) {
        this.offset = data.last_id
      } else {
        this.finished = true
      }
    }
  }
}
</script>

<style scoped lang='less'>
.commList {
  overflow-y: auto;
  border-top: 1px solid #eee;
  padding: 10px 5px;
}
.commComponent{
  z-index: 9999;
  border-top: 1px solid #eee;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  display: flex;
  align-items: center;
  .comm_ipt{
    flex: 1
  }
  .comm_btn{
    height: 100%;
    width: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 25px;
    background: #fff;
    color: #666;
  }
}
.van-popup--bottom{
  &.van-popup--round{
    border-radius: 0;
  }
}
.reply_dailog {
  height: 100%;
  max-height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
  .van-action-sheet__content{
    flex: 1;
    overflow-y: auto;
    padding: 0 10px 44px;
  }
}
.comm_item{
    width: 100%;
    margin: 5px 0;
   .img{
      display: flex;
      align-items: center;
      .name{
          margin-left: 10px;
      }
   }
   .info{
     width: 100%;
     .inner{
         padding-left: 10px;
         margin: 7px 0;
         font-size: 15px;
     }
     .time{
         padding-left: 6px;
         font-size: 13px;
         color: #666;
     }
   }
}
</style>
