<template>
  <div class="song-list">
    <ul>
      <li class="item"
        v-for="(song, index) in songs"
        :key="song.id"
        @click="selectItem(song, index)"
      >
        <div class="content">
          <h3 class="name">{{ song.name }}</h3>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      songs: Array
    },
    methods: {
      selectItem(item, index){
        this.$emit('select', item, index)
      },
      getDesc(song) {
        return `${song.singer}.${song.album}`
      }
    },
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .song-list
    .item
      display: flex
      align-items: center
      height: 64px
      font-size: $font-size-medium
      .content
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          no-wrap()
          color: $color-text
        .desc
          width: 100%
          no-wrap()
          color: $color-text-d
          margin-top: 4px
</style>
