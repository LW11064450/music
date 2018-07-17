<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import { mapGetters } from 'vuex'
  import MusicList from '../music-list/music-list'
  import { getSongList } from "api/recommend"
  import { ERR_OK } from "api/config"

  export default {
    data() {
      return {
        songs: []
      }
    },
    created() {
      this._getSongList()
    },
    methods: {
      _getSongList(){
        getSongList(this.disc.dissid).then((res) => {
          if (res.code === ERR_OK) {
            console.log(res)
          }
        })
      }
    },
    computed: {
      title() {
        return this.disc.dissname
      },
      bgImage() {
        return this.disc.imgurl
      },
      ...mapGetters([
        'disc'
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
  .slide-enter, .slide-leave-avtive
    transform: translate3d(100%, 0, 0)
</style>
