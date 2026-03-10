<template>
  <div class="space">
    <div ref="head">
      <div class="h-t_date">
        <em>显示日期:</em>
        <span>{{ this.$moment(new Date()).format("YYYY-MM-DD HH:mm") }}</span>
      </div>
      <div class="h-t_logo" v-if="this.endoParams.billClass === 'ME02'"><img src="@/assets/ticket_logo.png"/></div>
      <h2 class="h-ticket-title">{{getTitle()}}</h2>
      <div class="h-ticket-info clearfix">
        <ul>
          <li>
            <em>票据号码:</em>
            <span>{{formatBill(endoParams.billNo)}}</span>
          </li>
          <li>
            <em></em>
            <span></span>
          </li>
          <!-- 子票区间 -->
          <li>
            <span>{{formatRange(endoParams.billRange)}}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="h-ticket-table" ref="body">
      <table>
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
          tBodyInfo.tHead = "转让背书";
          tColumn.push(
              { tHead: "背书人名称", tText: endo.applName },
              { tHead: "被背书人名称", tText: endo.rcvName },
              {
                tHead: this.$t("m.i.billInfo.banEndrsmtMark"),
                tText: this.format("BanEndorsementMarkCode", endo.banEndrsmtMark)
              },
              { tHead: "背书日期", tText: this.formatDate(endo.endrsmtDt) }
          );
          tBodyInfo.tColumn = tColumn;
          endo.tBodyInfo = tBodyInfo;
        }
        this.endoInfo = endoInfoMap;
      },
      format(groupcode, key) {
        let group = this.dictMap.get(groupcode);
        if (group && key) {
          return group.get(key);
        }
        return "";
      },
    }
  };
</script>

<style scoped>

</style>
