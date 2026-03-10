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
                  <h-form-item prop="aplMemberName" label="发出会员名称">
                    <h-input v-model="formItem.aplMemberName" readonly icon="android-search"
                             @on-click="queryMemberId()" placeholder=""></h-input>
                  </h-form-item>
                  <!--<h-form-item prop="aplBrchName" label="发出机构名称">
                    <h-input v-model="formItem.aplBrchName" readonly icon="android-search"
                             @on-click="queryBranchCode()" placeholder="" hidden></h-input>
                  </h-form-item>-->
                  <show-cpes-branch  :label="'发出机构名称'"
                                     :brchCode.sync="formItem.applBrchCode"  :cpesBrchName.sync="formItem.aplBrchName"
                                     datagridUrl="/cpes/branch/queryBranchList" prop="aplBrchName"
                                     queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

                  <h-form-item prop="msgId" :label="$t('m.i.common.msgId')">
                    <h-input v-model="formItem.msgId" placeholder="" :maxlength="50"></h-input>
                  </h-form-item>
                  <h-form-item prop="draftDate" label="报文日期">
                    <h-date-picker v-model="formItem.draftDate" format="yyyy-MM-dd" type="daterange" placeholder=""
                                   showFormat :editable=false @on-change="handleDraftDateChange"></h-date-picker>
                  </h-form-item>
                  <h-form-item v-show="false" prop="applBrchCode">
                    <h-input v-model="formItem.applBrchCode"></h-input>
                  </h-form-item>
                  <h-form-item v-show="false" prop="applMemberId">
                    <h-input v-model="formItem.applMemberId"></h-input>
                  </h-form-item>
                  <h-form-item class="h-form-operate">
                    <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
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
            url="/shcpe/cpes/freedraft/freeDraftInfoRcv/func_queryRcvFreeDraftInfo"
            :bindForm="formItem"
            :onCurrentChange="onCurrentChange"
            :onCurrentChangeCancel="onCurrentChangeCancle"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @on-click="showWin()" v-if="authObj.freeDraftView">
                {{$t("m.i.common.viewDatail")}}
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
    name: "freeDraftInfoRcv",
    components: {
      //ShowCpesBranch: () => import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
      FreeDraftInfoView: () => import(/* webpackChunkName: "shcpe/cpes/freedraft/freeDraftInfoView" */`@/views/bizViews/shcpe/cpes/freedraft/freeDraftInfoView`),
      MemberIdSearch: () => import(/* webpackChunkName: "sm/auth/legalperson/memberIdSearch" */`@/views/bizViews/sm/auth/legalperson/memberIdSearch`)

    },
    data() {
      return {
        formItem: {
          msgId: "",
          applMemberId: "",
          applBrchCode: "",
          aplMemberName: "",
          aplBrchName: "",
          minMsgTime: "",
          maxMsgTime: "",
          draftDate: ""
        },
        authObj: {
          freeDraftView: true
        },
        columns: [
          {
            title: " ",
            type: "radio",
            width: 60,
            hiddenCol: false,
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
            title: "主键",
            key: "id",
            hiddenCol: true,
            align: "center"
          },
          {
            title: this.$t('m.i.common.msgId'),
            key: "msgId",
            hiddenCol: false,
            align: "center"
          },
          {
            title: "报文时间",
            key: "createDtTm",
            hiddenCol: false,
            align: "center",
            sortable: true,
            render: (h, params) => {
              if (null != params.row.createDtTm && "" !== params.row.createDtTm) {
                let dttm = this.$moment(params.row.createDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
                return h("span", dttm);
              }
            }
          },
          {
            title: "发出会员代码",
            key: "applMemberId",
            hiddenCol: true,
            align: "center"
          },
          {
            title: "发出会员名称",
            key: "applMemberName",
            hiddenCol: false,
            align: "center"

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
            hiddenCol: false,
            sortable: true,
            align: "center"

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
            hiddenCol: false,
            align: "center"

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
            hiddenCol: false,
            align: "center"

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
        tableRef: "selfTable",

        ifShowMore: false
      };
    },
    methods: {
      /*showCpesBranchClose() {
        this.showCpesBranch = false;
      },*/
      //根据弹框所选数据进行赋值
     /* showCpesBranchSubmit(info) {
        if (info === null) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.formItem.applBrchCode = info.brchCode;
        this.formItem.aplBrchName = info.brchFullNameZh;
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
        this.formItem.applMemberId = info.memberId;
        this.formItem.aplMemberName = info.memberName;
        this.memberIdWin = false;
      },
      freeDraftInfoClose() {
        this.freeDraftInfoWin = false;
      },
      handleDraftDateChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minMsgTime = arr[0].replace(/-/g, "");
          this.formItem.maxMsgTime = arr[1].replace(/-/g, "");
        }else{
          this.formItem.minMsgTime = "";
          this.formItem.maxMsgTime = "";
        }
      },
      handleSearch() {
        this.currentSelectRow = null;
        this.$refs.datagrid.dataChange(1);
      },
      //重置查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.applBrchCode = "";
        this.formItem.aplBrchName = "";
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
        this.freeDraftInfoWin = true;
        this.needInfoId = this.currentSelectRow.id;
      },
      getParams(){
        if (this.$route.path === "/shcpe/cpes/freedraft/freeDraftInfoRcv") {
          if (this.$route.query.draftDate) {
            let draftDate = this.$moment(this.$route.query.draftDate, "YYYY-MM-DD").format("YYYY-MM-DD");
            this.formItem.draftDate = [draftDate, draftDate];
            this.$nextTick(() => {
              this.handleSearch();
            });
          }
        }
      }
    },
    watch: {
      "$route": "getParams"
    },
    mounted() {
      this.$nextTick(()=>{
        this.getParams();
      });
    }
  };
</script>

<style scoped>

</style>
