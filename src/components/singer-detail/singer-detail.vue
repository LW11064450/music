<template>
  <transition name="slide">
    <MusicList :songs="songs" :title="title" :bg-image="bgImage"></MusicList>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from '../music-list/music-list'
  import { mapGetters } from 'vuex'
  import { getSingerDetail, getMusic } from "api/singer"
  import { createSong } from "common/js/song"
  import { ERR_OK } from "api/config"

  export default {
    name: "",
    data() {
      return {
        songs: [],
        music: []
      }
    },
    created() {
      this._getDetail()
    },
    methods: {
      _getDetail() {
        if (!this.singer.id) {
          this.$router.push('/singer')
          return
        }
        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.data.list)
            /*每个歌手的歌曲列表,就是musicData*/
            console.log(res.data.list)
            /*每个list下的musicData对象数据组成的数组*/
            console.log(this.songs)
            /*歌手相关信息（包括歌手图片，名字，id）*/
            console.log(this.singer)
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((item) => {
          let  musicData  = item.musicData
          if (musicData.songid && musicData.albummid) {
            getMusic(musicData.songmid).then((res) => {
              if (res.code === ERR_OK) {
                const svkey = res.data.items
                const songVkey = svkey[0].vkey
                /*每次push进来的就是一个musicdata数据对象*/
                const newSong = createSong(musicData, songVkey)
                ret.push(newSong)
              }
            })
          }
        })
        return ret
      }
    },
    computed: {
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      },
      ...mapGetters([
        'singer'
      ])
    },
    components: {
      MusicList
    }
  }
</script>

<style lang="stylus" type="text/stylus" scoped>

  .slide-enter-active, .slide-leave-active
    transition: transform .3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
