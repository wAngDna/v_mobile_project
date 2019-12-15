<template>
  <div class='container'>
    <!-- <van-nav-bar fixed title="个人中心" right-text="搜索" @click-right="$router.push('/search')" /> -->
    <div class="user_box">
      <img src="./bj3.jpg" alt="">
      <div class="user_info">
        <div class="img">
          <van-image class="info_img" :src="userInfo.photo" />
        </div>
        <div class="info">
          <h3 class="name">
           {{userInfo.name}}
            <van-tag size="mini">申请认证</van-tag>
          </h3>
          <van-row class="info_num">
            <van-col span="6">
              <p>{{userInfo.art_count}}</p>
              <p>动态</p>
            </van-col>
            <van-col span="6">
              <p>{{userInfo.follow_count}}</p>
              <p>关注</p>
            </van-col>
            <van-col span="6">
              <p>{{userInfo.fans_count}}</p>
              <p>粉丝</p>
            </van-col>
            <van-col span="6">
              <p>{{userInfo.like_count}}</p>
              <p>获赞</p>
            </van-col>
          </van-row>
        </div>
      </div>
      <div class="icon_box">
        <van-row class="user-links">
          <van-col span="8">
            <van-icon name="newspaper-o" color="#7af"/>我的作品
          </van-col>
          <van-col span="8">
            <van-icon name="star-o" color="#f00"/>我的收藏
          </van-col>
          <van-col span="8">
            <van-icon name="tosend" color="#fa0"/>阅读历史
          </van-col>
        </van-row>
      </div>
      <van-cell-group class="user-group">
        <van-cell icon="edit" title="编辑资料" to="/user/profile" is-link />
        <van-cell icon="chat-o" title="小智同学" to="/user/chat" is-link />
        <van-cell icon="setting-o" title="系统设置" is-link />
        <van-cell @click="logout" icon="warning-o" title="退出登录" is-link />
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import { getUserInfo } from '@/api/user'
import { mapMutations } from 'vuex'
export default {
  name: 'user-index',
  data () {
    return {
      userInfo: ''
    }
  },
  created () {
    this.getUserInfo()
  },
  methods: {
    ...mapMutations(['delUser', 'setPhoto']),
    logout () {
      // 弹出确认框 dialog 组件 和toast组件使用相似
      this.$dialog.confirm({
        title: '温馨提示',
        message: '确认退出吗？'
      }).then(() => {
        // 退出：删除vuex和本地的用户信息
        this.delUser()
        this.$router.push('/login')
      }).catch(() => {
        // click cancel
      })
    },
    async getUserInfo () {
      let res = await getUserInfo()
      this.userInfo = res
      this.setPhoto(res.photo)
    }
  }
}
</script>

<style scoped lang='less'>
.container{
  width: 100%;
  height: 100%;
}
.user_box{
  position: fixed;
  top: 0;
  width: 100%;
  height: 220px;
  z-index: 1;
  img{
    width: 100%;
    height: 100%;
    filter: blur(1px)
  }
  .user_info{
    position: absolute;
    top:50%;
    left: 50%;
    transform: translate(-50%,-75%);
    width: 80%;
    height: 80px;
    overflow: hidden;
    display: flex;
    align-items: center;
    .info_img{
      width: 80px;
      height: 80px;
      border-radius: 50%;

      overflow: hidden;
    }
    .info{
      flex:1;
      height: 100%;
      margin-left: -10px;
      .name{
        margin-left: 25px;
        height: 30px;
        line-height: 30px;
        color: #fff;
        font-weight: bold;
        margin-top: 5px;
      }
      .info_num{
        width: 100%;
        color: #fff;
        text-align: center;
      }
    }
  }
}
.icon_box{
  position: absolute;
  left: 50%;
  bottom: -20px;
  transform: translateX(-50%);
  width: 100%;
  height: 70px;
  background: #fff;
  border-radius: 5px;
  z-index: 9;
  overflow: hidden;
  border-radius:15% 15% 0 0;
}
.user-links {
    padding:15px 0 0 0;
    font-size: 12px;
    text-align: center;
    background-color: #fff;
    .van-icon {
      display: block;
      font-size: 24px;
      padding-bottom: 5px;
    }
}
.user-group{
  margin-top: 25px;
}
</style>
