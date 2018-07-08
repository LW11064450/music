<template>
  <div class="singer">
    <listview
      :data="singers"
      @select="selectSinger"
    >
    </listview>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import { getSingerList } from 'api/singer'
  import { ERR_OK } from 'api/config'
  import Singer from 'common/js/singer'
  import Listview from 'base/listview/listview'
  import { mapMutations } from 'vuex'
  const HOT_NAME = '热门'
  const HOT_SINGER_LEN = 10
  export default {
    name: "",
    data () {
      return {
        singers: []
      }
    },
    mounted () {
      this._getSingerList()
    },
    methods: {
      selectSinger(singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        this.setSinger(singer)
      },
      /*获取数据*/
      _getSingerList () {
        getSingerList().then((res) => {
          if (res.code === ERR_OK){
            this.singers = this._normalizeSinger(res.data.list)
          }
        })
      },
      /*对传进来数据进行分类排列*/
      _normalizeSinger(list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((item, index) => {
          if (index < HOT_SINGER_LEN) {
            /*new返回的是一个对象，将返回的对象push到items数组中*/
            map.hot.items.push(new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid
            }))
          }
          const key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))
        })

        let ret = []
        let hot = []
        for (let k in map) {
          let val = map[k]
          if (val.title.match(/[A-Za-z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME){
            hot.push(val)
          }
        }
        ret.sort((a, b) => {
          /*返回的是比较后已经排序好的数组*/
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)

      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    },
    components: {
      Listview
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .singer
    position: absolute
    top: 88px
    left: 0
    right: 0
    bottom: 0
    overflow: hidden
</style>
