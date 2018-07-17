<template>
  <div class="player" v-show="playlist.length>0">
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
        <div class="middle"
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend="middleTouchEnd"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd"
                   :class="cdRotate">
                <img :src="currentSong.image" alt="" class="image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <Scroll class="middle-r" ref="lyricList">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p class="text"
                   :class="{'current': currentLineNum === index}"
                   v-for="(line, index) in currentLyric.lines"
                   :key="line.time"
                   ref="lyricLine"
                >
                  {{line.txt}}
                </p>
              </div>
            </div>
          </Scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active':currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <ProgressBar :percent="percent"
                           @percentChange="onProgressBarChange"
              ></ProgressBar>
            </div>
            <span class="time">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <span class="icon"
                  :class="iconMode"
                  @click="changeMode"
            ></span>
            <span class="icon icon-prev"
                  :class="disableCls"
                  @click="prev"
            ></span>
            <span :class="playIcon"
                  @click="togglePlay"
            ></span >
            <span class="icon icon-next"
                  :class="disableCls"
                  @click="next"
            ></span>
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
          <progress-circle :radius="radius" :percent="percent">
            <i class="icon-mini"
               :class="miniIcon"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio :src="currentSong.url"
           ref="audio"
           @canplay="ready"
           @error="error"
           @timeupdate="updateTime"
           @ended="end"
    ></audio>
  </div>
</template>

<script type="text/ecmascript-6">
  import ProgressBar from 'base/progress-bar/progress-bar'
  import ProgressCircle from 'base/progress-circle/progress-circle'
  import Scroll from 'base/scroll/scroll'
  import { mapGetters } from 'vuex'
  import { mapMutations } from 'vuex'
  import { prefixStyle } from "common/js/dom"
  import { playMode } from "common/js/config"
  import { shuffle } from "common/js/util"
  import animations from 'create-keyframe-animation'
  import Lyric from 'lyric-parser'

  const transform = prefixStyle('transform')
  const transitionDuration = prefixStyle('transitionDuration')
  export default {
    data() {
      return {
        songReady: false,
        currentTime: 0,
        radius: 32,
        currentLyric: null,
        currentLineNum: 0,
        currentShow: 'cd',
        playingLyric: ''
      }
    },
    created() {
      this.touch={}
    },
    mounted() {
      console.log(this.currentSong)
    },
    methods: {
      /*改变播放模式*/
      changeMode() {
        /*let mode = this.mode + 1
        if (mode === 3) {
          mode = 0
        }*/
        const mode = (this.mode + 1) % 3
        this.setPlayMode(mode)

        let list = null
        if (mode === playMode.random) {
          list = shuffle(this.sequenceList)
        } else {
          list = this.sequenceList
        }
        this.resetCurrentIndex(list)
        this.setPlayList(list)
      },
      resetCurrentIndex(list){
        let index = list.findIndex((item, index, arr) => {
          return item.id === this.currentSong.id
        })
        this.setCurrentIndex(index)
      },
      /*子组件派发给当前组件的方法，进行播放时间进度的更新*/
      onProgressBarChange(newPercnet) {
        const currentTime = this.currentSong.duration * newPercnet
        this.$refs.audio.currentTime = currentTime
        if (!this.playing) {
          this.togglePlay()
        }
        if (this.currentLyric){
          this.currentLyric.seek(currentTime * 1000)
        }
      },
      /*播放时间进度发生改变时*/
      updateTime(e) {
        this.currentTime = e.target.currentTime
      },
      /*播放时间的显示转换，把时间戳变成00：00的形式*/
      format(interval) {
        interval = Math.floor(interval)
        const min = this._pad(Math.floor(interval / 60))
        const sec = this._pad(interval % 60)
        return `${min}:${sec}`
      },
      end() {
        if (this.mode === playMode.loop) {
          this.loop()
        } else {
          this.next()
        }
      },
      /*下一首*/
      next() {
        if (!this.songReady){
          return
        }
        let index = this.currentIndex + 1
        let listLen = this.playlist.length
        if (index === listLen) {
          index = 0
        }
        if (this.playlist.length === 1) {
          this.loop()
        } else {
          this.setCurrentIndex(index)
          if (!this.playing) {
            this.togglePlay()
          }
        }
        this.songReady = false

      },
      /*上一首*/
      prev(){
        if (!this.songReady){
          return
        }
        let index = this.currentIndex - 1
        let listLen = this.playlist.length
        if (index < 0) {
          index = listLen - 1
        }
        if (this.playlist.length === 1) {
          this.loop()
        } else {
          this.setCurrentIndex(index)
          if (!this.playing) {
            this.togglePlay()
          }
        }

        this.songReady = false
      },
      /*循环播放*/
      loop() {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        this.setPlayingState(true)
        if (this.currentLyric){
          this.currentLyric.seek(0)
        }
      },
      /*切换当前播放状态*/
      togglePlay() {
        if (!this.songReady) {
          return
        }
        this.setPlayingState(!this.playing)
        if (this.currentLyric){
          this.currentLyric.togglePlay()
        }
      },
      /*全屏播放改为下方mini播放器*/
      back() {
        this.setFullScreen(false)
      },
      /*全屏播放*/
      open() {
        this.setFullScreen(true)
      },
      /*当音乐可以播放*/
      ready() {
        this.songReady = true
      },
      /*当播放音乐发生错误*/
      error() {
        this.songReady = true
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
      getLyric() {
        this.currentSong.getLyric().then((res) => {
          this.currentLyric = new Lyric(res, this.handleLyric)
          if (this.playing) {
            /*在播放歌词过程中执行回调*/
            this.currentLyric.play()
          }
        }).catch(() => {
          this.currentLyric = null
          this.playingLyric = ''
          this.currentLineNum = 0
        })
      },
      /**/
      handleLyric({lineNum, txt}) {
        this.currentLineNum = lineNum
        if (lineNum > 5) {
          let lineEl = this.$refs.lyricLine[lineNum - 5]
          this.$refs.lyricList.scrollToElement(lineEl, 1000)
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
        this.playingLyric = txt
      },
      middleTouchStart(e) {
        this.touch.initiated = true
        this.touch.startX = e.touches[0].clientX
        this.touch.startY = e.touches[0].clientY
      },
      middleTouchMove(e){
        if (!this.touch.initiated) {
          return
        }
        const touch = e.touches[0]
        const deltaX = touch.clientX - this.touch.startX  /*得到的是滑动的宽度*/
        const deltaY = touch.clientY - this.touch.startY
        console.log(deltaX)
        console.log(deltaY)
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          return
        }
        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))  /*边界处理，最大偏移0，最小偏移可视窗口的宽度*/
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
        this.$refs.lyricList.$el.style[transitionDuration] = 0
        this.$refs.middleL.style.opacity = 1 - this.touch.percent
        this.$refs.middleL.style[transitionDuration] = 0
      },
      middleTouchEnd(){
        let offsetWidth
        let opacity
        if (this.currentShow === 'cd'){
          if (this.touch.percent > 0.3) { /*滑动的偏移大于10%*/
            offsetWidth = -window.innerWidth  /*直接就偏移到负的屏幕宽度*/
            opacity = 0
            this.currentShow = 'lyric' /*切换为歌词面板*/
          } else {
            offsetWidth = 0
            opacity = 1
          }
        } else {
          if (this.touch.percent < 0.9) {
            offsetWidth = 0
            opacity = 1
            this.currentShow = 'cd' /*切换为cd面板*/
          } else {
            opacity = 0
            offsetWidth = -window.innerWidth
          }
        }
        const time = 300
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
        this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
        this.$refs.middleL.style.opacity = opacity
        this.$refs.middleL.style[transitionDuration] = `${time}ms`
        this.touch.initiated = false
      },
      /*给播放时间，单位数的前面加个0*/
      _pad(num, n=2){
        let len = num.toString().length
        if (len === 1){
          num = '0' + num
        }
        return num
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
        setPlayingState: 'SET_PLAYING_STATE',
        setCurrentIndex: 'SET_CURRENT_INDEX',
        setPlayMode: 'SET_PLAY_MODE',
        setPlayList: 'SET_PLAYLIST'
      })
    },
    computed: {
      iconMode() {
        if (this.mode === playMode.sequence) {
          return 'icon-sequence'
        } else if(this.mode === playMode.loop){
          return 'icon-loop'
        } else {
          return 'icon-random'
        }
      },
      disableCls() {
        return this.songReady ? '' : 'disable'
      },
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
      percent() {
        return this.currentTime / this.currentSong.duration
      },
      ...mapGetters([
        'fullScreen',
        'playlist',
        'currentSong',
        'playing',
        'currentIndex',
        'mode',
        'sequenceList'
      ]),
    },
    watch: {
      currentSong (newSong, oldSong) {
        if (newSong.id === oldSong.id) {
          return
        }
        if (this.currentLyric) {
          this.currentLyric.stop()
        }
        setTimeout(() => {
          this.$refs.audio.play()
          this.getLyric()
        }, 1000)

      },
      playing(newPlaying){
        const audio = this.$refs.audio
        this.$nextTick(() => {
          newPlaying ? audio.play() : audio.pause()
        })
      }
    },
    components: {
      ProgressBar,
      ProgressCircle,
      Scroll
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
          vertical-align: top
          width: 100%
          height: 0
          padding-top:80%
          .cd-wrapper
            position: absolute
            width: 80%
            height: 100%
            left: 10%
            top: 0
            box-sizing: border-box
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
                top: 0
                left: 0
          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            text-align: center
            vertical-align: top
            margin: 0 auto
            overflow: hidden
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        width: 100%
        bottom: 50px
        .dot-wrapper
          font-size: 0
          text-align: center
          .dot
            display: inline-block
            width: 8px
            height: 8px
            margin: 0 4px
            border-radius: 50%
            background-color: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background-color: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0 auto
          padding: 10px 0
          .time
            flex: 0 0 30px
            width: 30px
            line-height: 30px
            font-size: $font-size-small
            color: $color-text
          .progress-bar-wrapper
            flex: 1
            margin: 0 10px
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
        .icon-mini
          position: absolute
          font-size: 32px
          top: 0
          left: 0
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)



</style>
