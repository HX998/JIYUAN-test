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
                <h-col span="9" class="label">{{$t('m.i.common.custName')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.custName }}</h-col>
              </h-row>
            </h-col>
            <h-col span="16">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.pc.operRemark')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.remark }}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
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
        url= "pc/risk/billRiskMain/whiteRollManage/riskBillWhiteRollMain/func_auditRiskWhiteDetail"
        ref="discTrackBillDatagrid">
        <div slot="toolbar">
          <h-button type="primary" v-if="this.isNeedUpdDiscImg" @click="viewAuditImage">{{$t('m.i.common.showImg')}}</h-button>
        </div>
      </h-datagrid>
    </div>
  </div>
</template>

<script>
    import {formatNumber, getDictListByGroups, getDictValueFromMap, post,getBusinessParameter } from "@/api/bizApi/commonUtil";

    export default {
        name: "riskBillWhiteAudit",
        data(){
            return{
                dictMap : new Map(),
                operStatusList:[],
                operTypeList : [],
                viewDetailForm : {
                    custName : "",
                    remark : "",
                    operType : ""
                },
                formItem : {
                    id: "",
                },
                columns : [
                    {
                        type: "selection",
                        width: 60,
                        key: "multiSelect",
                        align: "center",
                    },
                    {
                        type: 'index',
                        key: 'numOrder',
                        title: this.$t("m.i.common.index"),
                        width: 60,
                        align: 'center',
                    },
                    {
                        title: this.$t("m.i.common.custName"),
                        key: 'custName',
                        sortable: true,
                    },
                    {
                        title: this.$t("m.i.pc.createUser"),
                        key: 'createTellerNo',
                        sortable: true,
                    },
                    {
                        title: this.$t("m.i.common.createTime"),
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
                        title: this.$t("m.i.pc.newUpdateTime"),
                        key: 'updateTime',
                        sortable: true,
                        render: (h, params) => {
                            if (params.row.createTime == null || params.row.createTime === "") {
                                return "";
                            }
                            let date = params.row.createTime.toString().substring(0, 8);
                            let time = params.row.createTime.toString().substring(8, 14);
                            let createTime = this.$moment(date, "YYYY-MM-DD").format("YYYY-MM-DD")+" "+ this.$moment(time, "HH:mm:ss").format("HH:mm:ss");
                            return h("span", createTime);
                        }
                    }
                ]
            }
        },
        created() {
              this.formItem.id = this.listIds[0];
        },
        mounted() {
            this.getDictListByGroups("OperStatusCode,OperTypeCode").then(res => {
                this.operStatusList = res.get("OperStatusCode");
                this.operTypeList = res.get("OperTypeCode");
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
                let url = "pc/risk/billRiskMain/whiteRollManage/riskBillWhiteRollMain/func_auditRiskWhiteDetail";
                //获取细信息
                let id = this.listIds[0];
                post({ id : id }, url).then(res => {
                    if (res) {
                        let msg = res.data.retMsg;
                        let retCode = res.data.retCode;
                        let data = res.data.retData.list[0];
                        if (retCode === "000000") {
                            if(data !== null && data !== undefined){
                                this.viewDetailForm.custName = data.custName;
                                this.viewDetailForm.remark = data.operRemark;
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
