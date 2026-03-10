<!--分录详情-->
<template>
  <h-msg-box v-model="tempRecordDetailWin" width="800" :mask-closable="false" @on-close="handleClose"
             class="h-form-search-layer" :maximize="true">
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <div>
      <h-tabs type="card">
        <h-tab-pane v-for="(recordDetail,index) in recordDetails" :key="index" label="分录信息">
          <label v-html="getRecordDetail(recordDetail)"></label>
        </h-tab-pane>
      </h-tabs>
    </div>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
  export default {
    name: "acctRecordDetail",
    data() {
      return {
        recordDetails: null,
      }
    },
    props: {
      recordDetailWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      title: "",
      acctTranNo: ""
    },
    comments: {},
    watch: {
      recordDetailWin(val) {
        if (val === true) {
          this.queryAcctRecordDetail();
        }
      }
    },
    computed: {
      tempRecordDetailWin: {
        get() {
          return this.recordDetailWin;
        },
        set() {
        }
      },
      getRecordDetail() {
        return function(recordDetail) {
          if (this.tempRecordDetailWin === true) {
            let sceneHtml = `
            <span>&lt;acct_tran acct_tran_no="${recordDetail.acctTranNo}" prod_no="${recordDetail.prodNo}" event_no="${recordDetail.eventNo}" acct_model="${recordDetail.acctModel}" history_flag="${recordDetail.historyFlag}" acct_tran_name="${recordDetail.acctTranName}"&gt;</span>
            ${this.getGroupHtml(recordDetail.groupInfoDtoList)}
            <span>&lt;/acct_tran&gt;</span>
            `;
            return sceneHtml;
          }
        };
      }
    },
    methods: {
      getGroupHtml(groupList) {
        let groupHtml = "";
        for (let i = 0; i < groupList.length; i++) {
          groupHtml += `
          <div><span>&lt;group group_no="${groupList[i].groupNo}" group_name="${groupList[i].groupName}" acct_scene="${groupList[i].acctScene}" core_tran_no="${groupList[i].coreTransNo}" is_batch_acct="${groupList[i].isBatchAcct}" group_type="${groupList[i].groupType}"&gt;</span>
          ${this.getRowHtml(groupList[i].rowInfoDtoList)}
          <span>&lt;/group&gt;</span></div>
          `;
        }
        return groupHtml;
      },
      getRowHtml(rowList) {
        let rowHtml = "";
        for (let i = 0; i < rowList.length; i++) {
          rowHtml += `
          <div><span>&lt;row row_no="${rowList[i].rowNo}" row_type="${rowList[i].rowType}" subject_type="${rowList[i].subjectType == null ? "" : rowList[i].subjectType}"&gt;</span>
            ${this.getItemHtml(rowList[i].itemInfoDtoList)}
          <span>&lt;\/row&gt;</span></div>
          `;
        }
        return rowHtml;
      },
      getItemHtml(itemList) {
        let itemHtml = "";
        for (let i = 0; i < itemList.length; i++) {
          itemHtml += `
          <div><span>&lt;item item_no="${itemList[i].itemNo}" item_name="${itemList[i].itemName}" item_type="${itemList[i].itemType}">${itemList[i].express}&lt;\/item&gt;</span></div>
          `;
        }
        return itemHtml;
      },
      queryAcctRecordDetail() {
        let data = {
          "retCode": "000000",
          "retData": {
            info: [{
              "acctModel": "record_data",
              "acctTranName": "到期-质押式逆回购1",
              "acctTranNo": "30000002",
              "eventNo": "$:eventNo.equals(\"1100\")",
              "groupInfoDtoList": [
                {
                  "acctScene": "$:acctScene.equals(\"-,AC01,-,-,-,-,-\")",
                  "coreTransNo": "1472101",
                  "groupName": "质押式逆回购到期- 银承--总账A",
                  "groupNo": "1",
                  "groupType": "group_record_inner",
                  "isBatchAcct": "true",
                  "rowInfoDtoList": [{
                    "acctGroupName": "质押式逆回购到期- 银承--总账1",
                    "acctGroupNo": "1",
                    "itemInfoDtoList": [{
                      "express": "D",
                      "itemName": "方向",
                      "itemNo": "drcr",
                      "itemShow": null,
                      "itemType": "String",
                      "rowNo": null,
                      "rowType": null
                    }],
                    "rowNo": "1",
                    "rowShow": null,
                    "rowType": "acct_record",
                    "subjectType": null
                  }, {
                    "acctGroupName": "质押式逆回购到期- 银承--总账2",
                    "acctGroupNo": "1",
                    "itemInfoDtoList": [{
                      "express": "D",
                      "itemName": "方向",
                      "itemNo": "drcr",
                      "itemShow": null,
                      "itemType": "String",
                      "rowNo": null,
                      "rowType": null
                    }],
                    "rowNo": "2",
                    "rowShow": null,
                    "rowType": "acct_record",
                    "subjectType": null
                  }]
                },
                {
                  "acctScene": "$:acctScene.equals(\"-,AC01,-,-,-,-,-\")",
                  "coreTransNo": "1472102",
                  "groupName": "质押式逆回购到期- 商承--总账B",
                  "groupNo": "2",
                  "groupType": "group_record,_inner",
                  "isBatchAcct": "true",
                  "rowInfoDtoList": [{
                    "acctGroupName": "质押式逆回购到期- 商承--总账3",
                    "acctGroupNo": "2",
                    "itemInfoDtoList": [{
                      "express": "D",
                      "itemName": "方向",
                      "itemNo": "drcr",
                      "itemShow": null,
                      "itemType": "String",
                      "rowNo": null,
                      "rowType": null
                    }],
                    "rowNo": "1",
                    "rowShow": null,
                    "rowType": "acct_record",
                    "subjectType": null
                  }]
                }
              ],
              "historyFlag": "2",
              "prodNo": "$:prodNo.equals(\"00103002\")"
            }, {
              "acctModel": "record_data",
              "acctTranName": "到期-质押式逆回购2",
              "acctTranNo": "30000002",
              "eventNo": "$:eventNo.equals(\"1100\")",
              "groupInfoDtoList": [
                {
                  "acctScene": "$:acctScene.equals(\"-,AC01,-,-,-,-,-\")",
                  "coreTransNo": "1472101",
                  "groupName": "质押式逆回购到期- 银承--总账C",
                  "groupNo": "1",
                  "groupType": "group_record_inner",
                  "isBatchAcct": "true",
                  "rowInfoDtoList": [{
                    "acctGroupName": "质押式逆回购到期- 银承--总账C-1",
                    "acctGroupNo": "1",
                    "itemInfoDtoList": [{
                      "express": "D",
                      "itemName": "方向",
                      "itemNo": "drcr",
                      "itemShow": null,
                      "itemType": "String",
                      "rowNo": null,
                      "rowType": null
                    }],
                    "rowNo": "1",
                    "rowShow": null,
                    "rowType": "acct_record",
                    "subjectType": null
                  }, {
                    "acctGroupName": "质押式逆回购到期- 银承--总账C-2",
                    "acctGroupNo": "1",
                    "itemInfoDtoList": [{
                      "express": "D",
                      "itemName": "方向",
                      "itemNo": "drcr",
                      "itemShow": null,
                      "itemType": "String",
                      "rowNo": null,
                      "rowType": null
                    }],
                    "rowNo": "2",
                    "rowShow": null,
                    "rowType": "acct_record",
                    "subjectType": null
                  }]
                },
                {
                  "acctScene": "$:acctScene.equals(\"-,AC01,-,-,-,-,-\")",
                  "coreTransNo": "1472102",
                  "groupName": "质押式逆回购到期- 商承--总账D",
                  "groupNo": "2",
                  "groupType": "group_record,_inner",
                  "isBatchAcct": "true",
                  "rowInfoDtoList": [{
                    "acctGroupName": "质押式逆回购到期- 商承--总账D-1",
                    "acctGroupNo": "2",
                    "itemInfoDtoList": [{
                      "express": "D",
                      "itemName": "方向",
                      "itemNo": "drcr",
                      "itemShow": null,
                      "itemType": "String",
                      "rowNo": null,
                      "rowType": null
                    }],
                    "rowNo": "1",
                    "rowShow": null,
                    "rowType": "acct_record",
                    "subjectType": null
                  }]
                }
              ],
              "historyFlag": "2",
              "prodNo": "$:prodNo.equals(\"00103002\")"
            }]
          }
        };

        // post({acctTranNo: this.acctTranNo }, "/accoutRefreshCache/acctRecordDetail").then(res => {
        // if (res) {
        //   let retCode = res.data.retCode;
        //   if (retCode == "000000") {
        //     let data = (res.data.retData instanceof Array) ? res.data.retData : [res.data.retData];
        this.recordDetails = data.retData.info;
        //   } else {
        //     this.recordDetails = [];
        //     this.$hMessage.error("分录详情查询失败:" + res.data.retMsg);
        //   }
        // } else {
        //   this.$hMessage.error(this.$t("m.i.common.netError"));
        // }
        // });
      },
      handleClose() {
        this.$emit("recordDetailWinClose", "");
      }
    }
  };
</script>
