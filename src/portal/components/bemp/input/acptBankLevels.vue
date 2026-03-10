<template>
	<h-form-item label="承兑行级别" prop="acptBankLevels" :required="acptBankLevelRequiredAdd" cols="3">
		<h-select v-model="formItem[formType]['acptBankLevels']" placeholder="" multiple :readonly="!acptBankLevelRequiredAdd">
		  <h-option v-for="item in acptBankLevelsList" :value="item.key" :key="item.key">{{item.value }}</h-option>
		</h-select>
	</h-form-item>
</template>
<script>
	export default {
		name : "acptBankLevels",
		data() {
			return {
				formItem:{}
			}
		},
		props:{
			acptBankLevelsList:Array,
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
			levelControlRequired:{type: Boolean,
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
			acptBankLevelRequiredAdd(){
				if(this.levelControlRequired){
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