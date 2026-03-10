<!--付款确认申请撤回-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
           <!--     <h-form-item :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" v-if="this.licenseFlag">
                  <h-input v-model="formItem.ownedBrchNames" icon="android-search" @on-click="brchNoWinOpen"
                           readonly clearable @on-clear="clearVal1('license')"
                           :title="formItem.ownedBrchNames"></h-input>
                </h-form-item>-->

                <show-branch v-model="formItem.ownedBrchNames"  :label="$t('m.i.common.ownedBrchNo')"  prop="ownedBrchNames"
                             v-if="this.licenseFlag"    :showCheckBox="true"     :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames"
                             :params="{authPath:this.$route.path}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                             queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item :label="$t('m.i.billInfo.billNo')" prop="likeBillNo">
                  <h-input v-model="formItem.likeBillNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder="" showTitle>
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value}}</h-option>
                  </h-select>
                </h-form-item>
                <bill-money :formItem="formItem"></bill-money>
                <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="dueDt">
                  <h-date-picker type="daterange" :value="dueDt" format="yyyy-MM-dd" showFormat
                                 placeholder="" @on-change="handleDueDtChange"></h-date-picker>
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
            :columns="dataColumns"
            highlight-row
            url="/be/barter/payment/payConfirmRecallMain/func_payConfirmRecallList"
            :bindForm="formItem"
            :hasSelect="hasSelect" rowSelect
            ref="datagrid">
            <div slot="toolbar" class='pull-left'>
              <h-button type="primary" @click="payConfirmRecallClick()">{{$t('m.i.be.withdraw')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <image-loading :imageWin="imageWin"
                   :authObj="authObject"
                   :imageParams="imageParams"
                   @imageWinClose="imageWinClose">
    </image-loading>
    <!-- 查看票面 -->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo"></bill-info-main>

  <!--  <show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose" :ifcheck="true"
                         :checkStrictly="true"></show-license-branch>-->

  </div>
</template>

<script>
  import { post, on, off, formatNumber } from "@/api/bizApi/commonUtil";
  import { numberFormat, dateFormat } from "@/api/bizApi/be/barter/payment/payConfirmCommon";

  export default {
    name: "payConfirmRecallMain",
    components: {
     // ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`)

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
          likeBillNo: "",
          minDueDt: "",
          maxDueDt: "",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath: this.$route.path
        },
        dueDt:[],
        billTypeList: [],

        //给按钮增加权限
        authObj: {
          recall: true      //撤回
        },
        //控制imageLoading的按钮显隐
        authObject: {
          imageAdd: false,       //影像新增
          imageRegister: false,  //登记
          imageDelete: false     //删除
        },
        tableRef: "selfTable",
        ifShowMore: false,
        currentSelectList: [],
        currentSelectRowInx: [],
        type: "",
        dictMap: new Map(),

        //设置列表列内容
        dataColumns: [
          {
            type: "selection",
            width: 50,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.ownedBrchNo"),
            key: "ownedBrchName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.cfmAppType'),
            key: "cfmAppType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "CfmAppType", params.row.cfmAppType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.cfmAppReqType'),
            key: "cfmAppReqType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "CfmAppReqType", params.row.cfmAppReqType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billNo'),
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
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", dateFormat(params.row.dueDt, "yyyy-MM-dd"));
            }
          },
          {
            title: this.$t('m.i.billInfo.billMoney'),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", formatNumber(params.row.billMoney, 2, ","));
            }
          },
          {
            title: this.$t('m.i.be.respBrchCode'),
            key: "respBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.transCustName'),
            key: "transCustName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.drwrName'),
            key: "drwrName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.drwrAcctNo'),
            key: "drwrAcctNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.acptName'),
            key: "acptName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.acptAcctNo'),
            key: "acptAcctNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.be.reqRemark'),
            key: "reqRemark",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.showImg'),
            key: "viewImg",
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
                  "click": () => {
                    this.getImgFile(params.row.billNo);
                  }
                }
              }, this.$t("m.i.common.showImg"))]);
            }
          }],

        //影像维护弹出框
        imageWin: false,
        // 影像类型数据字典
        imageParams: {
          isLock:"1",
          imgTypeList: [],
          billNo: "",
          dictMap: new Map(),
          imgBusiType: "RI11",
          imageUrl : "/be/barter/payment/payConfirmApplyMain/func_queryImgInfo", //查询可查看影像url
          imgShowUrl : "/be/barter/payment/payConfirmApplyMain/func_showImg?id=", //查看影像url
        },
        hasSelect: false,
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        licenseFlag: false,
        authPath: this.$route.path,
        //brchNoWin: false,
        imageTypeList: []
      };
    },
    watch: {},
    computed: {},
    methods: {
      /**
       * 列表搜索
       * */
      formSearch() {
        this.unDisabled();
        /**清除多页选择的数据*/
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(1);
      },
      handleDueDtChange(arr){
        if (arr && arr.length >= 2) {
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDt = [arr[0],arr[1]];
        } else {
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.dueDt = [];
        }
      },
      /**
       * 查询区域重置
       * */
      formSearchReset() {
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
        this.dueDt = [];
        this.$refs.formItem.resetFields();
      },
      handlelRowClick(arr) {
        this.currentSelectList = arr;
      },
      handleSelectClick(arr, selectInx) {
        this.unDisabled();
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
        if (arr.length == 0) return;
      },

      //加载影像
      getImgFile(billNo) {
        this.imageWin = true;
        this.imageParams.billNo = billNo;
        this.imageParams.dictMap = this.dictMap;
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
      },
      imageWinClose() {
        this.imageWin = false;
        this.imageParams.billNo = "";
        this.imageParams.imgTypeList = [];
        this.imageTypeList = [];
        this.imageParams.dictMap = new Map();
      },
      /**
       * 付款确认申请撤回
       * **/
      payConfirmRecallClick(str) {
        let selects = this.$refs.datagrid.selects;
        if (selects != null && selects.length > 0) {
          this.type = str;
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "是否确认撤回承兑付款确认申请?",
            onOk: () => {
              let ids = this.formateListData(selects);
              post({ ids: ids }, "/be/barter/payment/payConfirmRecallMain/func_cancelPayConfirmApply").then(res => {
                if (res) {
                  let return_code = res.data.retCode;
                  if (return_code === "000000") {
                    this.$msgTip.success(this);
                    this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                    /**清除多页选择的数据*/
                    this.$refs.datagrid.selectIds = [];
                    this.$refs.datagrid.selects = [];
                  } else {
                    this.$msgTip.error(this, { info: res.data.retMsg });
                    this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                }
              });
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
        }
      },
      formateListData(list) {
        let ids = [];
        for (let i = 0, len = list.length; i < len; i++) {
          ids.push(list[i].id);
        }
        return ids.join(",");
      },
      unDisabled() {
        this.deletDisabled = false;
      },
        //票面
        billInfoWinClose(){
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

      /*//根据弹框所选数据进行赋值
      brchNoChange(info) {
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
      }*/
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,CfmAppReqType,CfmAppType,ImgType,ImgStatus").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.dictMap = res.get("map");
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
