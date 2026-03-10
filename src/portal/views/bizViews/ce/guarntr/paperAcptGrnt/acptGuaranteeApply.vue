<!--承兑保证登记申请-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.ownedBrchNos" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" title="机构名称"
                             :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames" v-if="this.licenseFlag" :params="{authPath: this.authPath}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree" queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item :label="$t('m.i.billInfo.billNo')" prop="billNo">
                  <h-input v-model="formItem.billNo" :maxlength="30"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.rangeApplDt')" prop="guarnteeDt">
                  <h-date-picker v-model="formItem.guarnteeDt" type="date" showFormat :editable=false
                                 placeholder=""></h-date-picker>
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
            url="/pb/guarntr/paperAcptGrnt/acptGuaranteeApply/func_list"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :has-select="false"
            :auto-load="false"
            rowSelect
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="acptGrntEdit('add')" v-if="authObj.acptGrntAddAuth">单笔新增</h-button>
              <h-button type="primary" @click="acptGrntEdit('modify')"
                        v-if="authObj.acptGrntModifyAuth">
                {{$t("m.i.common.modify")}}
              </h-button>
              <h-button type="primary" @click="acptGrntDelete" v-if="authObj.acptGrntDeleteAuth">
                {{$t("m.i.common.delete")}}
              </h-button>
              <h-button type="primary" @click="templateDownload" v-if="authObj.templateDownloadAuth">
                {{$t("m.i.common.templateDownload")}}
              </h-button>
              <h-button type="primary" @click="batchImport" v-if="authObj.batchImportAuth">
                {{$t("m.i.common.batchImport")}}
              </h-button>
              <h-button type="primary" @click="submitRecheck" v-if="authObj.submitRecheckAuth">
                {{$t("m.i.common.submitCheck")}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" :mask-closable="false" @on-close="handleWinClose"
               class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span v-if="type==='add'">新增承兑保证登记信息</span>
        <span v-if="type==='modify'">修改承兑保证登记信息</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="2" class="h-form-search">
          <show-branch v-model="addForm.ownedBrchNo" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNo" title="机构名称"
                       :filterable="this.type==='add'" :required="isRequired" :showCheckBox="false" v-show="this.licenseFlag" :msgBoxWin="addOrEditWin"
                       :brchNo.sync="addForm.ownedBrchNo" :brchName.sync="addForm.ownedBrchName" :params="{authPath: this.authPath}" @brchNoChange="licenseBrchNoChange"
                       url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree" queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
          </show-branch>
          <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType" :required="isRequired">
            <h-select v-model="addForm.billType" placeholder="" v-if="type==='add'" showTitle>
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-select v-model="addForm.billType" placeholder="" v-if="type==='modify'" readonly showTitle>
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billNo')" prop="billNo" :required="isRequired" :validRules="billNoRule">
            <h-input v-model="addForm.billNo" :maxlength="16" v-if="type==='add'"></h-input>
            <h-input v-model="addForm.billNo" :maxlength="16" v-if="type==='modify'" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.billMoney')" prop="billMoney" :required="isRequired">
            <h-typefield type="money" v-model="addForm.billMoney" :maxlength="20" placeholder="数字，小数位最多2位"
                         @on-blur="formatBillMoney('blur')" @on-focus="formatBillMoney('focus')"></h-typefield>
          </h-form-item>
          <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')" :required="isRequired">
            <h-date-picker v-model="addForm.dueDt" type="date" showFormat :editable=false
                           placeholder=""></h-date-picker>
          </h-form-item>
          <h-form-item prop="openBankNo" :label="$t('m.i.billInfo.acptBankNo')" :required="isRequired" :validRules="acptBankNoRule">
            <h-input v-model="addForm.openBankNo" :maxlength="12" placeholder="12位数字"></h-input>
          </h-form-item>
          <h-form-item prop="guarnteeDt" :label="$t('m.i.be.rangeApplDt')" :required="isRequired">
            <h-date-picker v-model="addForm.guarnteeDt" type="date" showFormat :editable=false
                           placeholder=""></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.guarantorBankNo')" prop="acptGuarntrBankNo" :required="isRequired">
            <h-input v-model="addForm.acptGuarntrBankNo" :maxlength="12" placeholder="12位数字" readonly></h-input>
          </h-form-item>
          <h-form-item prop="acptGuarntrBankName" :label="$t('m.i.ce.guarantorBankName')" :required="isRequired">
            <h-input v-model="addForm.acptGuarntrBankName" :maxlength="126" readonly></h-input>
          </h-form-item>
          <h-form-item prop="guarntrApplRemark" :label="$t('m.i.common.remark')"  class="h-form-height-auto" :validRules="reqRemarkRule">
            <h-input type="textarea" :rows=3 v-model="addForm.guarntrApplRemark" :canResize="false"
                     :maxlength="300"></h-input>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <div slot="footer">
          <h-button type="ghost" @click="handleWinClose">{{$t("m.i.common.close")}}</h-button>
          <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
          <h-button type="primary" v-else @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
        </div>
      </div>
    </h-msg-box>
    <!--文件批量导入-->
    <common-file-upload :importWin="importWin" :fileParams="fileParams" @importWinClose="importWinClose"
                        @importSuccess="importSuccess"></common-file-upload>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                    :billNo="this.billNo"></bill-info-main>
  </div>
</template>

<script>
  import { on, off, post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "acptGuaranteeApply",
    data() {
      return {
        authObj: {
          acptGrntAddAuth: true,        //单笔新增
          acptGrntModifyAuth: true,     //修改
          acptGrntDeleteAuth: true,     //删除
          templateDownloadAuth: true,   //模板下载
          batchImportAuth: true,        //批量导入
          submitRecheckAuth: true       //提交复核
        },
        columns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            key: "duoxuan",
            ellipsis: false,
            hiddenCol: false
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
            key: "ownedBrchNo",
            hiddenCol: true
          },
          {
            title: this.$t("m.i.common.ownedBrchNo"),
            key: "ownedBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let info = "", type = "";
              if (!!params.row.billId) {
                info = params.row.billId;
                type = "billId";
              } else {
                info = params.row.billNo;
                type = "billNo";
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(info, type);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.ce.billMoney"),
            key: "billMoney",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.billMoney, 2, ",");
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.dueDt == null ? "" : this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.acptBankNo"),
            key: "openBankNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.ce.guarntrDt"),
            key: "guarnteeDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.guarnteeDt == null ? "" : this.$moment(params.row.guarnteeDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.guarantorBankName"),
            key: "acptGuarntrBankName",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.billInfo.dataSource"),
            key: "isInnerChannel",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isInnerChannel);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }
        ],
        formItem: {
          billNo: "",
          guarnteeDt: "",
          applStatusList: ["GR01", "GR06", "GR09"],
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          operSite: "1", //申请
          authPath: this.$route.path
        },
        addForm: {
          id: "",
          billId: "",
          billType: "",
          billNo: "",
          billMoney: "",
          dueDt: "",
          openBankNo: "",
          guarnteeDt: "",
          acptGuarntrBankNo: this.$store.getters.userInfo.bankNo,
          acptGuarntrBankName: this.$store.getters.userInfo.brchName,
          guarntrApplRemark: "",
          isInnerChannel: "1",
          ownedBrchNo:this.$store.getters.userInfo.brchNo,
          ownedBrchName:this.$store.getters.userInfo.brchName,
          licenseFlag:false,
        },
        billNoRule: [{ test: this.validBillNo, trigger: "blur" }],
        acptBankNoRule: [{ test: /^[0-9]{12}$/, trigger: "blur", message: "承兑人开户行行号由12位数字组成" }],
        type: "",
        isRequired: true,
        addOrEditWin: false,
        submitFlag: false,
        currentSelectRow: null,
        billTypeList: [],
        dictMap: new Map(),
        importWin: false,
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        licenseFlag: false,
        authPath: this.$route.path,
        fileParams: {
          loadExcelUrl: window.LOCAL_CONFIG.API_HOME + "/pb/guarntr/paperAcptGrnt/acptGuaranteeApply/func_import",  //导入excel数据解析接口
          fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/pb/guarntr/paperAcptGrnt/acptGuaranteeApply/func_submitExcelData",  //excel数据导入接口
          formItem: {},           //请求表格数据时附带参数
          uploadParams: {},       //调用excel数据解析接口时附带的额外参数
          extraGridDatas: {},     //需在反显数据中额外添加的字段
          columns: [
            {
              type: "radio",
              title: " ",
              width: 60,
              align: "center",
              hiddenCol: false
            },
            {
              type: "index",
              title: this.$t("m.i.common.index"),
              width: 60,
              align: "center"
            },
            {
              title: this.$t("m.i.billInfo.billType"),
              key: "billType",
              ellipsis: false,
              hiddenCol: false,
              render: (h, params) => {
                let list = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
                return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
              }
            },
            {
              title: this.$t("m.i.billInfo.billNo"),
              key: "billNo",
              ellipsis: false,
              hiddenCol: false,
              sortable: true,
                render: (h, params) => {
                    let info = "", type = "";
                    if (!!params.row.billId) {
                        info = params.row.billId;
                        type = "billId";
                    } else {
                        info = params.row.billNo;
                        type = "billNo";
                    }
                    return h("a", {
                        on: {
                            click: () => {
                                this.showBillInfo(info, type);
                            }
                        }
                    }, params.row.billNo);
                }
            },
            {
              title: this.$t("m.i.ce.billMoney"),
              key: "billMoney",
              hiddenCol: false,
              ellipsis: false,
              sortable: true,
              render: (h, params) => {
                let billMoney = formatNumber(params.row.billMoney, 2, ",");
                return h("span", {
                  domProps: {
                    title: billMoney
                  }
                }, billMoney);
              }
            },
            {
              title: this.$t("m.i.billInfo.dueDt"),
              key: "dueDt",
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                let date = params.row.dueDt == null ? "" : this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", date);
              }
            },
            {
              title: this.$t("m.i.billInfo.acptBankNo"),
              key: "openBankNo",
              hiddenCol: false,
              ellipsis: false
            },
            {
              title: this.$t("m.i.ce.guarntrDt"),
              key: "guarnteeDt",
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                let date = params.row.guarnteeDt == null ? "" : this.$moment(params.row.guarnteeDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", date);
              }
            },
            {
              title: this.$t("m.i.common.remark"),
              key: "guarntrApplRemark",
              hiddenCol: false,
              ellipsis: false
            },
            {
              title: this.$t("m.i.ce.guarantorBankNo"),
              key: "acptGuarntrBankNo",
              hiddenCol: false,
              ellipsis: false
            },
            {
              title: this.$t("m.i.ce.guarantorBankName"),
              key: "acptGuarntrBankName",
              hiddenCol: false,
              ellipsis: false
            }
          ],
          paramKey: "list"         //后台接收对应key
        },
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        reqRemarkRule: [{ test: this.validateReqRemark, trigger: "blur" }],
      };
    },
    components: {
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`)

    },
    computed: {
      billNoPlaceholder() {
        return this.addForm.billType === "AC01" ? "银票号码为16位数字,第四位为0,第七位为5" : "商票号码为16位数字,第四位为0,第七位为6";
      }
    },
    watch: {
      "addForm.billType": function (val) {
        if (this.addForm.billNo) {
          this.$refs.addForm.validateField("billNo");
        }
      },
    },
    methods: {
      validateReqRemark(rule, value, callback) {
        if(value){
          if(value.length>150){
            callback(new Error("备注长度不能超过150个字符"));
          }else{
            callback();
          }
        }else{
          callback();
        }
      },
      validBillNo(rule, val, callback) {
        if (this.addForm.billType === "AC01") {
          let re = /^[0-9]{3}0[0-9]{2}[5][0-9]{9}$/;
          if (re.test(val)) {
            callback();
          } else {
            callback(new Error("银票号码为16位数字,第四位为0,第七位为5"));
          }
        } else if (this.addForm.billType === "AC02") {
          let re = /^[0-9]{3}0[0-9]{2}[6][0-9]{9}$/;
          if (re.test(val)) {
            callback();
          } else {
            callback(new Error("商票号码为16位数字,第四位为0,第七位为6"));
          }
        } else {
          callback(new Error("请选择票据种类"));
        }
      },
      formSearch() {
        this.currentSelectRow = [];
        this.formItem.guarnteeDt = this.formItem.guarnteeDt.replace(/-/g, "");
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
        this.$refs.formItem.resetFields();
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      handleWinClose() {
        this.addOrEditWin = false;
        this.addForm.id = "";
        this.addForm.billId = "";
        this.$refs.addForm.resetFields();
      },
      formatBillMoney(optType) {
        if (optType === "blur") {
          if (!isNaN(parseFloat(this.addForm.billMoney)) && isFinite(this.addForm.billMoney)) {
            this.addForm.billMoney = this.addForm.billMoney == null ? "0.00" : formatNumber(this.addForm.billMoney, 2, ",");
          }
        } else if (optType === "focus") {
          this.addForm.billMoney = this.addForm.billMoney.toString().replace(/,/g, "");
        }
      },
      //新增/修改承兑保证登记申请
      acptGrntEdit(str) {
        this.type = str;
        this.isRequired = true;
        if (this.type === "modify") {
          if (this.$refs.datagrid.selects != null && this.$refs.datagrid.selects.length == 1) {
            this.$nextTick(() => {
              this.addForm.id = this.$refs.datagrid.selects[0].id;
              this.addForm.billId = this.$refs.datagrid.selects[0].billId;
              this.addForm.billType = this.$refs.datagrid.selects[0].billType;
              this.addForm.billNo = this.$refs.datagrid.selects[0].billNo;
              this.addForm.billMoney = this.$refs.datagrid.selects[0].billMoney == null ? "0.00" : formatNumber(this.$refs.datagrid.selects[0].billMoney, 2, ",");
              if (this.$refs.datagrid.selects[0].dueDt != null && this.$refs.datagrid.selects[0].dueDt !== "") {
                this.addForm.dueDt = this.$moment(this.$refs.datagrid.selects[0].dueDt, "YYYYMMDD").format("YYYY-MM-DD");
              }
              this.addForm.openBankNo = this.$refs.datagrid.selects[0].openBankNo;
              if (this.$refs.datagrid.selects[0].guarnteeDt != null && this.$refs.datagrid.selects[0].guarnteeDt !== "") {
                this.addForm.guarnteeDt = this.$moment(this.$refs.datagrid.selects[0].guarnteeDt, "YYYYMMDD").format("YYYY-MM-DD");
              }
              this.addForm.acptGuarntrBankNo = this.$refs.datagrid.selects[0].acptGuarntrBankNo;
              this.addForm.acptGuarntrBankName = this.$refs.datagrid.selects[0].acptGuarntrBankName;
              this.addForm.guarntrApplRemark = this.$refs.datagrid.selects[0].guarntrApplRemark;
              this.addForm.ownedBrchNo = this.$refs.datagrid.selects[0].ownedBrchNo;
              this.addForm.ownedBrchName = this.$refs.datagrid.selects[0].ownedBrchName;
            });
          } else {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            this.addOrEditWin = false;
            return;
          }
        } else {
          this.$nextTick(() => {
            this.addFormReset();
          });
        }
        this.addOrEditWin = true;
      },
      addFormReset() {
        this.addForm.id = "";
        this.addForm.billId = "";
        this.addForm.ownedBrchNo = this.$store.getters.userInfo.brchNo;;
        this.addForm.ownedBrchName = this.$store.getters.userInfo.brchName;
        this.$refs.addForm.resetFields();
      },
      //删除承兑保证登记申请
      acptGrntDelete() {
        if (this.$refs.datagrid.selects != null && this.$refs.datagrid.selects.length !== 0) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmDelete") + "?",
            onOk: () => {
              this.handleDel();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      handleDel() {
        // let id = this.$refs.datagrid.selects[0].id;
        let ids = Array();
        for (let i = 0; i < this.$refs.datagrid.selects.length; i++) {
          ids.push(this.$refs.datagrid.selects[i].id);
        }
        post({ ids: ids }, "/pb/guarntr/paperAcptGrnt/acptGuaranteeApply/func_del").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //模板下载
      templateDownload() {
        let url = window.LOCAL_CONFIG.API_HOME + "/pb/guarntr/paperAcptGrnt/acptGuaranteeApply/func_download";
        let form = document.createElement("form");
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "post");
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      },
      //批量导入
      batchImport() {
        this.importWin = true;
      },
      importWinClose() {
        this.importWin = false;
      },
      importSuccess() {
        this.importWin = false;
        this.$refs.datagrid.dataChange(1);
      },
      //提交复核
      submitRecheck() {
        if (this.$refs.datagrid.selects != null && this.$refs.datagrid.selects.length !== 0) {
          this.$hMsgBox.confirm({
            title: "确认",
            content: "确定提交复核吗？",
            onOk: () => {
              this.handleRecheck();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      handleRecheck() {
        let ids = Array();
        for (let i = 0; i < this.$refs.datagrid.selects.length; i++) {
          ids.push(this.$refs.datagrid.selects[i].id);
        }
        post({ ids: ids }, "/pb/guarntr/paperAcptGrnt/acptGuaranteeApply/func_submitCheck").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(1);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      submitForm() {
        this.addForm.billMoney = this.addForm.billMoney.toString().replace(/,/g, "");
        this.addForm.dueDt = this.addForm.dueDt.replace(/-/g, "");
        this.addForm.guarnteeDt = this.addForm.guarnteeDt.replace(/-/g, "");
        this.addForm.licenseFlag = this.licenseFlag;
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = this.type === "add" ? "/pb/guarntr/paperAcptGrnt/acptGuaranteeApply/func_add" : "/pb/guarntr/paperAcptGrnt/acptGuaranteeApply/func_update";
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.addOrEditWin = false;
                  let pageNo = this.type === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
                  this.$refs.datagrid.dataChange(pageNo);
                  this.currentSelectRow = [];
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      showBillInfo(info, type) {
        this.billId = "";
        this.billNo = "";
        if (type === "billId") {
          this.billId = info;
        } else {
          this.billNo = info;
        }
        this.showBillInfoWin = true;
      },


      licenseBrchNoChange(info) {
        this.addForm.acptGuarntrBankNo = info[0].bankNo;
        this.addForm.acptGuarntrBankName = info[0].brchName;
        //this.brchNoAddFormWin = false;
      },
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,Yon").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.dictMap = res.get("map");
      });
      post({ paramKey: "ce.guarntr.paper_acpt_rgst_audit_mode" }, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            let auditMode = res.data.retData;
            if (auditMode == "0") {
              this.formItem.applStatusList = ["GR01", "GR05", "GR06", "GR09"];
            }
          }
        }
        this.formSearch();
      });

      post({ authPath: this.$route.path }, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
            if (this.licenseFlag) {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", false);
            } else {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", true);
            }
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    }
  };
</script>

<style scoped>

</style>
