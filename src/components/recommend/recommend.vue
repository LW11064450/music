<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <div class="recommend-slider">
          <Slider :recommends="recommends"></Slider>
        </div>
        <div class="recommend-list">
          <h3 class="list-title">热门歌单推荐</h3>
          <div class="list-item">
            <ul class="item-wrap">
              <li class="recom-list-item"
                  v-for="(item, index) in discList"
                  :key="index"
                  @click="selectItem(item)"
              >
                  <div class="list-media">
                    <img v-lazy="item.imgurl" alt="" class="item-img">
                  </div>
                  <div class="list-info">
                    <h3 class="list-tit">{{item.creator.name}}</h3>
                    <p class="list-text">{{item.dissname}}</p>
                  </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import { getRecommend, getDiscList } from 'api/recommend'
  import { ERR_OK } from 'api/config'
  import { mapMutations } from 'vuex'
  import Slider from 'base/slider/slider'

  /* import Bscroll from 'better-scroll'*/
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import { playlistMixin } from "common/js/mixin";

  export default {
    mixins: [playlistMixin],
    data () {
      return {
        recommends: [],
        discList: [],
      }
    },
    methods: {
      selectItem(item) {
        this.$router.push({
          path: `/recommend/${item.dissid}`
        })
        this.setDisc(item)
      },
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.recommend.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      _getRecommend () {
        getRecommend().then((res) => {
          if (res.code === ERR_OK){
            this.recommends = res.data.slider
          }
        })
      },
      _getDiscList () {
        getDiscList().then((res) => {
          if (res.code === ERR_OK){
            console.log(res.data.list)
            console.log(res.data)
            this.discList = res.data.list
          }
        })
      },
      ...mapMutations({
        setDisc: 'SET_DISC'
      })
    },
    mounted () {
      setTimeout(() => {
        this._getRecommend()
      },20)
     this._getDiscList()
    },
    components: {
      Slider,
      Scroll,
      Loading
    }
  }
</script>

<style lang="stylus" type="text/stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .recommend
    position: absolute
    top: 88px
    left: 0
    right: 0
    bottom: 0
    overflow: hidden
    .recommend-content
      height: 100%
      .list-title
        height: 65px
        line-height: 65px
        text-align: center
        font-size: $font-size-medium
        color: $color-theme
      .list-item
        .recom-list-item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px
          .list-media
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
            .item-img
              width: 60px
              height: 60px
          .list-info
            flex: 1
            display: flex
            flex-direction: column
            justify-content: center
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .list-tit
              margin-bottom: 10px
              color: $color-text
              no-wrap()
            .list-text
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
