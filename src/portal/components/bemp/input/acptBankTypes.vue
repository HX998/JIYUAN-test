<template>
	<h-form-item label="承兑行类型" prop="acptBankTypes" :required="acptBankTypeRequiredAdd" cols="3">
		<h-select v-model="formItem[formType]['acptBankTypes']" placeholder="" multiple :readonly="!acptBankTypeRequiredAdd">
			<h-option v-for="item in acptBankTypesList" :value="item.key" :key="item.key">{{item.value }}</h-option>
		</h-select>
	</h-form-item>
</template>
<script>
	export default {
		name : "acptBankTypes",
		data() {
			return {
				formItem:{}
			}
		},
		props:{
			acptBankTypesList:Array,
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
			acptControlRequired:{type: Boolean,
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
			acptBankTypeRequiredAdd(){
				if(this.acptControlRequired){
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