<template>
  <div class="music-list">
    <div class="music-list-navbar">
      <i class="icon-back" @click="back"></i>
      <h3 class="title">{{ title }}</h3>
    </div>
    <div class="bg-image" :style="bgstyle" ref="bgImage">
      <div class="play"
           v-show="songs.length>0"
           ref="playBtn"
           @click="random"
      >
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <Scroll class="list"
            ref="list"
            :probeType="probeType"
            :listenScroll="listenScroll"
            @scroll="scroll"
    >
      <div class="song-list-wrapper">
        <song-list :songs="songs"
                   :rank="rank"
                   @select="selectItem"
        ></song-list>
      </div>
      <div v-show="!songs.length" class="loading-container">
        <loading></loading>
      </div>
    </Scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import SongList from 'base/song-list/song-list'
  import Loading from 'base/loading/loading'
  import { mapActions } from 'vuex'
  import { playlistMixin } from "common/js/mixin";

  const RESERVED_HEIGHT = 40

  export default {
    mixins: [playlistMixin],
    props: {
      songs: Array,
      bgImage: String,
      title: String,
      rank: {
        type: Boolean,
        default: false
      }
    },
    data(){
      return{
        scrollY: 0,
        minTranslateY: 0,
        imageHeight: 0
      }
    },
    created() {
      this.probeType = 3
      this.listenScroll = true
    },
    mounted() {
      this._listTop()
    },
    methods: {
      handlePlaylist(playlist){
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.list.$el.style.bottom = bottom
        this.$refs.list.refresh()
      },
      selectItem(item, index){
        this.selectPlay({
          list: this.songs,
          index: index
        })
      },
      random() {
        this.randomPlay({
          list: this.songs
        })
      },
      back() {
        this.$router.back()
      },
      scroll(pos){
        this.scrollY = pos.y
      },
      _listTop() {
        this.imageHeight = this.$refs.bgImage.clientHeight
        this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT
        this.$refs.list.$el.style.top = `${this.imageHeight}px`
      },
      ...mapActions([
        'selectPlay',
        'randomPlay'
      ])
    },
    computed: {
      bgstyle() {
        return `background-image: url(${this.bgImage})`
      }
    },
    watch: {
      scrollY(newY){
        let scale = 1
        let percent = 0
        let blur = 0
        let translateY = Math.max(this.minTranslateY, newY)
        this.$refs.layer.style['transform'] = `translate3d(0,${translateY}px,0)`
        if (newY > 0) {
          percent = Math.abs(newY / this.imageHeight)
          scale = 1 + percent
          this.$refs.bgImage.classList.add('pull')
        } else {
          this.$refs.bgImage.classList.remove('pull')
          blur = Math.min(20, percent * 20)
        }

        if (newY < this.minTranslateY) {
          this.$refs.bgImage.classList.add('on')
        } else {
          this.$refs.bgImage.classList.remove('on')
        }

        this.$refs.bgImage.style['transform'] = `scale(${scale})`
        this.$refs.filter.style['backdrop'] = `blur(${blur}px)`
      }
    },
    components: {
      SongList,
      Scroll,
      Loading
    }
  }
</script>

<style lang="stylus" type="text/stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    top: 0
    bottom: 0
    left: 0
    right: 0
    z-index: 100
    background-color: $color-background
    .music-list-navbar
      position: absolute
      display: flex
      width: 100%
      height: 40px
      line-height: 40px
      z-index: 50
      .icon-back
        font-size: $font-size-large-x
        color: $color-theme
        padding: 10px
      .title
        flex: 1
        text-align: center
        font-size: $font-size-large
        color: $color-text
        no-wrap()
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-bottom: 70%
      transform-origin: top
      background-size: cover
      &.on
        height: 40px
        padding-bottom: 0
        z-index: 10
        .play
          display: none
      &.pull
        z-index: 10
      .filter
        position: absolute
        width: 100%
        height: 100%
        background-color: rgba(7, 17, 27, .4);
        top: 0
        left: 0
      .play
        position: absolute
        display: flex
        justify-content: center
        align-items: center
        width: 135px
        text-align: center
        color: $color-theme
        padding: 7px 0
        border-radius: 100px
        border: 1px solid $color-theme
        box-sizing: border-box
        transform: translate3d(-50%, 0 , 0)
        left: 50%
        bottom: 20px
        z-index: 50
        .icon-play
          font-size: $font-size-medium-x
          margin-right: 6px
        .text
          font-size: $font-size-small
    .bg-layer
      position: relative
      height: 100%
      background-color: $color-background
    .list
      position: fixed
      width: 100%
      top: 0
      bottom: 0
      background-color: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translate3d(0,-50%,0)


</style>
