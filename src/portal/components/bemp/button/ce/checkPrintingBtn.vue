<template>
  <h-button type="primary" v-if="isCommit === 'noCommit'" @click="checkPrinting()">{{$t("m.i.ce.checkPrinting")}}</h-button>
</template>
<script>
    export default {
        name : "checkPrintingBtn",
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
            checkPrinting(){
                this.$emit('checkPrinting','');
            }

        }
    }
</script>
