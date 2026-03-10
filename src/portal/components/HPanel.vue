<template>
  <div :class="panelCls">
     <div :class="[prefixCls + '-header']" v-if="isHeader">
      <slot name="header">
        <h-icon v-if="icon" :name="icon"></h-icon>
        <h3>{{title}}</h3>
      </slot>
    </div>
    <div :class="contentCls">
      <slot></slot>
    </div>
    <div :class="footerCls">
      <slot name="panelFooter"></slot>
    </div>
    <div :class="[prefixCls + '-collapse-icon']" v-if="collapse" @click='handleCollapse'>
      <a href="javascript:void(0)">
        <h-icon name="unfold"></h-icon>
      </a>
    </div>
    <div :class="[prefixCls + '-collapse-icon-line']"  v-if="collapse"></div>
  </div>
</template>
<script>
  const prefixCls = 'h-panel'
  import {oneOf} from  '../utils/index'
  export default {
    name: 'HPanel',
    data () {
      return {
        prefixCls: prefixCls,
        isCollapse: false
      }
    },
    props: {
      title: String,
      footerPos: {
        validator (value) {
          return oneOf(value, ['left', 'center', 'right']);
        },
        default: 'center'
      },
      collapse: {
        type: Boolean,
        default: false
      },
      icon: String
    },
    computed: {
      panelCls () {
        return [
          `${prefixCls}`,
          {
            [`${prefixCls}` + '-collapse']: this.isCollapse
          }
        ]
      },
      contentCls () {
        return [
          `${prefixCls}-content`,
          'clearfix'
        ]
      },
      footerCls () {
        return [
          `${prefixCls}-footer`,
          {
            ['text-' + this.footerPos]: this.footerPos,
            ['disNone']: !this.$slots.panelFooter
          }
        ]
      },
      isHeader () {
        return this.title || this.$slots.header
      }
    },
    methods: {
      handleCollapse () {
        this.isCollapse = !this.isCollapse
      }
    }
  }
</script>
<style>

</style>