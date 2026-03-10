<template>
  <h-form-item :label="$t('m.i.ce.clearMark')" prop="clearMark" :required="required">
    <h-select v-model="formItem.clearMark" :readonly="onlyRead" placeholder="">
      <h-option v-for="item in clearMarkList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
    </h-select>
  </h-form-item>
</template>

<script>
  export default {
    name : "clearMark",
    data() {
      return {
      }
    },
    props:{
      clearMarkList:Array,
      required :{
        type: Boolean,
        default: true
      },
      onlyRead :{
        type: Boolean,
        default: true
      },
      operType: String,
      formItem : Object || {},
    },
    methods:{

    }
  }
</script>
