<template>
  <h-button type="primary" v-if="!submitFlag" @click="handle" v-show="isShow">{{$t("m.i.common.commit")}}</h-button>
</template>
<script>
  export default {
    name : "commitBtn",
    data() {
      return {

      }
    },
    props:{
      isShow:{
        type:Boolean,
        default:true
      },
      submitFlag:{
        type:Boolean,
        default:false
      }
    },
    methods:{
      handle(){
        this.$emit('commit','');
      }

    }
  }
</script>
