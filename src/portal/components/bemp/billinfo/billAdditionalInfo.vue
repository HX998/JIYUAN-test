<template>
  <div class="space">
    <div ref="head">
      <div class="h-t_date">
        <em>显示日期:</em>
        <span>{{ this.$moment(new Date()).format("YYYY-MM-DD HH:mm") }}</span>
      </div>
      <div class="h-t_logo"><img src="@/assets/ticket_logo.png"/></div>
      <h2 class="h-ticket-title" v-if="extParams.billType === 'AC01' && extParams.acptBankType !== '301'">电子银行承兑汇票</h2>
      <h2 class="h-ticket-title" v-if="extParams.billType === 'AC01' && extParams.acptBankType === '301'">
        电子财务公司承兑汇票</h2>
      <h2 class="h-ticket-title" v-if="extParams.billType === 'AC02'">电子商业承兑汇票</h2>
    </div>
    <div class="h-ticket-table" ref="body">
      <table v-if="extParams.relevantInfolist.length <= 0">
        <colgroup>
          <col width="10%">
          <col width="30%">
          <col width="30%">
          <col width="30%">
        </colgroup>
        <tr>
          <td colspan="9" class="th1 h-fs14">票据相关信息</td>
        </tr>
        <tr>
          <td class="th tac">票据类型</td>
          <td colspan="6" v-if="extParams.billType === 'AC01'&& extParams.acptBankType !== '301'">银行承兑汇票</td>
          <td colspan="6" v-if="extParams.billType === 'AC01'&& extParams.acptBankType === '301'">财务公司承兑汇票</td>
          <td colspan="6" v-if="extParams.billType === 'AC02'">商业承兑汇票</td>
        </tr>
        <tr>
          <td rowspan="2" class="th tac">票据标注信息</td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td rowspan="2" class="th tac">标注信息对应业务信息</td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </table>
      <table v-if="extParams.relevantInfolist.length > 0">
        <colgroup>
          <col width="10%">
          <col width="30%">
          <col width="30%">
          <col width="30%">
        </colgroup>
        <tr>
          <td colspan="9" class="th1 h-fs14">票据相关信息</td>
        </tr>
        <tr>
          <td class="th tac">票据类型</td>
          <td colspan="6" v-if="extParams.billType === 'AC01'&& extParams.acptBankType !== '301'">银行承兑汇票</td>
          <td colspan="6" v-if="extParams.billType === 'AC01'&& extParams.acptBankType === '301'">财务公司承兑汇票</td>
          <td colspan="6" v-if="extParams.billType === 'AC02'">商业承兑汇票</td>
        </tr>
      </table>
      <table v-if="extParams.relevantInfolist.length > 0" v-for="item in extParams.relevantInfolist" :key="item">
        <colgroup>
          <col width="10%">
          <col width="30%">
          <col width="30%">
          <col width="30%">
        </colgroup>
        <tr>
          <td rowspan="2" class="th tac">票据标注信息</td>
          <td>{{ getKey(item.keyOne) }}</td>
          <td>{{ getKey(item.keyTwo) }}</td>
          <td>{{ getKey(item.keyThree) }}</td>
        </tr>
        <tr>
          <td>{{ format("Yon", item.valueOne) }}</td>
          <td>{{ format("Yon", item.valueTwo) }}</td>
          <td>{{ format("Yon", item.valueThree) }}</td>
        </tr>
        <tr>
          <td rowspan="2" class="th tac">标注信息对应业务信息</td>
          <td>{{ getLabel(item.keyOne, item.valueOne) }}</td>
          <td>{{ getLabel(item.keyTwo, item.valueTwo) }}</td>
          <td>{{ getLabel(item.keyThree, item.valueThree) }}</td>
        </tr>
        <tr>
          <td v-if="item.busiInfoOne!=null">
            <span class="busi-info">
              <em>全称:</em>
              <b>{{ item.busiInfoOne.name }}</b>
            </span>
            <span class="busi-info">
              <em>统一社会信用代码:</em>
              <b>{{ item.busiInfoOne.socCode }}</b>
            </span>
            <span class="busi-info">
              <em>开户银行名称:</em>
              <b>{{ item.busiInfoOne.bankName }}</b>
            </span>
            <span class="busi-info">
              <em>开户银行行号:</em>
              <b>{{ item.busiInfoOne.bankNo }}</b>
            </span>
            <span class="busi-info">
              <em>开户银行账户:</em>
              <b>{{ item.busiInfoOne.acctNo }}</b>
            </span>
          </td>
          <td v-else></td>
          <td v-if="item.busiInfoTwo">
            <span class="busi-info">
              <em>全称:</em>
              <b>{{ item.busiInfoTwo.name }}</b>
            </span>
            <span class="busi-info">
              <em>统一社会信用代码:</em>
              <b>{{ item.busiInfoTwo.socCode }}</b>
            </span>
            <span class="busi-info">
              <em>开户银行名称:</em>
              <b>{{ item.busiInfoTwo.bankName }}</b>
            </span>
            <span class="busi-info">
              <em>开户银行行号:</em>
              <b>{{ item.busiInfoTwo.bankNo }}</b>
            </span>
            <span class="busi-info">
              <em>开户银行账户:</em>
              <b>{{ item.busiInfoTwo.acctNo }}</b>
            </span>
          </td>
          <td v-else></td>
          <td v-if="item.busiInfoThree">
            <span class="busi-info">
              <em>全称:</em>
              <b>{{ item.busiInfoThree.name }}</b>
            </span>
            <span class="busi-info">
              <em>统一社会信用代码:</em>
              <b>{{ item.busiInfoThree.socCode }}</b>
            </span>
            <span class="busi-info">
              <em>开户银行名称:</em>
              <b>{{ item.busiInfoThree.bankName }}</b>
            </span>
            <span class="busi-info">
              <em>开户银行行号:</em>
              <b>{{ item.busiInfoThree.bankNo }}</b>
            </span>
            <span class="busi-info">
              <em>开户银行账户:</em>
              <b>{{ item.busiInfoThree.acctNo }}</b>
            </span>
          </td>
          <td v-else></td>
        </tr>
      </table>
      <table class="under">
        <colgroup>
          <col width="5%">
          <col width="8%">
          <col width="20%">
          <col width="5%">
          <col width="8%">
          <col width="20%">
          <col width="5%">
          <col width="8%">
          <col width="21%">
        </colgroup>
        <tr>
          <td colspan="9" class="th1 h-fs14">票据行为人详细信息</td>
        </tr>
        <tr>
          <td rowspan="8" class="th tac">出票人信息</td>
          <td class="th">全称</td>
          <td>{{ extParams.drwrName }}</td>
          <td rowspan="8" class="th tac">收款人信息</td>
          <td class="th">全称</td>
          <td>{{ extParams.pyeeName }}</td>
          <td rowspan="8" class="th tac">承兑人</td>
          <td class="th">全称</td>
          <td>{{ extParams.acptName }}</td>
        </tr>
        <tr>
          <td class="th">社会统一信用代码</td>
          <td>{{ extParams.drwrSocCode }}</td>
          <td class="th">社会统一信用代码</td>
          <td>{{ extParams.pyeeSocCode }}</td>
          <td class="th">社会统一信用代码</td>
          <td>{{ extParams.acptSocCode }}</td>
        </tr>
        <tr>
          <td class="th">账户名称</td>
          <td>{{ extParams.drwrAcctName }}</td>
          <td class="th">账户名称</td>
          <td>{{ extParams.pyeeAcctName }}</td>
          <td class="th">账户名称</td>
          <td>{{ extParams.acptAcctName }}</td>
        </tr>
        <tr>
          <td class="th">办理渠道名称</td>
          <td>{{ extParams.drwrMemberName }}</td>
          <td class="th">办理渠道名称</td>
          <td>{{ extParams.pyeeMemberName }}</td>
          <td class="th">办理渠道名称</td>
          <td>{{ extParams.acptMemberName }}</td>
        </tr>
        <tr>
          <td class="th">票据账户号</td>
          <td>-</td>
          <td class="th">票据账户号</td>
          <td>-</td>
          <td class="th">票据账户号</td>
          <td>-</td>
        </tr>
        <tr>
          <td class="th">开户银行名</td>
          <td>{{ extParams.drwrBankName }}</td>
          <td class="th">开户银行名</td>
          <td>{{ extParams.pyeeBankName }}</td>
          <td class="th">开户银行名</td>
          <td>{{ extParams.acptBankName }}</td>
        </tr>
        <tr>
          <td class="th">开户银行行号</td>
          <td>{{ extParams.drwrBankNo }}</td>
          <td class="th">开户银行行号</td>
          <td>{{ extParams.pyeeBankNo }}</td>
          <td class="th">开户银行行号</td>
          <td>{{ extParams.acptBankNo }}</td>
        </tr>
        <!--        todo 数据源不清晰-->
        <tr>
          <td class="th">开户银行账号</td>
          <td>{{ extParams.drwrAcctNo }}</td>
          <td class="th">开户银行账号</td>
          <td>{{ extParams.pyeeAcctNo }}</td>
          <td class="th">开户银行账号</td>
          <td>{{ extParams.acptAcctNo }}</td>
        </tr>
      </table>
      <table class="under" v-if="extParams.guarntrList.length > 0">
        <colgroup>
          <col width="5%">
          <col width="8%">
          <col width="20%">
          <col width="5%">
          <col width="8%">
          <col width="20%">
          <col width="5%">
          <col width="8%">
          <col width="21%">
        </colgroup>
        <tr>
          <td colspan="9" class="th1 h-fs14">增信信息</td>
        </tr>
      </table>
      <table v-for="item in extParams.guarntrList" :key="item" v-if="extParams.guarntrList.length > 0">
        <colgroup>
          <col width="5%">
          <col width="8%">
          <col width="20%">
          <col width="5%">
          <col width="8%">
          <col width="20%">
          <col width="5%">
          <col width="8%">
          <col width="21%">
        </colgroup>
        <tr>
          <td rowspan="8" class="th tac" v-if="item.transNoOne === 'NES.004.20.00P'">出票保证人</td>
          <td rowspan="8" class="th tac" v-else-if="item.transNoOne === 'NES.004.20.10P'">承兑保证人</td>
          <td rowspan="8" class="th tac"
              v-else-if="item.transNoOne === 'NES.004.20.20P' || item.transNoOne === 'NES.004.00.00P'">背书保证人
          </td>
          <td rowspan="8" class="th tac" v-else></td>
          <td class="th" v-if="item.nameOne">全称</td>
          <td class="th" v-else></td>
          <td>{{ item.nameOne }}</td>
          <td rowspan="8" class="th tac" v-if="item.transNoTwo === 'NES.004.20.00P'">出票保证人</td>
          <td rowspan="8" class="th tac" v-else-if="item.transNoTwo === 'NES.004.20.10P'">承兑保证人</td>
          <td rowspan="8" class="th tac"
              v-else-if="item.transNoTwo === 'NES.004.20.20P' || item.transNoTwo === 'NES.004.00.00P'">背书保证人
          </td>
          <td rowspan="8" class="th tac" v-else></td>
          <td class="th" v-if="item.nameTwo">全称</td>
          <td class="th" v-else></td>
          <td>{{ item.nameTwo }}</td>
          <td rowspan="8" class="th tac" v-if="item.transNoThree === 'NES.004.20.00P'">出票保证人</td>
          <td rowspan="8" class="th tac" v-else-if="item.transNoThree === 'NES.004.20.10P'">承兑保证人</td>
          <td rowspan="8" class="th tac"
              v-else-if="item.transNoThree === 'NES.004.20.20P' || item.transNoThree === 'NES.004.00.00P'">背书保证人
          </td>
          <td rowspan="8" class="th tac" v-else></td>
          <td class="th" v-if="item.nameThree">全称</td>
          <td class="th" v-else></td>
          <td>{{ item.nameThree }}</td>
        </tr>
        <tr>
          <td class="th" v-if="item.transNoOne">社会统一信用代码</td>
          <td class="th" v-else></td>
          <td>{{ item.socCodeOne }}</td>
          <td class="th" v-if="item.transNoTwo">社会统一信用代码</td>
          <td class="th" v-else></td>
          <td>{{ item.socCodeTwo }}</td>
          <td class="th" v-if="item.transNoThree">社会统一信用代码</td>
          <td class="th" v-else></td>
          <td>{{ item.socCodeThree }}</td>
        </tr>
        <tr>
          <td class="th" v-if="item.transNoOne">账户名称</td>
          <td class="th" v-else></td>
          <td>{{ item.acctNameOne }}</td>
          <td class="th" v-if="item.transNoTwo">账户名称</td>
          <td class="th" v-else></td>
          <td>{{ item.acctNameTwo }}</td>
          <td class="th" v-if="item.transNoThree">账户名称</td>
          <td class="th" v-else></td>
          <td>{{ item.acctNameThree }}</td>
        </tr>
        <tr>
          <td class="th" v-if="item.transNoOne">办理渠道名称</td>
          <td class="th" v-else></td>
          <td>{{ item.memberNameOne }}</td>
          <td class="th" v-if="item.transNoTwo">办理渠道名称</td>
          <td class="th" v-else></td>
          <td>{{ item.memberNameTwo }}</td>
          <td class="th" v-if="item.transNoThree">办理渠道名称</td>
          <td class="th" v-else></td>
          <td>{{ item.memberNameThree }}</td>
        </tr>
        <tr>
          <td class="th" v-if="item.transNoOne">票据账户号</td>
          <td class="th" v-else></td>
          <td v-if="item.transNoOne">-</td>
          <td v-else></td>
          <td class="th" v-if="item.transNoTwo">票据账户号</td>
          <td class="th" v-else></td>
          <td v-if="item.transNoTwo">-</td>
          <td v-else></td>
          <td class="th" v-if="item.transNoThree">票据账户号</td>
          <td class="th" v-else></td>
          <td v-if="item.transNoThree">-</td>
          <td v-else></td>
        </tr>
        <tr>
          <td class="th" v-if="item.transNoOne">开户银行名</td>
          <td class="th" v-else></td>
          <td>{{ item.bankNameOne }}</td>
          <td class="th" v-if="item.transNoTwo">开户银行名</td>
          <td class="th" v-else></td>
          <td>{{ item.bankNameTwo }}</td>
          <td class="th" v-if="item.transNoThree">开户银行名</td>
          <td class="th" v-else></td>
          <td>{{ item.bankNameThree }}</td>
        </tr>
        <tr>
          <td class="th" v-if="item.transNoOne">开户银行行号</td>
          <td class="th" v-else></td>
          <td>{{ item.bankNoOne }}</td>
          <td class="th" v-if="item.transNoTwo">开户银行行号</td>
          <td class="th" v-else></td>
          <td>{{ item.bankNoTwo }}</td>
          <td class="th" v-if="item.transNoThree">开户银行行号</td>
          <td class="th" v-else></td>
          <td>{{ item.bankNoThree }}</td>
        </tr>
        <tr>
          <td class="th" v-if="item.transNoOne">开户银行账号</td>
          <td class="th" v-else></td>
          <td>{{ item.acctNoOne }}</td>
          <td class="th" v-if="item.transNoTwo">开户银行账号</td>
          <td class="th" v-else></td>
          <td>{{ item.acctNoTwo }}</td>
          <td class="th" v-if="item.transNoThree">开户银行账号</td>
          <td class="th" v-else></td>
          <td>{{ item.acctNoThree }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
  import {deepClone} from "../../../utils";

  export default {
    name: "billAdditionalInfo",
    data() {
      return {};
    },
    props: {
      extParams: {
        type: Object
      },
      chineseMoney: {
        type: Object
      },
      dictMap: {
        type: Map,
        default: function () {
          return new Map();
        }
      },
      format4: {
        type: Function
      },
    },
    methods: {
      getKey(key) {
        if (key === 'BC05') {
          return "是否已保贴"
        } else if (key === 'BC06') {
          return "是否已保兑"
        }
      },
      getLabel(key, value) {
        if (key === 'BC05' && value == 1) {
          return "保贴信息"
        } else if (key === 'BC06' && value == 1) {
          return "保兑信息"
        } else {
          return "";
        }
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
      formatRange(value1, value2) {
        if (value1 !== undefined && value1 !== null && value1 !== ''
          && value2 !== undefined && value2 !== null && value2 !== '') {
          let billRange = value1.toString().padLeft(12, '0') + "-" + value2.toString().padLeft(12, '0');
          return billRange;
        } else {
          return "-";
        }
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
    },
  };
</script>

<style scoped>
.h-ticket-table {
  margin: 0 20px;
  border: 0px;
}

.under {
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
  margin-top: 20px;
}

.th1 {
  text-align: left;
  color: #333333;
}

.busi-info {
  float: left;
  width: 100%
}
</style>
