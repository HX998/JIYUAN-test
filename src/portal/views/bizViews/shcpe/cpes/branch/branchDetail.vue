<template>
  <!--全市场机构查看详情弹出框-->
  <h-msg-box v-model="tempBranchDatailWin" width="800" :mask-closable="false" @on-close="handleClose"
             :maximize="true">
    <p slot="header">
      <span>机构详情</span>
    </p>
    <h-tabs value="viewDatail" :model="viewDatailForm" ref="tabs">
      <h-tab-pane label="机构信息" name="branchInfo">
        <h-form>
          <div class="text-wrap mb-10">
            <div class="text-body">
              <h-row :gutter="12">
                <h-col span="12">
                  <h-row>
                    <h-col span="9" class="label">{{$t("m.i.common.brchFullNameZh")}}:</h-col>
                    <h-col span="15" class="val">{{viewDatailForm.brchFullNameZh}}</h-col>
                  </h-row>
                  <h-row>
                    <h-col span="9" class="label">{{$t("m.i.common.brchShortNameZh")}}:</h-col>
                    <h-col span="15" class="val">{{viewDatailForm.brchShortNameZh}}</h-col>
                  </h-row>
                  <h-row>
                    <h-col span="9" class="label">{{$t('m.i.common.socCode')}}:</h-col>
                    <h-col span="15" class="val">{{viewDatailForm.socCode}}</h-col>
                  </h-row>
                  <h-row>
                    <h-col span="9" class="label">{{$t('m.i.common.bankProv')}}:</h-col>
                    <h-col span="15" class="val">{{viewDatailForm.transProvince}}</h-col>
                  </h-row>
                  <h-row>
                    <h-col span="9" class="label">{{$t('m.i.common.brchType')}}:</h-col>
                    <h-col span="15" class="val">{{viewDatailForm.brchTypeName}}</h-col>
                  </h-row>
                  <h-row>
                    <h-col span="9" class="label">{{$t('m.i.shcpe.transBrchClass')}}:</h-col>
                    <h-col span="15" class="val">{{viewDatailForm.transBrchClassName}}</h-col>
                  </h-row>
                  <h-row>
                    <h-col span="9" class="label">{{$t('m.i.shcpe.brchLegalLevel')}}:</h-col>
                    <h-col span="15" class="val">{{viewDatailForm.transCorpClassName}}</h-col>
                  </h-row>
                  <h-row>
                    <h-col span="9" class="label">{{$t('m.i.shcpe.prodFirstDate')}}:</h-col>
                    <h-col span="15" class="val">{{viewDatailForm.prodBeginDt}}</h-col>
                  </h-row>
                  <h-row>
                    <h-col span="9" class="label">{{$t('m.i.shcpe.undertakeBrch')}}:</h-col>
                    <h-col span="15" class="val">{{viewDatailForm.continueBranchName}}</h-col>
                  </h-row>
                  <h-row>
                    <h-col span="9" class="label">{{$t('m.i.shcpe.custNo')}}:</h-col>
                    <h-col span="15" class="val">{{viewDatailForm.custNo}}</h-col>
                  </h-row>
                  <h-row>
                    <h-col span="9" class="label">{{$t('m.i.shcpe.certificateType')}}:</h-col>
                    <h-col span="15" class="val">{{viewDatailForm.certifyType}}</h-col>
                  </h-row>
                  <h-row>
                    <h-col span="9" class="label">{{$t('m.i.shcpe.brchStatus')}}:</h-col>
                    <h-col span="15" class="val">{{viewDatailForm.brchStatusName}}</h-col>
                  </h-row>
                </h-col>

                <h-col span="12">
                  <h-row>
                    <h-col span="9" class="label">{{$t('m.i.common.brchFullNameEn')}}:</h-col>
                    <h-col span="15" class="val">{{viewDatailForm.brchFullNameEn}}</h-col>
                  </h-row>
                  <h-row>
                    <h-col span="9" class="label">{{$t('m.i.common.brchShortNameEn')}}:</h-col>
                    <h-col span="15" class="val">{{viewDatailForm.brchShortNameEn}}</h-col>
                  </h-row>
                  <h-row>
                    <h-col span="9" class="label">{{$t('m.i.common.brchCode')}}:</h-col>
                    <h-col span="15" class="val">{{viewDatailForm.brchCode}}</h-col>
                  </h-row>
                  <h-row>
                    <h-col span="9" class="label">{{$t('m.i.shcpe.bankProvCode')}}:</h-col>
                    <h-col span="15" class="val">{{viewDatailForm.transProvinceCode}}</h-col>
                  </h-row>
                  <h-row>
                    <h-col span="9" class="label">{{$t('m.i.shcpe.brchTypeCode')}}:</h-col>
                    <h-col span="15" class="val">{{viewDatailForm.brchType}}</h-col>
                  </h-row>
                  <h-row>
                    <h-col span="9" class="label">机构类型代码:</h-col>
                    <h-col span="15" class="val">{{viewDatailForm.transBrchClass}}</h-col>
                  </h-row>
                  <h-row>
                    <h-col span="9" class="label">{{$t('m.i.shcpe.brchNum')}}:</h-col>
                    <h-col span="15" class="val">{{viewDatailForm.brchNum}}</h-col>
                  </h-row>
                  <h-row>
                    <h-col span="9" class="label">{{$t('m.i.shcpe.prodEndDate')}}:</h-col>
                    <h-col span="15" class="val">{{viewDatailForm.prodEndDt}}</h-col>
                  </h-row>
                  <h-row>
                    <h-col span="9" class="label">{{$t('m.i.common.continueBrchCode')}}:</h-col>
                    <h-col span="15" class="val">{{viewDatailForm.continueBrchCode}}</h-col>
                  </h-row>
                  <h-row>
                    <h-col span="9" class="label">{{$t('m.i.shcpe.custName')}}:</h-col>
                    <h-col span="15" class="val">{{viewDatailForm.customerName}}</h-col>
                  </h-row>
                  <h-row>
                    <h-col span="9" class="label">{{$t('m.i.shcpe.certificateNo')}}:</h-col>
                    <h-col span="15" class="val">{{viewDatailForm.certifyNo}}</h-col>
                  </h-row>
                  <h-row>
                    <h-col span="9" class="label">{{$t('m.i.shcpe.isCenterBrch')}}:</h-col>
                    <h-col span="15" class="val">{{viewDatailForm.isCenterBrch}}</h-col>
                  </h-row>
                </h-col>
              </h-row>

            </div>
          </div>
        </h-form>

      </h-tab-pane>
      <h-tab-pane label="账户信息" name="acctInfo">
        <h-form>
          <div class="text-wrap mb-10">
            <div class="text-body">
              <h-row :gutter="12">
                <h-col span="12">
                  <h-row>
                    <h-col span="9" class="label">{{$t('m.i.shcpe.transAcctStatus')}}:</h-col>
                    <h-col span="15" class="val">{{viewDatailForm.transAcctStatusName}}</h-col>
                  </h-row>
                  <h-row>
                    <h-col span="9" class="label">{{$t('m.i.common.transBrchBankNo')}}:</h-col>
                    <h-col span="15" class="val">{{viewDatailForm.transBrchBankNo}}</h-col>
                  </h-row>
                  <h-row>
                    <h-col span="9" class="label">{{$t('m.i.shcpe.ecdsAcctNo')}}:</h-col>
                    <h-col span="15" class="val">{{viewDatailForm.ecdsAcctNo}}</h-col>
                  </h-row>
                </h-col>

                <h-col span="12">
                  <h-row>
                    <h-col span="9" class="label">{{$t('m.i.shcpe.regAcctStatus')}}:</h-col>
                    <h-col span="15" class="val">{{viewDatailForm.regAcctStatusName}}</h-col>
                  </h-row>
                  <h-row>
                    <h-col span="9" class="label">{{$t('m.i.shcpe.eAgentBankNo')}}:</h-col>
                    <h-col span="15" class="val">{{viewDatailForm.eAgentBankNo}}</h-col>
                  </h-row>
                </h-col>
              </h-row>

            </div>
          </div>
        </h-form>
      </h-tab-pane>
      <h-tab-pane label="其他信息" name="otherInfo">
        <h-form>
          <div class="text-wrap mb-10">
            <div class="text-body">
              <h-row :gutter="12">
                <h-col span="12">
                  <h-row>
                    <h-col span="9" class="label">{{$t('m.i.shcpe.transCorpReg')}}:</h-col>
                    <h-col span="15" class="val">{{viewDatailForm.transCorpReg}}</h-col>
                  </h-row>
                  <h-row>
                    <h-col span="9" class="label">{{$t('m.i.common.address')}}:</h-col>
                    <h-col span="15" class="val">{{viewDatailForm.address}}</h-col>
                  </h-row>
                  <h-row>
                    <h-col span="9" class="label">{{$t("m.i.common.phone")}}:</h-col>
                    <h-col span="15" class="val">{{viewDatailForm.phone}}</h-col>
                  </h-row>
                  <h-row>
                    <h-col span="9" class="label">{{$t('m.i.common.postCode')}}:</h-col>
                    <h-col span="15" class="val">{{viewDatailForm.postCode}}</h-col>
                  </h-row>
                </h-col>

                <h-col span="12">
                  <h-row>
                    <h-col span="9" class="label">{{$t('m.i.shcpe.transRegistCapital')}}:</h-col>
                    <h-col span="15" class="val">{{viewDatailForm.transRegistCapital}}</h-col>
                  </h-row>
                  <h-row>
                    <h-col span="9" class="label">{{$t('m.i.shcpe.linkMan')}}:</h-col>
                    <h-col span="15" class="val">{{viewDatailForm.linkMan}}</h-col>
                  </h-row>
                  <h-row>
                    <h-col span="9" class="label">{{$t('m.i.common.fax')}}:</h-col>
                    <h-col span="15" class="val">{{viewDatailForm.custFax}}</h-col>
                  </h-row>
                  <h-row>
                    <h-col span="9" class="label">{{$t("m.i.common.remark")}}:</h-col>
                    <h-col span="15" class="val">{{viewDatailForm.cpesBrchRemark}}</h-col>
                  </h-row>
                </h-col>
              </h-row>

            </div>
          </div>

        </h-form>
      </h-tab-pane>
    </h-tabs>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "branchDetail",
    data() {
      return {
        viewDatailForm: {
          id: "",
          memberId: "",
          memberName: "",
          brchCode: "",
          brchNum: "",
          brchType: "",
          brchTypeName: "",
          transBrchClass: "",
          transBrchClassName: "",
          brchFullNameZh: "",
          brchFullNameEn: "",
          brchShortNameZh: "",
          brchShortNameEn: "",
          socCode: "",
          transProvinceCode: "",
          transProvince: "",
          transCorpClass: "",
          transCorpClassName: "",
          prodBeginDt: "",
          prodEndDt: "",
          brchStatus: "",
          brchStatusName: "",
          transAcctStatus: "",
          transAcctStatusName: "",
          regAcctStatus: "",
          regAcctStatusName: "",
          transCorpReg: "",
          transRegistCapital: "",
          address: "",
          linkMan: "",
          phone: "",
          custFax: "",
          postCode: "",
          transBrchBankNo: "",
          brchBankName: "",
          eAgentBankNo: "",
          ecdsAcctNo: "",
          cpesBrchRemark: "",
          operTm: "",
          brLv: "",
          operType: "",
          brchInternalAcctNo: "",
          brchInternalAcctName: "",
          memberTxAcctNo: "",
          memberRegAcctNo: "",
          cpesAcctNo: "",
          outAcctBankNo: "",
          outAcctNo: "",
          outAcctName: "",
          firstAdminId: "",
          firstAdminName: "",
          firstAdminStatus: "",
          secondAdminId: "",
          secondAdminName: "",
          secondAdminStatus: "",
          continueBrchCode: "",
          createTime: "",
          updateTime: "",
          custNo: "",
          reserve1: "",
          customerName: "",
          certifyType: "",
          certifyNo: "",
          isPlatform: "",
          continueBranchName: "",
          isCenterBrch: ""
        }
      };
    },

    props: {
      viewDatailWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      id: null
    },
    comments: {},
    watch: {
      viewDatailWin(val) {
        if (val == true) {
          let id = this.id;
          post({ id: id }, "/cpes/branch/queryBranchInfo").then(res => {
            if (res.data.retCode === "000000") {
              this.viewDatailForm = res.data.retData;
              this.viewDatailForm.transProvince = formatterProvinceCode(res.data.retData.transProvinceCode);
              this.viewDatailForm.brchTypeName = formatterBrchType(res.data.retData.brchType);
              this.viewDatailForm.transBrchClassName = formatterTransBrchClass(res.data.retData.transBrchClass);
              this.viewDatailForm.transCorpClassName = formatterTransCorpClass(res.data.retData.transCorpClass);
              this.viewDatailForm.brchStatusName = formatterStatus(res.data.retData.brchStatus);
              this.viewDatailForm.transAcctStatusName = formatterStatus(res.data.retData.transAcctStatus);
              //托管账户状态
              this.viewDatailForm.regAcctStatusName = formatterStatus(res.data.retData.regAcctStatus);
              this.viewDatailForm.isCenterBrch = formatterCenterBrchStatus(res.data.retData.isCenterBrch);
              this.viewDatailForm.certifyType = formatterCertType(res.data.retData.certifyType);
            }
            this.viewDatailWin = true;
          }).catch(error => {
            this.$hMessage.error({
              content: this.$t("m.i.common.netError") + error,
              duration: 5,
              closable: true
            });
          });
        }
      }
    },
    computed: {
      tempBranchDatailWin: {
        get() {
          return this.viewDatailWin;
        },
        set() {
        }
      }
    },
    methods: {
      handleClose() {
        this.$emit("branchDatailWinClose", "");
        this.$refs.tabs.activeKey = "branchInfo";
      }
    }
  };

  function formatterStatus(value) {
    if (value == null || value == "") {
      return "";
    }
    switch (value) {
      case"ST01":
        return "活动";
      case"ST02":
        return "禁用";
    }
  }

  function formatterCenterBrchStatus(value) {
    if (value == null || value == "") {
      return "";
    }
    switch (value) {
      case"1":
        return "是";
      case"0":
        return "否";
    }
  }

  function formatterTransCorpClass(value) {
    if (value == null || value == "") {
      return "";
    }
    switch (value) {
      case"CC00":
        return "法人（含虚拟资管参与者）";
      case"CC01":
        return "分支机构";
      case"CC02":
        return "非法人产品";
    }
  }

  function formatterTransBrchClass(value) {
    if (value == null || value == "") {
      return "";
    }
    switch (value) {
      case"101":
        return "中国人民银行";
      case"201":
        return "政策性银行";
      case"202":
        return "国有商业银行";
      case"203":
        return "股份制商业银行";
      case"204":
        return "外资银行";
      case"205":
        return "城市商业银行";
      case"206":
        return "农商行和农合行";
      case"207":
        return "村镇银行";
      case"208":
        return "农村信用社";
      case"209":
          return "民营银行";
      case"301":
        return "财务公司";
      case"302":
        return "信托投资公司";
      case"303":
        return "保险公司";
      case"304":
        return "证券公司";
      case"305":
        return "基金公司";
      case"306":
        return "金融资产管理公司";
      case"307":
        return "私募基金公司";
      case"308":
        return "汽车金融公司";
      case"309":
        return "保险公司的资产管理公司";
      case"310":
        return "证券公司的资产管理公司";
      case"311":
        return "基金公司的资产管理公司";
      case"401":
        return "商业银行理财产品";
      case"402":
        return "证券公司的资产管理产品";
      case"403":
        return "信托公司金融产品";
      case"404":
        return "保险公司的保险产品";
      case"405":
        return "保险资产管理公司的资管产品";
      case"406":
        return "基金";
      case"407":
        return "私募基金";
      case"408":
        return "基金公司的特定客户资产管理业务";
      case"409":
        return "社保基金";
      case"410":
        return "其他基金";
      case"411":
        return "其他非法人产品";
      case"412":
        return "证券资管公司的资管产品";
      case"413":
        return "基金资管公司的资管产品";
      case"501":
        return "商业银行资管";
      case"502":
        return "证券公司资管";
      case"503":
        return "基金公司资管";
      case"504":
        return "基金子公司资管";
      case"505":
        return "私募基金公司资管";
      case"506":
        return "信托资管";
      case"507":
        return "保险公司资管";
      case"508":
        return "保险资管公司资管";
      case"509":
        return "社保基金资管";
      case"510":
        return "其他资管";
      case"511":
        return "证券资管公司资管";
      case"601":
        return "社保基金理事会";
      case"602":
        return "公积金中心";
      case"603":
        return "小额贷款公司";
      case"604":
        return "融资租赁公司";
      case"605":
        return "其他非金融机构";
      case"701":
        return "国有商业银行存托产品";
      case"702":
        return "股份制商业银行存托产品";
      case"703":
        return "外资银行存托产品";
      case"704":
        return "城市商业银行存托产品";
      case"705":
        return "民营银行存托产品";
      case"706":
        return "农商行和农合行存托产品";
      case"707":
        return "其他农村金融机构存托产品";
      case"708":
        return "证券公司存托产品";
      case"709":
        return "其他存托产品";
      case"801":
        return "国有商业银行存托";
      case"802":
        return "股份制商业银行存托";
      case"803":
        return "外资银行存托";
      case"804":
        return "城市商业银行存托";
      case"805":
        return "民营银行存托";
      case"806":
        return "农商行和农合行存托";
      case"807":
        return "其他农村金融机构存托";
      case"808":
        return "证券公司存托";
      case"809":
        return "其他存托";
    }
  }

  function formatterProvinceCode(value) {
    if (value == null || value == "") {
      return "";
    }
    switch (value) {
      case "11":
        return "北京";
      case "12":
        return "天津";
      case "31":
        return "上海";
      case "50":
        return "重庆";
      case "13":
        return "河北";
      case "14":
        return "山西";
      case "21":
        return "辽宁";
      case "22":
        return "吉林";
      case "23":
        return "黑龙江";
      case "32":
        return "江苏";
      case "33":
        return "浙江";
      case "34":
        return "安徽";
      case "35":
        return "福建";
      case "36":
        return "江西";
      case "37":
        return "山东";
      case "41":
        return "河南";
      case "42":
        return "湖北";
      case "43":
        return "湖南";
      case "44":
        return "广东";
      case "46":
        return "海南";
      case "51":
        return "四川";
      case "52":
        return "贵州";
      case "53":
        return "云南";
      case "61":
        return "陕西";
      case "62":
        return "甘肃";
      case "63":
        return "青海";
      case "15":
        return "内蒙古";
      case "45":
        return "广西";
      case "54":
        return "西藏";
      case "64":
        return "宁夏";
      case "65":
        return "新疆";
      case "81":
        return "香港";
      case "82":
        return "澳门";
      case "71":
        return "台湾";
    }
  }

  function formatterBrchType(value) {
    if (value == null || value == "") {
      return "";
    }
    switch (value) {
      case"1":
        return "中央银行";
      case"2":
        return "银行业机构";
      case"3":
        return "非银行金融机构";
      case"4":
        return "非法人产品  ";
      case"5":
        return "虚拟资管参与者";
      case"6":
        return "非金融机构";
      case"7":
        return "存托类非法人产品";
      case"8":
        return "存托类虚拟系统参与者";
    }
  }

  function formatterCertType(value) {
    if (value == null || value == "") {
      return "";
    }
    switch (value) {
      case"1":
        return "组织机构代码";
      case"2":
        return "社会信用代码";
    }
  }
</script>

<style scoped>

</style>
