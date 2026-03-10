<template>
  <div>
     <h-form-item :label="$t('m.i.shcpe.authList')" prop="authList" :validRules="authListRule" :required="required" class="h-form-height-auto h-form-long-label">
       <h-input v-model="formItem['authList']" placeholder="" type="textarea" :canResize="false" :maxlength="maxlength" :rows="rows" :readonly="readonly"></h-input>
     </h-form-item>
     <h-form-item>注：使用逗号分隔</h-form-item>
  </div>
</template>

<script>
	export default {
		name : "shcpeAuthList",
		data() {
			return {
        authListRule: [{ test: /^([0-9a-zA-Z]|,){0,4000}$/, trigger: "blur", message: "权限详情不能超过4000位，由字母、数字和半角逗号组成" }]
			}
		},
		props:{
			formItem : Object || {},
      required :{
        type: Boolean,
        default: false
      },
      readonly: {
        type: Boolean,
        default: false
      },
      maxlength: {
			  type: Number,
        default: 4000
      },
      rows: {
        type: Number,
        default: 8
      }
		}
	}
</script>
