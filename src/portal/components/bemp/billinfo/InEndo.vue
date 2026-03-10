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
    name: "InEndo",
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
        for (let endo of endoInfoMap) {
          let tBodyInfo = {};
          let tColumn = [];
          if (endo.endorType === "ET01") {
            tBodyInfo.tHead = "承兑背书";
            tColumn.push({ tHead: "承兑日期", tText: this.formatDate(endo.signDt) });
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET02") {
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
          }  else if (endo.endorType === "ET03") {
            tBodyInfo.tHead = "质押背书";
            tColumn.push(
              { tHead: "质押日期", tText: this.formatDate(endo.signDt) },
              {
                tHead: this.$t("m.i.common.unImpawnDt"),
                tText: this.formatDate(endo.unimpawnDt)
              },
              { tHead: "出质人名称", tText: endo.transFromName },
              { tHead: "出质人账号", tText: endo.transFromAcctNo },
              { tHead: "出质人开户行行号", tText: endo.transFromBankNo },
              { tHead: "出质人统一社会信用代码", tText: endo.transFromSocCode },
              { tHead: "出质人备注1", tText: endo.transFromRemark },
              { tHead: "出质人备注2", tText: "" },
              { tHead: "质权人名称", tText: endo.transToName },
              { tHead: "质权人账号", tText: endo.transToAcctNo },
              { tHead: "质权人开户行行号", tText: endo.transToBankNo },
              { tHead: "质权人统一社会信用代码", tText: endo.transToSocCode },
              { tHead: "质权人备注1", tText: endo.otherInfo },
              { tHead: "质权人备注2", tText: "" }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET05") {
            tBodyInfo.tHead = "转让背书";
            tColumn.push(
              { tHead: "背书日期", tText: this.formatDate(endo.signDt) },
              { tHead: "背书人名称", tText: endo.transFromName },
              { tHead: "背书人账号", tText: endo.transFromAcctNo },
              { tHead: "背书人开户行行号", tText: endo.transFromBankNo },
              { tHead: "背书人统一社会信用代码", tText: endo.transFromSocCode },
              { tHead: "背书人备注", tText: endo.transFromRemark },
              { tHead: "被背书人名称", tText: endo.transToName },
              { tHead: "被背书人账号", tText: endo.transToAcctNo },
              { tHead: "被背书人开户行行号", tText: endo.transToBankNo },
              { tHead: "被背书人统一社会信用代码", tText: endo.transToSocCode },
              { tHead: "被背书人备注", tText: endo.transToRemark }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET06") {
            tBodyInfo.tHead = "止付/冻结";
            tColumn.push(
              { tHead: "登记日期", tText: this.formatDate(endo.signDt) },
              { tHead: "止付日期", tText: this.formatDate(endo.signDt) },
              { tHead: "止付类型", tText: this.format("SspdType",endo.suspendType) },
              { tHead: "止付原因", tText: endo.suspendReason },
              { tHead: this.$t("m.i.ce.sspdName"), tText: endo.transFromName },
              { tHead: this.$t("m.i.ce.sspdAcctNo"), tText: endo.transFromAcctNo },
              { tHead: "止付申请人开户行行号", tText: endo.transFromBankNo },
              { tHead: "止付申请人统一社会信用代码", tText: endo.transFromOrgCode },
              { tHead: "止付登记人备注", tText: endo.transFromRemark }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET07") {
            tBodyInfo.tHead = "解除止付/冻结";
            tColumn.push(
              { tHead: "登记日期", tText: this.formatDate(endo.applDt) },
              { tHead: "解止付日期", tText: this.formatDate(endo.applDt) },
              { tHead: "解止付类型", tText: this.format("AnlgSspdType",endo.suspendType) },
              { tHead: "解止付原因", tText: endo.suspendReason },
              { tHead: "解除止付登记人备注", tText: endo.transFromRemark }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          }/* else if (endo.endorType === "300308") {
            tBodyInfo.tHead = "贴现背书";
            tColumn.push(
              { tHead: "贴现日期", tText: this.formatDate(endo.signDt) },
              { tHead: "贴出人名称", tText: endo.transFromName },
              { tHead: "贴出人账号", tText: endo.transFromAcctNo },
              { tHead: "贴出人开户行行号", tText: endo.transFromBankNo },
              { tHead: "贴出人统一社会信用代码", tText: endo.transFromSocCode },
              { tHead: "贴出人行业分类", tText: this.format("Industry",endo.transFromIndustry) },
              { tHead: "贴出人企业规模", tText: this.format("CorpScale",endo.transFromCorpScale) },
              { tHead: "贴出人是否涉农企业", tText: this.format("Yon",endo.isTransFromArc) },
              { tHead: "地区", tText: this.format("Province",endo.transFromArea) },
              { tHead: "贴出人是否绿色企业", tText: this.format("Yon",endo.isTransFromGrn) },
              { tHead: "贴出人备注", tText: endo.transFromRemark },
              { tHead: "贴入人名称", tText: endo.transToName },
              { tHead: "贴入人账号", tText: endo.transToAcctNo },
              { tHead: "贴入人开户行行号", tText: endo.transToBankNo },
              { tHead: "贴入人开户行机构代码", tText: endo.transToBrchCode },
              { tHead: "贴入人开户行行名", tText: endo.transToBrchName },
              { tHead: "贴入人统一社会信用代码", tText: endo.transToSocCode },
              { tHead: "贴入人备注", tText: endo.transToRemark }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } */else if (endo.endorType === "ET18") {
            tBodyInfo.tHead = "权属初始登记背书";
            tColumn.push(
              { tHead: "权属登记日期", tText: this.formatDate(endo.applDt) },
              { tHead: "登记机构代码", tText: endo.transFromBrchCode },
              { tHead: "登记机构名称", tText: endo.transFromBrchName },
              { tHead: "备注", tText: endo.transFromRemark }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } /*else if (endo.endorType === "300310") {
            tBodyInfo.tHead = "付款确认背书";
            tColumn.push(
              { tHead: "付款确认日期", tText: this.formatDate(endo.signDt) },
              { tHead: "付款确认类型", tText: this.format("CfmAppType",endo.cfmAppType) },
              { tHead: "应答标识", tText: this.format("SignUpMarkCode",endo.cfmAppStatus) },
              { tHead: "付款确认拒绝原因", tText: this.format("RefuseReason",endo.payRefuseFlag) },
              { tHead: "付款确认申请备注", tText: endo.transFromRemark },
              { tHead: "付款确认应答备注", tText: endo.transToRemark }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "300311") {
            tBodyInfo.tHead = "移库背书";
            tColumn.push(
              { tHead: "库存移出日期", tText: this.formatDate(endo.applDt) },
              { tHead: "库存移入日期", tText: this.formatDate(endo.moveInDt) },
              { tHead: "库存移出机构代码", tText: endo.transFromBrchCode },
              { tHead: "库存移出机构名称", tText: endo.transFromBrchName },
              { tHead: "库存移入机构代码", tText: endo.transToBrchCode },
              { tHead: "库存移入机构名称", tText: endo.transToBrchName },
              { tHead: "库存移出申请备注", tText: endo.transFromRemark },
              { tHead: "库存移入应答备注", tText: endo.transToRemark }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          }*/ else if (endo.endorType === "ET08") {
            tBodyInfo.tHead = "保证增信背书";
            tColumn.push(
              { tHead: "保证增信日期", tText: this.formatDate(endo.signDt) },
              { tHead: "保证增信行机构代码", tText: endo.transToBrchCode },
              { tHead: "保证增信行机构名称", tText: endo.transToBrchName },
              { tHead: "保证增信申请备注", tText: endo.transFromRemark },
              { tHead: "保证增信应答备注", tText: endo.transToRemark }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
         } /* else if (endo.endorType === "300313") {
            tBodyInfo.tHead = "贴现后质押背书";
            tColumn.push(
              { tHead: "质押日期", tText: this.formatDate(endo.applDt) },
              { tHead: this.$t("m.i.common.unImpawnDt"), tText: this.formatDate(endo.unimpawnDt) },
              { tHead: "出质人机构代码", tText: endo.transFromBrchCode },
              { tHead: "出质人机构名称", tText: endo.transFromBrchName },
              { tHead: "质权人机构代码", tText: endo.transToBrchCode },
              { tHead: "质权人机构名称", tText: endo.transToBrchName },
              { tHead: "质押申请备注", tText: endo.transFromRemark },
              { tHead: "质押应答备注", tText: endo.transToRemark },
              { tHead: "解除质押申请备注", tText: endo.unImpawnAplRemark },
              { tHead: "解除质押应答备注", tText: endo.unImpawnRvRemark }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "300314") {
            tBodyInfo.tHead = "贴现后保证背书";
            tColumn.push(
              { tHead: "保证日期", tText: this.formatDate(endo.applDt) },
              { tHead: "被保证人机构代码", tText: endo.transFromBrchCode },
              { tHead: "被保证人机构名称", tText: endo.transFromBrchName },
              { tHead: "保证人机构代码", tText: endo.transToBrchCode },
              { tHead: "保证人机构名称", tText: endo.transToBrchName },
              { tHead: "保证申请备注", tText: endo.transFromRemark },
              { tHead: "保证应答备注", tText: endo.transToRemark }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } *//*else if (endo.endorType === "300315") {
            tBodyInfo.tHead = "转贴现背书";
            tColumn.push(
              { tHead: "结算日期", tText: this.formatDate(endo.signDt) },
              { tHead: "交易类型", tText: "转贴现" },
              { tHead: "卖出方机构代码", tText: endo.transFromBrchCode },
              { tHead: "卖出方机构名称", tText: endo.transFromBrchName },
              { tHead: "买入方机构代码", tText: endo.transToBrchCode },
              { tHead: "买入方机构名称", tText: endo.transToBrchName }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          }*/  else if (endo.endorType === "300316") {
            tBodyInfo.tHead = "质押式回购背书";
            tColumn.push(
              { tHead: "首期结算日", tText: this.formatDate(endo.signDt) },
              { tHead: "交易类型", tText: "质押式回购" },
              { tHead: "正回购方机构代码", tText: endo.transFromBrchCode },
              { tHead: "正回购方机构名称", tText: endo.transFromBrchName },
              { tHead: "逆回购方机构代码", tText: endo.transToBrchCode },
              { tHead: "逆回购方机构名称", tText: endo.transToBrchName },
              { tHead: "到期结算日", tText: this.formatDate(endo.dueSettleDt) },
              { tHead: "回购状态", tText: this.format("BuyBackStatus",endo.buyBackStatus) },
              { tHead: "置换状态", tText: this.format("ExchgStatus",endo.changeStatus) }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          }  else if (endo.endorType === "ET13") {
            tBodyInfo.tHead = "买断式回购（首期）背书";
            tColumn.push(
              { tHead: "首期结算日", tText: this.formatDate(endo.signDt) },
              { tHead: "交易类型", tText: "买断式回购" },
              { tHead: "正回购方机构代码", tText: endo.transFromBrchCode },
              { tHead: "正回购方机构名称", tText: endo.transFromBrchName },
              { tHead: "逆回购方机构代码", tText: endo.transToBrchCode },
              { tHead: "逆回购方机构名称", tText: endo.transToBrchName },
              { tHead: "到期结算日", tText: this.formatDate(endo.dueSettleDt) }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET17") {
            tBodyInfo.tHead = "买断式回购（到期）背书";
            tColumn.push(
              { tHead: "首期结算日", tText: this.formatDate(endo.signDt) },
              { tHead: "交易类型", tText: "买断式回购" },
              { tHead: "正回购方机构代码", tText: endo.transFromBrchCode },
              { tHead: "正回购方机构名称", tText: endo.transFromBrchName },
              { tHead: "逆回购方机构代码", tText: endo.transToBrchCode },
              { tHead: "逆回购方机构名称", tText: endo.transToBrchName },
              { tHead: "到期结算日", tText: this.formatDate(endo.dueSettleDt) }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "300319") {
            tBodyInfo.tHead = "再贴现质押式回购背书";
            tColumn.push(
              { tHead: "首期结算日", tText: this.formatDate(endo.signDt) },
              { tHead: "交易类型", tText: "再贴现质押式回购" },
              { tHead: "再贴现申请机构代码", tText: endo.transFromBrchCode },
              { tHead: "再贴现申请机构名称", tText: endo.transFromBrchName },
              { tHead: "人行再贴现机构代码", tText: endo.transToBrchCode },
              { tHead: "人行再贴现机构名称", tText: endo.transToBrchName },
              { tHead: "到期结算日", tText: this.formatDate(endo.dueSettleDt) },
              { tHead: "回购状态", tText: this.format("BuyBackStatus",endo.buyBackStatus) },
              { tHead: "置换状态", tText: this.format("ExchgStatus",endo.changeStatus) }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "300320") {
            tBodyInfo.tHead = "再贴现买断背书";
            tColumn.push(
              { tHead: "结算日期", tText: this.formatDate(endo.signDt) },
              { tHead: "交易类型", tText: "再贴现买断" },
              { tHead: "再贴现申请机构代码", tText: endo.transFromBrchCode },
              { tHead: "再贴现申请机构名称", tText: endo.transFromBrchName },
              { tHead: "人行再贴现机构代码", tText: endo.transToBrchCode },
              { tHead: "人行再贴现机构名称", tText: endo.transToBrchName }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "300321") {
            tBodyInfo.tHead = "非交易过户背书";
            tColumn.push(
              { tHead: "非交易过户日期", tText: this.formatDate(endo.signDt) },
              { tHead: "业务发起方机构代码", tText: endo.transFromBrchCode },
              { tHead: "业务发起方机构名称", tText: endo.transFromBrchName },
              { tHead: "业务接收方机构代码", tText: endo.transToBrchCode },
              { tHead: "业务接收方机构名称", tText: endo.transToBrchName },
              { tHead: "过户原因", tText: endo.returnMsg }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "300322") {
            tBodyInfo.tHead = "提示付款背书";
            tColumn.push(
              { tHead: "提示付款申请日期", tText: this.formatDate(endo.signDt) },
              { tHead: "提示付款申请机构代码", tText: endo.transFromBrchCode },
              { tHead: "提示付款申请机构名称", tText: endo.transFromBrchName },
              { tHead: "提示付款应答结果", tText: this.format("SignUpMarkCode",endo.prsttnSignCode) },
              { tHead: "提示付款拒绝原因", tText: this.format("DishonorCode",endo.payRefuseFlag) },
              { tHead: "提示付款结算结果", tText: this.format("StlResult",endo.prsttnSettleResult) },
              { tHead: "提示付款申请备注", tText: endo.transFromRemark },
              { tHead: "提示付款应答备注", tText: endo.transToRemark }
          );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "300323") {
            tBodyInfo.tHead = "电票转入背书";
            tColumn.push(
              { tHead: "转入日期", tText: this.formatDate(endo.signDt) },
              { tHead: "ECDS持有机构代码", tText: endo.transFromBrchCode },
              { tHead: "ECDS持有机构名称", tText: endo.transFromBrchName },
              { tHead: "权属转入机构代码", tText: endo.transToBrchCode },
              { tHead: "权属转入机构名称", tText: endo.transToBrchName }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "300324") {
            tBodyInfo.tHead = "追偿背书";
            tColumn.push(
              { tHead: "追偿日期", tText: this.formatDate(endo.signDt) },
              { tHead: "追偿人机构代码", tText: endo.transFromBrchCode },
              { tHead: "追偿人机构名称", tText: endo.transFromBrchName },
              { tHead: "被追偿人机构代码", tText: endo.transToBrchCode },
              { tHead: "被追偿人机构名称", tText: endo.transToBrchName }

            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          }else if (endo.endorType === "300325") {
            tBodyInfo.tHead = "转让背书（存托）信息";
            tColumn.push(
              { tHead: "转让日期", tText: this.formatDate(endo.signDt) },
              { tHead: "背书企业名称", tText: endo.transFromName },
              { tHead: "背书企业账号", tText: endo.transFromAcctNo },
              { tHead: "背书企业统一社会信用代码", tText: endo.transFromSocCode },
              { tHead: "背书人机构代码", tText: endo.transFromBrchCode },
              { tHead: "背书人机构名称", tText: endo.transFromBrchName },
              { tHead: "被背书人机构代码", tText: endo.transToBrchCode },
              { tHead: "被背书人机构名称", tText: endo.transToBrchName }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          }
        }
        this.endoInfo = endoInfoMap;
      },
      format(groupcode, key) {
        let group = this.dictMap.get(groupcode);
        if (group && key) {
          return group.get(key);
        }
        return "";
      }
    }
  };
</script>

<style scoped>

</style>
