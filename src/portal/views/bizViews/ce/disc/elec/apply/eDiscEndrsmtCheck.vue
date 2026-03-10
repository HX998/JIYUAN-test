<template>

  <h-msg-box v-model="tempEDiscEndrsmtWin" :mask-closable="false" @on-close="handleClose" width="800"
             class="h-form-search-layer" :zIndex="1002">
    <p slot="header">
      <span>背书校验结果</span>
    </p>
    <div v-if="this.endrsmtParams.backFlag === '1'">
      <h-datagrid :columns="endrsmtColumus"
                  highlight-row
                  :url="endrsmtCheckUrl"
                  :auto-load="false"
                  :height="150"
                  :title="backTiTle"
                  :show-title="true"
                  :bind-form="backEndrsmtFromItem"
                  ref="backDatagrid">
      </h-datagrid>
    </div>
    <div v-if="this.endrsmtParams.impawnFlag === '1'">
      <h-datagrid :columns="endrsmtColumus"
                  highlight-row
                  :url="endrsmtCheckUrl"
                  :auto-load="false"
                  :height="150"
                  :title="impawnTiTle"
                  :show-title="true"
                  :bind-form="impawnEndrsmtFromItem"
                  ref="impawnDatagrid">
      </h-datagrid>
    </div>
    <div v-if="this.endrsmtParams.sameFlag === '1'">
    <h-datagrid :columns="endrsmtColumus"
                highlight-row
                :url="endrsmtCheckUrl"
                :auto-load="false"
                :height="150"
                :title="sameTiTle"
                :show-title="true"
                :bind-form="sameEndrsmtFromItem"
                ref="sameDatagrid">
    </h-datagrid>
    </div>
    <div v-if="this.endrsmtParams.blackFlag === '1'">
    <h-datagrid :columns="endrsmtColumus"
                highlight-row
                :url="blackEndrsmtCheckUrl"
                :auto-load="false"
                :height="300"
                :title="blackTiTle"
                :show-title="true"
                :bind-form="blackEndrsmtFromItem"
                :has-page="false"
                ref="blackDatagrid">
    </h-datagrid>
    </div>
    <div slot="footer">
      <commit-btn @commit="endrsmtCheckSubmit"></commit-btn>
    </div>
  </h-msg-box>
</template>

<script>
  import { getDictListByGroups, getDictValueFromMap } from "@/api/bizApi/commonUtil";
    export default {
        name: "eDiscEndrsmtCheck",
      data(){
          return {
            endrsmtColumus:[
              {
                title: this.$t("m.i.common.index"),
                type: "index",
                width: 60,
                align: "center"
              },
              {
                title: this.$t("m.i.billInfo.billPackageNo"),
                key: "billNo",
                hiddenCol: false
              },
              {
                title: this.$t("m.i.ce.riskType"),
                key: "riskType",
                hiddenCol: false,
                render:(h,params) => {
                  let dictValue = getDictValueFromMap(this.dictMap,"EndrsmtRiskTypeCode",params.row.riskType);
                  return h("span", {
                    domProps: {
                      title: dictValue
                    }
                  }, dictValue);
                }
              },
              {
                title: this.$t("m.i.ce.endrsmtName"),
                key: "endrsmtName",
                sortable: true,
                hiddenCol: false
              }
            ],
            backEndrsmtFromItem:{
              batchId:"",
              discIds:"",
              riskType:""
            },
            impawnEndrsmtFromItem:{
              batchId:"",
              discIds:"",
              riskType:""
            },
            sameEndrsmtFromItem:{
              batchId:"",
              discIds:"",
              riskType:""
            },
            blackEndrsmtFromItem:{
              batchId:"",
              discIds:"",
              riskType:""
            },
            dictMap:new Map(),
            params:{
              batchId:"",
              ids:""
            },
            backTiTle:"回头背书",
            impawnTiTle:"质押背书",
            sameTiTle:"同名背书",
            blackTiTle:"黑名单背书",
            endrsmtCheckUrl:"",
            blackEndrsmtCheckUrl:""
          }
        },
      props:{
        endrsmtParams:{
          batchId:"",
          ids:"",
          backFlag:"",
          impawnFlag:"",
          sameFlag:"",
          blackFlag:"",
          endrsmtCheckUrl:"",
          blackEndrsmtCheckUrl:""
        },
        showEDiscEndrsmtCheckWin:{
          type: Boolean,
          default() {
            return false;
          }
        }
      },
      computed: {
        tempEDiscEndrsmtWin: {
          get() {
            return this.showEDiscEndrsmtCheckWin;
          },
          set() {
          }
        }
      },
      mounted() {
        getDictListByGroups("EndrsmtRiskTypeCode").then(res => {
          this.dictMap = res.get("map");
        });
      },
      methods:{
        handleSearch(){
          this.backEndrsmtFromItem.batchId = this.impawnEndrsmtFromItem.batchId = this.sameEndrsmtFromItem.batchId = this.blackEndrsmtFromItem.batchId = this.endrsmtParams.batchId;
          this.backEndrsmtFromItem.discIds = this.impawnEndrsmtFromItem.discIds = this.sameEndrsmtFromItem.discIds = this.blackEndrsmtFromItem.discIds = this.endrsmtParams.ids;
          this.backEndrsmtFromItem.riskType = "0";
          this.impawnEndrsmtFromItem.riskType = "1";
          this.sameEndrsmtFromItem.riskType = "2";
          this.blackEndrsmtFromItem.riskType = "3";
          this.params.batchId = this.endrsmtParams.batchId;
          this.params.ids = this.endrsmtParams.ids;
          this.endrsmtCheckUrl = this.endrsmtParams.endrsmtCheckUrl;
          this.blackEndrsmtCheckUrl = this.endrsmtParams.blackEndrsmtCheckUrl;
          if (this.endrsmtParams.backFlag === '1') {
            this.$nextTick(() => {
              this.$refs.backDatagrid.dataChange(1);
              this.$refs.backDatagrid.$refs.gridPage.clearElevator();
            });
          }
          if (this.endrsmtParams.impawnFlag === '1') {
            this.$nextTick(() => {
              this.$refs.impawnDatagrid.dataChange(1);
              this.$refs.impawnDatagrid.$refs.gridPage.clearElevator();
            })
          }
          if (this.endrsmtParams.sameFlag==='1') {
            this.$nextTick(() => {
              this.$refs.sameDatagrid.dataChange(1);
              this.$refs.sameDatagrid.$refs.gridPage.clearElevator();
            })
          }
          if (this.endrsmtParams.blackFlag === '1') {
            this.$nextTick(() => {
              this.$refs.blackDatagrid.dataChange(1);
            })
          }

        },
        handleClose(){
          this.$emit("endrsmtCheckWinClose","")
        },
        endrsmtCheckSubmit(){
          let msg = "";
          if (this.endrsmtParams.backFlag === '1') {
            let t1 = this.$refs.backDatagrid.total;
            if (t1 > 0) {
              msg+=" 回头背书 ";
            }
          }
          if (this.endrsmtParams.impawnFlag === '1') {
            let t2 = this.$refs.impawnDatagrid.total;
            if (t2 > 0) {
              msg+= " 质押背书 ";
            }

          }
          if (this.endrsmtParams.sameFlag==='1') {
            let t3 = this.$refs.sameDatagrid.total;
            if (t3 > 0) {
              msg+= " 同名背书 "
            }
          }
          if (this.endrsmtParams.blackFlag === '1') {
            let t4 = this.$refs.blackDatagrid.tData.length;
            if (t4 > 0) {
              msg+= " 黑名单背书 ";
            }
          }

          if (msg.length > 0) {
            let content = `<p class="word-break">票据存在 `+ msg + `,确定提交申请吗？</p>`;
            this.$hMsgBox.confirm({
              title: this.$t("m.i.common.confirm"),
              content: content,
              zIndex:1004,
              onOk: () => {
                this.$emit("endrsmtCheckWinSubmit",this.params)
              }
            });
          } else {
            this.$emit("endrsmtCheckWinSubmit",this.params);
          }
        }
      },
      watch: {
        showEDiscEndrsmtCheckWin(val) {
          if (val) {
            this.handleSearch()
          }
        }
      },
    }
</script>

