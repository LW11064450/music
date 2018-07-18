<template>
  <div class="song-list">
    <ul>
      <li class="item"
          v-for="(song, index) in songs"
          :key="song.id"
          @click="selectItem(song, index)"
      >
          <span class="rank-icon" v-show="rank"
                :class="getRankCls(index)">
            {{getRankText(index)}}
          </span>
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
      songs: Array,
      rank: Boolean
    },
    methods: {
      selectItem(item, index){
        this.$emit('select', item, index)
      },
      getDesc(song) {
        return `${song.singer}.${song.album}`
      },
      getRankCls(index){
        if (index <= 2){
          return `icon icon${index}`
        } else {
          return 'text'
        }
      },
      getRankText(index) {
        if (index > 2) {
          return index + 1
        }
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
      .rank-icon
        flex: 0 0 25px
        width: 25px
        height: 24px
        text-align: center
        margin-right: 30px
        background-size: 25px 24px
        &.icon0
          bg-image('first')
        &.icon1
          bg-image('second')
        &.icon2
          bg-image('third')
      .text
        color: $color-theme
        font-size: $font-size-large
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
