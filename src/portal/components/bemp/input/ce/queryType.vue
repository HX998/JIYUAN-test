<template>
  <h-form-item :label="$t('m.i.ce.queryType')" prop="queryType" :required="isQueryRecovery" v-show="isQueryRecovery">
    <h-select v-model="formItem.queryType" :maxlength=60 @on-change="queryTypeChange" :readonly="onlyRead">
      <h-option v-for="item in queryTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
    </h-select>
  </h-form-item>
</template>

<script>
  export default {
    name : "queryType",
    data() {
      return {
      }
    },
    props:{
      queryTypeList:Array,
      isQueryRecovery :{
        type: Boolean,
        default: false
      },
      operType: String,
      formItem : Object || {},
      onlyRead:{
        type: Boolean,
        default: false
      },
    },
    methods:{
      queryTypeChange(){
        this.$emit('queryTypeChange','');
      },

    }
  }
</script>
