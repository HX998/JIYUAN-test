<template>
	<h-form-item :label="$t('m.i.billInfo.minBillMoney')" prop="minBillAmt" :required="amtControlRequiredAdd" class="h-form-three">
		<h-typefield v-model="formItem[formType]['minBillAmt']" type="money"  bigTips placeholder="" :readonly="!amtControlRequiredAdd"></h-typefield>
	</h-form-item>
</template>
<script>
	export default {
		name : "minBillAmt",
		data() {
			return {
				formItem:{}
			}
		},
		props:{
			YonList:Array,
			readonly:{
				type : Boolean,
				default: false
			},
			className: String,
			required :{
				type: Boolean,
				default: false
			},
			formObj : Object || {},
			formType:{
				type:String,
				default:'addForm'
			},
			amtControlRequired:{type: Boolean,
				default: true}
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
		computed: {   
			amtControlRequiredAdd(){
				if(this.amtControlRequired){
					return true;
				}else{
					return false;
				}
			}
		},

		methods:{
			
		}
	}
</script>
