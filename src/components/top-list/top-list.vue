<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage" :rank="rank"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import {getMusicList} from "api/rank"
  import {ERR_OK} from "api/config"
  import {formatTopSongs} from "api/rank"
  import MusicList from 'components/music-list/music-list'
  export default {
    data() {
      return {
        songs: [],
        rank: true
      }
    },
    created() {
      this._getMusicList()
    },
    methods: {
      _getMusicList(){
        if (!this.toplist.id) {
          this.$router.push('/rank')
          return
        }
        getMusicList(this.toplist.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = formatTopSongs(res.songlist)
          }
        })
      },
    },
    computed: {
      title() {
        return this.toplist.topTitle
      },
      bgImage() {
        return this.toplist.picUrl
      },
      ...mapGetters([
        'toplist'
      ])
    },
    components: {
      MusicList
    }
  }
</script>

<style lang="stylus" type="text/stylus" scoped>
  .slide-enter-avtive, .slide-leave-avtive
    transition: transform .3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
