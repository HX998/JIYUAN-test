<template>
  <div>
    <hr/>
    <div><span>{{$t("m.i.ce.batchInfo")}}</span></div>
    <div>
      <h-form :model="addForm" :label-width="115" ref="addForm" cols="4" class="h-form-search">
        <h-form-item :label="$t('m.i.billInfo.acptProtocalNo')" prop="acptProtocalNo">
          <h-input v-model="addForm.acptProtocalNo"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.ce.acptType')" prop="acptType">
          <h-select v-model="addForm.acptType" :placeholder="$t('m.i.common.pleaseSelect')" showTitle>
            <h-option value="1">本行签发</h-option>
            <h-option value="2">他行代我行签发</h-option>
            <h-option value="3">我行代他行签发</h-option>
            <h-option value="4">行内新开机构代理签发</h-option>
            <h-option value="5">普通行内代理签发</h-option>
          </h-select>
        </h-form-item>
        <h-form-item :label="$t('m.i.billInfo.drwrCustNo')" prop="drwrCustNo">
          <h-input v-model="addForm.drwrCustNo"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.billInfo.drwrAcctNo')" prop="drwrAcctNo">
          <h-input v-model="addForm.drwrAcctNo"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.billInfo.drwrName')" prop="drwrName">
          <h-input v-model="addForm.drwrName"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.billInfo.drweBankNo')" prop="drweBankNo">
          <h-input v-model="addForm.drweBankNo"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.billInfo.drweBankName')" prop="drweBankName">
          <h-input v-model="addForm.drweBankName"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.billInfo.acptAcctNo')" prop="acptAcctNo">
          <h-input v-model="addForm.acptAcctNo"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.billInfo.acptName')" prop="acptName">
          <h-input v-model="addForm.acptName"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.billInfo.acptBankNo')" prop="acptBankNo">
          <h-input v-model="addForm.acptBankNo"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.billInfo.remitDt')" prop="remitDt">
          <h-date-picker type="date" v-model="addForm.remitDt" placeholder=""></h-date-picker>
        </h-form-item>
        <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="dueDt">
          <h-date-picker type="date" v-model="addForm.dueDt" placeholder=""></h-date-picker>
        </h-form-item>
        <h-form-item :label="$t('m.i.ce.guarntrType')" prop="guarntrType">
        <h-select v-model="addForm.guarntrType" placeholder="请选择" showTitle>
        <h-option value=""></h-option>
        <h-option value=""></h-option>
        </h-select>
        </h-form-item>
        <h-form-item :label="$t('m.i.ce.busiBrchNo')" prop="busiBrchNo">
          <h-input v-model="addForm.busiBrchNo"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.common.accountBrchNo')" prop="accountBrchNo">
          <h-input v-model="addForm.accountBrchNo"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.common.operBrchNo')" prop="operBrchNo">
          <h-input v-model="addForm.operBrchNo"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.common.custMgrNo')" prop="custMgrNo">
          <h-input v-model="addForm.custMgrNo"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.common.custMgrName')" prop="custMgrName">
          <h-input v-model="addForm.custMgrName"></h-input>
        </h-form-item>
        <div>
          <hr/>
          <span>{{$t('m.i.ce.particulars')}}</span>
        </div>
        <h-form-item :label="$t('m.i.ce.promNoteNo')" prop="promNoteNo">
          <h-input v-model="addForm.reqInfoList.promNoteNo"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
          <h-select v-model="addForm.reqInfoList.billType" placeholder="请选择">
            <h-option value="AC01">银票</h-option>
            <h-option value="AC02">商票</h-option>
          </h-select>
        </h-form-item>
        <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass">
          <h-select v-model="addForm.reqInfoList.billClass" placeholder="请选择">
            <h-option value="ME01">纸票</h-option>
            <h-option value="ME02">电票</h-option>
          </h-select>
        </h-form-item>
        <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="dueDt">
          <h-date-picker type="date" v-model="addForm.reqInfoList.dueDt" placeholder=""></h-date-picker>
        </h-form-item>
        <h-form-item :label="$t('m.i.billInfo.remitDt')" prop="remitDt">
          <h-date-picker type="date" v-model="addForm.reqInfoList.remitDt" placeholder=""></h-date-picker>
        </h-form-item>
        <h-form-item :label="$t('m.i.billInfo.drwrAcctNo')" prop="drwrAcctNo">
          <h-input v-model="addForm.reqInfoList.drwrAcctNo"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.billInfo.drwrName')" prop="drwrName">
          <h-input v-model="addForm.reqInfoList.drwrName"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.billInfo.drwrBankNo')" prop="drwrBankNo">
          <h-input v-model="addForm.reqInfoList.drwrBankNo"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.billInfo.drweBankNo')" prop="drweBankNo">
          <h-input v-model="addForm.reqInfoList.drweBankNo"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.billInfo.drweBankName')" prop="drweBankName">
          <h-input v-model="addForm.reqInfoList.drweBankName"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.billInfo.billMoneyByUnit')" prop="billMoney">
          <h-input v-model="addForm.reqInfoList.billMoney"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.billInfo.pyeeAcctNo')" prop="pyeeAcctNo">
          <h-input v-model="addForm.reqInfoList.pyeeAcctNo"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.billInfo.pyeeName')" prop="pyeeName">
          <h-input v-model="addForm.reqInfoList.pyeeName"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.billInfo.pyeeBankNo')" prop="pyeeBankNo">
          <h-input v-model="addForm.reqInfoList.pyeeBankNo"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.billInfo.acptAcctNo')" prop="acptAcctNo">
          <h-input v-model="addForm.reqInfoList.acptAcctNo"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.billInfo.acptName')" prop="acptName">
          <h-input v-model="addForm.reqInfoList.acptName"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.billInfo.acptBankNo')" prop="acptBankNo">
          <h-input v-model="addForm.reqInfoList.acptBankNo"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.billInfo.banEndrsmtMark')" prop="banEndrsmtMark">
          <h-select v-model="addForm.reqInfoList.banEndrsmtMark" placeholder="请选择">
            <h-option value="EM00">可转让</h-option>
            <h-option value="EM01">不得转让</h-option>
          </h-select>
        </h-form-item>
      </h-form>
    </div>
    <div slot="footer">
      <h-button type="primary" @click="formAdd()">{{$t("m.i.common.submit")}}</h-button>
    </div>
  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "addBillTest",
    data() {
      let options = {};
      options.addForm = {
        acptProtocalNo: '',
        acptType: '',
        drwrCustNo: '',
        drwrAcctNo: '',
        drwrName: '',
        drweBankNo: '',
        drweBankName: '',
        acptAcctNo: '',
        acptName: '',
        acptBankNo: '',
        remitDt: '',
        dueDt: '',
        guarntrType: '',
        busiBrchNo: '',
        accountBrchNo: '',
        operBrchNo: '',
        custMgrNo: '',
        custMgrName: '',
        reqInfoList: [
          {
            promNoteNo: '',
            billType: '',
            billClass: '',
            dueDt: '',
            remitDt: '',
            drwrAcctNo: '',
            drwrName: '',
            drwrBankNo: '',
            drweBankName: '',
            billMoney: '',
            pyeeAcctNo: '',
            pyeeName: '',
            pyeeBankNo: '',
            acptAcctNo: '',
            acptName: '',
            acptBankNo: '',
            banEndrsmtMark: ''
          }
        ]
    };
      return options;
    },
    methods: {
      formAdd() {
        post(this.addForm, "/ce/channel/credit/requestCredit0001").then(res => {
          if(res) {
            let msg = res.data.retMsg
            let retCode = res.data.retCode
            if (retCode == "000000") {
              this.$msgTip.success(this);
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      }
    }
  };
</script>

<style scoped>

</style>
