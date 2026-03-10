<template>
	<h-form-item label="是否控制承兑行类型" prop="isControlAcptType" required cols="3">
		<h-select v-model="formItem[formType]['isControlAcptType']" placeholder="" @on-change="changeByAcptTypeAdd()">
			<h-option v-for="item in YonList" :value="item.key" :key="item.key">{{item.value }}</h-option>
		</h-select>
	</h-form-item>
</template>
<script>
	export default {
		name : "isControlAcptType",
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
			 changeByAcptTypeAdd () {
				this.$emit('changeByAcptTypeAdd','')
			}
		}
	}
</script>