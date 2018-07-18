<template>
  <div class="rank" ref="rank">
    <Scroll class="toplist" :data="toplist" ref="toplist">
      <ul class="toplist-wrapper">
        <li class="toplist-item"
            v-for="item in toplist"
            :key="item.id"
            @click="selectItem(item)"
        >
          <div class="icon">
            <img v-lazy="item.picUrl" alt="">
          </div>
          <ul class="song-list">
            <li class="song-item"
                v-for="(song, index) in item.songList"
                :key="song.singername"
            >
              <span class="num">{{ index + 1 }}</span>
              <span class="txt">{{ song.songname}}-{{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
    </Scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapMutations} from 'vuex'
  import {ERR_OK} from "api/config"
  import {getTopList} from "api/rank"
  import {playlistMixin} from "common/js/mixin";
  import Scroll from 'base/scroll/scroll'

  export default {
    mixins: [playlistMixin],
    data() {
      return {
        toplist: []
      }
    },
    created() {
      this._getTopList()
    },
    methods: {
      handlePlaylist(playlist) {
        const bottom = playlist.length ? '60px' : ''
        this.$refs.rank.style.bottom = bottom
        this.$refs.toplist.refresh()
      },
      selectItem(item){
        this.$router.push({
          path: `/rank/${item.id}`
        })
        this.setTopList(item)
      },
      _getTopList(){
        getTopList().then((res) => {
          if (res.code === ERR_OK) {
            this.toplist = res.data.topList
            console.log(this.toplist)
          }
        })
      },
      ...mapMutations({
        setTopList : 'SET_TOP_LIST'
      })
    },
    components: {
      Scroll
    }
  }
</script>

<style lang="stylus"  type="text/stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .rank
    position: absolute
    width: 100%
    left: 0
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      margin: 0 20px
      overflow: hidden
      .toplist-item
        display: flex
        height: 100px
        padding-top: 20px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
          img
            width: 100%
        .song-list
          display: flex
          flex: 1
          flex-direction: column
          justify-content: center
          height: 100px
          font-size: $font-size-small
          color: $color-text-d
          background-color: $color-highlight-background
          padding: 0 20px
          overflow: hidden
          .song-item
            no-wrap()
            line-height: 26px



</style>
