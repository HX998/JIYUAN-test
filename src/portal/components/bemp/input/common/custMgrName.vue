<template>
  <h-form-item :label="$t('m.i.common.custMgrName')" prop="custMgrName" :required="isCustMgrRequired">
    <h-input v-model="formItem.custMgrName" :clearable="isCustMgrClearable" @on-clear="clearVal('custMgrName')"
             placeholder="" readonly :icon="isAllowOtherCustMgr ? 'android-search' : ''"
             @on-click="queryCustManager()" v-if="!readonly"></h-input>
    <h-input v-model="formItem.custMgrName" readonly v-if="readonly"></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name: "custMgrName",
    data() {
      return {}
    },
    props: {
      formItem: Object || {},
      operType: String,
      isCustMgrRequired: {
        type: Boolean,
        default: false
      },
      readonly: {
        type: Boolean,
        default: false
      },
      isCustMgrClearable: {
        type: Boolean,
        default: true
      },
      isAllowOtherCustMgr: {
        type: Boolean,
        default: false
      },
    },
    methods: {
      queryCustManager() {
        this.$emit('queryCustManager', '');
      },
      clearVal(val) {
        this.$emit('clearVal', val);
      }
    }
  }
</script>
