<template>
  <div class="h-navbar-wrapper">
    <!-- 已打开标签 -->
    <div style="
      height: 41px;
      position: absolute;
      overflow: visible;
      white-space: nowrap;
      -webkit-transition: left .3s ease;
      transition: left .3s ease;
      padding-top: 10px;
      margin-bottom: 10px;
      background: #eaedf1;
      width: 100%;
  "></div>
    <tabs-view></tabs-view> 
  </div>
</template>
<script>
  // import Levelbar from './Levelbar'
  import TabsView from './TabsView'
  export default {
    components: {
      TabsView
    }
  }
</script>