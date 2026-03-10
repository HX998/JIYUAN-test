<template>
  <h-form-item :label="$t('m.i.ce.isBackQuery')" prop="isBackQuery" :required="formItem.queryType !== '4' && formItem.queryType !== '2' && formItem.queryType !== '' && formItem.queryType != null && isQueryRecovery === true" v-show="formItem.queryType !== '4' && formItem.queryType !== '2' && formItem.queryType !== '' && formItem.queryType != null && isQueryRecovery === true">
    <h-select v-model="formItem.isBackQuery" :maxlength=60 :readonly="onlyRead">
      <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
    </h-select>
  </h-form-item>
</template>

<script>
  export default {
    name : "isBackQuery",
    data() {
      return {
      }
    },
    props:{
      isList:Array,
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
