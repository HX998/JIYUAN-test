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
          <td colspan="2" class="th">票据号码</td>
          <td>{{billInfo.billNo}}</td>
          <td colspan="2" class="th">票据种类</td>
          <td>{{format("DraftTypeCode", billInfo.billType)}}</td>
        </tr>
        <tr>
          <td colspan="2" class="th">票据金额</td>
          <td>{{formatAmt(billInfo.billMoney)}}</td>
          <td colspan="2" class="th">汇票到期日</td>
          <td>{{formatDate(billInfo.dueDt)}}</td>
        </tr>
        <tr>
          <td colspan="2" class="th">出票人全称</td>
          <td>{{billInfo.drwrName}}</td>
          <td colspan="2" class="th">出票人账号</td>
          <td>{{billInfo.drwrAcctNo}}</td>
        </tr>
        <tr>
          <td colspan="2" class="th">付款行行号</td>
          <td>{{billInfo.acptBankNo}}</td>
          <td colspan="2" class="th">承兑人开户行行号</td>
          <td>{{billInfo.acptBankName}}</td>
        </tr>
        <tr>
          <td colspan="2" class="th">止付申请人名称</td>
          <td>{{billInfo.transFromName}}</td>
          <td colspan="2" class="th">止付日期</td>
          <td>{{formatDate(billInfo.rgstDt)}}</td>
        </tr>
        <tr>
          <td colspan="2" class="th">止付申请人账号</td>
          <td>{{billInfo.transFromAcctNo}}</td>
          <td colspan="2" class="th">止付人开户行行号</td>
          <td>{{billInfo.transFromBankNo}}</td>
        </tr>
        <tr>
          <td colspan="2" class="th">止付类型</td>
          <td>{{format("SspdType", billInfo.paperRgstType)}}</td>
          <td colspan="2" class="th">止付申请人社会信用代码</td>
          <td>{{billInfo.transFromSocCode}}</td>
        </tr>
        <tr>
          <td colspan="2" class="th">止付原因</td>
          <td>{{billInfo.sspdReason}}</td>
          <td colspan="2" class="th">备注</td>
          <td>{{billInfo.rgstRemark}}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
  import {formatNumber} from "@/api/bizApi/commonUtil";
  export default {
    name: "RI07BillFront",
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
    }
  };
</script>

<style scoped>

</style>
