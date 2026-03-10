<template>
  <h-form-item :label="$t('m.i.common.custName')" prop="custName" :required="required">
    <h-input v-model="formItem['custName']" placeholder="" :icon="showIcon ? 'android-search' : ''"
             @on-click="queryCustMessage()" :clearable="clearable" @on-clear="clearCustName()" :readonly="isReadonly" :maxlength="80"></h-input>
  </h-form-item>
</template>

<script>
    export default {
        name: "custName",
      data() {
        return {

        }
      },
      props:{
        formItem : Object || {},
        showIcon :{
          type: Boolean,
          default: true
        },
        clearable:{
          type: Boolean,
          default: true
        },
        isReadonly:{
          type: Boolean,
          default: true
        },
        required :{
          type: Boolean,
          default: false
        },
      },
      methods:{
        queryCustMessage(){
          this.$emit('queryCustMessage','');
        },
        clearCustName(){
          this.formItem['custName']="";
          this.formItem['custNo']="";
        }
      }
    }
</script>
