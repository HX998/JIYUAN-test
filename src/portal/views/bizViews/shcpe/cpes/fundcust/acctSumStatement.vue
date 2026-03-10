<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--<h-form-item :label="$t('m.i.common.brchName')" prop="branchName">
                  <h-input v-model="formItem.brchCode" v-show="false"></h-input>
                  <h-input v-model="formItem.branchName" placeholder="" readonly :title="formItem.branchName"
                           icon="android-search" @on-click="queryCpesBrchCode()"></h-input>
                </h-form-item>-->
                <show-cpes-branch v-model="formItem.brchCode" :label="$t('m.i.common.brchName')"
                                  :brchCode.sync="formItem.brchCode"  :cpesBrchName.sync="formItem.branchName"
                                  datagridUrl="/shcpe/cpes/branch/agencyInformation/func_queryBranchs"
                                  queryUrl="/shcpe/cpes/branch/agencyInformation/func_queryBranchs"></show-cpes-branch>

                <h-form-item prop="operDate" label="日期区间">
                  <h-date-picker v-model="formItem.operDate" format="yyyy-MM-dd" type="daterange" placeholder=""
                                 showFormat :editable=false @on-change="handleOperDateChange"></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/fundCust/fundCustInfo/acctSumStatement/func_queryAcctSumStatement"
            :bindForm="formItem"
            :onRowClick="handlelRowClick"
            :onSelectChange="handleSelectClick"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
            </div>
          </h-datagrid>

        </div>
      </h-col>
    </h-row>

    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="400" class="h-form-table-layer" :maximize="true">
      <p slot="header">
        <span v-if="type=='add'">{{$t("m.i.shcpe.addRoleInfo")}}</span>
        <span v-if="type=='modify'">{{$t("m.i.shcpe.modifyRoleInfo")}}</span>
        <span v-if="type=='view'">{{$t("m.i.shcpe.viewRoleInfo")}}</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.common.id')" prop="id" :required="isRequired">
            <h-input v-if="type=='view'" :value="addForm.id" class="input-boder-0" :title="addForm.id"></h-input>
            <h-input v-else v-model="addForm.id" :maxlength=60></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.memberId')" prop="memberId" :required="isRequired">
            <h-input v-if="type=='view'" :value="addForm.memberId" class="input-boder-0"
                     :title="addForm.memberId"></h-input>
            <h-input v-else v-model="addForm.memberId" :maxlength=60></h-input>
          </h-form-item>

          <h-form-item :label="'执行对账日期'" prop="compareDt" :required="isRequired">
            <h-input v-if="type=='view'" :value="addForm.compareDt" class="input-boder-0"
                     :title="addForm.compareDt"></h-input>
            <h-input v-else v-model="addForm.compareDt" :maxlength=60></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.brchCode')" prop="brchCode" :required="isRequired">
            <h-input v-if="type=='view'" :value="addForm.brchCode" class="input-boder-0"
                     :title="addForm.brchCode"></h-input>
            <h-input v-else v-model="addForm.brchCode" :maxlength=60></h-input>
          </h-form-item>

          <h-form-item :label="'票交所资金账户账号'" prop="cpesAcctNo" :required="isRequired">
            <h-input v-if="type=='view'" :value="addForm.cpesAcctNo" class="input-boder-0"
                     :title="addForm.cpesAcctNo"></h-input>
            <h-input v-else v-model="addForm.cpesAcctNo" :maxlength=60></h-input>
          </h-form-item>

          <h-form-item :label="'期初余额'" prop="beginBalanceAmt" :required="isRequired">
            <h-input v-if="type=='view'" :value="addForm.beginBalanceAmt" class="input-boder-0"
                     :title="addForm.beginBalanceAmt"></h-input>
            <h-input v-else v-model="addForm.beginBalanceAmt" :maxlength=60></h-input>
          </h-form-item>

          <h-form-item :label="'借方发生额'" prop="drChangeAmt" :required="isRequired">
            <h-input v-if="type=='view'" :value="addForm.drChangeAmt" class="input-boder-0"
                     :title="addForm.drChangeAmt"></h-input>
            <h-input v-else v-model="addForm.drChangeAmt" :maxlength=60></h-input>
          </h-form-item>

          <h-form-item :label="'借方发生笔数'" prop="drNum" :required="isRequired">
            <h-input v-if="type=='view'" :value="addForm.drNum" class="input-boder-0" :title="addForm.drNum"></h-input>
            <h-input v-else v-model="addForm.drNum" :maxlength=60></h-input>
          </h-form-item>

          <h-form-item :label="'贷方发生额'" prop="crChangeAmt" :required="isRequired">
            <h-input v-if="type=='view'" :value="addForm.crChangeAmt" class="input-boder-0"
                     :title="addForm.crChangeAmt"></h-input>
            <h-input v-else v-model="addForm.crChangeAmt" :maxlength=60></h-input>
          </h-form-item>

          <h-form-item :label="'贷方发生笔数'" prop="crNum" :required="isRequired">
            <h-input v-if="type=='view'" :value="addForm.crNum" class="input-boder-0" :title="addForm.crNum"></h-input>
            <h-input v-else v-model="addForm.crNum" :maxlength=60></h-input>
          </h-form-item>

          <h-form-item :label="'期末余额'" prop="endBalanceAmt" :required="isRequired">
            <h-input v-if="type=='view'" :value="addForm.endBalanceAmt" class="input-boder-0"
                     :title="addForm.endBalanceAmt"></h-input>
            <h-input v-else v-model="addForm.endBalanceAmt" :maxlength=60></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.createTime')" prop="createTime" :required="isRequired">
            <h-input v-if="type=='view'" :value="addForm.createTime" class="input-boder-0"
                     :title="addForm.createTime"></h-input>
            <h-input v-else v-model="addForm.createTime" :maxlength=60></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.updateTime')" prop="updateTime" :required="isRequired">
            <h-input v-if="type=='view'" :value="addForm.updateTime" class="input-boder-0"
                     :title="addForm.updateTime"></h-input>
            <h-input v-else v-model="addForm.updateTime" :maxlength=60></h-input>
          </h-form-item>

        </h-form>
      </h-panel>
      <div slot="footer" v-if="type!='view'">
        <h-button type="ghost" style="margin:0 8px" @click="addOrEditWin=!addOrEditWin">{{$t("m.i.common.close")}}
        </h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm()">{{$t("m.i.common.commit")}}</h-button>

      </div>
      <div slot="footer" v-else>
        <h-button type="primary" @click="addOrEditWin=!addOrEditWin">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>
    <h-msg-box v-model="submitWin" width="300" height="180">
      <p slot="header">
        <span>{{submitTitle}}</span>
      </p>
      <div class="h-prompt-content">
        <div class="h-prompt-top">
          <i v-if="retMsg == ''" class="icon iconfont icon-right"></i>
          <!--<i v-else class="icon iconfont icon-remind"></i>-->
          <i v-else class="icon iconfont icon-wrong"></i>
          <span>{{submitMsg}}</span>
        </div>
        <p class="h-prompt-words">{{retMsg}}</p>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="submitWin = false">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="submitWin = false">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
    <!-- 票交机构弹出框 -->
    <!--<brch-code-search :brchCodeWin="brchCodeWin" @brchCodeWinClose="brchCodeWinClose"
                      @brchCodeChange="brchCodeChange"></brch-code-search>-->
  </div>
</template>

<script>
  import { post, on, off ,formatNumber} from "@/api/bizApi/commonUtil";

  export default {
    name: "acctSumStatement",
    components: {
      //BrchCodeSearch: () => import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`),
    },
    data() {
      return {
        columns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            hiddenCol: true
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.brchName'),
            key: "brchName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.shcpe.cpesAcctNo'),
            key: "cpesAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.shcpe.beginBalanceAmt'),
            key: "beginBalanceAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let beginBalanceAmt = formatNumber(params.row.beginBalanceAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: beginBalanceAmt
                }
              }, beginBalanceAmt);
            }
          },
          {
            title: this.$t('m.i.shcpe.drChangeAmt'),
            key: "drChangeAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let drChangeAmt = formatNumber(params.row.drChangeAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: drChangeAmt
                }
              }, drChangeAmt);
            }
          },
          {
            title: this.$t('m.i.shcpe.drNum'),
            key: "drNum",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.shcpe.crChangeAmt'),
            key: "crChangeAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let crChangeAmt = formatNumber(params.row.crChangeAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: crChangeAmt
                }
              }, crChangeAmt);
            }
          },
          {
            title: this.$t('m.i.shcpe.crNum'),
            key: "crNum",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.shcpe.endBalanceAmt'),
            key: "endBalanceAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let endBalanceAmt = formatNumber(params.row.endBalanceAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: endBalanceAmt
                }
              }, endBalanceAmt);
            }
          },
          {
            title: this.$t('m.i.common.createTime'),
            key: "createTime",
            sortable: true,
            hiddenCol: false
          }
        ],
        formItem: {
          brchCode: "",
          brchNos: "",
          branchName: "",
          minoperDt: "",
          maxoperDt: "",
          operDate: ""
        },
        addForm: {
          id: "",
          memberId: "",
          compareDt: "",
          brchCode: "",
          cpesAcctNo: "",
          beginBalanceAmt: "",
          drChangeAmt: "",
          drNum: "",
          crChangeAmt: "",
          crNum: "",
          endBalanceAmt: "",
          createTime: "",
          updateTime: ""
        },

        // 是否显示新增或修改窗口
        addOrEditWin: false,
        type: null,
        readonly: false,
        isRequired: true,
        tableRef: "selfTable",
        deletDisabled: false,
        submitFlag: false,
        copyWin: false,
        //brchCodeWin: false,
        submitWin: false,
        submitMsg: "",
        submitTitle: "",
        retMsg: "",
        ifShowMore: false
      };
    },
    watch: {},

    computed: {},
    methods: {
      //关闭查询票交机构窗口
      /*brchCodeWinClose() {
        this.brchCodeWin = false;
      },*/
      //根据弹框所选数据进行赋值
      /*brchCodeChange(info) {
        if(info === null) {
          this.$msgTip.error(this, { info: "请先选择记录！" });
          return;
        }
        this.formItem.brchCode = info.brchCode;
        this.formItem.branchName = info.brchFullNameZh;
        this.brchCodeWin = false;
      },*/
      addFormReset() {
        this.$refs.addForm.resetFields();
        this.addForm.id = "";
      },
      handleMinChange(value) {
        this.formItem.minoperDt = value.replace(/-/g, "");
        // this.formItem.maxoperDt = "";
      },
      handleMaxChange(value) {
        this.formItem.maxoperDt = value.replace(/-/g, "");
      },
      //票交机构弹出框
      /*queryCpesBrchCode() {
        this.brchCodeWin = true;
      },*/
      handleAddForm(str) {
        this.type = str;
        this.readonly = false;
        this.isRequired = true;
        if (this.type == "modify" || this.type == "view") {
          let list = this.currentSelectList;
          if (list != null && list.length == 1) {
            this.currentSelectRow = this.currentSelectList[0];
          } else {
            this.$hMessage.info(this.$t("m.i.common.chooseOneData"));
            return;
          }
          this.addForm.id = this.currentSelectRow.id;
          this.addForm.memberId = this.currentSelectRow.memberId;
          this.addForm.compareDt = this.currentSelectRow.compareDt;
          this.addForm.brchCode = this.currentSelectRow.brchCode;
          this.addForm.cpesAcctNo = this.currentSelectRow.cpesAcctNo;
          this.addForm.beginBalanceAmt = this.currentSelectRow.beginBalanceAmt;
          this.addForm.drChangeAmt = this.currentSelectRow.drChangeAmt;
          this.addForm.drNum = this.currentSelectRow.drNum;
          this.addForm.crChangeAmt = this.currentSelectRow.crChangeAmt;
          this.addForm.crNum = this.currentSelectRow.crNum;
          this.addForm.endBalanceAmt = this.currentSelectRow.endBalanceAmt;
          this.addForm.createTime = this.currentSelectRow.createTime;
          this.addForm.updateTime = this.currentSelectRow.updateTime;
          if (this.type == "modify") {
            this.readonly = true;
          }
          if (this.type == "view") {
            this.isRequired = false;
          }
        } else {
          this.$nextTick(() => {
            this.addFormReset();
          });
        }
        this.addOrEditWin = true;
      },
      handlelRowClick(arr) {
        this.currentSelectRow = arr;
      },
      handleSelectClick(arr, selectInx) {
        this.unDisabled();
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
        if (arr.length == 0) return;
        if (arr[0].role_code == "admin") {
          this.deletDisabled = true;
        }
      },
      unDisabled() {
        this.deletDisabled = false;
      },
      handleOperDateChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minoperDt = arr[0].replace(/-/g, "");
          this.formItem.maxoperDt = arr[1].replace(/-/g, "");
        }else{
          this.formItem.minoperDt = "";
          this.formItem.maxoperDt = "";
        }
      },
      formSearch() {
        this.unDisabled();
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.brchCode = "";
        this.formItem.branchName = "";
        this.formItem.operDate = "";
        this.formItem.minoperDt = "";
        this.formItem.maxoperDt = "";
      },
      submitForm() {
        let btnType = this.type;
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            // 新增或修改的url[TODO:替换后与后台联调]
            let url = this.type == "add" ? "/pc/acctSumStatement/add.json" : "/pc/acctSumStatement/update.json";
            let msg = this.type == "add" ? this.$t("m.i.common.addSuccess") : this.$t("m.i.common.modifySuccess");
            let pageNo = this.type === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
            this.submitFlag = true;
            this.submitMsg = msg;
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$hMessage.success(msg);
                  this.addOrEditWin = false;
                  this.$refs.datagrid.dataChange(pageNo);
                  this.currentSelectRow = [];
                  this.currentSelectList = [];
                  this.retMsg = "";
                } else {
                  // this.$hMessage.error(this.$t('m.i.common.addFailed')+res.data.info);
                  this.$refs.datagrid.dataChange(pageNo);
                  this.submitMsg = this.type == "add" ? this.$t("m.i.common.addFailed") : this.$t("m.i.common.modifyFailed");
                  this.retMsg = res.data.retMsg;
                  this.submitWin = true;
                }
              } else {
                // this.$hMessage.error(this.$t('m.i.common.netError'))
                this.submitMsg = this.type == "add" ? this.$t("m.i.common.addFailed") : this.$t("m.i.common.modifyFailed");
                this.retMsg = this.$t("m.i.common.netError");
                this.submitWin = true;
              }

            });
          }
        });
      },
      handleComfirm() {
        let list = this.currentSelectList;
        if (list != null && list.length > 0) {
          //this.delConfirm=true;
          if (list.length > 1) {
            this.$hMessage.info(this.$t("m.i.common.onlyChooseOneData"));
            return;
          }
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmDelete") + "?",
            onOk: () => {
              this.handledel();
            }
          });
        } else {
          this.$hMessage.info(this.$t("m.i.common.chooseOneData"));
        }

      },
      handledel() {
        let list = this.currentSelectList;
        let delId = this.currentSelectList[0].id;
        post({ id: delId }, "/pc/acctSumStatement/delete.json").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$hMessage.success(this.$t("m.i.common.deleteSuccess"));
              this.$refs.datagrid.dataChange(1);
              this.currentSelectRow = [];
              this.currentSelectList = [];
              this.retMsg = "";
            } else {
              // this.$hMessage.error(this.$t('m.i.common.deleteFailed')+res.data.retMsg)
              this.$refs.datagrid.dataChange(1);
              this.submitMsg = this.$t("m.i.common.deleteFailed");
              this.retMsg = res.data.retMsg;
              this.submitWin = true;
            }
          } else {
            // this.$hMessage.error(this.$t('m.i.common.netError'))
            this.retMsg = this.$t("m.i.common.netError");
            this.submitWin = true;
          }
        });
      }

    },

  };
</script>

<style scoped>

</style>
