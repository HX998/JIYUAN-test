<template>
	<h-form-item v-if="'money'==option['inputType']" :label="option['labelName']" >
		<h-row>
			<h-col span="11">
			  <h-typefield  v-model="formItem[option['model'][0]]"  integerNum="10" placeholder="" type="money" bigTips ></h-typefield>
			</h-col>
			<h-col span="2" style="text-align: center">至</h-col>
			<h-col span="11">
			  <h-typefield  v-model="formItem[option['model'][1]]"  integerNum="10" placeholder="" type="money" bigTips ></h-typefield>
			</h-col>
		</h-row>
	</h-form-item>
	<h-form-item v-else :label="option['labelName']" :prop="option['model']">
		<h-select v-if="'select'==option['inputType']" v-model="formItem[option['model']]" placeholder="" :clearable="false">
			<h-option v-for="item in dictMap" :value="item.key" :key="item.key">{{ item.value }}</h-option>
		</h-select>
		<h-input v-else-if="'input'==option['inputType']" v-model="formItem[option['model']]">{{}}</h-input>
		<h-date-picker v-else-if="'date'==option['inputType']" type="daterange" v-model="formItem[option['model']]" format="yyyy-MM-dd" showFormat ></h-date-picker>
	</h-form-item>	
</template>

<script>
	export default {
		name : "bInput",
		data() {
			return {
				
			}
		},
		props:{
			// option 为输入域的整个配置项
			option:Object || {},
			formItem : Object || {},
			dictMap : Array
		}
	}
</script>