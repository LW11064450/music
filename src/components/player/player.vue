<template>
  <div class="player" v-show="listlength">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.image" alt="" width="100%" height="100%">
        </div>
        <div class="top">
          <i class="icon-back" @click="back"></i>
          <h3 class="title">{{ currentSong.name }}</h3>
          <h3 class="subtitle">{{ currentSong.singer}}</h3>
        </div>
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd"
                   :class="cdRotate">
                <img :src="currentSong.image" alt="" class="image">
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="operators">
            <span class="icon icon-sequence"></span>
            <span class="icon icon-prev"></span>
            <span :class="playIcon"
                  @click="togglePlay"
            ></span >
            <span class="icon icon-next"></span>
            <span class="icon icon-not-favorite"></span>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img :class="cdRotate" :src="currentSong.image" alt="" width="40" height="40">
        </div>
        <div class="text">
          <h3 class="name">{{ currentSong.name }}</h3>
          <p class="desc">{{ currentSong.singer }}</p>
        </div>
        <div class="control"
             @click.stop="togglePlay"
        >
          <i :class="miniIcon"></i>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio :src="currentSong.url"
           ref="audio"
    ></audio>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapGetters } from 'vuex'
  import { mapMutations } from 'vuex'
  import { prefixStyle } from "common/js/dom";
  import animations from 'create-keyframe-animation'

  const transform = prefixStyle('transform')
  export default {
    mounted() {
      console.log(this.currentSong)
    },
    methods: {
      togglePlay() {
        this.setPlayingState(!this.playing)
      },
      back() {
        this.setFullScreen(false)
      },
      open() {
        this.setFullScreen(true)
      },
      enter(el, done){
        const {x, y, scale} = this._getPosAndScale()

        let animation = {
          0: {
            transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0,0,0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0,0,0) scale(1)`
          }
        }

        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        })

        animations.runAnimation(this.$refs.cdWrapper, 'move', done)
      },
      afterEnter(){
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.animation = ''
      },
      leave(el, done) {
        this.$refs.cdWrapper.style.transition = 'all .4s'
        const {x, y, scale} = this._getPosAndScale()
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        this.$refs.cdWrapper.addEventListener('transitionend', done)
      },
      afterLeave() {
        this.$refs.cdWrapper.style.transition = ''
        this.$refs.cdWrapper.style[transform] = ''
      },
      /*动画计算中心点*/
      _getPosAndScale() {
        const targetWidth = 40
        const paddingLeft = 40
        const paddingBottom = 30
        const paddingTop = 80
        const width = window.innerWidth * 0.8
        const scale = targetWidth / width
        const x = -(window.innerWidth / 2 - paddingLeft)
        const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
        return {
          x,
          y,
          scale
        }
      },
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlayingState: 'SET_PLAYING_STATE'
      })
    },
    computed: {
      playIcon() {
        return this.playing ? 'icon icon-pause' : 'icon icon-play'
      },
      miniIcon(){
        return this.playing ? 'icon-pause-mini' :  'icon-play-mini'
      },
      cdRotate() {
        return this.playing ? 'play' : 'play pause'
      },
      listlength(){
        return this.playlist.length
      },
      ...mapGetters([
        'fullScreen',
        'playlist',
        'currentSong',
        'playing'
      ]),
    },
    watch: {
      currentSong () {
        this.$nextTick(() => {
          this.$refs.audio.play()
        })
      },
      playing(newPlaying){
        const audio = this.$refs.audio
        this.$nextTick(() => {
          newPlaying ? audio.play() : audio.pause()
        })
      }
    }
  }
</script>

<style lang="stylus" type="text/stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background-color: $color-background
      .background
        position: absolute
        width: 100%
        height: 100%
        opacity: .6
        filter: blur(20px)
        top: 0
        left: 0
        z-index: -1
      .top
        position: relative
        height: 40px
        line-height: 40px
        text-align center
        margin-bottom: 25px
        .icon-back
          position: absolute
          font-size: $font-size-large-x
          color: $color-theme
          padding: 9px
          transform: rotate(-90deg)
          left: 6px
        .title
          width: 70%
          margin: 0 auto
          font-size: $font-size-large
          color: $color-text
          text-align: center
          no-wrap()
        .subtitle
          line-height: 20px
          font-size: $font-size-medium
          color: $color-text
          text-align: center
      .middle
        position: fixed
        width: 100%
        font-size: 0
        top: 80px
        bottom: 170px
        white-space: nowrap
        .middle-l
          position: relative
          display: inline-block
          width: 100%
          height: 0
          padding-bottom:80%
          .cd-wrapper
            position: absolute
            width: 80%
            height: 100%
            left: 10%
            top: 0
            .cd
              width: 100%
              height: 100%
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                width: 100%
                height: 100%
                border: 10px solid rgba(255,255,255, .1)
                box-sizing: border-box
                border-radius: 50%
      .bottom
        position: absolute
        width: 100%
        bottom: 50px
        .operators
          display: flex
          justify-content: space-around
          align-items: center
          .icon
            font-size: 30px
            color: $color-theme
            &.disable
              color: $color-text-d
            &.icon-play, &.icon-pause
              font-size: 40px
              text-align: center
      &.normal-enter-active, &.normal-leave-active
        transition: all .4s
        .top, .bottom
          transition: all .4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      position: fixed
      display: flex
      align-items: center
      width: 100%
      height: 60px
      background-color: $color-highlight-background
      left: 0
      bottom: 0
      z-index: 180
      &.mini-enter-active, &.mini-leave-active
        transition: all .4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        margin: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex: 1
        flex-direction: column
        justify-content: center
        line-height: 20px
        overflow: hidden
        .name
          font-size: $font-size-medium
          color: $color-text
          margin-bottom: 2px
          no-wrap()
        .desc
          font-size: $font-size-small
          color: $color-text-d
          no-wrap()
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)



</style>