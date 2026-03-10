<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="prodNo" :label="$t('m.i.common.busiType')">
                  <h-select v-model="formItem.prodNo" placeholder="">
                    <h-option v-for="item in prodNoList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="billNoLike" :label="$t('m.i.billInfo.billNo')">
                  <h-input v-model="formItem.billNoLike" :maxlength="30" placeholder=""></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate two-form">
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlight-row
                      url="/pe/upbsInqrep/sendInquiry/func_pagingQuerySendQueryRecordList"
                      :bindForm="formItem"
                      :onCurrentChange="handleCurrentChange"
                      :onCurrentChangeCancel="handleCurrentChangeCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="add">{{$t("m.i.common.add")}}</h-button>
              <h-button type="primary" @click="edit">{{$t("m.i.common.modify")}}</h-button>
              <h-button type="primary" @click="deleteConfirm">{{$t("m.i.common.delete")}}</h-button>
              <h-button type="primary" @click="batchImport">{{$t("m.i.common.batchImport")}}</h-button>
              <h-button type="primary" @click="sendQuery">{{$t("m.i.pe.sendQuery")}}</h-button>
              <h-button type="primary" @click="templateDownload">{{$t("m.i.pe.templateDownload")}}</h-button>
            </div>
          </h-datagrid>
        </div>

        <!-- 点击新增弹出窗 -->
        <h-msg-box v-model="addWin" width="800" @on-close="addWinClose" class="h-form-search-layer" :maximize="true"
                   :mask-closable="false">
          <p slot="header">
            <span>新增</span>
          </p>
          <div>
            <h-form :model="addForm" :label-width="130" ref="addForm" cols="2" class="h-form-search">
              <h-form-item prop="custName" :label="$t('m.i.common.custName')" required>
                <h-input v-model="addForm.custName" placeholder="" icon="android-search"
                         @on-click="queryCustName('add')" readonly></h-input>
              </h-form-item>
              <h-form-item prop="billNo" :label="$t('m.i.billInfo.billNo')" required :validRules="billNoRule">
                <h-input v-model="addForm.billNo" placeholder="" icon="android-search" @on-click="queryBillNo('add')"
                         :maxlength="30"></h-input>
              </h-form-item>
              <h-form-item prop="billType" :label="$t('m.i.billInfo.billType')" required>
                <h-select v-model="addForm.billType" placeholder="">
                  <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item prop="remitDt" :label="$t('m.i.billInfo.remitDt')" required>
                <h-date-picker type="date" v-model="addForm.remitDt" placeholder=""
                               @on-change="handleRemitDtChange"></h-date-picker>
              </h-form-item>
              <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')" required>
                <h-date-picker type="date" v-model="addForm.dueDt" placeholder=""
                               @on-change="handleDueDtChange"></h-date-picker>
              </h-form-item>
              <h-form-item prop="billMoney" :label="$t('m.i.billInfo.billMoney')" required :validRules="billMoneyRule">
                <h-typefield v-model="addForm.billMoney" type="money" bigTips placeholder=""></h-typefield>
              </h-form-item>
              <h-form-item prop="drweBankName" :label="$t('m.i.billInfo.drweBankName')" required class="h-form-long-label">
                <h-input v-model="addForm.drweBankName" placeholder="" :maxlength="80"></h-input>
              </h-form-item>

              <h-form-item prop="drweBankNo" :label="$t('m.i.billInfo.drweBankNo')" required class="h-form-long-label"
                           :validRules="drweBankNoRule">
                <h-input v-model="addForm.drweBankNo" :maxlength="12" placeholder=""></h-input>
              </h-form-item>
              <h-form-item prop="drwrName" :label="$t('m.i.billInfo.drwrName')" required>
                <h-input v-model="addForm.drwrName" placeholder="" :maxlength="80"></h-input>
              </h-form-item>
              <h-form-item prop="pyeeName" :label="$t('m.i.billInfo.pyeeName')" required>
                <h-input v-model="addForm.pyeeName" placeholder="" :maxlength="80"></h-input>
              </h-form-item>
            </h-form>
          </div>
          <div slot="footer">
            <div slot="footer">
              <h-button type="ghost" @click="addWinClose">{{$t("m.i.common.close")}}</h-button>
              <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
              <h-button type="primary" v-else @click="addFormSubmit()">{{$t("m.i.common.commit")}}</h-button>
            </div>
          </div>
        </h-msg-box>

        <!-- 点击修改弹出窗 -->
        <h-msg-box v-model="editWin" width="800" @on-close="editWinClose" class="h-form-search-layer" :maximize="true"
                   :mask-closable="false">
          <p slot="header">
            <span>修改</span>
          </p>
          <div>
            <h-form :model="editForm" :label-width="115" ref="editForm" cols="2" class="h-form-search">
              <h-form-item prop="custName" :label="$t('m.i.common.custName')" required>
                <h-input v-model="editForm.custName" placeholder="" icon="android-search"
                         @on-click="queryCustName('edit')" readonly></h-input>
              </h-form-item>
              <h-form-item prop="billNo" :label="$t('m.i.billInfo.billNo')" required :validRules="billNoRule">
                <h-input v-model="editForm.billNo" placeholder="" icon="android-search" @on-click="queryBillNo('edit')"
                         :maxlength="30"></h-input>
              </h-form-item>
              <h-form-item prop="billType" :label="$t('m.i.billInfo.billType')" required>
                <h-select v-model="editForm.billType" placeholder="">
                  <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item prop="remitDt" :label="$t('m.i.billInfo.remitDt')" required>
                <h-date-picker type="date" v-model="editForm.remitDt" placeholder=""
                               @on-change="handleEditRemitDtChange"></h-date-picker>
              </h-form-item>
              <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')" required>
                <h-date-picker type="date" v-model="editForm.dueDt" placeholder=""
                               @on-change="handleEditDueDtChange"></h-date-picker>
              </h-form-item>
              <h-form-item prop="billMoney" :label="$t('m.i.billInfo.billMoney')" required :validRules="billMoneyRule">
                <h-typefield v-model="editForm.billMoney" type="money" bigTips placeholder=""></h-typefield>
              </h-form-item>
              <h-form-item prop="drweBankName" :label="$t('m.i.billInfo.drweBankName')" class="h-form-long-label" required>
                <h-input v-model="editForm.drweBankName" placeholder="" :maxlength="80"></h-input>
              </h-form-item>
              <h-form-item prop="drweBankNo" :label="$t('m.i.billInfo.drweBankNo')" class="h-form-long-label" required
                           :validRules="drweBankNoRule">
                <h-input v-model="editForm.drweBankNo" placeholder="" :maxlength="12"></h-input>
              </h-form-item>
              <h-form-item prop="drwrName" :label="$t('m.i.billInfo.drwrName')" required>
                <h-input v-model="editForm.drwrName" placeholder="" :maxlength="80"></h-input>
              </h-form-item>
              <h-form-item prop="pyeeName" :label="$t('m.i.billInfo.pyeeName')" required>
                <h-input v-model="editForm.pyeeName" placeholder="" :maxlength="80"></h-input>
              </h-form-item>
            </h-form>
          </div>
          <div slot="footer">
            <div slot="footer">
              <h-button type="ghost" @click="editWinClose">{{$t("m.i.common.close")}}</h-button>
              <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
              <h-button type="primary" v-else @click="editFormSubmit()">{{$t("m.i.common.commit")}}</h-button>
            </div>
          </div>
        </h-msg-box>

        <!-- 发出查询弹出框 -->
        <h-msg-box v-model="sendQueryWin" width="800" @on-close="sendQueryWinClose" class="h-form-search-layer"
                   :maximize="true" :mask-closable="false">
          <p slot="header">
            <span>发出查询</span>
          </p>
          <div>
            <h-form :model="sendQueryForm" :label-width="115" ref="sendQueryForm" cols="2" class="h-form-search">
              <h-form-item prop="custName" :label="$t('m.i.common.custName')" required>
                <h-input v-model="sendQueryForm.custName" placeholder="" readonly></h-input>
              </h-form-item>
              <h-form-item prop="queryType" :label="$t('m.i.pc.queryType')" required>
                <h-select v-model="sendQueryForm.queryType" placeholder="">
                  <h-option v-for="item in UpbsQueryTypeList" :value="item.key" :key="item.key">{{item.value }}
                  </h-option>
                </h-select>
              </h-form-item>
              <h-form-item prop="payToBankNo" :label="$t('m.i.pe.receiveBankNo')" required :validRules="drweBankNoRule">
                <h-input v-model="sendQueryForm.payToBankNo" placeholder="" :maxlength="12"></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.pe.isGetPay')" required>
                <h-input v-model="this.temp" placeholder="" readonly></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.pe.dealType')">
                <h-input v-model="this.temp1" placeholder="" readonly></h-input>
              </h-form-item>
              <h-form-item prop="queryContent" :label="$t('m.i.pe.noticeContent')" required>
                <h-input v-model="sendQueryForm.queryContent" type="textarea" placeholder="" :canResize="false"
                         :maxlength="600"></h-input>
              </h-form-item>
            </h-form>
          </div>
          <div slot="footer">
            <div slot="footer">
              <h-button type="ghost" @click="sendQueryWinClose">{{$t("m.i.common.close")}}</h-button>
              <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
              <h-button type="primary" v-else @click="sendQueryFormSubmit()">{{$t("m.i.common.commit")}}</h-button>
            </div>
          </div>
        </h-msg-box>

        <!-- 查询票号弹窗 -->
        <h-msg-box v-model="billSelectWin" width="1000" @on-close="billSelectWinClose" class="h-form-table-layer"
                   :maximize="true" :mask-closable="false" :z-index=1200>
          <p slot="header">
            <span>选择票据窗口</span>
          </p>
          <div :class="{'h-form-overhd':!ifShowMore}">
            <h-form :model="billSelectForm" :label-width="100" ref="billSelectForm" cols="4" class="h-form-search">
              <h-form-item :label="$t('m.i.billInfo.billNo')" prop="likeBillNo">
                <h-input v-model="billSelectForm.likeBillNo" placeholder="" :maxlength="16"></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.billInfo.drwrName')" prop="drwrNameLike">
                <h-input v-model="billSelectForm.drwrNameLike" placeholder=""></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.billInfo.pyeeName')" prop="pyeeNameLike">
                <h-input v-model="billSelectForm.pyeeNameLike" placeholder=""></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.billInfo.acptName')" prop="acptNameLike">
                <h-input v-model="billSelectForm.acptNameLike" placeholder=""></h-input>
              </h-form-item>
              <common-date-picker v-model="remitDt" :label="$t('m.i.billInfo.remitDt')" prop="remitDt" type="daterange" :rangeValue="['minRemitDt','maxRemitDt']"
                                  :minRemitDt.sync="billSelectForm.minRemitDt" :maxRemitDt.sync="billSelectForm.maxRemitDt">
              </common-date-picker>
              <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="dueDt">
                <h-date-picker :value="dueDt" type="daterange" showFormat :editable=false
                               @on-change="handleBillNoDueDtChange" placeholder=""></h-date-picker>
              </h-form-item>
              <h-form-item class="h-form-operate">
                <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                <h-button type="primary" @click="billSelectSearch()">{{$t("m.i.common.search")}}</h-button>
                <h-button type="ghost" @click="billSelectReset()">{{$t("m.i.common.reset")}}</h-button>
              </h-form-item>
            </h-form>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="billSelectColumns"
            :bindForm="billSelectForm"
            highlight-row
            :auto-load="false"
            :height="350"
            url="/pc/btrc/query/center/func_pagingQueryBillInfo"
            :onRowDbClick="doubleBillSelectHandleClick"
            :onCurrentChange="handlebillSelectChange"
            :onCurrentChangeCancel="handlebillSelectChangeCancel"
            ref="billSelectDatagrid">
          </h-datagrid>
          <div slot="footer">
            <div slot="footer">
              <h-button type="ghost" @click="billSelectWinClose">{{$t("m.i.common.close")}}</h-button>
              <h-button type="primary" @click="billSelectFormSubmit()">{{$t("m.i.common.commit")}}</h-button>
            </div>
          </div>
        </h-msg-box>

        <!-- 查询客户信息弹窗 -->
        <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                           @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
        <!-- 批量导入弹窗 -->
        <common-file-upload-no-show :import-win="this.batchImportWin" :fileParams="batchImportFileParams"
                                    @importWinClose="importWinClose"
                                    @importSuccess="importSuccess"></common-file-upload-no-show>
        <!-- 查看票面 -->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo"></bill-info-main>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import { post, on, off,formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "sendInquiry",
    data() {
      return {
        billId : "",
        billNo : "",
        showBillInfoWin : false,
        billNoRule: [{
          test: /^[0-9]{3}0[0-9]{2}[5-6]{1}[0-9]{9}$/,
          trigger: "blur",
          message: "纸票票号为16位数字,第四位为0,第七位银票为5、商票为6"
        }],
        drweBankNoRule: [{ test: /^[0-9]{12}$/, trigger: "blur", message: "请输入12位数字的行号" }],
        billMoneyRule: [{ test: this.validBillMoney, trigger: "blur" }],
        prodNoList: [],
        formItem: {
          prodNo: "",
          billNoLike: ""
        },
        addForm: {
          custName: "",
          custNo: "",
          billNo: "",
          billType: "",
          remitDt: "",
          dueDt: "",
          billMoney: "",
          drweBankName: "",
          drweBankNo: "",
          drwrName: "",
          pyeeName: ""
        },
        editForm: {
          id: "",
          custName: "",
          custNo: "",
          billNo: "",
          billType: "",
          remitDt: "",
          dueDt: "",
          billMoney: "",
          drweBankName: "",
          drweBankNo: "",
          drwrName: "",
          pyeeName: ""
        },
        sendQueryForm: {
          id: "",
          custName: "",
          queryType: "2",
          payToBankNo: "",
          queryContent: "是否你行签发？机打手写？有无挂失止冻公催他查？"
        },
        temp: "否",
        temp1: "票据",
        columns: [
          {
            title: " ",
            type: "radio",
            align: "center",
            width: 50,
            hiddenCol: false
          },
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.common.custName"),
            key: "custName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            sortable: true,
            render: (h, params) => {
                return h("a", {
                    on: {
                        click: () => {
                            this.showBillInfo(params.row.billId,params.row.billNo);
                        }
                    }
                }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.status'),
            key: "queryAnswerStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "UpbsQueryAnswerStatus", params.row.queryAnswerStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.remitDt == null || params.row.remitDt === "") {
                return "";
              }
              let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.dueDt == null || params.row.dueDt === "") {
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
           title: this.$t("m.i.billInfo.billMoney"),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.billMoney, 2, ",");
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t("m.i.billInfo.drweBankName"),
            key: "drweBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drweBankNo"),
            key: "drweBankNo",
            hiddenCol: false
          }
        ],
        currentSelectRow: [],
        addWin: false,
        editWin: false,
        sendQueryWin: false,
        showCustMessageWin: false,
        batchImportWin: false,
        batchImportFileParams: {
          fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/pe/upbsInqrep/sendInquiry/func_batchImport",  //excel数据导入接口
          uploadParams: {}       //调用excel数据解析接口时附带的额外参数
        },
        submitFlag: false,
        type: "",
        dictMap: new Map(),
        billTypeList: [],
        queryTypeList: [],
        yonList: [],
        queryAnswerStatusList: [],
        productSelectWin: false,
        UpbsQueryTypeList: [],
        currentBillSelectList: [],
        billSelectType: "",
        ifShowMore: false,
        billSelectWin: false,
        billSelectForm: {
          likeBillNo: "",
          drwrNameLike: "",
          pyeeNameLike: "",
          acptNameLike: "",
          minRemitDt: "",
          maxRemitDt: "",
          minDueDt: "",
          maxDueDt: "",
          billClass: "ME01",
          paymentFlag: "0",
          cancelFlag: "0"
        },
        remitDt: [],
        dueDt: [],
        billSelectColumns: [
          {
            title: " ",
            type: "radio",
            align: "center",
            width: 50,
            hiddenCol: false
          },
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
                return h("a", {
                    on: {
                        click: () => {
                            this.showBillInfo(params.row.billId,params.row.billNo);
                        }
                    }
                }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.remitDt == null || params.row.remitDt === "") {
                return "";
              }
              let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.dueDt == null || params.row.dueDt === "") {
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
           title: this.$t("m.i.billInfo.billMoney"),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.billMoney, 2, ",");
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t("m.i.pe.drweBankName"),
            key: "drweBankName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drweBankNo"),
            key: "drweBankNo",
            hiddenCol: false
          },
          {
            title:  this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
            sortable: true,
            hiddenCol: false
          }
        ]
      };
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,UpbsQueryAnswerStatus,UpbsQueryType,UpbsQueryBusiType").then(res => {
        this.UpbsQueryTypeList = res.get("UpbsQueryType");
        this.billTypeList = res.get("DraftTypeCode");
        this.prodNoList = res.get("UpbsQueryBusiType");
        this.dictMap = res.get("map");
      });
    },
    created() {
      let workDate = this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD").format("YYYY-MM-DD");
      this.remitDt = [workDate, workDate];
      this.billSelectForm.minRemitDt = window.sessionStorage.getItem("workDate");
      this.billSelectForm.maxRemitDt = window.sessionStorage.getItem("workDate");
    },
    methods: {
      validBillMoney(rule, val, callback) {
        let value = val.toString().replace(/,/g, "");
        let re = /^([1-9]\d{0,19}|0)([.]?|(\.\d{1,2})?)$/;
        if (re.test(value)) {
          if (value > 0) {
            callback();
          } else {
            callback(new Error("票面金额应大于0.00"));
          }
        } else {
          callback(new Error("金额为大于等于0的不超过20位的数字，且小数位不超过两位"));
        }
      },
      handleBillNoRemitDtChange(arr) {
        if(arr && arr.length == 2){
          this.billSelectForm.minRemitDt = arr[0].replace(/-/g, "");
          this.billSelectForm.maxRemitDt = arr[1].replace(/-/g, "");
          this.remitDt = [arr[0], arr[1]];
        } else {
          this.billSelectForm.minRemitDt = "";
          this.billSelectForm.maxRemitDt = "";
          this.remitDt = [];
        }
      },
      handleBillNoDueDtChange(arr) {
        if(arr && arr.length == 2){
          this.billSelectForm.minDueDt = arr[0].replace(/-/g, "");
          this.billSelectForm.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDt = [arr[0], arr[1]];
        } else {
          this.billSelectForm.minDueDt = "";
          this.billSelectForm.maxDueDt = "";
          this.dueDt = [];
        }
      },
      handleRemitDtChange(value) {
        this.addForm.remitDt = value.replace(/-/g, "");
      },
      handleDueDtChange(value) {
        this.addForm.dueDt = value.replace(/-/g, "");
      },
      handleEditRemitDtChange(value) {
        this.editForm.remitDt = value.replace(/-/g, "");
      },
      handleEditDueDtChange(value) {
        this.editForm.dueDt = value.replace(/-/g, "");
      },
      handleMinDueDtChange(value) {
        this.billSelectForm.minDueDt = value.replace(/-/g, "");
      },
      handleMaxDueDtChange(value) {
        this.billSelectForm.maxDueDt = value.replace(/-/g, "");
      },
      //表单查询
      handleSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.prodNo = "";
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
        showBillInfo(billId, billNo) {
            this.billId = billId;
            this.billNo = billNo;
            this.showBillInfoWin = true;
        },
        billInfoWinClose() {
            this.showBillInfoWin = false;
        },
      //查询客户信息
      //触发弹窗
      queryCustName(str) {
        this.type = str;
        this.showCustMessageWin = true;
      },
      //赋值
      custCorpSelectSubmit(info) {
        if (this.type === "add") {
          this.addForm.custName = info.custName;
          this.addForm.custNo = info.custNo;
        }
        if (this.type === "edit") {
          this.editForm.custName = info.custName;
          this.editForm.custNo = info.custNo;
        }
        this.showCustMessageWin = false;
      },
      //关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //新增
      add() {
        this.addWin = true;
      },
      //新增弹窗确认
      addFormSubmit() {
        this.addForm.remitDt = this.$moment(this.addForm.remitDt).format("YYYYMMDD");
        this.addForm.dueDt = this.$moment(this.addForm.dueDt).format("YYYYMMDD");
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            let url = "/pe/upbsInqrep/sendInquiry/func_addSendQueryRecord";
            this.submitFlag = true;
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.addWinClose();
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.currentSelectRow = [];
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //新增弹窗关闭
      addWinClose() {
        this.$refs.addForm.resetFields();
        this.$refs.addForm.custNo = "";
        this.addWin = false;
      },
      //票号弹窗打开
      queryBillNo(str) {
        this.billSelectType = str;
        this.billSelectWin = true;
        this.$nextTick(() => {
          this.billSelectSearch();
        });
      },
      //票号弹窗查询
      billSelectSearch() {
        this.$refs.billSelectDatagrid.dataChange(1);
      },
      //票号弹窗重置
      billSelectReset() {
        this.currentBillSelectList = [];
        this.dueDt = [];
        let workDate = this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD").format("YYYY-MM-DD");
        this.remitDt = [workDate, workDate];
        this.billSelectForm.minRemitDt = window.sessionStorage.getItem("workDate");
        this.billSelectForm.maxRemitDt = window.sessionStorage.getItem("workDate");
        this.billSelectForm.minDueDt = "";
        this.billSelectForm.maxDueDt = "";
        this.$refs.billSelectForm.resetFields();
      },
      handlebillSelectChange(currentRow) {
        this.currentBillSelectList = currentRow;
      },
      handlebillSelectChangeCancel() {
        this.currentBillSelectList = [];
      },
      //票号弹窗双击选中
      doubleBillSelectHandleClick(arr) {
        this.currentBillSelectList = arr;
        if (this.billSelectType === "add") {
          this.addForm.billNo = this.currentBillSelectList.billNo;
          this.addForm.billType = this.currentBillSelectList.billType;
          this.addForm.remitDt = this.currentBillSelectList.remitDt + "";
          this.addForm.dueDt = this.currentBillSelectList.dueDt + "";
          this.addForm.billMoney = this.currentBillSelectList.billMoney;
          this.addForm.drweBankName = this.currentBillSelectList.drweBankName;
          this.addForm.drweBankNo = this.currentBillSelectList.drweBankNo;
          this.addForm.drwrName = this.currentBillSelectList.drwrName;
          this.addForm.pyeeName = this.currentBillSelectList.pyeeName;
          this.billSelectWinClose();
        } else if (this.billSelectType === "edit") {
          this.editForm.billNo = this.currentBillSelectList.billNo;
          this.editForm.billType = this.currentBillSelectList.billType;
          this.editForm.remitDt = this.currentBillSelectList.remitDt + "";
          this.editForm.dueDt = this.currentBillSelectList.dueDt + "";
          this.editForm.billMoney = this.currentBillSelectList.billMoney;
          this.editForm.drweBankName = this.currentBillSelectList.drweBankName;
          this.editForm.drweBankNo = this.currentBillSelectList.drweBankNo;
          this.editForm.drwrName = this.currentBillSelectList.drwrName;
          this.editForm.pyeeName = this.currentBillSelectList.pyeeName;
          this.billSelectWinClose();
        }
      },
      //票号弹窗确定
      billSelectFormSubmit() {
        if (this.currentBillSelectList == null || this.currentBillSelectList.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        if (this.billSelectType === "add") {
          this.addForm.billNo = this.currentBillSelectList.billNo;
          this.addForm.billType = this.currentBillSelectList.billType;
          this.addForm.remitDt = this.currentBillSelectList.remitDt + "";
          this.addForm.dueDt = this.currentBillSelectList.dueDt + "";
          this.addForm.billMoney = this.currentBillSelectList.billMoney;
          this.addForm.drweBankName = this.currentBillSelectList.drweBankName;
          this.addForm.drweBankNo = this.currentBillSelectList.drweBankNo;
          this.addForm.drwrName = this.currentBillSelectList.drwrName;
          this.addForm.pyeeName = this.currentBillSelectList.pyeeName;
          this.billSelectWinClose();
        } else if (this.billSelectType === "edit") {
          this.editForm.billNo = this.currentBillSelectList.billNo;
          this.editForm.billType = this.currentBillSelectList.billType;
          this.editForm.remitDt = this.currentBillSelectList.remitDt + "";
          this.editForm.dueDt = this.currentBillSelectList.dueDt + "";
          this.editForm.billMoney = this.currentBillSelectList.billMoney;
          this.editForm.drweBankName = this.currentBillSelectList.drweBankName;
          this.editForm.drweBankNo = this.currentBillSelectList.drweBankNo;
          this.editForm.drwrName = this.currentBillSelectList.drwrName;
          this.editForm.pyeeName = this.currentBillSelectList.pyeeName;
          this.billSelectWinClose();
        }
      },
      //票号弹窗关闭
      billSelectWinClose() {
        this.billSelectWin = false;
        this.billSelectReset();
      },
      //修改
      edit() {
        if (this.currentSelectRow == null || this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let id = this.currentSelectRow.id;
        post({ id: id }, "/pe/upbsInqrep/sendInquiry/func_querySendQueryRecordById").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.editForm.id = res.data.retData.id;
              this.editForm.custName = res.data.retData.custName;
              this.editForm.billNo = res.data.retData.billNo;
              this.editForm.billType = res.data.retData.billType;
              this.editForm.remitDt = res.data.retData.remitDt + "";
              this.editForm.dueDt = res.data.retData.dueDt + "";
              this.editForm.billMoney = res.data.retData.billMoney;
              this.editForm.drweBankName = res.data.retData.drweBankName;
              this.editForm.drweBankNo = res.data.retData.drweBankNo;
              this.editForm.drwrName = res.data.retData.drwrName;
              this.editForm.pyeeName = res.data.retData.pyeeName;
              this.editWin = true;
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //修改弹窗确定
      editFormSubmit() {
        this.editForm.remitDt = this.$moment(this.editForm.remitDt).format("YYYYMMDD");
        this.editForm.dueDt = this.$moment(this.editForm.dueDt).format("YYYYMMDD");
        this.$refs["editForm"].validate(valid => {
          if (valid) {
            let url = "/pe/upbsInqrep/sendInquiry/func_updateSendQueryRecord";
            this.submitFlag = true;
            post(this.editForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.editWinClose();
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.currentSelectRow = [];
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //修改弹窗关闭
      editWinClose() {
        this.$refs.editForm.resetFields();
        this.$refs.editForm.id = "";
        this.$refs.editForm.custNo = "";
        this.editWin = false;
      },
      //删除
      deleteConfirm() {
        if (this.currentSelectRow == null || this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmDelete") + "?",
          onOk: () => {
            this.handleDel();
          }
        });
      },
      //删除确认
      handleDel() {
        let id = this.currentSelectRow.id;
        post({ ids: id }, "/pe/upbsInqrep/sendInquiry/func_delSendQueryRecord").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //批量导入
      batchImport() {
        this.batchImportWin = true;
      },
      importWinClose() {
        this.batchImportWin = false;
      },
      importSuccess() {
        this.batchImportWin = false;
        this.$refs.datagrid.dataChange(1);
      },
      //发出查询
      sendQuery() {
        if (this.currentSelectRow == null || this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let id = this.currentSelectRow.id;
        post({ id: id }, "/pe/upbsInqrep/sendInquiry/func_querySendQueryRecordById").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.sendQueryForm.id = res.data.retData.id;
              this.sendQueryForm.custName = res.data.retData.custName;
              this.sendQueryForm.payToBankNo = res.data.retData.acptBankNo;
              this.sendQueryWin = true;
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //发出查询弹窗确定
      sendQueryFormSubmit() {
        this.$refs["sendQueryForm"].validate(valid => {
          if (valid) {
            let url = "/pe/upbsInqrep/sendInquiry/func_sendQuery";
            this.submitFlag = true;
            post(this.sendQueryForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.sendQueryWinClose();
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.currentSelectRow = [];
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //发出查询弹窗关闭
      sendQueryWinClose() {
        this.$refs.sendQueryForm.resetFields();
        this.$refs.sendQueryForm.id = "";
        this.sendQueryWin = false;
      },
      //导入模板下载
      templateDownload() {
        let url = window.LOCAL_CONFIG.API_HOME + "/pe/upbsInqrep/sendInquiry/func_downloadSendQuery";
        let form = document.createElement("form");
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "post");
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      }
    }
  };
</script>

<style scoped>

</style>
