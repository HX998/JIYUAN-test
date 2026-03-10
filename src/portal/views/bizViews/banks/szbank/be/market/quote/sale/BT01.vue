<template>
  <div class ="out-side">
    <div>
      <h-form-item :label="$t('m.i.be.firstSettleDt')" prop="firstSettleDt" required class="h-form-three">
        <h-date-picker v-model="formItem.firstSettleDt" type="date"  format="yyyy-MM-dd" :showFormat="true"  :options="options1"></h-date-picker>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.tradRate')" prop="ratePct" :required="!(formItem.isTemStorage&&formItem.isTemStorage=='1'&&!formItem.quoteNo)" class="h-form-three" :validRules="ratePctRule">
        <h-input v-model="formItem.ratePct" placeholder="利率范围0~100，且小数位不超过四位" ></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.setTm')" prop="setTm" required class="h-form-three">
        <h-time-picker v-model="formItem.setTm" placement="bottom-end" placeholder="选择时间" ></h-time-picker>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.quoteTm')" prop="quoteTm" required  class="h-form-three h-form-long-label">
        <h-time-picker   v-model="formItem.quoteTm" placement="bottom-end" placeholder="选择时间" ></h-time-picker>
      </h-form-item>
    </div>
    <div>
      <h-form-item :label="$t('m.i.be.prodNo')" prop="prodNo" :required="!(formItem.isTemStorage&&formItem.isTemStorage=='1'&&!formItem.quoteNo)"  class="h-form-three">
        <h-select v-if="formItem.isInner=='1' || formItem.auditNo" v-model="formItem.prodNo" placeholder=""   readonly showTitle>
          <h-option v-for="(value,key) in formItem.productMapDict" v-if="value !== null && value !== ''" :value="key" :key="key" >{{value}}</h-option>
        </h-select>
        <h-select v-else v-model="formItem.prodNo" placeholder="" showTitle >
          <h-option v-for="(value,key) in formItem.productMapDict" v-if="value !== null && value !== ''" :value="key" :key="key" >{{value}}</h-option>
        </h-select>
      </h-form-item>
    </div>
    <div>
      <h-form-item :label="$t('m.i.common.totalAmtBillPackage')" prop="totalAmt"  class="h-form-three">
        <h-typefield v-model="formItem.totalAmt" placeholder="" readonly></h-typefield>
      </h-form-item>
      <h-form-item :label="$t('m.i.common.totalNumBillPackage')" prop="totalNum"  class="h-form-three">
        <h-input v-model="formItem.totalNum" placeholder="" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.firstPayInterest')" prop="firstPayInterest"  class="h-form-three">
        <h-typefield v-model="formItem.firstPayInterest" placeholder="" readonly></h-typefield>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.firstSettleAmt')" prop="firstSettleAmt"  class="h-form-three">
        <h-typefield v-model="formItem.firstSettleAmt" placeholder="" readonly></h-typefield>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.tenorDays')" prop="tenorDays"  class="h-form-three h-form-long-label">
        <h-input v-model="formItem.tenorDays" placeholder="" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.yieldRate')" prop="yieldRatePct"  class="h-form-three">
        <h-input v-model="formItem.yieldRatePct" placeholder="" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.totalInterestDiff')" prop="sumInterestMargin"  class="h-form-three">
        <h-typefield v-model="formItem.sumInterestMargin" placeholder="" readonly></h-typefield>
      </h-form-item>
      <h-form-item :label="$t('m.i.pc.sumWeightRate')" prop="rateAverPct"  class="h-form-three">
        <h-input v-model="formItem.rateAverPct" placeholder="" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.diffMsg')" prop="preChangeInfo"  cols="3" class="h-form-height-auto" style="width:60%">
        <h-input v-model="formItem.preChangeInfo"  placeholder="" type="textarea" readonly :autosize="{minRows: 2, maxRows: 4}"></h-input>
      </h-form-item>
      <h-form-item label="是否同机构" prop="isSendDraft" class="h-form-three" required v-if="formItem.prodNo=='00102001'">
        <h-select v-model="formItem.isSendDraft" placeholder="" showTitle >
          <h-option v-for="item in isSendDraftList" :value="item.key" :key="item.key" >{{item.value}}</h-option>
        </h-select>
      </h-form-item>
      <show-branch v-if="formItem.prodNo=='00102001'&&formItem.isSendDraft=='0'" v-model="formItem.reserve2"  label="行内机构选择"  :msgBoxWin="quoteChangeWin"
                   prop="reserve2" :required="formItem.prodNo=='00102001'&&formItem.isSendDraft=='0'"
                   :params="{cpesBrchCode:this.formItem.saleBrchCode}"
                   url ="/banks/szbank/sm/auth/branch/queryBranchTreeByBrchCode"
                   @brchNoChange="sameBrchNoChange($event)"
                   :showCheckBox="false"     :brchNo.sync="formItem.reserve1" :brchName.sync="formItem.reserve2">
      </show-branch>
    </div>
  </div>
</template>
<script>
  export default {
    name: "BT01",
    data(){
      let _this = this;
      return {
        options1: {
          disabledDate (date) {
            return  _this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD") > date && date.valueOf() ;
          }
        },
        ratePctRule :[{
          test: /^(\d{1,2}(\.\d{1,4})?|100)$/,
          trigger: "blur",
          message: "利率范围0~100，且小数位不超过四位"
        }],
        isSendDraftList:[
          {
            key:'1',
            value:'否'
          },
          {
            key:'0',
            value:'是'
          }
        ]
      }
    },
    props:{
      formItem:{
        type: Object,
        default() {
          return {};
        }
      },
      dictMap:{
        type:Object
      },
      quoteChangeWin:{
        type:Boolean,
        default() {
          return false;
        }
      }
    },
    watch:{
      'formItem.prodNo'(val){
        if (val!=='00102001') {
          this.formItem.isSendDraft='1';// 需要发报文
          this.formItem.reserve2='';
          this.formItem.reserve1=''
        }
      },
      'formItem.isSendDraft'(val){
        if (val==='0') {
          // 同机构时，只允许t+0和全部成交
          this.formItem.clearSpeed='CS00'
          this.formItem.subDeal='0'
        }else {
            this.formItem.reserve2='';
            this.formItem.reserve1=''
        }
      }
    },
    methods:{
      sameBrchNoChange(info){
        if(info.length>0){
          this.$parent.$parent.validateField('reserve2');
        }
      }
    }
  }
</script>

