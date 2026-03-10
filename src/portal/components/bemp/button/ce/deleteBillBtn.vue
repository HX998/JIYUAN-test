<template>
  <h-button type="primary" v-if="isCommit === 'noCommit'" @click="deleteDetailed">{{$t("m.i.common.delete")}}</h-button>
</template>
<script>
  export default {
    name : "deleteBillBtn",
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
      deleteDetailed(){
        this.$emit('deleteDetailed','');
      }

    }
  }
</script>
