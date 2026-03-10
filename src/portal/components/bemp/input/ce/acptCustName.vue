<template>
  <h-form-item :label="$t('m.i.ce.acptCustName')" prop="acptCustName" :required="required">
    <h-input  v-model="formItem.acptCustName" :maxlength=60 readonly :icon="onlyRead ? '' : 'android-search'" @on-click="queryAcptCustName" @on-change="acptCustNameChange"></h-input>
  </h-form-item>
</template>

<script>
    export default {
        name: "acptCustName",
      data() {
        return {

        }
      },
      props:{
        formItem : Object || {},
        showIcon :{type: Boolean,
          default: true},
        onlyRead:{
          type: Boolean,
          default: true
        },
        required :{
          type: Boolean,
          default: true
        },
      },
      methods:{
        acptCustNameChange(){
          this.$emit('acptCustNameChange','');
        },
        queryAcptCustName(){
          this.$emit('queryAcptCustName','');
        },

      }
    }
</script>
