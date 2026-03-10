<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.batchStatus')">
                  <h-radio-group v-model="formItem.batchStatus">
                    <h-radio label="1" @on-click="noIssueButton">未提交</h-radio>
                    <h-radio label="2" @on-click="hasIssueButton">已提交</h-radio>
                  </h-radio-group>
                </h-form-item>
                <show-branch v-model="formItem.ownedBrchNames"  :label="$t('m.i.common.ownedBrchNo')"  prop="ownedBrchNames"
                             v-if="this.licenseFlag"    :showCheckBox="true"     :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames"
                             :params="{authPath:this.$route.path}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                             queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item :label="$t('m.i.common.batchNo')" prop="busiBatchNo">
                  <h-input v-model="formItem.busiBatchNo"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder="">
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass">
                  <h-select v-model="formItem.billClass" placeholder="">
                    <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.applDt')" prop="applDate">
                  <h-date-picker type="daterange" :value="applDate" placeholder="" format="yyyy-MM-dd"
                                 showFormat @on-change="handleApplDateChange"></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                  :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            hasPage
            url="/be/trust/transfer/transferRebuyApply/func_queryTransferRebuyBatchPage"
            :bindForm="formItem"
            :hasSelect=false
            :rowSelect=true
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleAddForm('add')" :disabled="hasCommitDisabled">
                {{$t("m.i.common.add")}}
              </h-button>
              <h-button type="primary" @click="handleAddForm('modify')" :disabled="hasCommitDisabled">
                {{$t("m.i.common.modify")}}
              </h-button>
              <h-button type="primary" @click="handleComfirm()" :disabled="hasCommitDisabled">
                {{$t("m.i.common.delete")}}
              </h-button>
              <h-button type="primary" @click="rollbackApply()" :disabled="noCommitDisabled">{{$t('m.i.be.cacelAppl')}}</h-button>
              <h-button type="primary" @click="handleAddForm('view')">{{$t('m.i.be.billDetail')}}</h-button>
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen()">{{$t('m.i.common.exportExcel')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--点击新增/修改/票据明细弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="1000" height="400" class="h-form-table-layer"
               @on-close="handleWinClose" :maximize="true">
      <p slot="header">
        <span v-if="type=='add'">新增受让申请</span>
        <span v-if="type=='modify'">修改受让申请</span>
        <span v-if="type=='view'">票据明细</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="120" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.common.batchNo')" prop="busiBatchNo">
            <h-input v-if="type=='view'" :value="addForm.busiBatchNo"  readonly></h-input>
            <h-input v-else v-model="addForm.busiBatchNo" :maxlength=60 readonly></h-input>
          </h-form-item>
          <show-branch v-model="addForm.buyBrchName"  :label="$t('m.i.be.brchName')" prop="buyBrchName"
                       :filterable="type=='add' && this.licenseFlag===true"     :showCheckBox="false"   :msgBoxWin="addOrEditWin"  @brchNoChange="licenseBrchNoChange($event)"    :brchNo.sync="addForm.transBrchNo" :brchName.sync="addForm.buyBrchName"
                       :params="{authPath:this.$route.path}"
                       url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                       queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
          </show-branch>
          <show-cpes-branch v-model="addForm.saleBrchName"  :label="$t('m.i.be.otherBrchName')"  :required="isRequired"
                             :brchCode.sync="addForm.saleBrchCode"  :cpesBrchName.sync="addForm.saleBrchName"
                             :msgBoxWin="addOrEditWin"  :clearable="false" :filterable="type!=='view'"
                             datagridUrl="/cpes/branch/queryBranchList" prop="saleBrchName"
                             queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

          <h-form-item :label="$t('m.i.common.applDt')" prop="applDt" :required="isRequired">
            <h-date-picker v-if="type=='view'" :value="addForm.applDt"  type="date"
                           readonly></h-date-picker>
            <h-date-picker v-else v-model="addForm.applDt" :maxlength=60 type="date"></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType" :required="isRequired">
            <h-select v-if="type=='view'" v-model="addForm.billType" :value="addForm.billType" readonly placeholder="">
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-select v-else v-model="addForm.billType" placeholder="" :readonly="readonly">
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass" :required="isRequired">
            <h-select v-if="type=='view'" v-model="addForm.billClass" :value="addForm.billClass" readonly
                      placeholder="">
              <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-select v-else v-model="addForm.billClass" placeholder="" :readonly="readonly">
              <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item>
            <h-button type="primary" @click="addFormSave()" v-if="authObj.bizSetRoleAdd">{{$t("m.i.common.save")}}
            </h-button>
          </h-form-item>
        </h-form>
      </h-panel>
      <h-datagrid
        :columns="billColumns"
        highlight-row
        :bindForm="billItem"
        :gridData="billList"
        :rowSelect=true
        :has-select="false"
        @on-page-change="handleBillPage"
        hasPage
        ref="datagridbill">
        <div slot="toolbar" class="pull-left">
          <h-button type="primary" v-if="authObj.bizSetRoleAdd" @click="pickBillWinOpen">{{$t('m.i.common.pickBill')}}</h-button>
          <h-button type="primary" v-if="authObj.bizSetRoleAdd" @click="deleteBillBtn">{{$t('m.i.common.delete')}}</h-button>
          <h-dropdown trigger="click" @on-click="submitBatch" v-if="authObj.bizSetRoleAdd">
            <h-button type="primary">{{$t('m.i.be.submission')}}
              <h-icon name="unfold"></h-icon>
            </h-button>
            <h-dropdown-menu slot="list">
              <h-dropdown-item name="selectSubmit">选择提交</h-dropdown-item>
              <h-dropdown-item name="listSubmit">批次提交</h-dropdown-item>
            </h-dropdown-menu>
          </h-dropdown>
        </div>
      </h-datagrid>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
      </div>
    </h-msg-box>
    <!-- 挑票弹出框 -->
    <pick-bill :pickBillWin="pickBillWin" @pickBillWinClose="pickBillWinClose" :saleBrchCode="addForm.saleBrchCode"
               @pickBillChange="pickBillChange" :billType="addForm.billType" :billClass="addForm.billClass"
               :ownedBrchNo="addForm.ownedBrchNo" :applDt="addForm.applDt" :licenseFlag="this.licenseFlag"
               :hiddenBillOriginSelect="this.hiddenBillOriginSelect"></pick-bill>
    <show-image-info :show-upload-image-win="showUploadImageWin"
                     :params="imageParams"
                     :isShowInfo="false"
                     @uploadImageWinClose="uploadImageWinClose"></show-image-info>

    <common-excel-download @handleSubmit="batchListDownClick" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId" :billNo="billNo"
                    :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
  </div>
</template>

<script>
  import { post, on, off,formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "transferRebuyApply",
    components: {
      PickBill: () => import(/* webpackChunkName: "be/trust/transfer/transferRebuyPickBill" */`@/views/bizViews/be/trust/transfer/transferRebuyPickBill`),
      TransferRebuyImage: () => import(/* webpackChunkName: "be/trust/transfer/transferRebuyImage" */`@/views/bizViews/be/trust/transfer/transferRebuyImage`),
    },
    data() {
      return {
        columns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.common.ownedBrchNo"),
            key: "ownedBrchName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.batchNo'),
            key: "busiBatchNo",
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillList(params.row);
                  }
                }
              }, params.row.busiBatchNo);
            }
          },
          {
            title: this.$t('m.i.common.applDt'),
            key: "applDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let applDt = this.$moment(params.row.applDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", applDt);
            }
          },
          {
            title: this.$t('m.i.be.brchName'),
            key: "buyBrchName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.otherBrchName'),
            key: "saleBrchName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
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
            title: this.$t('m.i.billInfo.billClass'),
            key: "billClass",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.be.totalCount'),
            key: "totalNum",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.sumMoney'),
            key: "totalAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.totalAmt, 2, ','))
            }
          }
        ],
        billColumns: [
          {
            type: "selection",
            key: "selection",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.common.image"),
            key: "viewImage",
            hiddenCol: false,
            render: (h, params) => {
              return h("div", [
                h("a", {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.imgWinOpen(params.row);
                    }
                  }
                }, this.$t("m.i.common.showImg"))
              ]);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageNo'),
            key: "billNo",
            hiddenCol: false,
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.billInfoWinOpen(params.row.billId, params.row.billNo, params.row.billRangeStart, params.row.billRangeEnd)
                  }
                }
              }, params.row.billNo)
            }
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
            key:"billRange",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.pageShowFormatBillRange(params.row.billRangeStart, params.row.billRangeEnd);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.be.transferStatus'),
            key: "transferStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "TransferRebuyBillStatus", params.row.transferStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
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
            title: this.$t('m.i.billInfo.billClass'),
            key: "billClass",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageMoney'),
            key: "billMoney",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.billMoney, 2, ','))
            }
          },
          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: "remitDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let remitDt = this.$moment(params.row.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", remitDt);
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dueDt = this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", dueDt);
            }
          },
          {
            title: this.$t('m.i.billInfo.acptName'),
            key: "acptName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.drwrName'),
            key: "drwrName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.transferReason'),
            key: "transferReason",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.remark'),
            key: "reqRemark",
            hiddenCol: false
          }
        ],
        applDate:[],
        billItem: {
          id: "",
          busiBatchId: "",
          billIdsStr: "",
          authPath: this.$route.path
        },
        formItem: {
          billNo: "",
          billType: "",
          billClass: "",
          busiBatchNo: "",
          applDate: "",
          minApplDt: "",
          maxApplDt: "",
          batchStatus: "1",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath: this.$route.path,
        },
        addForm: {
          id: "",
          busiBatchId: "",
          busiBatchNo: "",
          transBrchNo:"",
          buyBrchName:"",
          saleBrchName: "",
          saleBrchCode: "",
          applDt: "",
          billType: "",
          billClass: "",
          billIdsStr: "",//票据明细id集
          ownedBrchNo:this.$store.getters.userInfo.brchNo,
          ownedBrchName:this.$store.getters.userInfo.brchName,
          licenseFlag:false,
        },
        imageParams: {
          listId: "",
          pageSearchUrl: "/be/trust/transfer/transferRebuyImage/func_queryTransferRebuyImagePage", //分页查询url
          imageSearchUrl: "/be/trust/transfer/transferRebuyImage/func_sendImgQuery", //影像查询url
          imgShowUrl:"/be/trust/transfer/transferRebuyImage/func_showImg?id=", //查看url
          billRangeStart: "",
          billRangeEnd: ""
        },
        //给按钮增加权限
        authObj: {
          bizSetRoleAdd: true, //角色添加
          bizSetRoleDelete: true, //角色删除
          bizSetRoleORight: true, //角色操作权限
          bizSetRoleARight: true, //角色授权权限
          bizRoleRightSet: true, //角色权限处理
          bizRoleRightCopy: true, //角色权限复制
          bizSetRoleDownload: true //角色信息下载
        },
        //清单导出
        param: null,
        rows: null,
        tempShowExcelTemplateWin: false,
        //是否显示高级按钮
        ifShowMore: false,
        //控制按钮是否可选
        hasCommitDisabled: false,
        //是否必填
        isRequired: true,
        //影像弹出框
        readonly: false,
        noCommitDisabled: true,
        // 是否显示新增或修改窗口
        addOrEditWin: false,
        //搜索按钮弹出框
        //brchCodeWin: false,
        //挑票弹出框
        pickBillWin: false,
        hiddenBillOriginSelect: true,
        showUploadImageWin: false,
        dictMap: null,
        type: null,
        //授权信息
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        licenseFlag: false,
        authPath: this.$route.path,
        //brchNoWin: false,
        //brchNoWin1:false,
        billTypeList: [],
        billClassList: [],
        transferStatusList: [],
        currentSelectRow: [],
        currentSelectList: [],
        currentSelectBillList: [],
        billList: {
          list: [],
          pageInfo: {
            count: 0,
            pageNo: 1,
            pageSize: 10
          }
        },
        busiBatchId: null,
        showBillInfoWin:false,
        billId:"",
        billRangeStart:"",
        billRangeEnd:"",
        billNo:""
      };
    },
    methods: {
      billInfoWinClose(){
        this.billId=null;
        this.billNo=null;
        this.billRangeStart=null;
        this.billRangeEnd=null;
        this.showBillInfoWin=false;
      },
      billInfoWinOpen(billId,billNo,billRangeStart,billRangeEnd){
        this.billId=billId;
        this.billNo=billNo;
        this.billRangeStart=billRangeStart;
        this.billRangeEnd=billRangeEnd;
        this.showBillInfoWin=true;
      },
      //关闭弹出框
      handleWinClose() {
        this.addForm.id = null;
        this.$refs.datagridbill.pageInfo.pageNo = 1;
        this.$refs.datagridbill.pageInfo.pageSize = 10;
        this.$refs.datagridbill.selects = [];
        this.$refs.datagridbill.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.currentSelectBillList = [];
        this.currentSelectList = [];
        this.busiBatchId = null;
        this.$refs.datagrid.dataChange(1);
        this.$refs.addForm.resetFields();
        this.addForm.saleBrchName = "";
        this.addForm.saleBrchCode = "";
        this.addOrEditWin = false;
      },
      //搜索按钮弹出框
      /*brchCodeWinOpen() {
        this.brchCodeWin = true;
      },*/
      //关闭按钮搜索框
      /*brchCodeWinClose() {
        this.brchCodeWin = false;
      },*/
      //关闭挑票弹出框
      pickBillWinClose() {
        this.pickBillWin = false;
      },
      //关闭影像弹出框
      uploadImageWinClose() {
        this.showUploadImageWin = false;
      },
      //未提交情况下撤销按钮不可选
      noCommitButton() {
        this.noCommitDisabled = true;
        this.hasCommitDisabled = false;
      },
      hasCommitButton() {
        this.hasCommitDisabled = true;
        this.noCommitDisabled = false;
      },
      //查询
      formSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.currentSelectRow = [];
        this.currentSelectList = [];

        if (this.formItem.batchStatus === "1") {
          this.noCommitButton();
        } else {
          this.hasCommitButton();
        }
        this.$refs.datagrid.dataChange(1);
      },
      handleApplDateChange(arr){
        if (!arr || arr.length < 2) {
          this.formItem.minApplDt = "";
          this.formItem.maxApplDt = "";
          this.applDate = [];
        }else {
          this.formItem.minApplDt = arr[0].replace(/-/g, "");
          this.formItem.maxApplDt = arr[1].replace(/-/g, "");
          this.applDate = [arr[0],arr[1]];
        }
      },
      noIssueButton() {
        this.applDate = [];
        this.noCommitButton();
        this.formItem.batchStatus = "1";
        this.formSearch();
      },
      hasIssueButton() {
        this.hasCommitButton();
        this.formItem.batchStatus = "2";
        this.formSearch();
      },
      //重置
      formSearchReset() {
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
        this.applDate = [];
        this.formItem.minApplDt = "";
        this.formItem.maxApplDt = "";
        this.$refs.formItem.resetFields();
        if (this.formItem.batchStatus === "2") {
          this.noIssueButton();
        }
      },
      //新增之前清空所有addForm的值
      addFormReset() {
        this.$refs.addForm.resetFields();
      },
      //新增/修改
      handleAddForm(str) {
        this.type = str;
        this.addForm.licenseFlag = this.licenseFlag;
        if (this.type == "modify" || this.type == "view") {
          this.currentSelectList = this.$refs.datagrid.selects;
          if (this.currentSelectList != null && this.currentSelectList.length > 0) {
            if (this.currentSelectList.length > 1) {
              this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
              return;
            } else {
              this.$nextTick(() => {
                this.addForm.busiBatchId = this.currentSelectList[0].id;//业务批次id
                this.currentSelectRow = this.currentSelectList[0];
                //从页面拿值
                this.addForm.id = this.currentSelectRow.id;
                this.addForm.billType = this.currentSelectRow.billType;
                this.addForm.billClass = this.currentSelectRow.billClass;
                this.addForm.busiBatchNo = this.currentSelectRow.busiBatchNo;
                this.addForm.buyBrchName = this.currentSelectRow.buyBrchName;
                this.addForm.saleBrchName = this.currentSelectRow.saleBrchName;
                this.addForm.buyBrchCode = this.currentSelectRow.buyBrchCode;
                this.addForm.saleBrchCode = this.currentSelectRow.saleBrchCode;
                this.addForm.transBrchNo = this.currentSelectRow.transBrchNo;
                this.addForm.ownedBrchNo = this.currentSelectRow.transBrchNo;
                this.addForm.ownedBrchName = this.currentSelectRow.buyBrchName;
                if (this.currentSelectRow.applDt) {
                  this.addForm.applDt = this.$moment(this.currentSelectRow.applDt, "YYYYMMDD").format("YYYY-MM-DD");
                } else {
                  this.addForm.applDt = this.currentSelectRow.applDt;
                }
                if (this.type == "view" && this.formItem.batchStatus === "2") {
                  let obj = Object.assign({}, this.billItem, { busiBatchId: this.currentSelectRow.id });
                  this.queryApprovalObjById(obj);
                } else {
                  let obj = Object.assign({}, this.billItem, { busiBatchId: this.currentSelectRow.id });
                  this.queryInitialObjById(obj);
                }
                if (this.type == "modify") {
                  this.isRequired = true;
                  this.authObj.bizSetRoleAdd = true;
                  this.readonly = true;
                }
                if (this.type == "view") {
                  this.isRequired = false;
                  this.authObj.bizSetRoleAdd = false;
                  this.readonly = true;
                }
              });
            }
          } else {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            return;
          }
        } else {
          this.$nextTick(() => {
            this.readonly = false;
            this.addForm.id = "";
            this.authObj.bizSetRoleAdd = true;
            this.addFormReset();
            this.isRequired = true;
            this.billList = {
              list: [],
              pageInfo: {
                count: 0,
                pageNo: 1,
                pageSize: 10
              }
            };
            post({}, "/be/trust/transfer/transferRebuyApply/func_getCurUserInfo").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  let data = res.data.retData;
                  this.addForm.buyBrchName = data.buyBrchName;
                  this.addForm.transBrchNo = data.transBrchNo;
                  this.addForm.ownedBrchName = data.buyBrchName;
                  this.addForm.ownedBrchNo = data.transBrchNo;
                  this.addForm.applDt = this.$moment(data.applDt, "YYYYMMDD").format("YYYY-MM-DD");
                } else {
                  this.$msgTip.error(this, { info: "初始化数据查询失败:" + res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                return;
              }
            });
          });
        }
        this.selectionHiddenCol();
        this.addOrEditWin = true;
      },
      selectionHiddenCol(){
        const columns = this.billColumns;
        let selection=null;
        for (let column of columns) {
          if (column.key === 'selection') {
            selection = column;
            break;
          }
        }
        if (selection != null) {
          selection.hiddenCol = this.type === "view" ? true : false;
        }
      },
      handleBillPage(pageNo, pageSize) {
        let busiBatchId = this.addForm.busiBatchId;
        if(busiBatchId == null || busiBatchId == '' || busiBatchId == undefined){
          return ;
        }
        let obj = Object.assign({}, this.billItem, {
          busiBatchId: busiBatchId,
          pageNo: pageNo,
          pageSize: pageSize
        });
        if (this.type == "view" && this.formItem.batchStatus === "2") {
          this.queryApprovalObjById(obj);
        } else{
          this.queryInitialObjById(obj);
        }
      },
      //超链接点击批次号弹出票据明细
      showBillList(list) {
        this.$nextTick(() => {
          this.readonly = true;
          this.addForm.busiBatchId = list.id;//业务批次id
          //从页面拿值
          this.addForm.id = list.id;
          this.addForm.billType = list.billType;
          this.addForm.billClass = list.billClass;
          this.addForm.busiBatchNo = list.busiBatchNo;
          this.addForm.buyBrchName = list.buyBrchName;
          this.addForm.buyBrchCode = list.buyBrchCode;
          this.addForm.saleBrchName = list.saleBrchName;
          this.addForm.saleBrchCode = list.saleBrchCode;
          this.addForm.ownedBrchNo = list.ownedBrchNo;
          this.addForm.ownedBrchName = list.ownedBrchName;
          this.addForm.transBrchNo = list.transBrchNo;
          if (list.applDt) {
            this.addForm.applDt = this.$moment(list.applDt, "YYYYMMDD").format("YYYY-MM-DD");
          } else {
            this.addForm.applDt = list.applDt;
          }
          if (this.formItem.batchStatus === "2") {
            let obj = Object.assign({}, this.billItem, { busiBatchId: list.id });
            this.queryApprovalObjById(obj);
            this.type = "view";
            this.authObj.bizSetRoleAdd = false;
          } else {
            let obj = Object.assign({}, this.billItem, { busiBatchId: list.id });
            this.queryInitialObjById(obj);
            this.type = "modify";
            this.authObj.bizSetRoleAdd = true;
          }
          this.isRequired = false;
          this.selectionHiddenCol();
          this.addOrEditWin = true;
        });
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      tempShowExcelTemplateWinOpen() {
        this.param = "transferrebuyBatch";
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      //清单导出
      batchListDownClick(field, exportType) {
        //exportType: 0-同步 1-异步
        if (exportType === "1") {
          let url = window.LOCAL_CONFIG.API_HOME + "/be/trust/transfer/transferRebuyApply/func_exportExcelTrack";
          let params = null;
          if (this.$refs.datagrid.selectIds.length != 0) {
            params = {
              ids: this.$refs.datagrid.selectIds,
              pageSize: this.$refs.datagrid.selectIds.length,
              field: field,
              exportType: exportType,
              excelName: this.param,
              batchStatus: this.formItem.batchStatus,
              authPath: this.formItem.authPath
            };
          } else {
            params = {
              billNo: this.formItem.billNo,
              busiBatchNo: this.formItem.busiBatchNo,
              applDate: this.formItem.applDate,
              minApplDt: this.formItem.minApplDt,
              maxApplDt: this.formItem.maxApplDt,
              billType: this.formItem.billType,
              billClass: this.formItem.billClass,
              batchStatus: this.formItem.batchStatus,
              field: field,
              exportType: exportType,
              excelName: this.param,
              authPath: this.formItem.authPath,
              pageSize: this.$refs.datagrid.total
            };
          }
          post(params, url).then(res => {
            if(res.status === 200 && res.data === null){
              this.$msgTip.info(this, { info:"异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            }else if(res.status === 200 && res.data === ""){
              this.$msgTip.info(this, { info:"异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            } else{
              this.$msgTip.error(this, { info: "异步导出失败" });
            }
          });
        } else {
          if (this.$refs.datagrid.selectIds.length != 0) {
            let url = window.LOCAL_CONFIG.API_HOME + "/be/trust/transfer/transferRebuyApply/func_exportExcelTrack";
            let form = document.createElement("form");
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");

            let input1 = document.createElement("input");
            input1.type = "text";
            input1.name = "ids";
            input1.value = this.$refs.datagrid.selectIds;
            form.appendChild(input1);
            let input2 = document.createElement("input");
            input2.type = "text";
            input2.name = "pageSize";
            input2.value = this.$refs.datagrid.selectIds.length;
            form.appendChild(input2);
            let input3 = document.createElement("input");
            input3.type = "text";
            input3.name = "batchStatus";
            input3.value = this.formItem.batchStatus;
            form.appendChild(input3);
            let input6 = document.createElement("input");
            input6.type = "text";
            input6.name = "field";
            input6.value = field;
            form.appendChild(input6);
            let input4 = document.createElement("input");
            input4.type = "text";
            input4.name = "exportType";
            input4.value = exportType;
            form.appendChild(input4);
            let input5 = document.createElement("input");
            input5.type = "text";
            input5.name = "excelName";
            input5.value = this.param;
            form.appendChild(input5);

            let input7 = document.createElement("input");
            input7.type = "text";
            input7.name = "authPath";
            input7.value = this.formItem.authPath;
            form.appendChild(input7);

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          } else {
            let url = window.LOCAL_CONFIG.API_HOME + "/be/trust/transfer/transferRebuyApply/func_exportExcelTrack";
            let form = document.createElement("form");
            for (let obj in this.formItem) {
              if (this.formItem.hasOwnProperty(obj)) {
                let input = document.createElement("input");
                input.type = "text";
                input.name = obj;
                input.value = this.formItem[obj];
                form.appendChild(input);
              }
            }
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");
            if (this.$refs.datagrid.total > 0) {
              let input1 = document.createElement("input");
              input1.type = "text";
              input1.name = "pageSize";
              input1.value = this.$refs.datagrid.total;
              form.appendChild(input1);
            }
            let input6 = document.createElement("input");
            input6.type = "text";
            input6.name = "field";
            input6.value = field;
            form.appendChild(input6);
            let input4 = document.createElement("input");
            input4.type = "text";
            input4.name = "exportType";
            input4.value = exportType;
            form.appendChild(input4);
            let input5 = document.createElement("input");
            input5.type = "text";
            input5.name = "excelName";
            input5.value = this.param;
            form.appendChild(input5);

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          }
        }
      },
      // 表格导出功能
      exportCsv(params) {
        /* {
          filename:  '' // 文件名
          columns: []// 导出表格列
          data: [] // 导出表格数据
          noHeader: false //是否导出表格头
        } */
        this.$refs.gridContent.exportCsv(params);
      },
      //查询未提交批次下明细
      queryInitialObjById(obj) {
        post(obj, "/be/trust/transfer/func_queryTransferRebuyBillInitial").then(res => {
          this.submitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.billList = res.data.retData;

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
      //查询已经交批次下明细
      queryApprovalObjById(obj) {
        post(obj, "/be/trust/transfer/transferRebuyApply/func_queryTransferRebuyBillSubmit").then(res => {
          this.submitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.billList = res.data.retData;

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
      //撤销申请
      rollbackApply() {
        this.currentSelectList = this.$refs.datagrid.selects;
        if (this.currentSelectList != null && this.currentSelectList.length > 0) {
          if (this.currentSelectList.length > 1) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
            return;
          }
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmRollBack") + "?",
            onOk: () => {
              this.rollback();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      /**撤销**/
      rollback() {
        if (this.currentSelectList == null || this.currentSelectList.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        } else if (this.currentSelectList.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        let rollId = this.currentSelectList[0].id;
        post({ id: rollId }, "/be/trust/transfer/transferRebuyApply/func_cancelTransferRebuyApply").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this, { info: "撤销成功" });
              this.$refs.datagrid.dataChange(1);
              this.currentSelectRow = [];
              this.currentSelectList = [];
              this.$refs.datagrid.selectIds = [];
              this.$refs.datagrid.selects = [];
            } else {
              this.$msgTip.error(this, { info: "撤销失败" + res.data.retMsg });
              this.$refs.datagrid.dataChange(1);
              this.currentSelectRow = [];
              this.currentSelectList = [];
              this.$refs.datagrid.selectIds = [];
              this.$refs.datagrid.selects = [];
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      /* 保存批次 */
      addFormSave() {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定要保持批次吗？",
          onOk: () => {
            this.addFormSave1();
          }
        });
      },
      addFormSave1(str) {
        this.$refs["addForm"].validate(valid => {
            if (valid) {
              let msg = this.$t("m.i.common.saveSuccess");
              let url = "/be/trust/transfer/transferRebuyApply/func_submitAddTransferRebuyApply";
              this.addForm.applDt = this.$moment(this.addForm.applDt).format("YYYYMMDD");
              let addBoolen=this.addForm.id&&this.addForm.id!=="";
              post(this.addForm, url).then(res => {
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode == "000000") {
                    this.addForm.id = res.data.retData.id;
                    this.addForm.busiBatchId = res.data.retData.id;
                    this.addForm.busiBatchNo = res.data.retData.busiBatchNo;
                    if (str != "1") {
                      if (str != '2') {
                        this.$msgTip.success(this, { info: msg });
                      }
                    }else{
                      this.pickBillWin = true;
                      if (res.data.retData.billClass === 'ME01') {
                        this.hiddenBillOriginSelect = true;
                      }
                      else {
                        this.hiddenBillOriginSelect = false;
                      }
                    }
                    this.currentSelectRow = [];
                    this.currentSelectList = [];
                    this.$refs.datagrid.selectIds = [];
                    this.$refs.datagrid.selects = [];
                    this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                    this.readonly = true;
                  } else {
                    if(!addBoolen){
                      this.$msgTip.error(this, { info: this.$t("m.i.common.addFailed")+"，" + res.data.retMsg });
                    }else{
                      this.$msgTip.error(this, { info: this.$t("m.i.common.modifyFailed")+"，" + res.data.retMsg });
                    }
                    this.$refs.datagrid.dataChange(1);
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                }
              });
            }
        });
      },
      //点击挑票，打开弹框
      pickBillWinOpen() {
        this.addFormSave1("1");
      },
      //根据弹框所选票进行赋值
      pickBillChange(info) {
        this.addFormSave1('2');
        let ids = [];
        for (let i = 0, len = info.length; i < len; i++) {
          ids.push(info[i].id);
        }
        this.addForm.billIdsStr = ids.join(",");
        post(this.addForm, "/be/trust/transfer/transferRebuyApply/func_addTransferRebuyApplyBill").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.pickBillWin = false;
              let obj = Object.assign({}, this.billItem, { busiBatchId: this.addForm.busiBatchId });
              this.queryInitialObjById(obj);
              this.$refs.datagridbill.dataChange(1);
              this.$refs.datagrid.dataChange(1);
              this.$refs.datagridbill.selectIds = [];
              this.$refs.datagridbill.selects = [];
              this.currentSelectBillList = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.$refs.datagridbill.dataChange(1);
              this.$refs.datagridbill.selectIds = [];
              this.$refs.datagridbill.selects = [];
              this.currentSelectBillList = [];
            }
          } else {
            this.$msgTip.error(this, { info: "m.i.common.netError" });
          }
        });
      },
      //删除批次
      handleComfirm() {
        this.currentSelectList = this.$refs.datagrid.selects;
        if (this.currentSelectList != null && this.currentSelectList.length > 0) {
          if (this.currentSelectList.length > 1) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
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
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      /*删除*/
      handledel() {
        let busiBatchId = this.currentSelectList[0].id;
        post({ id: busiBatchId ,deleteFlag:"0" }, "/be/trust/transfer/transferRebuyApply/func_submitTransferRebuyDel").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            let retMsg = res.data.retMsg;
            if (retCode == "000000") {
              this.$msgTip.success(this, { info: this.$t("m.i.common.deleteSuccess") });
              this.$refs.datagrid.dataChange(1);
              this.currentSelectRow = [];
              this.currentSelectList = [];
              this.$refs.datagrid.selectIds = [];
              this.$refs.datagrid.selects = [];
            } else if(retCode === "000002" && retMsg === "100001"){
                this.continueApply(busiBatchId);
            }else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.deleteFailed") + res.data.retMsg });
              this.$refs.datagrid.dataChange(1);
              this.currentSelectRow = [];
              this.currentSelectList = [];
              this.$refs.datagrid.selectIds = [];
              this.$refs.datagrid.selects = [];
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      continueApply(id){
          let url= "/be/trust/transfer/transferRebuyApply/func_submitTransferRebuyDel";
          let content ="批次下所有明细将同时删除，确认要删除吗？";
          this.$hMsgBox.confirm({
              title:"确认要继续提交申请吗?",
              content:content,
              onOk: () => {
                  post({ id: id ,deleteFlag:"1"}, url).then(res => {
                      if (res) {
                          if (res) {
                              let retCode = res.data.retCode;
                              if (retCode === "000000") {
                                  this.$msgTip.success(this, { info: this.$t("m.i.common.deleteSuccess") });
                                  this.$refs.datagrid.dataChange(1);
                                  this.currentSelectRow = [];
                                  this.currentSelectList = [];
                                  this.$refs.datagrid.selectIds = [];
                                  this.$refs.datagrid.selects = [];
                              } else {
                                  this.$msgTip.error(this, { info: res.data.retMsg });
                              }
                          } else {
                              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                          }
                      }
                  });
              }
          });
      },
      //删除票据
      deleteBillBtn() {
        this.currentSelectBillList = this.$refs.datagridbill.selects;
        if (this.currentSelectBillList != null && this.currentSelectBillList.length > 0) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmDelete") + "?",
            onOk: () => {
              this.delBills();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      delBills() {
        let list = this.currentSelectBillList;
        let ids = [];
        for (let i = 0, len = list.length; i < len; i++) {
          ids.push(list[i].id);
        }
        this.addForm.billIdsStr = ids.join(",");
        this.addForm.busiBatchId = this.currentSelectBillList[0].busiBatchId;
        post(this.addForm, "/be/trust/transfer/transferRebuyApply/func_submitTransferRebuyBillDel").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$refs.datagridbill.dataChange(1);
              this.$refs.datagrid.dataChange(1);
              this.$msgTip.success(this, { info: this.$t("m.i.common.deleteSuccess") });
              this.currentSelectRow = [];
              this.currentSelectList = [];
              this.currentSelectBillList = [];
              this.$refs.datagrid.selectIds = [];
              this.$refs.datagrid.selects = [];
              this.$refs.datagridbill.selectIds = [];
              this.$refs.datagridbill.selects = [];
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.deleteFailed") + res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      /* 提交批次到审批流 */
      submitBatch(obj) {
        this.currentSelectBillList = this.$refs.datagridbill.selects;
        if (obj == "selectSubmit" && this.currentSelectBillList.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        this.$hMsgBox.confirm({
          title: "提交信息",
          content: "确定要提交吗?",
          onOk: () => {
            this.submitBatchConfirm(obj);
          }
        });
      },
      submitBatchConfirm(obj) {
        this.currentSelectBillList = this.$refs.datagridbill.selects;
        if (obj == "selectSubmit" && this.currentSelectBillList.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        } else {
          //选择提交
          if (obj == "selectSubmit") {
            let ids = [];
            for (let i = 0, len = this.currentSelectBillList.length; i < len; i++) {
              ids.push(this.currentSelectBillList[i].id);
            }
            this.addForm.billIdsStr = ids.join(",");
            post(this.addForm, "/be/trust/transfer/transferRebuyApply/func_submitTransferRebuyBills").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this, { info: this.$t("m.i.common.commitSuccess") });
                  this.currentSelectBillList = [];
                  this.handleWinClose();
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                  this.$refs.datagridbill.dataChange(1);
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          } else {
            //批次提交
            let id = null;
            id = this.addForm.busiBatchId;
            post({ id: id }, "/be/trust/transfer/transferRebuyApply/func_submitTransferRebuyBatch").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this, { info: this.$t("m.i.common.commitSuccess") });
                  this.currentSelectBillList = [];
                  this.handleWinClose();
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                  this.$refs.datagridbill.dataChange(1);
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        }
      },
      //票据影像
      imgWinOpen(list) {
        this.imageParams.listId = list.id;
        this.imageParams.billRangeStart=list.billRangeStart;
        this.imageParams.billRangeEnd=list.billRangeEnd;
        this.showUploadImageWin = true;
      },
      /*clearVal(optType) {
        if (optType === "saleBrchName") {
          this.addForm.saleBrchName = "";
          this.addForm.saleBrchCode = "";
        }
      },*/

      //根据弹框所选数据进行赋值
     /* brchNoChange(info) {
        let objs = [];
        if (info instanceof Array) {
          objs = info;
        } else {
          objs[0] = info;
        }
        let brchNos = "";
        let brchNames = "";
        for (var i = 0; i < objs.length; i++) {
          brchNos += objs[i].id + ",";
          brchNames += objs[i].title + ",";
        }
        this.formItem.ownedBrchNos = brchNos.substring(0, brchNos.length - 1);
        this.formItem.ownedBrchNames = brchNames.substring(0, brchNames.length - 1);
        this.brchNoWin = false;
      },
      brchNoWinOpen() {
        this.brchNoWin = true;
      },
      brchNoWinClose() {
        this.brchNoWin = false;
      },*/


      //新增修改界面
      licenseBrchNoChange(info) {
/*        this.addForm.transBrchNo = info[0].id;
        this.addForm.buyBrchName = info[0].title;
        this.addForm.ownedBrchNo = info[0].id;
        this.addForm.ownedBrchName = info[0].title;
        this.brchNoWin1 = false;*/
          if(info.length>0 && this.licenseFlag===true){
              this.addForm.ownedBrchNo = info[0].brchNo;
              this.addForm.ownedBrchName = info[0].brchName;
          }
      },
     /* brchNoWinOpen1() {
        this.brchNoWin1 = true;
      },
      brchNoWinClose1() {
        this.brchNoWin1 = false;
      },*/

      pageShowFormatBillRange(billRangeStart, billRangeEnd) {
        if (billRangeStart == null || billRangeStart === ""
          || billRangeEnd == null || billRangeEnd === "") {
          return '-';
        }
        if (billRangeStart.toString() === '0' && billRangeEnd.toString() === '0') {
          return '0';
        }
        return billRangeStart.toString().padLeft(12, '0') + "," + billRangeEnd.toString().padLeft(12, '0');
      }
    },
    created() {
      this.getDictListByGroups("DraftTypeCode,CDMedia,TransferRebuyBillStatus").then(res => {
        this.billClassList = res.get("CDMedia");
        this.billTypeList = res.get("DraftTypeCode");
        this.transferStatusList = res.get("TransferRebuyBillStatus");
        this.dictMap = res.get("map");
      });
    },

    mounted(){
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
