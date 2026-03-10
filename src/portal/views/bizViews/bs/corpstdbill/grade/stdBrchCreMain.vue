<!--同业信用评级-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--会员名称-->
                <common-input v-model="formItem.memberName" :label="$t('m.i.common.memberName')" prop="memberName"
                              :clearable="true"  @on-clear="clearMemberName('query')"  :maxlength="60"
                              :showIcon="true"  @on-click="queryMemberName('query')"  :readonly="true" ></common-input>
                <!--信用评级机构-->
                <common-input v-model="formItem.ratingBrchName" :label="$t('m.i.bs.creditRatingAgen')" prop="ratingBrchName"
                              :maxlength="60" ></common-input>

                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/bs/corpstdbill/grade/stdBrchCreMain/func_queryBrchCrePage"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="editBrchCre('add')">{{$t('m.i.ce.signAdd')}}</h-button>
              <h-button type="primary" @click="batchImport">{{$t("m.i.common.batchImport")}}</h-button>
              <h-button type="primary" @click="templateDownload">{{$t("m.i.common.templateDownload")}}</h-button>
              <h-button type="primary" @click="editBrchCre('modify')">{{$t('m.i.common.modify')}}</h-button>
              <h-button type="primary" @click="deleteBrchCre()">{{$t('m.i.common.delete')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--新增、修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" :mask-closable="false" @on-close="handleWinClose"
               class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span v-if="addOrEditType==='add'">新增</span>
        <span v-else-if="addOrEditType==='modify'">修改</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="2" class="h-form-search">

          <!--会员名称-->
          <common-input v-model="addForm.memberName" :label="$t('m.i.common.memberName')" prop="memberName"
                        :required="true"  :showIcon="addOrEditType==='add'" @on-click="queryMemberName('modify')"
                        :clearable="addOrEditType==='add'"  @on-clear="clearMemberName('modify')" :readonly="true" ></common-input>
          <!--会员代码-->
          <common-input v-model="addForm.memberId" :label="$t('m.i.common.memberId')" prop="memberId" :required="true"
                         :readonly="true" :validRules="memberIdRule" ></common-input>
          <!--会员类别-->
          <common-select v-model="addForm.memberTypeCode" :label="$t('m.i.shcpe.memberTypeCode')" prop="memberTypeCode"
                         :dictList="memberTypeCodeList" :required="true"  :readonly="true"></common-select>
          <!--信用评级-->
          <common-select v-model="addForm.creditRating"  :label="$t('m.i.bs.creditRating')" prop="creditRating"
                         :dictList="creditRatingList" :required="true" :readonly="(addOrEditType=='modify'&&isReditRating)"
                         @on-change="creditRatingChange" :itemValue="addForm.creditRating"></common-select>
          <!--评级日期-->
          <common-date-picker v-if="addForm.creditRating!=='0'" v-model="addForm.ratingDt" :label="$t('m.i.bs.ratingDt')"  prop="ratingDt"
                              :required="((addOrEditType==='modify'&&addForm.creditRating!=='0')||(addOrEditType==='add'&&addForm.creditRating!=='0'))"
                              :readonly="((addOrEditType==='modify'&&isReditRating)||(addOrEditType==='add'&&addForm.creditRating=='0')||(addOrEditType==='modify'&&addForm.creditRating=='0'))"
                               @on-change="handleDateChange"></common-date-picker>   <!--去掉:options="ratingDtOptions" -->
          <!--操作日期
          <common-date-picker v-model="addForm.operDt" :label="$t('m.i.bs.operDt')" prop="operDt"
                              :required="true" :readonly="true" @on-change="handleOperDtChange"></common-date-picker>-->
          <!--信用评级机构-->
          <common-input v-if="addForm.creditRating!=='0'" v-model="addForm.ratingBrchName" :label="$t('m.i.bs.creditRatingAgen')" prop="ratingBrchName"
                        :required="true" :maxlength="60"  ></common-input>
          <!--评级展望-->
          <common-select  v-if="addForm.creditRating!=='0'" v-model="addForm.ratingExpectation" :label="$t('m.i.bs.ratingExpectation')" prop="ratingExpectation"
                         :dictList="ratingExpectationTypeList" :required="true"  :readonly="(addOrEditType=='modify'&&isReditRating)"></common-select>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="handleWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
    <!--文件批量导入-->
    <common-file-upload :importWin="importWin" :fileParams="fileParams" @importWinClose="importWinClose"
                        @importSuccess="importSuccess"></common-file-upload>
    <!-- 查询会员代码 -->
    <member-id-search :memberIdWin="showCpesMemberWin" @memberIdWinClose="memberIdWinClose"
                      @memberIdWinSubmit="memberIdWinSubmit" :isShowType="false" :z-index="1200"></member-id-search>
  </div>
</template>

<script>
  import { on, off, post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "stdBrchCreMain",
    data() {
      let _this = this;
      return {
        ratingDtOptions: {
          disabledDate(date) {
            return _this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD") > date && date.valueOf();
          }
        },
        memberIdRule: [{test: /^[0-9a-zA-Z]{6}$/, trigger: "blur", message: "会员代码为6位"}],
        //ifShowMore : false,
        columns: [  //会员代码	会员名称	会员类别代码	信用评级	评级展望	信用评级机构	评定日期  录入日期
          {
            type: "radio",
            title: " ",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.common.memberId"),
            key: "memberId",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.memberName"),
            key: "memberName",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.shcpe.memberTypeCode"),
            key: "memberTypeCode",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "MemberType", params.row.memberTypeCode);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.bs.creditRating"),
            key: "creditRating",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CreditRating", params.row.creditRating);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.bs.ratingExpectation"),
            key: "ratingExpectation",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "RatingExpectationType", params.row.ratingExpectation);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.bs.creditRatingAgen"),
            key: "ratingBrchName",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.bs.ratingDt"),
            key: "ratingDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.ratingDt ? this.$moment(params.row.ratingDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t("m.i.bs.operDt"),
            key: "operDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.operDt ? this.$moment(params.row.operDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          }
        ],
        formItem: {
          memberName: "",
          ratingBrchName: "",
        },
        addForm: {
          id: "",
          memberId: "",
          memberName: "",
          memberTypeCode: "",
          creditRating: "",
          ratingExpectation: "",
          ratingBrchName: "",
          ratingDt: "",
          operDt: "",
        },
        currentSelectRow: null,
        dictMap: new Map(),

        creditRatingList: [],
        memberTypeCodeList: [],
        ratingExpectationTypeList: [],
        isReditRating: false,
        noReditRatingDt: "",

        // 是否显示新增或修改窗口
        addOrEditWin: false,
        addOrEditType: '',
        readonly: false,
        isRequired: true,
        ifShowMore: false,

        //会员弹出框
        showCpesMemberWin: false,
        cpesMemberWinType: "query",

        //导入
        importWin: false,
        fileParams: {
          //导入excel数据解析接口
          loadExcelUrl: window.LOCAL_CONFIG.API_HOME + "/bs/corpstdbill/grade/stdBrchCreMain/func_analysisExcelData",
          //excel数据导入接口
          fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/bs/corpstdbill/grade/stdBrchCreMain/func_saveExcelData",
          formItem: {},           //请求表格数据时附带参数
          uploadParams: {},       //调用excel数据解析接口时附带的额外参数
          extraGridDatas: {},     //需在反显数据中额外添加的字段
          columns: [  //会员代码	会员名称	会员类别代码	信用评级	评级展望	信用评级机构	评定日期
            {
              type: "index",
              title: this.$t("m.i.common.index"),
              width: 60,
              align: "center"
            },
            {
              title: this.$t("m.i.common.memberId"),
              key: "memberId",
              hiddenCol: false,
              ellipsis: false,
            },
            {
              title: this.$t("m.i.common.memberName"),
              key: "memberName",
              hiddenCol: false,
              ellipsis: false,
            },
            {
              title: this.$t("m.i.shcpe.memberTypeCode"),
              key: "memberTypeCode",
              hiddenCol: false,
              ellipsis: false,
              render: (h, params) => {
                let list = this.getDictValueFromMap(this.dictMap, "MemberType", params.row.memberTypeCode);
                return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
              }
            },
            {
              title: this.$t("m.i.bs.creditRating"),
              key: "creditRating",
              hiddenCol: false,
              ellipsis: false,
              render: (h, params) => {
                let list = this.getDictValueFromMap(this.dictMap, "CreditRating", params.row.creditRating);
                return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
              }
            },
            {
              title: this.$t("m.i.bs.ratingExpectation"),
              key: "ratingExpectation",
              hiddenCol: false,
              ellipsis: false,
              render: (h, params) => {
                let list = this.getDictValueFromMap(this.dictMap, "RatingExpectationType", params.row.ratingExpectation);
                return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
              }
            },
            {
              title: this.$t("m.i.bs.creditRatingAgen"),
              key: "ratingBrchName",
              hiddenCol: false,
              ellipsis: false,
            },
            {
              title: this.$t("m.i.bs.ratingDt"),
              key: "ratingDt",
              hiddenCol: false,
              render: (h, params) => {
                return h('span', params.row.ratingDt ? this.$moment(params.row.ratingDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
              }
            },
            {
              title: this.$t("m.i.bs.operDt"),
              key: "operDt",
              hiddenCol: false,
              render: (h, params) => {
                return h('span', params.row.operDt ? this.$moment(params.row.operDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
              }
            }
          ],
          paramKey: "list"         //后台接收对应key
        }
      }

    },
    components: {
      MemberIdSearch: () => import(/* webpackChunkName: "sm/auth/legalperson/memberIdSearch" */`@/views/bizViews/sm/auth/legalperson/memberIdSearch`)
    },
    methods: {
      formSearch() {
        this.currentSelectRow = null;
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();

        this.formItem.memberName = "";
        this.formItem.ratingBrchName = "";
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      //评级日期格式
      handleDateChange(value) {
        this.addForm.ratingDt = value.replace(/-/g, "");
      },
      //操作日期格式
      handleOperDtChange() {
        this.addForm.operDt = value.replace(/-/g, "");
      },
      //评级改变
      creditRatingChange(value) {
        //debugger
        if (value == '0' && this.addOrEditType == 'add') {  //如果新增时选择无评级
          this.addForm.operDt = window.sessionStorage.getItem("workDate");
        }
        if (value != '0' && this.addOrEditType == 'add') { //如果新增时选择有评级
          this.addForm.operDt = window.sessionStorage.getItem("workDate");
        }
        if (value == '0' && this.addOrEditType == 'modify') { //如果修改时选择无评级
        }
        if (value != '0' && this.addOrEditType == 'modify') { //如果修改时选择有评级
        }
        if (value == '') { //关闭框时
          this.addForm.operDt = "";
        }

      },
      //模板下载
      templateDownload() {
        let url = window.LOCAL_CONFIG.API_HOME + "/bs/corpstdbill/grade/stdBrchCreMain/func_downloadBrchCre";
        let form = document.createElement("form");
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "post");
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      },
      //批量导入
      batchImport() {
        this.importWin = true;
      },
      importWinClose() {
        this.importWin = false;
      },
      importSuccess() {
        this.importWin = false;
        this.$refs.datagrid.dataChange(1);
      },

      //新增、修改
      editBrchCre(str) {
        this.addOrEditType = str;
        if (this.addOrEditType == "modify") {
          if (this.currentSelectRow == null || this.currentSelectRow.length == 0) {
            this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
            this.addOrEditWin = false;
            return false;
          }

          if (this.currentSelectRow.creditRating != '0') {  //如果有评级
            this.isReditRating = true;
          }
          if (this.currentSelectRow.creditRating == '0') {  //如果没有评级
            //this.noReditRatingDt = this.currentSelectRow.ratingDt.toString(); 评级日期为空
            this.isReditRating = false;
          }
          this.addOrEditWin = true;
          this.addForm.id = this.currentSelectRow.id;
          this.addForm.memberId = this.currentSelectRow.memberId;
          this.addForm.memberName = this.currentSelectRow.memberName;
          this.addForm.memberTypeCode = this.currentSelectRow.memberTypeCode;
          this.addForm.creditRating = this.currentSelectRow.creditRating;
          this.addForm.ratingExpectation = this.currentSelectRow.ratingExpectation;
          this.addForm.ratingBrchName = this.currentSelectRow.ratingBrchName;
          this.addForm.ratingDt = this.currentSelectRow.ratingDt ? this.currentSelectRow.ratingDt.toString() : "";
          this.addForm.operDt = this.currentSelectRow.operDt ? this.currentSelectRow.operDt.toString() : "";
        } else if (this.addOrEditType == "add") {
          this.addOrEditWin = true;
          this.$nextTick(() => {
            this.addFormReset();
          });
        }
      },
      //删除
      deleteBrchCre() {
        if (this.currentSelectRow == null || this.currentSelectRow.length == 0) {
          this.$msgTip.info(this, {info: this.$t('m.i.common.chooseOneData')});
        } else {
          this.$hMsgBox.confirm({
            title: this.$t('m.i.common.confirm'),
            content: this.$t('m.i.common.isConfirmDelete') + '?',
            onOk: () => {
              this.handledel();
            }
          })
        }
      },
      //确认删除
      handledel() {
        let delId = this.currentSelectRow.id;
        post({id: delId}, 'bs/corpstdbill/grade/stdBrchCreMain/func_deleteBrchCreInfo').then(res => {
          if (res) {
            let retCode = res.data.retCode
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg})
            }
          } else {
            this.$msgTip.error(this, {info: this.$t('m.i.common.netError')})
          }
        });
      },
      addFormReset() {
        this.$refs.addForm.resetFields();
        this.addForm.id = '';
        this.addForm.memberId = '';
        this.addForm.memberName = '';
        this.addForm.memberTypeCode = '';
        this.addForm.creditRating = '';
        this.addForm.ratingExpectation = '';
        this.addForm.ratingBrchName = '';
        this.addForm.ratingDt = '';
        this.addForm.operDt = '';
      },
      //
      handleWinClose() {
        this.addFormReset();
        this.addOrEditWin = false;
      },
      //关闭会员框
      clearMemberName(optType) {
        if (optType === "modify") {
          this.addForm.memberId = "";
          this.addForm.memberName = "";
          this.addForm.memberTypeCode = "";
        }
      },
      //查询会员名称
      queryMemberName(optType) {
        //debugger
        this.cpesMemberWinType = optType;
        this.showCpesMemberWin = true;
      },
      //关闭会员窗口
      memberIdWinClose() {
        this.showCpesMemberWin = false;
      },
      //根据弹框所选数据进行赋值
      memberIdWinSubmit(info) {
        if (info === null) {
          this.$msgTip.info(this, {info: "请先选择记录!"});
          return;
        }
        if (this.cpesMemberWinType === "query") {
          this.formItem.memberName = info.memberName;
        } else {
          this.addForm.memberId = info.memberId;
          this.addForm.memberName = info.memberName;
          this.addForm.memberTypeCode = info.memberTypeCode;
        }
        this.showCpesMemberWin = false;
      },
      //保存
      submitForm() {
        this.addForm.ratingDt = this.addForm.ratingDt.replace(/-/g, "");
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            let url = this.addOrEditType === "add" ?
              "bs/corpstdbill/grade/stdBrchCreMain/func_addBrchCreInfo" :
              "bs/corpstdbill/grade/stdBrchCreMain/func_updateBrchCreInfo";
            post(this.addForm, url).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.addFormReset();
                  this.addOrEditWin = false;
                  this.currentSelectRow = [];
                } else {
                  this.$msgTip.error(this, {info: res.data.retMsg});
                }
              } else {
                this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
              }
            });
          }
        });
      },
    },
    mounted() {
      this.getDictListByGroups("CreditRating,MemberType,RatingExpectationType").then(res => {
        this.memberTypeCodeList = res.get("MemberType");
        this.creditRatingList = res.get("CreditRating");
        this.ratingExpectationTypeList = res.get("RatingExpectationType");
        this.dictMap = res.get("map");
      });
    }
  }
</script>

<style scoped>

</style>
