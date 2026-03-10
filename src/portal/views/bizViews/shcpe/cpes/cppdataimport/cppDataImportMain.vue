<template>
  <div>
    <table style="width: 100%">
      <tr>
        <h1>公共类基础数据</h1>
      </tr>
      <tr>
        <td class="h-import-td">
          <h-button type="primary" @click="memberDataImport('member')">{{$t("m.i.shcpe.memberData")}}</h-button>
          <h-button type="primary" @click="branchDataImport('branch')">{{$t("m.i.shcpe.branchData")}}</h-button>
          <h-button type="primary" @click="userDataImport('user')">{{$t("m.i.shcpe.userData")}}</h-button>
          <h-button type="primary" @click="hvpsBankDataImport('bank')">{{$t("m.i.shcpe.hvpsBankData")}}
          </h-button>
          <h-button type="primary" @click="baseDataImport('common')">{{$t("m.i.shcpe.baseData")}}</h-button>
          <h-button type="primary" @click="branchMergeImport('branchMerge')">{{$t("m.i.shcpe.branchMergeData")}}</h-button>
          <h-button type="primary" @click="holidayDataImport('holiday')">{{$t("m.i.shcpe.holidayData")}}</h-button>
        </td>
      </tr>
      <tr>
        <h1 style="padding-top: 20px;">再贴现基础数据</h1>
      </tr>
      <tr>
        <td class="h-import-td">
          <h-button type="primary" @click="ztxCreditDateImport('ztxCredit')">{{$t("m.i.shcpe.ztxCreditData")}}</h-button>
          <h-button type="primary" @click="ztxAcceptanceDateImport('ztxAcceptance')">
            {{$t("m.i.shcpe.ztxAcceptanceData")}}
          </h-button>
        </td>
      </tr>
      <tr>
        <h1 style="padding-top: 20px;">贴现通文件数据</h1>
      </tr>
      <tr>
        <td class="h-import-td">
          <h-button type="primary" @click="cppmDsctaplDataImport('cppmDsctapl')">{{$t("m.i.shcpe.cppmDsctapl")}}</h-button>
          <h-button type="primary" @click="cdrsEninfoDataImport('cdrsEninfo')">{{$t("m.i.shcpe.cdrsEninfo")}}</h-button>
          <h-button type="primary" @click="directSwitchImageDataImport('directSwitchImage')">{{$t("m.i.shcpe.directSwitchImage")}}</h-button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
  import { post } from "@/api/bizApi/commonUtil";

  export default {
    name: "cppDataImportMain",
    data() {
      return {
        type: ""
      };
    },
    components: {
    },
    mounted() {

    },
    methods: {
      memberDataImport(type) {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.shcpe.memberData"),
          content: this.$t("m.i.common.confirm") + "?",
          //content: "确定要导入会员数据吗"+ "?",
          onOk: () => {
            this.type = type;
            this.importData();
          }
        });
      },
      branchDataImport(type) {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.shcpe.branchData"),
          content: this.$t("m.i.common.confirm") + "?",
          //content: "确定要导入机构数据吗" + "?",
          onOk: () => {
            this.type = type;
            this.importData();
          }
        });
      },
      userDataImport(type) {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.shcpe.userData"),
          content: this.$t("m.i.common.confirm") + "?",
          //content: "确定要导入交易员数据吗"+ "?",
          onOk: () => {
            this.type = type;
            this.importData();
          }
        });
      },
      hvpsBankDataImport(type) {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.shcpe.hvpsBankData"),
          content: this.$t("m.i.common.confirm") + "?",
          //content: "确定要导入支付行号数据吗" + "?",
          onOk: () => {
            this.type = type;
            this.importData();
          }
        });
      },
      baseDataImport(type) {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.shcpe.baseData"),
          content: this.$t("m.i.common.confirm") + "?",
          //content: "确定要导入基础数据吗" + "?",
          onOk: () => {
            this.type = type;
            this.importData();
          }
        });
      },
      ztxCreditDateImport(type) {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.shcpe.ztxCreditData"),
          content: this.$t("m.i.common.confirm") + "?",
          //content: "确定要导入再贴现授信文件吗" + "?",
          onOk: () => {
            this.type = type;
            this.importData();
          }
        });
      },
      ztxAcceptanceDateImport(type) {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.shcpe.ztxAcceptanceData"),
          content: this.$t("m.i.common.confirm") + "?",
          //content: "确定要导入再贴现受理关系导入文件吗" + "?",
          onOk: () => {
            this.type = type;
            this.importData();
          }
        });
      },
      branchMergeImport(type) {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.shcpe.branchMergeData"),
          content: this.$t("m.i.common.confirm") + "?",
          //content: "确定要导入机构新原关系数据导入文件吗" + "?",
          onOk: () => {
            this.type = type;
            this.importData();
          }
        });
      },
      holidayDataImport(type) {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.shcpe.holidayData"),
          content: this.$t("m.i.common.confirm") + "?",
          //content: "确定要导入节假日数据导入文件吗" + "?",
          onOk: () => {
            this.type = type;
            this.importData();
          }
        });
      },
      cppmDsctaplDataImport(type){
        this.$hMsgBox.confirm({
          title: this.$t("m.i.shcpe.cppmDsctapl"),
          content: this.$t("m.i.common.confirm") + "?",
          onOk: () => {
            this.type = type;
            this.importData();
          }
        });
      },
      cdrsEninfoDataImport(type){
        this.$hMsgBox.confirm({
          title: this.$t("m.i.shcpe.cdrsEninfo"),
          content: this.$t("m.i.common.confirm") + "?",
          onOk: () => {
            this.type = type;
            this.importData();
          }
        });
      },
      directSwitchImageDataImport(type){
        this.$hMsgBox.confirm({
          title: this.$t("m.i.shcpe.directSwitchImage"),
          content: this.$t("m.i.common.confirm") + "?",
          onOk: () => {
            this.type = type;
            this.importData();
          }
        });
      },
      importData() {
        post({ code: this.type }, "/cpes/cppmdata/cppDataImportMain/func_importCppData").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.type = " ";
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this.$t("m.i.common.netError"));
          }
        });
      }
    }
  };
</script>

<style scoped>
  .h-import-td {
    padding: 20px 20px 10px 20px;
    border-top: 1px solid;
    border-bottom: 1px solid;
  }
  button {
    margin-bottom: 10px;
  }
</style>
