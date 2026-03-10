<template>
  <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
</template>
<script>
  export default {
    name : "submitingBtn",
    data() {
      return {

      }
    },
    props:{
      isCommit:String,
      submitFlag:{
        type:Boolean,
        default:true,
      }
    },
    methods:{

    }
  }
</script>
