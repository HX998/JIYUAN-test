<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.bankNo')" prop="bankNo" :maxlength=12>
                  <h-input v-model="formItem.bankNo"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.bankName')" prop="bankName">
                  <h-input v-model="formItem.bankName" :maxlength=60></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate two-form">
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
              url="/bm/cust/bankinfo/pageQueryBankInfoList"
              :bindForm="formItem"
              :onCurrentChange="onCurrentChange"
              :onCurrentChangeCancel="onCurrentChangeCancle"
              ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleAddForm('add')" v-if="authObj.bizSetRoleAdd">
                {{$t("m.i.common.add")}}
              </h-button>
              <h-button type="primary" @click="handleAddForm('modify')" v-if="authObj.bizSetRoleAdd">
                {{$t("m.i.common.modify")}}
              </h-button>
              <h-button type="primary" @click="handleComfirm()" v-if="authObj.bizSetRoleDelete"
                        :disabled="deletDisabled">{{$t("m.i.common.delete")}}
              </h-button>
            </div>

          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" class="h-form-table-layer" :maximize="true">
      <p slot="header">
        <span v-if="type=='add'">新增银行信息</span>
        <span v-if="type=='modify'">修改银行信息</span>
        <span v-if="type=='view'">查看银行信息</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.bm.unionBankNo')" prop="bankNo" :required="isRequired" :validRules="bankNoRule">
            <h-input v-if="type=='view'" :value="addForm.bankNo" class="input-boder-0"
                     :title="addForm.bankNo"></h-input>
            <h-input v-else v-model="addForm.bankNo" :maxlength=60></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.bankNameAbbr')" prop="bankNameAbbr" :required="isRequired">
            <h-input v-if="type=='view'" :value="addForm.bankNameAbbr" class="input-boder-0"
                     :title="addForm.bankNameAbbr"></h-input>
            <h-input v-else v-model="addForm.bankNameAbbr" :maxlength=60></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.bankName')" prop="bankName" :required="isRequired">
            <h-input v-if="type=='view'" :value="addForm.bankName" class="input-boder-0"
                     :title="addForm.bankName"></h-input>
            <h-input v-else v-model="addForm.bankName" :maxlength=150></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.bankProv')" prop="bankProv" :required="isRequired">
            <h-input v-if="type=='view'" :value="addForm.bankProv" class="input-boder-0"
                     :title="addForm.bankProv"></h-input>
            <h-input v-else v-model="addForm.bankProv" :maxlength=10></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.bankCity')" prop="bankCity" :required="isRequired">
            <h-input v-if="type=='view'" :value="addForm.bankCity" class="input-boder-0"
                     :title="addForm.bankCity"></h-input>
            <h-input v-else v-model="addForm.bankCity" :maxlength=10></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.phone')" prop="phone" :required="isRequired" :validRules="phoneRule">
            <h-input v-if="type=='view'" :value="addForm.phone" class="input-boder-0"
                     :title="addForm.phone"></h-input>
            <h-input v-else v-model="addForm.phone" :maxlength=60 :placeholder="'13位以下数字或-'"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.bankFax')" prop="bankFax" :required="isRequired" :validRules="bankFaxRule">
            <h-input v-if="type=='view'" :value="addForm.bankFax" class="input-boder-0"
                     :title="addForm.bankFax"></h-input>
            <h-input v-else v-model="addForm.bankFax" :maxlength=60 :placeholder="'13位以下数字或-'"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.postCode')" prop="postCode" :required="isRequired" :validRules="postCodeRule">
            <h-input v-if="type=='view'" :value="addForm.postCode" class="input-boder-0"
                     :title="addForm.postCode"></h-input>
            <h-input v-else v-model="addForm.postCode" :maxlength=60 :placeholder="'6位数字'"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.bankAddr')" prop="bankAddr" :required="isRequired">
            <h-input v-if="type=='view'" :value="addForm.bankAddr" class="input-boder-0"
                     :title="addForm.bankAddr"></h-input>
            <h-input v-else v-model="addForm.bankAddr" :maxlength=60></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.emsAddr')" prop="emsAddr" :required="isRequired">
            <h-input v-if="type=='view'" :value="addForm.emsAddr" class="input-boder-0"
                     :title="addForm.emsAddr"></h-input>
            <h-input v-else v-model="addForm.emsAddr" :maxlength=80></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.bankSort')" prop="bankSort" :required="isRequired">
            <h-select v-if="type=='view'" :value="addForm.bankSort" class="input-boder-0" :title="addForm.bankSort">
              <h-option v-for="item in bankSortList" :value="item.key" :key="item.key">{{ item.key+"."+item.value }}
              </h-option>
            </h-select>
            <h-select v-else v-model="addForm.bankSort">
              <h-option v-for="item in bankSortList" :value="item.key" :key="item.key">{{ item.key+"."+item.value }}
              </h-option>
            </h-select>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.bankLevel')" prop="bankLevel" :required="isRequired">
            <h-select v-if="type=='view'" :value="addForm.bankLevel" class="input-boder-0" :title="addForm.bankLevel">
              <h-option v-for="item in bankLevelList" :value="item.key" :key="item.key">{{ item.key+"."+item.value }}
              </h-option>
            </h-select>
            <h-select v-else v-model="addForm.bankLevel">
              <h-option v-for="item in bankLevelList" :value="item.key" :key="item.key">{{item.key+"."+ item.value }}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.headBankNo')" prop="headBankNo" :required="isRequired">
            <h-input v-show="false" :value="addForm.headBankNo" :title="addForm.headBankNo"></h-input>
            <h-input v-if="type=='view'" :value="addForm.headBankName" class="input-boder-0"
                     :title="addForm.headBankName"></h-input>
            <h-input v-else v-model="addForm.headBankName" :maxlength=60
                     readonly icon="android-search" @on-click="queryHeadBankInfo" clearable
                     @on-clear="clearHeadBankInfo"></h-input>
          </h-form-item>


        </h-form>
      </h-panel>
      <div slot="footer" v-if="type!='view'">
        <!--<h-button type="ghost" style="margin:0 8px"  @click="addOrEditWin=!addOrEditWin">{{$t("m.i.common.close")}}</h-button>-->
        <h-button type="ghost" @click="addOrEditWin=!addOrEditWin">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm()">{{$t("m.i.common.confirm")}}</h-button>
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

    <show-head-bank :showHeadBankWin="showHeadBankWin" :title="'查看总行信息'"
                    @showHeadBankWinClose="showHeadBankWinClose" @headBankSelect="headBankSelect"></show-head-bank>
  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "bankInfo",
    components: {
      ShowHeadBank: () => import(/* webpackChunkName: "bm/cust/bankInfo/showHeadBank"*/"@/views/bizViews/bm/cust/bankInfo/showHeadBank.vue")
    },
    data() {
      let columns = [
        {
          title: " ",
          type: "radio",
          key: "danxuan",
          width: 60,
          align: "center",
          hiddenCol: true
        },
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          key: "xuhao",
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.bm.unionBankNo'),
          key: "bankNo",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.bankNameAbbr'),
          key: "bankNameAbbr",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.bankName'),
          key: "bankName",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.bankProv'),
          key: "bankProv",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.bankCity'),
          key: "bankCity",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.phone'),
          key: "phone",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.bankFax'),
          key: "bankFax",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.postCode'),
          key: "postCode",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.bankAddr'),
          key: "bankAddr",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.emsAddr'),
          key: "emsAddr",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.bankSort'),
          key: "bankSort",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "bankType", params.row.bankSort);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t('m.i.common.bankLevel'),
          key: "bankLevel",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "bankLevel", params.row.bankLevel);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t('m.i.common.custNo'),
          key: "custNo",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.headBankNo'),
          key: "headBankNo",
          hiddenCol: false
        }
      ];
      let formItem = {
        bankNo: ""
      };
      let addForm = {
        id: "",
        bankNo: "",
        bankNameAbbr: "",
        bankName: "",
        bankProv: "",
        bankCity: "",
        phone: "",
        bankFax: "",
        postCode: "",
        bankAddr: "",
        emsAddr: "",
        bankSort: "",
        bankLevel: "",
        custNo: "",
        headBankNo: "",
        headBankName: "",
        createTellerNo: "",
        createBrchNo: "",
        createBrchName: "",
        operBrchNo: "",
        operBrchName: "",
        operTellerNo: "",
        operTellerName: "",
        transplantFlag: "",
        reserve1: "",
        reserve2: "",
        reserve3: "",
        createTime: "",
        updateTime: ""
      };
      //给按钮增加权限
      let authObj = {
        bizSetRoleAdd: true, //角色添加
        bizSetRoleDelete: true, //角色删除
        bizSetRoleORight: true, //角色操作权限
        bizSetRoleARight: true, //角色授权权限
        bizRoleRightSet: true, //角色权限处理
        bizRoleRightCopy: true, //角色权限复制
        bizSetRoleDownload: true //角色信息下载
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

      function validBankNo(rule, val, callback) {
        let re = /^[0-9]{12}$/;
        if (val == null || val == "") {
          callback();
        }
        if (re.test(val)) {
          callback();
        } else {
          callback(new Error("非法输入，行号由12位数字组成"));
        }
      }

      return {
        authObj: authObj,
        // 是否显示新增或修改窗口
        addOrEditWin: false,
        formItem: formItem,
        addForm: addForm,
        columns: columns,
        branchColumns: columns,
        selectData: null,
        type: null,
        readonly: false,
        isRequired: true,
        tableRef: "selfTable",
        deletDisabled: false,
        submitFlag: false,
        copyWin: false,
        brchCodeWin: false,
        submitWin: false,
        submitMsg: "",
        submitTitle: "",
        retMsg: "",
        ifShowMore: false,
        bankLevelList: [],
        bankSortList: [
          { key: "01", value: "国有大银行" },
          { key: "02", value: "股份制商业银行" },
          { key: "03", value: "城市商业银行" },
          { key: "04", value: "外资银行" },
          { key: "05", value: "农村金融机构" },
          { key: "06", value: "其他商业银行" },
          { key: "07", value: "政策性银行" },
          { key: "08", value: "邮政储蓄银行" },
          { key: "09", value: "民营银行" },
          { key: "10", value: "财务公司" },
          { key: "11", value: "人民银行" }
        ],
        showHeadBankWin: false,
        phoneRule: [{ test: validPhone, trigger: "blur" }],
        postCodeRule: [{ test: validPostCode, trigger: "blur" }],
        bankFaxRule: [{ test: validFax, trigger: "blur" }],
        bankNoRule: [{ test: validBankNo, trigger: "blur" }],
        dictMap: new Map()
      };
    },
    methods: {
      addFormReset() {
        this.$refs.addForm.resetFields();
        this.addForm.id = "";
        this.addForm.headBankName = "";
      },
      onCurrentChange(currentRow, oldCurrentRow, _index) {
        this.selectData = currentRow;
      },
      onCurrentChangeCancle(currentRow, oldCurrentRow, _index) {
        this.selectData = null;
      },
      handleAddForm(str) {
        this.type = str;
        this.readonly = false;
        this.isRequired = true;
        if (this.type == "modify" || this.type == "view") {
          if (!this.selectData) {
            this.$hMessage.info(this.$t("m.i.common.chooseOneData"));
            return;
          }
          if (this.type == "modify") {
            this.readonly = true;
          }
          if (this.type == "view") {
            this.isRequired = false;
          }
          this.$nextTick(() => {
            this.queryObjById(this.selectData.id);
          });
        } else {
          this.$nextTick(() => {
            this.addFormReset();
          });
        }
        this.addOrEditWin = true;
      },
      queryObjById(id) {
        post({ id: id }, "/bm/cust/bankinfo/queryBankInfoById").then(res => {
          this.submitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.addForm.id = res.data.retData.id;
              this.addForm.bankNo = res.data.retData.bankNo;
              this.addForm.bankNameAbbr = res.data.retData.bankNameAbbr;
              this.addForm.bankName = res.data.retData.bankName;
              this.addForm.bankProv = res.data.retData.bankProv;
              this.addForm.bankCity = res.data.retData.bankCity;
              this.addForm.phone = res.data.retData.phone;
              this.addForm.bankFax = res.data.retData.bankFax;
              this.addForm.postCode = res.data.retData.postCode;
              this.addForm.bankAddr = res.data.retData.bankAddr;
              this.addForm.emsAddr = res.data.retData.emsAddr;
              this.addForm.bankSort = res.data.retData.bankSort;
              this.addForm.bankLevel = res.data.retData.bankLevel;
              this.addForm.custNo = res.data.retData.custNo;
              this.addForm.headBankNo = res.data.retData.headBankNo;
              this.addForm.createTellerNo = res.data.retData.createTellerNo;
              this.addForm.createBrchNo = res.data.retData.createBrchNo;
              this.addForm.createBrchName = res.data.retData.createBrchName;
              this.addForm.operBrchNo = res.data.retData.operBrchNo;
              this.addForm.operBrchName = res.data.retData.operBrchName;
              this.addForm.operTellerNo = res.data.retData.operTellerNo;
              this.addForm.operTellerName = res.data.retData.operTellerName;
              this.addForm.transplantFlag = res.data.retData.transplantFlag;
              this.addForm.reserve1 = res.data.retData.reserve1;
              this.addForm.reserve2 = res.data.retData.reserve2;
              this.addForm.reserve3 = res.data.retData.reserve3;
              this.addForm.createTime = res.data.retData.createTime;
              this.addForm.updateTime = res.data.retData.updateTime;
              this.getHeadBankInfoByNo(this.addForm.headBankNo);
            } else {
              this.$refs.datagrid.dataChange(1);
              this.submitMsg = "查询失败";
              this.retMsg = res.data.retMsg;
              this.submitWin = true;
            }
          } else {
            this.submitMsg = "查询失败";
            this.retMsg = this.$t("m.i.common.netError");
            this.submitWin = true;
          }
        });

      },
      unDisabled() {
        this.deletDisabled = false;
      },
      formSearch() {
        this.unDisabled();
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      submitForm() {
        let btnType = this.type;
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            // 新增或修改的url
            let url = this.type == "add" ? "/bm/cust/bankinfo/insertBankInfo" : "/bm/cust/bankinfo/updateBankInfo";
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
                  this.selectData = null;
                  this.retMsg = "";
                } else {
                  // this.$hMessage.error(this.$t('m.i.common.addFailed')+res.data.info);
                  this.$refs.datagrid.dataChange(1);
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
        if (this.selectData) {
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
        post({ id: this.selectData.id }, "/bm/cust/bankinfo/deleteBankInfo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$hMessage.success(this.$t("m.i.common.deleteSuccess"));
              this.$refs.datagrid.dataChange(1);
              this.selectData = null;
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
      },

      queryHeadBankInfo() {
        this.showHeadBankWin = true;
      },
      clearHeadBankInfo() {
        this.addForm.headBankNo = "";
        this.addForm.headBankName = "";
      },
      // 选择集团客户界面关闭
      showHeadBankWinClose() {
        this.showHeadBankWin = false;
      },
      // 选择集团总部客户
      headBankSelect(info) {
        this.addForm.headBankNo = info.bankNo;
        this.addForm.headBankName = info.bankName;
        this.showHeadBankWin = false;
      },

      getHeadBankInfoByNo(bankNo) {
        post({ memberBankNo: bankNo }, "/shcpe/cust/bankinfo/queryCustTopBankInfo").then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode == "000000") {
                this.addForm.headBankName = res.data.retData.list[0].memberBankName;
              } else {
                // 查询失败
                this.submitMsg = "查询失败";
                this.retMsg = res.data.retMsg;
                this.submitWin = true;
              }
            } else {
              this.retMsg = this.$t("m.i.common.netError");
              this.submitWin = true;
            }
          }
        );
      }
    },

    mounted() {
      this.getDictListByGroups("bankType,bankLevel").then(res => {
        this.bankSortList = res.get("bankType");
        this.bankLevelList = res.get("bankLevel");
        this.dictMap = res.get("map");
      });
    }
  };
</script>

<style scoped>

</style>
