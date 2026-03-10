<template>
  <div class="space">
    <div ref="head">
      <div class="h-t_date">
        <em>显示日期:</em>
        <span>{{ this.$moment(new Date()).format("YYYY-MM-DD") }}</span>
      </div>
      <h2 class="h-ticket-title" v-if="billInfo.billType === 'AC01'">纸质银行承兑汇票</h2>
      <h2 class="h-ticket-title" v-else>纸质商业承兑汇票</h2>
    </div>
    <div class="h-ticket-table" ref="body">
      <table>
        <colgroup>
          <col width="7%">
          <col width="10%">
          <col width="33%">
          <col width="7%">
          <col width="10%">
          <col width="33%">
        </colgroup>
        <tr>
          <td colspan="2" class="th">票据种类</td>
          <td>{{format("DraftTypeCode", billInfo.billType)}}</td>
          <td colspan="2" class="th">票据号码</td>
          <td>{{billInfo.billNo}}</td>
        </tr>
        <tr>
          <td colspan="2" class="th">票据金额</td>
          <td>{{formatAmt(billInfo.billMoney)}}</td>
          <td colspan="2" class="th">汇票到期日</td>
          <td>{{formatDate(billInfo.dueDt)}}</td>
        </tr>
        <tr>
          <td colspan="2" class="th">承兑人全称</td>
          <td>{{billInfo.acptName}}</td>
          <td colspan="2" class="th">承兑人开户行行号</td>
          <td>{{billInfo.acptBankNo}}</td>
        </tr>
        <tr>
          <td colspan="2" class="th">承兑人开户行行名</td>
          <td>{{billInfo.acptBankName}}</td>
          <td colspan="2" class="th">出票人全称</td>
          <td>{{billInfo.drwrName}}</td>
        </tr>
        <tr>
          <td colspan="2" class="th">出票人账号</td>
          <td>{{billInfo.drwrAcctNo}}</td>
          <td colspan="2" class="th">出票人开户行行号</td>
          <td>{{billInfo.drwrBankNo}}</td>
        </tr>
        <tr>
          <td colspan="2" class="th">出票人开户行行名</td>
          <td>{{billInfo.drwrBankName}}</td>
          <td colspan="2" class="th">收款人全称</td>
          <td>{{billInfo.pyeeName}}</td>
        </tr>
        <tr>
          <td colspan="2" class="th">收款人账号</td>
          <td>{{billInfo.pyeeAcctNo}}</td>
          <td colspan="2" class="th">收款人开户行行号</td>
          <td>{{billInfo.pyeeBankNo}}</td>
        </tr>
        <tr>
          <td colspan="2" class="th">收款人开户行行名</td>
          <td>{{billInfo.pyeeBankName}}</td>
          <td colspan="2" class="th">贴现日期</td>
          <td>{{formatDate(billInfo.rgstDt)}}</td>
        </tr>
        <tr>
          <td colspan="2" class="th">贴现利率</td>
          <td>{{formatRate(billInfo.discInterestRate)}}(%)</td>
          <td colspan="2" class="th">贴出人名称</td>
          <td>{{billInfo.transFromName}}</td>
        </tr>
        <tr>
          <td colspan="2" class="th">贴出人账号</td>
          <td>{{billInfo.transFromAcctNo}}</td>
          <td colspan="2" class="th">贴出人开户行行号</td>
          <td>{{billInfo.transFromBankNo}}</td>
        </tr>
        <tr>
          <td colspan="2" class="th">贴出人统一社会信用代码</td>
          <td>{{billInfo.transFromSocCode}}</td>
          <td colspan="2" class="th">贴出人行业分类</td>
          <td>{{format("Industry", billInfo.transFromIndustry)}}</td>
        </tr>
        <tr>
          <td colspan="2" class="th">贴出人企业规模</td>
          <td>{{format("CorpScale", billInfo.transFromCorpScale)}}</td>
          <td colspan="2" class="th">贴出人是否涉农企业</td>
          <td>{{format("Yon", billInfo.isTransFromArc)}}</td>
        </tr>
        <tr>
          <td colspan="2" class="th">贴出人地区</td>
          <td>{{format("Province", billInfo.transFromArea)}}</td>
          <td colspan="2" class="th">贴出人是否绿色企业</td>
          <td>{{format("Yon", billInfo.isTransFromGrn)}}</td>
        </tr>
        <tr>
          <td colspan="2" class="th">贴现行行号</td>
          <td>{{billInfo.transToBankNo}}</td>
          <td colspan="2" class="th">贴现行行名</td>
          <td>{{billInfo.transToBankName}}</td>
        </tr>
        <tr>
          <td colspan="2" class="th">备注</td>
          <td>{{billInfo.rgstRemark}}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
  import {formatNumber,accMul} from "@/api/bizApi/commonUtil";
  export default {
    name: "RI00BillFront",
    props : {
      billInfo:{
        type:Object
      },
      chineseMoney:{
        type:Object
      },
      dictMap: {},
      format4:{
        type:Function
      }
    },
    methods:{
      formatDate(value) {
        return value ? this.$moment(value, "YYYY / MM / DD").format("YYYY / MM / DD") : "";
      },
      format(groupcode, key) {
        if (typeof key === "undefined" || key === null) {
          return "";
        }
        if (this.dictMap.size === 0) {
          return key;
        }
        let status=this.dictMap.get(groupcode).get(key);
        if(status){
          return status;
        }else{
          return key;
        }
      },
      formatAmt(value) {
        return value ? formatNumber(value, 2, ",") : "";
      },
      formatRate(value){
        return value ? accMul(value, 100) : "";
      }
    }
  };
</script>

<style scoped>

</style>
