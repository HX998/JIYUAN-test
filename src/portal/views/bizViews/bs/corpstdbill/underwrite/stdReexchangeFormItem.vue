<!--承销管理-退汇申请-投资人信息维护-->
<template>
  <h-msg-box v-model="tempStdReexchangeFormItemWin" :maximize="true" :mask-closable="false" @on-close="stdReexchangeFormItemWinClose"
             width="1200" class="h-form-search-layer" top="10" >
    <p slot="header">
      <span >投资人信息维护</span>
    </p>
    <div>
      <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="3" class="h-form-search">
        <!--批次号-->
        <common-input v-model="addOrEditForm.batchNo" :label="$t('m.i.common.batchNo')" prop="batchNo" readonly></common-input>
        <!--基础资产种类-->
        <common-select v-model="addOrEditForm.baseAssetType" :label="$t('m.i.bs.baseAssetType')" prop="baseAssetType"
                       :dictList="batchParams.baseAssetTypeList"  readonly></common-select>
        <!--标票产品名称-->
        <common-input v-model="addOrEditForm.stdProductName" :label="$t('m.i.bs.stdProductName')" prop="stdProductName" readonly></common-input>
        <!--标票产品简称-->
        <common-input v-model="addOrEditForm.stdProductShortName" :label="$t('m.i.bs.stdProductShortName')" prop="stdProductShortName" readonly></common-input>
        <!--标票产品代码-->
        <common-input v-model="addOrEditForm.stdProductNo" :label="$t('m.i.bs.stdProductNo')" prop="stdProductNo" readonly></common-input>
        <!--产品规模(元)-->
        <common-type-field v-model="addOrEditForm.creationAmt" :label="$t('m.i.bs.creationAmt')" prop="creationAmt" readonly></common-type-field>
        <!--产品期限(天)-->
        <common-input v-model="addOrEditForm.creationTerm" :label="$t('m.i.bs.creationTerm')" prop="creationTerm" readonly ></common-input>
        <!--"融资利率(%)-->
        <common-rate v-model="addOrEditForm.financeRatePct" :label="$t('m.i.bs.financeRatePct')" prop="financeRatePct" readonly></common-rate>
        <!--收款总额(元)-->
        <common-type-field v-model="addOrEditForm.totalCollectAmt" :label="$t('m.i.bs.totalCollectAmt')" prop="totalCollectAmt" readonly></common-type-field>
        <!--投资人信息录入-->
        <h-form-item :label="$t('m.i.bs.stdReexchangeInfoAdd')" prop="stdReexchangeInfo">
          <h-button type="ghost" @click="addStdReexchangeInfo(custInfo, $event)">{{$t('m.i.common.add')}}</h-button>
        </h-form-item>
        <div class="h-form-model-set">
          <common-input class="no-label h-model-col5" value="客户账号" readonly></common-input>
          <common-input class="no-label h-model-col5" value="客户名称" readonly></common-input>
          <common-input class="no-label h-model-col5" value="客户开户行行号" readonly></common-input>
          <common-input class="no-label h-model-col5" value="客户开户行行名" readonly></common-input>
          <common-input class="no-label h-model-col5" value="退汇金额(元)" readonly></common-input>
        </div>
        <div class="h-form-model-set" v-for="(item,index) in addOrEditForm.list" :key="index">
          <common-input v-model="item.custAcctNo" class="no-label h-model-col5" prop="list" placeholder="客户账号" :maxlength="32"></common-input>
          <common-input v-model="item.custName" class="no-label h-model-col5" prop="list" placeholder="客户名称" :maxlength="255"></common-input>
          <common-input v-model="item.custBankNo" class="no-label h-model-col5" prop="list" placeholder="客户开户行行号" :maxlength="12"></common-input>
          <common-input v-model="item.custBankName" class="no-label h-model-col5" prop="list" placeholder="客户开户行行名" :maxlength="255"></common-input>
          <common-type-field v-model="item.reexchangeAmt" class="no-label h-model-col5" prop="list" placeholder="退汇金额(元)" :integerNum="16" :suffixNum="2" :bigTips="false"></common-type-field>
          <button type="button" class="h-form-delete" @click="deleteStdReexchangeInfo(index)"><i class="icon iconfont icon-trash"></i></button>
        </div>
      </h-form>
    </div>
    <div slot="footer">
      <h-button type="ghost" @click="stdReexchangeFormItemWinClose()" >{{$t('m.i.common.close')}}</h-button>
      <h-button type="primary" @click="save()"  >{{$t('m.i.common.save')}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
  import { post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "stdReexchangeFormItem",
    components: {
    },
    data() {
      return {
        batchId: "",
        custInfo: {
          custAcctNo: "",
          custName:"",
          custBankNo:"",
          custBankName:"",
          reexchangeAmt: ""
        },
        addOrEditForm: {
          id:"",
          legalNo:"",
          memberId:"",
          batchNo:"",
          baseAssetType:"",
          stdProductName:"",
          stdProductShortName:"",
          stdProductNo:"",
          creationAmt:"",
          creationTerm:"",
          purchaseResult:"",
          financeRatePct:"",
          totalCollectAmt:"",
          //退汇信息
          list: []
        },
        memberId: JSON.parse(window.sessionStorage.getItem('userInfo')).memberId,
        legalNo: JSON.parse(window.sessionStorage.getItem('userInfo')).legalNo
      };
    },
    props: {
      stdReexchangeFormItemWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      batchParams: {
        type: Object,
        default() {
          return false;
        }
      }
    },
    computed: {
      tempStdReexchangeFormItemWin: {
        get() {
          return this.stdReexchangeFormItemWin;
        },
        set() {
        }
      }
    },
    watch: {
      stdReexchangeFormItemWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.batchId = this.batchParams.batchId;
            this.queryObjById();
          });
        }
      },
      batchId(val) {
        this.batchId = val;
      }
    },
    methods: {
      //根据批次Id查询批次信息
      queryObjById() {
        let params = { creationId: this.batchId };
        let url = "/bs/corpstdbill/underwrite/stdCreationReexchangeReg/func_queryStdCreationReexchangeDtoBycreationId";
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.addOrEditForm.id = obj.id;
              this.addOrEditForm.legalNo = obj.legalNo;
              this.addOrEditForm.memberId = obj.memberId;
              this.addOrEditForm.batchNo = obj.batchNo;
              this.addOrEditForm.baseAssetType = obj.baseAssetType;
              this.addOrEditForm.stdProductName = obj.stdProductName;
              this.addOrEditForm.stdProductShortName = obj.stdProductShortName;
              this.addOrEditForm.stdProductNo = obj.stdProductNo;
              this.addOrEditForm.creationAmt = obj.creationAmt === null ? "" : formatNumber(obj.creationAmt, 2, ",");
              this.addOrEditForm.creationTerm = obj.creationTerm;
              this.addOrEditForm.financeRatePct = obj.financeRatePct;
              this.addOrEditForm.totalCollectAmt = obj.totalCollectAmt === null ? "" : formatNumber(obj.totalCollectAmt, 2, ",");
              this.addOrEditForm.list = [];
              if (res.data.retData.list !== null && res.data.retData.list.length > 0) {
                for (let i = 0, j = res.data.retData.list.length - 1; i < res.data.retData.list.length, j >= 0; i++, j--) {
                  let custInfo = {
                    custAcctNo: res.data.retData.list[j].custAcctNo,
                    custName: res.data.retData.list[j].custName,
                    custBankNo: res.data.retData.list[j].custBankNo,
                    custBankName: res.data.retData.list[j].custBankName,
                    reexchangeAmt: res.data.retData.list[j].reexchangeAmt
                  }
                  this.addStdReexchangeInfo(custInfo);
                }
              } else {
                this.addStdReexchangeInfo(this.custInfo);
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //关闭弹窗
      stdReexchangeFormItemWinClose() {
        this.$refs.addOrEditForm.resetFields();
        this.addOrEditForm.id = "";
        this.batchId="";
        this.addOrEditForm.list = [];
        this.$emit("stdReexchangeFormItemWinClose", "");
      },
      //提交信息
      save() {
        this.$refs["addOrEditForm"].validate(valid => {
          let addOrEditForm = this.addOrEditForm;
          if (valid) {
            //退汇信息
            if(this.addOrEditForm.list == null || this.addOrEditForm.list.length == 0){
              this.$msgTip.error(this, { info: "投资人信息为空"});
              return;
            }
            for (let i = 0; i < this.addOrEditForm.list.length; i++) {
              this.addOrEditForm.list[i].legalNo = this.legalNo;
              this.addOrEditForm.list[i].memberId = this.memberId;
              let validAcctNo = /^[0-9a-zA-Z]{1,32}$/;
              let validBankNo = /^[0-9]{12}$/;
              let validReexchangeAmt = /^(?:[1-9]\d{0,15}|0)(?:\.\d{1,2})?$/;
              if(this.addOrEditForm.list[i].custAcctNo== null || this.addOrEditForm.list[i].custAcctNo== ""){
                this.$msgTip.error(this, { info: "第"+ (i+1) +"行[客户账号]为空"});
                return;
              }else if(!validAcctNo.test(this.addOrEditForm.list[i].custAcctNo)){
                this.$msgTip.error(this, { info: "第"+ (i+1) +"行[客户账号]输入非法，只能输入数字和字母，且长度最大为32位"});
                return;
              }
              if(this.addOrEditForm.list[i].custName== null || this.addOrEditForm.list[i].custName== ""){
                this.$msgTip.error(this, { info: "第"+ (i+1) +"行[客户名称]为空"});
                return;
              }
              if(this.addOrEditForm.list[i].custBankNo== null || this.addOrEditForm.list[i].custBankNo== ""){
                this.$msgTip.error(this, { info: "第"+ (i+1) +"行[客户开户行行号]为空"});
                return;
              }else if(!validBankNo.test(this.addOrEditForm.list[i].custBankNo)){
                this.$msgTip.error(this, { info: "第"+ (i+1) +"行[客户开户行行号]输入非法，只能输入12位数字"});
                return;
              }
              if(this.addOrEditForm.list[i].custBankName== null || this.addOrEditForm.list[i].custBankName== ""){
                this.$msgTip.error(this, { info: "第"+ (i+1) +"行[客户开户行行名]为空"});
                return;
              }
              if(this.addOrEditForm.list[i].reexchangeAmt== null || this.addOrEditForm.list[i].reexchangeAmt== ""){
                this.$msgTip.error(this, { info: "第"+ (i+1) +"行[退汇金额]为空"});
                return;
              }else if(!validReexchangeAmt.test(this.addOrEditForm.list[i].reexchangeAmt)){
                this.$msgTip.error(this, { info: "第"+ (i+1) +"行[退汇金额]输入非法，只能输入大于0的数字，最多16位整数且小数位不超过两位"});
                return;
              }else if(this.addOrEditForm.list[i].reexchangeAmt <= 0){
                this.$msgTip.error(this, { info: "第"+ (i+1) +"行[退汇金额]输入非法，只能输入大于0的数字，最多16位整数且小数位不超过两位"});
                return;
              }
            }
            let url = "/bs/corpstdbill/underwrite/stdCreationReexchangeReg/func_saveStdCreationReexchangeDto";
            this.sendPost(this.addOrEditForm, url);
          }
        })
      },
      //提交请求
      sendPost(params, url) {
        post(params, url).then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.stdReexchangeFormItemWinClose();
            }else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      // 新增退汇信息
      addStdReexchangeInfo(custInfo) {
        this.addOrEditForm.list.push(this.deepClone(custInfo));
      },
      // 删除退汇信息
      deleteStdReexchangeInfo(index) {
        this.addOrEditForm.list.splice(index, 1);
      },
    }
  };
</script>

<style scoped>

</style>
