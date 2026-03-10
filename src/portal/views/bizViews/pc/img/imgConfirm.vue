<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.pe.busiNo')" prop="busiNo">
                  <h-input v-model="formItem.busiNo" :maxlength=16></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.pc.transType')" prop="transType">
                  <h-select v-model="formItem.transType" placeholder="" showTitle>
                    <h-option value="1">承兑</h-option>
                    <h-option value="2">贴现</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder=" ">
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="imgStatusList" :label="$t('m.i.common.imgStatus')">
                  <h-select v-model="formItem.imgStatusList" placeholder="" multiple showTitle>
                    <h-option value="0">未确认</h-option>
                    <h-option value="1">确认完整</h-option>
                    <h-option value="2">确认不完整</h-option>
                   <!-- <h-option v-for="item in imgStatusList" :value="item.key" :key="item.key">{{item.value }}</h-option>-->
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t("m.i.common.searchAdvanced")}}<i class="icon iconfont"
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
            url="/pc/img/imgConfirm/func_queryDataPage"
            :bindForm="formItem"
            :row-select="true"
            :has-select="false"
            :onSelectChange="handleSelectClick"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="confirmComplete('1')" :disabled="isCompleteEnable">{{$t("m.i.pc.confirmComplete")}}</h-button>
              <h-button type="primary" @click="confirmComplete('2')" :disabled="isNoCompleteEnable">{{$t("m.i.pc.confirmNoComplete")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
     <!-- 影像维护 -->
     <image-loading
       :imageWin="showUploadImageWin"
       :imageParams="imageParams"
       :showAcptSearch="false"
       :authObj="authObj"
       :showSyncButton="false"
       :isShowDealPrcMsg="false"
       :isShowBillNo="false"
       :isShowUploadDt="true"
       :isShowOperTellerNo="true"
       :isShowImgBatchNo="false"
       :isShowImgFileName="true"
       :isShowReset="false"
       :isReadonly="true"
       :showImgPlat="true"
       @imageWinClose="uploadImageWinClose"></image-loading>
  </div>
</template>

<script>


  import { post, on, off, formatNumber, getDictListByGroups, getDictValueFromMap } from "@/api/bizApi/commonUtil";
  export default {
    name: "imgConfirm",
    components: {

    },
    data() {
      return {
        columns: [
          {
            type: "selection",
            key: "multiSelect",
            width: 60,
            hiddenCol: false
          },
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pe.busiNo"),
            key: "busiNo",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.pc.transType"),
            key: "transType",
            hiddenCol: false,
            render: (h, params) => {
              let dict = params.row.transType === '1' ? '承兑' : '贴现';
              return h("span",
                {
                  domProps: {
                    title: dict
                  }
                }, dict);
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            },
          },
          {
            title: this.$t("m.i.billInfo.billClass"),
            key: "billClass",
            hiddenCol: false,
            sortable: true,
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
            title: this.$t("m.i.common.imgStatus"),
            key: "imgStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = '';
              if(params.row.imgStatus === '0'){
                dictValue = "未确认"
              }else if(params.row.imgStatus === '1'){
                dictValue = "确认完整"
              }else if(params.row.imgStatus === '2'){
                dictValue = "确认不完整"
              }
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: this.$t("m.i.pc.operTeller"),
            key: "operTellerNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pc.updateDt"),
            key: "updateTime",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let updateTime = params.row.updateTime == null ? "" : this.$moment(params.row.updateTime, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
              return h("span", {domProps: {title: updateTime}}, updateTime);
            }
          },
          {
            title: this.$t("m.i.common.showImg"),
            key: "showImage",
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
                      this.showImage(params.row.id,params.row.transType,params.row.prodNo)
                    }
                  }
                }, '查看')
              ]);
            }
          },
        ],
        authObj:{
          imageAdd: false,           //影像新增
          imageRegister: false,      //登记
          imageDelete: false         //删除
        },
        formItem: {
          busiNo: "",
          transType: "",
          billType: "",
          imgStatusList: []
        },
        dictMap : new Map(),
        showUploadImageWin : false,
        isCompleteEnable : false,
        isNoCompleteEnable : false,
        imageParams : {},
        billTypeList: [],
        uploadFileName: "",
        fileId: "",
        uploadWin: false,
        type: null,
        readonly: false,
        isRequired: true,
        submitFlag: false,
        ifShowMore: false,
      };
    },

    watch: {

    },
    methods: {
      formSearch() {
        this.isCompleteEnable = false;
        this.isNoCompleteEnable = false;
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      uploadImageWinClose() {
        this.showUploadImageWin = false;
      },
      showImage(batchId,transType,prodNo){
        if(transType === '1'){
          this.imageParams.imgTypeList=[{key : 'IM99',value :'承兑资料'}];
          this.imageParams.imgType = 'IM99';
        }else{
          this.imageParams.imgTypeList=[{key : 'IM20',value : '贴现资料'}];
          this.imageParams.imgType = 'IM20';
        }
        this.imageParams.listId = batchId;
        this.imageParams.prodNo = prodNo;
        this.imageParams.imgShowUrl = 'pc/img/imgConfirm/func_queryImageById?id=';
        this.imageParams.imageUrl = window.LOCAL_CONFIG.API_HOME + '/pc/img/imgConfirm/func_queryBatchImageByPage';
        this.imageParams.isByAttachId = false;
        this.showUploadImageWin = true;
      },
      confirmComplete(type){
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let tipMsg = type === '1' ? "确认影像完整？" : "确认影像不完整？";
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: tipMsg,
          onOk: () => {
            let list = this.$refs.datagrid.selects;
            let acptBatchIds = [];
            let discBatchIds = [];
            for(let i = 0 ; i < list.length ; i ++){
              if(list[i].transType === '1'){
                acptBatchIds.push(list[i].id);
              }else{
                discBatchIds.push(list[i].id);
              }
            }
            let params = {
              acptBatchIds : acptBatchIds,
              discBatchIds : discBatchIds,
              imgStatus : type
            };
            post(params, "/pc/img/imgConfirm/func_confirmImg").then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.isCompleteEnable = false;
                  this.isNoCompleteEnable = false;
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.$refs.datagrid.selects = [];
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              }
            }).catch(error => {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
            });
          }
        });
      },
      handleSelectClick(arr, selectInx) {
        this.isCompleteEnable = false;
        this.isNoCompleteEnable = false;
        if (this.$refs.datagrid.selects.length > 0) {
          for (let i = 0; i < this.$refs.datagrid.selects.length; i++) {
            let imgStatus = this.$refs.datagrid.selects[i].imgStatus;
            if(imgStatus === '1'){
              this.isCompleteEnable = true;
            }else if(imgStatus === '2'){
              this.isNoCompleteEnable = true;
            }
          }
        }
      }
    },

    mounted() {
      this.getDictListByGroups("DraftTypeCode,CDMedia").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.dictMap = res.get("map");
      });
    }

  };
</script>

<style scoped>

</style>
