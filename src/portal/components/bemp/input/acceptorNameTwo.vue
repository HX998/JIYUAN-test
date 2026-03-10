<template>
  <h-form-item prop="acptName" required>
    <h-input v-model="formItem['acptName']" placeholder="" :maxlength=60 @on-blur="onBlur()"
             :icon="androidSearchWin?'android-search':''" :clearable="showClearable"
             @on-click="queryCommonRosterInfo"
             @on-clear="clearCommonRosterInfo" :readonly="isReadonly"></h-input>
  </h-form-item>
</template>

<script>
    export default {
      name: "acceptorNameTwo",
      data() {
        return {

        }
      },
      props:{
        formItem : Object || {},
        androidSearchWin: {
          type: Boolean,
          default() {
            return false;
          }
        },
      showClearable:{
        type: Boolean,
        default() {
          return false;
        }
      },
        isReadonly:{
          type:Boolean,
          default:false
        }
      },
      methods:{
        onBlur(){
          this.$emit('onBlur','');
        },
        queryCommonRosterInfo() {
          this.$emit('queryCommonRosterInfo', '');
        },
        clearCommonRosterInfo() {
          this.$emit('clearCommonRosterInfo', '');
        },
      }
    }
</script>
