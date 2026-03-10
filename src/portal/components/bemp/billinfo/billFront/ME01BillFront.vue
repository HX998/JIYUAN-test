<template>
  <div class="space">
    <div ref="head">
      <div class="h-t_date">
        <em>显示日期:</em>
        <span>{{ this.$moment(new Date()).format("YYYY-MM-DD") }}</span>
      </div>
      <h2 class="h-ticket-title" v-if="billInfo.billType === 'AC01'">纸质银行承兑汇票</h2>
      <h2 class="h-ticket-title" v-else>纸质商业承兑汇票</h2>
      <div class="h-ticket-info clearfix">
        <ul>
          <li>
            <em></em>
            <span></span>
          </li>
          <li v-if="billInfo.inOutFlag == 2">
            <em>票 据 状 态：</em>
            <span>{{ formatBillStatus(billInfo)}}-{{ formatCirStatus(billInfo)}}</span>
          </li>
        </ul>
      </div>
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
          <td colspan="2" class="th">出票日期</td>
          <td>{{formatDate(billInfo.remitDt)}}</td>
          <td colspan="2" class="th">票据号码</td>
          <td>{{billInfo.billNo}}</td>
        </tr>
        <tr>
          <td rowspan="3" class="th tac" v-if="billInfo.billType === 'AC01'">出票人</td>
          <td rowspan="3" class="th tac" v-else>付款人</td>
          <td class="th">全称</td>
          <td>{{billInfo.drwrName}}</td>
          <td rowspan="3" class="th tac">收款人</td>
          <td class="th">全称</td>
          <td>{{billInfo.pyeeName}}</td>
        </tr>
        <tr>
          <td class="th">账号</td>
          <td>{{billInfo.drwrAcctNo}}</td>
          <td class="th">账号</td>
          <td>{{billInfo.pyeeAcctNo}}</td>
        </tr>
        <tr>
          <td class="th" v-if="billInfo.billType === 'AC01'">付款行全称</td>
          <td class="th" v-else>开户银行</td>
          <td>{{billInfo.drweBankName}}</td>
          <td class="th">开户银行</td>
          <td>{{billInfo.pyeeBankName}}</td>
        </tr>
        <tr>
          <td colspan="2" class="th">票据金额</td>
          <td colspan="3">
            <h-row>
              <h-col span="3">
                <span>人民币</span><br />
                <span>(大写)</span>
              </h-col>
              <h-col span="21" class="h-bigMoney-num">
                {{chineseMoney.bigMoney}}
              </h-col>
            </h-row>
          </td>
          <td class="h-money-cell">
            <div class="h-money-unit">
              <em>十</em>
              <em>亿</em>
              <em>千</em>
              <em>百</em>
              <em>十</em>
              <em>万</em>
              <em>千</em>
              <em>百</em>
              <em>十</em>
              <em>元</em>
              <em>角</em>
              <em class="h-last">分</em>
            </div>
            <div class="h-money-num">
              <span>{{chineseMoney.smallMoney ? chineseMoney.smallMoney[11] : ''}}</span>
              <span>{{chineseMoney.smallMoney ? chineseMoney.smallMoney[10] : ''}}</span>
              <span>{{chineseMoney.smallMoney ? chineseMoney.smallMoney[9] : '' }}</span>
              <span>{{chineseMoney.smallMoney ? chineseMoney.smallMoney[8] : '' }}</span>
              <span>{{chineseMoney.smallMoney ? chineseMoney.smallMoney[7] : '' }}</span>
              <span>{{chineseMoney.smallMoney ? chineseMoney.smallMoney[6] : '' }}</span>
              <span>{{chineseMoney.smallMoney ? chineseMoney.smallMoney[5] : '' }}</span>
              <span>{{chineseMoney.smallMoney ? chineseMoney.smallMoney[4] : '' }}</span>
              <span>{{chineseMoney.smallMoney ? chineseMoney.smallMoney[3] : '' }}</span>
              <span>{{chineseMoney.smallMoney ? chineseMoney.smallMoney[2] : '' }}</span>
              <span>{{chineseMoney.smallMoney ? chineseMoney.smallMoney[1] : '' }}</span>
              <span class="h-last">{{chineseMoney.smallMoney ? chineseMoney.smallMoney[0] : '' }}</span>
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="2" class="th">汇票到期日</td>
          <td>{{formatDate(billInfo.dueDt)}}</td>
          <td rowspan="2" class="th tac" v-if="billInfo.billType === 'AC01'">付款行</td>
          <td rowspan="2" class="th tac" v-else>付款人开户行</td>
          <td class="th">行号</td>
          <td>{{billInfo.drweBankNo}}</td>
        </tr>
        <tr>
          <td colspan="2" class="th" v-if="billInfo.billType === 'AC01'">{{$t("m.i.billInfo.acptProtocalNo")}}</td>
          <td colspan="2" class="th" v-else>{{$t("m.i.billInfo.transCtrctNo")}}</td>
          <td v-if="billInfo.billType === 'AC01'">{{billInfo.acptProtocalNo}}</td>
          <td v-else>{{billInfo.transCtrctNo}}</td>
          <td class="th">地址</td>
          <td>{{billInfo.drweBankAddr}}</td>
        </tr>
        <tr v-if="billInfo.billType === 'AC01'">
          <td colspan="2" class="th">承兑人全称</td>
          <td>{{billInfo.acptName}}</td>
          <td colspan="2" class="th">承兑人开户行行号</td>
          <td>{{billInfo.acptBankNo}}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ME01BillFront",
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
      formatBillStatus(billInfo){
        if(billInfo.billOrigin==="CS01"){
          if (billInfo.inOutFlag === '2') {
            // ECDS场内
            return this.dictMap.get("BillStatusCode").get(billInfo.billStatus);
          } else {
            return  this.dictMap.get("EcdsBillStatusCode").get(billInfo.ecdsBillStatus);
          }
        }else {
          return this.dictMap.get("BillStatusCode").get(billInfo.billStatus);
        }
      },
      formatCirStatus(billInfo) {
        if(billInfo.billOrigin==="CS01"){
          if (billInfo.inOutFlag === '2') {
            let cirStatus = billInfo.cirStatus;
            if (cirStatus == null || cirStatus == '' || cirStatus == 'undefined') {
              return "-";
            } else {
              cirStatus = cirStatus.substring(0,6);
            }
            // ECDS场内
            return this.dictMap.get("BillCirStatusCode").get(cirStatus);
          } else {
            return  "-";
          }
        }else {
          let cirStatus = billInfo.cirStatus;
          if (cirStatus == null || cirStatus == '' || cirStatus == 'undefined') {
            return "-";
          } else {
            cirStatus = cirStatus.substring(0,6);
          }
          return this.dictMap.get("BillCirStatusCode").get(cirStatus);
        }
      },
      formatDate(value) {
        return value ? this.$moment(value, "YYYY / MM / DD").format("YYYY / MM / DD") : "";
      },
    }
  };
</script>

<style scoped>

</style>
