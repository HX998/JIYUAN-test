<!--信息披露业务 新增/修改弹窗共用字段-->
<template>
  <div>
    <!--批次号-->
    <common-input v-model="addForm.batchNo" :label="$t('m.i.common.batchNo')" prop="batchNo" :readonly="true"
                  :showIcon="batchParams.batchType==='add'?true:false" @on-click="queryProductName"></common-input>
    <!--标票产品名称-->
    <common-input v-model="addForm.stdProductName" :label="$t('m.i.bs.stdProductName')" prop="stdProductName" readonly :required="true"
                  ></common-input>
    <!--标票产品简称-->
    <common-input v-model="addForm.stdProductShortName" :label="$t('m.i.bs.stdProductShortName')" prop="stdProductShortName"  :required="true"
                  :readonly="true"></common-input>
    <!--标票产品代码-->
    <common-input v-model="addForm.stdProductNo" :label="$t('m.i.bs.stdProductNo')" prop="stdProductNo"  :required="true"
                  :readonly="true"></common-input>
    <!--基础资产种类-->
    <common-select v-model="addForm.baseAssetType" :label="$t('m.i.bs.baseAssetType')"
                   prop="baseAssetType" :dictList="batchParams.baseAssetTypeList"  :required="true" readonly></common-select>
    <!--披露日期-->
    <common-date-picker v-model="addForm.publishDt" :label="$t('m.i.bs.publishDt')" prop="publishDt"
                        :options="publishDtFilter" :required="true"  @on-change="changePublishDt" :readonly="batchParams.batchType!=='add'"></common-date-picker>
    <!--披露类型-->
    <common-select v-model="addForm.publishType" :label="$t('m.i.bs.publishType')"
                   prop="publishType" :dictList="batchParams.publishTypeList"  :required="true" :readonly="batchParams.batchType!=='add'"></common-select>
    <!--披露方式-->
    <common-select v-model="addForm.publishMode" :label="$t('m.i.bs.publishMode')"
                   prop="publishMode" :dictList="batchParams.publishModeList"  :required="true" :readonly="batchParams.batchType==='show'"></common-select>

    <std-creation-product :showStdCreationProduct="showStdCreationProduct" @showStdCreationProductClose="showStdCreationProductClose"
                          :batchParams="batchParams" @showStdCreationProductSubmit="showStdCreationProductSubmit"></std-creation-product>
  </div>
</template>

<script>
  import { post } from "@/api/bizApi/commonUtil";
    export default {
      name: "stdPublishFormItem",
      components: {
        StdCreationProduct:()=>import(/* webpackChunkName: "bs/corpstdbill/common/stdCreationProduct" */`@/views/bizViews/bs/corpstdbill/common/stdCreationProduct`),
      },
      data() {
        let _this = this;
        return {
          publishDtFilter: {
            disabledDate (date) {
              return  _this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD") > date && date.valueOf() ;
            }
          },
          memberId: JSON.parse(window.sessionStorage.getItem('userInfo')).memberId,
          productBrchType: "4",//资管非法人产品机构类型
          cpesProductBranch: false,
          showStdPublishProduct: false,
          showStdCreationProduct: false,
          dictMap: new Map(),
        }
      },
      props: {
        addForm: {
          type: Object,
          default() {
            return {};
          }
        },
        batchParams: {
          type: Object,
          default() {
            return {};
          }
        }
    },
      mounted() {
        this.getDictListByGroups("BaseAssetType,TransPlace").then(res => {
          this.dictMap = res.get("map");
        });
      },
      methods:{
        // 根据弹框所选数据进行赋值
        queryProductName() {
          this.showStdCreationProduct = true;
          this.batchParams.dictMap=this.dictMap;
          this.batchParams.datagridUrl="/bs/corpstdbill/publish/stdPublishApply/func_queryStdPublishTrackQuery";
        },
        showStdCreationProductClose() {
          this.showStdCreationProduct = false;
        },
        showStdCreationProductSubmit(info) {
          if (info === null) {
            this.$msgTip.info(this, { info: "请先选择记录！" });
            return;
          }
          this.addForm.stdProductNo = info.stdProductNo;
          this.addForm.stdProductName = info.stdProductName;
          this.addForm.stdProductShortName = info.stdProductShortName;
          this.addForm.batchNo = info.batchNo;
          this.addForm.baseAssetType = info.baseAssetType;
          this.addForm.listId = info.id;
          this.addForm.prodNo = info.prodNo;
          this.showStdCreationProductClose();
        },

        changePublishDt(currVal){
          if (!this.batchParams.isPublishDt) {
            this.batchParams.isPublishDt = true;
            return;
          }
          post({code:this.$moment(currVal, "YYYYMMDD").format('YYYYMMDD')},'/sm/oper/holiday/isHoliday').then(res=>{
            if(res && res.data.retCode==='000000'){
              if(res.data.retData === true){
                this.$msgTip.info(this,{info:'您选择的是节假日，请重新选择！'});
                this.addForm.publishDt='';
              }
            }
          });
        }

      }
    };
</script>

<style scoped>

</style>
