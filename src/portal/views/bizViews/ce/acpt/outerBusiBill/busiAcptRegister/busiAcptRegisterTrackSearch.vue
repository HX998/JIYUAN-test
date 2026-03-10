<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
               <!-- <h-form-item prop="acptRgstBrchNo" :label="$t('m.i.ce.acptSettleRgstBrchNo')">
                  <select-branch v-model="formItem.acptRgstBrchNo" :textShow="'name'" :showMsg="formItem.acptRgstBrchName"
                                 :brchNo.sync="formItem.acptRgstBrchNo"
                                 :brchName.sync="formItem.acptRgstBrchName"></select-branch>
                </h-form-item>-->
                <show-branch v-model="formItem.acptRgstBrchNo" :label="$t('m.i.ce.acptSettleRgstBrchNo')" prop="acptRgstBrchNo" title="机构名称"
                             :showCheckBox="false" :brchNo.sync="formItem.acptRgstBrchNo" :brchName.sync="formItem.acptRgstBrchName">
                </show-branch>
                <h-form-item prop="reverseBillNo" :label="$t('m.i.billInfo.billNo')">
                  <h-input v-model="formItem.reverseBillNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billMoney')">
					<h-row>
						<h-col span="11">
						  <h-typefield  v-model="formItem.minBillMoney"  integerNum="10" placeholder="" type="money" bigTips ></h-typefield>
						</h-col>
						<h-col span="2" style="text-align: center">至</h-col>
						<h-col span="11">
						  <h-typefield  v-model="formItem.maxBillMoney"  integerNum="10" placeholder="" type="money" bigTips ></h-typefield>
						</h-col>
				   </h-row>
			   </h-form-item>
                <h-form-item prop="acptRgstDtRange" :label="$t('m.i.common.acptRgstDt')">
                  <h-date-picker type="daterange" v-model="formItem.acptRgstDtRange" format="yyyy-MM-dd" showFormat placeholder="" :editable=false
                                 @on-change="handleAcptRgstDtChange" ></h-date-picker>
                </h-form-item>
                <h-form-item prop="acptRgstStatus" :label="$t('m.i.common.acptRgstStatus')">
                  <h-select v-model="formItem.acptRgstStatus" placeholder="" showTitle>
                    <h-option v-for="item in acptRgstStatusList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlightRow
                      url="/ce/acpt/outerBusiBill/busiAcptRegister/busiAcptRegisterTrackSearch/func_pageQueryAcptCorpList"
                      :bindForm="formItem"
                      :row-select="true"
                      :has-select="false"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="exportData" >{{$t('m.i.common.export')}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <image-loading
          :imageWin="showUploadImageWin"
          :imageParams="showImageform"
          :isReadonly="true"
          :showAcptSearch="true"
          :showMain="false"
          :showImgPlat="true"
          :couldDel="false"
          @imageWinClose="uploadImageWinClose"></image-loading>
        <!-- 查看票面 -->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>
        <!-- 明细导出 -->
        <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                               :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param" :rows="this.rows"></common-excel-download>
      </h-col>
    </h-row>
  </div>
</template>

<script>
import {formatNumber, getDictListByGroups, getDictValueFromMap, post} from "@/api/bizApi/commonUtil";

export default {
    name: "busiAcptRegisterTrackSearch",
    components : {
    },
    data() {
      return {
        formItem: {
          ids : '',
          billNo: '',
          acptDt: '',
          acptRgstStatusList: 'BTA01,BTA02,BTA03,BTA04,BTA05,BTA06,BTA07,BTA08,BTA09,BTA10,BTA11',
          minBillMoney : '',
          maxBillMoney : '',
          acptRgstStatus : '',
          acptRgstDtRange : [],
          acptRgstBrchName : '',
          acptRgstBrchNo : '',
          reverseBillNo : ''
        },
        columns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            key:"duoxuan",

            hiddenCol: false
          },
          {
            type: 'index',
            key: 'numOrder',
            title: this.$t("m.i.common.index"),
            width: 60,
            align: 'center',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.acptRgstBrchName"),
            key: 'acptRgstBrchName',
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.acptRgstDt"),
            key: 'acptRgstDt',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.acptRgstDt == null || params.row.acptRgstDt === ""){
                return "";
              }
              let acptRgstDt = this.$moment(params.row.acptRgstDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", acptRgstDt);
            },
          },
          {
           title: this.$t("m.i.common.acptRgstStatus"),
            key: 'acptRgstStatus',

            hiddenCol: false,
            render: (h, params) => {
              let key = "";
              let dictValue = getDictValueFromMap(this.dictMap,"AcptRgstStatus",params.row.acptRgstStatus);
              return h("span", {domProps: {title: dictValue}}, dictValue);

            },
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: 'billType',

            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            },
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: 'billNo',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('div', [
                h('a', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.showBillInfo(params.row.billId)
                    }
                  }
                }, params.row.billNo)
              ]);
            }
          },
          {
            title: this.$t("m.i.billInfo.billMoneyByUnit"),
            key: 'billMoney',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.billMoney, 2, ',');
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: 'openDt',
            sortable: true,
            render: (h, params) => {
              if(params.row.openDt == null || params.row.openDt === ""){
                return "";
              }
              let remitDt = this.$moment(params.row.openDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", remitDt);
            },

            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: 'dueDt',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.dueDt == null || params.row.dueDt === ""){
                return "";
              }
              let dueDt = this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", dueDt);
            },
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: 'drwrName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: 'drwrAcctNo',

            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrBankNo"),
            key: 'drwrBankNo',

            hiddenCol: false
          },
          {
           title: this.$t("m.i.billInfo.drwrBankName"),
            key: 'drwrBankName',
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: 'pyeeName',
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeAcctNo"),
            key: 'pyeeAcctNo',

            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: 'acptName',
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptDt"),
            key: 'acptDt',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.acptDt == null || params.row.acptDt === ""){
                return "";
              }
              let acptDt = this.$moment(params.row.acptDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", acptDt);
            }
          },
          {
           title: this.$t("m.i.billInfo.acptBankNo"),
            key: 'acptBankNo',

            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drweBankNo"),
            key: 'drweBankNo',

            hiddenCol: false
          },
          /*{
            title: this.$t("m.i.billInfo.dataSource"),
            key: 'isInnerChannel',

            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"Yon",params.row.isInnerChannel);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },*/
          {
            title: this.$t("m.i.common.acptImage"),
            key: '',

            hiddenCol: false,
            render: (h, params) => {
              if(params.row.acptRgstStatus == "BTA04" || params.row.acptRgstStatus == "BTA10"|| params.row.acptRgstStatus == "BTA11" ){
                return h('div', [
                  h('a', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.openImgWin(params.row.id,params.row.billNo)
                      }
                    }
                  }, '补登影像')
                ]);
              } else {
                return "";
              }
            }
          },
          {
             title: this.$t("m.i.common.failReason"),
            key: 'acptErrorReason',

            hiddenCol: false,
          },
          {
             title: this.$t("m.i.common.cancelType"),
            key: 'cancelType',

            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"RgstRecallType",params.row.cancelType);
              if(dictValue == '0000'){
                dictValue = "";
              }
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: this.$t("m.i.ce.applTellerName"),
            key: 'acptApplTellerName',
            hiddenCol: false
          },
          {
             title: this.$t("m.i.common.acptCheckTellerName"),
            key: 'acptCheckTellerName',
            hiddenCol: false
          },
        ],
        isList: [],
        corpScaleList: [],
        areaList: [],
        industryCategoryList: [],
        dictMap: new Map(),
        currentSelectRow: [],
        currentSelectList: [],
        acptRgstStatusList: [],
        ifShowMore: false,
        showUploadImageWin: false,
        showImageform: {
          id:"",
          imgType:"IM07",
          imgTypeList:[],
          imageUrl:"/ce/acpt/outerBusiBill/busiAcptRegister/busiAcptRegisterTrackSearch/func_pageQueryAcptRgstImg", //查询可查看影像url
          imageUploadUrl:"/ce/acpt/outerBusiBill//busiAcptRegister/busiAcptRegisterTrackSearch/func_loadImgFileAndSave", //影像上传url
          imageRegisterUrl:"/ce/acpt/outerBusiBill/busiAcptRegister/busiAcptRegisterTrackSearch/func_sendAcptImgMsg", //影像登记url
          imageDeleteUrl:"/ce/acpt/outerBusiBill/busiAcptRegister/busiAcptRegisterTrackSearch/func_deleteAcptImg", //影像删除url
          imgShowUrl:"/ce/acpt/outerBusiBill/busiAcptRegister/busiAcptRegisterTrackSearch/func_showAcptImg?id=", //查看影像url
          listId:"",
          busiType:"RI02",
          billNo:""
        },
        billId: '',
        showBillInfoWin: false,
        //导出
        tempShowExcelTemplateWin : false,
        param : null,
        rows : null,
      }
    },
    mounted() {
      getDictListByGroups("CorpScale,Yon,Province,Industry,ImgMainStatus,DraftTypeCode,AcptRgstStatus,RgstRecallType").then(res => {
        this.corpScaleList = res.get("CorpScale");
        this.acptRgstStatusList = res.get("AcptRgstStatus");
        this.acptRgstStatusList = this.acptRgstStatusList.filter(item => item.key !== "BTA15"  &&item.key !== "BTA16" &&item.key !== "BTA17" );
        // 不需要这个，因为可选择的发起方，全部默认为企业
        this.isList = res.get("Yon");
        this.areaList = res.get("Province");
        this.industryCategoryList = res.get("Industry");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      //表单查询
      handleSearch() {
        this.$refs.datagrid.dataChange(1);
        this.$refs.datagrid.selects = [];
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.drwrCustNo = '';
        this.formItem.maxBillMoney = '';
        this.formItem.minBillMoney = '';
        let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
        this.formItem.acptRgstBrchNo = userInfo.brchNo;
        this.formItem.acptRgstBrchName = userInfo.brchName;
      },
      //行选中
      handleRowClick(arr) {
        this.currentSelectRow = arr[0];
      },
      handleSelectClick(arr) {
        this.currentSelectList = arr;
      },
      handleAcptRgstDtChange(arr) {

      },
      exportData() {
        this.param = 'busiAcptRegisterTrackSearchExportInfo';
        if (this.$refs.datagrid.selectIds.length !== 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        }else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },

      //影像维护
      openImgWin(str,billNo) {
        this.showImageform.id = str;
        this.showImageform.listId = str;
        this.showImageform.billNo = billNo;
        this.queryType = 'add';
        this.showUploadImageWin = true;
      },
      //影像维护关闭
      uploadImageWinClose() {
        this.showUploadImageWin = false;
      },
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //清单导出
      exportList(field, exportType) {
        //exportType: 0-同步 1-异步
        if (exportType === "1") {
          let url = window.LOCAL_CONFIG.API_HOME + "/ce/acpt/outerBusiBill/busiAcptRegister/busiAcptRegisterTrackSearch/func_exportData";
          let params = null;
          if (this.$refs.datagrid.selectIds.length !== 0) {
            params = {
              ids: this.$refs.datagrid.selectIds,
              pageSize: this.$refs.datagrid.selectIds.length,
              field: field,
              exportType: exportType,
              excelName: this.param
            };
          } else {
            params = {
              ids : this.formItem.ids,
              billNo: this.formItem.billNo,
              acptDt: this.formItem.acptDt,
              acptRgstStatusList: 'BTA01,BTA02,BTA03,BTA04,BTA05,BTA06,BTA07,BTA08,BTA09,BTA10,BTA11',
              minBillMoney : this.formItem.minBillMoney,
              maxBillMoney : this.formItem.maxBillMoney,
              acptRgstStatus : this.formItem.acptRgstStatus,
              acptRgstDtRange : this.formItem.acptRgstDtRange,
              acptRgstBrchName : this.formItem.acptRgstBrchName,
              acptRgstBrchNo : this.formItem.acptRgstBrchNo,
              field: field,
              exportType: exportType,
              excelName: this.param
            };
          }
          post(params, url).then(res => {
            if (res.status === 200 && res.data === null) {
              this.$msgTip.info(this, {info: "异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            } else if (res.status === 200 && res.data === "") {
              this.$msgTip.info(this, {info: "异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            } else {
              this.$msgTip.error(this, {info: "异步导出失败"});
            }
          });
        } else {
          if (this.$refs.datagrid.selectIds.length != 0) {
            let url = window.LOCAL_CONFIG.API_HOME + "/ce/acpt/outerBusiBill/busiAcptRegister/busiAcptRegisterTrackSearch/func_exportData";
            let form = document.createElement("form");
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");

            let input1 = document.createElement('input')
            input1.type = 'text'
            input1.name = 'ids';
            input1.value = this.$refs.datagrid.selectIds;
            form.appendChild(input1)
            let input2 = document.createElement('input')
            input2.type = 'text'
            input2.name = 'pageSize';
            input2.value = this.$refs.datagrid.selectIds.length;
            form.appendChild(input2)
            let input3 = document.createElement('input')
            input3.type = 'text'
            input3.name = 'field';
            input3.value = field;
            form.appendChild(input3)
            let input4 = document.createElement('input')
            input4.type = 'text'
            input4.name = 'exportType';
            input4.value = exportType;
            form.appendChild(input4)
            let input5 = document.createElement('input')
            input5.type = 'text'
            input5.name = 'excelName';
            input5.value = this.param;
            form.appendChild(input5)

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          } else {
            let url = window.LOCAL_CONFIG.API_HOME + "/ce/acpt/outerBusiBill/busiAcptRegister/busiAcptRegisterTrackSearch/func_exportData";
            let form = document.createElement("form");
            for (let obj in this.formItem) {
              if (this.formItem.hasOwnProperty(obj)) {
                let input = document.createElement('input')
                input.type = 'text'
                input.name = obj;
                input.value = this.formItem[obj];
                form.appendChild(input)
              }
            }
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");
            if (this.$refs.datagrid.total > 0) {
              let input1 = document.createElement('input')
              input1.type = 'text'
              input1.name = 'pageSize';
              input1.value = this.$refs.datagrid.total;
              form.appendChild(input1)
            }
            let input3 = document.createElement('input')
            input3.type = 'text'
            input3.name = 'field';
            input3.value = field;
            form.appendChild(input3)
            let input4 = document.createElement('input')
            input4.type = 'text'
            input4.name = 'exportType';
            input4.value = exportType;
            form.appendChild(input4)
            let input5 = document.createElement('input')
            input5.type = 'text'
            input5.name = 'excelName';
            input5.value = this.param;
            form.appendChild(input5)

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          }
        }
      },
      showBillInfo(billId){
        this.billId = billId;
        this.showBillInfoWin = true;
      }
    },
    created (){
      let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
      this.formItem.acptRgstBrchNo = userInfo.brchNo;
      this.formItem.acptRgstBrchName = userInfo.brchName;
    }
  };
</script>

<style scoped>

</style>
