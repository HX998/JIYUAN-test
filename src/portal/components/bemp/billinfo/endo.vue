<template>
  <div class="space">
    <div ref="head">
      <div class="h-t_date">
        <em>显示日期:</em>
        <span v-if="this.endoParams.billClass ==='ME02' && this.endoParams.billOrigin !== 'CS01'">{{ this.$moment(new Date()).format("YYYY-MM-DD HH:mm") }}</span>
        <span v-else>{{ this.$moment(new Date()).format("YYYY-MM-DD") }}</span>
      </div>
      <div class="h-t_logo"><img src="@/assets/ticket_logo.png"/></div>
      <h2 class="h-ticket-title">{{ getTitle() }}</h2>
      <div class="h-ticket-info clearfix">
        <ul>
          <li>
            <em>票 据 号 码：</em>
            <h-tooltip content="单击复制票号" placement="top-end">
              <span @click="copy">{{ formatBill(this.endoParams.billNo, this.endoParams.billOrigin, this.endoParams.billClass) }}</span>
            </h-tooltip>
          </li>
        </ul>
      </div>
      <div class="h-ticket-info clearfix">
        <ul>
          <li>
            <em></em>
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
        <tbody v-for="endo in endoInfo" v-if="!!endo.tBodyInfo">
        <tr>
          <td colspan="2" class="th tac h-fs14">{{ endo.tBodyInfo.tHead }}</td>
        </tr>
        <tr v-for="column in endo.tBodyInfo.tColumn">
          <td class="th">{{ column.tHead }}</td>
          <td>{{ column.tText }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  export default {
    name: "endo",
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
            billNo: "",
            billOrigin: "",
          };
        }
      }
    },
    methods: {
      copy() {
        var oInput = document.createElement("input");
        oInput.value = this.endoParams.billNo;
        document.body.appendChild(oInput);
        oInput.select();//选择对象
        document.execCommand("copy");//执行浏览器复制命令
        document.body.removeChild(oInput);
        this.$msgTip.success(this, { info: "票号已复制" });
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
      dealUnimpawnDt(endo) {
        if (endo.assBusiInfo1) {
          return this.formatDate(endo.assBusiInfo1);
        } else {
          if (endo.extSelfData && endo.billRangeEnd) {
            let dt = '';
            let extselfdata = JSON.parse(endo.extSelfData);
            let billRangeEnd = this.endoParams.billRangeEnd+"";
            Object.keys(extselfdata).forEach(keys => {
              //js获取json字符串value的第三种方式
              //打印出来的Object.keys(obj)的值为["id","name"]
              //此时获取到的keys是字符串类型的键值，也就是"id""name"
              if (keys === billRangeEnd) {
                dt =  this.formatDate(extselfdata[keys]);
              }
            })
            return dt;
          } else {
            return ''
          }
        }
      },

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
      creatEndo(endoInfoMap) {
        for (let endo of endoInfoMap) {
          let tBodyInfo = {};
          let tColumn = [];
          if (endo.endorType === "ET05_01") {
            tBodyInfo.tHead = endo.billEndorTypeName;
            tColumn.push(
              {tHead: "背书人名称", tText: endo.transFromName},
              {tHead: "被背书人名称", tText: endo.transToName},
              {tHead: "不得转让标记", tText: this.format("BanEndorsementMarkCode", endo.banEndrsmtMark)},
              {tHead: "背书日期", tText: this.formatDate(endo.signDt)},
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET02") {
            tBodyInfo.tHead = endo.billEndorTypeName;
            tColumn.push(
              {tHead: "被保证人名称", tText: endo.transFromName},
              {tHead: "保证人名称", tText: endo.transToName},
              {tHead: "保证人地址", tText: endo.otherInfo},
              {tHead: "保证日期", tText: this.formatDate(endo.signDt)},
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET03") {
            tBodyInfo.tHead = endo.billEndorTypeName;
            tColumn.push(
              {tHead: "出质人名称", tText: endo.transFromName},
              {tHead: "质权人名称", tText: endo.transToName},
              {tHead: "出质日期", tText: this.formatDate(endo.signDt)},
              {tHead: "质押解除日期", tText: this.dealUnimpawnDt(endo)}
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET05_02") {
            tBodyInfo.tHead = endo.billEndorTypeName;
            tColumn.push(
              {tHead: "背书人名称", tText: endo.transFromName},
              {tHead: "被背书人名称", tText: endo.transToName},
              {tHead: "不得转让标记", tText: this.format("BanEndorsementMarkCode", endo.banEndrsmtMark)},
              {tHead: "背书日期", tText: this.formatDate(endo.signDt)}
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET14") {
            tBodyInfo.tHead = endo.billEndorTypeName;
            tColumn.push(
              {tHead: "背书人名称", tText: endo.transFromName},
              {tHead: "被背书人名称", tText: endo.transToName},
              {tHead: "背书日期", tText: this.formatDate(endo.signDt)},
              {tHead: "赎回开放日", tText: this.formatDate(endo.assBusiInfo1)},
              {tHead: "赎回截止日", tText: this.formatDate(endo.assBusiInfo2)}
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET15") {
            tBodyInfo.tHead = endo.billEndorTypeName;
            tColumn.push(
              {tHead: "背书人名称", tText: endo.transFromName},
              {tHead: "被背书人名称", tText: endo.transToName},
              {tHead: "不得转让标记", tText: this.format("BanEndorsementMarkCode", endo.banEndrsmtMark)},
              {tHead: "背书日期", tText: this.formatDate(endo.signDt)}
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET05_03" || endo.endorType === "ET11" || endo.endorType === "ET18") {
            tBodyInfo.tHead = endo.billEndorTypeName;
            tColumn.push(
              {tHead: "背书人名称", tText: endo.transFromName},
              {tHead: "被背书人名称", tText: endo.transToName},
              {tHead: "背书日期", tText: this.formatDate(endo.signDt)}
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET19") {
            tBodyInfo.tHead = endo.billEndorTypeName;
            tColumn.push(
              {tHead: "背书人名称", tText: endo.transFromName},
              {tHead: "被背书人名称", tText: endo.transToName},
              {tHead: "背书日期", tText: this.formatDate(endo.signDt)}
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET20") {
            tBodyInfo.tHead = endo.billEndorTypeName;
            tColumn.push(
              {tHead: "背书人名称", tText: endo.transFromName},
              {tHead: "被背书人名称", tText: endo.transToName},
              {tHead: "背书日期", tText: this.formatDate(endo.signDt)}
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET13") {
            tBodyInfo.tHead = endo.billEndorTypeName;
            tColumn.push(
              {tHead: "背书人名称", tText: endo.transFromName},
              {tHead: "被背书人名称", tText: endo.transToName},
              {tHead: "背书日期", tText: this.formatDate(endo.signDt)}
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET17") {
            tBodyInfo.tHead = endo.billEndorTypeName;
            tColumn.push(
              {tHead: "背书人名称", tText: endo.transFromName},
              {tHead: "被背书人名称", tText: endo.transToName},
              {tHead: "背书日期", tText: this.formatDate(endo.signDt)}
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET05_04") {
            tBodyInfo.tHead = endo.billEndorTypeName;
            tColumn.push(
              {tHead: "背书人名称", tText: endo.transFromName},
              {tHead: "被背书人名称", tText: endo.transToName},
              {tHead: "背书日期", tText: this.formatDate(endo.signDt)}
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET21") {
            tBodyInfo.tHead = endo.billEndorTypeName;
            tColumn.push(
              {tHead: "背书人名称", tText: endo.transFromName},
              {tHead: "被背书人名称", tText: endo.transToName},
              {tHead: "背书日期", tText: this.formatDate(endo.signDt)}
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET22") {
            tBodyInfo.tHead = endo.billEndorTypeName;
            tColumn.push(
              {tHead: "背书人名称", tText: endo.transFromName},
              {tHead: "被背书人名称", tText: endo.transToName},
              {tHead: "背书日期", tText: this.formatDate(endo.signDt)}
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET09") {
            tBodyInfo.tHead = endo.billEndorTypeName;
            tColumn.push(
              {tHead: "提示付款人名称", tText: endo.transFromName},
              {tHead: "提示付款日期", tText: this.formatDate(endo.applDt)},
              {
                tHead: "付款或拒付",
                tText: this.format("SignUpMarkCode", endo.signFlag)
              },
              {tHead: "付款或拒付日期", tText: this.formatDate(endo.signDt)},
              {tHead: "拒付理由", tText: this.getRefulseMsg(endo, this.endoParams.billOrigin, endo.inOutFlag)},
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET10_01" || endo.endorType === "ET10_02") {
            tBodyInfo.tHead = endo.billEndorTypeName;
            tColumn.push(
              {tHead: "追索人名称", tText: endo.transFromName},
              {tHead: "清偿人名称", tText: endo.transToName},
              {tHead: "追索日期", tText: this.formatDate(endo.applDt)},
              {
                tHead: "追索类型",
                tText: this.recourseTypeFormat(endo.busiType,endo.subEndorType)
              },
              {tHead: "清偿日期", tText: this.formatDate(endo.signDt)}
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET05_05") {
            tBodyInfo.tHead = endo.billEndorTypeName;
            tColumn.push(
              {tHead: "背书人名称", tText: endo.transFromName},
              {tHead: "被背书人名称", tText: endo.transToName},
              {tHead: "背书日期", tText: this.formatDate(endo.signDt)},
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET05_06") {
            tBodyInfo.tHead = endo.billEndorTypeName;
            tColumn.push(
              {tHead: "背书人名称", tText: endo.transFromName},
              {tHead: "被背书人名称", tText: endo.transToName},
              {tHead: "背书日期", tText: this.formatDate(endo.signDt)},
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          }
        }
        this.endoInfo = endoInfoMap;
      },
      recourseTypeFormat(busiType, subEndorType) {
        if (busiType == "BC14") {
          return "拒付追索";
        } else if (busiType == "BC15") {
          return "非拒付追索";
        } else if (subEndorType == "NES.013.20.10P" || subEndorType == "NES.012.20.32P") {
          return "拒付追索";
        } else if (subEndorType == "NES.013.20.11P" || subEndorType == "NES.013.20.01P") {
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
      getRefulseMsg(object, billOrigin, inOutFlag) {
        if (billOrigin === 'CS01' && inOutFlag == "1") {
          if (object.signCode !== "DC09") {
            return this.format("EcdsDishonorCode", object.signCode);
          } else {
            return object.otherInfo;
          }
        } else {
          if (object.signCode !== "CP06") {
            return this.format("DishonorCode", object.signCode);
          } else {
            return object.otherInfo;
          }
        }
      }
    }
  };
</script>

<style scoped>

</style>
