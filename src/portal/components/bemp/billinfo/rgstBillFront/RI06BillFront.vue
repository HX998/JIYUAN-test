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
          <td colspan="2" class="th">付款行行号</td>
          <td>{{billInfo.acptBankNo}}</td>
          <td colspan="2" class="th">结清类型</td>
          <td>{{formatPaperRgstType(billInfo.paperRgstType)}}</td>
        </tr>
        <tr>
          <td colspan="2" class="th">付款日期</td>
          <td>{{formatDate(billInfo.rgstDt)}}</td>
          <td colspan="2" class="th">持票人名称</td>
          <td>{{billInfo.transFromName}}</td>
        </tr>
        <tr>
          <td colspan="2" class="th">持票人账号</td>
          <td>{{billInfo.transFromAcctNo}}</td>
          <td colspan="2" class="th">持票人开户行行号</td>
          <td>{{billInfo.transFromBankNo}}</td>
        </tr>
        <tr>
          <td colspan="2" class="th">持票人统一社会信用代码</td>
          <td>{{billInfo.transFromSocCode}}</td>
          <td colspan="2" class="th">提示付款行行号</td>
          <td>{{billInfo.transToBankNo}}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
  import {formatNumber} from "@/api/bizApi/commonUtil";
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
      formatPaperRgstType(value){
        if(value === "1"){
          return "未贴现票据托收结清";
        }else if(value === "2"){
          return "未贴现票据追索结清";
        }else if(value === "3"){
          return "其它";
        }
        return "";
      }
    }
  };
</script>

<style scoped>

</style>
