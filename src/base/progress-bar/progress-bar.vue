<template>
  <div class="progress-bar"
       ref="progressBar"
       @click="progressClick"
  >
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper"
           ref="progressBtn"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { prefixStyle } from "common/js/dom";

  const progressBtnWidth = 16
  const transform = prefixStyle('transform')
  export default {
    data() {
      return {
        barWidth: 0
      }
    },
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created() {
      this.touch = {}
    },
    methods: {
      progressClick(e) {
        /*const rect = this.$refs.progressBar.getBoundingClientRect()
        const offsetWidth = e.pageX - rect.left*/
        console.log(e)
        let offsetWidth = e.offsetX
        this._offset(offsetWidth)
        this._triggerPercent()
      },
      progressTouchStart(e) {
        /*初始化*/
        this.touch.initiated = true
        /*记录点击后btn的y坐标值*/
        this.touch.startX = e.touches[0].clientX
        /*点击后当前进度条的宽度*/
        this.touch.width = this.$refs.progress.clientWidth
        console.log(this.touch.width)
      },
      progressTouchMove(e){
        if (!this.touch.initiated) {
          return
        }
        const deltaX = e.touches[0].clientX - this.touch.startX
        console.log(deltaX)
        /*move时的边界处理，并返回相关数据*/
        const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.width + deltaX))
        /*设置进度条宽度和btn偏移*/
        this._offset(offsetWidth)
      },
      progressTouchEnd() {
        this.touch.initiated = false
        this._triggerPercent()
      },
      /*给父组件派发percentChange事件，改变当前音乐的播放时间进度*/
      _triggerPercent() {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const percent = this.$refs.progress.clientWidth / barWidth
        this.$emit('percentChange', percent)
      },
      /*_barWidth() {
        this.barWidth =
      },*/
      _offset(offsetWidth) {
        this.$refs.progress.style.width = `${offsetWidth}px`
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      }
    },
    watch: {
      percent(newPercent){
        if (newPercent >= 0 && !this.touch.initiated) {
          const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
          const offsetWidth = newPercent * barWidth
          this._offset(offsetWidth)
        }
      },
    }
  }
</script>

<style lang="stylus" type="text/stylus" scoped>
  @import "~common/stylus/variable"
  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      height: 4px
      background-color: rgba(0, 0 ,0, .3)
      top: 13px
      .progress
        position: absolute
        height: 100%
        background-color: $color-theme
      .progress-btn-wrapper
        position: absolute
        width: 30px
        height: 30px
        top: -13px
        left: -7px
        .progress-btn
          position: relative
          width: 16px
          height: 16px
          box-sizing: border-box
          border: 3px solid $color-text
          border-radius: 50%
          background-color: $color-theme
          top: 7px
          left: 7px

</style>
