<template>
  <h-form-item v-if="applType !== 'impawn'" :label="this.$t('m.i.ebank.banEndrsmtMark')" prop="banEndrsmtMark" :class="className" :required="required">
    <h-select v-model="formItem[formType]['banEndrsmtMark']" placeholder="" :readonly="readonly">
      <h-option v-for="item in banEndrsmtMarkList" :value="item.key" :key="item.key">{{item.value}}</h-option>
    </h-select>
  </h-form-item>
</template>

<script>
  export default {
    name : "endrsmtMark",
    data() {
      return {
        formItem:{}
      }
    },
    props:{
      banEndrsmtMarkList:Array,
      applType:{
        type:String,
        default:''
      },
      className: String,
      required :{
        type: Boolean,
        default: false
      },
      formObj : Object || {},
      formType:{
        type:String,
        default:'formItem'
      },
      banEndrsmtMarkReadOnly:{
        type: Boolean,
        default: false
      }
    },
    created(){
      let typef = this.formType;
      let obj = {};
      if(typef == 'addForm'){
        obj = { addForm : this.formObj};
      }else{
        obj = { formItem : this.formObj};
      }
      this.formItem = obj;
    },
    computed:{
      readonly(){
        if(this.banEndrsmtMarkReadOnly){
          return true;
        }else{
          false;
        }
      }
    }
  }
</script>
