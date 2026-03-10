<template>
  <h-form-item :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos">
    <h-input v-model="formItem['ownedBrchNames']" icon="android-search" @on-click="brchNoWinOpen"
             readonly clearable @on-clear="clearVal1()" :title="formItem['ownedBrchNames']" ></h-input>
  </h-form-item>
</template>

<script>
    export default {
        name: "ownBrchNos",
      data() {
        return {

        }
      },
      props:{
        formItem : Object || {}
      },
      methods:{
        brchNoWinOpen(){
          this.$emit('brchNoWinOpen','');
        },
        clearVal1(){
          this.formItem['ownedBrchNames']="";
          this.formItem['ownedBrchNos']="";
        }

      }
    }
</script>
