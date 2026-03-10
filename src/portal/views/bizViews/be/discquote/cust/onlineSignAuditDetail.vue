<!--额度批复-票据池额度批复明细-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div class="text-wrap mb-10">
          <div class="text-header"><span class="tit">详细信息</span></div>
          <div class="text-body">
            <h-field-panel collapse>
              <span slot="title">客户基本信息</span>
              <h-row :gutter="8">
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">贴现申请人名称：</h-col>
                    <!--                  <h-col span="15" class="val">format("QuoteBusiType",formItem.busiType)</h-col>-->
                    <h-col span="15" class="val">{{signDetailForm.discCustName}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">统一社会信用代码：</h-col>
                    <h-col span="15" class="val">{{signDetailForm.discOutSocCode}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">贴现机构名称：</h-col>
                    <h-col span="15" class="val">{{signDetailForm.discBranchName}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">贴现机构代码：</h-col>
                    <h-col span="15" class="val">{{signDetailForm.discBranchCode}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">签约申请日期：</h-col>
                    <h-col span="15" class="val">{{signDetailForm.signApplyDate}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">中征码：</h-col>
                    <h-col span="15" class="val">{{signDetailForm.lccCode}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">地区：</h-col>
                    <h-col span="15" class="val">{{format("Province", signDetailForm.area)}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">住所：</h-col>
                    <h-col span="15" class="val">{{signDetailForm.address}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">企业类型：</h-col>
                    <h-col span="15" class="val">{{format("CorpCategory", signDetailForm.corpCategory)}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">企业所有制形式：</h-col>
                    <h-col span="15" class="val">{{format("CpesCorpNature", signDetailForm.corpNature)}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">注册资本（万元）：</h-col>
                    <h-col span="15" class="val">{{signDetailForm.corpRegistCapital}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">营业收入（万元）：</h-col>
                    <h-col span="15" class="val">{{signDetailForm.busiinc}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">资产总额（万元）：</h-col>
                    <h-col span="15" class="val">{{signDetailForm.totalAssets}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">从业人员（人）：</h-col>
                    <h-col span="15" class="val">{{signDetailForm.employees}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">企业规模：</h-col>
                    <h-col span="15" class="val">{{format("CorpScale", signDetailForm.discCorpScale)}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">行业分类：</h-col>
                    <h-col span="15" class="val">{{format("Industry", signDetailForm.discIndustry)}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">是否涉农企业：</h-col>
                    <h-col span="15" class="val">{{format("Yon", signDetailForm.isDiscArc)}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">是否绿色企业：</h-col>
                    <h-col span="15" class="val">{{format("Yon", signDetailForm.isDiscGreenCorp)}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">是否科技企业：</h-col>
                    <h-col span="15" class="val">{{format("Yon", signDetailForm.isDiscTechnologyCorp)}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">是否民营企业：</h-col>
                    <h-col span="15" class="val">{{format("Yon", signDetailForm.isDiscPrivateCorp)}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">营业期限（自）：</h-col>
                    <h-col span="15" class="val">{{signDetailForm.fctvDt}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">营业期限（至）：</h-col>
                    <h-col span="15" class="val">{{signDetailForm.xpryDt}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">经营范围：</h-col>
                    <h-col span="15" class="val">{{signDetailForm.businessScope}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">备注：</h-col>
                    <h-col span="15" class="val">{{signDetailForm.applRemark}}</h-col>
                  </h-row>
                </h-col>
              </h-row>

            </h-field-panel>
          </div>


          <div class="text-body">
            <h-field-panel collapse>
              <span slot="title">授权经办人信息</span>
              <h-row :gutter="8">
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">授权经办人姓名：</h-col>
                    <h-col span="15" class="val">{{signDetailForm.agentName}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">授权经办人身份证号码：</h-col>
                    <h-col span="15" class="val">{{signDetailForm.agentDocNo}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">授权经办人联系电话：</h-col>
                    <h-col span="15" class="val">{{signDetailForm.agentPhone}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">授权经办人电子邮箱：</h-col>
                    <h-col span="15" class="val">{{signDetailForm.agentEmail}}</h-col>
                  </h-row>
                </h-col>
              </h-row>
            </h-field-panel>
          </div>

          <div class="text-body">
            <h-field-panel collapse>
              <span slot="title">法定代表人信息</span>
              <h-row :gutter="8">
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">法定代表人姓名：</h-col>
                    <h-col span="15" class="val">{{signDetailForm.corpLegalName}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">法定代表人国籍：</h-col>
                    <h-col span="15" class="val">{{signDetailForm.corpLegalNationality}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">法定代表人证件类型：</h-col>
                    <h-col span="15" class="val">{{format("CertType", signDetailForm.corpLegalCertifyType)}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">法定代表人证件号码：</h-col>
                    <h-col span="15" class="val">{{signDetailForm.corpLegalCertifyNo}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">法定代表人证件签发日：</h-col>
                    <h-col span="15" class="val">{{signDetailForm.corpLegalDocDt}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">法定代表人证件到期日：</h-col>
                    <h-col span="15" class="val">{{signDetailForm.corpLegalDocDueDt}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">法定代表人证件签发城市：</h-col>
                    <h-col span="15" class="val">{{signDetailForm.corpLegalIssuingCity}}</h-col>
                  </h-row>
                </h-col>
              </h-row>
            </h-field-panel>
          </div>

          <div class="text-body">
            <h-field-panel collapse>
              <span slot="title">开票信息</span>
              <h-row :gutter="8">
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">是否需要开票：</h-col>
                    <h-col span="15" class="val">{{format("Yon", signDetailForm.needInv)}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">开票种类：</h-col>
                    <h-col span="15" class="val">{{format("InvType", signDetailForm.invType)}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">纳税人类型：</h-col>
                    <h-col span="15" class="val">{{format("TaxpayerTp", signDetailForm.taxerType)}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">纳税人名称：</h-col>
                    <h-col span="15" class="val">{{signDetailForm.taxerName}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">纳税人识别号：</h-col>
                    <h-col span="15" class="val">{{signDetailForm.taxerCode}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">地址：</h-col>
                    <h-col span="15" class="val">{{signDetailForm.taxerInvAddr}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">电话：</h-col>
                    <h-col span="15" class="val">{{signDetailForm.taxerTel}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">开户银行名称：</h-col>
                    <h-col span="15" class="val">{{signDetailForm.taxerAcctBankName}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">开户银行账号：</h-col>
                    <h-col span="15" class="val">{{signDetailForm.taxerAcctNo}}</h-col>
                  </h-row>
                </h-col>
              </h-row>
            </h-field-panel>
          </div>

          <div class="text-body">
            <h-field-panel collapse>
              <span slot="title">受理信息</span>
              <h-row :gutter="8">
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">受理类型：</h-col>
                    <h-col span="15" class="val">{{format("OnlineSignOperType", signDetailForm.auditOperType)}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">签约有效期至：</h-col>
                    <h-col span="15" class="val">{{signDetailForm.auditSignEndDate}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">授信额度（元）：</h-col>
                    <h-col span="15" class="val">{{signDetailForm.auditCreditAmt}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">受理备注：</h-col>
                    <h-col span="15" class="val">{{signDetailForm.auditRemark}}</h-col>
                  </h-row>
                </h-col>
              </h-row>
            </h-field-panel>
          </div>

        </div>
      </h-col>
    </h-row>

  </div>
</template>

<script>
  import {post} from "@/api/bizApi/commonUtil";

  export default {
    name: "quoteControlAudit",
    data() {
      return {
        dictMap: new Map(),
        // 详情
        signDetailForm: {
          // id: null,
          // auditResult: "",
          auditRemark: "可以",
          auditOperType: "2",
          auditSignEndDate: "",
          auditCreditAmt: "",
          // signDueDate: null,
          // creditAmt: "",

          // signId: "",
          // custId: "",
          // discCustName: "有个公司",
          // discOutSocCode: "913601231111112222",
          // discBranchName: "中国建设银行",
          // discBranchCode: "95533",
          // signApplyDate: "20220706",
          // lccCode: "1008611",
          // area: "37",
          // address: "浙江上杭州市钱塘区文泽北路245号",
          // corpCategory: "1100",
          // corpNature: "CT01",
          // corpRegistCapital: "2000.12",
          // discIndustry: "D0000",
          // busiinc: "5000",
          // totalAssets: "1250000",
          // employees: "8746",
          // discCorpScale: "SC00",
          // isDiscArc: "0",
          // isDiscGreenCorp: "1",
          // isDiscTechnologyCorp: "1",
          // isDiscPrivateCorp: "1",
          // fctvDt: "20000501",
          // xpryDt: "20990101",
          // businessScope: "技术转让、技术咨询、技术服务、技术培训、技术推广;设计、开发、销售计算机软件;经济信息咨询",
          // applRemark: "百度（Baidu）是拥有强大互联网基础的领先AI公司。百度愿景是：成为最懂用户，并能帮助人们成长的全球顶级高科技公司。",
          // agentName: "赵大海",
          // agentDocNo: "360123200812304458",
          // agentPhone: "15877779999",
          // agentEmail: "zhaoda@google.com",
          // corpLegalName: "钱二喜",
          // corpLegalNationality: "中国",
          // corpLegalCertifyType: "DC01",
          // corpLegalCertifyNo: "360123198001010105",
          // corpLegalDocDt: "20200506",
          // corpLegalDocDueDt: "20300506",
          // corpLegalIssuingCity: "香港",
          // needInv: "1",
          // invType: "IT01",
          // taxerType: "TP01",
          // taxerName: "孙三妹",
          // taxerCode: "91110000802100433B",
          // taxerInvAddr: "北京市海淀区上地十街10号百度大厦2层",
          // taxerTel: "18877779999",
          // taxerAcctBankName: "中国建设银行某个支行",
          // taxerAcctNo: "6227002021230000123",
          //
          // signStatus: "ST02",
          // signDueDate: "20301231",
          // creditAmt: "2000000.00",
          // creditBalance: "1900000.00",
          // usedAmt: "100000.00"
        },
        operId: "",
      };
    },
    props: {
      isShow: {
        type: Boolean,
        default: false
      },
      listIds: "",
      batchId: ""
    },
    created() {
      this.operId = this.batchId;
      console.log("craated operId", this.operId)
    },
    mounted() {
      console.log("mounted");
      this.getDictListByGroups("DsctSignStatus,CorpCategory,CpesCorpNature," +
        "CorpScale,Industry,Yon,CertType,InvType,TaxpayerTp," +
        "Province,OnlineSignOperType,OnlineSignApplyType")
        .then(res => {
          this.dictMap = res.get("map");
        });
      this.init();

    },
    methods: {
      init() {
        let batchId = this.operId;
        if (!batchId) {
          this.$msgTip.error(this, {info: "批次ID不能为空"});
          return;
        }

        let url = "/be/discquote/onlineSign/func_getOnlineSignAuditDetail";

        post({id: batchId}, url).then(res => {
          if (res && res.data) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.signDetailForm = res.data.retData;
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, {info: this.$t('m.i.common.netError') + error});
        })
      },
      format(groupCode, key) {
        return this.getDictValueFromMap(this.dictMap, groupCode, key)
      },
    }
  };
</script>

<style scoped>

</style>
