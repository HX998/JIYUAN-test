<template>
  <div class="menu-transfer-box">
    <div class="transfer-box">
      <div class="transfer-list" :style="stylecls">
        <div class="header"><span class="tit">{{sourceTitle}}</span></div>
        <div class="body">
          <slot name="source"></slot>
        </div>
      </div>
    </div>
    <div class="transfer-op">
      <slot name="operation"></slot>
    </div>
    <div class="transfer-box">
      <div class="transfer-list" :style="stylecls">
        <div class="header"><span class="tit">{{purposeTitle}}</span></div>
        <div class="body">
          <slot name="purpose"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'menuTransfer',
    data() {
      return {}
    },
    props: {
      sourceTitle: {
        type: String,
        default: "全部菜单"
      },
      purposeTitle: {
        type: String,
        default: "已选常用菜单"
      },
      height: [String,Number],
    },
    computed: {
      stylecls () {
        let style={};
        style.height = this.height + 'px';
        return style;
      }
    }
  }
</script>

<style>

</style>
