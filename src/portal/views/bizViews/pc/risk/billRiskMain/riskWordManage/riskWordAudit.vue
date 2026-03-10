<template>
  <div>
    <!-- 批次信息 -->
    <div v-if="isShow">
      <div class="text-wrap mb-10">
        <div class="text-header"><span class="tit">{{$t('m.i.ce.detailInfo')}}</span></div>
        <div class="text-body">
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.pc.riskObject')}}：</h-col>
                <h-col span="15" class="val">{{ this.getDictValueFromMap(this.dictMap, 'RiskObjCode', viewDetailForm.riskObject) }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.pc.remindRiskWord')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.remindRiskWord }}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.pc.banRiskWord')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.banRiskWord }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.common.operType')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.operType }}</h-col>
              </h-row>
            </h-col>
          </h-row>
        </div>
      </div>
    </div>
    <!-- 数据展示表格 -->
    <div v-if="isShow">
      <h-datagrid
        :columns="columns"
        highlight-row
        :height="350"
        :bindForm="formItem"
        url= "/pc/risk/billRiskMain/riskWordManage/riskWordMain/func_auditRiskWordDetail"
        ref="datagrid">
      </h-datagrid>
    </div>
  </div>
</template>

<script>
    import {formatNumber, getDictListByGroups, getDictValueFromMap, post,getBusinessParameter } from "@/api/bizApi/commonUtil";
    export default {
        name: "riskWordAudit",
        data(){
            return{
                viewDetailForm : {
                    riskObject : "",
                    remindRiskWord : "",
                    banRiskWord : "",
                    operType : ""
                },
                formItem : {
                    id: "",
                },
                columns : [
                    {
                        title: ' ',
                        type: "selection",
                        width: 60,
                        align: "center",
                        hiddenCol: false
                    },
                    {
                        title: this.$t("m.i.common.index"),
                        type: "index",
                        width: 60,
                        key:"index",
                        align: "center"
                    },
                    {
                        title: this.$t("m.i.pc.riskObject"),
                        key:"riskObj",
                        hiddenCol: false,
                        render: (h, params) => {
                            let dictValue =this.getDictValueFromMap(this.dictMap, 'RiskObjCode', params.row.riskObj);
                            return h("span", {
                                domProps: {
                                    title: dictValue
                                }
                            }, dictValue);
                        }
                    },
                    {
                        title: this.$t("m.i.pc.remindRiskWord"),
                        key:"remindRiskWord",
                        hiddenCol: false,
                    },
                    {
                        title: this.$t("m.i.pc.banRiskWord"),
                        key:"banRiskWord",
                        hiddenCol: false,
                    },
                    {
                        title: this.$t("m.i.pc.createUser"),
                        key:"operTellerName",
                        hiddenCol: false,
                    },
                    {
                        title: this.$t("m.i.common.operTm"),
                        key: 'createTime',
                        sortable: true,
                        render: (h, params) => {
                            if (params.row.createTime == null || params.row.createTime === "") {
                                return "";
                            }
                            let date = params.row.createTime.toString().substring(0,8);
                            let time = params.row.createTime.toString().substring(8,14);
                            let createTime =this.$moment(date, "YYYY-MM-DD").format("YYYY-MM-DD")+" "+ this.$moment(time, "HH:mm:ss").format("HH:mm:ss");
                            return h("span", createTime);
                        }
                    },
                    {
                        title: this.$t("m.i.common.updateTime"),
                        key:"updateTime",
                        hiddenCol: false,
                        render: (h, params) => {
                            if (params.row.updateTime == null || params.row.updateTime === "") {
                                return "";
                            }
                            let date = params.row.updateTime.toString().substring(0,8);
                            let time = params.row.updateTime.toString().substring(8,14);
                            let updateTime =this.$moment(date, "YYYY-MM-DD").format("YYYY-MM-DD")+" "+ this.$moment(time, "HH:mm:ss").format("HH:mm:ss");
                            return h("span", updateTime);
                        }
                    }
                ],
                dictMap : new Map(),
                operStatusList:[],
                riskObjList : [],
                operTypeList : [],
                riskLevelList : [],
            }
        },
        created() {
            this.formItem.id = this.listIds[0];
        },
        mounted() {
            this.getDictListByGroups("OperStatusCode,RiskObjCode,OperTypeCode,RiskLevel").then(res => {
                this.operStatusList=res.get("OperStatusCode");
                this.riskObjList = res.get("RiskObjCode");
                this.operTypeList = res.get("OperTypeCode");
                this.riskLevelList = res.get("RiskLevel");
                this.dictMap = res.get("map");
            });
            this.getBatchInfo();
        },
        props: {
            isShow: {
                type: Boolean,
                default: false
            },
            listIds: "",
            batchId: "",
        },
        methods : {
            getBatchInfo() {
                let url = "/pc/risk/billRiskMain/riskWordManage/riskWordMain/func_auditRiskWordDetail";
                //获取细信息
                let id = this.listIds[0];
                post({ id : id }, url).then(res => {
                    if (res) {
                        let msg = res.data.retMsg;
                        let retCode = res.data.retCode;
                        let data = res.data.retData.list[0];
                        if (retCode === "000000") {
                            if(data !== null && data !== undefined){
                                this.viewDetailForm.riskObject = data.riskObj;
                                this.viewDetailForm.remindRiskWord = data.remindRiskWord;
                                this.viewDetailForm.banRiskWord = data.banRiskWord;
                                let operStatus = data.operStatus;
                                if(operStatus.substring(0,1) === "1"){
                                    this.viewDetailForm.operType = "新增";
                                }else if(operStatus.substring(0,1) === "2"){
                                    this.viewDetailForm.operType = "修改";
                                }else if(operStatus.substring(0,1) === "3"){
                                    this.viewDetailForm.operType = "删除";
                                }
                            }else{
                                this.$msgTip.error(this, { info: "未查到详细信息！" });
                            }
                        } else {
                            this.$msgTip.error(this, { info: msg });
                        }
                    }else{
                        this.$msgTip.error(this,{info:this.$t('m.i.common.netError')});
                    }
                }).catch(error => {
                    this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
                });
            },
        }
    }
</script>

<style scoped>

</style>
