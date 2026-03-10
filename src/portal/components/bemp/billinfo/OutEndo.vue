<template>
  <div class="space">
    <div ref="head">
      <div class="h-t_date">
        <em>显示日期:</em>
        <span>{{ this.$moment(new Date()).format("YYYY-MM-DD") }}</span>
      </div>
      <div class="h-t_logo" v-if="this.endoParams.billClass === 'ME02'"><img src="@/assets/ticket_logo.png"/></div>
      <h2 class="h-ticket-title">{{getTitle()}}</h2>
      <div class="h-ticket-info clearfix">
        <ul>
          <li>
            <em>票据号码:</em>
            <span>{{this.endoParams.billNo}}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="h-ticket-table" ref="body">
      <table cellspacing="0" cellpadding="0" style="border-collapse: collapse;border: 1px solid #000000;">
        <colgroup>
          <col width="16%">
          <col width="84%">
        </colgroup>
        <tbody v-for="endo in endoInfo" v-if="!!endo.tBodyInfo">
          <tr>
            <td colspan="2" class="th tac h-fs14">{{endo.tBodyInfo.tHead}}</td>
          </tr>
          <tr v-for="column in endo.tBodyInfo.tColumn">
            <td class="th">{{column.tHead}}</td>
            <td>{{column.tText}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  export default {
    name: "OutEndo",
    data() {
      return {
        endoInfo: []
      };
    },
    props: {
      dictMap: {
        type: Map
      },
      endoParams: {
        type: Object,
        default() {
          return {
            billClass: "",
            billType: "",
            billNo: ""
          };
        }
      }
    },
    methods: {
      formatDate(value) {
        if (this.endoParams.billClass === "ME01") {
          return this.formatDateFun(value, "YYYY / MM / DD");
        } else {
          return this.formatDateFun(value, "YYYY-MM-DD");
        }
      },
      formatDateFun(value, format) {
        return value ? this.$moment(value, format).format(format) : "";
      },
      getTitle() {
        let title = "";
        title += (this.endoParams.billClass === "ME01" ? "纸质" : "电子");
        title += (this.endoParams.billType === "AC01" ? "银行" : "商业");
        return title + "承兑汇票";
      },
      creatEndo(endoInfoMap) {
        let isRecourse = false;
        for (let endo of endoInfoMap) {
          let tBodyInfo = {};
          let tColumn = [];
          if (endo.endorType === "ET01") {
            tBodyInfo.tHead = "承兑背书";
            tColumn.push({ tHead: "承兑日期", tText: this.formatDate(endo.signDt) });
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET18") {
            tBodyInfo.tHead = "权属初始登记背书";
            tColumn.push(
                { tHead: "权属登记日期", tText: this.formatDate(endo.applDt) },
                { tHead: "登记机构代码", tText: endo.transFromBrchCode },
                { tHead: "登记机构名称", tText: endo.transFromBrchName },
                { tHead: "备注", tText: endo.transFromRemark }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          }else if (endo.endorType === "ET02") {
            tBodyInfo.tHead = "保证";
            tColumn.push(
                { tHead: "保证日期", tText: this.formatDate(endo.signDt) },
                { tHead: "被保证人名称", tText: endo.transFromName },
                { tHead: "被保证人账号", tText: endo.transFromAcctNo },
                { tHead: "被保证人开户行行号", tText: endo.transFromBankNo },
                { tHead: "被保证人统一社会信用代码", tText: endo.transFromSocCode },
                { tHead: "被保证人备注", tText: endo.transFromRemark },
                { tHead: "保证人名称", tText: endo.transToName },
                { tHead: "保证人账号", tText: endo.transToAcctNo },
                { tHead: "保证人开户行行号", tText: endo.transToBankNo },
                { tHead: "保证人统一社会信用代码", tText: endo.transToSocCode },
                { tHead: "保证人地址", tText: endo.otherInfo },
                { tHead: "保证人备注", tText: endo.transToRemark }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET05") {
            if(endo.transToAcctNo === "0"){
              tBodyInfo.tHead = "买断式贴现背书";
            }else {
              tBodyInfo.tHead = "转让背书";
            }
            tColumn.push(
              { tHead: "背书人名称", tText: endo.transFromName },
              { tHead: "被背书人名称", tText: endo.transToName },
              {
                tHead: this.$t("m.i.billInfo.banEndrsmtMark"),
                tText: this.format("BanEndorsementMarkCode", endo.banEndrsmtMark)
              },
              { tHead: "背书日期", tText: this.formatDate(endo.signDt) }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET02") {
            tBodyInfo.tHead = "保证";
            tColumn.push(
              { tHead: "被保证人名称", tText: endo.transFromName },
              { tHead: "保证人名称", tText: endo.transToName },
              { tHead: "保证人地址", tText: endo.otherInfo },
              { tHead: "保证日期", tText: this.formatDate(endo.signDt) }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET03") {
            tBodyInfo.tHead = "质押背书";
            tColumn.push(
              { tHead: "出质人名称", tText: endo.transFromName },
              { tHead: "质权人名称", tText: endo.transToName },
              { tHead: "出质日期", tText: this.formatDate(endo.signDt) }
            );
            if (!!endo.unimpawnDt) {
              tColumn.push({ tHead: this.$t("m.i.common.unImpawnDt"), tText: this.formatDate(endo.unimpawnDt) });
            }
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          }  else if (endo.endorType === "ET04") {
            tBodyInfo.tHead = "解质押背书";
            tColumn.push(
                { tHead: "出质人名称", tText: endo.transToName },
                { tHead: "质权人名称", tText: endo.transFromName },
                { tHead: "出质日期", tText: this.formatDate(endo.signDt) }
            );
            if (!!endo.unimpawnDt) {
              tColumn.push({ tHead: this.$t("m.i.common.unImpawnDt"), tText: this.formatDate(endo.unimpawnDt) });
            }
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          }/*else if (endo.endorType === "201102") {
            tBodyInfo.tHead = "买断式贴现背书";
            tColumn.push(
              { tHead: "背书人名称", tText: endo.transFromName },
              { tHead: "被背书人名称", tText: endo.transToName },
              {
                tHead: this.$t("m.i.billInfo.banEndrsmtMark"),
                tText: this.format("BanEndorsementMarkCode", endo.banEndrsmtMark)
              },
              { tHead: "背书日期", tText: this.formatDate(endo.signDt) }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } */else if (endo.endorType === "ET14") {
            tBodyInfo.tHead = "回购式贴现背书";
            tColumn.push(
              { tHead: "背书人名称", tText: endo.transFromName },
              { tHead: "被背书人名称", tText: endo.transToName },
              { tHead: "背书日期", tText: this.formatDate(endo.signDt) },
              { tHead: "赎回开放日", tText: this.formatDate(endo.redeemOpenDt) },
              { tHead: "赎回截止日", tText: this.formatDate(endo.redeemDueDt) }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET15") {
            tBodyInfo.tHead = "回购式贴现赎回背书";
            tColumn.push(
              { tHead: "背书人名称", tText: endo.transFromName },
              { tHead: "被背书人名称", tText: endo.transToName },
              {
                tHead: this.$t("m.i.billInfo.banEndrsmtMark"),
                tText: this.format("BanEndorsementMarkCode", endo.banEndrsmtMark)
              },
              { tHead: "背书日期", tText: this.formatDate(endo.signDt) }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET09") {
            tBodyInfo.tHead = "提示付款";
            tColumn.push(
              { tHead: "提示付款人名称", tText: endo.transFromName },
              { tHead: "提示付款日期", tText: this.formatDate(endo.applDt) },
              {
                tHead: "付款或拒付",
                tText: this.format("SignUpMarkCode", endo.signFlag)
              },
              { tHead: "付款或拒付日期", tText: this.formatDate(endo.signDt) },
              { tHead: "拒付理由", tText: this.getRefulseMsg(endo) },
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET10") {
            if (isRecourse) {
              tBodyInfo.tHead = "再追索清偿";
            } else {
              tBodyInfo.tHead = "追索清偿";
              isRecourse = true;
            }
            tColumn.push(
              { tHead: "追索人名称", tText: endo.transFromName },
              { tHead: "清偿人名称", tText: endo.transToName },
              { tHead: "追索日期", tText: this.formatDate(endo.applDt) },
              {
                tHead: "追索类型",
                tText: this.ecdsRecourseTypeFormat(endo.subEndorType)
              },
              { tHead: "清偿日期", tText: this.formatDate(endo.signDt) }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          }
        }
        this.endoInfo = endoInfoMap;
      },
      ecdsRecourseTypeFormat(subEndorType) {
        if (subEndorType == "NES.013.20.10P") {
          return "拒付追索";
        } else if (subEndorType == "NES.013.20.11P"){
          return "非拒付追索";
        } else {
          return "";
        }
      },
      format(groupcode, key) {
        let group = this.dictMap.get(groupcode);
        if (group && key) {
          return group.get(key);
        }
        return "";
      },
      getRefulseMsg(object) {
        if (object.signCode !== "DC09") {
          return this.format("EcdsDishonorCode", object.signCode);
        } else {
          return object.otherInfo;
        }
      }
    }
  };
</script>

<style scoped>

</style>
