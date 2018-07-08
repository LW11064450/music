<template>
  <div class="slider-wrap">
    <swiper :options="swiperOption" v-if="showSlider">
      <swiper-slide v-for="(item, index) in recommends" :key="index">
        <a href="">
          <img class="slider-img" :src="item.picUrl" alt="">
        </a>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: "Slider",
    props: {
      recommends: Array
    },
    data () {
      return {
        swiperOption: {
          pagination: '.swiper-pagination',
          loop: true,
          autoplay: 2000,
          autoplayDisableOnInteraction: false,
        },
      }
    },
    computed: {
      showSlider () {
        return this.recommends.length
      },
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  @import "~common/stylus/variable"
  .slider-wrap >>> .swiper-pagination-bullet-active
    width: 20px
    border-radius: 5px
    background: $color-text-ll
  .slider-wrap
    height: 0
    padding-bottom: 40%
    background-color: #eee
    overflow: hidden
    a
      display: block
      width: 100%
      .slider-img
        width: 100%
</style>
