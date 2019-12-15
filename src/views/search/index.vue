<template>
  <div class='container'>
    <van-nav-bar title="搜索中心" left-arrow @click-left="$router.back()" />
    <van-search placeholder="请输入搜索关键词"
    @search="onSearch"
    v-model="searchTxt" />
    <van-cell-group class="suggest" v-if="searchTxt">
      <van-cell icon="search" v-for="sug in suggestList" :key="sug">
        <p v-html="sug" @click="onSearch(sug.replace(`<span>${searchTxt}</span>`,searchTxt))"></p>
      </van-cell>
    </van-cell-group>
    <div class="history" v-else-if="historyList.length">
      <div class="hist_head">
        <h4>历史搜索</h4>
        <van-icon @click="clearHistory" class="del_icon"  name="delete" />
      </div>
      <div class="hist_list" >
        <ul>
          <li  v-for="(item,index) in historyList" :key="index" @click.stop="toSearch(item)" >
            {{item}}
            <van-icon @click.stop="delHistory(index)" class="close_btn" slot="right-icon" name="cross"/>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { getHostory, suggest } from '@/api/articles'
const KEY = 'gg-toutiao-10-history-key'
export default {
  name: 'search-index',
  data () {
    return {
      searchTxt: '', // 搜索关键字
      historyList: JSON.parse(window.localStorage.getItem(KEY) || '[]'),
      suggestList: [],
      // 计时器
      timer: null
    }
  },
  watch: {
    searchTxt () {
      window.clearTimeout(this.timer)
      this.timer = window.setTimeout(async () => {
        if (!this.searchTxt) {
          this.suggestList = []
          return
        }
        const data = await suggest(this.searchTxt)
        this.suggestList = data.options.map(item => item.toLowerCase().replace(this.searchTxt, `<span>${this.searchTxt}</span>`))
      }, 200)
    }
  },
  created () {
  },
  methods: {
    async getHostory () {
      let res = await getHostory()
      console.log(res)
    },
    // 根据历史记录搜索
    toSearch (key) {
      this.$router.push({ path: '/search/result', query: { q: key } })
    },
    // 发起搜索请求
    onSearch (key) {
      if (!key.trim()) return false
      // 存储搜索历史 (key不能存重复的)  集合
      const keySet = new Set(this.historyList)
      keySet.add(key)
      this.historyList = Array.from(keySet) // 或者 [...keySet]
      // 存储在本地  需要的是数组格式
      window.localStorage.setItem(KEY, JSON.stringify(this.historyList))
      // 跳转搜索结果
      this.$router.push({ path: '/search/result', query: { q: key } })
    },
    // 删除
    delHistory (index) {
      this.$dialog.confirm({
        title: '提示',
        message: '确认删除本条历记录吗?'
      }).then(() => {
        this.historyList.splice(index, 1)
        window.localStorage.setItem(KEY, JSON.stringify(this.historyList))
      })
    },
    // 清空
    clearHistory () {
      this.$dialog.confirm({
        title: '提示',
        message: '是否清空历史搜索记录?'
      }).then(() => {
        this.historyList = []
        window.localStorage.removeItem(KEY)
      })
    }
  }
}
</script>

<style scoped lang='less'>
.van-search /deep/ .van-search__content{
  border-radius: 10px;
  overflow: hidden;
}
.history{
  padding:5px 20px;
  .hist_head{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 25px;
    .del_icon{
      font-size: 17px;
      color: #999;
    }
  }
  .hist_list{
    ul{
      display: flex;
      align-content: space-between;
      flex-wrap: wrap;
      li{
        position: relative;
        margin: 5px;
        padding:4px 7px;
        border-radius: 3px;
        font-size: 12px;
        color: #666;
        background: #f1f1f1;
        position: relative;
        .van-icon{
          position: absolute;
          right: -7px;
          top: -7px;
          margin-left: 5px;
          background: rgba(255, 255, 255, .5);
        }
      }
    }
  }
}
.suggest{
  /deep/ .van-cell{
    padding: 10px 20px;
    color: #999;
    p{
      span{
        color: #999;
      }
    }
  }
}
</style>
