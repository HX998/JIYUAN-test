<!--票据号码-->
<template>
  <h-form-item :label="label" :prop="prop" :required="required" :validRules="validRules">
    <h-input v-model="itemValue" :icon="showIcon ? 'android-search' : ''" :title="itemValue" :readonly="readonly"
             :placeholder="placeholder" @on-click="onClick()" @on-change="onChange" :clearable="clearable"
             @on-clear="clearVal(clearValTag)" :maxlength="maxlength" type="int"></h-input>
  </h-form-item>
</template>

<script>
	export default {
		name : "billNo",
    props: {
		  billClass: {//票据介质，ME01-纸票、ME02-电票
        type: String,
        default: ""
      },
      billType: {//票据种类，AC01-银票、AC02-商票
        type: String,
        default: ""
      },
      validRules: {//根据票据介质和票据种类，控制票号校验规则
        type: [Array, String],
        default() {
          let billNoRule = null;
          if(this.billClass.toString() === "ME01") {
            if(this.billType.toString() === "AC01") {
              billNoRule = [{ test: /^[0-9]{3}0[0-9]{2}[5][0-9]{9}$/, trigger: "blur", message: "银票号码为16位数字,第四位为0,第七位为5" }]
            } else if(this.billType.toString() === "AC02") {
              billNoRule = [{ test: /^[0-9]{3}0[0-9]{2}[6][0-9]{9}$/, trigger: "blur", message: "商票号码为16位数字,第四位为0,第七位为6" }]
            }
          } else {
            billNoRule = [{ test: /^\d{0,30}$/, trigger: "blur", message: "请输入不超过30位的数字" }];
          }
          return billNoRule;
        }
      },
      label: {
        type: String,
        default() {
          return this.$t('m.i.billInfo.billNo')
        }
      },
      prop: {
        type: String,
        default: "billNo"
      },
      required: {
        type: Boolean,
        default: false
      },
      value: {
        type: [String, Number],
        default: ""
      },
      placeholder: {
        type: String,
        default: ""
      },
      showIcon: {
        type: Boolean,
        default: false
      },
      readonly: {
        type: Boolean,
        default: false
      },
      clearable: {
        type: Boolean,
        default: false
      },
      clearVal: {
        type: Function,
        default() {
          return "";
        }
      },
      clearValTag: {
        type: String,
        default: ""
      },
      maxlength: {
        type: Number,
        default() {
          return this.billClass.toString() === "ME01" ? 16 : 30;
        }
      }
    },
    computed: {
      itemValue: {
        get(){
          return this.value;
        },
        set(val){
          this.$emit('input', val);
        }
      }
    },
    methods: {
      onClick() {
        this.$emit("on-click", "");
      },
      onChange(event){
        this.$emit("on-change", event);
      }
    }
	}
</script>
