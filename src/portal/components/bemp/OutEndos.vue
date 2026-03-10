<template>
  <div class="space">
    <div ref="head">
      <div class="h-t_date">
        <em>显示日期:</em>
        <span v-if="this.endoParams.billClass ==='ME02' && this.endoParams.billOrigin !== 'CS01'">{{ this.$moment(new Date()).format("YYYY-MM-DD HH:mm") }}</span>
        <span v-else>{{ this.$moment(new Date()).format("YYYY-MM-DD") }}</span>
      </div>
      <div class="h-t_logo" v-if="this.endoParams.billClass === 'ME02'"><img src="data:image/png;base64,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"/></div>
      <h2 class="h-ticket-title">{{getTitle()}}</h2>
      <div class="h-ticket-info clearfix">
        <ul>
          <li>
            <em>票 据 号 码：</em>
            <span>{{ formatBill(this.endoParams.billNo, this.endoParams.billOrigin, this.endoParams.billClass) }}</span>
          </li>
        </ul>
      </div>
      <div class="h-ticket-info clearfix">
        <ul>
          <li>
            <em>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</em>
            <span>{{ formatRange(this.endoParams.billRangeStart, this.endoParams.billRangeEnd,this.endoParams.billOrigin, this.endoParams.billClass) }}</span>
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
        <tbody v-for="endo in endoInfo">
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
  import {getConnectMode} from "@/api/bizApi/commonUtil";
  export default {
    name: "OutEndos",
    data() {
      return {
        //endoInfo: [{"tBodyInfo":{"tHead":"1"}},{"tBodyInfo":{"tHead":"111"}}]
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
            billNo: "",
            billRangeStart:"",
            billRangeEnd:""
          };
        }
      },
      endoInfo:{
        type:Array
      }
    },
    watch: {

    },
    created() {
      getConnectMode().then(res => {
        this.mode = res;
      });
      console.log("111")
      console.log(this.endoInfo)
      console.log(this.endoParams)
    },
    mounted(){
      //this.showTbody=false;
      console.log("222")
      console.log(this.endoInfo)
      console.log(this.endoParams)
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
        if (this.endoParams.billClass === "ME01") {
          title += "纸质";
          title += (this.endoParams.billType === "AC01" ? "银行" : "商业");
        } else {
          title += "电子";
          if (this.endoParams.billType === "AC02") {
            title += "商业";
          } else {
            title += (this.endoParams.acptBankType === "301" ? "财务公司" : "银行");
          }
        }
        return title + "承兑汇票";
      },
      // creatEndo(endoInfoMap) {
      //   let isRecourse = false;
      //   this.endoInfo = []
      //   debugger;
      //   endoInfoMap.forEach((endo,index)=>{
      //     let tBodyInfo = {};
      //     let tColumn = [];
      //     console.log('endo.endorType:'+endo.endorType);
      //     if (endo.endorType === "ET01") {
      //       tBodyInfo.tHead = "承兑背书";
      //       tColumn.push({ tHead: "承兑日期", tText: this.formatDate(endo.signDt) });
      //       tBodyInfo.tColumn = tColumn;
      //       endo.tBodyInfo = tBodyInfo;
      //     } else if (endo.endorType === "ET18") {
      //       tBodyInfo.tHead = "权属初始登记背书";
      //       tColumn.push(
      //         { tHead: "权属登记日期", tText: this.formatDate(endo.applDt) },
      //         { tHead: "登记机构代码", tText: endo.transFromBrchCode },
      //         { tHead: "登记机构名称", tText: endo.transFromBrchName },
      //         { tHead: "备注", tText: endo.transFromRemark }
      //       );
      //       tBodyInfo.tColumn = tColumn;
      //       endo.tBodyInfo = tBodyInfo;
      //     }else if (endo.endorType === "ET02") {
      //       tBodyInfo.tHead = "保证";
      //       tColumn.push(
      //         { tHead: "保证日期", tText: this.formatDate(endo.signDt) },
      //         { tHead: "被保证人名称", tText: endo.transFromName },
      //         { tHead: "被保证人账号", tText: endo.transFromAcctNo },
      //         { tHead: "被保证人开户行行号", tText: endo.transFromBankNo },
      //         { tHead: "被保证人统一社会信用代码", tText: endo.transFromSocCode },
      //         { tHead: "被保证人备注", tText: endo.transFromRemark },
      //         { tHead: "保证人名称", tText: endo.transToName },
      //         { tHead: "保证人账号", tText: endo.transToAcctNo },
      //         { tHead: "保证人开户行行号", tText: endo.transToBankNo },
      //         { tHead: "保证人统一社会信用代码", tText: endo.transToSocCode },
      //         { tHead: "保证人地址", tText: endo.guarnteeAdr },
      //         { tHead: "保证人备注", tText: endo.transToRemark }
      //       );
      //       tBodyInfo.tColumn = tColumn;
      //       endo.tBodyInfo = tBodyInfo;
      //     } else if (endo.endorType === "ET05") {
      //       if(endo.transToAcctNo === "0"){
      //         tBodyInfo.tHead = "买断式贴现背书";
      //       }else {
      //         tBodyInfo.tHead = "转让背书";
      //       }
      //       tColumn.push(
      //         { tHead: "背书人名称", tText: endo.transFromName },
      //         { tHead: "被背书人名称", tText: endo.transToName },
      //         {
      //           tHead: this.$t("m.i.billInfo.banEndrsmtMark"),
      //           tText: this.format("BanEndorsementMarkCode", endo.banEndrsmtMark)
      //         },
      //         { tHead: "背书日期", tText: this.formatDate(endo.signDt) }
      //       );
      //       tBodyInfo.tColumn = tColumn;
      //       endo.tBodyInfo = tBodyInfo;
      //     } else if (endo.endorType === "ET02") {
      //       tBodyInfo.tHead = "保证";
      //       tColumn.push(
      //         { tHead: "被保证人名称", tText: endo.transFromName },
      //         { tHead: "保证人名称", tText: endo.transToName },
      //         { tHead: "保证人地址", tText: endo.guarnteeAdr },
      //         { tHead: "保证日期", tText: this.formatDate(endo.signDt) }
      //       );
      //       tBodyInfo.tColumn = tColumn;
      //       endo.tBodyInfo = tBodyInfo;
      //     } else if (endo.endorType === "ET03") {
      //       tBodyInfo.tHead = "质押背书";
      //       tColumn.push(
      //         { tHead: "出质人名称", tText: endo.transFromName },
      //         { tHead: "质权人名称", tText: endo.transToName },
      //         { tHead: "出质日期", tText: this.formatDate(endo.signDt) }
      //       );
      //       if (!!endo.unimpawnDt) {
      //         tColumn.push({ tHead: this.$t("m.i.common.unImpawnDt"), tText: this.formatDate(endo.unimpawnDt) });
      //       }
      //       tBodyInfo.tColumn = tColumn;
      //       endo.tBodyInfo = tBodyInfo;
      //     }  else if (endo.endorType === "ET04") {
      //       tBodyInfo.tHead = "解质押背书";
      //       tColumn.push(
      //         { tHead: "出质人名称", tText: endo.transToName },
      //         { tHead: "质权人名称", tText: endo.transFromName },
      //         { tHead: "出质日期", tText: this.formatDate(endo.signDt) }
      //       );
      //       if (!!endo.unimpawnDt) {
      //         tColumn.push({ tHead: this.$t("m.i.common.unImpawnDt"), tText: this.formatDate(endo.unimpawnDt) });
      //       }
      //       tBodyInfo.tColumn = tColumn;
      //       endo.tBodyInfo = tBodyInfo;
      //     }/*else if (endo.endorType === "201102") {
      //       tBodyInfo.tHead = "买断式贴现背书";
      //       tColumn.push(
      //         { tHead: "背书人名称", tText: endo.transFromName },
      //         { tHead: "被背书人名称", tText: endo.transToName },
      //         {
      //           tHead: this.$t("m.i.billInfo.banEndrsmtMark"),
      //           tText: this.format("BanEndorsementMarkCode", endo.banEndrsmtMark)
      //         },
      //         { tHead: "背书日期", tText: this.formatDate(endo.signDt) }
      //       );
      //       tBodyInfo.tColumn = tColumn;
      //       endo.tBodyInfo = tBodyInfo;
      //     } */else if (endo.endorType === "ET14") {
      //       tBodyInfo.tHead = "回购式贴现背书";
      //       tColumn.push(
      //         { tHead: "背书人名称", tText: endo.transFromName },
      //         { tHead: "被背书人名称", tText: endo.transToName },
      //         { tHead: "背书日期", tText: this.formatDate(endo.signDt) },
      //         { tHead: "赎回开放日", tText: this.formatDate(endo.redeemOpenDt) },
      //         { tHead: "赎回截止日", tText: this.formatDate(endo.redeemDueDt) }
      //       );
      //       tBodyInfo.tColumn = tColumn;
      //       endo.tBodyInfo = tBodyInfo;
      //     } else if (endo.endorType === "ET15") {
      //       tBodyInfo.tHead = "回购式贴现赎回背书";
      //       tColumn.push(
      //         { tHead: "背书人名称", tText: endo.transFromName },
      //         { tHead: "被背书人名称", tText: endo.transToName },
      //         {
      //           tHead: this.$t("m.i.billInfo.banEndrsmtMark"),
      //           tText: this.format("BanEndorsementMarkCode", endo.banEndrsmtMark)
      //         },
      //         { tHead: "背书日期", tText: this.formatDate(endo.signDt) }
      //       );
      //       tBodyInfo.tColumn = tColumn;
      //       endo.tBodyInfo = tBodyInfo;
      //     } else if (endo.endorType === "ET09") {
      //       tBodyInfo.tHead = "提示付款";
      //       tColumn.push(
      //         { tHead: "提示付款人名称", tText: endo.transFromName },
      //         { tHead: "提示付款日期", tText: this.formatDate(endo.applDt) },
      //         {
      //           tHead: "付款或拒付",
      //           tText: this.format("SignUpMarkCode", endo.payRefuseFlag)
      //         },
      //         { tHead: "付款或拒付日期", tText: this.formatDate(endo.signDt) },
      //         { tHead: "拒付理由", tText: this.getRefulseMsg(endo) },
      //       );
      //       tBodyInfo.tColumn = tColumn;
      //       endo.tBodyInfo = tBodyInfo;
      //     } else if (endo.endorType === "ET10") {
      //       if (isRecourse) {
      //         tBodyInfo.tHead = "再追索清偿";
      //       } else {
      //         tBodyInfo.tHead = "追索清偿";
      //         isRecourse = true;
      //       }
      //       tColumn.push(
      //         { tHead: "追索人名称", tText: endo.transFromName },
      //         { tHead: "清偿人名称", tText: endo.transToName },
      //         { tHead: "追索日期", tText: this.formatDate(endo.applDt) },
      //         {
      //           tHead: "追索类型",
      //           tText: this.format("EcdsRecourseType", endo.recourseType)
      //         },
      //         { tHead: "清偿日期", tText: this.formatDate(endo.signDt) }
      //       );
      //       tBodyInfo.tColumn = tColumn;
      //       endo.tBodyInfo = tBodyInfo;
      //     }
      //     this.endoInfo.push(endo)
      //   })
      //   console.log("表格数据")
      //   console.log(this.endoInfo)
      //   this.$forceUpdate();
      // //   //this.endoInfo = endoInfoMap;
      // //   // this.endoInfo = [{tBodyInfo:[{tHead:"背书人名称",tText:"滨江"}]}];
      // //   console.log(this.endoInfo);
      // //   console.log(endoInfoMap);
      // //   // for(let map of endoInfoMap){
      // //   //   this.endoInfo.tBodyInfo = map.tBodyInfo;
      // //   // }
      // },
      format(groupcode, key) {
        let group = this.dictMap.get(groupcode);
        if (group && key) {
          return group.get(key);
        }
        return "";
      },
      formatBill(billNo, billOrigin, billClass) {
        if (billClass === "ME02" && billOrigin !== 'CS01') {
          if (billNo !== undefined && billNo !== null && billNo !== '') {
            let str = billNo.toString().substring(0, 1) + " " +
              billNo.toString().substring(1, 13) + " " + billNo.toString().substring(13, 21)
              + " " + billNo.toString().substring(21, 29) + " " + billNo.toString().substring(29, 30);
            return str;
          } else {
            return "";
          }
        } else {
          return billNo;
        }
      },
      formatRange(value1, value2, billOrigin, billClass) {
        if (billClass === "ME02" && billOrigin !== "CS01") {
          if (value1 !== undefined && value1 !== null && value1 !== ''
            && value2 !== undefined && value2 !== null && value2 !== '') {
            let billRange = value1.toString().padLeft(12, '0') + "-" + value2.toString().padLeft(12, '0');
            return billRange;
          } else {
            return "-";
          }
        } else {
          return "";
        }
      },
      getRefulseMsg(object) {
        if (object.returnCode !== "DC09") {
          return this.format("EcdsDishonorCode", object.returnCode);
        } else {
          return object.returnMsg;
        }
      }
    }
  };
</script>

<style scoped>

</style>
