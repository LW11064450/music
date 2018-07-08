<template>
  <div class="m-header">
    <i class="header-logo"></i><h3 class="header-title">Chicken Music</h3>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: "HomeHeader"
  }
</script>

<style lang="stylus" type="text/stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .m-header
    display: flex
    justify-content: center
    height: 44px
    color: $color-theme
    .header-logo
      width: 30px
      height: 32px
      margin: 4px 9px 0 0
      bg-image(logo)
      background-size: 30px 32px
    .header-title
      font-size: $font-size-large
      line-height: 44px
</style>
