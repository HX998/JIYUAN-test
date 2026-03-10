<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.custNo')" prop="custNo">
                  <h-input v-model="formItem.custNo" :maxlength=50></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.custName')" prop="custName">
                  <h-input v-model="formItem.custName" :maxlength=60></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.activeFlag')" prop="activeFlag">
                  <h-select v-model="formItem.activeFlag" :clearable="false" :value="0" placeholder="">
                    <h-option v-for="item in isOffList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.socCode')" prop="socCode" class="h-form-long-label">
                  <h-input v-model="formItem.socCode" :maxlength=18></h-input>
                </h-form-item>
                <show-branch v-model="formItem.createBrchNo" :label="$t('m.i.common.createBrchName')"
                             prop="createBrchNo"
                             :showCheckBox="false" :filterable="isShareCustCropBranch" title="机构名称"
                             :brchNo.sync="formItem.createBrchNo" :brchName.sync="formItem.createBrchName">
                </show-branch>
                <h-form-item :label="$t('m.i.common.isGroupCus')" prop="isGroupCus">
                  <h-select v-model="formItem.isGroupCus" placeholder="">
                    <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.isMainGroupCus')" prop="isMainGroupCus">
                  <h-select v-model="formItem.isMainGroupCus" placeholder="">
                    <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.mainGroupCustNo')" prop="mainGroupCustNo" class="h-form-long-label">
                  <h-input v-model="formItem.mainGroupCustNo" :maxlength=50></h-input>
                </h-form-item>
                <h-form-item label="是否签约E管家" prop="signStatus">
                  <h-select v-model="formItem.signStatus" placeholder="">
                    <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item label="是否签约承诺函" prop="isSignCommitmentLetter" class="h-form-long-label">
                  <h-select v-model="formItem.isSignCommitmentLetter" placeholder="">
                    <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{ $t('m.i.common.searchAdvanced') }}<i
                    class="icon iconfont"
                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{ $t("m.i.common.search") }}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{ $t("m.i.common.reset") }}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/bm/cust/corp/pageQueryCustCorpList"
            :bindForm="formItem"
            :hasSelect="false"
            :rowSelect="true"
            :onSelectChange="handleSelectClick"
            ref="datagrid">
            <div slot="toolbar" class="pull-left" v-if="this.isShowToolbar">
              <h-button type="primary" @click="signEManager()" :disabled="this.signEmanagerDisabled">{{$t("m.i.bm.signEManager")}}</h-button>
              <h-button type="primary" @click="modEManager()" :disabled="this.emanagerDisabled">{{$t("m.i.bm.modEManager")}}</h-button>
              <h-button type="primary" @click="removeEManager()" :disabled="this.emanagerDisabled">{{$t("m.i.bm.removeEManager")}}</h-button>

              <h-button type="primary" @click="signCommitmentLetter()" :disabled="this.signCommitmentLetterDisabled">{{ $t("m.i.bm.signCommitmentLetter") }}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!---->
    <!--点击新增/修改E管家签约弹出窗-->
    <h-msg-box v-model="addOrEditEManagerWin" width="800" class="h-form-search-layer" :maximize="true" :mask-closable="false"
               @on-close="editEditEManagerWinClose">
      <p slot="header">
        <span v-if="eManagerType==='add'">新增E管家签约信息</span>
        <span v-if="eManagerType==='modify'">修改E管家签约信息</span>
      </p>
      <h-panel>
        <h-form :model="eManagerForm" :label-width="120" ref="eManagerForm" cols="2" class="h-form-search">
          <h-form-item prop="custAcctNo" :label="$t('m.i.bm.chargeAccount')" required cols="2">
            <h-input v-model="eManagerForm.custAcctNo" placeholder="" readonly
                     :icon="eManagerType==='add'||eManagerType==='modify' ? 'android-search' : ''"
                     @on-click="queryCustAcctNo()"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.bm.operatorName')" prop="operatorName" required>
            <h-input v-model="eManagerForm.operatorName" :maxlength=50 :placeholder="''"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.bm.operatorPhoneNo')" prop="operatorPhoneNo" required :validRules="phoneNoRule">
            <h-input v-model="eManagerForm.operatorPhoneNo" :maxlength=11 :placeholder="''"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.bm.operatorCertType')" prop="operatorCertType" required>
            <h-select v-model="eManagerForm.operatorCertType" placeholder="" showTitle>
              <h-option v-for="item in certificateTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.bm.operatorCertNo')" prop="operatorCertNo" required>
            <h-input v-model="eManagerForm.operatorCertNo" :maxlength=20 :lengthByByte="false"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.bm.operatorAddr')" prop="operatorAddr" cols="2">
            <h-input  v-model="eManagerForm.operatorAddr" :maxlength=150 :placeholder="''"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.bm.legalName')" prop="corpLegalName" required>
            <h-input v-model="eManagerForm.corpLegalName" :maxlength=50 :placeholder="''"
                     ></h-input>

          </h-form-item>
          <h-form-item :label="$t('m.i.bm.legalPhoneNo')" prop="corpLegalPhoneNo" required :validRules="phoneNoRule">
            <h-input v-model="eManagerForm.corpLegalPhoneNo" :maxlength=11 :placeholder="''"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.bm.legalCertType')" prop="corpLegalCertType" required>
            <h-select v-model="eManagerForm.corpLegalCertType" placeholder="" showTitle>
              <h-option v-for="item in certificateTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.bm.legalCertNo')" prop="corpLegalCertNo" required>
            <h-input v-model="eManagerForm.corpLegalCertNo" :maxlength=20 :placeholder="''"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.bm.legalAddr')" prop="corpLegalAddr" cols="2">
            <h-input v-model="eManagerForm.corpLegalAddr" :maxlength=150 :placeholder="''"></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" @click="editEditEManagerWinClose">{{ $t("m.i.common.close") }}</h-button>
        <h-button type="primary" v-if="submitEManagerFlag" disabled>{{ $t("m.i.common.submiting") }}</h-button>
        <h-button type="primary" v-else @click="submitEmanagerForm">{{ $t("m.i.common.save") }}</h-button>
      </div>

    </h-msg-box>

    <!-- 查询客户结算账号 -->
    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.eManagerForm.custNo"
                       @showCustAcctNoWinClose="showCustAcctNoWinClose" :custAcctKind="1"
                       @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>

    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" class="h-form-search-layer" :maximize="true" :mask-closable="false"
               @on-close="editWinClose">
      <p slot="header">
        <span v-if="type==='add'">新增客户信息</span>
        <span v-if="type==='modify'">修改客户信息</span>
        <span v-if="type==='view'">查看客户信息</span>
        <span v-if="type==='coll'">同步客户信息</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="120" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="'同步方式'" prop="collType" v-if="type==='coll'" :required="isRequired" key="collType">
            <h-row>
              <h-col span="17">
                <h-select v-model="addForm.collType" :maxlength=60 placeholder=""
                          @on-change="addFormResetWithOutCollType">
                  <h-option v-for="item in collTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                </h-select>
              </h-col>
              <h-col span="5" offset="1">
                <h-button type="primary" @click="collCustCorpInfo">{{ $t("m.i.common.synch") }}</h-button>
              </h-col>
            </h-row>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.custNo')" prop="custNo" :required="isRequired" :validRules="custNoRule"
                       v-if="type !== 'coll' || addForm.collType !== ''" key="custNo">
            <h-input v-if="type==='view'" :value="addForm.custNo" class="input-boder-0" :maxlength=50
                     :title="addForm.custNo"></h-input>
            <h-input v-else-if="type==='modify'" v-model="addForm.custNo" :maxlength=50 :placeholder="'50位以下字母或数字'"
                     readonly></h-input>
            <h-input v-else-if="type==='coll' && addForm.collType ==='1' " v-model="addForm.custNo" :maxlength=50
                     @on-change="addFormResetWithOutCustNo"></h-input>
            <h-input v-else-if="type==='coll' && addForm.collType ==='2' " v-model="addForm.custNo" readonly
                     :maxlength=50></h-input>
            <h-input v-else v-model="addForm.custNo" :maxlength=50 :placeholder="'50位以下字母或数字'"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.custName')" prop="custName" :required="isRequired"
                       v-if="type !== 'coll' || addForm.collType !== ''" key="custName">
            <h-input v-if="type==='view'" :value="addForm.custName" class="input-boder-0" :title="addForm.custName"
                     :maxlength=80 :lengthByByte="false"></h-input>
            <h-input v-else-if="type==='coll' && addForm.collType ==='1' " v-model="addForm.custName" readonly
                     :title="addForm.custName" :maxlength=80 :lengthByByte="false"></h-input>
            <h-input v-else-if="type==='coll' && addForm.collType ==='2' " v-model="addForm.custName"
                     @on-change="addFormResetWithOutCustNo" :maxlength=80 :lengthByByte="false"
                     :title="addForm.custName"></h-input>
            <h-input v-else v-model="addForm.custName" :maxlength=80 :lengthByByte="false" :placeholder="''"></h-input>
          </h-form-item>
          <!-- 证件类型 -->
          <h-form-item prop="certType" :label="'证件类型'" v-if="addForm.collType === '2' && type==='coll'" key="certType1">
            <h-select v-model="addForm.certType" prop="addForm.certType" :required="isRequired" placeholder=""
                      @on-change="certTypeChange">
              <h-option v-for="item in certTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="certType" :label="'证件类型'" v-if="addForm.collType === '1' && type==='coll'" key="certType2">
            <h-select v-model="addForm.certType" prop="addForm.certType" :required="isRequired" placeholder="" readonly>
              <h-option v-for="item in certTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <div v-if="type==='coll'">
            <h-form-item :label="$t('m.i.common.orgCode')" prop="orgCode" :required="isRequired"
                         :validRules="orgCodeRule"
                         v-if="addForm.certType === '1'" key="orgCode1">
              <h-input v-model="addForm.orgCode" :title="addForm.orgCode" :maxlength=10></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.common.orgCode')" prop="orgCode" :required="isRequired"
                         :validRules="orgCodeRule"
                         v-if="addForm.certType !== '1'" key="orgCode2">
              <h-input v-model="addForm.orgCode" :title="addForm.orgCode" :maxlength=10 readonly></h-input>
            </h-form-item>

            <h-form-item :label="$t('m.i.common.socCode')" prop="socCode" :required="isRequired"
                         :validRules="sosCodeRule"
                         v-if="addForm.certType ==='2'" key="socCode1">
              <h-input v-model="addForm.socCode" :title="addForm.socCode" :maxlength=18></h-input>
            </h-form-item>

            <h-form-item :label="$t('m.i.common.socCode')" prop="socCode" :required="isRequired"
                         :validRules="sosCodeRule"
                         v-if="addForm.certType !=='2'" key="socCode2">
              <h-input v-model="addForm.socCode" :title="addForm.socCode" :maxlength=18></h-input>
            </h-form-item>
          </div>

          <h-form-item :label="$t('m.i.common.socCode')" prop="socCode" :required="isRequired" :validRules="sosCodeRule"
                       v-show="type!=='coll'" key="socCode3">
            <h-input v-if="type==='view'" :value="addForm.socCode" class="input-boder-0"
                     :title="addForm.socCode"></h-input>
            <h-input v-else v-model="addForm.socCode" :maxlength=18 :placeholder="'两位数字或字母，加六位数字，加十位数字或字母'"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.custPartnerType')" prop="custPartnerType" :required="isRequired">
            <h-select :value="'RC01'" v-model="addForm.custPartnerType" readonly placeholder="">
              <h-option value="RC01" key="RC01">企业</h-option>
            </h-select>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.isGroupCus')" prop="isGroupCus" :required="isRequired">
            <div @click="modifyPrompt">
              <h-select v-if="type==='view'" :value="addForm.isGroupCus" class="input-boder-0"
                        :title="addForm.isGroupCus" readonly placeholder="">
                <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
              </h-select>
              <h-select v-else-if="type==='modify' && !isUpdateMainGroupCus" v-model="addForm.isGroupCus" :maxlength=60
                        @on-change="groupCusReset" placeholder="">
                <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
              </h-select>
              <h-select v-else-if="type==='modify' && isUpdateMainGroupCus" v-model="addForm.isGroupCus" :maxlength=60
                        readonly placeholder="">
                <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
              </h-select>
              <h-select v-else-if="type==='coll'" v-model="addForm.isGroupCus" :maxlength=60
                        readonly placeholder="">
                <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
              </h-select>
              <h-select v-else v-model="addForm.isGroupCus" :maxlength=60 @on-change="groupCusReset" placeholder="">
                <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
              </h-select>
            </div>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.isAgencyCust')" prop="isAgencyCust" :required="isRequired">
            <h-select v-if="type==='view'" :value="addForm.isAgencyCust" class="input-boder-0"
                      :title="addForm.isAgencyCust" readonly placeholder="">
              <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-select v-else-if="type==='coll'" readonly v-model="addForm.isAgencyCust" :maxlength=60 placeholder="">
              <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-select v-else v-model="addForm.isAgencyCust" :maxlength=60 placeholder="">
              <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.isMainGroupCus')" prop="isMainGroupCus" :required="isRequired"
                       v-if="addForm.isGroupCus=='1'"
                       key="isMainGroupCus">
            <div @click="modifyPrompt">
              <h-select v-if="type==='view'" :value="addForm.isMainGroupCus" class="input-boder-0"
                        :title="addForm.isMainGroupCus" placeholder="">
                <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
              </h-select>
              <h-select v-else-if="type==='modify' && !isUpdateMainGroupCus " v-model="addForm.isMainGroupCus"
                        :maxlength=60 @on-change="groupCusNoReset" placeholder="">
                <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
              </h-select>
              <h-select v-else-if="type==='modify' && isUpdateMainGroupCus " v-model="addForm.isMainGroupCus"
                        :maxlength=60 readonly placeholder="">
                <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
              </h-select>
              <h-select v-else-if="type==='coll'" v-model="addForm.isMainGroupCus"
                        :maxlength=60 readonly placeholder="">
                <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
              </h-select>
              <h-select v-else v-model="addForm.isMainGroupCus" :maxlength=60 @on-change="groupCusNoReset"
                        placeholder="">
                <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
              </h-select>
            </div>
          </h-form-item>

          <h-form-item :label="''" v-if="addForm.isMainGroupCus=='1' && isUpdateMainGroupCus">
            <h-button type="primary" @click="handleShowGroupForBreak()">{{ $t('m.i.bm.dissolutionGroup') }}</h-button>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.mainGroupCustNo')" prop="mainGroupCustNo" :required="isRequired"
                       v-if="addForm.isMainGroupCus==='0'" key="mainGroupCustNo">
            <h-input v-if="type==='coll'" v-model="addForm.mainGroupCustNo" readonly
                     :title="addForm.mainGroupCustNo"></h-input>
            <h-input v-else v-model="addForm.mainGroupCustNo" readonly
                     icon="android-search" @on-click="showMainCust" clearable @on-clear="clearMainCust"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.industryCategory')" prop="industryCategory" :required="isRequired">
            <h-select v-if="type==='view'" :value="addForm.industryCategory" class="input-boder-0"
                      :title="addForm.industryCategory" placeholder="">
              <h-option v-for="item in industryCategoryList" :value="item.key" :key="item.key">{{ item.value }}
              </h-option>
            </h-select>
            <h-select v-else-if="type==='coll'" v-model="addForm.industryCategory" :title="addForm.industryCategory"
                      placeholder="">
              <h-option v-for="item in industryCategoryList" :value="item.key" :key="item.key">{{ item.value }}
              </h-option>
            </h-select>
            <h-select v-else v-model="addForm.industryCategory" :maxlength=60 placeholder="">
              <h-option v-for="item in industryCategoryList" :value="item.key" :key="item.key">{{ item.value }}
              </h-option>
            </h-select>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.corpScale')" prop="corpScale" :required="isRequired">
            <h-select v-if="type==='view'" :value="addForm.corpScale" class="input-boder-0" :title="addForm.corpScale"
                      placeholder="">
              <h-option v-for="item in corpScaleList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-select v-else-if="type==='coll'" v-model="addForm.corpScale" :title="addForm.corpScale"
                      placeholder="">
              <h-option v-for="item in corpScaleList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-select v-else v-model="addForm.corpScale" :maxlength=60 placeholder="">
              <h-option v-for="item in corpScaleList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.isArc')" prop="isArc" :required="isRequired">
            <h-select v-if="type==='view'" :value="addForm.isArc" class="input-boder-0" :title="addForm.isArc"
                      placeholder="">
              <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-select v-else-if="type==='coll'" v-model="addForm.isArc" :title="addForm.isArc" placeholder="">
              <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-select v-else v-model="addForm.isArc" :maxlength=60 placeholder="">
              <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.isGreenCorp')" prop="isGreenCorp" :required="isRequired">
            <h-select v-if="type==='view'" :value="addForm.isGreenCorp" class="input-boder-0"
                      :title="addForm.isGreenCorp" placeholder="">
              <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-select v-else-if="type==='coll'" v-model="addForm.isGreenCorp" :title="addForm.isGreenCorp"
                      placeholder="">
              <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-select v-else v-model="addForm.isGreenCorp" :maxlength=60 placeholder="">
              <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.area')" prop="area" :required="isRequired">
            <h-select v-if="type==='view'" :value="addForm.area" class="input-boder-0" placeholder="">
              <h-option v-for="item in areaList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-select v-if="type==='coll'" v-model="addForm.area" :title="addForm.area" placeholder="" readonly>
              <h-option v-for="item in areaList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-select v-else v-model="addForm.area" :maxlength=60 placeholder="">
              <h-option v-for="item in areaList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.custMgrNo')" prop="custMgrNo">
            <h-input v-if="type==='view'" :value="addForm.custMgrNo" class="input-boder-0"
                     :title="addForm.custMgrNo" :maxlength=50></h-input>
            <h-input v-else-if="type==='coll'" readonly :value="addForm.custMgrNo"
                     :title="addForm.custMgrNo" :maxlength=50></h-input>
            <h-input v-else v-model="addForm.custMgrNo" :maxlength=50 readonly
                     :placeholder="''"
                     icon="android-search" @on-click="showCusManager" clearable @on-clear="clearCusManager"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.custMgrName')" prop="custMgrName">
            <h-input v-if="type==='view'" :value="addForm.custMgrName" readonly class="input-boder-0"
                     :title="addForm.custMgrName" :maxlength=60></h-input>
            <h-input v-else-if="type==='coll'" v-model="addForm.custMgrName" readonly
                     :title="addForm.custMgrName" :maxlength=60></h-input>
            <h-input v-else v-model="addForm.custMgrName" :maxlength=60 :placeholder="''" readonly></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.bm.custAddr')" prop="custAddr" :required="isRequired">
            <h-input v-if="type==='view'" :value="addForm.custAddr" class="input-boder-0"
                     :title="addForm.custAddr" :maxlength=150 :lengthByByte="false"></h-input>
            <h-input v-else-if="type==='coll'" v-model="addForm.custAddr" readonly :title="addForm.custAddr"
                     :maxlength=60></h-input>
            <h-input v-else v-model="addForm.custAddr" :maxlength=150 :lengthByByte="false" :placeholder="''"></h-input>
          </h-form-item>


          <h-form-item :label="$t('m.i.common.phone')" prop="phone" :validRules="phoneRule">
            <h-input v-if="type==='view'" :value="addForm.phone" class="input-boder-0" :title="addForm.phone"
                     :maxlength=13></h-input>
            <h-input v-else-if="type==='coll'" v-model="addForm.phone" readonly :title="addForm.phone"
                     :maxlength=13></h-input>
            <h-input v-else v-model="addForm.phone" :maxlength=13 :placeholder="'小于等于13位的数字或-'"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.fax')" prop="custFax" :validRules="custFaxRule">
            <h-input v-if="type==='view'" :value="addForm.custFax" class="input-boder-0"
                     :title="addForm.custFax" :maxlength=13></h-input>
            <h-input v-else-if="type==='coll'" v-model="addForm.custFax" readonly :title="addForm.custFax"
                     :maxlength=13></h-input>
            <h-input v-else v-model="addForm.custFax" :maxlength=13 :placeholder="'小于等于13位的数字或-'"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.bm.custEmail')" prop="multipleEmail">
            <h-input v-model="addForm.multipleEmail" :maxlength=75 :lengthByByte="false"
                     placeholder="总长度不超过75"></h-input>
          </h-form-item>

          <!--中征码-->
          <h-form-item :label="$t('m.i.bm.lccCode')" prop="lccCode">
            <h-input v-if="type==='view'" :value="addForm.lccCode" class="input-boder-0"
                     :title="addForm.lccCode" :maxlength=32 :lengthByByte="false" readonly></h-input>
            <h-input v-else-if="type==='coll'" v-model="addForm.lccCode" :title="addForm.lccCode" :maxlength=32
                     :lengthByByte="false"></h-input>
            <h-input v-else v-model="addForm.lccCode" :maxlength=32 :lengthByByte="false"></h-input>
          </h-form-item>

          <!--LEI码-->
          <h-form-item :label="$t('m.i.bm.leiCode')" prop="leiCode">
            <h-input v-if="type==='view'" :value="addForm.leiCode" class="input-boder-0"
                     :title="addForm.leiCode" :maxlength=32 :lengthByByte="false" readonly></h-input>
            <h-input v-else-if="type==='coll'" v-model="addForm.leiCode" :title="addForm.leiCode" :maxlength=32
                     :lengthByByte="false"></h-input>
            <h-input v-else v-model="addForm.leiCode" :maxlength=32 :lengthByByte="false"></h-input>
          </h-form-item>

          <!--主要经营地址-->
          <h-form-item :label="$t('m.i.bm.mainBusiAddr')" prop="mainBusiAddr" :required="isRequired">
            <h-input v-if="type==='view'" :value="addForm.mainBusiAddr" class="input-boder-0"
                     :title="addForm.mainBusiAddr" :maxlength=150 :lengthByByte="false" readonly></h-input>
            <h-input v-else-if="type==='coll'" v-model="addForm.mainBusiAddr" :title="addForm.mainBusiAddr"
                     :maxlength=250></h-input>
            <h-input v-else v-model="addForm.mainBusiAddr" :maxlength=150 :lengthByByte="false"></h-input>
          </h-form-item>

          <!--客户性质-->
          <h-form-item :label="$t('m.i.bm.corpNature')" prop="corpNature">
            <h-select v-if="type==='view'" :value="addForm.corpNature" class="input-boder-0"
                      :title="addForm.corpNature" placeholder="">
              <h-option v-for="item in corpNatureList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-select v-else-if="type==='coll'" v-model="addForm.corpNature" :title="addForm.corpNature"
                      placeholder="">
              <h-option v-for="item in corpNatureList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-select v-else v-model="addForm.corpNature" :maxlength=60 placeholder="">
              <h-option v-for="item in corpNatureList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>

          <!--是否科技-->
          <h-form-item :label="$t('m.i.common.isSciCorpFdisc')" prop="isTechnologyCorp">
            <h-select v-if="type==='view'" :value="addForm.isTechnologyCorp" class="input-boder-0"
                      :title="addForm.isTechnologyCorp" placeholder="">
              <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-select v-else-if="type==='coll'" v-model="addForm.isTechnologyCorp" :title="addForm.isTechnologyCorp"
                      placeholder="">
              <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-select v-else v-model="addForm.isTechnologyCorp" :maxlength=60 placeholder="">
              <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>

          <!--信用评级-->
          <h-form-item :label="$t('m.i.bs.creditRating')" prop="creditRating" :validRules="creditRatingRule">
            <h-input v-if="type==='view'" :value="addForm.creditRating" class="input-boder-0"
                     :title="addForm.creditRating" :maxlength=6></h-input>
            <h-input v-else-if="type==='coll'" v-model="addForm.creditRating" :title="addForm.creditRating"
                     :maxlength=6></h-input>
            <h-input v-else v-model="addForm.creditRating" :maxlength=6 :placeholder="'数字、字母、+、-最少一位，最多六位'"></h-input>
          </h-form-item>

          <!--评级主体-->
          <h-form-item :label="$t('m.i.billInfo.cdtRatgAgcy')" prop="creditRatingMain">
            <h-input v-if="type==='view'" :value="addForm.creditRatingMain" class="input-boder-0"
                     :title="addForm.creditRatingMain" :maxlength=60 :lengthByByte="false" readonly></h-input>
            <h-input v-else-if="type==='coll'" v-model="addForm.creditRatingMain" :title="addForm.creditRatingMain"
                     :maxlength=60 :lengthByByte="false"></h-input>
            <h-input v-else v-model="addForm.creditRatingMain" :maxlength=60 :lengthByByte="false"></h-input>
          </h-form-item>

          <!--评级到期日-->
          <common-date-picker :label="$t('m.i.billInfo.cdtRatgDueDt')" prop="creditRatgDueDt"
                              v-model="addForm.creditRatgDueDt" placeholder="" showFormat :editable=false
                              :readonly="type==='view'"></common-date-picker>

          <!--法人代表人姓名-->
          <h-form-item :label="$t('m.i.bm.corpLegalName')" prop="corpLegalName">
            <h-input v-if="type==='view'" :value="addForm.corpLegalName" class="input-boder-0"
                     :title="addForm.corpLegalName" :maxlength=20 :lengthByByte="false" readonly></h-input>
            <h-input v-else-if="type==='coll'" v-model="addForm.corpLegalName" :title="addForm.corpLegalName"
                     :maxlength=20 :lengthByByte="false"></h-input>
            <h-input v-else v-model="addForm.corpLegalName" :maxlength=20 :lengthByByte="false"></h-input>
          </h-form-item>

          <!--法定代表人证件类型-->
          <h-form-item :label="$t('m.i.bm.corpLegalCertType')" prop="corpLegalCertType">
            <h-select v-if="type==='view'" :value="addForm.corpLegalCertType" class="input-boder-0"
                      :title="addForm.corpLegalCertType" placeholder="">
              <h-option v-for="item in corpLegalCertTypeList" :value="item.key" :key="item.key">{{
                  item.value
                }}
              </h-option>
            </h-select>
            <h-select v-else-if="type==='coll'" v-model="addForm.corpLegalCertType" :title="addForm.corpLegalCertType"
                      placeholder="">
              <h-option v-for="item in corpLegalCertTypeList" :value="item.key" :key="item.key">{{
                  item.value
                }}
              </h-option>
            </h-select>
            <h-select v-else v-model="addForm.corpLegalCertType" :maxlength=60 placeholder="">
              <h-option v-for="item in corpLegalCertTypeList" :value="item.key" :key="item.key">{{
                  item.value
                }}
              </h-option>
            </h-select>
          </h-form-item>

          <!--法人代表人证件号码-->
          <h-form-item :label="$t('m.i.bm.corpLegalCertNo')" prop="corpLegalCertNo">
            <h-input v-if="type==='view'" :value="addForm.corpLegalCertNo" class="input-boder-0"
                     :title="addForm.corpLegalCertNo" :maxlength=20 :lengthByByte="false" readonly></h-input>
            <h-input v-else-if="type==='coll'" v-model="addForm.corpLegalCertNo" :title="addForm.corpLegalCertNo"
                     :maxlength=20 :lengthByByte="false"></h-input>
            <h-input v-else v-model="addForm.corpLegalCertNo" :maxlength=20 :lengthByByte="false"></h-input>
          </h-form-item>


          <!--是否签约承诺函-->
          <h-form-item :label="$t('m.i.bm.isSignCommitmentLetter')" prop="isSignCommitmentLetter">
            <h-select v-if="type==='view'" :value="addForm.isSignCommitmentLetter" class="input-boder-0"
                      :title="addForm.isSignCommitmentLetter" readonly placeholder="">
              <h-option v-for="item in signCommitmentLetterList" :value="item.key" :key="item.key">{{
                item.value
                }}
              </h-option>
            </h-select>
            <h-select v-else-if="type==='coll'" v-model="addForm.isSignCommitmentLetter" :title="addForm.isSignCommitmentLetter"
                      readonly placeholder="">
              <h-option v-for="item in signCommitmentLetterList" :value="item.key" :key="item.key">{{
                item.value
                }}
              </h-option>
            </h-select>
            <h-select v-else v-model="addForm.isSignCommitmentLetter" :maxlength=60 readonly placeholder="">
              <h-option v-for="item in signCommitmentLetterList" :value="item.key" :key="item.key">{{
                item.value
                }}
              </h-option>
            </h-select>
          </h-form-item>

          <!--承诺函经办人员-->
          <h-form-item :label="$t('m.i.bm.signTellerNo')" prop="signTellerNo">
            <h-input v-if="type==='view'" :value="addForm.signTellerNo" class="input-boder-0"
                     :title="addForm.signTellerNo" :maxlength=20 :lengthByByte="false" readonly></h-input>
            <h-input v-else-if="type==='coll'" v-model="addForm.signTellerNo" :title="addForm.signTellerNo"
                     :maxlength=20 :lengthByByte="false" readonly></h-input>
            <h-input v-else v-model="addForm.signTellerNo" :maxlength=20 :lengthByByte="false" readonly></h-input>
          </h-form-item>

        </h-form>
      </h-panel>

      <div slot="footer" v-if="type!=='view'">
        <h-button type="ghost" @click="editWinClose">{{ $t("m.i.common.close") }}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{ $t("m.i.common.submiting") }}</h-button>
        <h-button type="primary" v-else @click="submitForm()">{{ $t("m.i.common.confirm") }}</h-button>
      </div>
      <div slot="footer" v-else>
        <h-button type="ghost" @click="editWinClose">{{ $t("m.i.common.close") }}</h-button>
      </div>
    </h-msg-box>


    <h-msg-box v-model="custNoMergeWin" width="800" class="h-form-search-layer" :maximize="true" :mask-closable="false"
               @on-close="editWinClose">
      <p slot="header">{{ $t("m.i.bm.custNoMerge") }}</p>
      <h-panel>
        <h-form :model="addForm" :label-width="120" ref="addForm" cols="2" class="h-form-search">

          <h-form-item :label="$t('m.i.bm.currentCustNo')" :required="isRequired">
            <h-input v-model="addForm.custNo" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.bm.currentMergeCustNo')" required prop="currentMergeCustNo">
            <h-input v-model="addForm.currentMergeCustNo" placeholder="" readonly icon="android-search"
                     @on-click="queryCustMessage" clearable
                     @on-clear="clearMergeCustInfo"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.bm.currentCustName')" :required="isRequired">
            <h-input v-model="addForm.custName" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.bm.currentMergeCustName')" required prop="currentMergeCustName" >
            <h-input v-model="addForm.currentMergeCustName" placeholder="" readonly></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" @click="mergeCustNoWinClose">{{ $t("m.i.common.close") }}</h-button>
        <h-button type="primary" @click="checkMergeCustNoIsBusinessSubmitForm()">{{
            $t("m.i.common.mergeCustNo")
          }}
        </h-button>
      </div>
    </h-msg-box>


    <show-cust-acct :showCustAcctWin="showCustAcctWin" :selectCustNo="selectCustNo" :title="'查看账户'"
                    :ifdoubleClick="false"
                    @showCustAcctWinClose="showCustAcctWinClose"></show-cust-acct>
    <show-cust-corp :showCustCorpWin="showCustCorpWin" :title="'解除集团总部下客户集团关系'"
                    :showMainGroupCustNo="showMainGroupCustNo"
                    @showCustCorpWinClose="showCustCorpWinClose" ref="breakGroupRelation"></show-cust-corp>
    <show-cust-corp :showCustCorpWin="showMainCustWin" :title="'选择集团总部客户'" :isMainGroupCustNo="'1'"
                    @showCustCorpWinClose="showMainCustWinClose" @custSelect="selectMainGroupCust"></show-cust-corp>
    <show-cust-manager :showCustManagerWin="showCustManagerWin" :title="'选择客户经理'"
                       @showCustManagerWinClose="showCustManagerWinClose"
                       @custManagerSelect="custManagerSelect"></show-cust-manager>
    <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                       @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
  </div>
</template>
<script>
import {post, exportList, on, off} from "@/api/bizApi/commonUtil";

export default {
  name: "custCorp",
  components: {
    ShowCustAcct: () => import(/* webpackChunkName: "bm/cust/acct/showCustAcct"*/"@/views/bizViews/bm/cust/acct/showCustAcct.vue"),
    ShowCustCorp: () => import(/* webpackChunkName: "bm/cust/corp/showCustCorp"*/"@/views/bizViews/bm/cust/corp/showCustCorp.vue"),
    showCustManager: () => import(/* webpackChunkName: "bm/cust/manager/showCustManager"*/"@/views/bizViews/bm/cust/manager/showCustManager.vue"),
  },
  data() {
    let columns = [
      {
        type: "selection",
        key: "duoxuan",
        width: 60,
        align: "center",
        hiddenCol: false
      },
      {
        title: this.$t("m.i.common.index"),
        type: "index",
        key: "xuhao",
        width: 60,
        align: "center",

        hiddenCol: false
      },
      {
        title: this.$t('m.i.common.custNo'),
        key: "custNo",

        hiddenCol: false,
        sortable: true
      },
      {
        title: this.$t('m.i.common.custName'),
        key: "custName",
        hiddenCol: false,
        sortable: true
      },
      {
        title: this.$t('m.i.common.socCode'),
        key: "socCode",
        hiddenCol: false,
        sortable: true
      },
      {
        title: this.$t('m.i.common.orgCode'),
        key: "orgCode",
        hiddenCol: false
      },
      {
        title: this.$t('m.i.common.custPartnerType'),
        key: "custPartnerType",
        hiddenCol: false,
        render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, "partnerType", params.row.custPartnerType);
          return h("span", {domProps: {title: dictValue}}, dictValue);
        }
      },
      {
        title: this.$t('m.i.common.industryCategory'),
        key: "industryCategory",
        hiddenCol: false,
        render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, "Industry", params.row.industryCategory);
          return h("span", {domProps: {title: dictValue}}, dictValue);
        }
      },
      {
        title: this.$t('m.i.common.corpScale'),
        key: "corpScale",
        hiddenCol: false,
        render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, "CorpScale", params.row.corpScale);
          return h("span", {domProps: {title: dictValue}}, dictValue);
        }
      },
      {
        title: this.$t('m.i.common.isArc'),
        key: "isArc",
        hiddenCol: false,
        render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isArc);
          return h("span", {domProps: {title: dictValue}}, dictValue);
        }
      },
      // 是否绿色
      {
        title: this.$t('m.i.common.isGreenCorp'),
        key: "isGreenCorp",
        hiddenCol: false,
        render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isGreenCorp);
          return h("span", {domProps: {title: dictValue}}, dictValue);
        }
      },
      {
        title: this.$t('m.i.common.isGroupCus'),
        key: "isGroupCus",
        hiddenCol: false,
        sortable: true,
        render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isGroupCus);
          return h("div", {domProps: {title: dictValue}}, dictValue);
        }
      },
      {
        title: this.$t('m.i.common.isMainGroupCus'),
        key: "isMainGroupCus",
        hiddenCol: false,
        sortable: true,
        render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isMainGroupCus);
          return h("div", {domProps: {title: dictValue}}, dictValue);
        }
      },
      {
        title: this.$t('m.i.common.mainGroupCustNo'),
        key: "mainGroupCustNo",
        hiddenCol: false,
        sortable: true
      },
      {
        title: this.$t('m.i.common.createBrchNo'),
        key: "createBrchNo",
        hiddenCol: false,
        sortable: true
      },
      {
        title: this.$t('m.i.common.createBrchName'),
        key: "createBrchName",
        hiddenCol: false
      },
      /**/
      {
        title: this.$t('m.i.common.custMgrNo'),
        key: "custMgrNo",
        hiddenCol: true
      },
      {
        title: this.$t('m.i.common.custMgrName'),
        key: "custMgrName",
        hiddenCol: true
      },
      {
        title: this.$t('m.i.common.loanCtrctNo'),
        key: "loanCtrctNo",
        hiddenCol: true

      },
      {
        title: this.$t('m.i.common.custAddr'),
        key: "custAddr",
        hiddenCol: true
      },
      {
        title: this.$t('m.i.common.fax'),
        key: "custFax",
        hiddenCol: true
      },
      {
        title: this.$t('m.i.common.phone'),
        key: "phone",
        hiddenCol: true
      },
      {
        title: this.$t('m.i.common.email'),
        key: "multipleEmail",
        hiddenCol: false
      },

      {
        title: this.$t('m.i.bm.lccCode'),
        key: "lccCode",
        hiddenCol: false
      },
      {
        title: this.$t('m.i.bm.leiCode'),
        key: "leiCode",
        hiddenCol: false
      },
      {
        title: this.$t('m.i.bm.mainBusiAddr'),
        key: "mainBusiAddr",
        hiddenCol: false
      },
      {
        title: this.$t('m.i.bm.corpNature'),
        key: "corpNature",
        hiddenCol: false,
        render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, "CpesCorpNature", params.row.corpNature);
          return h("div", {domProps: {title: dictValue}}, dictValue);
        }
      },
      {
        title: this.$t('m.i.common.isSciCorpFdisc'),
        key: "isTechnologyCorp",
        hiddenCol: false,
        render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isTechnologyCorp);
          return h("div", {domProps: {title: dictValue}}, dictValue);
        }
      },
      {
        title: this.$t('m.i.bs.creditRating'),
        key: "creditRating",
        hiddenCol: false
      },
      {
        title: this.$t('m.i.billInfo.cdtRatgAgcy'),
        key: "creditRatingMain",
        hiddenCol: false
      },
      {
        title: this.$t('m.i.billInfo.cdtRatgDueDt'),
        key: "creditRatgDueDt",
        hiddenCol: false
      },
      {
        title: this.$t('m.i.bm.corpLegalName'),
        key: "corpLegalName",
        hiddenCol: false
      },
      {
        title: this.$t('m.i.bm.corpLegalCertType'),
        key: "corpLegalCertType",
        hiddenCol: false,
        render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, "CertType", params.row.corpLegalCertType);
          return h("div", {domProps: {title: dictValue}}, dictValue);
        }
      },
      {
        title: this.$t('m.i.bm.corpLegalCertNo'),
        key: "corpLegalCertNo",
        hiddenCol: false
      },
      {
        title: this.$t('m.i.bm.isSignCommitmentLetter'),
        key: "isSignCommitmentLetter",
        hiddenCol: false,
        render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isSignCommitmentLetter);
          return h("span", {domProps: {title: dictValue}}, dictValue);
        }
      },
      {
        title: this.$t('m.i.bm.signTellerNo'),
        key: "signTellerNo",
        hiddenCol: false
      },
      {
        title: this.$t('m.i.bm.signBrchNo'),
        key: "signBrchNo",
        hiddenCol: false
      },
      {
        title: "签约E管家",
        key: "signStatus",
        hiddenCol: false,
        render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.signStatus);
          return h("div", {domProps: {title: dictValue}}, dictValue);
        }
      },
      {
        title: this.$t("m.i.pl.EcreditDt"),
        key: "signDt",
        sortable: true,
        hiddenCol: false,
        render: (h, params) => {
          let date = params.row.signDt == null ? "" : this.$moment(params.row.signDt, "YYYY-MM-DD").format("YYYY-MM-DD");
          return h("span", date);
        }
      },

    ];
    let formItem = {
      custName: "",
      activeFlag: "1",
      custAcctKind: "",
      custNo: "",
      openBankNo: "",
      openDt: "",
      createBrchNo: "",
      createBrchName: "",
      isGroupCus: "",
      isMainGroupCus: "",
      mainGroupCustNo: "",
      orgCode: "",
      socCode: "",
      currentMergeCustNo: "",
      currentMergeCustName: "",
      signStatus: "",
      checkSignStatus: "1"
    };
    let addForm = {
      id: "",
      legalNo: "",
      custNo: "",
      custName: "",
      custMgrNo: "",
      custMgrName: "",
      loanCtrctNo: "",
      orgCode: "",
      activeFlag: "",
      custPartnerType: "",
      isGroupCus: "",
      isMainGroupCus: "",
      mainGroupCustNo: "",
      custAddr: "",
      custFax: "",
      phone: "",
      createBrchNo: "",
      createBrchName: "",
      operBrchNo: "",
      operBrchName: "",
      operTellerNo: "",
      operTellerName: "",
      custBrchId: "",
      transplantFlag: "",
      industryCategory: "",
      corpScale: "",
      socCode: "",
      isArc: "",
      isGreenCorp: "",
      isAgencyCust: "0",
      area: "",
      reserve1: "",
      reserve2: "",
      reserve3: "",
      createTime: "",
      updateTime: "",
      collType: "2",
      certType: "",
      multipleEmail: "",
      lccCode: "",
      leiCode: "",
      mainBusiAddr: "",
      isTechnologyCorp: "",
      corpNature: "",
      creditRating: "",
      creditRatingMain: "",
      creditRatgDueDt: "",
      corpLegalName: "",
      corpLegalCertType: "",
      corpLegalCertNo: "",
      isSignCommitmentLetter: "",
      signTellerNo: "",
      signBrchNo: "",
      isChangeCreditRatgDueDt: "1",
      currentMergeCustNo: "",
      currentMergeCustName: "",
    };
    let eManagerForm = {
      id:"",
      legalNo:"",
      custNo:"",
      custName:"",
      activeFlag:"",
      operatorName:"",
      operatorPhoneNo:"",
      operatorCertType:"",
      operatorCertNo:"",
      operatorAddr:"",
      corpLegalName:"",
      corpLegalPhoneNo:"",
      corpLegalCertType:"",
      corpLegalCertNo:"",
      corpLegalAddr:"",
      custAcctNo:"",
      reserve1:"",
      reserve2:"",
      reserve3:""

    };
    //agencyCertNo
    let authObj = {
      bizSetRoleAdd: true, //角色添加
      bizSetRoleDelete: true, //角色删除
      bizSetRoleORight: true, //角色操作权限
      bizSetRoleARight: true, //角色授权权限
      bizRoleRightSet: true, //角色权限处理
      bizRoleRightCopy: true, //角色权限复制
      bizSetRoleDownload: true //角色信息下载
    };

    function validCustNo(rule, val, callback) {
      let re = /^[a-zA-Z0-9]{0,50}$/;
      if (re.test(val)) {
        callback()
      } else {
        callback(new Error("非法输入，只能输入英文、数字"))
      }
    }
    function validateSameCust(rule, val, callback) {
      let custName = this.addForm.custName;
      let currentMergeCustName = this.addForm.currentMergeCustName;
      if (custName !== currentMergeCustName) {
        callback()
      } else {
        callback(new Error("被归并客户与当前客户一致，请重新选择客户归并"))
      }
    }
    function validLoanCtrctNo(rule, val, callback) {
      let re = /^[a-zA-Z0-9]{0,50}$/;
      if (re.test(val)) {
        callback()
      } else {
        callback(new Error("非法输入，只能输入英文、数字"))
      }
    }

    function validOrgCode(rule, val, callback) {
      let re = /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{1}$/;
      if (re.test(val)) {
        callback()
      } else {
        callback(new Error("非法输入，组织机构代码由8位数字或字母加上一个\"-\"再加一位数字或字母组成"))
      }
    }

    function validPhone(rule, val, callback) {
      let re = /^[0-9_-]{1,13}$/;
      if (val == null || val == '') {
        callback()
      }
      if (re.test(val)) {
        callback()
      } else {
        callback(new Error("非法输入，电话号码为小于等于13位的数字或-组成"))
      }
    }

    function validPhoneNo(rule, val, callback) {
      let re = /^[0-9_-]{1,11}$/;
      if (val == null || val == '') {
        callback()
      }
      if (re.test(val)) {
        callback()
      } else {
        callback(new Error("非法输入，手机号码为小于等于11位的数字或-组成"))
      }
    }

    function validFax(rule, val, callback) {
      let re = /^[0-9_-]{1,13}$/;
      if (val == null || val == '') {
        callback()
      }
      if (re.test(val)) {
        callback()
      } else {
        callback(new Error("非法输入，传真为小于等于13位的数字或-组成"))
      }
    }

    function validSosCode(rule, val, callback) {
      let re = /([a-zA-Z0-9]{2})([0-9]{6})([a-zA-Z0-9]{10})/;
      if (re.test(val)) {
        callback()
      } else {
        callback(new Error("非法输入，社会信用代码由两位数字或字母，加六位数字，加十位数字或字母组成，且为18位"))
      }
    }

    function validCreditRating(rule, val, callback) {
      let re = /^[a-zA-Z0-9-/+]{1,6}$/;
      if (val == null || val == '') {
        callback()
      }
      if (re.test(val)) {
        callback()
      } else {
        callback(new Error("非法输入，信用评级为小于等于6位的数字、字母或-、+组成"))
      }
    }

    return {
      CustMergeIsShow: false,
      isShowToolbar: false,
      btnAuth: {},
      authObj: authObj,
      // 是否显示新增或修改窗口
      addOrEditWin: false,
      addOrEditEManagerWin:false,
      custNoMergeWin: false,
      formItem: formItem,
      orgCodeRule: [{
        test: /^[0-9A-Z]{8}\-[0-9A-Z]$/,
        trigger: "blur",
        message: "组织机构代码由8位数字或大写字母加上一个“-”再加上一位数字或大写字母组成"
      }],
      addForm: addForm,
      eManagerForm: eManagerForm,
      columns: columns,
      branchColumns: columns,
      type: null,
      eManagerType: null,
      readonly: false,
      isRequired: true,
      tableRef: "selfTable",
      deletDisabled: false,
      emanagerDisabled: false,
      signEmanagerDisabled: false,
      signCommitmentLetterDisabled: false,
      isLogOn: false,
      brchCodeWin: false,
      showMainCustWin: false,
      showCustManagerWin: false,
      showCustMessageWin: false,
      mainGroupCustName: "",
      isTrue: true,
      isList: [],
      collTypeList: [],
      certTypeList: [],
      isOffList: [],
      corpScaleList: [],
      corpNatureList: [],
      corpLegalCertTypeList: [],
      certificateTypeList: [],
      areaList: [],
      industryCategoryList: [],
      signCommitmentLetterList: [],
      showCustAcctWin: false,
      showCustCorpWin: false,
      showCustAcctNoWin : false,
      showMainGroupCustNo: "",
      selectCustNo: "",
      submitFlag: false,
      submitEManagerFlag: false,
      copyWin: false,
      submitWin: false,
      submitMsg: "",
      submitTitle: "",
      retMsg: "",
      sameMergeCustRule: [{
        test: validateSameCust,
        trigger: 'blur'
        // message: '被归并客户与当前客户一致，请重新选择客户归并'
      }],
      custNoRule: [{test: validCustNo, trigger: "blur"}],
      loanCtrctNoRule: [{test: validLoanCtrctNo, trigger: "blur"}],
      phoneRule: [{test: validPhone, trigger: "blur"}],
      phoneNoRule: [{test: validPhoneNo, trigger: "blur"}],
      custFaxRule: [{test: validFax, trigger: "blur"}],
      sosCodeRule: [{test: validSosCode, trigger: "blur"}],
      creditRatingRule: [{test: validCreditRating, trigger: "blur"}],
      ifShowMore: false,
      isLogOff: false,
      isGroupOff: false,
      dictMap: new Map(),
      collType: "2",
      certType: "",
      isUpdateMainGroupCus: false,
      isShareCustCropBranch: true,
      param: null,
      rows: null,
      tempShowExcelTemplateWin: false,
      ifDisabledExport: false,
    };
  },
  methods: {
    //查询客户信息
    queryCustMessage() {
      this.showCustMessageWin = true;
    },
    //客户信息查询框关闭
    custCorpWinClose() {
      this.showCustMessageWin = false;
    },
    //根据客户信息查询框所选数据进行赋值
    custCorpSelectSubmit(info) {
      // this.$refs.formItem.resetFields();
      this.addForm.currentMergeCustName = info.custName;
      this.addForm.currentMergeCustNo = info.custNo;
      this.showCustMessageWin = false;
    },
    queryCustAcctNo() {
      let list = this.$refs.datagrid.selects;
      let custNo = list[0].custNo;
      this.showCustAcctNoWin = true;
    },
    showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },
    //根据客户账号查询框所选数据进行赋值
    custAcctNoSelectSubmit(info) {
        this.eManagerForm.custAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
    },
    getButtonAuth() {
      let id = JSON.parse(window.sessionStorage.getItem("curMenu")).id;
      post({authId: id}, "/sm/auth/buttonAuth/func_queryButtonByAuthId").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          let retMsg = res.data.retMsg;
          if (retCode === "000000") {
            this.btnAuth = JSON.parse(res.data.retData);
            this.isShowToolbar = true;
          } else {
            this.$msgTip.error(this, {info: retMsg});
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
    },
    addFormReset() {
      this.$refs.addForm.resetFields();
      this.addForm.id = "";
      this.addForm.currentMergeCustName = "";
      this.addForm.currentMergeCustNo = "";
      this.addForm.custPartnerType = "RC01";
      this.addForm.collType = "1";
      this.addForm.orgCode = "";
      this.addForm.certType = "";
      this.addForm.mainGroupCustNo = "";
      this.addForm.isMainGroupCus = "";
      this.addForm.isGroupCus = "";
      this.addForm.socCode = "";
      this.isUpdateMainGroupCus = false;
    },
    getShowCreateBrchNo() {
      let paramKey = "bm.cust.is_share_cust_corp_branch";
      post({paramKey: paramKey}, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            let param = res.data.retData;
            if (param === "0") {
              this.isShareCustCropBranch = false;
              this.formItem.createBrchNo = JSON.parse(window.sessionStorage.getItem("userInfo")).brchNo;
              this.formItem.createBrchName = JSON.parse(window.sessionStorage.getItem("userInfo")).brchName;
            } else {
              this.formItem.createBrchNo = "";
              this.formItem.createBrchName = "";
            }
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg});
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
    },
    addFormResetWithOutCollType() {
      let collType1 = this.addForm.collType;
      this.$refs.addForm.resetFields();
      this.addForm.collType = collType1;
      this.addForm.isAgencyCust = "0";
      this.addForm.custPartnerType = "RC01";
      this.isUpdateMainGroupCus = false;
    },
    addFormResetWithOutCustNo() {
      let tmpFrom = this.$refs.addForm;
      if (this.addForm.collType === "2") {
        if (this.addForm.custNo != null && this.addForm.custNo !== "") {
          this.addFormReset();
          this.addForm.certType = tmpFrom.certType;
          this.addForm.custName = tmpFrom.custName;
          if (this.addForm.certType === "1") {
            this.addForm.orgCode = tmpFrom.orgCode;
          }
          if (this.addForm.certType === "2") {
            this.addForm.socCode = tmpFrom.socCode;
          }
        }
      } else if (this.addForm.collType === "1") {
        let custNo = this.addForm.custNo;
        if (this.addForm.custName != null && this.addForm.custName !== "") {
          this.addFormReset();
          this.addForm.custNo = custNo;
        }
      }
    },
    handleAddForm(str) {
      this.type = str;
      this.readonly = false;
      this.isRequired = true;
      if (this.type === "modify" || this.type === "view") {
        let list = this.$refs.datagrid.selects;
        if (!list || list.length !== 1) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
          return;
        }
        if (this.type === "modify") {
          let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
          if (userInfo.brchNo !== list[0].createBrchNo) {
            this.$msgTip.info(this, {info: "只有创建机构能进行此操作"});
            return;
          }
        }
        if (this.type === "modify") {
          this.readonly = true;
        }
        if (this.type === "view") {
          this.isRequired = false;
        }
        this.$nextTick(() => {
          this.queryObjById(list[0].id);
        });
      } else if (this.type === "add" || this.type === "coll") {
        this.$nextTick(() => {
          this.addFormReset();
          this.addForm.custPartnerType = "RC01";
        });
      }
      this.addOrEditWin = true;
    },
    handleMergeCustNoForm() {
      let list = this.$refs.datagrid.selects;
      if (list == null || list.length <= 0) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
        return;
      }
      if (list.length > 1) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.onlyChooseOneData")});
        return;
      }
      this.queryObjById(list[0].id);
      this.selectCustNo = list[0].custNo;
      this.custNoMergeWin = true;
    },
    queryObjById(id) {
      post({id: id}, "/bm/cust/corp/custCorp/func_queryCustCorpById").then(res => {
        this.submitFlag = false;
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.addForm.id = res.data.retData.id;
            this.addForm.custNo = res.data.retData.custNo;
            this.addForm.custName = res.data.retData.custName;
            this.addForm.custMgrNo = res.data.retData.custMgrNo;
            this.addForm.custMgrName = res.data.retData.custMgrName;
            this.addForm.loanCtrctNo = res.data.retData.loanCtrctNo;
            // this.addForm.orgCode = res.data.retData.orgCode;
            this.addForm.activeFlag = res.data.retData.activeFlag;
            this.addForm.custPartnerType = res.data.retData.custPartnerType;
            this.addForm.isGroupCus = res.data.retData.isGroupCus;
            this.addForm.isMainGroupCus = res.data.retData.isMainGroupCus;
            if (res.data.retData.isMainGroupCus === "1") {
              this.isUpdateMainGroupCus = true;
            } else {
              this.isUpdateMainGroupCus = false;
            }
            this.addForm.mainGroupCustNo = res.data.retData.mainGroupCustNo;
            this.addForm.custAddr = res.data.retData.custAddr;
            this.addForm.custFax = res.data.retData.custFax;
            this.addForm.phone = res.data.retData.phone;
            this.addForm.createBrchNo = res.data.retData.createBrchNo;
            this.addForm.createBrchName = res.data.retData.createBrchName;
            this.addForm.operBrchNo = res.data.retData.operBrchNo;
            this.addForm.operBrchName = res.data.retData.operBrchName;
            this.addForm.operTellerNo = res.data.retData.operTellerNo;
            this.addForm.operTellerName = res.data.retData.operTellerName;
            this.addForm.custBrchId = res.data.retData.custBrchId;
            this.addForm.transplantFlag = res.data.retData.transplantFlag;
            this.addForm.industryCategory = res.data.retData.industryCategory;
            this.addForm.corpScale = res.data.retData.corpScale;
            this.addForm.socCode = res.data.retData.socCode;
            this.addForm.isArc = res.data.retData.isArc;
            this.addForm.isGreenCorp = res.data.retData.isGreenCorp;
            this.addForm.area = res.data.retData.area;
            this.addForm.reserve1 = res.data.retData.reserve1;
            this.addForm.reserve2 = res.data.retData.reserve2;
            this.addForm.reserve3 = res.data.retData.reserve3;
            this.addForm.createTime = res.data.retData.createTime;
            this.addForm.updateTime = res.data.retData.updateTime;
            this.addForm.multipleEmail = res.data.retData.multipleEmail;
            this.addForm.lccCode = res.data.retData.lccCode;
            this.addForm.leiCode = res.data.retData.leiCode;
            this.addForm.mainBusiAddr = res.data.retData.mainBusiAddr;
            this.addForm.isTechnologyCorp = res.data.retData.isTechnologyCorp;
            this.addForm.corpNature = res.data.retData.corpNature;
            this.addForm.creditRating = res.data.retData.creditRating;
            this.addForm.creditRatingMain = res.data.retData.creditRatingMain;
            this.addForm.creditRatgDueDt = res.data.retData.creditRatgDueDt === null ? "" : res.data.retData.creditRatgDueDt.toString();
            this.addForm.corpLegalName = res.data.retData.corpLegalName;
            this.addForm.corpLegalCertType = res.data.retData.corpLegalCertType;
            this.addForm.corpLegalCertNo = res.data.retData.corpLegalCertNo;
            this.addForm.isSignCommitmentLetter = res.data.retData.isSignCommitmentLetter === null ? "0" : res.data.retData.isSignCommitmentLetter;
            this.addForm.signTellerNo = res.data.retData.signTellerNo;
            this.addForm.signBrchNo = res.data.retData.signBrchNo;
          } else {
            // this.submitMsg = "查询失败";
            this.$msgTip.error(this, {info: res.data.retMsg});
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });

    },
    unDisabled() {
      this.deletDisabled = false;
      this.emanagerDisabled = false;
      this.signEmanagerDisabled = false;
      this.signCommitmentLetterDisabled = false;
      this.isLogOn = false;
      this.isLogOff = false;
      this.isGroupOff = false;
    },
    handleSelectClick(arr, selectInx) {
      let array = this.$refs.datagrid.selects;
      this.isGroupOff = false;
      this.emanagerDisabled = false;
      this.signEmanagerDisabled = false;
      this.signCommitmentLetterDisabled = false;
      if (array.length === 0) {
        this.isLogOn = false;
        this.isLogOff = false;
        this.deletDisabled = false;
        return false;
      }
      let activeFlag = array[0].activeFlag;
      for (let i = 0; i < array.length; i++) {
        if (array[i].isGroupCus !== '1' || array[i].isMainGroupCus !== '1') {
          this.isGroupOff = true;
        }
        if (array[i].operStatus === '4' || array[i].signStatus === '0') {
          this.emanagerDisabled = true;
        }
        if (array[i].operStatus === '4'  || array[i].signStatus === '1' || array[i].activeFlag === '0') {
          this.signEmanagerDisabled = true;
        }
        if ( array[i].isSignCommitmentLetter === '1') {
          this.signCommitmentLetterDisabled = true;
        }
      }
      for (let i = 1; i < array.length; i++) {
        if (activeFlag !== array[i].activeFlag) {
          this.isLogOn = true;
          this.isLogOff = true;
          this.disabledFlag = true;
          return true;
        }
      }
      this.deletDisabled = false;
      if (activeFlag === "1") {
        this.isLogOff = true;
        this.isLogOn = false;
      } else if (activeFlag === "0") {
        this.isLogOff = false;
        this.isLogOn = true;
      }
      return true;
    },
    resetSelect() {
      let array = this.$refs.datagrid.selects;
      this.isGroupOff = false;
      this.emanagerDisabled = false;
      this.signEmanagerDisabled = false;
      this.signCommitmentLetterDisabled = false;
      if (array.length === 0) {
        this.isLogOn = false;
        this.isLogOff = false;
        this.deletDisabled = false;
        return false;
      }
      let activeFlag = array[0].activeFlag;
      for (let i = 0; i < array.length; i++) {
        if (array[i].isGroupCus !== '1' || array[i].isMainGroupCus !== '1') {
          this.isGroupOff = true;
        }
        if ( array[i].operStatus === '4' || array[i].signStatus === '0') {
          this.emanagerDisabled = true;
        }
        if ( array[i].operStatus === '4' || array[i].signStatus === '1'|| array[i].activeFlag === '0') {
          this.signEmanagerDisabled = true;
        }
        if ( array[i].isSignCommitmentLetter === '1') {
          this.signCommitmentLetterDisabled = true;
        }
      }
      for (let i = 1; i < array.length; i++) {
        if (activeFlag !== array[i].activeFlag) {
          this.isLogOn = true;
          this.isLogOff = true;
          this.disabledFlag = true;
          return true;
        }
      }
      this.deletDisabled = false;
      if (activeFlag === "1") {
        this.isLogOff = true;
        this.isLogOn = false;
      } else if (activeFlag === "0") {
        this.isLogOff = false;
        this.isLogOn = true;
      }
      return true;
    },
    formSearch() {
      this.$refs.datagrid.selects = [];
      this.$refs.datagrid.selectIds = [];
      this.unDisabled();
      this.$refs.datagrid.dataChange(1);
    },
    formSearchReset() {
      this.getShowCreateBrchNo();
      this.$refs.formItem.resetFields();
    },
    submitForm() {
      let btnType = this.type;
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          // 新增或修改的url
          let url = this.type === "add" ? "/bm/cust/corp/custCorp/func_insertCustCorp" : "/bm/cust/corp/custCorp/func_updateCustCorp";
          if (this.type === "coll") {
            url = "/bm/cust/corp/custCorp/func_collCustCorp";
          }
          this.submitFlag = true;
          post(this.addForm, url).then(res => {
            this.submitFlag = false;
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$msgTip.success(this);
                this.editWinClose();
                this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                this.$refs.datagrid.selects = [];
                this.$refs.datagrid.selectIds = [];
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
    mergeCustNoSubmit() {
      // 客户号归并url
      let url = "/bm/cust/corp/custCorp/func_mergeCustNo";
      post(this.addForm, url).then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.$msgTip.success(this);
            this.editWinClose();
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            this.$refs.datagrid.selects = [];
            this.$refs.datagrid.selectIds = [];
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg});
          }
        }
      });
    },
    checkMergeCustNoIsBusinessSubmitForm() {
      // 客户号归并校验url
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          // 新增或修改的url
          let url = "/bm/cust/corp/custCorp/func_checkMergeCustNoIsBusiness";
          post(this.addForm, url).then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                if (res.data.retMsg !== null) {
                  this.$hMsgBox.confirm({
                    title: this.$t("m.i.common.confirm"),
                    content: res.data.retMsg,
                    onOk: () => {
                      this.mergeCustNoSubmit();
                      this.addFormReset();
                      this.custNoMergeWin = false;
                      this.editWinClose();
                      this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                      this.$refs.datagrid.selects = [];
                      this.$refs.datagrid.selectIds = [];
                    },
                    onCancel: () => {
                      this.addFormReset();
                      this.custNoMergeWin = false;
                    }
                  });
                } else {
                  this.mergeCustNoSubmit();
                  this.addFormReset();
                  this.custNoMergeWin = false;
                  this.editWinClose();
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
                }
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
    async handleComfirm(oper) {
      let list = this.$refs.datagrid.selects;
      if (list != null && list.length > 0) {
        let errorCurp = "";
        let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
        for (let i = 0; i < list.length; i++) {
          if (userInfo.brchNo !== list[i].createBrchNo) {
            errorCurp += list[i].custNo + ",";
          }
        }
        if (errorCurp !== "") {
          this.$msgTip.error(this, {info: "客户号：" + errorCurp.substring(0, errorCurp.length - 1) + "，只有创建机构能进行此操作"});
          return;
        }

        let content = "";
        let url = "";
        if (oper === "logoff") {
          let val = await this.validateCustBeforeLogOff();
          if (!val) {
            return;
          }
          content = "注销";
          url = "/bm/cust/corp/custCorp/func_deleteCustCorp";
        } else if (oper == "logon") {
          content = "撤销注销";
          url = "/bm/cust/corp/custCorp/func_logonCustCorp";
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "是否要" + content + "?",
          onOk: () => {
            this.handlelog(url, content);
          }
        });
      } else {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
      }

    },
    handlelog(url, content) {
      post({ids: this.$refs.datagrid.selectIds}, url).then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            // this.$hMessage.success(content+'成功')
            this.$msgTip.success(this);
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            this.$refs.datagrid.selectIds = [];
            this.$refs.datagrid.selects = [];
          } else {
            // this.submitMsg = content+'失败';
            this.$msgTip.error(this, {info: res.data.retMsg});
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
    },
    async validateCustBeforeLogOff() {
      // 校验，集团总部不允许注销
      let errorMsg = "";
      let list = this.$refs.datagrid.selects;
      for (let i = 0; i < list.length; i++) {
        if (list[i].isMainGroupCus == "1") {
          errorMsg += list[i].custName + ",";
        }
      }
      if (errorMsg != "") {
        this.$msgTip.error(this, {info: "客户：" + errorMsg + "为集团总部，请先解除其集团关系再进行注销"});
        return false;
      }
      // 校验，查询客户下账户数量，客户数量不为0，则不允许注销
      return post({ids: this.$refs.datagrid.selectIds}, "/bm/cust/corp/custCorp/func_countAcctByCustIds").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            let num = res.data.retData;
            if (num > 0) {
              this.$msgTip.info(this, {info: "客户下仍有" + num + "条账户信息未注销，请注销后再进行操作"});
              return false;
            } else {
              return true;
            }
          } else {
            // this.submitMsg = content+'失败';
            this.$msgTip.error(this, {info: res.data.retMsg});
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
    },
    // 展现客户下所属账户
    handleShowAcct() {
      let list = this.$refs.datagrid.selects;
      if (list == null || list.length <= 0) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
        return;
      }
      if (list.length > 1) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.onlyChooseOneData")});
        return;
      }
      this.selectCustNo = list[0].custNo;
      this.showCustAcctWin = true;
    },
    signCommitmentLetter(){
      let list = this.$refs.datagrid.selects;
      if (list == null || list.length <= 0) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
        return;
      }
      if (list.length > 1) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.onlyChooseOneData")});
        return;
      }
      this.selectCustNo = list[0].custNo;
      let idList = [];
      idList.push(list[0].id);
      this.$hMsgBox.confirm({
        title: this.$t("m.i.common.confirm"),
        content: this.$t("确认对该企业签署承诺函吗") + "?",
        onOk: () => {
          let custNo = this.selectCustNo;
          let url = "/banks/szbank/bm/cust/corp/custCorp/func_signCommitmentLetter";
          post({ custNo : custNo }, url).then(res => {
            if (res) {
              let retCode = res.data.retCode
              if (retCode == "000000") {
                this.$msgTip.success(this);
                //承诺函签订成功 个性化点  打印凭证
                this.printVoucher(idList);
                this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                this.handleClose();
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
            }
          });
        }
      });
    },
    showCustAcctWinClose() {
      this.showCustAcctWin = false;
    },
    // 展示集团总部下的集团客户
    handleShowGroup() {
      let list = this.$refs.datagrid.selects;
      if (list == null || list.length <= 0) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
        return;
      }
      if (list.length > 1) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.onlyChooseOneData")});
        return;
      }
      let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
      if (userInfo.brchNo != list[0].createBrchNo) {
        this.$msgTip.error(this, {info: "只有创建机构能进行此操作"});
        return;
      }
      if (list[0].isMainGroupCus !== "1") {
        this.$msgTip.error(this, {info: "该客户不是集团总部，无法进行此操作"});
        return;
      }
      this.showMainGroupCustNo = list[0].custNo;
      this.showCustCorpWin = true;
    },
    // 展示集团总部下的集团客户
    handleShowGroupForBreak() {
      this.showMainGroupCustNo = this.addForm.custNo;
      this.showCustCorpWin = true;
    },
    // 关闭集团客户窗口
    showCustCorpWinClose(isRemoveAll) {
      if (isRemoveAll === "1") {
        this.addForm.isGroupCus = "0";
        this.addForm.isMainGroupCus = "0";
        this.isUpdateMainGroupCus = false;
        this.$refs.breakGroupRelation.isRemoveAll = "";
      }
      this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
      this.showCustCorpWin = false;
    },
    // 展示集团总部客户选择界面
    showMainCust() {
      this.showMainCustWin = true;
    },
    clearMainCust() {
      this.addForm.mainGroupCustNo = "";
      this.mainGroupCustName = "";
    },
    // 选择集团客户界面关闭
    showMainCustWinClose() {
      this.showMainCustWin = false;
    },
    // 选择集团总部客户
    selectMainGroupCust(info) {
      this.addForm.mainGroupCustNo = info.custNo;
      this.mainGroupCustName = info.custName;
      this.showMainCustWin = false;
    },
    // 展示客户经理选择界面
    showCusManager() {
      this.showCustManagerWin = true;
    },
    clearCusManager() {
      this.addForm.custMgrNo = "";
      this.addForm.custMgrName = "";
    },
    clearMergeCustInfo() {
      this.addForm.currentMergeCustNo = "";
      this.addForm.currentMergeCustName = "";
    },
    // 选择客户经理界面关闭
    showCustManagerWinClose() {
      this.showCustManagerWin = false;
    },
    // 选择客户经理
    custManagerSelect(info) {
      this.addForm.custMgrNo = info.custMgrNo;
      this.addForm.custMgrName = info.custMgrName;
      this.showCustManagerWin = false;
    },
    groupCusReset() {
      if (this.addForm.isGroupCus == "0" || this.addForm.isGroupCus == null || this.addForm.isGroupCus == "") {
        this.addForm.isMainGroupCus = "";
        this.addForm.mainGroupCustNo = "";
      }
    },
    groupCusNoReset() {
      this.addForm.mainGroupCustNo = "";
    },
    getIsShowMergeCustButton() {
      //按钮权限查询 控制按钮显隐
      let id = JSON.parse(window.sessionStorage.getItem("curMenu")).id;
      post({authId: id}, "/sm/auth/buttonAuth/func_queryButtonByAuthId").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          let retMsg = res.data.retMsg;
          if (retCode === "000000") {
            this.btnAuth = JSON.parse(res.data.retData);
            if (this.btnAuth.isShowAddBtn === undefined ? false : this.btnAuth.isShowAddBtn.isShow) {
              this.CustMergeIsShow = true;
            } else {
              this.CustMergeIsShow = false;
            }
          } else {
            this.$msgTip.error(this, {info: retMsg});
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
    },
    collCustCorpInfo() {
      if (this.addForm.collType === "") {
        this.$msgTip.error(this, {info: "请输入同步方式"});
        return;
      }
      if (this.addForm.collType === "1" && this.addForm.custNo === "") {
        this.$msgTip.error(this, {info: "请输入客户号"});
        return;
      }
      if (this.addForm.collType === "2" && this.addForm.custName === "") {
        this.$msgTip.error(this, {info: "请输入客户名称"});
        return;
      }
      if (this.addForm.collType === "2" && this.addForm.certType === "") {
        this.$msgTip.error(this, {info: "请输入证件类型"});
        return;
      }
      if (this.addForm.collType === "2" && this.addForm.certType === "1" && this.addForm.orgCode === "") {
        this.$msgTip.error(this, {info: "请输入组织机构代码"});
        return;
      }
      if (this.addForm.collType === "2" && this.addForm.certType === "2" && this.addForm.socCode === "") {
        this.$msgTip.error(this, {info: "请输入社会信用代码"});
        return;
      }
      if (this.addForm.collType === "2" && this.addForm.certType === "1") {
        let re = /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{1}$/;
        if (!re.test(this.addForm.orgCode)) {
          this.$msgTip.error(this, {info: "非法输入，组织机构代码由8位数字或字母加上一个\"-\"再加一位数字或字母组成"});
          return;
        }
      }
      if (this.addForm.collType === "2" && this.addForm.certType === "2") {
        let re = /([a-zA-Z0-9]{2})([0-9]{6})([a-zA-Z0-9]{10})/;
        if (!re.test(this.addForm.socCode)) {
          this.$msgTip.error(this, {info: "非法输入，社会信用代码由两位数字或字母，加六位数字，加十位数字或字母组成，且为18位"});
          return;
        }
      }
      let url = "/bm/cust/corp/custCorp/func_getCollCustCorpInfo";
      post({
        custNo: this.addForm.custNo, collType: this.addForm.collType, custName: this.addForm.custName,
        certType: this.addForm.certType, socCode: this.addForm.socCode, orgCode: this.addForm.orgCode
      }, url).then(res => {
        this.submitFlag = false;
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.$msgTip.success(this);
            let corpData = res.data.retData;
            this.addForm.orgCode = corpData.orgCode;
            this.addForm.socCode = corpData.socCode;
            this.addForm.custNo = corpData.custNo;
            this.addForm.custName = corpData.custName;
            this.addForm.legalNo = corpData.legalNo;
            this.addForm.custMgrNo = corpData.custMgrNo;
            this.addForm.custMgrName = corpData.custMgrName;
            this.addForm.loanCtrctNo = corpData.loanCtrctNo;
            this.addForm.activeFlag = corpData.activeFlag;
            this.addForm.custPartnerType = corpData.custPartnerType;
            this.addForm.isGroupCus = corpData.isGroupCus;
            this.addForm.isMainGroupCus = corpData.isMainGroupCus;
            this.addForm.mainGroupCustNo = corpData.mainGroupCustNo;
            this.addForm.custAddr = corpData.custAddr;
            this.addForm.custFax = corpData.custFax;
            this.addForm.phone = corpData.phone;
            this.addForm.createBrchNo = corpData.createBrchNo;
            this.addForm.createBrchName = corpData.createBrchName;
            this.addForm.operBrchNo = corpData.operBrchNo;
            this.addForm.operBrchName = corpData.operBrchName;
            this.addForm.operTellerNo = corpData.operTellerNo;
            this.addForm.operTellerName = corpData.operTellerName;
            this.addForm.custBrchId = corpData.custBrchId;
            this.addForm.transplantFlag = corpData.transplantFlag;
            this.addForm.industryCategory = corpData.industryCategory;
            this.addForm.corpScale = corpData.corpScale;
            let re = /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{1}$/;
            if (corpData.orgCode != null && corpData.orgCode !== "" && re.test(corpData.orgCode)) {
              this.addForm.orgCode = corpData.orgCode;
            } else {
              if (corpData.socCode != null && corpData.socCode.length === 18) {
                this.addForm.orgCode = corpData.socCode.substring(8, 16) + "-" + corpData.socCode.substring(16, 17);
              }
            }
            this.addForm.isArc = corpData.isArc;
            this.addForm.isGreenCorp = corpData.isGreenCorp;
            this.addForm.area = corpData.area;
            this.addForm.multipleEmail = corpData.multipleEmail;
            this.addForm.lccCode = corpData.lccCode;
            this.addForm.leiCode = corpData.leiCode;
            this.addForm.mainBusiAddr = corpData.mainBusiAddr;
            this.addForm.isTechnologyCorp = corpData.isTechnologyCorp;
            this.addForm.corpNature = corpData.corpNature;
            this.addForm.creditRating = corpData.creditRating;
            this.addForm.creditRatingMain = corpData.creditRatingMain;
            this.addForm.creditRatgDueDt = corpData.creditRatgDueDt === null ? "" : corpData.creditRatgDueDt.toString();
            this.addForm.corpLegalName = corpData.corpLegalName;
            this.addForm.corpLegalCertType = corpData.corpLegalCertType;
            this.addForm.corpLegalCertNo = corpData.corpLegalCertNo;
            this.addForm.isSignCommitmentLetter = res.data.retData.isSignCommitmentLetter === null ? "0" : res.data.retData.isSignCommitmentLetter;
            this.addForm.signTellerNo = res.data.retData.signTellerNo;
            this.addForm.signBrchNo = res.data.retData.signBrchNo;
            this.addForm.reserve1 = corpData.reserve1;
            this.addForm.reserve2 = corpData.reserve2;
            this.addForm.reserve3 = corpData.reserve3;
            this.addForm.createTime = corpData.createTime;
            this.addForm.updateTime = corpData.updateTime;
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg});
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }

      });
    },

    editWinClose() {
      this.addFormReset();
      this.addOrEditWin = false;
    },
    mergeCustNoWinClose() {
      this.addFormReset();
      this.custNoMergeWin = false;
    },

    certTypeChange() {
      this.addForm.orgCode = "";
      this.addForm.socCode = "";
    },

    modifyPrompt() {
      if (this.isUpdateMainGroupCus) {
        this.$msgTip.info(this, {info: "对不起！解除集团关系才能修改集团总部的集团性质。"});
      }
    },
    signEManager() {
      let list = this.$refs.datagrid.selects;
      if (!list || list.length === 0) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
        return;
      }
      if (list.length > 1) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.onlyChooseOneData")});
        return;
      }
      let obj = list[0];
      if (obj.corpLegalCertNo == null || obj.corpLegalCertNo === ""
      || obj.corpLegalCertType == null || obj.corpLegalCertType === ""
      || obj.corpLegalName == null || obj.corpLegalName === "") {
        this.$msgTip.info(this, {info: "未维护法人代表信息，不允许签约E管家"});
        return;
      }
      this.validateSign(obj);
    },
    modEManager() {
      this.eManagerType = "modify";
      let list = this.$refs.datagrid.selects;
      if (!list || list.length === 0) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
        return;
      }
      if (list.length > 1) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.onlyChooseOneData")});
        return;
      }
      this.eManagerFormReset();
      this.queryEmanagerSign(list[0]);
      this.addOrEditEManagerWin = true;
      this.eManagerType = "modify";
    },
    validateSign(obj) {
      if (!obj) {
        this.$msgTip.info(this, {info: "客户信息不能为空"});
        return;
      }
      let url = "/banks/szbank/bm/cust/corp/custCorp/func_validateElecSignInfo";
      post({custNo:obj.custNo}, url).then(res => {
        if (res) {
          let msg = res.data.retMsg;
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.eManagerFormReset();
            this.queryEmanagerSign(obj);
            this.addOrEditEManagerWin = true;
            this.eManagerType = "add";
          } else {
            this.$msgTip.error(this, { info: msg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
    queryEmanagerSign(obj) {
      if (!obj) {
        this.$msgTip.info(this, {info: "客户信息不能为空"});
        return;
      }
      this.submitEManagerFlag = false;
      let url = "/banks/szbank/bm/cust/corp/custCorp/func_queryEmanagerSignInfo";
      post({custNo:obj.custNo}, url).then(res => {
        if (res) {
          let msg = res.data.retMsg;
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            let retData = res.data.retData;
            if (retData) {
              this.eManagerForm.operatorName = retData.operatorName;
              this.eManagerForm.operatorPhoneNo = retData.operatorPhoneNo;
              this.eManagerForm.operatorCertType = retData.operatorCertType;
              this.eManagerForm.operatorCertNo = retData.operatorCertNo;
              this.eManagerForm.operatorAddr = retData.operatorAddr;
              this.eManagerForm.corpLegalName = retData.corpLegalName;
              this.eManagerForm.corpLegalCertType = retData.corpLegalCertType;
              this.eManagerForm.corpLegalCertNo = retData.corpLegalCertNo;
              this.eManagerForm.corpLegalPhoneNo = retData.corpLegalPhoneNo;
              this.eManagerForm.corpLegalAddr = retData.corpLegalAddr;
              this.eManagerForm.custAcctNo = retData.custAcctNo;
              this.eManagerForm.custNo = obj.custNo;
            } else {
              this.eManagerForm.operatorName = "";
              this.eManagerForm.operatorPhoneNo = "";
              this.eManagerForm.operatorCertType = "";
              this.eManagerForm.operatorCertNo = "";
              this.eManagerForm.operatorAddr = "";
              this.eManagerForm.corpLegalPhoneNo = "";
              this.eManagerForm.corpLegalAddr = "";
              this.eManagerForm.custAcctNo = "";
              this.eManagerForm.custNo = obj.custNo;
            }
          } else {
            this.$msgTip.error(this, { info: msg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },

    removeEManager() {
      let list = this.$refs.datagrid.selects;
      if (!list || list.length === 0) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
        return;
      }
      let custNolist = [];
      for(let i = 0; i< list.length; i++) {
        custNolist.push(list[i].custNo);
      }
      this.$hMsgBox.confirm({
        title: this.$t("m.i.common.confirm"),
        content: "是否要解约E管家?",
        onOk: () => {
          let obj = list[0]
          let url = "/banks/szbank/bm/cust/corp/custCorp/func_addEmanagerSignInfo";
          post({custNos:custNolist,operType:'3'}, url).then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$msgTip.success(this);
                this.$refs.datagrid.dataChange(1);
                this.$refs.datagrid.selects = [];
                this.resetSelect();
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
    submitEmanagerForm() {
      this.$refs["eManagerForm"].validate(valid => {
        if (valid) {
          let list = this.$refs.datagrid.selects;
          let submitForm = Object.assign(this.eManagerForm, {custNo: list[0].custNo, custName: list[0].custName})
          submitForm.operType =  this.eManagerType === "add" ? "1":"2";
          let url = "/banks/szbank/bm/cust/corp/custCorp/func_addEmanagerSignInfo";
          this.submitEManagerFlag = true;
          post(submitForm, url).then(res => {
            if (res) {
              this.submitEManagerFlag = false;
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$msgTip.success(this);
                this.editEditEManagerWinClose();
                this.$refs.datagrid.dataChange(1);
                this.$refs.datagrid.selects = [];
                this.resetSelect();
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
    eManagerFormReset() {
      this.$nextTick(() => {
        this.$refs.eManagerForm.resetFields();
      });
    },
    editEditEManagerWinClose() {
      this.eManagerFormReset();
      this.addOrEditEManagerWin = false;
      this.eManagerType = "";
    },
    showExcelTemplateWinClose() {
      this.tempShowExcelTemplateWin = false;
    },
    //清单导出
    tempShowExcelTemplateWinOpen() {
      this.param = "szbankCustCorpDataInfo";
      if (this.$refs.datagrid.selectIds.length != 0) {
        this.rows = this.$refs.datagrid.selectIds.length;
      } else {
        this.rows = this.$refs.datagrid.total;
      }
      this.tempShowExcelTemplateWin = true;
    },

    //清单导出
    exportList(field, exportType) {
      let exportUrl = window.LOCAL_CONFIG.API_HOME + "/bm/cust/corp/func_exportCustCorpListExcel";
      let options = {
        params: {}
      };
      if (this.$refs.datagrid.selectIds.length !== 0) {
        options.params.ids = this.$refs.datagrid.selectIds;
        options.pageSize = this.$refs.datagrid.selectIds.length;
      } else {
        options.params = this.formItem;
        options.pageSize = this.$refs.datagrid.total;
      }
      exportList(this, this.param, field, exportType, exportUrl, options);
    },
    printVoucher(idList){
      let param = {listIds: idList};
      let params = {templateName: "SZBANK004", params: JSON.stringify(param),listIds: idList,saveFlag:1};
      this.$print.vouchTemplatePrint(this, {
        params: params,
        callback: () => {
          this.$emit("printSuccessCallback", "");
        },
        errorCallback: () => {

        }
      });
    },
  },

  mounted() {
    this.getIsShowMergeCustButton();
    this.getDictListByGroups("CorpScale,Yon,partnerType,Province,CertTypeEmanager,Industry,CustCollType,CertificateCodeType,CpesCorpNature,CertType,CertificateType").then(res => {
      this.corpScaleList = res.get("CorpScale");
      // 不需要这个，因为可选择的发起方，全部默认为企业
      // res.get("partnerType");
      this.isList = res.get("Yon");
      this.isOffList = res.get("Yon");
      this.areaList = res.get("Province");
      this.industryCategoryList = res.get("Industry");
      this.collTypeList = res.get("CustCollType");
      this.certTypeList = res.get("CertificateCodeType");
      this.corpNatureList = res.get("CpesCorpNature");
      this.corpLegalCertTypeList = res.get("CertType");
      this.certificateTypeList = res.get("CertTypeEmanager");
      this.signCommitmentLetterList = res.get("Yon");
      this.dictMap = res.get("map");
    });
  },
  created() {
    this.getButtonAuth();
    this.getShowCreateBrchNo();
  }
};
</script>

<style scoped>

</style>
