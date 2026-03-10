<template>
  <div class="space">
    <div ref="head">
      <div class="h-t_date">
        <em>显示日期:</em>
        <span>{{ this.$moment(new Date()).format("YYYY-MM-DD HH:mm") }}</span>
      </div>
      <div class="h-t_logo"><img src="@/assets/ticket_logo.png" /></div>
      <h2 class="h-ticket-title" v-if="billInfo.billType === 'AC01'">电子银行承兑汇票</h2>
      <h2 class="h-ticket-title" v-else>电子商业承兑汇票</h2>
      <div class="h-ticket-info clearfix">
        <ul>
          <li>
            <em style="width: 17%">出 票 日 期：</em>
            <span>{{formatDate(billInfo.remitDt)}}</span>
          </li>
          <li>
            <em>票据状态：</em>
            <span>{{ format("BillStatusCode", billInfo.billStatus) }}
              <span v-if="billInfo.cirStatus != null && billInfo.cirStatus != ''">-{{ format("BillCirStatusCode", billInfo.cirStatus) }}</span>
            </span>
          </li>
          <li>
            <em style="width: 17%">汇票到期日：</em>
            <span>{{formatDate(billInfo.dueDt)}}</span>
          </li>
          <li>
            <em>票据号码：</em>
            <h-tooltip content="单击复制票号" placement="top-end">
              <span @click="copy">{{formatBill(billInfo.billNo)}}</span>
            </h-tooltip>
          </li>
          <li>
            <em></em>
            <span></span>
          </li>
          <!-- 子票区间 -->
          <li>
            <span>{{formatRange(billInfo.billRange)}}</span>
          </li>
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
        <tr>
          <td colspan="2" class="th">交易合同号</td>
          <td>{{billInfo.transCtrctNo}}</td>
          <td rowspan="2" class="th tac">承兑信息</td>
          <td class="th">出票人承诺</td>
          <td>本汇票请予以承兑，到期无条件付款</td>
        </tr>
        <tr>
          <td colspan="2" class="th">能否转让</td>
          <td>
            {{format("BanEndorsementMarkCode",billInfo.banEndrsmtMark)}}
            <span v-if="billInfo.isAllowSplitBill !='' && billInfo.isAllowSplitBill != null">-{{format("IsAllowSplitBill",billInfo.isAllowSplitBill)}}</span>
          </td>
          <td class="th">承兑人承诺</td>
          <td>
            <span>本汇票已经承兑，到期无条件付款</span>
            <span class="h-ticket-dq">{{formatDate(billInfo.acptDt)}}</span>
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
import {getConnectMode} from "@/api/bizApi/commonUtil";

export default {
  name: "ME02BillFront",
  data() {
    return {
      mode: ""
    }
  },
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
    created() {
      getConnectMode().then(res => {
        this.mode = res;
      });
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

      formatBill(billNo) {
        if (billNo !== undefined && billNo !== null && billNo !== '') {
          let str = billNo.toString().substring(0, 1) + " " +
            billNo.toString().substring(1, 13) + " " + billNo.toString().substring(13, 21)
            + " " + billNo.toString().substring(21, 29) + " " + billNo.toString().substring(29, 30);
          return str;
        } else {
          return "";
        }
      },
      formatRange(billRange) {
        if(billRange == null || billRange == undefined || billRange == "") {
          return ""
        }
        let arr = billRange.split(',')
        return arr[0] + '-' + arr[1]
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
        let status=this.dictMap.get(groupcode).get(key);
        if(status){
          return status;
        }else{
          return key;
        }
      }
    }
  };
</script>

<style scoped>

</style>
