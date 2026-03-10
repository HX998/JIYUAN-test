<template>
  <!-- 展示导出模板 -->
  <div class="h-tree-search">
    <div class="h-modal-header-wrapper">
      <h-msg-box v-model="tempShowExcelTemplateWin" :zIndex="zIndex" width="400" height="300" class="h-form-table-layer" :maximize="true" @on-close="handleClose" :mask-closable="false">
        <p slot="header">
          <span>导出模板</span>
        </p>
        <div style="padding-left: 20px">
          <h-radio-group v-model="exportType">
            <h-radio label="0">
              <span>{{$t("m.i.common.synch")}}</span>
            </h-radio>
            <h-radio label="1">
              <span>{{$t("m.i.common.asynch")}}</span>
            </h-radio>
          </h-radio-group>
          <div class="h-invoice-details">
            <span>同步支持最大导出条数为：{{this.maxSyncExportRows}}条</span>
          </div>
          <div style="height:210px; overflow-y: auto; margin-top:10px">
            <h-checkbox-group v-model="field" vertical>
              <h-checkbox v-for="(value, key) in fieldToCellNameMap" :label="key" :key="key">
                <span>{{value}}</span>
              </h-checkbox>
            </h-checkbox-group>
          </div>
        </div>
        <div slot="footer">
          <span>
             <h-button type="ghost" @click="handleClose()">关闭</h-button>
          </span>
          <span>
             <h-button type="primary" @click="handleSubmit()">确定导出</h-button>
          </span>
        </div>
      </h-msg-box>
    </div>
  </div>
</template>

<script>
  import { post } from "@/api/bizApi/commonUtil";

  export default {
    name: "commonExcelDownload",
    data() {
      return{
        fieldToCellNameMap : new Map(),
        excelBuildReq : [],
        exportType : "",
        field : [],
        maxSyncExportRows : "", //同步最大导出条数
        maxAsyncExportRows : "",  //异步最大导出条数
        tempShowExcelTemplateWin: false
      }
    },
    watch: {
      showExcelTemplateWin(val) {
        if (val === true) {
          this.getExcelInfo();
          this.getMaxExcelExportRows();
        }
      }
    },
    computed: {
      // tempShowExcelTemplateWin: {
      //   get() {
      //     return this.showExcelTemplateWin;
      //   },
      //   set() {
      //   }
      // },
      /*fieldToCellNameMap: {
        get() {
          return this.fieldToCellNameMap;
        },
      }*/
    },
    props: {
      title: {
        type: String,
        default: "Excel导出模板"
      },
      param: "",
      rows: "",
      isLimitMaxExport: {//异步导出，是否限制最大导出数
        type: Boolean,
        default() {
          return true;
        }
      },
      showExcelTemplateWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      exclundFields:{  // 需要剔除的field
        type:Array,
        default(){
          return [];
        }
      },
      zIndex:{
        type:Number,
      }
    },
    methods: {
      //获取导出模板
      getExcelInfo() {
        this.$loadingbox.open({
          title: "获取导出模板中，请稍后..."
        });
        let param = this.param;
        let url = '/pc/report/excel/getExcel';
        post({code: param}, url).then(res => {
          if (res) {
            this.$loadingbox.close();
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.excelBuildReq = res.data.retData;
              this.fieldToCellNameMap = this.excelBuildReq.fieldToCellNameMap;
              this.field = this.excelBuildReq.field;
              if (this.exclundFields.length >0){
                // 有需要进行剔除的字段
                for (let key in this.exclundFields) {
                  delete this.fieldToCellNameMap[this.exclundFields[key]];
                  let index=this.field.indexOf(this.exclundFields[key]);
                  if (index > -1){
                    this.field.splice(index,1);//删除元素
                  } ;
                }
              } ;
              this.tempShowExcelTemplateWin = true;
            } else {
              this.handleClose();
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$loadingbox.close();
            this.handleClose();
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //获取最大导出条数
      getMaxExcelExportRows() {
        let url = '/pc/report/excel/getMaxExcelExportRows';
        post({}, url).then(res => {
          if (res) {
            let retData = res.data.retData;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.maxSyncExportRows = retData.syncExportRows;
              this.maxAsyncExportRows = retData.asyncExportRows;
              if(this.maxSyncExportRows > this.rows){
                this.exportType = "0"
              }else {
                this.exportType = "1"
              }
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //确定导出
      handleSubmit() {
        if (this.rows <= 0) {
          this.$msgTip.info(this, { info: "查询处理中或查询无记录，无需导出"});
          return;
        }
        if(this.maxSyncExportRows < this.rows && this.exportType === '0'){
          this.$msgTip.error(this, { info: "导出条数超过最大导出条数，不允许同步导出"});
          return ;
        }
        if(this.isLimitMaxExport && this.maxAsyncExportRows < this.rows && this.exportType === '1'){
          this.$msgTip.error(this, { info: "导出数据超过"+Number(this.maxAsyncExportRows)+"条，数据量过大，请筛选查询条件"});
          return ;
        }
        if(this.exportType === '0'){
          this.$loadingbox.open({
            title: "导出中，切勿重复点击导出按钮，请等待Excel生成..."
          });
        }
        this.$emit("handleSubmit",this.field, this.exportType);
        if(this.exportType === '0'){
          setTimeout(() => {
            this.$loadingbox.close();
          }, 2000);
        }
        this.handleClose();
      },
      //关闭
      handleClose() {
        this.tempShowExcelTemplateWin = false;
        this.$emit("showExcelTemplateWinClose", "");
      }
    }
  };
</script>

<style scoped>

</style>
