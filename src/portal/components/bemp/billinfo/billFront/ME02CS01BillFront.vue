<template>
  <div class="space">
    <div ref="head">
      <div class="h-t_date">
        <em>显示日期:</em>
        <span>{{ this.$moment(new Date()).format("YYYY-MM-DD") }}</span>
      </div>
      <div class="h-t_logo"><img src="@/assets/ticket_logo.png" /></div>
      <h2 class="h-ticket-title" v-if="billInfo.billType === 'AC01' && billInfo.acptBankType !== '301'">电子银行承兑汇票</h2>
      <h2 class="h-ticket-title" v-if="billInfo.billType === 'AC01' && billInfo.acptBankType === '301'">电子财务公司承兑汇票</h2>
      <h2 class="h-ticket-title" v-if="billInfo.billType === 'AC02'">电子商业承兑汇票</h2>
      <div class="h-ticket-info clearfix">
        <ul>
          <li>
            <em>出 票 日 期：</em>
            <span>{{formatDate(billInfo.remitDt)}}</span>
          </li>
          <li v-if="billInfo.inOutFlag == 2">
            <em>票 据 状 态：</em>
            <span>{{ formatBillStatus(billInfo)}}-{{ formatCirStatus(billInfo)}}</span>
          </li>
          <li v-else>
            <em>票 据 状 态：</em>
            <span>{{ formatBillStatus(billInfo)}}</span>
          </li>
<!--          <li>-->
<!--            <em></em>-->
<!--            <span></span>-->
<!--          </li>-->
<!--          <li>-->
<!--            <em>流通状态：</em>-->
<!--            <span>{{ formatCirStatus(billInfo)}}</span>-->
<!--          </li>-->
<!--          <li>-->
<!--            <em></em>-->
<!--            <span></span>-->
<!--          </li>-->
          <li>
            <em>汇票到期日：</em>
            <span>{{formatDate(billInfo.dueDt)}}</span>
          </li>
          <li>
            <em>票 据 号 码：</em>
            <h-tooltip content="单击复制票号" placement="top-end">
              <span @click="copy">{{billInfo.billNo}}</span>
            </h-tooltip>
          </li>
<!--          <li>-->
<!--            <em>子票区间：</em>-->
<!--            <span>{{formatRange(billInfo.billRangeStart, billInfo.billRangeEnd)}}</span>-->
<!--          </li>-->
        </ul>
      </div>
    </div>
    <div class="h-ticket-table" ref="body">
      <table>
        <colgroup>
          <col width="10%">
          <col width="10%">
          <col width="30%">
          <col width="9%">
          <col width="9%">
          <col width="32%">
        </colgroup>
        <tr>
          <td rowspan="3" class="th tac">出票人</td>
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
          <td class="th">开户银行</td>
          <td>{{billInfo.drwrBankName}}</td>
          <td class="th">开户银行</td>
          <td>{{billInfo.pyeeBankName}}</td>
        </tr>
<!--        <tr>-->
<!--          <td class="th">接入机构</td>-->
<!--          <td>{{formatMemberName(billInfo.drwrMemberName, billInfo.billOrigin)}}</td>-->
<!--          <td class="th">接入机构</td>-->
<!--          <td>{{formatMemberName(billInfo.pyeeMemberName,  billInfo.billOrigin)}}</td>-->
<!--        </tr>-->
        <tr v-for="item in billInfo.drwrGuarntrList" :key="item">
          <td colspan="2" class="th">出票保证信息</td>
          <td colspan="4">
            <span class="h-bz-l">
              <em>保证人名称:</em>
                <b>{{item.guarntrName}}</b>
            </span>
            <span class="h-bz-c">
              <em>保证人地址:</em>
                <b>{{item.guarntrAddr}}</b>
            </span>
            <span class="h-bz-r">
              <em>保证日期:</em>
              <b>{{formatDate(item.guarntrDt)}}</b>
            </span>
          </td>
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
<!--        <tr>-->
<!--          <td colspan="2" class="th tac">标准金额</td>-->
<!--          <td rowspan="">{{formatStdAmt(billInfo.stdAmt)}}</td>-->
<!--          <td colspan="2" class="th tac">票据数量</td>-->
<!--          <td rowspan="">{{formatRangeToNum(billInfo,billInfo.billRangeStart, billInfo.billRangeEnd)}}</td>-->
<!--        </tr>-->
        <tr>
          <td rowspan="2" class="th tac">承兑人信息</td>
          <td class="th">全称</td>
          <td>{{billInfo.acptName}}</td>
          <td colspan="2" class="th">开户行行号</td>
          <td>{{billInfo.acptBankNo}}</td>
        </tr>
        <tr>
          <td class="th">账号</td>
          <td>{{billInfo.acptAcctNo}}</td>
          <td colspan="2" class="th">开户行名称</td>
          <td>{{billInfo.acptBankName}}</td>
        </tr>
<!--        <tr>-->
<!--          <td class="th">接入机构</td>-->
<!--          <td>{{formatMemberName(billInfo.acptMemberName,  billInfo.billOrigin)}}</td>-->
<!--        </tr>-->
        <tr>
          <td colspan="2" class="th">交易合同号</td>
          <td>{{billInfo.transCtrctNo}}</td>
          <td rowspan="2" class="th tac">承兑信息</td>
          <td class="th">出票人承诺</td>
          <td  v-if="billInfo.billNo">本汇票请予以承兑，到期无条件付款</td>
        </tr>
        <tr>
          <td colspan="2" class="th">能否转让</td>
          <td>{{format("BanEndorsementMarkCode",billInfo.banEndrsmtMark)}}</td>
          <td class="th">承兑人承诺</td>
          <td>
            <span v-if="billInfo.acptDt">本汇票已经承兑，到期无条件付款</span>
            <span class="h-ticket-dq">{{formatDate(billInfo.acptDt)}}</span>
          </td>
        </tr>
        <tr v-for="item in billInfo.acptGuarntrList" :key="item">
          <td colspan="2" class="th">承兑保证信息</td>
          <td colspan="4">
            <span class="h-bz-l">
              <em>保证人名称:</em>
              <b>{{item.guarntrName}}</b>
            </span>
            <span class="h-bz-c">
                <em>保证人地址:</em>
                <b>{{item.guarntrAddr}}</b>
              </span>
            <span class="h-bz-r">
                <em>保证日期:</em>
                <b>{{formatDate(item.guarntrDt)}}</b>
              </span>
          </td>
        </tr>
        <tr>
          <td rowspan="2">
            <span>评级信息</span>
            <em>(由出票人、承兑人自己记载，仅供参考)</em>
          </td>
          <td class="th">出票人</td>
          <td colspan="4">
						<span class="h-pj-l">
              <em>评级主体:</em>
              <b>{{billInfo.drwrCdtRatgAgcy}}</b>
            </span>
            <span class="h-pj-c">
                <em>信用等级:</em>
                <b>{{billInfo.drwrCdtRatgs}}</b>
              </span>
            <span class="h-pj-r">
                <em>评级到期日:</em>
                <b>{{formatDate(billInfo.drwrCdtRatgDueDt)}}</b>
              </span>
          </td>
        </tr>
        <tr>
          <td class="th">承兑人</td>
          <td colspan="4">
            <span class="h-pj-l">
              <em>评级主体:</em>
              <b>{{billInfo.acptCdtRatgAgcy}}</b>
            </span>
            <span class="h-pj-c">
              <em>信用等级:</em>
              <b>{{billInfo.acptCdtRatgs}}</b>
            </span>
            <span class="h-pj-r">
              <em>评级到期日:</em>
              <b>{{formatDate(billInfo.acptCdtRatgDueDt)}}</b>
            </span>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ME02CS01BillFront",
    props: {
      billInfo: {
        type: Object
      },
      chineseMoney: {
        type: Object
      },
      dictMap: {
        type: Map,
        default:function() {
          return new Map();
        }
      },
      format4: {
        type: Function
      }
    },
    methods: {
      copy() {
        var oInput = document.createElement("input");
        oInput.value = this.billInfo.billNo;
        document.body.appendChild(oInput);
        oInput.select();//选择对象
        document.execCommand("copy");//执行浏览器复制命令
        document.body.removeChild(oInput);
        this.$msgTip.success(this, { info: "票号已复制" });
      },
      formatDate(value) {
        return value ? this.$moment(value, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
      },
      format(groupcode, key) {
        if (typeof key === "undefined" || key === null) {
          return "";
        }
        if (this.dictMap.size === 0) {
          return key;
        }
        return this.dictMap.get(groupcode).get(key);
      },
      formatRange(value1, value2){
        if (value1!==undefined && value1!==null && value1 !== ''
          && value2!==undefined && value2!==null  && value2 !== '') {
          let billRange = value1.toString().padLeft(12, '0') + "," + value2.toString().padLeft(12, '0');
          return  billRange;
        }else {
          return "-";
        }
      },
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
      formatMemberName(memberName, billOrigin) {
        if (billOrigin === 'CS01') {
          return "-";
        } else {
          return memberName;
        }
      },
      formatRangeToNum(billInfo,value1, value2){
        if(billInfo.billOrigin==="CS01"){
          return "-";
        }
        if (value1 == 0 || value1 == '0') {
          return "-"
        }
        if (value1 !== null && value2 !== null) {
          let billNum = (value2-value1+1).toString();
          return  billNum;
        }else {
          return "-";
        }
      },
      formatStdAmt(stdAmt) {
        if (stdAmt == null ) {
          return "-";
        }
        return stdAmt;
      }
    }
  };
</script>

<style scoped>

</style>
