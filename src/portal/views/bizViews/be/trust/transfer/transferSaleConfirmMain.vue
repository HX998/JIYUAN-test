<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <!--查询表单-->
        <div class="h-form-search-box">
          <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
            <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
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
                <h-select v-model="formItem.billType"  :title="formItem.billType" placeholder="" showTitle>
                  <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass">
                <h-select v-model="formItem.billClass" :title="formItem.billClass" placeholder="" showTitle>
                  <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item class="h-form-operate">
                <span class="h-more-input" v-if="this.licenseFlag" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
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
          highlight-row
          url="/be/trust/transfer/transferSaleConfirmMain/func_queryTransferSaleTrackReply"
          :bindForm="formItem"
          :onCurrentChange="handleCurrentChange"
          :onCurrentChangeCancel="handleCurrentChangeCancel"
          ref="datagrid">
          <div slot="toolbar" class="pull-left">
            <h-button type="primary" @click="handleSend()">{{$t('m.i.common.send')}}</h-button>
            <h-button type="primary" @click="handleReset()">{{$t('m.i.be.returnBack')}}</h-button>
            <h-button type="primary" @click="handleDetilForm()">{{$t('m.i.be.billDetail')}}</h-button>
          </div>
        </h-datagrid>
      </h-col>
    </h-row>

    <!--点击发送弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="1000" height="400" class="h-form-table-layer" :maximize="true" @on-close="closeAddOrEditWin">
      <p slot="header">
        <span>发送申请</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="120" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.common.batchNo')" prop="busiBatchNo">
            <h-input :value="addForm.busiBatchNo" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.brchName')" prop="saleBrchName">
            <h-input :value="addForm.saleBrchName" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.otherBrchName')" prop="buyBrchName">
            <h-input :value="addForm.buyBrchName" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.custBrchCode')" prop="buyBrchCode">
            <h-input :value="addForm.buyBrchCode" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.applDt')" prop="applDt">
            <h-date-picker :value="addForm.applDt" type="date" readonly placeholder=""></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType" :required="isRequired">
            <h-select :value="addForm.billType" readonly placeholder="" showTitle>
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass" :required="isRequired">
            <h-select :value="addForm.billClass" readonly placeholder="" showTitle>
              <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.transferReason')" prop="transferReason" :required="isRequired">
            <h-input :value="addForm.transferReason" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.remark')" prop="reqRemark" class="h-form-height-auto">
            <h-input :value="addForm.reqRemark" type="textarea" readonly :autosize="{minRows: 2, maxRows: 4}"></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <h-row>
        <h-col span="24">
          <h-datagrid
            :columns="billColumns"
            highlight-row
            :bindForm="billItem"
            :gridData="billList"
            @on-page-change="handleBillPage"
            :row-select="true"
            :has-select="false"
            ref="datagridbill">
            <div slot="toolbar" class="pull-left">
              <h-dropdown trigger="click" @on-click="sendBatch">
                <h-button type="primary">{{$t('m.i.common.send')}}
                  <h-icon name="unfold"></h-icon>
                </h-button>
                <h-dropdown-menu slot="list">
                  <h-dropdown-item name="selectSend">选择发送</h-dropdown-item>
                  <h-dropdown-item name="listSend">批次发送</h-dropdown-item>
                </h-dropdown-menu>
              </h-dropdown>
            </div>
          </h-datagrid>
        </h-col>
      </h-row>

      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
      </div>
    </h-msg-box>

    <!--点击票据明细弹出窗-->
    <h-msg-box v-model="detailWin" width="1000" height="400" class="h-form-table-layer" :maximize="true" @on-close="closeDetailWin">
      <p slot="header">
        <span>票据明细</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="120" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.common.batchNo')" prop="busiBatchNo">
            <h-input :value="addForm.busiBatchNo" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.brchName')" prop="saleBrchName">
            <h-input :value="addForm.saleBrchName" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.otherBrchName')" prop="buyBrchName">
            <h-input :value="addForm.buyBrchName" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.custBrchCode')" prop="buyBrchCode">
            <h-input :value="addForm.buyBrchCode" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.applDt')" prop="applDt">
            <h-date-picker :value="addForm.applDt" type="date" readonly placeholder=""></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType" :required="isRequired">
            <h-select :value="addForm.billType" readonly placeholder="" showTitle>
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass" :required="isRequired">
            <h-select :value="addForm.billClass" readonly placeholder="" showTitle>
              <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.transferReason')" prop="transferReason" :required="isRequired">
            <h-input :value="addForm.transferReason" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.remark')" prop="reqRemark" class="h-form-height-auto">
            <h-input :value="addForm.reqRemark" type="textarea" readonly :autosize="{minRows: 2, maxRows: 4}"></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <h-row>
        <h-col span="24">
          <h-datagrid
            :columns="billColumns"
            highlight-row
            rowSelect
            :gridData="billList"
            @on-page-change="handleBillInfoPage"
            :hasSelect="false"
            ref="imgDatagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="showImg()">{{$t('m.i.common.image')}}</h-button>
            </div>
          </h-datagrid>
        </h-col>
      </h-row>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="closeDetailWin">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>
    <image-loading
      :imageWin="imageWin"
      :imageParams="imageParams"
      :isReadonly="true"
      @imageWinClose="imageWinClose"></image-loading>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId" :billNo="billNo"
                    :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
  </div>
</template>

<script>
  import { post, on, off,formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "transferSaleConfirmMain",
    components: {
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`)

    },
    data() {
      return {
        columns: [
          {
            type: "radio",
            width: 60,
            align: "center",
            title: " "
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
            key: "saleBrchName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.otherBrchName'),
            key: "buyBrchName",
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
        //票据明细列
        billColumns: [
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
            title: this.$t('m.i.common.status'),
            key: "deleteFlag",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.deleteFlag === "0" ? "正常" : "异常");
            }
          },
          {
            title: this.$t('m.i.be.transferStatus'),
            key: "transferStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "TransferSaleBillStatus", params.row.transferStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
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
                    this.billInfoWinOpen(params.row.billId, params.row.billNo,params.row.billRangeStart, params.row.billRangeEnd)
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
            title: this.$t('m.i.billInfo.billPackageMoney'),
            key: "billMoney",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.billMoney, 2, ','))
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
            title: this.$t('m.i.billInfo.drwrName'),
            key: "drwrName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptBrchCode'),
            key: "acptBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptBankName'),
            key: "acptName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.discBrchCode'),
            key: "discBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.discBankName'),
            key: "discBankName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.guarntrTrustBrchCode'),
            key: "guarntrTrustBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.guarntrTrustBankName'),
            key: "guarntrTrustBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.cfmAppBrchCode'),
            key: "cfmAppBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.cfmAppBankName'),
            key: "cfmAppBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptGuarntrBrchCode'),
            key: "acptGuarntrBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptGuarntrBankName'),
            key: "acptGuarntrBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.dsctGrntBrCode'),
            key: "discGuarntrBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.discGuarntrBankName'),
            key: "discGuarntrBankName",
            sortable: true,
            hiddenCol: false
          }
        ],
        formItem: {
          busiBatchNo: "",
          billType: "",
          billClass: "",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath: this.$route.path,
        },
        addForm: {
          id: "",
          busiBatchNo: "",//批次号
          saleBrchCode: "",//本方机构代码
          saleBrchName: "",//本方机构名称
          buyBrchName: "",//对方机构名称
          buyBrchCode: "",//对方机构代码
          busiBatchId: "",//批次id,发送明细时提交批次id和明细id
          applDt: "",
          billType: "",
          billClass: "",
          transferReason: "",
          respRemark: "",
          ownedBrchNo:"",
          ownedBrchName:"",
          licenseFlag:false,
        },
        billItem: {
          busiBatchId: "",
          billIdsStr: ""
        },
        imageParams: {
          busiBatchId: "",
          listId: "",
          billRangeStart: "",
          billRangeEnd: "",
          imgTypeList:[],
          imgType: "IM11",
          imageUrl:"/be/trust/transfer/func_queryTransferSaleImagePage", //查询可查看影像url
          imageUploadUrl:"/be/trust/transfer/func_addTransferSaleImage", //影像上传url
          imageRegisterUrl:"/be/trust/transfer/func_uploadTransferSaleImage", //影像登记url
          imageDeleteUrl:"/be/trust/transfer/func_deleteTransferSaleImage", //影像删除url
          imgShowUrl:"/be/trust/transfer/transferSaleImage/func_showImg?id=", //查看影像url
        },
        currentSelectRow: [],
        currentSelectBillList: [],
        billTypeList: [],
        billClassList: [],
        transferStatusList: [],
        dictMap: null,
        ifShowMore: false,
        //授权信息
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        licenseFlag: false,
        authPath: this.$route.path,
       // brchNoWin: false,
        // 是否显示新增或修改窗口
        addOrEditWin: false,
        //是否显示票据明细窗口
        detailWin: false,
        //票据明细展示列
        imageWin: false,
        isRequired: true,
        billList: {
          list: [],
          pageInfo: {
            count: 0,
            pageNo: 1,
            pageSize: 10
          }
        },
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
      formSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
        this.$refs.formItem.resetFields();
      },
      //票据影像
      showImg() {
        if(this.$refs.imgDatagrid.selects == null || this.$refs.imgDatagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (this.$refs.imgDatagrid.selects != null && this.$refs.imgDatagrid.selects.length === 1) {
          this.imageParams.busiBatchId = this.addForm.id;
          this.imageParams.listId = this.$refs.imgDatagrid.selects[0].id;
          this.imageParams.billRangeStart = this.$refs.imgDatagrid.selects[0].billRangeStart;
          this.imageParams.billRangeEnd = this.$refs.imgDatagrid.selects[0].billRangeEnd;
          this.imageParams.imgTypeList.push({key: 'IM11', value: '非交易过户'});
          this.imageWin = true;
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
        }
      },
      imageWinClose() {
        this.imageWin = false;
        this.imageParams.busiBatchId = "";
        this.imageParams.listId = "";
        this.imageParams.billRangeStart = "";
        this.imageParams.billRangeEnd = "";
        this.imageParams.imgTypeList=[];
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      //关闭票据明细弹出框
      closeDetailWin() {
        this.detailWin = false;
        this.$refs.imgDatagrid.selects = [];
        this.$refs.imgDatagrid.selectIds = [];
        this.$refs.imgDatagrid.pageInfo.pageNo = 1;
        this.$refs.imgDatagrid.pageInfo.pageSize = 10;
      },
      closeAddOrEditWin() {
        this.addOrEditWin = false;
        this.$refs.datagridbill.selects = [];
        this.$refs.datagridbill.selectIds = [];
        this.$refs.datagridbill.pageInfo.pageNo = 1;
        this.$refs.datagridbill.pageInfo.pageSize = 10;
      },
      //发送
      handleSend() {
        if (!this.checkOnlyOne(this.currentSelectRow)) {
          return;
        }
        this.billItem.ownedBrchNo = this.currentSelectRow.transBrchNo;
        this.billItem.ownedBrchName = this.currentSelectRow.brchName;
        this.billItem.licenseFlag = this.licenseFlag;
        let obj = Object.assign({}, this.billItem, { busiBatchId: this.currentSelectRow.id});
        this.queryBillByBatchId(obj);
        //将批次id赋给batchiId,发送时需要批次id和明细id
        this.billItem.busiBatchId = this.currentSelectRow.id;
        //从页面获取值用于回显查询框
        this.addForm.id = this.currentSelectRow.id;
        this.addForm.busiBatchNo = this.currentSelectRow.busiBatchNo;
        this.addForm.billType = this.currentSelectRow.billType;
        this.addForm.billClass = this.currentSelectRow.billClass;
        this.addForm.buyBrchCode = this.currentSelectRow.buyBrchCode;
        this.addForm.buyBrchName = this.currentSelectRow.buyBrchName;
        this.addForm.saleBrchName = this.currentSelectRow.saleBrchName;
        this.addForm.transferReason = this.currentSelectRow.transferReason;
        this.addForm.reqRemark = this.currentSelectRow.reqRemark;
        this.addForm.ownedBrchNo = this.currentSelectRow.transBrchNo;
        this.addForm.ownedBrchName = this.currentSelectRow.brchName;
        this.addForm.licenseFlag = this.licenseFlag;
        if (this.currentSelectRow.applDt) {
          this.addForm.applDt = this.$moment(this.currentSelectRow.applDt, "YYYYMMDD").format("YYYY-MM-DD");
        } else {
          this.addForm.applDt = this.currentSelectRow.applDt;
        }
        this.addOrEditWin = true;
      },
      checkOnlyOne(selectList) {
        if (selectList == null || selectList.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return false;
        } else if (selectList.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return false;
        }
        return true;
      },
      handleBillPage(pageNo, pageSize) {
        let obj = Object.assign({}, this.billItem, {
          busiBatchId: this.addForm.id,
          pageNo: pageNo,
          pageSize: pageSize
        });
        this.queryBillByBatchId(obj);
      },
      handleBillInfoPage(pageNo, pageSize) {
        let obj = Object.assign({}, this.billItem, {
          busiBatchId: this.addForm.id,
          pageNo: pageNo,
          pageSize: pageSize
        });
        this.queryBillByBatchId(obj);
      },
      //查询已提交批次下明细
      queryBillByBatchId(obj) {
        post(obj, "/be/trust/transfer/transferSaleConfirmMain/func_queryTransferSaleBillApproval").then(res => {
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
      formateListData(list) {
        let ids = [];
        for (let i = 0, len = list.length; i < len; i++) {
          ids.push(list[i].id);
        }
        return ids.join(",");
      },
      /* 发送 */
      sendBatch(obj) {
        this.currentSelectBillList = this.$refs.datagridbill.selects;
        if (obj == "selectSend" && this.currentSelectBillList.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        this.$hMsgBox.confirm({
          title: "发送信息",
          content: "确定要发送吗?",
          onOk: () => {
            this.sendBatchConfirm(obj);
          }
        });
      },
      sendBatchConfirm(obj) {
        this.currentSelectBillList = this.$refs.datagridbill.selects;
        if (obj == "selectSend" && this.currentSelectBillList.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        } else {
          //选择发送
          if (obj == "selectSend") {
            this.billItem.billIdsStr = this.formateListData(this.currentSelectBillList);
            post(this.billItem, "/be/trust/transfer/transferSaleConfirmMain/func_sendTransferSaleBills").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this, { info: this.$t("发送成功") });
                  this.currentSelectRow = [];
                  this.currentSelectBillList = [];
                  this.$refs.datagridbill.selectIds = [];
                  this.$refs.datagridbill.selects = [];
                  this.addOrEditWin = false;
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.$refs.datagridbill.dataChange(1);
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                  this.currentSelectRow = [];
                  this.currentSelectBillList = [];
                  this.$refs.datagridbill.selectIds = [];
                  this.$refs.datagridbill.selects = [];
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.$refs.datagridbill.dataChange(1);
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          } else {
            //批次发送只传批次id
            let id = null;
            id = this.billItem.busiBatchId;
            post({ id: id }, "/be/trust/transfer/transferSaleConfirmMain/func_sendTransferSaleBatch").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this, { info: this.$t("发送成功") });
                  this.currentSelectRow = [];
                  this.currentSelectBillList = [];
                  this.$refs.datagridbill.selectIds = [];
                  this.$refs.datagridbill.selects = [];
                  this.addOrEditWin = false;
                  this.$refs.datagrid.dataChange(1);
                  this.$refs.datagridbill.dataChange(1);
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                  this.currentSelectRow = [];
                  this.currentSelectBillList = [];
                  this.$refs.datagridbill.selectIds = [];
                  this.$refs.datagridbill.selects = [];
                  this.$refs.datagrid.dataChange(1);
                  this.$refs.datagridbill.dataChange(1);
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        }
      },
      //超链接点击批次号弹出票据明细
      showBillList(list) {
        let obj = Object.assign({}, this.billItem, { busiBatchId: list.id });
        this.queryBillByBatchId(obj);
        this.addForm.id = list.id;
        this.billItem.busiBatchId = list.id;
        this.addForm.busiBatchNo = list.busiBatchNo;
        this.addForm.billType = list.billType;
        this.addForm.billClass = list.billClass;
        this.addForm.buyBrchCode = list.buyBrchCode;
        this.addForm.buyBrchName = list.buyBrchName;
        this.addForm.saleBrchName = list.saleBrchName;
        this.addForm.transferReason = list.transferReason;
        this.addForm.reqRemark = list.reqRemark;
        if (list.applDt) {
          this.addForm.applDt = this.$moment(list.applDt, "YYYYMMDD").format("YYYY-MM-DD");
        } else {
          this.addForm.applDt = list.applDt;
        }
        this.addOrEditWin = true;
      },

      handleReset() {
        if (this.currentSelectRow == null || this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        this.$hMsgBox.confirm({
          title: "退回",
          content: "确定要退回吗?",
          onOk: () => {
            this.handleResetConfirm();
          }
        });
      },
      handleResetConfirm() {
        if (this.currentSelectRow == null || this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        } else {
          post({ id: this.currentSelectRow.id }, "/be/trust/transfer/transferSaleConfirmMain/func_resetTransferSale").then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode == "000000") {
                this.$msgTip.success(this, { info: "退回成功" });
                this.currentSelectRow = [];
                this.$refs.datagrid.dataChange(1);
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
                this.currentSelectRow = [];
                this.$refs.datagrid.dataChange(1);
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        }
      },
      handleBack() {
        if (this.currentSelectRow == null || this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        } else {
          post({ id: this.currentSelectRow.id }, "/be/trust/transfer/transferSaleConfirmMain/func_transferSaleBack").then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode == "000000") {
                this.$msgTip.success(this, { info: "票据退回成功" });
                this.currentSelectRow = [];
                this.$refs.datagrid.dataChange(1);
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
                this.currentSelectRow = [];
                this.$refs.datagrid.dataChange(1);
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        }
      },
      //票据明细
      handleDetilForm() {
        if (!this.checkOnlyOne(this.currentSelectRow)) {
          return;
        }
          let obj = Object.assign({}, this.billItem, { busiBatchId: this.currentSelectRow.id });
          this.queryBillByBatchId(obj);
          this.addForm.id = this.currentSelectRow.id;
          this.addForm.busiBatchNo = this.currentSelectRow.busiBatchNo;
          this.addForm.billType = this.currentSelectRow.billType;
          this.addForm.billClass = this.currentSelectRow.billClass;
          this.addForm.buyBrchCode = this.currentSelectRow.buyBrchCode;
          this.addForm.buyBrchName = this.currentSelectRow.buyBrchName;
          this.addForm.saleBrchName = this.currentSelectRow.saleBrchName;
          this.addForm.transferReason = this.currentSelectRow.transferReason;
          this.addForm.reqRemark = this.currentSelectRow.reqRemark;
          if (this.currentSelectRow.applDt) {
            this.addForm.applDt = this.$moment(this.currentSelectRow.applDt, "YYYYMMDD").format("YYYY-MM-DD");
          } else {
            this.addForm.applDt = this.currentSelectRow.applDt;
          }
          this.detailWin = true;
      },
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
      this.getDictListByGroups("DraftTypeCode,CDMedia,TransferSaleBillStatus").then(res => {
        this.billClassList = res.get("CDMedia");
        this.billTypeList = res.get("DraftTypeCode");
        this.transferStatusList = res.get("TransferSaleBillStatus");
        this.dictMap = res.get("map");
      });
    },

    mounted() {
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

  //格式化票据类型
  function formatterBIllType(value) {
    if (value == null || value == "") {
      return "";
    }
    switch (value) {
      case"AC01":
        return "银票";
      case"AC02":
        return "商票";
    }
  }

  //格式化票据介质
  function formatterBIllClass(value) {
    if (value == null || value == "") {
      return "";
    }
    switch (value) {
      case"ME01":
        return "纸票";
      case"ME02":
        return "电票";
    }
  }
</script>

<style scoped>

</style>
