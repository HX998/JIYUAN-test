<template>
  <h-form-item :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNo" required>
    <h-input v-model="addForm['ownedBrchName']" icon="android-search" @on-click="brchNoWinOpen"
             readonly clearable @on-clear="clearVal1()" :title="addForm['ownedBrchName']" ></h-input>
  </h-form-item>
</template>

<script>
    export default {
        name: "ownBrchNo",
      data() {
        return {

        }
      },
      props:{
        addForm : Object || {}
      },
      methods:{
        brchNoWinOpen(){
          this.$emit('brchNoWinOpen','');
        },
        clearVal1(){
          this.addForm['ownedBrchName']="";
          this.addForm['ownedBrchNo']="";
        }

      }
    }
</script>
