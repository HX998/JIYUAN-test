<template>
	<h-form-item label="是否控制利率" prop="isRateControl" :required="required" class="h-form-three" >
		<h-select v-model="formItem[formType]['isRateControl']" placeholder="" @on-change="changeByRateControl()">
		  <h-option v-for="item in YonList" :value="item.key" :key="item.key">{{item.value }}</h-option>
		</h-select>
	</h-form-item>
</template>	
<script>
	export default {
		name : "isRateControl",
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
		methods:{
			 changeByRateControl () {
				this.$emit('changeByRateControlAdd','')
			}
		}
	}
</script>