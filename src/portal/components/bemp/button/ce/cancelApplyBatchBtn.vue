<template>
  <h-button type="primary" v-if="isCommit === 'hasCommit'" @click="cancelApplyBatch()">{{$t("m.i.common.cancel")}}</h-button>
</template>
<script>
  export default {
    name : "cancelApplyBatchBtn",
    data() {
      return {
      }
    },
    props:{
      isCommit:String,
      submitFlag:{
        type:Boolean,
        default:false,
      }
    },
    methods:{
      cancelApplyBatch(){
        this.$emit('cancelApplyBatch','');
      }

    }
  }
</script>
