<template>
  <transition name="slide">
    <MusicList :songs="songs" :title="title" :bg-image="bgImage"></MusicList>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from '../music-list/music-list'
  import { mapGetters } from 'vuex'
  import { getSingerSongs, formatSongs } from 'api/song'
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
       /* getSingerDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.data.list)
            /!*每个歌手的歌曲列表,就是musicData*!/
            console.log(res.data.list)
            /!*每个list下的musicData对象数据组成的数组*!/
            console.log(this.songs)
            /!*歌手相关信息（包括歌手图片，名字，id）*!/
            console.log(this.singer)
          }
        })*/
        getSingerSongs(this.singer.id).then(res => {
          if (res.code === ERR_OK) {
            this.songs = formatSongs(res.data.list);
          }
        });
      },
      /*_normalizeSongs(list) {
        let ret = []
        list.forEach((item) => {
          let {musicData} = item
          if (musicData.songid && musicData.albummid) {
            let song = createSong(musicData)
            getSongUrl(song, musicData.songmid)
            ret.push(song)
          }
        })
        return ret
      }*/
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
