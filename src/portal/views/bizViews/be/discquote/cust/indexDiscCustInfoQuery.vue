<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <div class="h-search-form-row" >
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
                    <h-button type="primary" @click="formSearch()">{{$t('m.i.common.search')}}</h-button>
                    <h-button type="ghost" @click="formSearchReset()">{{$t('m.i.common.reset')}}</h-button>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/be/discquote/cust/indexDiscCustInfoQuery/func_queryDiscCustQueryInfoPage"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class='pull-left'>
              <h-button type="primary" @click="apply()">{{$t("m.i.be.apply")}}</h-button>
              <h-button type="primary" @click="detail()">{{$t("m.i.common.viewDatail")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <h-msg-box title="贴现申请人信息在线查询申请"
               width="800"
               v-model="applyWin"
               :mask-closable="maskclosable"
               :maximize="maximize"
               @on-close="cancleWin">
      <!--表单主体-->
      <h-panel>
        <h-form :model="applyForm" :label-width="115" ref="applyForm" class="h-form-search">
          <div class="h-search-form-row">
            <h-form-item prop="discSocCode" :label="$t('m.i.common.socCode')" required :validRules="sosCodeRule"
                         >
              <h-input v-model="applyForm.discSocCode" placeholder="" :maxlength="18" :readonly="applyForm.id!=''"></h-input>
            </h-form-item>
          </div>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" style="margin:0 8px" @click="cancleWin()">{{$t("m.i.common.cancle")}}</h-button>
        <h-button type="primary" @click="submitForm()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
    <h-msg-box title="贴现申请人信息详情"
               width="800"
               v-model="detailWin"
               :mask-closable="maskclosable"
               :maximize="maximize">
      <!--表单主体-->
      <h-panel>
        <h-form :model="detailForm" :label-width="115" ref="detailForm" class="h-form-search">
          <div class="h-search-form-row">
            <h-form-item prop="discCustName" :label="$t('m.i.shcpe.trgtPtcptName')">
              <h-input v-model="detailForm.discCustName" :maxlength="50" placeholder="" readonly></h-input>
            </h-form-item>
            <h-form-item prop="discSocCode" :label="$t('m.i.common.socCode')" :validRules="sosCodeRule"
                          class="h-form-long-label">
              <h-input v-model="detailForm.discSocCode" placeholder="" :maxlength="18" readonly></h-input>
            </h-form-item>
            <h-form-item prop="discCorpScale" :label="$t('m.i.common.corpScale')">
              <h-select v-model="detailForm.discCorpScale" placeholder="" readonly>
                <h-option v-for="item in corpScaleList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
              </h-select>
            </h-form-item>
            <h-form-item prop="discIndustry" :label="$t('m.i.common.industryCategory')">
              <h-select v-model="detailForm.discIndustry" placeholder="" readonly>
                <h-option v-for="item in industryCategoryList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
              </h-select>
            </h-form-item>
            <h-form-item prop="area" :label="$t('m.i.common.area')">
              <h-select v-model="detailForm.area" placeholder="" readonly>
                <h-option v-for="item in areaList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
              </h-select>
            </h-form-item>
            <h-form-item prop="isDiscArc" :label="$t('m.i.common.isArc')" class="h-form-long-label">
              <h-select v-model="detailForm.isDiscArc" placeholder="" readonly>
                <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
              </h-select>
            </h-form-item>
            <h-form-item prop="isDiscGreenCorp" :label="$t('m.i.common.isGreenCorp')" class="h-form-long-label">
              <h-select v-model="detailForm.isDiscGreenCorp" placeholder="" readonly>
                <h-option v-for="item in isList" :value="item.key" :key="item.key">{{item.value }}</h-option>
              </h-select>
            </h-form-item>
            <h-form-item prop="isDiscTechnologyCorp" :label="$t('m.i.common.isSciCorp')" class="h-form-long-label">
              <h-select v-model="detailForm.isDiscTechnologyCorp" placeholder="" readonly>
                <h-option v-for="item in isList" :value="item.key" :key="item.key">{{item.value }}</h-option>
              </h-select>
            </h-form-item>
            <h-form-item prop="isDiscPrivateCorp" :label="$t('m.i.common.isPrivateCorp')" class="h-form-long-label">
              <h-select v-model="detailForm.isDiscPrivateCorp" placeholder="" readonly>
                <h-option v-for="item in isList" :value="item.key" :key="item.key">{{item.value }}</h-option>
              </h-select>
            </h-form-item>
            <h-form-item prop="discCustStatus" :label="$t('m.i.be.discCustStatus')" class="h-form-long-label">
              <h-select v-model="detailForm.discCustStatus" placeholder="" readonly>
                <h-option v-for="item in discCustStatusList" :value="item.key" :key="item.key">{{item.value }}</h-option>
              </h-select>
            </h-form-item>
          </div>
        </h-form>
      </h-panel>
      <div slot="footer"></div>
    </h-msg-box>

    <show-file-win :showFileWin="showFileWin" :batchId="batchId" operType="show" @showFileWinClose="showFileWinClose"
                   sourceType="DCQ" :filePathUrl="filePathUrl"></show-file-win>
  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap} from "@/api/bizApi/commonUtil";
  export default {
    name: "indexDiscCustInfoQuery",
    components: {
      ShowFileWin: () => import(/* webpackChunkName: "be/discquote/file/showFileWin" */`@/views/bizViews/be/discquote/file/showFileWin`)
    },
    data() {
      return {
        applStatusList: [],
        corpScaleList: [],
        isList: [],
        areaList: [],
        industryCategoryList: [],
        discCustStatusList: [],
        ifShowMore : false,
        dictMap : new Map(),
        applyWin:false,
        detailWin:false,
        showFileWin:false,
        batchId:"",
        maximize: true,//是否允许最大化
        maskclosable: false,//是否允许点击遮罩层关闭
        //用于申请的表单
        applyForm: {
          id: "",
          discSocCode: ""
        },
        detailForm: {
          discCustName: "",
          discSocCode: "",
          discCorpScale: "",
          discIndustry: "",
          area: "",
          isDiscArc: "",
          isDiscGreenCorp: "",
          isDiscTechnologyCorp: "",
          isDiscPrivateCorp: "",
          discCustStatus: ""
        },
        formItem : {
          discCustName:"",
          discSocCode:"",
          applStatus:""
        },

        columns : [
          {
            type: "radio",
            width: 50,
            align: "center",
            title: ' ',
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: 'index',
            align: 'center',
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
              let dictValue = getDictValueFromMap(this.dictMap, "DCQueryStatus", params.row.applStatus);
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
                      this.openFileWin(params.row.id);
                    }
                  }
                }, "附件")
              ]);
            }
          }
        ],
        sosCodeRule: [{ test: this.validSosCode, trigger: "blur" }],
        currentSelectRow : [],
        filePathUrl: "/be/discquote/cust/indexDiscCustInfoQuery/"
      }
    },
    methods:{
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
      apply(){
        if (this.currentSelectRow.length != 0) {
          this.applyForm.id = this.currentSelectRow.id;
          this.applyForm.discSocCode = this.currentSelectRow.discSocCode;
        }
        this.applyWin = true;
      },
      detail() {
        let list = this.currentSelectRow;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let id = list.id;
        post({ id: id }, "/be/discquote/cust/indexDiscCustInfoQuery/func_queryDiscCustQueryInfoById").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.detailWin = true;
              this.$nextTick(() => {
                this.detailForm.discCustName = res.data.retData.discCustName;
                this.detailForm.discSocCode = res.data.retData.discSocCode;
                this.detailForm.discCorpScale = res.data.retData.discCorpScale;
                this.detailForm.discIndustry = res.data.retData.discIndustry;
                this.detailForm.area = res.data.retData.area;
                this.detailForm.isDiscArc = res.data.retData.isDiscArc;
                this.detailForm.isDiscGreenCorp = res.data.retData.isDiscGreenCorp;
                this.detailForm.isDiscTechnologyCorp = res.data.retData.isDiscTechnologyCorp;
                this.detailForm.isDiscPrivateCorp = res.data.retData.isDiscPrivateCorp;
                this.detailForm.discCustStatus = res.data.retData.discCustStatus;
              });
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      submitForm() {
        this.$refs["applyForm"].validate(valid => {
          if (valid) {
            let url = "/be/discquote/cust/indexDiscCustInfoQuery/func_sendDiscCustQueryInfo";
            post(this.applyForm, url).then(res => {
              if (res) {
                if (res.data.retCode === "000000") {
                  this.$msgTip.success(this, { info: this.$t("m.i.common.commitSuccess") });
                  this.applyWin = false;
                  this.$refs.applyForm.resetFields();
                  this.$refs.datagrid.dataChange(1);
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.commitFailed") + res.data.retMsg });
                  this.$refs.datagrid.dataChange(1);
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      cancleWin() {
        this.applyForm.id = "";
        this.$refs.applyForm.resetFields();
        this.applyForm.discSocCode = "";
        this.applyWin = false;
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      formSearch() {
        this.currentSelectRow=[];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      openFileWin(batchId) {
        this.batchId = batchId;
        this.showFileWin = true;
      },
      showFileWinClose() {
        this.showFileWin = false;
      },
    },
    mounted() {
      this.getDictListByGroups("CorpScale,Yon,Province,Industry,DCQueryStatus,RelStatus").then(res => {
        this.applStatusList = res.get("DCQueryStatus");
        this.corpScaleList = res.get("CorpScale");
        this.isList = res.get("Yon");
        this.areaList = res.get("Province");
        this.industryCategoryList = res.get("Industry");
        this.discCustStatusList = res.get("RelStatus");
        this.dictMap = res.get("map");
      });
    }
  }
</script>

<style scoped>

</style>
