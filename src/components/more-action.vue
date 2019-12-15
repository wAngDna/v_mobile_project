<template>
  <van-popup :value="value" @input="$emit('input',$event)" @open="isReport=false">
    <van-cell-group v-if="!isReport">
      <van-cell icon="closed-eye" @click="disLikes()">不感兴趣</van-cell>
      <van-cell is-link @click="isReport=true">反馈垃圾内容</van-cell>
      <van-cell>拉黑作者</van-cell>
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReport=false">返回</van-cell>
      <van-cell icon="info-o" v-for="item in reports"
       :key="item.value"
       @click="reportTaps(item.value)" >
        {{item.label}}
      </van-cell>
    </van-cell-group>
  </van-popup>
</template>

<script>
import { disLike, report } from '@/api/articles'
import { reports } from '@/api/constants'
export default {
  name: 'more-action',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    // 当前文章ID
    articleId: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      isReport: false,
      reports
    }
  },
  methods: {
    // 文章不感兴趣
    async disLikes () {
      try {
        await disLike(this.articleId)
        // 提示
        this.$toast({ type: 'success', message: '操作成功' })
        // 关闭
        this.$emit('input', false)
        // 删除文章
        this.$emit('on-dislike')
      } catch (e) {
        this.$toast({ type: 'fail', message: '操作失败' })
      }
    },
    // 举报操作->有问题
    async reportTaps (type) {
      try {
        await report(this.articleId, type)
        // 提示
        this.$toast({ type: 'success', message: '举报成功' })
        // 关闭
        this.$emit('input', false)
        // 删除文章
        this.$emit('on-report')
      } catch (e) {
        if (e.response.status === 409) {
          return this.$toast({ message: '已举报过' })
        }
        this.$toast({ type: 'fail', message: '举报失败' })
      }
    }
  }
}
</script>

<style scoped lang='less'>
.van-popup {
  width: 80%;
  border-radius: 4px;
}
</style>
