<template>
  <Scroll class="listview"
          ref="listview"
          @scroll="scroll"
          :listenScroll="listenScroll"
          :probeType="probeType"
  >
    <ul>
      <li class="list-group"
          v-for="group in data"
          :key="group.title"
          :data-title="group.title"
          ref="listGroup"
      >
        <h3 class="list-group-title">{{group.title}}</h3>
        <ul class="list-group-content">
          <li class="list-group-item"
              v-for="item in group.items"
              :key="item.name"
              @click="selectItem(item)"
          >
            <img v-lazy="item.avatar" alt="" class="avatar">
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut"
         @touchstart="onShortcutTouchStart"
         @touchmove.stop.prevent="onShortcutTouchMove"
    >
      <ul>
        <li class="item"
            :data-index="index"
            :class="{'current': currentIndex===index}"
            v-for="(item, index) in shortcutList"
            :key="index"
        >
          {{ item }}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h3 class="fixed-title">{{fixedTitle}}</h3>
    </div>
    <div class="loading-container" v-show="!data.length">
      <Loading></Loading>
    </div>
  </Scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import { getData } from "common/js/dom";

  const ANCHOR_HEIGHT = 18
  const TITLE_HEIGHT = 30

  export default {
    name: "",
    props: {
      data: Array
    },
    data(){
      return{
        /*初始化better-scroll的滚动高度*/
        scrollY: -1,
        /*高亮的索引（同步用）*/
        currentIndex: 0,
        diff: -1
      }
    },
    created() {
      this.touch = {}
      /*是否添加滚动监听*/
      this.listenScroll = true
      /*实时监听x轴y轴值得变化*/
      this.probeType = 3
      /*实现左右联动，保存每个元素之间的高度*/
      this.listHeight = []
    },
    methods: {
      selectItem(item){
        this.$emit('select', item)
      },
      onShortcutTouchStart (e) {
        /*点击索引列表需要记录的数据*/
        let anchorIndex = getData(e.target, 'index')
        let fristTouch = e.touches[0]
        this.touch.y1 = fristTouch.pageY
        this.touch.anchorIndex = anchorIndex
        this._scrollTo(anchorIndex)
      },

      onShortcutTouchMove (e) {
        /*在索引列表滑动需要进的操作*/
        let fristTouch = e.touches[0]
        this.touch.y2 = fristTouch.pageY
        let delta = Math.floor((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT)
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta
        this._scrollTo(anchorIndex)
      },
      refresh() {
        this.$refs.listview.refresh()
      },
      /*滚动时记录并更新this.scrollY的值*/
      scroll(pos){
        this.scrollY = pos.y
      },
      /*计算高度*/
      _calculateHeight() {
        this.listHeight = []
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for (let i = 0;i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      },
      _scrollTo(index){
        /*点击-边界上限bug处理*/
        if (!index && index !==0) {
          return
        }
        /*滑动，边界上限bug处理*/
        if (index < 0) {
          index = 0
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2
        }
        /*手动改变并更新this.scrollY的值，设置高亮*/
        this.scrollY = -this.listHeight[index]
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      }
    },
    computed: {
      shortcutList() {
        /*map通过一些操作返回一个新的数组集合，参数是数组中的每一个元素（遍历）*/
        return this.data.map((group) => {
          /*返回的是一个新的数组元素*/
          return group.title.substr(0,1)
        })
      },
      fixedTitle(){
        if (this.scrollY > 0){
          return
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    watch: {
      data() {
        /*当数据方式变化时重新计算元素的高度*/
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      scrollY(newY){
        /*newY：scrollY的值*/
        const listHeight = this.listHeight
        /*顶部边界上限处理*/
        if (newY > 0) {
          this.currentIndex = 0
          return
        }
        for (let i =0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if (-newY >= height1 && -newY < height2){
            this.currentIndex = i
            this.diff = height2 + newY
            return
          }
        }
        /*底部边界上限处理*/
        this.currentIndex = listHeight.length - 2
      },
      diff(newVal){
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
    },
    components: {
      Scroll,
      Loading
    }
  }
</script>

<style lang="stylus" type="text/stylus" scoped>
  @import "~common/stylus/variable"

  .listview
    position: relative
    height: 100%
    background-color: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        color: $color-text-l
        font-size: $font-size-small
        text-indent: 20px
        background-color: $color-highlight-background
      .list-group-content
        /*margin: 20px 0 20px 30px*/
        .list-group-item
          display: flex
          align-items: center
          padding: 20px 0 0 30px
          .avatar
            width: 50px
            height: 50px
            border-radius: 50%
            margin-right: 20px
          .name
            color: $color-text-l
            font-size: $font-size-medium
    .list-shortcut
      position: fixed
      width: 20px
      font-family: Helvetica
      padding: 20px 0
      text-align: center
      border-radius: 10px
      background-color: $color-background-d;
      right: 0
      top: 50%
      transform: translateY(-50%)
      z-index: 30
      .item
        line-height: 18px
        font-size: $font-size-small
        color: $color-text-l
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      width: 100%
      top: 0
      left: 0
      .fixed-title
        height: 30px
        line-height: 30px
        font-size: $font-size-small
        color: $color-text-l
        padding-left: 20px
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
