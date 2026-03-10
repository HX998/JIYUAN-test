<template>
  <h-form-item :label="$t('m.i.ce.isTradeGroundGrn')" prop="reserve1" required class="h-form-long-label">
    <h-select v-model="formItem.reserve1" placeholder="">
      <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
    </h-select>
  </h-form-item>
</template>

<script>
  export default {
    name : "isTradeGroundGrn",
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
