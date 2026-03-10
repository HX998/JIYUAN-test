<!--通用下拉菜单-->
<template>
  <h-dropdown v-if="isShowDropdown" :trigger="trigger" :visible="visible" :placement="placement"
              :autoPlacement="autoPlacement" :adaptParentWidth="adaptParentWidth" @on-click="onClick"
              @on-visible-change="onVisibleChange">
    <slot>
      <h-button type="primary">{{dropdownTitle}}<h-icon name="unfold"></h-icon></h-button>
    </slot>
    <slot name="list" slot="list">
      <h-dropdown-menu>
        <h-dropdown-item v-for="item in dropdownItemProps" :key="item.name" :name="item.name ? item.name : ''"
                         v-if="item.isShow ? item.isShow : true"
                         :disabled="item.disabled ? item.disabled : false"
                         :divided="item.divided ? item.divided : false"
                         :selected="item.selected ? item.selected : false">{{item.label ? item.label : ""}}</h-dropdown-item>
      </h-dropdown-menu>
    </slot>
  </h-dropdown>
</template>

<script>
  export default {
    name: "commonDropdown",
    props: {
      trigger: {
        type: String,
        default: "hover"
      },
      visible: {
        type: Boolean,
        default: false
      },
      placement: {
        type: String,
        default: "bottom-start"
      },
      autoPlacement: {
        type: Boolean,
        default: true
      },
      adaptParentWidth: {
        type: Boolean,
        default: false
      },
      isShowDropdown: {//是否展示下拉菜单
        type: Boolean,
        default: true
      },
      dropdownTitle: {//下拉菜单显示名称，使用默认slot时生效
        type: String,
        default: ""
      },
      /**
       * 下拉菜单列表对应属性，，使用默认slot时生效
       * 必填项：label(下拉展示名称)和name(标识当前项，同hui)；
       * 可选项：isShow(是否显示下拉项)、disabled(禁用该项，同hui)、divided(显示分割线，同hui)、selected(标记该项为选中状态，同hui)
       */
      dropdownItemProps: {
        type: Array
      }
    },
    methods: {
      onClick(itemName) {
        this.$emit("on-click", itemName);
      },
      onVisibleChange(visible) {
        this.$emit("on-visible-change", visible);
      }
    }
  }
</script>

<style scoped>

</style>
