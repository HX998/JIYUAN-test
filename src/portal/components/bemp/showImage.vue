<!--影像控件，带缩放-->
<template>
  <div class="h-show-image">
    <!-- 弹框轮播图组件 -->
    <keep-alive>
      <dialog-carousel v-model="carouselForm" tags-position-type="mix"
                       :data="carouselData" :title="title"></dialog-carousel>
    </keep-alive>
  </div>
</template>

<script>

  export default {
    name: "showImage",
    components: {
      dialogCarousel: () => import(/* webpackChunkName: "plugins/dialogCarousel" */ '@/plugins/dialogCarousel')
    },
    props: {
      title: "",
      // 弹框轮播图数据
      carouselData: {
        imgUrls: []
      },
      // 弹框轮播图表单
      carouselForm: {
        initialIndex: 0,    //初始图片位置
        showDialog: false,    //控制影像控件显隐
        tags: []          //图片提示
      }
    },
    methods: {
    }
  };
</script>

<style lang="scss" scoped>
</style>
