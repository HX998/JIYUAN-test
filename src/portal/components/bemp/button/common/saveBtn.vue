<template>
  <h-button type="primary" v-if="!submitFlag" @click="formSave()" v-show="isCommit === 'noCommit'" >保存</h-button>
</template>
<script>
  export default {
    name : "saveBtn",
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
      formSave(){
        this.$emit('formSave','');
      }

    }
  }
</script>
