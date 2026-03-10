<template>
  <div class="space">
    <div ref="head">
      <div class="h-ticket-info clearfix">
        <ul>
          <li>
            <em>{{$t('m.i.billInfo.billNo')}}:</em>
            <span ref="billNo">{{this.billNo}}</span>
          </li>
        </ul>
      </div>
      <div>
        <h-form :model="queryForm" ref="queryFormItem"></h-form>
        <h-row>
          <h-col span="24">
            <div class="h-t_logo"><em>发出查询</em></div>
            <h-datagrid
              :columns="queryColumns"
              :auto-load="false"
              highlight-row
              url="/pe/cbtrc/billTransQuery/pBillTransQuery/func_pagingQueryBillSendQueryRecord"
              :bindForm="queryForm" height="200"
              ref="sendQueryDatagrid">
            </h-datagrid>
          </h-col>
          <h-col span="24">
            <div class="h-t_logo"><em>收到查询</em></div>
            <h-datagrid
              :columns="queryColumns"
              :auto-load="false"
              highlight-row
              url="/pe/cbtrc/billTransQuery/pBillTransQuery/func_pagingQueryBillRecvQueryRecord"
              :bindForm="queryForm" height="200"
              ref="recvQueryDatagrid">
            </h-datagrid>
          </h-col>
        </h-row>
      </div>
    </div>
  </div>
</template>

<script>
  import { getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "InqrepUpbs",
    data() {
      return {
        queryForm: {
          billNo: this.billNo
        },
        queryColumns: [
          {
            title: this.$t('m.i.pc.queryType'),
            key: "queryType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "UpbsQueryType", params.row.queryType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }, {
            title: this.$t('m.i.common.status'),
            key: "queryAnswerStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "UpbsQueryAnswerStatus", params.row.queryAnswerStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }, {
            title: this.$t('m.i.pc.queryBookNo'),
            key: "queryBookNo",
            hiddenCol: false
          }, {
            title: this.$t('m.i.pc.queryDt'),
            key: "queryDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.queryDt == null || params.row.queryDt === "") {
                return "";
              }
              let date = this.$moment(params.row.queryDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          }, {
            title: this.$t('m.i.pc.queryContent'),
            key: "queryContent",
            hiddenCol: false
          }, {
            title: this.$t('m.i.pc.answerBookNo'),
            key: "answerBookNo",
            hiddenCol: false
          }, {
            title: this.$t('m.i.pc.replyDt'),
            key: "replyDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.replyDt == null || params.row.replyDt === "") {
                return "";
              }
              let date = this.$moment(params.row.replyDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          }, {
            title: this.$t('m.i.pc.replyContent'),
            key: "replyContent",
            hiddenCol: false
          }, {
            title: this.$t('m.i.pc.payFromBankNo'),
            key: "payFromBankNo",
            hiddenCol: false
          }, {
            title: this.$t('m.i.pc.payToBankNo'),
            key: "payToBankNo",
            hiddenCol: false
          }
        ]
      };
    },
    props: {
      dictMap: {
        type: Map
      },
      billNo:String,
    },
    methods: {
      handleSearch(billNo) {
        this.queryForm.billNo = billNo;
        this.$nextTick(() => {
          this.$refs.sendQueryDatagrid.dataChange(1);
          this.$refs.recvQueryDatagrid.dataChange(1);
        });
      }
    },
    computed: {
    }
  };
</script>

<style scoped>

</style>
