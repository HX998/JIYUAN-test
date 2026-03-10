<template>
	<h-form-item label="最小年利率(%)" prop="minRatePct" :required="rateControlRequiredAdd" class="h-form-three" :validRules="minRateRule" >
		<h-input v-model="formItem[formType]['minRatePct']" placeholder="利率范围0~100" :readonly="!rateControlRequiredAdd" ></h-input>
	</h-form-item>
</template>
<script>
	export default {
		name : "minRatePct",
		data() {
			return {
				formItem:{},
				minRateRule:[{test: /^(((\d|[1-9]\d)(\.\d{1,4})?)|100|100\.0|100\.00|100\.000|100\.0000)$/, trigger:'blur', message: '利率为0~100之间的数，小数位不超过4位'}]
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
			controlRequiredAdd:{type: Boolean,
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
			rateControlRequiredAdd(){
				if(this.controlRequiredAdd){
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
