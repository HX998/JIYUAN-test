<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form ref="formItem" :model="formItem" :label-width="90" class="h-form-search" cols="4">
                <div class="h-search-form-row">
                  <h-form-item prop="respMemberName" label="接收会员名称">
                    <h-input v-model="formItem.rcvMemberId" v-show="false"></h-input>
                    <h-input v-model="formItem.respMemberName" readonly icon="android-search"
                             @on-click="queryMemberId()" placeholder=""></h-input>
                  </h-form-item>
                  <!--<h-form-item prop="respBrchName" label="接收机构名称">
                    <h-input v-model="formItem.rcvBrchCode" v-show="false"></h-input>
                    <h-input v-model="formItem.respBrchName" readonly icon="android-search"
                             @on-click="queryBranchCode()" placeholder="" hidden></h-input>
                  </h-form-item>-->
                  <show-cpes-branch  :label="'接收机构名称'"
                                     :brchCode.sync="formItem.rcvBrchCode"  :cpesBrchName.sync="formItem.respBrchName"
                                     datagridUrl="/cpes/branch/queryBranchList" prop="respBrchName"
                                     queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>
                  <!--<h-form-item prop="msgId" :label="$t('m.i.common.msgId')">-->
                    <!--<h-input v-model="formItem.msgId" placeholder="" :maxlength="50"></h-input>-->
                  <!--</h-form-item>-->
                  <!--<h-form-item prop="draftDate" label="报文日期">-->
                    <!--<h-date-picker v-model="formItem.draftDate" format="yyyy-MM-dd" type="daterange" placeholder=""-->
                                   <!--showFormat :editable=false @on-change="handleDraftDateChange"></h-date-picker>-->
                  <!--</h-form-item>-->
                  <h-form-item class="h-form-operate">
                    <!--<span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"-->
                                                                                    <!--:class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>-->
                    <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                    <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/shcpe/cpes/freedraft/freeDraftInfoCheck/func_queryFreeDraftInfoCheck"
            :bindForm="formItem"
            :onCurrentChange="onCurrentChange"
            :onCurrentChangeCancel="onCurrentChangeCancle"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @on-click="showWin()" v-if="authObj.freeDraftView">
                {{$t("m.i.common.viewDatail")}}
              </h-button>
              <h-button type="primary" @on-click="checkButton('1')" v-if="authObj.freeDraftCheckPass">{{$t("m.i.common.recheckPass")}}
              </h-button>
              <h-button type="primary" @on-click="checkButton('2')" v-if="authObj.freeDraftCheckReject">{{$t("m.i.common.recheckRefuse")}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!-- 查询会员代码 -->
    <member-id-search :memberIdWin="memberIdWin" @memberIdWinClose="memberIdWinClose"
                      @memberIdWinSubmit="memberIdWinSubmit"></member-id-search>
    <!-- 查询票交机构代码 -->
    <!--<show-cpes-branch :showCpesBranch="showCpesBranch" @showCpesBranchClose="showCpesBranchClose"
                      @showCpesBranchSubmit="showCpesBranchSubmit"></show-cpes-branch>-->
    <!-- 展示自由格式具体信息 -->
    <free-draft-info-view :freeDraftView="freeDraftInfoWin" :needInfoId="needInfoId"
                          @freeDraftInfoWinClose="freeDraftInfoClose"></free-draft-info-view>
  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "freeDraftInfoCheck",
    components: {
      //ShowCpesBranch: () => import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
      FreeDraftInfoView: () => import(/* webpackChunkName: "shcpe/cpes/freedraft/freeDraftInfoView" */`@/views/bizViews/shcpe/cpes/freedraft/freeDraftInfoView`),
      MemberIdSearch: () => import(/* webpackChunkName: "sm/auth/legalperson/memberIdSearch" */`@/views/bizViews/sm/auth/legalperson/memberIdSearch`)

    },

    data() {
      return {
        formItem: {
          msgId: "",
          rcvMemberId: "",
          rcvBrchCode: "",
          respMemberName: "",
          respBrchName: "",
          minMsgTime: "",
          maxMsgTime: "",
          draftDate: ""
        },
        authObj: {
          freeDraftView: true,
          freeDraftCheckPass: true,
          freeDraftCheckReject: true
        },
        columns: [
          {
            title: " ",
            type: "radio",
            hiddenCol: false,
            width: 60,
            align: "center"
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            align: "center",
            width: 60,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.content'),
            key: "content",
            align: "center",
            hiddenCol: false
          },
          {
            title: "主键",
            key: "id",
            hiddenCol: true,
            align: "center"
          },
          // {
          //   title: this.$t('m.i.common.msgId'),
          //   key: "msgId",
          //   align: "center",
          //   hiddenCol: false
          // },
          // {
          //   title: "报文时间",
          //   key: "createDtTm",
          //   align: "center",
          //   hiddenCol: false,
          //   sortable: true,
          //   render: (h, params) => {
          //     if (null != params.row.createDtTm && "" !== params.row.createDtTm) {
          //       let dttm = this.$moment(params.row.createDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
          //       return h("span", dttm);
          //     }
          //   }
          // },
          {
            title: "发出会员代码",
            key: "applMemberId",
            hiddenCol: true,
            align: "center"
          },
          {
            title: "发出会员名称",
            key: "applMemberName",
            align: "center",
            hiddenCol: false

          },
          {
            title: "发出机构代码",
            key: "applBrchCode",
            hiddenCol: true,
            align: "center"
          },
          {
            title: "发出机构名称",
            key: "applBrchName",
            align: "center",
            sortable: true,
            hiddenCol: false

          },
          {
            title: "接收会员代码",
            key: "rcvMemberId",
            hiddenCol: true,
            align: "center"
          },
          {
            title: "接收会员名称",
            key: "respMemberName",
            align: "center",
            hiddenCol: false

          },
          {
            title: "接收机构代码",
            key: "rcvBrchCode",
            hiddenCol: true,
            align: "center"
          },
          {
            title: "接收机构名称",
            key: "respBrchName",
            align: "center",
            hiddenCol: false

          },
          {
            title: "附件",
            key: "haveAttFile",
            hiddenCol: false,
            align: "center",
            render: (h, params) => {
              let flag = params.row.haveAttFile;
              if (flag === "0") {
                return h("span", "无");
              } else if (flag === "1") {
                return h("span", "有");
              }
            }
          },
          {
            title: this.$t("m.i.common.operStatus"),
            key: "sendStatus",
            hiddenCol: false,
            align: "center",
            render: (h, params) => {
              let flag = params.row.sendStatus;
              switch (flag) {
                case "1":
                  return h("span", "发送中");
                case "2":
                  return h("span", "发送成功");
                case "3":
                  return h("span", "发送失败");
                case "4":
                  return h("span", "已接收");
                case "5":
                  return h("span", "复核驳回");
                default :
                  return h("span", "");
              }
            }
          },
          {
            title: "处理结果",
            key: "errorMsg",
            hiddenCol: false,
            align: "center"

          }
        ],
        pageInfo: {
          pageNo: 1,
          pageSize: 10
        },
        freeDraftInfoWin: false,
        memberIdWin: false,
        //showCpesBranch: false,
        needMemberId: "",
        needInfoId: "",
        currentSelectRow: null,
        moveUpDisabled: false,
        moveDownDisabled: false,
        tableRef: "selfTable",

        ifShowMore: false
      };
    },
    watch: {},

    computed: {},
    mounted() {
      this.handleResize1();
      on(window, "resize", this.handleResize1);
    },
    methods: {
      handleResize1() {
        this.$nextTick(() => {
          this.$refs.datagrid.selfAdaption();
        });
      },
      /*showCpesBranchClose() {
        this.showCpesBranch = false;
      },*/
      //根据弹框所选数据进行赋值
      /*showCpesBranchSubmit(info) {
        if (info === null) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.formItem.rcvBrchCode = info.brchCode;
        this.formItem.respBrchName = info.brchFullNameZh;
        this.showCpesBranch = false;
      },*/
      memberIdWinClose() {
        this.memberIdWin = false;
      },
      //根据弹框所选数据进行赋值
      memberIdWinSubmit(info) {
        if (info === null) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.formItem.rcvMemberId = info.memberId;
        this.formItem.respMemberName = info.memberName;
        this.memberIdWin = false;
      },
      freeDraftInfoClose(info) {
        this.freeDraftInfoWin = false;
      },
      handleDraftDateChange(arr) {
        if (arr && arr.length == 2) {
          this.formItem.minMsgTime = arr[0].replace(/-/g, "");
          this.formItem.maxMsgTime = arr[1].replace(/-/g, "");
        } else {
          this.formItem.minMsgTime = "";
          this.formItem.maxMsgTime = "";
        }
      },
      handleSearch() {
        this.unDisabled();
        this.currentSelectRow = null;
        this.$refs.datagrid.dataChange(1);
      },
      unDisabled() {
        this.moveUpDisabled = false;
        this.moveDownDisabled = false;
      },
      //重置查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.rcvMemberId = "";
        this.formItem.rcvBrchCode = "";
        this.formItem.respBrchName = "";
      },
      //查询会员代码弹窗
      queryMemberId() {
        this.memberIdWin = true;
      },
      //查询总行票交机构代码弹窗
      /*queryBranchCode() {
        this.showCpesBranch = true;
      },*/
      onCurrentChange(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = currentRow;
      },
      onCurrentChangeCancle(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = null;
      },
      showWin() {
        if (!this.currentSelectRow) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        this.needInfoId = this.currentSelectRow.id;
        this.freeDraftInfoWin = true;
      },

      checkButton(checkStatus) {
        if (!this.currentSelectRow) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        let title = checkStatus === "1" ? "发起自由格式报文复核通过" : "发起自由格式报文复核拒绝";
        let content = checkStatus === "1" ? "确定要复核通过吗?" : "确定要复核拒绝吗?";
        let freeDraftInfoId = this.currentSelectRow.id;
        this.$hMsgBox.confirm({
          title: title,
          content: content,
          onOk: () => {
            post({
              id: freeDraftInfoId,
              checkStatus: checkStatus
            }, "/shcpe/cpes/freedraft/freeDraftInfoCheck/func_checkFreeDraftInfo").then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retData = res.data.retData;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this, { info: this.$t('m.i.common.actionSuccess') });
                  this.$refs.datagrid.dataChange(1);
                } else {
                  this.$msgTip.error(this, { info: msg });
                  this.$refs.datagrid.dataChange(1);
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
