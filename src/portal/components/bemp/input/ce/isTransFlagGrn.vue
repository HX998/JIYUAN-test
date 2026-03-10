<template>
  <h-form-item :label="$t('m.i.ce.isTransFlagGrn')" prop="reserve2" required class="h-form-long-label">
    <h-select v-model="formItem.reserve2" placeholder="">
      <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
    </h-select>
  </h-form-item>
</template>

<script>
  export default {
    name : "isTransFlagGrn",
    data() {
      return {
      }
    },
    props:{
      isList:Array,
      formItem : Object || {},
    },
    methods:{

    }
  }
</script>
