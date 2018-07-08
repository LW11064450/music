<template>
  <div class="HomeTab">
    <router-link to="/recommend" tag="div" class="tab-item">
      <span class="tab-alink">推荐</span>
    </router-link>
    <router-link to="/singer" tag="div" class="tab-item">
      <span class="tab-alink">歌手</span>
    </router-link>
    <router-link to="/rank" tag="div" class="tab-item">
      <span class="tab-alink">排行</span>
    </router-link>
    <router-link to="/search" tag="div" class="tab-item">
      <span class="tab-alink">搜索</span>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: "HomeTab"
  }
</script>

<style lang="stylus" type="text/stylus" scoped>
  @import "~common/stylus/variable"
  .HomeTab
    display: flex
    .tab-item
      flex: 1
      height: 44px
      line-height: 44px
      font-size: $font-size-medium
      text-align: center
      .tab-alink
        padding-bottom: 5px
      &.router-link-active
        .tab-alink
          color: $color-theme
          border-bottom: 2px solid $color-theme
</style>
