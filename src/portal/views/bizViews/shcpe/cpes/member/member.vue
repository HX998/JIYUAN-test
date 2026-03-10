<!--全市场会员信息查询-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <!--右侧数据展示表格-->
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.memberId')" prop="memberIdLike">
                  <h-input v-model="formItem.memberIdLike" :maxlength="6"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.memberName')" prop="memberName">
                  <h-input v-model="formItem.memberName" :maxlength="60"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.shcpe.memberTypeCode')" prop="memberTypeCode">
                  <h-select v-model="formItem.memberTypeCode" placeholder="">
                    <h-option v-for="item in memberTypeList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.shcpe.memberStatus')" prop="memberStatus">
                  <h-select v-model="formItem.memberStatus" placeholder="">
                    <h-option v-for="item in memberStatusList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.shcpe.isPlatform')" prop="platformFlag">
                  <h-select v-model="formItem.platformFlag" placeholder="">
                    <h-option v-for="item in yonList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                  :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch('1')">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/cpes/member/queryMemberList"
            :bindForm="formItem"
            :onSelectChange="handleSelectClick"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="viewDatail()">
                {{$t("m.i.common.viewDatail")}}
              </h-button>
              <h-button type="primary" @click="handleEditForm()">{{$t("m.i.common.modify")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--点击查看详情弹出窗-->
    <h-msg-box v-model="viewDatailWin" width="800" :mask-closable="false" :maximize="true">
      <p slot="header">
        <span>会员详情</span>
      </p>
      <h-tabs value="viewDatail" :model="viewDatailForm">
        <h-tab-pane label="会员信息" name="memberInfo">
          <h-form>
            <div class="text-wrap mb-10">
              <div class="text-body">
                <h-row :gutter="12">
                  <h-col span="12">
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.common.memberName')}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.memberName}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">会员类别代码:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.memberTypeCode}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">变更/操作时间:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.operTime}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{this.$t("m.i.common.updateTime")}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.updateTime}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">证书SN:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.certSn}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">财务公司ECDS线上清算权限:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.settleConfirm}}</h-col>
                    </h-row>
                  </h-col>

                  <h-col span="12">
                    <h-row>
                      <h-col span="9" class="label">会员大额行号:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.memberBankNo}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">清算模式:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.clearMode}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.common.createTime')}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.createTime}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">证书DN:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.certDn}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">上一个DN:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.lastCertDn}}</h-col>
                    </h-row>
                  </h-col>
                </h-row>

              </div>
            </div>
          </h-form>
        </h-tab-pane>
      </h-tabs>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="viewDatailWin =! viewDatailWin">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>
    <!--点击修改弹出窗-->
    <h-msg-box v-model="editWin" width="800" :mask-closable="false" @on-close="handleWinClose"
               :maximize="true">
      <p slot="header">
        <span>修改会员信息</span>
      </p>
      <h-form :model="editForm" :label-width="130" ref="editForm" cols="2" class="h-form-search">
        <div class="h-search-form-row">
          <h-form-item :label="$t('m.i.common.memberId')" prop="memberId">
            <h-input :value="editForm.memberId" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.memberName')" prop="memberName">
            <h-input :value="editForm.memberName" readonly></h-input>
          </h-form-item>
        </div>
        <div class="h-search-form-row">
          <h-form-item :label="$t('m.i.shcpe.memberTypeCode')" prop="memberTypeCode">
            <h-select v-model="editForm.memberTypeCode" readonly placeholder="">
              <h-option v-for="item in memberTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.memberBankNo')" prop="memberBankNo">
            <h-input :value="editForm.memberBankNo" readonly></h-input>
          </h-form-item>
        </div>
        <div class="h-search-form-row">
          <h-form-item :label="$t('m.i.shcpe.clearMode')" prop="clearMode">
            <h-select v-model="editForm.clearMode" readonly placeholder="">
              <h-option v-for="item in clearModeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.memberStatus')" prop="memberStatus">
            <h-select v-model="editForm.memberStatus" readonly placeholder="">
              <h-option v-for="item in memberStatusList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
        </div>
        <h-form-item :label="$t('m.i.shcpe.isPlatform')" prop="isPlatform" required>
          <h-select v-model="editForm.isPlatform" placeholder="">
            <h-option v-for="item in yonList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
          </h-select>
        </h-form-item>
      </h-form>
      <div slot="footer">
        <h-button type="ghost" @click="editWin=!editWin">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm">{{$t("m.i.common.commit")}}</h-button>

      </div>
    </h-msg-box>
  </div>
</template>
<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "member",
    data() {
      return {
        formItem: {
          memberId: "",
          memberIdLike: "",
          memberName: "",
          memberTypeCode: "",
          memberStatus: "",
          platformFlag: ""
        },
        editForm: {
          id: "",
          memberId: "",
          memberName: "",
          memberTypeCode: "",
          memberStatus: "",
          memberBankNo: "",
          clearMode: "",
          operTime: "",
          isClearCheck: "",
          createTime: "",
          updateTime: "",
          isPlatform: "",
          altrnTp: "",
          certDn: "",
          lastCertDn: "",
          certSn: "",
          changeCode: "",
          aplStatus: "",
          settleConfirm: "",
          memberSysStatus: ""
        },
        viewDatailForm: {
          id: "",
          memberId: "",
          memberName: "",
          memberTypeCode: "",
          memberStatus: "",
          memberBankNo: "",
          clearMode: "",
          clearModeName: "",
          operTime: "",
          isClearCheck: "",
          createTime: "",
          updateTime: "",
          isPlatform: "",
          altrnTp: "",
          certDn: "",
          lastCertDn: "",
          certSn: "",
          changeCode: "",
          aplStatus: "",
          settleConfirm: "",
          memberSysStatus: ""
        },

        pageInfo: {
          pageNo: 1,
          pageSize: 10
        },
        spanLeft: 4,
        spanRight: 20,
        tableRef: "selfTable",
        columns: [
          {
            title: " ",
            type: "radio",
            align: "center",
            width: 50
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: "id",
            key: "id",
            hiddenCol: true
          },
          {
            title: this.$t("m.i.common.memberId"),
            key: "memberId",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.memberName"),
            key: "memberName",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.shcpe.memberTypeCode"),
            key: "memberTypeCode",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "MemberType", params.row.memberTypeCode);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.common.memberBankNo"),
            key: "memberBankNo",
            hiddenCol: false,
            width: 120,
            ellipsis: false
          },
          {
            title: this.$t("m.i.shcpe.clearMode"),
            key: "clearMode",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "ClearMode", params.row.clearMode);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.shcpe.isPlatform"),
            key: "isPlatform",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isPlatform);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.shcpe.isClearCheck"),
            key: "isClearCheck",
            ellipsis: false,
            width: 130,
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isClearCheck);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.shcpe.memberStatus"),
            key: "memberStatus",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "UserBrchStatus", params.row.memberStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.shcpe.memberSysStatus"),
            key: "memberSysStatus",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "StsCode", params.row.memberSysStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          }
        ],
        currentSelectRow: [],
        currentSelectList: [],
        currentSelectRowInx: [],
        dictMap: new Map(),
        memberTypeList: [],
        clearModeList: [],
        yonList: [],
        memberStatusList: [],
        type: null,
        readonly: false,
        isRequired: true,
        editWin: false,
        viewDatailWin: false,
        ifShowMore: false,
        submitFlag: false,
        id: null
      };
    },
    components: {},
    watch: {},

    computed: {},
    methods: {
      formSearch() {
        this.currentSelectRow = [];
        this.currentSelectList = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      handleSelectClick(arr, selectInx) {
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
        if (arr.length == 0) {
          return;
        }
      },
      handleCurrentChange(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = [];
      },
      // 查看详情
      viewDatail() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (this.currentSelectRow.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        let id = this.currentSelectRow.id;
        post({ id: id }, "/cpes/member/member/func_queryMember").then(res => {
          if (res.data.retCode === "000000") {
            this.viewDatailForm = res.data.retData;
            this.viewDatailForm.memberTypeCode = this.getDictValueFromMap(this.dictMap, "MemberType", res.data.retData.memberTypeCode);
            this.viewDatailForm.clearMode = this.getDictValueFromMap(this.dictMap, "ClearMode", res.data.retData.clearMode);
            this.viewDatailForm.operTime = this.$moment(res.data.retData.operTime, "YYYY-MM-DD").format("YYYY-MM-DD");
            this.viewDatailForm.createTime = this.$moment(res.data.retData.createTime, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
            this.viewDatailForm.updateTime = this.$moment(res.data.retData.updateTime, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
            this.viewDatailForm.settleConfirm = formatterSettleConfirm(res.data.retData.settleConfirm);
          }
          this.viewDatailWin = true;
        }).catch(error => {
          this.$hMessage.error({
            content: this.$t("m.i.common.netError") + error,
            duration: 5,
            closable: true
          });
        });
        this.viewDatailWin = true;
      },
      //修改全市场会员
      handleEditForm() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (this.currentSelectRow.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        let id = this.currentSelectRow.id;
        post({ id: id }, "/cpes/member/member/func_queryMember").then(res => {
          if (res.data.retCode === "000000") {
            this.editForm = res.data.retData;
          }
        }).catch(error => {
          this.$hMessage.error({
            content: this.$t("m.i.common.netError") + error,
            duration: 5,
            closable: true
          });
        });
        this.editWin = true;
      },
      submitForm() {
        this.$refs["editForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = "/cpes/member/member/func_updateMember";
            let msg = this.$t("m.i.common.modifySuccess");
            post(this.editForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$hMessage.success(msg);
                  this.editWin = false;
                  this.$refs.datagrid.dataChange(1);
                  this.currentSelectRow = [];
                  this.currentSelectList = [];
                } else {
                  let msg = this.$t("m.i.common.modifyFailed");
                  this.$hMessage.error(msg + ":" + res.data.retMsg);
                }
              } else {
                this.$hMessage.error(this.$t("m.i.common.netError"));
              }
            });
          }
        });
      },
      handleWinClose() {
        this.$refs.editForm.resetFields();
      }
    },
    mounted() {
      this.getDictListByGroups("MemberType,ClearMode,Yon,UserBrchStatus,StsCode").then(res => {
        this.memberTypeList = res.get("MemberType");
        this.clearModeList = res.get("ClearMode");
        this.yonList = res.get("Yon");
        this.memberStatusList = res.get("UserBrchStatus");
        this.dictMap = res.get("map");
      });
    }
  };
  function formatterSettleConfirm(value) {
    if (value == null || value == "") {
      return "";
    }
    switch (value) {
      case"1":
        return "有";
      case"2":
        return "无";
    }
  }
</script>
