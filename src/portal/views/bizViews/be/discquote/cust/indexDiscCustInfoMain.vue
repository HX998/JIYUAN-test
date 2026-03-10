<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="discCustName" :label="$t('m.i.shcpe.trgtPtcptName')">
                  <h-input v-model="formItem.discCustName" placeholder="" :maxlength="50"></h-input>
                </h-form-item>
                <h-form-item prop="discSocCode" :label="$t('m.i.common.socCode')" class="h-form-long-label">
                  <h-input v-model="formItem.discSocCode" :maxlength=18></h-input>
                </h-form-item>
                <h-form-item prop="applStatus" :label="$t('m.i.common.status')">
                  <h-select v-model="formItem.applStatus" placeholder="">
                    <h-option v-for="item in applStatusList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      url="/be/discquote/cust/indexDiscCustInfoMain/func_queryDiscCustInfoMainPage"
                      :bindForm="formItem"
                      :row-select="true"
                      :has-select="false"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="singleAdd('add')">{{$t("m.i.ce.singleAdd")}}</h-button>
              <h-button type="primary" @click="singleAdd('modify')">{{$t("m.i.common.modify")}}</h-button>
              <h-button type="primary" @click="register">{{$t("m.i.common.register")}}</h-button>
              <h-button type="primary" @click="busiDelete">{{$t("m.i.common.delete")}}</h-button>
              <h-button type="primary" @click="registerRemove">{{$t("m.i.common.registerRemove")}}</h-button>
              <h-button type="primary" @click="returnTo">{{$t("m.i.common.returnTo")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!-- 贴现申请人信息登记界面 -->
    <h-msg-box v-model="addOrEditWin" width="800" @on-close="addOrEditWinClose" class="h-form-search-layer"
               :maximize="true" :mask-closable="false">
      <p slot="header">
        <span v-if="addOrEditType==='add'">新增贴现申请人信息</span>
        <span v-if="addOrEditType==='modify'">修改贴现申请人信息</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="1" class="h-form-search">
          <h-form-item prop="discCustName" :label="$t('m.i.shcpe.trgtPtcptName')" required>
            <h-input v-model="addOrEditForm.discCustName" :maxlength="50" placeholder=""></h-input>
          </h-form-item>
          <h-form-item prop="discSocCode" :label="$t('m.i.common.socCode')" required :validRules="sosCodeRule" class="h-form-long-label">
            <h-input v-model="addOrEditForm.discSocCode" placeholder="" :maxlength="18" :readonly="addOrEditType==='modify'"></h-input>
          </h-form-item>
          <h-form-item prop="discCorpScale" :label="$t('m.i.common.corpScale')" required>
            <h-select v-model="addOrEditForm.discCorpScale" placeholder="">
              <h-option v-for="item in corpScaleList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="discIndustry" :label="$t('m.i.common.industryCategory')" required>
            <h-select v-model="addOrEditForm.discIndustry" placeholder="">
              <h-option v-for="item in industryCategoryList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="area" :label="$t('m.i.common.area')" required>
            <h-select v-model="addOrEditForm.area" placeholder="">
              <h-option v-for="item in areaList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="isDiscArc" :label="$t('m.i.common.isArc')" required class="h-form-long-label">
            <h-select v-model="addOrEditForm.isDiscArc" placeholder="">
              <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="isDiscGreenCorp" :label="$t('m.i.common.isGreenCorp')" required class="h-form-long-label">
            <h-select v-model="addOrEditForm.isDiscGreenCorp" placeholder="">
              <h-option v-for="item in isList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="isDiscTechnologyCorp" :label="$t('m.i.common.isSciCorp')" required class="h-form-long-label">
            <h-select v-model="addOrEditForm.isDiscTechnologyCorp" placeholder="">
              <h-option v-for="item in isList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="isDiscPrivateCorp" :label="$t('m.i.common.isPrivateCorp')" required class="h-form-long-label">
            <h-select v-model="addOrEditForm.isDiscPrivateCorp" placeholder="">
              <h-option v-for="item in isList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <div slot="footer">
          <h-button type="ghost" @click="addOrEditWinClose">{{$t("m.i.common.close")}}</h-button>
          <h-button type="primary" @click="addOrEditWinSubmit()">{{$t("m.i.common.commit")}}</h-button>
        </div>
      </div>
    </h-msg-box>

    <show-file-win :showFileWin="showFileWin" :batchId="batchId" :operType="operType" @showFileWinClose="showFileWinClose"
                   sourceType="DCR" :filePathUrl="filePathUrl"></show-file-win>
  </div>
</template>

<script>
  import { post, getDictListByGroups, getDictValueFromMap} from "@/api/bizApi/commonUtil";

  export default {
    name: "indexDiscCustInfoMain",
    components: {
      ShowFileWin: () => import(/* webpackChunkName: "be/discquote/file/showFileWin" */`@/views/bizViews/be/discquote/file/showFileWin`),
    },
    data() {
      return {
        showFileWin: false,
        isList: [],
        areaList: [],
        industryCategoryList: [],
        corpScaleList: [],
        applStatusList:[],
        fileStatusList:[],
        propsVue: "indexDiscCustInfoMain",
        dictMap: new Map(),
        formItem: {
          discCustName: "",
          discSocCode: "",
          applStatus: ""
        },
        batchId:"",
        operType:"",
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
            title: this.$t("m.i.shcpe.trgtPtcptName"),
            key: "discCustName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.common.socCode"),
            key: "discSocCode",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.common.status"),
            key: "applStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "DCAplStatus", params.row.applStatus);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.attachment"),
            key: "attachment",
            hiddenCol: false,
            render: (h, params) => {
              return h("div", [
                h("a", {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.openFileWin(params.row.id, params.row.applStatus);
                    }
                  }
                }, "附件")
              ]);
            }
          },
          {
            title: this.$t("m.i.be.fileStatus"),
            key: "fileStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "DCFileStatus", params.row.fileStatus);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.corpScale"),
            key: "discCorpScale",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "CorpScale", params.row.discCorpScale);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.industryCategory"),
            key: "discIndustry",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Industry", params.row.discIndustry);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.area"),
            key: "area",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Province", params.row.area);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.isArc"),
            key: "isDiscArc",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.isDiscArc);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.isGreenCorp"),
            key: "isDiscGreenCorp",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.isDiscGreenCorp);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.isSciCorp"),
            key: "isDiscTechnologyCorp",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.isDiscTechnologyCorp);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.isPrivateCorp"),
            key: "isDiscPrivateCorp",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.isDiscPrivateCorp);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.discCustStatus"),
            key: "discCustStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "RelStatus", params.row.discCustStatus);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.dealPrcMsg"),
            key: "dealPrcMsg",
            hiddenCol: false
          }
        ],
        addOrEditType: "",
        addOrEditWin: false,
        addOrEditForm: {
          id: "",
          discCustName: "",
          discSocCode: "",
          discCorpScale: "",
          discIndustry: "",
          area: "",
          isDiscArc: "",
          isDiscGreenCorp: "",
          isDiscTechnologyCorp: "",
          isDiscPrivateCorp: ""
        },
        sosCodeRule: [{ test: this.validSosCode, trigger: "blur" }],
        filePathUrl: "/be/discquote/cust/indexDiscCustInfoMain/"
      };
    },
    mounted() {
      getDictListByGroups("CorpScale,Yon,Province,Industry,DCAplStatus,DCFileStatus,RelStatus").then(res => {
        this.corpScaleList = res.get("CorpScale");
        this.isList = res.get("Yon");
        this.areaList = res.get("Province");
        this.industryCategoryList = res.get("Industry");
        this.applStatusList = res.get("DCAplStatus");
        this.fileStatusList = res.get("DCFileStatus");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      validSosCode(rule, val, callback) {
        let re = /([a-zA-Z0-9]{2})([0-9]{6})([a-zA-Z0-9]{10})/;
        if (val === "" || val === null || val === undefined) {
          callback();
        }
        if (re.test(val)) {
          callback();
        } else {
          callback(new Error("非法输入，社会信用代码由两位数字或字母，加六位数字，加十位数字或字母组成，且为18位"));
        }
      },
      //表单查询
      handleSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
      },
      openFileWin(batchId, applStatus) {
        this.batchId = batchId;
        // 0 待登记
        if (applStatus == '0' || applStatus == '2') {
          this.operType = "upload";
        } else {
          this.operType = "show";
        }
        this.showFileWin = true;
      },
      showFileWinClose() {
        this.showFileWin = false;
        this.handleSearch();
      },
      //单笔新增、修改
      singleAdd(type) {
        this.addOrEditType = type;
        if (this.addOrEditType === "modify") {
          let list = this.$refs.datagrid.selects;
          if (list.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
            return;
          }
          if (list.length > 1) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
            return;
          }
          var status = list[0].applStatus;
          if (status !== '0' && status !== '2' && status !== '4') {
            this.$msgTip.error(this, {info: "该记录状态不符，不允许修改"});
          } else {
            let id = list[0].id;
            post({ id: id }, "/be/discquote/cust/indexDiscCustInfoMain/func_queryDiscCustInfoById").then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.addOrEditWin = true;
                  this.$nextTick(() => {
                    this.addOrEditForm.id = id;
                    this.addOrEditForm.discCustName = res.data.retData.discCustName;
                    this.addOrEditForm.discSocCode = res.data.retData.discSocCode;
                    this.addOrEditForm.discCorpScale = res.data.retData.discCorpScale;
                    this.addOrEditForm.discIndustry = res.data.retData.discIndustry;
                    this.addOrEditForm.area = res.data.retData.area;
                    this.addOrEditForm.isDiscArc = res.data.retData.isDiscArc;
                    this.addOrEditForm.isDiscGreenCorp = res.data.retData.isDiscGreenCorp;
                    this.addOrEditForm.isDiscTechnologyCorp = res.data.retData.isDiscTechnologyCorp;
                    this.addOrEditForm.isDiscPrivateCorp = res.data.retData.isDiscPrivateCorp;
                  });
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        } else if (this.addOrEditType === "add") {
          this.$nextTick(() => {
            this.addFormReset();
          });
          this.addOrEditWin = true;
        }
      },
      addFormReset() {
        this.addOrEditForm.id = "";
        this.$refs.addOrEditForm.resetFields();
      },
      //提交
      addOrEditWinSubmit() {
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            let url = this.addOrEditType === "add" ?
              "/be/discquote/cust/indexDiscCustInfoMain/func_addDiscCustInfo" :
              "/be/discquote/cust/indexDiscCustInfoMain/func_updateDiscCustInfo";
            let pageNo = this.addOrEditType === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
            post(this.addOrEditForm, url).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.addOrEditWin = false;
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.dataChange(pageNo);
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //关闭
      addOrEditWinClose() {
        this.addFormReset();
        this.addOrEditWin = false;
      },
      register() {
        let list = this.$refs.datagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let ids2 = [];
        for (var i = 0; i < list.length; i++) {
          let status = list[i].applStatus;
          if (status != '0') {
            ids2.push(list[i].discSocCode);
          }
        }
        if (ids2 != null && ids2.length != 0) {
          this.$msgTip.error(this, {info:"贴现申请人信息社会信用代码为[" + ids2 + "]的记录，状态不符，不允许登记"});
        } else {
          this.$hMsgBox.confirm({
            title: "贴现申请人信息登记",
            content: "确定要登记吗？",
            onOk: () => {
              this.handleRegister();
            }
          });
        }
      },
      handleRegister() {
        let list = this.$refs.datagrid.selects;
        let ids = "";
        for (let i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        post({ ids: ids }, "/be/discquote/cust/indexDiscCustInfoMain/func_submitDiscCustInfo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
            this.handleSearch();
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //删除
      busiDelete() {
        let list = this.$refs.datagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        var ids2 = [];
        for (var i = 0; i < list.length; i++) {
          var status = list[i].applStatus;
          var discCustStatus = list[i].discCustStatus;
          if (status !== '0' || discCustStatus !== null) {
            ids2.push(list[i].discSocCode);
          }
        }
        if (ids2 !== null && ids2.length !== 0) {
          this.$msgTip.error(this, {info:"贴现申请人信息社会信用代码为[" + ids2 + "]的记录，状态不符，不允许删除"});
        } else {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmDelete") + "?",
            onOk: () => {
              this.handleDel();
            }
          });
        }
      },
      handleDel() {
        let list = this.$refs.datagrid.selects;
        let ids = "";
        for (let i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        post({ ids: ids }, "/be/discquote/cust/indexDiscCustInfoMain/func_deleteDiscCustInfo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
            this.handleSearch();
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      registerRemove() {
        let list = this.$refs.datagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let ids2 = [];
        for (var i = 0; i < list.length; i++) {
          let status = list[i].applStatus;
          if (status != '2') {
            ids2.push(list[i].discSocCode);
          }
        }
        if (ids2 != null && ids2.length != 0) {
          this.$msgTip.error(this, {info:"贴现申请人信息社会信用代码为[" + ids2 + "]的记录，状态不符，不允许登记解除"});
        } else {
          this.$hMsgBox.confirm({
            title: "贴现申请人信息登记解除",
            content: "确定要登记解除吗？",
            onOk: () => {
              this.handleRegisterRemove();
            }
          });
        }
      },
      handleRegisterRemove() {
        let list = this.$refs.datagrid.selects;
        let ids = "";
        for (let i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        post({ ids: ids }, "/be/discquote/cust/indexDiscCustInfoMain/func_removeDiscCustInfo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
            this.handleSearch();
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      returnTo() {
        let list = this.$refs.datagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let ids2 = [];
        let ids3 = [];
        for (var i = 0; i < list.length; i++) {
          let status = list[i].applStatus;
          let discCustStatus = list[i].discCustStatus;
          if (status != '0') {
            ids2.push(list[i].id);
            ids3.push(list[i].discSocCode)
          }
          if(status == '0' && discCustStatus ==null ){
            ids2.push(list[i].id);
            ids3.push(list[i].discSocCode)
          }
        }
        if (ids2 != null && ids2.length != 0) {
          this.$msgTip.error(this, {info:"贴现申请人信息社会信用代码为[" + ids3 + "]的记录，状态不符，不允许提交恢复"});
        }else {
          this.$hMsgBox.confirm({
            title: "贴现申请人信息恢复",
            content: "确定要恢复吗？",
            onOk: () => {
              this.handleReturnTo();
            }
          });
        }
      },
      handleReturnTo() {
        let list = this.$refs.datagrid.selects;
        let ids = "";
        for (let i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        post({ ids: ids }, "/be/discquote/cust/indexDiscCustInfoMain/func_backDiscCustInfo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
            this.handleSearch();
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
