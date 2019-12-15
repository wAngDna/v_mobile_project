<template>
    <van-action-sheet
     :value="value" @closed="editing=false"
     @input="$emit('input', $event)" title="编辑频道">
        <div class="channel">
            <div class="tit">
                我的频道：
                <span class="tip">点击可进入频道</span>
                <van-button v-if="!editing" @click="editing=true"
                size="mini" type="info" plain>编辑</van-button>
                <van-button v-else @click="editing=false"
                size="mini" type="danger"  plain>完成</van-button>
            </div>
            <van-grid class="van-hairline--left">
                <van-grid-item v-for="(item,index) in channelsList" :key="item.id">
                <span class="f12" @click="clkChannel(index)">{{item.name}}</span>
                <van-icon v-show="editing" class="btn"
                @click="delChannel(index,item.id)"
                 name="cross"></van-icon>
                </van-grid-item>
            </van-grid>
        </div>
        <div class="channel">
            <div class="tit">可选频道：</div>
            <van-grid class="van-hairline--left">
                <van-grid-item v-for="items in optionAllChannels" :key="items.id">
                <span class="f12">{{items.name}}</span>
                <van-icon class="btn" name="plus" @click="addChannel(items)"></van-icon>
                </van-grid-item>
            </van-grid>
        </div>
    </van-action-sheet>
</template>

<script>
import { allChannels, delChannel, addChannel } from '@/api/channels'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    channelsList: {
      type: Array,
      default: () => []
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      editing: false,
      allChannle: ''
    }
  },
  created () {
    this.getAllChannle()
  },
  computed: {
    optionAllChannels () {
      return this.allChannle.filter(item => this.channelsList.findIndex(myItem => myItem.id === item.id) === -1)
    }

  },
  methods: {
    // 添加频道
    async addChannel ({ id, name }) {
      try {
        let orderChannels = this.channelsList.map((item, i) => {
          return {
            id: item.id,
            name: item.name,
            seq: i
          }
        })
        orderChannels.push({ id, name, seq: orderChannels.length })
        orderChannels.shift()
        await addChannel(orderChannels)
        this.$toast.success('添加成功')
        // 组件中的 列表追加一项  组件渲染
        this.channelsList.push({
          id,
          name,
          articles: [],
          upLoading: false,
          downLoading: false,
          finished: false,
          timestamp: Date.now(),
          // 阅读位置
          scrollTop: 0
        })
      } catch (e) {
        this.$toast.fail('添加失败')
      }
    },
    // 删除频道
    async delChannel (index, id) {
      try {
        await delChannel(id)
        // 2. 提示
        this.$toast.success('删除成功')
        if (index <= this.activeIndex) {
          this.$emit('update', this.activeIndex - 1)
        }
        this.channelsList.splice(index, 1)
      } catch (e) {
        this.$toast.fail('删除失败')
      }
    },
    // 点击进入频道
    clkChannel (index) {
      this.$emit('input', false)
      this.$emit('updateChannel', index)
    },
    async getAllChannle () {
      let res = await allChannels()
      this.allChannle = res.channels
    }
  }
}
</script>
<style lang='less' scoped>
.van-popup--bottom{
  &.van-popup--round{
    border-radius: 0;
  }
}
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
.channel {
  padding: 10px;
  .tit{
    line-height: 3;
    .tip {
      font-size: 10px;
      color: #999;
    }
  }
  .van-button {
    float: right;
    margin-top: 7px;
  }
  .btn{
    position: absolute;
    bottom: 0;
    right: 0;
    background: #ddd;
    font-size: 12px;
    color: #fff;
  }
  .f12{
      font-size:12px;
      color: #555;
  }
  .red{
    color: red;
  }
}
</style>
