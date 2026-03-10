<template>
  <div class="h-msidebar">
    <div class="h-msidebar-wrapper" v-show="isOpenMFold" :style="{height: height + 'px'}">
      <div class="h-msidebar-head">
        <div class="msidebar-head-pic"><img src="../assets/org.png"/></div>
        <div class="msidebar-head-title">{{title}}</div>
        <div class="msidebar-head-icon" @click.prevent.stop="expandMSiderbar"><h-icon name="arrow-l" ></h-icon></div>
      </div>
      <div class="h-msidebar-body">
        <slot name="leftTree"></slot>
      </div>
    </div>
    <div :class="{hideMSidebar : !isOpenMFold}" 
         :style="{height: height + 'px'}"
         v-show="!isOpenMFold" >
        <div  @click.prevent.stop="expandMSiderbar">
          <h-icon name="arrow-r"></h-icon>
        </div>
    </div>
  </div>
</template>
<script>
  const prefixCls = 'h-datatree'

  import fetch from '../api/httpFetch.js'
  import Emitter from '@/utils/emitter';
  import { mapGetters } from 'vuex'
  export default {
    name: 'HDatatree',
    data () {
      return {
        value2 : '',
        isOpenMFold: true,
        selfTreeHeight: 0
      }
    },
    props: {
      ismfold:Boolean,
      height: [Number, String],
      title: String,

    },
    computed: {
      ...mapGetters([
        'mSidebar'
      ]),
    },
    methods: {
      expandMSiderbar () {
        this.$emit('listenExpendMSidebar','')
        this.isOpenMFold = !this.isOpenMFold
      },
    }
   }
</script>
<style>

</style>