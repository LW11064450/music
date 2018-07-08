<template>
  <div ref="wrap">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  export default {
    name: "",
    props: {
      probeType:{
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      data: {
        type: Array,
        default: null
      },
      /*是否监听滚动事件*/
      listenScroll: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      _initScroll () {
        if (!this.$refs.wrap) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrap, {
          probeType: this.probeType,
          click: this.click
        })
        if (this.listenScroll){
          let me = this
          this.scroll.on('scroll', (pos) => {
            me.$emit('scroll', pos)
          })
        }
      },
      enable () {
        this.scroll && this.scroll.enable()
      },
      disable () {
        this.scroll && this.scroll.disable()
      },
      refresh () {
        this.scroll && this.scroll.refresh()
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll,arguments)
      },
      scrollToElement(){
                                                          /*同步到新的实例上*/
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },
    mounted () {
      setTimeout(() => {
        this._initScroll()
      },20)
    },
    watch: {
      data () {
        setTimeout(() => {
          this.refresh()
        },20)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>

</style>
