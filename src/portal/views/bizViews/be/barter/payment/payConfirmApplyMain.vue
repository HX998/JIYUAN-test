<!--付款确认申请-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
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

                <bill-type v-model="formItem.billType" :dictList="billTypeList"></bill-type>
                <bill-no v-model="formItem.billNo"></bill-no>
                <bill-money :formItem="formItem"></bill-money>
                <due-dt :formItem="formItem" :dueDt="dueDt"></due-dt>
                <common-select v-model="formItem.queryPayConfirmType" :dictList="dictList"
                               :label="$t('m.i.ce.replyFlag')" prop="queryPayConfirmType"></common-select>
                <query-btn v-on:showChange="showQry" :advanceShow='true' :formSearch='formSearch'
                           :formSearchReset='formSearchReset'></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
              :columns="dataColumns"
              url="/be/barter/payment/payConfirmApplyMain/func_queryPendingPayConfirmApply"
              :bindForm="formItem"
              :hasSelect="hasSelect" rowSelect
              showListCkeckBox
              ref="datagrid">
            <div slot="toolbar" class='pull-left'>
              <h-button type="primary" @click="payConfirmClickImg('image')" v-if="authObj.imageConfirm">影像验证</h-button>
              <h-button type="primary" @click="payConfirmClick('physical')" v-if="authObj.physicalConfirm">实物验证</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--点击付款确认申请弹出窗-->
    <h-msg-box v-model="payConfirmWin" width="400" class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span v-if="type=='image'">影像验证申请意见描述</span>
        <span v-if="type=='physical'">实物验证申请意见描述</span>
      </p>
      <h-panel>
        <h-form :model="payConfirmForm" :label-width="90" ref="payConfirmForm" cols="1" class="h-form-search">
          <h-form-item label="备注" prop="reqRemark" class="h-form-height-auto">
            <h-input type="textarea" :rows="3" v-model="payConfirmForm.reqRemark"
                     :maxlength=150 :lengthByByte="false"></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" @click="payConfirmClickSubmit('close')">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="payConfirmClickSubmit('submit')">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
    <!--END 点击付款申请申请弹出窗 -->
    <image-loading
        :imageWin="imageWin"
        :imageParams="imageParams"
        :showImgPlat="true"
        @imageWinClose="imageWinClose"></image-loading>

    <!-- 查看票面 -->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                    :billNo="this.billNo"></bill-info-main>



  </div>
</template>

<script>
  import {
    post,
    on,
    off,
    getDictListByGroups,
    getDictValueFromMap
  } from "@/api/bizApi/commonUtil";
  import { numberFormat } from "@/api/bizApi/be/barter/payment/payConfirmCommon";

  export default {
    name: "payConfirmApplyMain",
    components: {

    },
    data() {
      return {
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        formItem: {
          billType: "",
          minBillMoney: "",
          maxBillMoney: "",
          billNo: "",
          minDueDt: "",
          maxDueDt: "",
          cfmAppRefuseCode: "",
          queryPayConfirmType: "",
          ownedBrchName:"",
          ownedBrchNo:"",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath:this.$route.path ,
        },
        dueDt: [],
        billTypeList: [],
        //给按钮增加权限
        authObj: {
          imageConfirm: true,       //影像确认
          physicalConfirm: true //实物确认
        },
        type: "",
        ifShowMore: false,
        payConfirmWin: false,
        currentSelectList: [],
        //设置列表列内容
        dataColumns: [
          {
            type: "selection",
            width: 50,
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
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,

            sortable: true,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
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
            title: this.$t("m.i.billInfo.billMoney"),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", numberFormat(params.row.billMoney, 2));
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dueDt = params.row.dueDt == null ? "" : this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", dueDt);
            }
          },
          {
            title: this.$t("m.i.be.imageLoading"),
            key: "imageLoading",
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.getImgFile(params.row.billNo, params.row.cfmAppRefuseCode,params.row.id,params.row.ownedBrchNo);
                  }
                }
              }, "维护");
            }
          },
          {
            title: this.$t("m.i.be.acptBankNo"),
            key: "acptBankNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.acptBankOrPeopleName"),
            key: "acptBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drweBankName"),
            key: "drweBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drweBankNo"),
            key: "drweBankNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.discBankName"),
            key: "discBankName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.ownershipBankName"),
            key: "ownershipBankName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.cfmAppType"),
            key: "cfmAppType",
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "CfmAppType", params.row.cfmAppType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.cfmAppRefuseCode"),
            key: "cfmAppRefuseCode",
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "RefuseReason", params.row.cfmAppRefuseCode);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.cfmAppOpin"),
            key: "cfmAppOpin",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.remark"),
            key: "reqRemark",
            hiddenCol: false
          }
        ],
        dictList: [
          {key: "1",value: "未应答"},
          {key: "2",value: "应答拒绝"},
        ],
        payConfirmForm: {
          reqRemark: "",
          ids: "",
          cfmAppType: "",
          cfmAppRefuseCode: "",
          payCfmSubmitDtos: [],
          imgUpRegisterDtos:[],
          licenseFlag:false,
        },
        //影像维护弹出框
        imageWin: false,
        // 影像类型数据字典
        imageParams: {
          imgTypeList: [],//影像类型数据字典
          billNo: "",
          imgBusiType: "RI11",
          cfmAppRefuseCode: "",
          isLock: "0",
          imageUrl: "/be/barter/payment/payConfirmApplyMain/func_queryImgInfo", //查询可查看影像url
          imageUploadUrl: "/be/barter/payment/payConfirmApplyMain/func_loadImgFileAndSave", //影像上传url
          imageRegisterUrl: "/be/barter/payment/payConfirmApplyMain/func_registerImgInfo", //影像登记url
          imageDeleteUrl: "/be/barter/payment/payConfirmApplyMain/func_deleteImgRegInfo", //影像删除url
          imgShowUrl: "/be/barter/payment/payConfirmApplyMain/func_showImg?id=", //查看影像url
          busiType:"RI06",
          id: "",
          imgType: "",
          listId:"",
          licenseFlag :this.licenseFlag,
          ownedBrchNo :"",
        },
        dictMap: new Map(),
        hasSelect: false,
        imageTypeList: [],
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        licenseFlag: false,
        authPath: this.$route.path,
      };
    },
    watch: {
      "$route": "getParams"
    },
    computed: {},
    methods: {
      showQry(val) {
        this.ifShowMore = val;
      },
      handleDueDtChange(arr) {
        this.formItem.minDueDt = arr[0].replace(/-/g, "");
        this.formItem.maxDueDt = arr[1].replace(/-/g, "");
        this.dueDt = [arr[0], arr[1]];
      },
      /**
       * 列表搜索
       * */
      formSearch() {
        this.$refs.datagrid.dataChange(1);
        /**清除多页选择的数据*/
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
      },
      /**
       * 查询区域重置
       * */
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.dueDt = [];
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
        this.formItem.queryPayConfirmType = "";
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
      },
      handleSelectClick(arr) {
        this.currentSelectList = arr;
      },

      /**
       * 付款确认影像验证申请
       * 1.影像确认应答为需补录影像的，可以发起影像验证（应答发起补录影像），也可以发起实物验证（应答发起实物验证）
       * 2.影像确认应答为需实物验证的，只能发起实物验证（应答发起实物验证）
       * 3.实物确认应答为需补录影像的，只能发起实物验证（应答发起补录影像）
       * 4.实物确认应答为审批拒绝的，不能再发起付款确认申请报文。
       * **/
      payConfirmClickImg(str){
        this.currentSelectList = this.$refs.datagrid.selects;
        this.type = str;
        if (this.currentSelectList != null && this.currentSelectList.length > 0) {
          //影像确认应答为需补录影像的笔数
          let index = 0;
          for (let i = 0; i < this.currentSelectList.length; i++) {
            if (this.currentSelectList[i].cfmAppType === "VM01" && this.currentSelectList[i].cfmAppRefuseCode === "RR02") {
              //影像确认应答为需补录影像的
              index ++;
            }
            if (this.currentSelectList[i].cfmAppType === "VM01" && this.currentSelectList[i].cfmAppRefuseCode === "RR03") {
              //需实物验证
              if (str === "image") {
                this.$msgTip.info(this, { info: "票号为：["+this.currentSelectList[i].billNo+"]只能发起实物验证" });
                return;
              }
            }
            if (this.currentSelectList[i].cfmAppType === "VM02") {
              //需补录影像
              if (str === "image" && this.currentSelectList[i].cfmAppRefuseCode === "RR02") {
                this.$msgTip.info(this, { info: "票号为：["+this.currentSelectList[i].billNo+"]只能发起实物验证" });
                return;
              }
              if (this.currentSelectList[i].cfmAppRefuseCode === "RR05") {
                this.$msgTip.info(this, { info: "票号为：["+this.currentSelectList[i].billNo+"]不能再发起付款确认申请" });
                return;
              }
            }
          }
          if (index !== 0 && index !== this.currentSelectList.length) {
            this.$msgTip.info(this, { info: "影像验证申请多选时请选择相同目的票据(影像确认应答为需补录影像或者首次发起)" });
            return;
          }
          this.payConfirmForm.imgUpRegisterDtos = [];
          let selects = this.$refs.datagrid.selects;
          this.formateCkeckImgInfoData(selects);
          if (index == this.currentSelectList.length) {
            post(this.payConfirmForm, "/be/barter/payment/payConfirmApplyMain/func_checkAcptImg").then(res => {
              if (res) {
                let retData = res.data.retData;
                if (retData == "" || retData == null || retData.length == 0) {
                  this.payConfirmWin = true;
                  this.$nextTick(() => {
                    this.payConfirmForm.ids = "";
                    this.$refs.payConfirmForm.resetFields();
                  });
                }else{
                  this.payConfirmForm.imgUpRegisterDtos = [];
                  let billStr = "";
                  for(let i = 0;i<retData.length;i++){
                    billStr+=retData[i] + ',';
                  }
                  billStr = billStr.substring(0, billStr.length - 1);
                  let content ="票号["+billStr+"]未录入影像，请先录入影像后再发起影像验证";
                  this.$msgTip.info(this, { info: content });
                  return;
                }
              }
            });
          } else {
            this.payConfirmWin = true;
            this.$nextTick(() => {
              this.payConfirmForm.ids = "";
              this.$refs.payConfirmForm.resetFields();
            });
          }
        }else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },

      formateCkeckImgInfoData(list) {
        for (let i = 0, len = list.length; i < len; i++) {
          let checkImgInfos = {};
          checkImgInfos.listId = list[i].id;
          checkImgInfos.billNo = list[i].billNo;
          checkImgInfos.imgBusiType = '';
          checkImgInfos.isLock = '0';
          checkImgInfos.cfmAppRefuseCode = list[i].cfmAppRefuseCode == null ? "" : list[i].cfmAppRefuseCode;
          this.payConfirmForm.imgUpRegisterDtos.push(checkImgInfos);
        }
      },

      /**
       * 付款确认实物验证申请
       * 1.影像确认应答为需补录影像的，可以发起影像验证（应答发起补录影像），也可以发起实物验证（应答发起实物验证）
       * 2.影像确认应答为需实物验证的，只能发起实物验证（应答发起实物验证）
       * 3.实物确认应答为需补录影像的，只能发起实物验证（应答发起补录影像）
       * 4.实物确认应答为审批拒绝的，不能再发起付款确认申请报文。
       * **/
      payConfirmClick(str) {
        let selects = this.$refs.datagrid.selects;
        if (selects != null && selects.length > 0) {
          this.type = str;
          let index = 0;
          for (let i = 0; i < selects.length; i++) {
            if (selects[i].cfmAppType === "VM02") {
              if (selects[i].cfmAppRefuseCode === "RR05") {
                this.$msgTip.info(this, { info: "票号为：["+this.currentSelectList[i].billNo+"]不能再发起付款确认申请" });
                return;
              }
              if (selects[i].cfmAppRefuseCode === "RR02") {
                index ++;
              }
            }
          }
          if (index !== 0 && index !== selects.length) {
            this.$msgTip.info(this, { info: "实物验证申请多选时请选择相同目的票据(实物确认应答为需补录影像、影像确认应答为需补录影像或者首次发起)" });
            return;
          }
          if (index === selects.length) {
            this.payConfirmForm.imgUpRegisterDtos = [];
            this.formateCkeckImgInfoData(selects);
            post(this.payConfirmForm, "/be/barter/payment/payConfirmApplyMain/func_checkAcptImg").then(res => {
              if (res) {
                let retData = res.data.retData;
                this.payConfirmForm.imgUpRegisterDtos = [];
                if (retData == "" || retData == null || retData.length == 0) {
                  this.payConfirmWin = true;
                  this.$nextTick(() => {
                    this.payConfirmForm.ids = "";
                    this.$refs.payConfirmForm.resetFields();
                  });
                }else{
                  let billStr = "";
                  for(let i = 0;i<retData.length;i++){
                    billStr+=retData[i] + ',';
                  }
                  billStr = billStr.substring(0, billStr.length - 1);
                  let content ="票号["+billStr+"]未录入影像，请先录入影像后再发起实物验证";
                  this.$msgTip.info(this, { info: content });
                  return;
                }
              }
            });
          } else  {
            this.payConfirmWin = true;
            this.$nextTick(() => {
              this.payConfirmForm.ids = "";
              this.$refs.payConfirmForm.resetFields();
            });
          }
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },

      /**
       * 付款确认提交
       * */
      payConfirmClickSubmit(str) {
        if ("close" === str) {
          this.payConfirmForm.payCfmSubmitDtos = [];
          this.payConfirmWin = false;
        } else if ("submit" === str) {
          this.payConfirmForm.payCfmSubmitDtos = [];
          let selects = this.$refs.datagrid.selects;
          this.formateListData(selects);
          this.payConfirmForm.cfmAppType = this.type === "physical" ? "VM02" : "VM01";
          this.payConfirmForm.licenseFlag = this.licenseFlag;
          let url = "/be/barter/payment/payConfirmApplyMain/func_submitPayConfirmApply";
          post(this.payConfirmForm, url).then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                /**清除多页选择的数据*/
                this.$refs.datagrid.selectIds = [];
                this.$refs.datagrid.selects = [];
                this.$msgTip.success(this);
                this.$refs.datagrid.dataChange(1);
                this.payConfirmWin = false;
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        }
      },

      formateListData(list) {
        for (let i = 0, len = list.length; i < len; i++) {
          let payCfmSubmitDtos = {};
          payCfmSubmitDtos.billId = list[i].id;
          payCfmSubmitDtos.stockId = list[i].stockId;
          payCfmSubmitDtos.ownedBrchNo = list[i].ownedBrchNo;
          this.payConfirmForm.payCfmSubmitDtos.push(payCfmSubmitDtos);
        }
      },

      //加载影像
      getImgFile(billNo, cfmAppRefuseCode,id,brchNo) {
        this.imageWin = true;
        this.imageParams.billNo = billNo;
        this.imageParams.isLock = "0";
        this.imageParams.listId = id;
        this.imageParams.cfmAppRefuseCode = cfmAppRefuseCode == null ? "" : cfmAppRefuseCode;
        let item1 = {};
        let item2 = {};
        let item3 = {};
        item1.value = "贴现凭证";
        item2.value = "瑕疵证明";
        item3.value = "补充影像（贴现）";
        item1.key = "IM05";
        item2.key = "IM06";
        item3.key = "IM08";
        this.imageTypeList.push(item1);
        this.imageTypeList.push(item2);
        this.imageTypeList.push(item3);
        this.imageParams.imgTypeList = this.imageTypeList;
        this.imageParams.ownedBrchNo = brchNo;
        this.imageParams.licenseFlag = this.licenseFlag;
      },

      imageWinClose() {
        this.imageWin = false;
        this.imageParams.billNo = "";
        this.imageParams.listId = "";
        this.imageParams.cfmAppRefuseCode = "";
        this.imageParams.imgTypeList = [];
        this.imageTypeList = [];
      },
      //票面
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
      getParams() {
        if (this.$route.path === "/be/barter/payment/payConfirmApplyMain") {
          if (this.$route.query.queryPayConfirmType) {
            this.formItem.queryPayConfirmType = this.$route.query.queryPayConfirmType;
            this.$nextTick(()=>{
              this.formSearch();
            });
          }
        }
      },

    },
    mounted() {
      getDictListByGroups("DraftTypeCode,ImgType,ImgStatus,RefuseReason,CfmAppType").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.dictMap = res.get("map");
      });
      this.getParams();

      //有授权则显示业务所属机构列
      post({authPath:this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        this.authPath = this.$route.path;
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
        }else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    }

  };
</script>

<style scoped>

</style>
