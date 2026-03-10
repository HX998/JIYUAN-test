<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="discApplicantName" label="贴现申请人名称" class="h-form-long-label">
                  <h-input v-model="formItem.discApplicantName" placeholder="" :maxlength="50"></h-input>
                </h-form-item>
                <h-form-item prop="discApplicantSocCode" :label="$t('m.i.common.socCode')" class="h-form-long-label">
                  <h-input v-model="formItem.discApplicantSocCode" :maxlength=18></h-input>
                </h-form-item>
                <h-form-item prop="signStatus" label="签约状态">
                  <h-select v-model="formItem.signStatus" placeholder="">
                    <h-option v-for="item in signStatusDictList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <common-date-picker v-model="signApplyDateArray" label="签约申请日期" type="daterange"
                                    :autoPlacement="true"
                                    @on-change="handleSignApplyDatePickerChange"></common-date-picker>
                <common-date-picker v-model="signDueDateArray" label="签约有效期至" type="daterange"
                                    :autoPlacement="true"
                                    @on-change="handleSignDueDatePickerChange"></common-date-picker>

                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlight-row
                      url="/be/discquote/onlineSign/func_pageOnlineSignApply"
                      :bindForm="formItem"
                      :on-current-change="handleRowClick"
                      :on-current-change-cancel="handleRowClickCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <!-- 受理   修改   作废   查看操作历史 -->
              <h-button type="primary" @click="showSignAudit"
                        :disabled="!currentSelectRow || currentSelectRow.signStatus !=='ST01'">受理
              </h-button>
              <h-button type="primary" @click="showSignUpdate"
                        :disabled="!currentSelectRow || currentSelectRow.signStatus !=='ST02'">修改
              </h-button>
              <h-button type="primary" @click="showSignVoided"
                        :disabled="!currentSelectRow || currentSelectRow.signStatus !=='ST02'">作废
              </h-button>
              <h-button type="primary" @click="showSignHistory" :disabled="!currentSelectRow">查看操作历史</h-button>

              <!--              <h-button type="primary" @click="registerRemove">{{$t("m.i.common.registerRemove")}}</h-button>-->
              <!--              <h-button type="primary" @click="returnTo">{{$t("m.i.common.returnTo")}}</h-button>-->
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <h-msg-box maximize v-model="isShowSignDetail" width="1000" @on-close="hideSignDetail">
      <p slot="header">
        <span>{{showDetailBoxTitle}}</span>
      </p>

      <div>
        <h-form :model="signDetailForm" :label-width="100" ref="signDetailForm" cols="3" class="h-form-search">
          <div>
            <!-- 客户基本信息 -->
            <h-field-panel collapse>
              <span slot="title">客户基本信息</span>

              <common-input v-model="signDetailForm.discCustName" label="贴现申请人名称"
                            prop="discCustName" className="h-form-long-label" readonly></common-input>

              <common-input v-model="signDetailForm.discOutSocCode" label="统一社会信用代码"
                            prop="discOutSocCode" className="h-form-long-label" readonly></common-input>

              <common-input v-model="signDetailForm.discBranchName" label="贴现机构名称"
                            prop="discBranchName" className="h-form-long-label" readonly></common-input>

              <common-input v-model="signDetailForm.discBranchCode" label="贴现机构代码"
                            prop="discBranchCode" className="h-form-long-label" readonly></common-input>

              <common-input v-model="signDetailForm.signApplyDate" label="签约申请日期"
                            prop="signApplyDate" className="h-form-long-label" readonly></common-input>

              <common-input v-model="signDetailForm.lccCode" label="中征码"
                            prop="lccCode" className="h-form-long-label" readonly></common-input>

              <common-select v-model="signDetailForm.area" label="地区"
                             prop="area" :dictList="provinceDictList" readonly></common-select>


              <common-input v-model="signDetailForm.address" label="住所"
                            prop="address" className="h-form-long-label" readonly></common-input>

              <common-select v-model="signDetailForm.corpCategory" label="企业类型"
                             prop="corpCategory" :dictList="discApplicantCorpTypeDictList" readonly></common-select>

              <common-select v-model="signDetailForm.corpNature" label="企业所有制形式"
                             prop="corpNature" :dictList="corpNatureDictList" readonly></common-select>

              <common-input v-model="signDetailForm.corpRegistCapital" label="注册资本（万元）"
                            prop="corpRegistCapital" className="h-form-long-label" readonly></common-input>

              <common-input v-model="signDetailForm.busiinc" label="营业收入（万元）"
                            prop="busiinc" className="h-form-long-label" readonly></common-input>

              <common-input v-model="signDetailForm.totalAssets" label="资产总额（万元）"
                            prop="totalAssets" className="h-form-long-label" readonly></common-input>

              <common-input v-model="signDetailForm.employees" label="从业人员（人）"
                            prop="employees" className="h-form-long-label" readonly></common-input>

              <common-select v-model="signDetailForm.discCorpScale" label="企业规模"
                             prop="discCorpScale" :dictList="corpScaleDictList" readonly></common-select>

              <common-select v-model="signDetailForm.discIndustry" label="行业分类"
                             prop="discIndustry" :dictList="industryDictList" readonly></common-select>

              <common-select v-model="signDetailForm.isDiscArc" label="是否涉农企业"
                             prop="isDiscArc" :dictList="yonDictList" readonly></common-select>

              <common-select v-model="signDetailForm.isDiscGreenCorp" label="是否绿色企业"
                             prop="isDiscGreenCorp" :dictList="yonDictList" readonly></common-select>

              <common-select v-model="signDetailForm.isDiscTechnologyCorp" label="是否科技企业"
                             prop="isDiscTechnologyCorp" :dictList="yonDictList" readonly></common-select>

              <common-select v-model="signDetailForm.isDiscPrivateCorp" label="是否民营企业"
                             prop="isDiscPrivateCorp" :dictList="yonDictList" readonly></common-select>

              <common-input v-model="signDetailForm.fctvDt" label="营业期限（自）"
                            prop="fctvDt" className="h-form-long-label" readonly></common-input>

              <common-input v-model="signDetailForm.xpryDt" label="营业期限（至）"
                            prop="xpryDt" className="h-form-long-label" readonly></common-input>

              <common-input v-model="signDetailForm.businessScope" label="经营范围"
                            prop="businessScope" className="h-form-long-label" readonly></common-input>

              <common-input v-model="signDetailForm.applRemark" label="备注"
                            prop="applRemark" className="h-form-long-label" readonly></common-input>
            </h-field-panel>
          </div>
          <br>
          <div>
            <!-- 授权经办人信息 -->
            <h-field-panel collapse>
              <span slot="title">授权经办人信息</span>

              <common-input v-model="signDetailForm.agentName" label="授权经办人姓名"
                            prop="agentName" className="h-form-long-label" readonly></common-input>

              <common-input v-model="signDetailForm.agentDocNo" label="授权经办人身份证号码"
                            prop="agentDocNo" className="h-form-long-label" readonly></common-input>

              <common-input v-model="signDetailForm.agentPhone" label="授权经办人联系电话"
                            prop="agentPhone" className="h-form-long-label" readonly></common-input>

              <common-input v-model="signDetailForm.agentEmail" label="授权经办人电子邮箱"
                            prop="agentEmail" className="h-form-long-label" readonly></common-input>

            </h-field-panel>
          </div>
          <br>
          <div>
            <!-- 法定代表人信息 -->
            <h-field-panel collapse>
              <span slot="title">法定代表人信息</span>

              <common-input v-model="signDetailForm.corpLegalName" label="法定代表人姓名"
                            prop="corpLegalName" className="h-form-long-label" readonly></common-input>

              <common-input v-model="signDetailForm.corpLegalNationality" label="法定代表人国籍"
                            prop="corpLegalNationality" className="h-form-long-label" readonly></common-input>

              <common-select v-model="signDetailForm.corpLegalCertifyType" label="法定代表人证件类型"
                             className="h-form-long-label" prop="corpLegalCertifyType" :dictList="certTypeDictList"
                             readonly></common-select>

              <common-input v-model="signDetailForm.corpLegalCertifyNo" label="法定代表人证件号码"
                            prop="corpLegalCertifyNo" className="h-form-long-label" readonly></common-input>

              <common-input v-model="signDetailForm.corpLegalDocDt" label="法定代表人证件签发日"
                            prop="corpLegalDocDt" className="h-form-long-label" readonly></common-input>

              <common-input v-model="signDetailForm.corpLegalDocDueDt" label="法定代表人证件到期日"
                            prop="corpLegalDocDueDt" className="h-form-long-label" readonly></common-input>

              <common-input v-model="signDetailForm.corpLegalIssuingCity" label="法定代表人证件签发城市"
                            prop="corpLegalIssuingCity" className="h-form-long-label" readonly></common-input>
            </h-field-panel>
          </div>

          <br>
          <div>
            <!-- 开票信息 -->
            <h-field-panel collapse>
              <span slot="title">开票信息</span>

              <common-select v-model="signDetailForm.needInv" label="是否需要开票" className="h-form-long-label"
                             prop="needInv" :dictList="yonDictList" readonly></common-select>

              <common-select v-model="signDetailForm.invType" label="开票种类" className="h-form-long-label"
                             prop="invType" :dictList="invTypeDictList" readonly></common-select>

              <common-select v-model="signDetailForm.taxerType" label="纳税人类型" className="h-form-long-label"
                             prop="taxerType" :dictList="taxerTypeDictList" readonly></common-select>


              <common-input v-model="signDetailForm.taxerName" label="纳税人名称"
                            prop="taxerName" className="h-form-long-label" readonly></common-input>

              <common-input v-model="signDetailForm.taxerCode" label="纳税人识别号"
                            prop="taxerCode" className="h-form-long-label" readonly></common-input>

              <common-input v-model="signDetailForm.taxerInvAddr" label="地址"
                            prop="taxerInvAddr" className="h-form-long-label" readonly></common-input>


              <common-input v-model="signDetailForm.taxerTel" label="电话"
                            prop="taxerTel" className="h-form-long-label" readonly></common-input>

              <common-input v-model="signDetailForm.taxerAcctBankName" label="开户银行名称"
                            prop="taxerAcctBankName" className="h-form-long-label" readonly></common-input>

              <common-input v-model="signDetailForm.taxerAcctNo" label="开户银行账号"
                            prop="taxerAcctNo" className="h-form-long-label" readonly></common-input>
            </h-field-panel>
          </div>

          <br>
          <div v-if="isShowSignAudit && signDetailForm.signStatus === 'ST01'">
            <h-field-panel collapse>
              <span slot="title">受理信息</span>
              <!-- 受理结果：1同意，2拒绝 -->
              <h-form-item label="受理结果" prop="auditResult" required>
                <h-select v-model="signDetailForm.auditResult">
                  <h-option v-for="item in auditOperResultDictList" :key="item.key" :value="item.key">{{item.value}}
                  </h-option>
                </h-select>
              </h-form-item>


              <h-form-item label="受理备注" v-if="signDetailForm.auditResult==='2'" prop="auditRemark"
                           :required="signDetailForm.auditResult==='2'">
                <h-input v-model="signDetailForm.auditRemark" :maxlength="256"></h-input>
              </h-form-item>


              <h-form-item v-if="signDetailForm.auditResult==='1'" label="签约有效期至" prop="signDueDate"
                           :required="signDetailForm.auditResult==='1'" className="h-form-long-label">
                <h-date-picker v-model="signDetailForm.signDueDate" :editable="false" type="date"
                               placeholder="选择日期" :options="noBeforeToday"></h-date-picker>
              </h-form-item>


              <h-form-item v-if="signDetailForm.auditResult==='1'" label="授信额度-元" prop="creditAmt"
                           :required="signDetailForm.auditResult==='1'" :validRules="moneyRule"
                           className="h-form-long-label">
                <h-typefield type="money" v-model="signDetailForm.creditAmt" :integerNum="16" bigTips
                             style="margin-bottom: 10px;"></h-typefield>
              </h-form-item>
            </h-field-panel>
          </div>

          <div v-if="isShowSignUpdate && signDetailForm.signStatus === 'ST02'">
            <h-field-panel collapse>
              <span slot="title">签约信息修改</span>
              <h-form-item label="签约有效期至" prop="signDueDate" required>
                <h-date-picker v-model="signDetailForm.signDueDate" :editable="false" type="date"
                               placeholder="选择日期" :options="noBeforeToday"></h-date-picker>
              </h-form-item>

              <h-form-item label="授信额度（元）" prop="creditAmt" required :validRules="moneyRule">
                <h-typefield v-model="signDetailForm.creditAmt" :integerNum="14" bigTip></h-typefield>
              </h-form-item>


            </h-field-panel>
          </div>

          <!-- 签约信息 -->
          <div v-else-if="signDetailForm.signStatus === 'ST02'">
            <h-field-panel collapse>
              <span slot="title">签约信息</span>

              <common-input v-model="signDetailForm.signDueDate" label="签约有效期至"
                            prop="signDueDate" className="h-form-long-label" readonly></common-input>


              <common-input v-model="signDetailForm.creditAmt" label="授信额度（元）"
                            prop="creditAmt" className="h-form-long-label" readonly></common-input>

              <common-input v-model="signDetailForm.creditBalance" label="剩余额度（元）"
                            prop="creditBalance" className="h-form-long-label" readonly></common-input>

              <common-input v-model="signDetailForm.usedAmt" label="已用额度（元）"
                            prop="usedAmt" className="h-form-long-label" readonly></common-input>
            </h-field-panel>
          </div>

        </h-form>
      </div>
      <div slot="footer">
        <div slot="footer" v-if="isShowSignAudit && signDetailForm.signStatus === 'ST01'">
          <h-button type="ghost" @click="hideSignDetail">取消</h-button>
          <h-button type="primary" @click="submitSignAudit">确定</h-button>
        </div>
        <div slot="footer" v-else-if="isShowSignUpdate && signDetailForm.signStatus === 'ST02'">
          <h-button type="ghost" @click="hideSignDetail">取消</h-button>
          <h-button type="primary" @click="submitSignUpdate">确定</h-button>
        </div>
        <div slot="footer" v-else>
          <h-button type="primary" @click="hideSignDetail">关闭</h-button>
        </div>
      </div>
    </h-msg-box>

    <!--股东信息-->
    <h-msg-box maximize v-model="isShowShareholder" width="1000" @on-close="hideSignDetail" class="h-form-table-layer">
      <p slot="header">
        <span>股东信息管理</span>
      </p>

      <div class="h-form-search-box">
        <!-- 查询表单 -->
        <h-panel class="clearfix">
          <h-form :model="shareholderForm" :label-width="90" ref="shareholderForm" cols="4" class="h-form-search">
            <h-form-item prop="custName" label="股东名称">
              <h-input v-model="shareholderForm.custName" placeholder="" :maxlength="20"></h-input>
            </h-form-item>

            <h-form-item class="h-form-operate">
              <h-button type="primary" @click="handleSearchShareholder()">{{$t("m.i.common.search")}}</h-button>
              <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
            </h-form-item>
          </h-form>
        </h-panel>
      </div>


      <div>
        <!-- 数据展示表格 -->
        <h-datagrid :columns="shareholderColumns"
                    highlight-row
                    url="/be/discquote/onlineSign/func_pageDiscCustShareholderInfo"
                    :bindForm="shareholderForm"
                    ref="shareholderGrid">
        </h-datagrid>
      </div>
      <div slot="footer">
        <!--        <div slot="footer">-->
        <!--          <h-button type="primary" @click="hideSignDetail">确定</h-button>-->
        <!--        </div>-->
      </div>


    </h-msg-box>

    <!--受益所有人信息-->
    <h-msg-box maximize v-model="isShowBeneficiary" width="1000" @on-close="hideSignDetail" class="h-form-table-layer">
      <p slot="header">
        <span>受益所有人信息管理</span>
      </p>

      <div class="h-form-search-box">
        <!-- 查询表单 -->
        <h-panel class="clearfix">
          <h-form :model="beneficiaryForm" :label-width="90" ref="beneficiaryForm" cols="4" class="h-form-search">
            <h-form-item prop="custName" label="姓名">
              <h-input v-model="beneficiaryForm.custName" placeholder="" :maxlength="20"></h-input>
            </h-form-item>

            <h-form-item class="h-form-operate">
              <h-button type="primary" @click="handleSearchBeneficiary()">{{$t("m.i.common.search")}}</h-button>
              <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
            </h-form-item>
          </h-form>
        </h-panel>
      </div>


      <div>
        <h-datagrid :columns="beneficiaryColumns"
                    highlight-row
                    url="/be/discquote/onlineSign/func_pageDiscCustBeneficiaryInfo"
                    :bindForm="beneficiaryForm"
                    ref="beneficiaryGrid">
        </h-datagrid>
      </div>

      <div slot="footer">
        <!--        <div slot="footer">-->
        <!--          <h-button type="primary" @click="hideSignDetail">确定</h-button>-->
        <!--        </div>-->
      </div>
    </h-msg-box>


    <!-- 查看操作历史 -->
    <h-msg-box maximize v-model="isShowSignHistory" width="1000" @on-close="hideSignDetail">
      <p slot="header">
        <span>查看操作历史</span>
      </p>
      <div>
        <!-- 数据展示表格 -->
        <h-datagrid :columns="historyColumns"
                    highlight-row
                    url="/be/discquote/onlineSign/func_pageOnlineSignOperHistory"
                    :bindForm="historyForm"
                    ref="historyGrid">
        </h-datagrid>
      </div>
      <div slot="footer">
        <!--        <div slot="footer">-->
        <!--          <h-button type="primary" @click="hideSignDetail">确定</h-button>-->
        <!--        </div>-->
      </div>
    </h-msg-box>


    <show-file-win :showFileWin="showFileWin" :fileBatchParams="fileBatchParams"
                   :dictMap="dictMap" @showFileWinClose="showFileWinClose"
                   :filePathUrl="filePathUrl"></show-file-win>
  </div>
</template>

<script>
  import {getDictListByGroups, getDictValueFromMap, post} from "@/api/bizApi/commonUtil";

  export default {
    name: "discOnlineSignApply",
    components: {
      showFileWin: () => import(/* webpackChunkName: "pc/img/showFileWin" */"@/views/bizViews/pc/img/showFileWin"),
    },
    data() {
      return {
        fileDetailStatusList: [],
        attTypeCodeList: [],
        fileBatchParams: {},

        signApplyDateArray: [],
        signDueDateArray: [],
        // DsctSignStatus 贴现通签约状态
        signStatusDictList: [
          {
            "id": 2022070601,
            "legalNo": "000000",
            "legalPersonName": null,
            "dictGroupCode": "DsctSignStatus",
            "key": "ST01",
            "likeKey": null,
            "value": "待审核",
            "description": "贴现通签约状态",
          },
          {
            "id": 2022070602,
            "legalNo": "000000",
            "legalPersonName": null,
            "dictGroupCode": "DsctSignStatus",
            "key": "ST02",
            "likeKey": null,
            "value": "已签约",
            "description": "贴现通签约状态",
          },
        ],
        // 被选中的行
        currentSelectRow: null,

        auditSignEndDate: null,

        // 签约详情
        showDetailBoxTitle: "",

        isShowSignDetail: false,

        isShowSignAudit: false,
        isShowSignUpdate: false,
        isShowSignHistory: false,


        // 股东信息
        isShowShareholder: false,
        // 受益人信息
        isShowBeneficiary: false,

        // 股东信息
        shareholderColumns: [
          {
            type: "index",
            width: 60,
            align: "center",
          },
          {
            title: "股东名称",
            key: "custName",
          },
          {
            title: "出资比例（%）",
            key: "assetsPercent",
          },
          {
            title: "证件类型",
            key: "certType",
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "CertType", params.row.certType);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "证件号码",
            key: "certNo",
            //width: 180,
          },
          {
            title: "证件登记日",
            key: "certRegDate",
          },
          {
            title: "证件到期日",
            key: "certDueDate",
          },
          {
            title: "证件签发城市",
            key: "certRegCity",
          },
        ],
        shareholderDataList: [],

        // 受益人信息
        beneficiaryColumns: [
          {
            type: "index",
            width: 60,
            align: "center",
          },
          {
            title: "姓名",
            key: "custName",
          },
          {
            title: "证件类型",
            key: "certType",
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "CertType", params.row.certType);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "证件号码",
            key: "certNo",
            //width: 160,
          },
          {
            title: "证件签发日",
            key: "certRegDate",
          },
          {
            title: "证件到期日",
            key: "certDueDate",
          },
          {
            title: "证件签发城市",
            key: "certRegCity",
          },
          {
            title: "联系电话",
            key: "phone",
            // width: 120,
          },
          {
            title: "邮箱",
            key: "email",
            // width: 150,
          },
        ],
        beneficiaryDataList: [],

        noBeforeToday: {
          disabledDate(date) {
            return date && date.valueOf() < Date.now() - 86400000;
          },
        },


        discApplicantCorpTypeDictList: [], // CorpCategory 线上贴现申请人企业类型
        corpNatureDictList: [], // 企业所有制 CpesCorpNature
        corpScaleDictList: [], // 企业规模
        industryDictList: [], // 行业分类 Industry
        yonDictList: [], // Yon 是否
        certTypeDictList: [],// 证件类型 CertType
        invTypeDictList: [], // 发票种类
        taxerTypeDictList: [], // 纳税人类型
        provinceDictList: [], // 省份
        auditOperResultDictList: [
          {
            createTime: null,
            description: "审批结果",
            dictGroupCode: "AuditOperResult",
            id: 995,
            key: "1",
            legalNo: "000000",
            legalPersonName: null,
            value: "同意",
          },
          {
            createTime: null,
            description: "审批结果",
            dictGroupCode: "AuditOperResult",
            id: 996,
            key: "2",
            legalNo: "000000",
            legalPersonName: null,
            value: "拒绝",
          }
        ], // 受理结果，1同意, 2	拒绝


        moneyRule: [{test: this.validMoney, trigger: "blur"}],

        // 详情
        signDetailForm: {
          id: null,
          auditResult: "",
          auditRemark: "",
          signDueDate: null,
          creditAmt: "",

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
          // corpCategory: "2100",
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

        showFileWin: false,
        isList: [],
        areaList: [],
        industryCategoryList: [],
        corpScaleList: [],
        applStatusList: [],
        fileStatusList: [],
        propsVue: "indexDiscCustInfoMain",
        dictMap: new Map(),
        formItem: {
          discApplicantName: "",
          discApplicantSocCode: "",
          signStatus: "",
          signApplyDateStart: "",
          signApplyDateEnd: "",
          signDueDateStart: "",
          signDueDateEnd: "",

          // discCustName: "",
          // discSocCode: "",
          // applStatus: ""
        },
        historyForm: {
          id: "",
        },
        shareholderForm: {
          id: "",
          custName: "",
        },
        beneficiaryForm: {
          id: "",
          custName: "",
        },
        columns: [
          {
            title: ' ',
            type: 'radio',
            align: 'center',
            width: 50
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
            title: "贴现申请人名称",
            key: "discCustName",
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
                      this.showSignDetail(params.row.signId, "签约详情");
                    }
                  }
                }, params.row.discCustName)
              ]);
            }
          },

          {
            title: "统一社会信用代码",
            key: "discOutSocCode",
            hiddenCol: false,
          },
          {
            title: "签约状态",
            key: "signStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "DsctSignStatus", params.row.signStatus);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "贴现机构名称",
            key: "discBranchName",
            hiddenCol: false,
          },
          {
            title: "贴现机构代码",
            key: "discBranchCode",
            hiddenCol: false,
          },
          {
            title: "附件",
            key: "file",
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
                      this.openFileWin(params.row.signId, params.row.applStatus);
                    }
                  }
                }, "查看")
              ]);
            }
          },
          {
            title: "签约申请日期",
            key: "signApplyDate",
            hiddenCol: false,
          },
          {
            title: "签约有效期至",
            key: "signDueDate",
            hiddenCol: false,
          },
          {
            title: "授信额度（元）",
            key: "creditAmt",
            hiddenCol: false,
          },
          {
            title: "地区",
            key: "area",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Province", params.row.area);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },

          {
            title: "企业规模",
            key: "discCorpScale",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "CorpScale", params.row.discCorpScale);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "行业分类",
            key: "discIndustry",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Industry", params.row.discIndustry);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "是否涉农企业",
            key: "isDiscArc",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.isDiscArc);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "是否绿色企业",
            key: "isDiscGreenCorp",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.isDiscGreenCorp);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "是否科技企业",
            key: "isDiscTechnologyCorp",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.isDiscTechnologyCorp);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "是否民营企业",
            key: "isDiscPrivateCorp",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.isDiscPrivateCorp);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "企业类型",
            key: "corpCategory",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "CorpCategory", params.row.corpCategory);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "企业所有制形式",
            key: "corpNature",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "CpesCorpNature", params.row.corpNature);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "注册资本（万元）",
            key: "corpRegistCapital",
            hiddenCol: false,
          },
          {
            title: "营业收入（万元）",
            key: "busiinc",
            hiddenCol: false,
          },
          {
            title: "资产总额（万元）",
            key: "totalAssets",
            hiddenCol: false,
          },
          {
            title: "从业人员（人）",
            key: "employees",
            hiddenCol: false,
          },
          {
            title: "经营范围",
            key: "businessScope",
            hiddenCol: false,
            width: 100,
          },
          {
            title: "营业期限（自）",
            key: "fctvDt",
            hiddenCol: false,
          },
          {
            title: "营业期限（至）",
            key: "xpryDt",
            hiddenCol: false,
          },
          {
            title: "备注",
            key: "applRemark",
            hiddenCol: false,
            width: 100,
          },
          {
            title: "法人姓名",
            key: "corpLegalName",
            hiddenCol: false,
          },

          {
            title: "法人证件类型",
            key: "corpLegalCertifyType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "CertType", params.row.corpLegalCertifyType);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "法人证件号码",
            key: "corpLegalCertifyNo",
            hiddenCol: false
          },
          {
            title: "是否需要开票",
            key: "needInv",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.needInv);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "股东信息",
            key: "gd",
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
                      this.showShareholder(params.row.custId);
                    }
                  }
                }, "查看")
              ]);
            }
          },
          {
            title: "受益所有人信息",
            key: "benefit",
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
                      this.showBeneficiary(params.row.custId);
                    }
                  }
                }, "查看")
              ]);
            }
          },
        ],
        historyColumns: [
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: "操作类型",
            key: "operType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "OnlineSignOperType", params.row.operType);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "操作柜员号",
            key: "operTellerNo",
            hiddenCol: false,
          },
          {
            title: "操作日期",
            key: "operDate",
            hiddenCol: false,
          },
          {
            title: "操作结果",
            key: "applyStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "OnlineSignApplyType", params.row.applyStatus);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "操作说明",
            key: "respRemark",
            hiddenCol: false,
          },

          {
            title: "贴现申请人名称",
            key: "discCustName",
            hiddenCol: false
          },

          {
            title: "统一社会信用代码",
            key: "discOutSocCode",
            hiddenCol: false,
          },
          {
            title: "签约状态",
            key: "signStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "DsctSignStatus", params.row.signStatus);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "贴现机构名称",
            key: "discBranchName",
            hiddenCol: false,
          },
          {
            title: "贴现机构代码",
            key: "discBranchCode",
            hiddenCol: false,
          },
          {
            title: "签约申请日期",
            key: "signApplyDate",
            hiddenCol: false,
          },
          {
            title: "签约有效期至",
            key: "signDueDate",
            hiddenCol: false,
          },
          {
            title: "授信额度（元）",
            key: "creditAmt",
            hiddenCol: false,
          },
          {
            title: "地区",
            key: "area",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Province", params.row.area);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },

          {
            title: "企业规模",
            key: "discCorpScale",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "CorpScale", params.row.discCorpScale);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "行业分类",
            key: "discIndustry",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Industry", params.row.discIndustry);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "是否涉农企业",
            key: "isDiscArc",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.isDiscArc);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "是否绿色企业",
            key: "isDiscGreenCorp",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.isDiscGreenCorp);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "是否科技企业",
            key: "isDiscTechnologyCorp",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.isDiscTechnologyCorp);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "是否民营企业",
            key: "isDiscPrivateCorp",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.isDiscPrivateCorp);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },

          {
            title: "备注",
            key: "applRemark",
            hiddenCol: false,
            width: 100,
          },
          {
            title: "法人姓名",
            key: "corpLegalName",
            hiddenCol: false,
          },

          {
            title: "法人证件类型",
            key: "corpLegalCertifyType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "CertType", params.row.corpLegalCertifyType);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "法人证件号码",
            key: "corpLegalCertifyNo",
            hiddenCol: false
          },
          {
            title: "是否需要开票",
            key: "needInv",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.needInv);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
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
        sosCodeRule: [{test: this.validSosCode, trigger: "blur"}],
        filePathUrl: "/be/discquote/disc/onlineSign/discOnlineSignApply/"
      };
    },
    mounted() {
      getDictListByGroups("DsctSignStatus,CorpCategory,CpesCorpNature,CorpScale,Industry,Yon,CertType,InvType,TaxpayerTp," +
        "Province,OnlineSignOperType,OnlineSignApplyType,PreRelationFlag," +
        "FileDetailStatus,AttTypeCode," +
        "DCAplStatus,DCFileStatus,RelStatus").then(res => {
        // 签约状态
        //  this.signStatusDictList = res.get('DsctSignStatus');
        this.discApplicantCorpTypeDictList = res.get('CorpCategory');
        this.corpNatureDictList = res.get('CpesCorpNature');
        this.corpScaleDictList = res.get('CorpScale');
        this.industryDictList = res.get('Industry');
        this.yonDictList = res.get('Yon');
        this.certTypeDictList = res.get('CertType');
        this.invTypeDictList = res.get('InvType');
        this.taxerTypeDictList = res.get('TaxpayerTp');
        this.provinceDictList = res.get('Province');
        this.fileDetailStatusList = res.get("FileDetailStatus");
        this.attTypeCodeList = res.get("AttTypeCode");


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
      validMoney(rule, val, callback) {
        let value = val.toString().replace(/,/g, "");
        let re = /^([1-9]\d{0,19}|0)([.]?|(\.\d{1,2})?)$/;
        //  console.log(4444,this.signDetailForm.auditResult)
        if (this.signDetailForm.auditResult === '2') {
          callback();
        }


        if (re.test(value)) {
          // 金额总长15位（含小数点）单位万元，最多12位整数,2位小数
          if (value > 0 && value <= 9999999999999999.99) {
            callback();
          } else {
            callback(new Error("金额应大于0.00且小于9999999999999999.99"));
          }
        } else {
          callback(new Error("金额必须大于等于0、整数最多16位小数位为2位"));
        }
      },
      // 行选中
      handleRowClick(arr) {
        console.log("行选中：", arr);
        // console.log("--------- arr");
        this.currentSelectRow = arr;
      },
      handleRowClickCancel() {
        this.currentSelectRow = null;
      },
      convertDate(date) {
        return date.replace(/-/g, "");
      },
      handleDatePickerChange(arr, name) {
        if (arr && arr.length >= 2) {
          if ('signApplyDate' === name) {
            this.formItem.signApplyDateStart = this.convertDate(arr[0]);
            this.formItem.signApplyDateEnd = this.convertDate(arr[1]);
            this.signApplyDateArray = [arr[0], arr[1]];
            return;
          }
          if ('signDueDate' === name) {
            this.formItem.signDueDateStart = this.convertDate(arr[0]);
            this.formItem.signDueDateEnd = this.convertDate(arr[1]);
            this.signDueDateArray = [arr[0], arr[1]];
            return;
          }
          return;
        }

        if ('signApplyDate' === name) {
          this.formItem.signApplyDateStart = "";
          this.formItem.signApplyDateEnd = "";
          this.signApplyDateArray = [];
          return;
        }
        if ('signDueDate' === name) {
          this.formItem.signDueDateStart = "";
          this.formItem.signDueDateEnd = "";
          this.signDueDateArray = [];
        }
      },
      handleSignApplyDatePickerChange(arr) {
        this.handleDatePickerChange(arr, 'signApplyDate');
      },
      handleSignDueDatePickerChange(arr) {
        this.handleDatePickerChange(arr, 'signDueDate');
      },
      showSignDetail(signId, title) {
        let dto = {
          id: signId
        };
        // console.log(this.currentSelectRow);
        let url = "/be/discquote/onlineSign/func_getOnlineSignDetail";
        post(dto, url).then(res => {
          if (res) {
            if (res.data.retCode === "000000") {
              if (res.data.retData !== null && res.data.retData !== undefined) {
                this.signDetailForm = res.data.retData;
                this.isShowSignDetail = true;
                this.showDetailBoxTitle = title;
              }
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },
      showSignHistory() {
        if (!this.currentSelectRow) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
          return;
        }
        let signId = this.currentSelectRow.signId;
        console.log(signId);


        this.isShowSignHistory = true;

        this.historyForm.id = signId;
        this.$refs.historyGrid.dataChange(1);


      },
      showSignVoided() {
        if (!this.currentSelectRow) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
          return;
        }
        if (this.currentSelectRow.signStatus !== 'ST02') {
          this.$msgTip.info(this, {info: "只能操作已签约的记录！"});
          return;
        }

        this.$hMsgBox.confirm({
          title: "签约作废",
          content: "确定作废吗吗?",
          onOk: () => {
            let signId = this.currentSelectRow.signId;
            console.log(signId);
            let url = "/be/discquote/onlineSign/func_onlineSignCancel";
            let dto = {};
            dto.id = signId;

            post(dto, url).then(res => {
              if (res) {
                if (res.data.retCode === "000000") {
                  this.$msgTip.info(this, {info: "操作成功"});
                  console.log("pageNo: ", this.$refs.datagrid.pageInfo.pageNo);
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
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
      showSignUpdate() {
        if (!this.currentSelectRow) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
          return;
        }

        if (this.currentSelectRow.signStatus !== 'ST02') {
          this.$msgTip.info(this, {info: "只能操作已签约的记录！"});
          return;
        }

        let signId = this.currentSelectRow.signId;
        console.log(signId);

        this.isShowSignUpdate = true;


        this.$nextTick(() => {
          this.$refs.signDetailForm.resetFields();
        });

        this.showSignDetail(signId, "签约修改");
      },
      showSignAudit() {
        if (!this.currentSelectRow) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
          return;
        }

        if (this.currentSelectRow.signStatus !== 'ST01') {
          this.$msgTip.info(this, {info: "只能操作待审核的记录！"});
          return;
        }


        let signId = this.currentSelectRow.signId;
        console.log(signId);

        this.isShowSignAudit = true;


        this.$nextTick(() => {
          this.$refs.signDetailForm.resetFields();
        });


        this.showSignDetail(signId, "签约受理");


      },
      hideSignDetail() {
        this.isShowSignDetail = false;
        this.isShowShareholder = false;
        this.isShowBeneficiary = false;
        this.isShowSignAudit = false;
        this.isShowSignUpdate = false;
        this.isShowSignHistory = false;

        this.$nextTick(() => {
          this.$refs.signDetailForm.resetFields();
        });

      },
      showShareholder(custId) {
        console.log(custId);
        this.isShowShareholder = true;
        this.shareholderForm.id = custId;
        this.$refs.shareholderGrid.dataChange(1);
      },
      showBeneficiary(custId) {
        console.log(custId);
        this.isShowBeneficiary = true;
        this.beneficiaryForm.id = custId;
        this.$refs.beneficiaryGrid.dataChange(1);
      },
      submitSignUpdate() {
        this.$refs['signDetailForm'].validate(valid => {
          console.log(valid);
          if (valid) {
            let dto = {};
            dto.id = this.signDetailForm.signId;
            dto.signDueDate = this.$moment(this.signDetailForm.signDueDate).format("YYYYMMDD");
            dto.creditAmt = this.signDetailForm.creditAmt;
            console.log(dto);
            let url = "/be/discquote/onlineSign/func_onlineSignUpdate";

            post(dto, url).then(res => {

              if (res) {
                if (res.data.retCode === "000000") {
                  this.$msgTip.info(this, {info: "操作成功"});
                  this.isShowSignUpdate = false;
                  this.isShowSignDetail = false;
                  this.signDetailForm = {};
                  this.$refs.datagrid.dataChange(1);
                  this.$nextTick(() => {
                    this.$refs.signDetailForm.resetFields();
                  });
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
      submitSignAudit() {
        let dto = {};

        dto.id = this.signDetailForm.signId;
        dto.auditResult = this.signDetailForm.auditResult;
        dto.auditRemark = this.signDetailForm.auditRemark;
        dto.signDueDate = this.$moment(this.signDetailForm.signDueDate).format("YYYYMMDD");
        dto.creditAmt = this.signDetailForm.creditAmt;
        console.log(dto);

        console.log(1111);
        this.$refs['signDetailForm'].validate(valid => {
          console.log(2222);
          console.log(valid);
          if (valid) {
            let url = "/be/discquote/onlineSign/func_handleOnlineSign";

            post(dto, url).then(res => {
              console.log('4');

              if (res) {
                if (res.data.retCode === "000000") {
                  this.$msgTip.info(this, {info: "操作成功"});
                  this.isShowSignAudit = false;
                  this.isShowSignDetail = false;
                  this.signDetailForm = {};
                  this.$refs.datagrid.dataChange(1);
                  this.$nextTick(() => {
                    this.$refs.signDetailForm.resetFields();
                  });
                } else {
                  this.$msgTip.error(this, {info: res.data.retMsg});
                }
              } else {
                this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
              }
            });
          } else {
            console.log(3333);
          }
        });

      },

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
        console.log(this.formItem);
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(1);
      },
      handleSearchShareholder() {
        console.log(this.formItem);
        this.$refs.shareholderGrid.selects = [];
        this.$refs.shareholderGrid.dataChange(1);
      },
      handleSearchBeneficiary() {
        console.log(this.formItem);
        this.$refs.beneficiaryGrid.selects = [];
        this.$refs.beneficiaryGrid.dataChange(1);
      },

      //重置表单查询结果
      resetSearch() {
        this.formItem.signApplyDateStart = "";
        this.formItem.signApplyDateEnd = "";
        this.formItem.signDueDateStart = "";
        this.formItem.signDueDateEnd = "";
        this.signApplyDateArray = [];
        this.signDueDateArray = [];
        this.$refs.formItem.resetFields();

        if (this.$refs.shareholderForm) {
          this.$refs.shareholderForm.resetFields();
        }

        if (this.$refs.beneficiaryForm) {
          this.$refs.beneficiaryForm.resetFields();
        }


      },
      openFileWin(batchId, applStatus) {
        this.fileBatchParams.busiId = batchId;
        this.fileBatchParams.attachBusiType = "DCS";
        this.fileBatchParams.attTypeCodeList = this.attTypeCodeList;
        this.fileBatchParams.fileDetailStatusList = this.fileDetailStatusList;
        this.showFileWin = true;
      },
      showFileWinClose() {
        this.showFileWin = false;
        this.handleSearch();
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
                  this.$msgTip.error(this, {info: res.data.retMsg});
                }
              } else {
                this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
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


    }
  };
</script>

<style scoped>

</style>
