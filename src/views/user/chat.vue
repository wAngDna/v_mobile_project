<template>
  <div class='container'>
      <van-nav-bar fixed left-arrow @click-left="$router.back()" title="零零器号客服"></van-nav-bar>
      <div class="chat-list" ref="chatList">
        <div class="chat-item"
        :class="{left:item.name==='xz',right:item.name==='self'}"
        v-for="(item,i) in chatList"
        :key="i"
        >
          <van-image v-if="item.name==='007'" fit="cover" round :src="chatAiImg" />
          <div class="chat-pao">{{item.msg}}</div>
          <van-image v-if="item.name==='self'" fit="cover" round :src="photo" />
        </div>
      </div>
      <div class="reply-container van-hairline--top">
        <van-field v-model="sendText" placeholder="说出你的愿望少年...">
          <van-loading v-if="commentLoading" slot="button" type="spinner" size="16px"></van-loading>
          <span v-else @click="send()" slot="button" style="font-size:12px;color:#999">提交</span>
        </van-field>
      </div>
  </div>
</template>

<script>
import chatAiImg from '../../assets/chatAI.jpg'
import io from 'socket.io-client'
import { mapState } from 'vuex'
export default {
  name: 'user-chat',
  data () {
    return {
      sendText: '',
      loading: false,
      commentLoading: false,
      chatAiImg,
      chatList: [],
      socketIo: null
    }
  },
  computed: {
    ...mapState(['photo', 'user'])
  },
  created () {
    this.socketIo = io('http://ttapi.research.itcast.cn', {
      query: {
        token: this.user.token
      }
    })
    // 发送消息
    this.socketIo.on('connect', () => {
      console.log('连接建立成功')
      this.chatList.push({ name: '007', msg: '少年,说出你的梦想吧。' })
    })
    // 接收信息
    this.socketIo.on('message', (data) => {
      this.chatList.push({ name: '007', msg: data.msg })
      this.scrollBot()
    })
  },
  beforeDestroy () {
    this.socketIo.close()
  },
  methods: {
    send () {
      if (!this.sendText.trim()) return false
      this.socketIo.emit('message', {
        msg: this.sendText,
        timestamp: Date.now()
      })
      this.scrollBot()
      this.chatList.push({ name: 'self', msg: this.sendText })
      this.sendText = ''
    },
    // 滚动到屏幕最下方
    scrollBot () {
      this.$nextTick(() => {
        this.$refs.chatList.scrollTop = this.$refs.chatList.scrollHeight// 可滚动高度
      })
    }
  }
}
</script>

<style scoped lang='less'>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background:#fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item{
      padding: 10px;
      .van-image{
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao{
        margin: 0 10px;
        vertical-align: top;
        display: inline-block;
        max-width: 60%;

        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        text-align: left
      }
    }
  }
}
.chat-item.right{
  text-align: right;
  .chat-pao{
    margin-left: 0;
    margin-right: 15px;
    &::before{
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left{
  text-align: left;
  .chat-pao{
    margin-left: 15px;
    margin-right: 0;
    &::before{
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
