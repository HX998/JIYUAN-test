<!--行内机构信息维护-->
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
                <h-form-item :label="$t('m.i.common.brchFullNameZh')" prop="brchFullNameZh">
                  <h-input v-model="formItem.brchFullNameZh" :maxlength="60"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.brchCode')" prop="brchCodeLike">
                  <h-input v-model="formItem.brchCodeLike" :maxlength="9"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.transBrchBankNo')" prop="transBrchBankNoLike">
                  <h-input v-model="formItem.transBrchBankNoLike" :maxlength="12"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.shcpe.brchStatus')" prop="brchStatus">
                  <h-select v-model="formItem.brchStatus" placeholder="">
                    <h-option v-for="item in brchStatusList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.status')" prop="status">
                  <h-select v-model="formItem.status" placeholder="">
                    <h-option v-for="item in statusList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}
                    <i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i>
                  </span>
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
            url="/cpes/branchmodify/branchModify/func_pageQueryBranchModifyList"
            :paramId="'brchId'"
            :bindForm="formItem"
            :onSelectChange="handleSelectClick"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="modifyInnerBranch()">{{$t("m.i.common.modify")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!--点击修改弹出窗-->
    <h-msg-box v-model="modifyWin" width="800" :mask-closable="false" @on-close="handleModifyWinClose"
               :maximize="true">
      <p slot="header">
        <span>修改票交所机构</span>
      </p>
      <h-form :model="modifyForm" :label-width="130" ref="modifyForm" cols="2" class="h-form-search">
        <!--机构代码-->
        <common-input v-model="modifyForm.brchCode" :label="$t('m.i.common.brchCode')" prop="brchCode" readonly></common-input>
        <!--机构中文全称-->
        <common-input v-model="modifyForm.brchFullNameZh" :label="$t('m.i.common.brchFullNameZh')" prop="brchFullNameZh" readonly></common-input>
        <!--机构行号-->
        <common-input v-model="modifyForm.transBrchBankNo" :label="$t('m.i.common.transBrchBankNo')" prop="transBrchBankNo" readonly></common-input>
        <!--法定代表人或责任人-->
        <common-input v-model="modifyForm.transCorpReg" :label="$t('m.i.shcpe.transCorpReg')" prop="transCorpReg"
                      :maxlength="60" :lengthByByte="false" required></common-input>
        <!--注册资本-->
        <common-type-field :label="$t('m.i.shcpe.transRegistCapital')" v-model="modifyForm.transRegistCapital"
                           prop="transRegistCapital" :integerNum="13" :suffixNum="2"
                           placeholder="最多13位整数,2位小数" :bigTips="false"></common-type-field>
        <!--地址-->
        <common-input v-model="modifyForm.address" :label="$t('m.i.common.address')" prop="address" :maxlength="60"
                      :lengthByByte="false" required></common-input>
        <!--联系人-->
        <common-input v-model="modifyForm.linkMan" :label="$t('m.i.shcpe.linkMan')" prop="linkMan" :maxlength="20"
                      :lengthByByte="false" required></common-input>
        <!--电话-->
        <common-input v-model="modifyForm.phone" :label="$t('m.i.common.phone')" prop="phone" :validRules="phoneRule"
                      :maxlength="20" required></common-input>
        <!--传真-->
        <common-input v-model="modifyForm.custFax" :label="$t('m.i.common.fax')" prop="custFax" :maxlength="20"
                      :validRules="bankFaxRule" required></common-input>
        <!--邮编-->
        <common-input v-model="modifyForm.postCode" :label="$t('m.i.common.postCode')" prop="postCode"
                      :validRules="postCodeRule" required></common-input>
        <!--备注-->
        <common-input v-model="modifyForm.cpesBrchRemark" :label="$t('m.i.common.remark')" prop="cpesBrchRemark"
                      type="textarea" :rows="3" :maxlength="150" :lengthByByte="false"></common-input>
        <!--电子邮箱-->
        <common-input v-model="modifyForm.email" :label="$t('m.i.bs.email')" prop="email" :maxlength="75" :placeholder="'字母，数字或英文符号'"></common-input>
      </h-form>
      <div slot="footer">
        <h-button type="ghost" @click="handleModifyWinClose">{{$t("m.i.common.cancle")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitModifyForm">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

  </div>
</template>
<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";
  import CommonInput from "../../../../../components/bemp/input/commonInput";

  export default {
    name: "branchModify",
    data() {
      return {
        formItem: {
          brchFullNameZh: "",
          brchCodeLike: "",
          transBrchBankNoLike: "",
          brchStatus: "",
          status: ""
        },
        modifyForm: {
          id: "",
          memberId: "",
          brchCode: "",
          transBrchBankNo: "",
          brchFullNameZh: "",
          transCorpReg: "",
          transRegistCapital: "",
          address: "",
          linkMan: "",
          phone: "",
          custFax: "",
          postCode: "",
          email: "",
          cpesBrchRemark: "",
          status: "",
          dealPrcMsg: "",
          brchType: "",
          brchStatus: "",
          brchId: ""
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
            title: this.$t("m.i.common.brchCode"),
            key: "brchCode",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.common.transBrchBankNo"),
            key: "transBrchBankNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.common.brchFullNameZh"),
            key: "brchFullNameZh",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.common.brchType"),
            key: "brchType",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "BrchType", params.row.brchType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.common.bankProv"),
            key: "transProvinceCode",
            ellipsis: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "Province", params.row.transProvinceCode);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.shcpe.brchStatus"),
            key: "brchStatus",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "UserBrchStatus", params.row.brchStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.common.status"),
            key: "status",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "ModifyStatus", params.row.status);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.common.dealPrcMsg'),
            key: "dealPrcMsg",
            hiddenCol: false
          }
        ],
        currentSelectRow: [],
        currentSelectList: [],
        currentSelectRowInx: [],
        dictMap: new Map(),
        brchStatusList: [],
        statusList: [],
        type: null,
        modifyWin: false,
        ifShowMore: false,
        submitFlag: false,
        id: null,
        modifyId: null,
        phoneRule: [{ test: validPhone, trigger: "blur" }],
        postCodeRule: [{ test: validPostCode, trigger: "blur" }],
        bankFaxRule: [{ test: validFax, trigger: "blur" }],
        emailRule: ["email"]
      };
      function validPhone(rule, val, callback) {
        let re = /^[0-9_-]{1,13}$/;
        if (val == null || val == "") {
          callback();
        }
        if (re.test(val)) {
          callback();
        } else {
          callback(new Error("非法输入，电话号码为小于等于13位的数字或-组成"));
        }
      }

      function validFax(rule, val, callback) {
        let re = /^[0-9_-]{1,13}$/;
        if (val == null || val == "") {
          callback();
        }
        if (re.test(val)) {
          callback();
        } else {
          callback(new Error("非法输入，传真为小于等于13位的数字或-组成"));
        }
      }

      function validPostCode(rule, val, callback) {
        let re = /^[0-9]{6}$/;
        if (val == null || val == "") {
          callback();
        }
        if (re.test(val)) {
          callback();
        } else {
          callback(new Error("非法输入，邮编由6位数字组成"));
        }
      }
    },
    components: {CommonInput},
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
      // 修改
      modifyInnerBranch() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (this.currentSelectRow.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        let brchCode = this.currentSelectRow.brchCode;
        post({brchCode: brchCode}, "/cpes/branchmodify/branchModify/func_getBranchModifyDto").then(res => {
          if (res.data.retCode === "000000") {
            this.modifyForm = res.data.retData;
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
        this.modifyWin = true;
      },
      handleModifyWinClose() {
        this.modifyWin = false;
        this.$refs.modifyForm.resetFields();
      },
      submitModifyForm() {
        this.$refs["modifyForm"].validate(valid => {
          if (valid) {
            this.$hMsgBox.confirm({
              title: this.$t("m.i.common.confirm"),
              content: "确认向票交所发送机构修改信息吗？",
              onOk: () => {
                this.sendInnerBranchModify();
              }
            });
          }
        });
      },
      sendInnerBranchModify() {
        this.submitFlag = true;
        post(this.modifyForm, "/cpes/branchmodify/branchModify/func_sendBranchModify").then(res => {
          this.submitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.handleModifyWinClose();
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      }
    },
    mounted() {
      this.getDictListByGroups("BrchType,UserBrchStatus,Province,ModifyStatus").then(res => {
        this.brchStatusList = res.get("UserBrchStatus");
        this.statusList = res.get("ModifyStatus");
        this.dictMap = res.get("map");
      });
    }
  };
</script>
