<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="reverseBillNo" :label="$t('m.i.billInfo.billNo')">
                  <h-input v-model="formItem.reverseBillNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="acptDt" :label="$t('m.i.billInfo.acptDt')">
                  <h-date-picker type="date" v-model="formItem.acptDt" placeholder="" :editable=false @on-change="handleAcptDtChange"></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate two-form">
                  <h-button type="primary" @click="handleSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlightRow
                      url="/ce/acpt/outerBusiBill/busiAcptRegister/busiAcptRegisterRecheck/func_pageQueryAcptCorpList"
                      :bindForm="formItem"
                      :row-select="true"
                      :has-select="false"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="recheckPass" >{{$t('m.i.common.pass')}}</h-button>
              <h-button type="primary" @click="recheckBack" >{{$t('m.i.ce.paymentBack')}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <image-loading
          :imageWin="showUploadImageWin"
          :imageParams="imageParams"
          :isReadonly="true"
          :authObj="authObject"
          @imageWinClose="uploadImageWinClose"></image-loading>
        <!-- 查看票面 -->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>
      </h-col>
    </h-row>
  </div>
</template>

<script>
import {formatNumber, getDictListByGroups, getDictValueFromMap, post} from "@/api/bizApi/commonUtil";

export default {
    name: "busiAcptRegisterRecheck",
    data() {
      return {
        formItem: {
          billNo: '',
          acptDt: '',
          applTellerNoNotEqual : this.$store.getters.userInfo.userNo,
          auditModeKey : 'ce.acpt.is_corp_rgst_check_exclude',
          acptRgstStatusList: ['BTA02','BTA05'],
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
            title: this.$t("m.i.billInfo.pyeeBankName"),
            key: 'pyeeBankName',
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: 'acptName',
            sortable: true,
            hiddenCol: false
          },
          {
           title: this.$t("m.i.billInfo.acptAcctNo"),
            key: 'acptAcctNo',

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
            title: this.$t("m.i.common.showImg"),
            key: '',

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
                      this.openImgWin(params.row.id)
                    }
                  }
                }, '查看')
              ]);
            }
          },
        ],
        isList: [],
        corpScaleList: [],
        areaList: [],
        industryCategoryList: [],
        dictMap: new Map(),
        showUploadImageWin: false,
        authObject: {
          imageAdd: false,       //影像新增
          imageRegister: false,  //登记
          imageDelete: false     //删除
        },
        imageParams: {
          id: "",
          imgTypeList:[],
          imgType:"IM01",
          imageUrl:"/ce/acpt/outerBusiBill/busiAcptRegister/busiAcptRegisterRecheck/func_pageQueryAcptRgstImg", //查询可查看影像url
          imgShowUrl:"/ce/acpt/outerBusiBill/busiAcptRegister/busiAcptRegisterRecheck/func_showAcptImg?id=", //查看影像url
        },
        billId: '',
        showBillInfoWin: false
      }
    },
    components : {
    },
    mounted() {
      getDictListByGroups("CorpScale,Yon,Province,Industry,ImgMainStatus,DraftTypeCode").then(res => {
        this.corpScaleList = res.get("CorpScale");
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
      },
      //通过
      recheckPass() {
        if (this.$refs.datagrid.selects != null && this.$refs.datagrid.selects.length !== 0) {
          this.$hMsgBox.confirm({
            title: "确认",
            content: "确定复核通过吗？",
            onOk: () => {
              this.handleBackReCheck("1");
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      //退回
      recheckBack() {
        if (this.$refs.datagrid.selects != null && this.$refs.datagrid.selects.length !== 0) {
          this.$hMsgBox.confirm({
            title: "确认",
            content: "确定复核退回吗？",
            onOk: () => {
              this.handleBackReCheck("2");
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      handleBackReCheck(checkFlag) {
        let list = this.$refs.datagrid.selects;
        let ids = "";
        for (let i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        post({ ids : ids, checkFlag: checkFlag }, "/ce/acpt/outerBusiBill/busiAcptRegister/busiAcptRegisterRecheck/func_checkAcptCorp").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(1);
              this.$refs.datagrid.selects = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      handleAcptDtChange(){
        if(this.formItem.acptDt != null && this.formItem.acptDt != ''){
          this.formItem.acptDt = this.$moment(this.formItem.acptDt).format("YYYYMMDD");
        }
      },
      //影像维护
      openImgWin(str) {
        this.imageParams.id = str;
        this.imageParams.imgTypeList.push({key: 'IM01', value: '承兑正面'});
        this.showUploadImageWin = true;
      },
      //影像维护关闭
      uploadImageWinClose() {
        this.showUploadImageWin = false;
        this.imageParams.imgTypeList=[];
        // this.billManagerHandleSearch();
      },

      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      showBillInfo(billId){
        this.billId = billId;
        this.showBillInfoWin = true;
      }
    }
  };
</script>

<style scoped>

</style>
