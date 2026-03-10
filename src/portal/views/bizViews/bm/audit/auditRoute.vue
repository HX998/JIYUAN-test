<template>
  <div class="layout">
    <div v-show="auditMain">
      <span name="flex" class="layout-menu-wrapper">
        <h-col span="24">
          <div>
            <div class="h-form-search-box">
              <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
                <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                  <h-form-item :label="$t('m.i.bm.auditRouteName')" prop="auditRouteName">
                    <h-input v-model="formItem.auditRouteName"></h-input>
                  </h-form-item>
                  <show-product v-model="formItem.auditProdName" :label="$t('m.i.bm.auditProdName')" prop="auditProdName" className="h-form-long-label"
                                :clearProduct="productNameClear" clearValTag="query" @productSelectedChange="productSelectedChange($event, 'query')"></show-product>
                  <h-form-item :label="$t('m.i.bm.isCommit')" prop="isCommit">
                    <h-radio-group v-model="formItem.isCommit">
                      <h-radio label="noIssue" @on-click="noIssueButton">
                        <span>未发布</span>
                      </h-radio>
                      <h-radio label="hasIssue" @on-click="hasIssueButton">
                        <span>已发布</span>
                      </h-radio>
                    </h-radio-group>
                  </h-form-item>
                  <h-form-item class="h-form-operate">
                    <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                    <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                  </h-form-item>
                </h-form>
              </h-panel>

              <h-datagrid
                  :columns="columns"
                  highlight-row
                  :bindForm="formItem"
                  url="/bm/audit/auditRoute/func_pageQueryAuditRouteList"
                  :onCurrentChange="onCurrentChange"
                  :onCurrentChangeCancel="onCurrentChangeCancel"
                  ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="handleForm('add')" :disabled="hasIssueDisabled">{{$t('m.i.bm.addRoute')}}</h-button>
                  <h-button type="primary" @click="handleForm('modify')" :disabled="hasIssueDisabled">{{$t('m.i.bm.modifyRoute')}}</h-button>
                  <h-button type="primary" @click="handleForm('duplicate')" :disabled="hasIssueDisabled">{{$t('m.i.bm.copyRoute')}}</h-button>
                  <h-button type="primary" @click="deleteRoute()" :disabled="hasIssueDisabled">{{$t('m.i.bm.deleteRoute')}}</h-button>
                  <h-button type="primary" @click="setRouteForm()">{{$t('m.i.bm.setRoute')}}</h-button>
                  <h-button type="primary" @click="releaseRouteForm('release')" :disabled="hasIssueDisabled">{{$t('m.i.bm.releaseRoute')}}
                  </h-button>
                  <h-button type="primary" @click="releaseRouteForm('cancel')"
                            :disabled="noIssueDisabled || this.formItem.isCommit === 'noIssue'">{{$t('m.i.bm.cacelReleaseRoute')}}
                  </h-button>
                </div>
              </h-datagrid>


              <!-- 点击新增/修改弹出框 -->
              <h-msg-box v-model="addOrEditWin" width="400" class="h-form-search-layer" :maximize="true"
                         :mask-closable="false">
                <p slot="header">
                  <span v-if="type==='add'">新增审批路线</span>
                  <span v-if="type==='modify'">修改审批路线</span>
                  <span v-if="type==='duplicate'">复制审批路线</span>
                </p>
                <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="1" class="h-form-search">
                  <h-form-item :label="$t('m.i.bm.auditRouteName')" prop="auditRouteName" required>
                    <h-input v-model="addOrEditForm.auditRouteName" placeholder="审批路线名称"></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType" required>
                    <h-select v-model="addOrEditForm.billType" placeholder="请选择" :readonly="isPayAudit">
                      <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass" required>
                    <h-select v-model="addOrEditForm.billClass" placeholder="请选择" :readonly="isPayAudit">
                      <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{ item.value }}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <show-product v-model="addOrEditForm.auditProdName" :label="$t('m.i.bm.auditProdName')" prop="auditProdName" required
                                :clearProduct="productNameClear" clearValTag="add" @productSelectedChange="productSelectedChange($event, 'add')"></show-product>
                  <h-form-item :label="$t('m.i.bm.auditProdNo')" prop="auditProdNo" required v-show="false">
                    <h-input v-model="addOrEditForm.auditProdNo" placeholder="" disabled></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.bm.auditRouteRiskType')" prop="auditRouteRiskType" required v-show="showAuditRiskTypeItem">
                    <h-select v-model="addOrEditForm.auditRouteRiskType" placeholder="请选择">
                      <h-option v-for="item in auditRouteRiskTypeList" :value="item.key" :key="item.key">{{ item.value }}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item label="是否复核指导利率" prop="isCheckGuideRate" required v-if="showCheckGuideTemp">
                    <h-select v-model="addOrEditForm.isCheckGuideRate" placeholder="请选择">
                      <h-option v-for="item in YonList" :value="item.key" :key="item.key">{{ item.value }}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.bm.auditUseType')" prop="auditType" required>
                    <h-select v-model="addOrEditForm.auditType" placeholder="请选择">
                      <h-option v-for="item in auditTypeList" :value="item.key" :key="item.key">{{ item.value }}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.bm.auditBrchStartLevel')" prop="auditBrchStartLevel" required
                               v-show="addOrEditForm.auditType === '1'">
                    <h-select v-model="addOrEditForm.auditBrchStartLevel" placeholder="请选择"
                              @on-change="handleBrchLevel()">
                      <h-option v-for="item in auditNodeBrchLevelList" :value="item.key" :key="item.key">{{ item.value}}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <!--<h-form-item :label="$t('m.i.bm.auditUseBrchName')" prop="auditUseBrchName" v-show="addOrEditForm.auditType==='2'"
                               :required="addOrEditForm.auditType==='2'">
                    <h-input v-model="addOrEditForm.auditUseBrchName" placeholder="请选择" icon="android-search"
                             @on-click="queryBrchNo('route')" readonly clearable @on-clear="queryBrchClear('station')"></h-input>
                  </h-form-item>-->
                  <show-branch v-model="addOrEditForm.auditUseBrchName" :label="$t('m.i.bm.auditUseBrchName')" prop="auditUseBrchName"
                               v-show="addOrEditForm.auditType==='2'" :required="addOrEditForm.auditType==='2'"
                               :showCheckBox="false" :msgBoxWin="addOrEditWin" title="机构名称" @brchNoChange="brchNoChange($event,'route')"
                               :brchNo.sync="addOrEditForm.auditUseBrchNo" :brchName.sync="addOrEditForm.auditUseBrchName">
                  </show-branch>
                  <h-form-item :label="$t('m.i.bm.auditUseBrchNo')" prop="auditUseBrchNo" v-show="false"
                               :required="addOrEditForm.auditType==='2'">
                    <h-input v-model="addOrEditForm.auditUseBrchNo" placeholder="指定使用机构" disabled></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.bm.auditRouteDesc')" prop="auditRouteDesc" :validRules="remarkRule">
                    <h-input v-model="addOrEditForm.auditRouteDesc" placeholder="审批路线描述" :maxLength="80"></h-input>
                  </h-form-item>
                </h-form>
                <div slot="footer">
                  <h-button type="ghost" @click="addOrEditWinClose()">{{$t("m.i.common.close")}}</h-button>
                  <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
                  <h-button type="primary" v-else-if="type !== 'duplicate'" @click="formAdd()">
                    {{$t("m.i.common.commit")}}
                  </h-button>
                  <h-button type="primary" v-else-if="type === 'duplicate'" @click="formAdd()">{{$t("m.i.bm.copy")}}</h-button>
                </div>
              </h-msg-box>

              <!--机构查询-->
              <!--<show-branch :showBranchWin="showBranchWin" title="机构查询" @brchNoChange="brchNoChange"
                           @showBranchWinClose="showBranchWinClose"></show-branch>-->
            </div>
          </div>
        </h-col>
      </span>
    </div>
    <div v-show="setAuditRoute" :style="{height: getHeight + 'px'}">
      <h-row name="flex" class="layout-menu-wrapper">
        <!-- 左侧树 -->
        <div class="page-header">
          <span class="tit">审批路线管理</span>
          <div class="f-r">
            <h-button type="ghost" class="btn-return" @click="backOne()">{{$t('m.i.common.goBack')}}</h-button>
          </div>
        </div>
        <h-col span="7" class="pr-10">
          <div class="approval-tree-wrap">
            <div class="tree-btn-wrap">
              <h-button type="ghost" size="small" @click="handleExpandTree(TreeData)" :disabled="isExpandDisabled">
                {{$t("m.i.common.expand")}}
              </h-button>
              <h-button type="ghost" size="small" @click="handleUnExpandTree(TreeData)" :disabled="isNotExpandDisabled">
                {{$t("m.i.common.noExpand")}}
              </h-button>
              <!--<h-button type="ghost" size="small" @click="backOne()">{{$t('m.i.common.goBack')}}</h-button>-->
            </div>
            <h-tree :data="TreeData" highlight-row ref="TreeData" @on-select-change="clickTreeDataChange()" @on-toggle-expand="toggleExpand"></h-tree>
          </div>
        </h-col>
        <!-- 右侧数据展示表格 -->
        <h-col span="17">
          <div class="text-wrap mb-10">
            <div class="text-header">
              <span class="tit" v-if="this.treeNodeType==='0'">审批路线信息</span>
              <span class="tit" v-if="this.treeNodeType==='1'">审批节点信息</span>
              <span class="tit" v-if="this.treeNodeType==='2'">审批岗位信息</span>
            </div>
            <div class="text-body">
              <h-row>
                <h-col span="12">
                  <h-row>
                    <h-col span="9" class="label">审批路线名称：</h-col>
                    <h-col span="15" class="val">{{setRouteFormItem.auditRouteName}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="12" v-show="this.treeNodeType==='0'">
                  <h-row>
                    <h-col span="9" class="label">{{$t('m.i.bm.auditProdName')}}：</h-col>
                    <h-col span="15" class="val">{{setRouteFormItem.auditProdName}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="12" v-show="this.treeNodeType==='0'">
                  <h-row>
                    <h-col span="9" class="label">{{$t('m.i.bm.auditProdNo')}}：</h-col>
                    <h-col span="15" class="val">{{setRouteFormItem.auditProdNo}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="12" v-show="this.treeNodeType==='0'">
                  <h-row>
                    <h-col span="9" class="label">审批路线使用模式：</h-col>
                    <h-col span="15" class="val">{{setRouteFormItem.auditType}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="12" v-show="this.treeNodeType==='0'">
                  <h-row>
                    <h-col span="9" class="label">审批起始机构级别：</h-col>
                    <h-col span="15" class="val">{{setRouteFormItem.auditBrchStartLevel}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="12" v-show="this.treeNodeType==='0'">
                  <h-row>
                    <h-col span="9" class="label">指定使用机构：</h-col>
                    <h-col span="15" class="val">{{setRouteFormItem.auditUseBrchName}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="12" v-show="this.treeNodeType==='0'">
                  <h-row>
                    <h-col span="9" class="label">指定使用机构号：</h-col>
                    <h-col span="15" class="val">{{setRouteFormItem.auditUseBrchNo}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="12" v-show="this.treeNodeType==='0'">
                  <h-row>
                    <h-col span="9" class="label">{{$t('m.i.common.createDt')}}：</h-col>
                    <h-col span="15" class="val">{{setRouteFormItem.createTime}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="12" v-show="this.treeNodeType==='0'">
                  <h-row>
                    <h-col span="9" class="label">审批路线描述：</h-col>
                    <h-col span="15" class="val">{{setRouteFormItem.auditRouteDesc}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="12" v-show="this.treeNodeType==='1'">
                  <h-row>
                    <h-col span="9" class="label">节点机构级别：</h-col>
                    <h-col span="15" class="val">{{setRouteFormItem.auditNodeBrchLevel}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="12" v-show="this.treeNodeType==='1' || this.treeNodeType==='2'">
                  <h-row>
                    <h-col span="9" class="label">审批节点名称：</h-col>
                    <h-col span="15" class="val">{{setRouteFormItem.auditNodeName}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="12" v-show="this.treeNodeType==='2'">
                  <h-row>
                    <h-col span="9" class="label">审批岗位名称：</h-col>
                    <h-col span="15" class="val">{{setRouteFormItem.auditStationName}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="12" v-show="this.treeNodeType==='2'">
                  <h-row>
                    <h-col span="9" class="label">审批岗位额度：</h-col>
                    <h-col span="15" class="val">{{setRouteFormItem.auditStationLimit}}</h-col>
                  </h-row>
                </h-col>
              </h-row>
            </div>
            <div slot="footer" style="text-align: center">
              <h-button type="primary" v-if="this.treeNodeType==='0'" :disabled="hasIssueDisabled"
                        @click="addNodeForm('add')">{{$t('m.i.bm.addNode')}}
              </h-button>
              <h-button type="primary" v-if="this.treeNodeType==='1'" :disabled="hasIssueDisabled"
                        @click="addPostForm('add')">{{$t('m.i.bm.addStation')}}
              </h-button>
              <h-button type="primary" v-if="this.treeNodeType==='1'" :disabled="hasIssueDisabled"
                        @click="addNodeForm('modify')">{{$t('m.i.bm.editNode')}}
              </h-button>
              <h-button type="primary" v-if="this.treeNodeType==='1'" :disabled="hasIssueDisabled"
                        @click="deleteNode()">{{$t('m.i.bm.deleteNode')}}
              </h-button>
              <h-button type="primary" v-if="this.treeNodeType==='2'" @click="handleRouteForm()">{{$t('m.i.bm.setApproversPerson')}}</h-button>
              <h-button type="primary" v-if="this.treeNodeType==='2'" @click="addPostForm('modify')">{{$t('m.i.bm.editStation')}}</h-button>
              <h-button type="primary" v-if="this.treeNodeType==='2'" :disabled="hasIssueDisabled"
                        @click="deletePost()">{{$t('m.i.bm.deleteStation')}}
              </h-button>
            </div>
          </div>
        </h-col>
      </h-row>
      <!-- 点击新增节点/修改节点弹出框 -->
      <h-msg-box v-model="addOrEditNodeWin" width="400" class="h-form-search-layer" :maximize="true"
                 :mask-closable="false">
        <p slot="header">
          <span v-if="type==='add'">新增审批节点</span>
          <span v-if="type==='modify'">编辑审批节点</span>
        </p>
        <h-panel>
          <h-form :model="addOrEditNodeForm" :label-width="115" ref="addOrEditNodeForm" cols="1" class="h-form-search">
            <h-form-item :label="$t('m.i.bm.auditRouteName')" prop="auditRouteName" required>
              <h-input v-model="addOrEditNodeForm.auditRouteName" placeholder="审批路线名称" disabled></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.bm.auditNodeName')" prop="auditNodeName" required :validRules="nodeRemarkRule">
              <h-input v-model="addOrEditNodeForm.auditNodeName" placeholder="审批节点名称"></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.bm.auditNodeBrchLevel')" prop="auditNodeBrchLevel" required v-if="type==='add'">
              <h-select v-model="addOrEditNodeForm.auditNodeBrchLevel" placeholder="请选择">
                <h-option v-for="item in auditNodeBrchLevelList" :value="item.key" :key="item.key">{{item.value }}
                </h-option>
              </h-select>
            </h-form-item>
            <h-form-item :label="$t('m.i.bm.auditNodeBrchLevel')" prop="auditNodeBrchLevel" required v-if="type==='modify'">
              <h-select v-model="addOrEditNodeForm.auditNodeBrchLevel" placeholder="请选择" disabled>
                <h-option v-for="item in auditNodeBrchLevelList" :value="item.key" :key="item.key">{{item.value }}
                </h-option>
              </h-select>
            </h-form-item>
          </h-form>
        </h-panel>
        <div slot="footer">
          <h-button type="ghost" @click="addOrEditNodeWin=!addOrEditNodeWin">{{$t("m.i.common.close")}}</h-button>
          <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
          <h-button type="primary" v-else @click="addNodeCommit()">{{$t("m.i.common.commit")}}</h-button>
        </div>
      </h-msg-box>

      <!-- 点击新增岗位/修改岗位弹出框 -->
      <h-msg-box v-model="addOrEditPostWin" width="800" height="400" class="h-form-search-layer" :maximize="true"
                 cols="10" :mask-closable="false">
        <p slot="header">
          <span v-if="type==='add'">新增审批岗位</span>
          <span v-if="type==='modify'">编辑审批岗位</span>
        </p>
        <h-panel>
          <h-form :model="addOrEditPostForm" :label-width="115" ref="addOrEditPostForm" cols="2" class="h-form-search">
            <h-form-item :label="$t('m.i.bm.auditRouteName')" prop="auditRouteName" required cols="5">
              <h-input v-model="addOrEditPostForm.auditRouteName" placeholder="审批路线名称" disabled></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.bm.auditNodeName')" prop="auditNodeName" required cols="5">
              <h-input v-model="addOrEditPostForm.auditNodeName" placeholder="审批节点名称" disabled></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.bm.auditStationName')" prop="auditStationName" required cols="5" :validRules="nodeRemarkRule">
              <h-input v-model="addOrEditPostForm.auditStationName" placeholder="审批岗位名称"
                       :readonly="hasIssueDisabled"></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.bm.auditStationType')" prop="auditStationType" required cols="5">
              <h-select v-model="addOrEditPostForm.auditStationType" placeholder="请选择"
                        :readonly="isReadonlyAuditType()"  @on-change="auditStationTypeChange">
                <h-option v-for="item in auditStationTypeList" :value="item.key" :key="item.key">{{item.value }}
                </h-option>
              </h-select>
            </h-form-item>
            <!--<h-form-item :label="$t('m.i.bm.auditUseBrchNames')" prop="auditUseBrchName" v-if="addOrEditPostForm.auditStationType==='2'" required
                         cols="5">
              <h-input v-model="addOrEditPostForm.auditUseBrchName" placeholder="审批机构名称" icon="android-search"
                       @on-click="queryBrchNo('station')" readonly clearable @on-clear="queryBrchClear('station')"></h-input>
            </h-form-item>-->
            <show-branch v-model="addOrEditPostForm.auditUseBrchName" :label="$t('m.i.bm.auditUseBrchNames')" prop="auditUseBrchName"
                         v-if="addOrEditPostForm.auditStationType==='2'" required
                         :showCheckBox="false" :msgBoxWin="addOrEditPostWin" title="机构名称" @brchNoChange="brchNoChange($event,'station')"
                         :brchNo.sync="addOrEditPostForm.auditUseBrchNo" :brchName.sync="addOrEditPostForm.auditUseBrchName"
                         :isAutoCloseWin="false" ref="station">
            </show-branch>
            <h-form-item :label="$t('m.i.bm.isEndStation')" prop="isEndStation" required cols="5">
              <h-select v-model="addOrEditPostForm.isEndStation" placeholder="请选择" :readonly="hasIssueDisabled||isEndStationReadonly"
                        @on-change="isEndStationChangeFunc">
                <h-option v-for="item in YonList" :value="item.key" :key="item.key">{{item.value }}</h-option>
              </h-select>
            </h-form-item>
            <h-form-item :label="$t('m.i.bm.advanceEndCondition')" prop="advanceEndCondition" cols="5" v-if="showShortAuditInput && addOrEditPostForm.isEndStation==='0'" key="1">
              <h-select v-model="addOrEditPostForm.advanceEndCondition" placeholder="请选择" multiple showTitle :readonly="hasIssueDisabled">
                <h-option v-for="item in advanceEndConditionList" :value="item.key" :key="item.key">{{item.value }}</h-option>
              </h-select>
            </h-form-item>
            <h-form-item :label="$t('m.i.bm.auditStationLimit')" prop="auditStationLimit"
                         v-if="addOrEditPostForm.isEndStation==='1' && addOrEditPostForm.auditStationType !== '3' "
                         required cols="5">
              <h-typefield type="money" v-model="addOrEditPostForm.auditStationLimit" placeholder="岗位额度权限"
                           @on-blur="formatBillMoney('blur')" @on-focus="formatBillMoney('focus')" bigTips
                           :readonly="hasIssueDisabled"></h-typefield>
            </h-form-item>
            <h-form-item :label="$t('m.i.bm.minStationRate')" prop="minRate" required cols="5" :validRules="minRateRule"
                         v-if="minRateIsShow">
              <h-input v-model="addOrEditPostForm.minRate" placeholder="利率范围0~100"
                       :readonly="hasIssueDisabled"></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.bm.maxStationRate')" prop="maxRate" required cols="5" :validRules="maxRateRule"
                         v-if="maxRateIsShow">
              <h-input v-model="addOrEditPostForm.maxRate" placeholder="利率范围0~100"
                       :readonly="hasIssueDisabled"></h-input>
            </h-form-item>

            <h-form-item label="票据超过限额是否需要下一岗审批" prop="isNeedNextAudit" cols="5" v-if="showBillLimitCheck && addOrEditPostForm.isEndStation==='1'" key="isNeedNextAudit" class="h-form-long-label">
              <h-select v-model="addOrEditPostForm.isNeedNextAudit" placeholder="" showTitle :readonly="hasIssueDisabled">
                <h-option v-for="item in YonList" :value="item.key" :key="item.key">{{item.value }}</h-option>
              </h-select>
            </h-form-item>
            <h-form-item label="单张票据金额限额" prop="stationBillMoneyLimit" cols="5" v-if="showBillLimitCheck && addOrEditPostForm.isEndStation==='1' && addOrEditPostForm.isNeedNextAudit==='1'"
                         key="stationBillMoneyLimit" :required="addOrEditPostForm.isNeedNextAudit==='1'">
              <h-typefield type="money" v-model="addOrEditPostForm.stationBillMoneyLimit" :maxlength="15"
                           placeholder="数字，小数位最多2位" bigTips :readonly="hasIssueDisabled"></h-typefield>
            </h-form-item>


            <!--审批额度模式设置-->
            <h-form-item :label="$t('m.i.bm.modeset')" prop="modeset" style="width: 100%;"
                         v-if="addOrEditPostForm.auditStationType ==='1'&& addOrEditPostForm.isEndStation==='1'||addOrEditPostForm.auditStationType ==='2'&& addOrEditPostForm.isEndStation==='1'">
              <h-button type="ghost" @click="addMode" :disabled="hasIssueDisabled">{{$t('m.i.common.add')}}</h-button>
            </h-form-item>
            <div class="h-form-model-set" v-for="(item,index) in modeList" :key="index"
                 v-if="addOrEditPostForm.auditStationType ==='1'&& addOrEditPostForm.isEndStation==='1'||addOrEditPostForm.auditStationType ==='2'&& addOrEditPostForm.isEndStation==='1'">
              <h-form-item prop="No4" class="no-label h-model-col4">
                <h-select v-model="addOrEditPostForm.list[index].modeUserType" placeholder="请选择">
                  <h-option v-for="item in modeUserTypeList" :value="item.key" :key="item.key">{{item.value }}
                  </h-option>
                </h-select>
              </h-form-item>
              <h-form-item prop="No4" class="no-label h-model-col4">
                <h-select v-model="addOrEditPostForm.list[index].modeTellerType" placeholder="请选择">
                  <h-option v-for="item in modeTellerTypeList" :value="item.key" :key="item.key">{{item.value }}
                  </h-option>
                </h-select>
              </h-form-item>
              <h-form-item prop="No4" class="no-label h-model-col4">
                <h-select v-model="addOrEditPostForm.list[index].modeTimeType" placeholder="请选择">
                  <h-option v-for="item in modeTimeTypeList" :value="item.key" :key="item.key">{{item.value }}
                  </h-option>
                </h-select>
              </h-form-item>
              <h-form-item prop="No4" class="no-label h-model-col4">
                <h-typefield type="money" v-model="addOrEditPostForm.list[index].modelTotalAmt" :maxlength="15"
                             placeholder="数字，小数位最多2位" bigTips></h-typefield>
              </h-form-item>
              <button type="button" class="h-form-delete" @click="deleteMode(index)"><i
                  class="icon iconfont icon-trash"></i></button>
            </div>
          </h-form>
        </h-panel>
        <div slot="footer">
          <h-button type="ghost" @click="addOrEditPostWin=!addOrEditPostWin">{{$t("m.i.common.close")}}</h-button>
          <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
          <h-button type="primary" v-else @click="addPostCommit()" :disabled="hasIssueDisabled">
            {{$t("m.i.common.commit")}}
          </h-button>
        </div>
      </h-msg-box>
    </div>

    <h-msg-box v-model="layer2" width="1000" height="420" class="h-form-table-layer" :maximize="true"
               @on-close="closeShuttleBox" :mask-closable="false">
      <p slot="header">
        <span>分配审批人员</span>
      </p>
      <div>
        <h-form :model="assignRoleFormItem" :label-width="90" ref="assignRoleFormItem" cols="4" class="h-form-search">
          <h-form-item prop="auditStationName" :label="$t('m.i.bm.currertAuditStationName')">
            <h-input v-model="assignRoleFormItem.auditStationName" placeholder="当前岗位" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.bm.auditChoiceUser')" prop="auditChoiceUser">
            <h-select v-model="assignRoleFormItem.auditChoiceUser" placeholder="请选择" @on-change="changeStatus()"
                      :clearable="false" :readonly="this.testIsReadonly">
              <h-option v-for="item in auditChoiceUserList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
        </h-form>
        <div class="h-transfer-box" v-show="auditRole">
          <h-transfer
              :data="mockData"
              :target-keys="rightMockData"
              :render-format="renderMock"
              :operations="['关闭分配','分配角色']"
              :titles="['角色分配','选中']"
              @on-change="handleChangeMock">
            <div></div>
          </h-transfer>
        </div>
        <div class="h-transfer-box" v-show="auditUser">
          <h-transfer
              :data="userMockData"
              :target-keys="rightUserMockData"
              :render-format="renderMock"
              :operations="['关闭分配','分配用户']"
              :titles="['用户分配','选中']"
              @on-change="handleChangeMock">
            <div></div>
          </h-transfer>
        </div>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="closeShuttleBox()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="submitShuttleBox()">{{$t('m.i.common.commit')}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import { post, on, off, getDictValueFromMap, formatNumber } from "@/api/bizApi/commonUtil";
  import { deepClone } from "@/utils/index";

  export default {
    name: "auditRoute",
    data() {
      let formItem = {
        auditRouteName: "",
        auditProdName: "",
        auditProdNo: "",
        isCommit: "noIssue",
        isValid: "0"
      };
      let legalNoFormItem = {
        legalNo: "",
        legalpersonName: ""
      };
      let addOrEditForm = {
        id: "",
        auditRouteName: "",
        legalNo: this.$store.getters.userInfo.legalNo,
        billType: "",
        billClass: "",
        auditProdNo: "",
        auditUseBrchName: "",
        auditUseBrchNo: "",
        auditType: "1",
        auditBrchStartLevel: "2",
        auditBrchNameLevel: "总行",
        auditRouteDesc: "",
        auditRouteRiskType:"0",
        isCheckGuideRate: ""
      };
      let columns = [
        {
          title: " ",
          type: "radio",
          align: "center",
          width: 50
        },
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          width: 60,
          align: "center"
        },

        {
          title: this.$t('m.i.bm.auditRouteName'),
          key: "auditRouteName",
          align: "center",
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t('m.i.common.legalNo'),
          key: "legalNo",
          align: "center",

          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.billType'),
          key: "billType",
          align: "center",

          hiddenCol: false,
          render: (h, params) => {
            let list = getDictValueFromMap(this.dictMap, "AuditDraftTypeCode", params.row.billType);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t('m.i.billInfo.billClass'),
          key: "billClass",
          align: "center",
          hiddenCol: false,
          render: (h, params) => {
            let list = getDictValueFromMap(this.dictMap, "AuditCDMedia", params.row.billClass);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t('m.i.bm.auditProdName'),
          key: "auditProdName",
          align: "center",
          hiddenCol: false,
          sortable: true
        },
        {
          title:this.$t('m.i.bm.auditRouteRiskType'),
          key:"auditRouteRiskType",
          align: "center",
          hiddenCol:false,
          render: (h, params) => {
            let list = getDictValueFromMap(this.dictMap, "AuditRouteRiskType", params.row.auditRouteRiskType);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t('m.i.bm.auditUseType'),
          key: "auditType",
          align: "center",
          hiddenCol: false,
          render: (h, params) => {
            let list = getDictValueFromMap(this.dictMap, "AuditType", params.row.auditType);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t('m.i.bm.auditUseBrchName'),
          key: "auditUseBrchName",
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.bm.isValid'),
          key: "isValid",
          align: "center",
          hiddenCol: false,
          render: (h, params) => {
            let list = this.YonList;
            let isValid = params.row.isValid;
            for (let i = 0; i < list.length; i++) {
              if (params.row.isValid === list[i].key) {
                isValid = list[i].value;
              }
            }
            return h("span", isValid);
          }
        },
        {
          title: this.$t('m.i.bm.auditBrchStartLevel'),
          key: "auditBrchStartLevel",
          align: "center",
          hiddenCol: false,
          render: (h, params) => {
            let list = getDictValueFromMap(this.dictMap, "BranchLevel", params.row.auditBrchStartLevel);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t('m.i.bm.auditCreateBrchName'),
          key: "auditCreateBrchName",
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.createTime'),
          key: "createTime",
          align: "center",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let createTime = params.row.createTime == null ? "" : this.$moment(params.row.createTime, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
            return h("span", createTime);
          }
        },
        {
          title: this.$t('m.i.bm.auditRouteDesc'),
          key: "auditRouteDesc",
          align: "center",
          hiddenCol: false
        }
      ];
      let legalNoColumns = [
        {
          type: "selection",
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          width: 60,
          align: "center"
        },

        {
          title: this.$t('m.i.common.legalNo'),
          key: "legalNo",
          align: "left",
          ellipsis: false,
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t('m.i.common.legalpersonName'),
          key: "legalpersonName",
          align: "left",

          hiddenCol: false,
          sortable: true
        }
      ];
      let setRouteFormItem = {
        id: "",
        auditRouteName: "",
        auditNodeName: "",
        auditNodeBrchLevel: "",
        legalNo: "",
        billType: "",
        billClass: "",
        auditProdName: "",
        auditProdNo: "",
        auditType: "",
        auditBrchStartLevel: "",
        auditBrchNameLevel: "",
        auditUseBrchName: "",
        auditUseBrchNo: "",
        createTime: "",
        auditRouteDesc: "",
        auditStationName: "",
        auditStationLimit: ""
      };
      let addOrEditNodeForm = {
        id: "",
        auditNodeId: "",
        auditRouteId: "",
        auditRouteName: "",
        auditNodeName: "",
        auditNodeBrchLevel: ""
      };
      let addOrEditPostForm = {
        id: "",
        auditNodeId: "",
        auditRouteName: "",
        auditNodeName: "",
        auditStationType: "",
        isEndStation: "",
        auditStationLimit: "",
        minRate: "",
        maxRate: "",
        auditStationName: "",
        auditUseBrchName: "",
        auditUseBrchNo: "",
        advanceEndCondition:[],
        isNeedNextAudit: "",
        stationBillMoneyLimit: "",
        //额度审批模式
        list: [{
          modeUserType: "",
          modeTellerType: "",
          modeTimeType: "",
          modelTotalAmt: ""
        }]

      };
      let assignRoleFormItem = {
        auditStationName: "",
        auditChoiceUser: "1"
      };
      let queryRoleFormItem = {
        auditStationId: "",
        pageSize: "9999"
      };
      let queryUserFormItem = {
        auditStationId: "",
        pageSize: "9999"
      };
      let addAuditStationRoleFormItem = {
        roleIds: "",
        auditStationId: ""
      };
      //删除审批角色字段
      let deleteAuditStationRoleFormItem = {
        roleIds: ""
      };
      //新增审批用户字段
      let addAuditStationUserFormItem = {
        userIds: "",
        auditStationId: ""
      };
      //删除审批用户字段
      let deleteAuditStationUserFormItem = {
        userIds: ""
      };
      let assignRoleColumns = [
        {
          type: "selection",
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          width: 60,
          align: "center"
        },

        {
          title: this.$t('m.i.common.roleName'),
          key: "roleName",
          align: "left",
          ellipsis: false,
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t('m.i.common.remark'),
          key: "remark",
          align: "left",
          ellipsis: false,
          hiddenCol: false,
          sortable: true
        }
      ];
      function validMinRate(rule, val, callback) {
        let re = /^(((\d|[1-9]\d)(\.\d{1,4})?)|100|100\.0|100\.00|100\.000|100\.0000)$/;
        if (re.test(val)) {
          callback();
        } else {
          callback(new Error("利率为0~100之间的数，小数位不超过4位"));
        }
      }
      function validMaxRate(rule, val, callback) {
        let re = /^(((\d|[1-9]\d)(\.\d{1,4})?)|100|100\.0|100\.00|100\.000|100\.0000)$/;
        if (re.test(val)) {
          if (val < addOrEditPostForm.minRate) {
            callback(new Error("最大利率应大于最小利率"));
          } else {
            callback();
          }
        } else {
          callback(new Error("利率为0~100之间的数，小数位不超过4位"));
        }
      }
      return {
        isPayAudit:false,
        showAuditRiskTypeItem:false,
        formItem: formItem,
        legalNoFormItem: legalNoFormItem,
        addOrEditForm: addOrEditForm,
        columns: columns,
        legalNoColumns: legalNoColumns,
        setRouteFormItem: setRouteFormItem,
        addOrEditNodeForm: addOrEditNodeForm,
        addOrEditPostForm: addOrEditPostForm,
        assignRoleFormItem: assignRoleFormItem,
        queryRoleFormItem: queryRoleFormItem,
        queryUserFormItem: queryUserFormItem,
        addAuditStationRoleFormItem: addAuditStationRoleFormItem,
        deleteAuditStationRoleFormItem: deleteAuditStationRoleFormItem,
        addAuditStationUserFormItem: addAuditStationUserFormItem,
        deleteAuditStationUserFormItem: deleteAuditStationUserFormItem,
        assignRoleColumns: assignRoleColumns,
        bankLevelAdd: "",
        testIsReadonly: true,
        shuttleAuditStationType: "",
        mainVueProdNo: "",
        minRateIsShow: false,
        maxRateIsShow: false,
        showKey: [],
        oldRightMockData: [],
        modeList: [],
        layer2: false,
        targetKeys1: ["1", "2"],
        pageTotalnum: 24,
        loadover: false,
        mockData: [],
        rightMockData: [],
        userMockData: [],
        rightUserMockData: [],
        stationRoleId: [],
        stationUserId: [],
        oldRightUserMockData: [],
        auditRole: false,
        auditUser: false,
        stationId: "",
        auditChoiceUserOrRole: "",
        isValids: "",
        YonList: [],
        advanceEndConditionList:[],
        auditChoiceUserList: [],
        modeTimeTypeList: [],
        modeTellerTypeList: [],
        modeUserTypeList: [],
        auditNodeBrchLevelList: [],
        auditStationTypeList: [],
        billTypeList: [],
        billClassList: [],
        auditTypeList: [],
        spanLeft: 4,
        spanRight: 20,
        isDisabled: true,
        isExpandDisabled: true,
        isNotExpandDisabled: false,
        type: null,
        prodType: "",
        queryBrchType: "",
        brchNameSelectWin: false,
        branchTreeData: [],
        TreeData: [],
        addOrEditWin: false,
        legalNoSearchWin: false,
        //showBranchWin: false,
        submitFlag: false,
        readonly: false,
        setRouteSelectWin: false,
        legalNo: "",
        selectData:null,
        tableRef: "selfTable",
        hasIssueDisabled: false,
        noIssueDisabled: false,
        auditMain: true,
        setAuditRoute: false,
        addOrEditNodeWin: false,
        addOrEditPostWin: false,
        treeNodeType: [],
        assignRoute: false,
        assignRole: false,
        dictMap: new Map(),
        setAuditRouteId: "",
        addUrl: "",
        legalNoRule: [{ test: /^[0-9]{6}$/, trigger: "blur", message: "法人编号为6位数字" }],
        remarkRule: [{ test: /^.{0,80}$/, trigger: "blur", message: "不能超过80位" }],
        nodeRemarkRule: [{ test: /^.{0,20}$/, trigger: "blur", message: "不能超过20位" }],
        minRateRule: [{ test: validMinRate, trigger: "blur" }],
        maxRateRule: [{ test: validMaxRate, trigger: "blur" }],
        ifShowMore: false,
        auditRouteRiskTypeList:[],
        showCheckGuideInput:false,
        rebuyCheckProds : [],
        showDiscCheckGuideInput : false,
        showCheckGuideTemp:false,
        isEndStationReadonly:false,
        showShortAuditInput:false,
        showBillLimitCheck: false,
        flag:false,
      };
    },
    components: {
      //ShowBranch: () => import(/* webpackChunkName: "sm/auth/branch/showBranch"*/"@/views/bizViews/sm/auth/branch/showBranch")
    },
    computed: {
      isReadonlyAuditType() {
        return function() {
          if (this.hasIssueDisabled) {
            return true;
          } else if (this.type === "modify") {
            return true;
          } else {
            return false;
          }
        };
      },
      getHeight() {
        let appObj = document.getElementsByClassName("app-main");
        let appOffsetTop = appObj.length == 0 ? 0 : appObj[0].offsetTop;
        return window.innerHeight - appOffsetTop;
      }
    },
    methods: {
      onCurrentChange(currentRow, oldCurrentRow, _index){
        this.selectData = currentRow;
      },
      onCurrentChangeCancel(){
        this.selectData = null;
      },
      isEndStationChangeFunc() {
        if (this.mainVueProdNo.toString().substring(0, 4) === "0106" || this.mainVueProdNo.toString().substring(0, 6) === "001010") {
          if (this.addOrEditPostForm.isEndStation === "1") {
            this.minRateIsShow = true;
            this.maxRateIsShow = false;
          } else {
            this.minRateIsShow = false;
            this.maxRateIsShow = false;
            this.addOrEditPostForm.minRate = "";
            this.addOrEditPostForm.maxRate = "";
            this.addOrEditPostForm.auditStationLimit = "";
          }
        } else if (this.mainVueProdNo.toString().substring(0, 6) === "001020") {
          if (this.addOrEditPostForm.isEndStation === "1") {
            this.minRateIsShow = false;
            this.maxRateIsShow = true;
          } else {
            this.minRateIsShow = false;
            this.maxRateIsShow = false;
            this.addOrEditPostForm.minRate = "";
            this.addOrEditPostForm.maxRate = "";
            this.addOrEditPostForm.auditStationLimit = "";
          }
        } else {
          this.minRateIsShow = false;
          this.maxRateIsShow = false;
          this.addOrEditPostForm.minRate = "";
          this.addOrEditPostForm.maxRate = "";
        }
        if (this.addOrEditPostForm.isEndStation === "1") {
          this.addOrEditPostForm.advanceEndCondition = [];
        } else {
          this.addOrEditPostForm.isNeedNextAudit = "";
          this.addOrEditPostForm.stationBillMoneyLimit = "";
        }
      },
      testReadonly() {
        //审批路线的种类 1.全行通用 2.指定机构使用
        if (this.auditChoiceUserOrRole === "2") {
          //auditChoiceUser 1.角色  2.用户
          if (this.shuttleAuditStationType === "3") {
            //会签岗时只能选择用户
            this.assignRoleFormItem.auditChoiceUser = "2";
            this.testIsReadonly = true;
          } else {
            this.assignRoleFormItem.auditChoiceUser = "1";
            this.testIsReadonly = false;
          }
        } else {
          //全行通用
          if (this.shuttleAuditStationType === "3") {
            //会签岗时只能选择用户
            this.assignRoleFormItem.auditChoiceUser = "2";
          } else {
            this.assignRoleFormItem.auditChoiceUser = "1";
          }
          this.testIsReadonly = true;
        }
      },
      //查询
      handleSearch() {
        this.$refs.datagrid.dataChange(1);
      },
      //重置查询结果
      resetSearch() {
        // this.$refs.formItem.resetFields();
        this.formItem.auditRouteName = "";
        this.formItem.auditProdName = "";
        this.formItem.auditProdNo = "";
      },
      productSelectedChange(arr, type) {
        if (type === "query") {
          this.formItem.auditProdNo = arr[0].id;
          this.formItem.auditProdName = arr[0].title;
        } else if (type === "add") {
          this.addOrEditForm.auditProdName = arr[0].title;
          this.addOrEditForm.auditProdNo = arr[0].id;
        }
        this.addOrEditForm.prodNo = arr[0].id;
        this.prodNameSelectWin = false;
        //加判断
        this.showCheckGuideInputTemp(arr[0].id);
        this.prodNameSelectWin = false;
      },
      showCheckGuideInputTemp(prodNo){
        let discProdList=['010601','010602','010603','010604','010610','010611','001010'];   //以这些开头
        if (prodNo==='00101003'||prodNo==='001010') {
          this.showCheckGuideTemp=this.showCheckGuideInput&&false
          return;
        }
        if(prodNo.startsWith('001010')){
          for (let i=0;i<this.rebuyCheckProds.length;i++) {
            if (prodNo == this.rebuyCheckProds[i]) {
              this.showCheckGuideTemp=true;
              return
            }
          }
        } else {
          for (let i=0;i<discProdList.length;i++) {
            if (prodNo.startsWith(discProdList[i])) {
              this.showCheckGuideTemp=this.showDiscCheckGuideInput&&true;
              return
            }
          }
        }
        this.showCheckGuideTemp=false;
      },
      productNameClear(type) {
        if (type === "query") {
          this.formItem.auditProdNo = "";
          this.formItem.auditProdName = "";
        } else {
          this.addOrEditForm.auditProdName = "";
          this.addOrEditForm.auditProdNo = ";"
        }
        this.addOrEditForm.prodNo = "";
      },
      handleBrchLevel() {
        this.addOrEditForm.auditBrchNameLevel = getDictValueFromMap(this.dictMap, "BranchLevel", this.addOrEditForm.auditBrchStartLevel);
      },
      //主页面新增、修改、复制
      handleForm(type) {
        this.type = type;
        if (this.type === "modify" && !this.selectData || this.type === "duplicate" && !this.selectData) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        this.addOrEditWin = true;
        // 回归默认值
        this.showCheckGuideTemp = false;
        if (this.type === "modify" || this.type === "duplicate") {
          let ids = this.selectData.id;
          post({ id: ids }, "/bm/audit/auditRoute/func_getAuditRouteById").then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$nextTick(() => {
                  this.addOrEditForm.id = res.data.retData.id;
                  this.addOrEditForm.auditRouteName = res.data.retData.auditRouteName;
                  this.addOrEditForm.legalNo = res.data.retData.legalNo;
                  this.addOrEditForm.billType = res.data.retData.billType;
                  this.addOrEditForm.billClass = res.data.retData.billClass;
                  this.addOrEditForm.auditProdName = res.data.retData.auditProdName;
                  this.addOrEditForm.auditProdNo = res.data.retData.auditProdNo;
                  this.addOrEditForm.auditType = res.data.retData.auditType;
                  this.addOrEditForm.auditBrchStartLevel = res.data.retData.auditBrchStartLevel;
                  this.addOrEditForm.auditUseBrchName = res.data.retData.auditUseBrchName;
                  this.addOrEditForm.auditUseBrchNo = res.data.retData.auditUseBrchNo != "0" ? res.data.retData.auditUseBrchNo : "";
                  this.addOrEditForm.auditRouteDesc = res.data.retData.auditRouteDesc;
                  this.addOrEditForm.isCheckGuideRate = res.data.retData.isCheckGuideRate;
                  this.showCheckGuideInputTemp(this.addOrEditForm.auditProdNo);
                  this.handleBrchLevel();
                  this.addOrEditForm.auditRouteRiskType=res.data.retData.auditRouteRiskType
                });
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
                this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        } else {
          this.$nextTick(() => {
            this.addOrEditReset();
          });
        }
      },
      //主页面新增/修改页面提交
      formAdd() {
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            if (this.type === "duplicate") {
              this.addUrl = "/bm/audit/auditRoute/func_copyAuditRoute";
            } else {
              this.addUrl = this.type === "add" ? "/bm/audit/auditRoute/func_insertAuditRoute" : "/bm/audit/auditRoute/func_updateAuditRoute";
            }
            this.submitFlag = true;
            post(this.addOrEditForm, this.addUrl).then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.addOrEditWinClose();
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.selectData = null;
                  this.addUrl = "";
                } else {
                  this.$msgTip.error(this, { info: msg });
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      addOrEditWinClose(){
        this.addOrEditWin = false;
        this.showCheckGuideTemp = false;

      },
      //主页面重置新增/修改窗口
      addOrEditReset() {
        this.$refs.addOrEditForm.resetFields();
        this.addOrEditForm.id = "";
        this.addOrEditForm.auditRouteRiskType="0"
        this.addOrEditForm.isCheckGuideRate="";
      },
      //删除
      deleteRoute() {
        if (!this.selectData) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
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
      handleDel() {
        post({ id: this.selectData.id }, "/bm/audit/auditRoute/func_deleteAuditRoute").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this, { info: this.$t("m.i.common.deleteSuccess") });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.selectData = null;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      /* //查询机构弹出框
       queryBrchNo(type) {
         this.queryBrchType = type;
         this.showBranchWin = true;
       },*/
      queryBrchClear(type){
        if (type === "route") {
          this.addOrEditForm.auditBrchStartLevel = "";
          this.addOrEditForm.auditUseBrchNo = "";
          this.addOrEditForm.auditUseBrchName = "";
        } else if (type === "station") {
          this.addOrEditPostForm.auditUseBrchName = "";
          this.addOrEditPostForm.auditUseBrchNo = "";
        }
      },
      /* showBranchWinClose() {
         this.showBranchWin = false;
       },*/
      //根据弹框所选数据进行赋值
      brchNoChange(info, type) {
        let objs = [];
        if (info instanceof Array) {
          objs[0] = info[0];
        } else {
          objs[0] = info;
        }
        post({ brchNo: objs[0].brchNo }, "sm/auth/branch/getBranchByBranchTreeNo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              let brchLevel = res.data.retData.brchLevel;
              if (type === "route") {
                this.addOrEditForm.auditBrchStartLevel = brchLevel;
                //this.addOrEditForm.auditUseBrchNo = objs[0].id;
                //this.addOrEditForm.auditUseBrchName = objs[0].title;
              } else if (type === "station") {
                let bankLevelAddDictValue = getDictValueFromMap(this.dictMap, "BranchLevel", this.bankLevelAdd);
                let brchLevelTree = getDictValueFromMap(this.dictMap, "BranchLevel", brchLevel);
                bankLevelAddDictValue = !!bankLevelAddDictValue ? bankLevelAddDictValue : "";
                brchLevelTree = !!brchLevelTree ? brchLevelTree : "";
                if (brchLevel !== this.bankLevelAdd) {
                  this.$msgTip.info(this, { info: "定机构岗选择的机构级别【" + brchLevelTree.toString() + "】与当前审批路线节点机构级别【" + bankLevelAddDictValue.toString() + "】不一致！" });
                  return;
                } else {
                  this.$refs[type].assembleSelectValue(info, ["brchNo", "brchName"])
                }
                //this.addOrEditPostForm.auditUseBrchName = objs[0].title;
                //this.addOrEditPostForm.auditUseBrchNo = objs[0].id;
              }
              this.handleBrchLevel();
            }
          }
        });
        /*if (type === "route") {
          this.addOrEditForm.auditBrchStartLevel = brchLevel;
          //this.addOrEditForm.auditUseBrchNo = objs[0].id;
          //this.addOrEditForm.auditUseBrchName = objs[0].title;
        } else if (type === "station") {
          let bankLevelAddDictValue = getDictValueFromMap(this.dictMap, "BranchLevel", this.bankLevelAdd);
          let brchLevelTree = getDictValueFromMap(this.dictMap, "BranchLevel", brchLevel);
          if (brchLevel !== this.bankLevelAdd) {
            this.$msgTip.info(this, { info: "定机构岗选择的机构级别【" + brchLevelTree.toString() + "】与当前审批路线节点机构级别【" + bankLevelAddDictValue.toString() + "】不一致！" });
            return;
          }
          //this.addOrEditPostForm.auditUseBrchName = objs[0].title;
          //this.addOrEditPostForm.auditUseBrchNo = objs[0].id;
        }
        this.showBranchWin = false;
        this.handleBrchLevel();*/
      },
      //收拢左侧树
      handleUnExpandTree(arr) {
        this.recursiveTree(arr, false);
        this.isDisabled = !this.isDisabled;
        this.isExpandDisabled = false;
        this.isNotExpandDisabled = true;
      },
      //展开左侧树
      handleExpandTree(arr) {
        this.recursiveTree(arr, true);
        this.isDisabled = !this.isDisabled;
        this.isExpandDisabled = true;
        this.isNotExpandDisabled = false;
      },
      //递归给左侧树赋值
      recursiveTree(arr, isExpand) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].children) {
            arr[i].expand = isExpand;
            this.recursiveTree(arr[i].children, isExpand);
          }
        }
      },
      //设置路线跳转
      setRouteForm() {
        if (!this.selectData) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        this.mainVueProdNo = this.selectData.auditProdNo;
        this.auditChoiceUserOrRole = "";
        this.auditChoiceUserOrRole = this.selectData.auditType;
        let ids = this.selectData.id;
        post({ id: ids }, "/bm/audit/auditRoute/func_getAuditRouteById").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.setRouteFormItem.id = res.data.retData.id;
              this.setRouteFormItem.auditRouteName = res.data.retData.auditRouteName;
              this.setRouteFormItem.auditProdName = res.data.retData.auditProdName;
              this.setRouteFormItem.auditProdNo = res.data.retData.auditProdNo;
              this.setRouteFormItem.auditUseBrchNo = res.data.retData.auditUseBrchNo;
              this.setRouteFormItem.auditType = getDictValueFromMap(this.dictMap, "AuditType", res.data.retData.auditType);
              this.setRouteFormItem.auditBrchStartLevel = getDictValueFromMap(this.dictMap, "BranchLevel", res.data.retData.auditBrchStartLevel);
              this.setRouteFormItem.auditUseBrchName = res.data.retData.auditUseBrchName;
              this.setRouteFormItem.auditCreateBrchName = res.data.retData.auditCreateBrchName;
              this.setRouteFormItem.createTime = this.$moment(res.data.retData.createTime, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
              this.setRouteFormItem.auditRouteDesc = res.data.retData.auditRouteDesc;
              // this.handleLevel();
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
        this.getAuditTreeData();
      },
      //设置审批路线子页面获取树
      getAuditTreeData() {
        this.setAuditRouteId = this.selectData.id;
        let id = this.selectData.id;
        post({ id: id }, "/bm/audit/auditRoute/func_queryAuditRouteTreeInfo").then(res => {
          if (res && res.data) {
            let data = (res.data.retData instanceof Array) ? res.data.retData : [res.data.retData];
            this.treeNodeType = data[0].type;
            this.TreeData = data;
            this.handleExpandTree(this.TreeData);
          }
          this.auditMain = false;
          this.setAuditRoute = true;
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      //刷新树
      getNewTreeData(str) {
        let id = str;
        post({ id: id }, "/bm/audit/auditRoute/func_queryAuditRouteTreeInfo").then(res => {
          if (res && res.data) {
            let data = (res.data.retData instanceof Array) ? res.data.retData : [res.data.retData];
            this.TreeData = data;
            this.handleExpandTree(this.TreeData);
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      //点击树事件
      clickTreeDataChange() {
        let arr = this.$refs["TreeData"].getSelectedNodes();
        this.stationId = "";
        if (arr.length !== 0) {
          this.stationId = arr[0].id;
          this.treeNodeType = arr[0].type;
          if (this.treeNodeType === "1") {
            this.setRouteFormItem.auditNodeBrchLevel = getDictValueFromMap(this.dictMap, "BranchLevel", arr[0].anBrchLvl);
            this.setRouteFormItem.auditNodeName = arr[0].title;
          }
          if (this.treeNodeType === "2") {
            let id = arr[0].id;
            post({ id: id }, "/bm/audit//auditRoute/func_getAuditStationById").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  if (res.data.retData.auditStationLimit !== "" || res.data.retData.auditStationLimit != null) {
                    this.setRouteFormItem.auditStationLimit = res.data.retData.auditStationLimit;
                  }
                  this.setRouteFormItem.auditNodeName = res.data.retData.auditNodeName;
                  this.setRouteFormItem.auditStationName = res.data.retData.auditStationName;
                  this.assignRoleFormItem.auditStationName = res.data.retData.auditStationName;
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                  this.$refs.datagrid.dataChange(1);
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        }
      },
      //回到主页面
      backOne() {
        this.setAuditRoute = false;
        this.auditMain = true;
        this.handleSearch();
      },
      //新增节点、修改节点
      addNodeForm(type) {
        this.type = type;
        let arr = this.$refs["TreeData"].getSelectedNodes();
        if (arr.length === 0) {
          this.$msgTip.info(this, { info: "请先选择左侧树节点！" });
          return;
        }
        this.addOrEditNodeWin = true;
        this.$nextTick(() => {
          this.addOrEditNodeForm.auditNodeBrchLevel = arr[0].anBrchLvl;
          this.addOrEditNodeForm.auditRouteName = this.selectData.auditRouteName;
          if (this.type === "modify") {
            this.addOrEditNodeForm.id = arr[0].id;
            post({ id: this.addOrEditNodeForm.id }, "/bm/audit/auditRoute/func_getAuditNodeById").then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.addOrEditNodeForm.auditNodeBrchLevel = res.data.retData.auditNodeBrchLevel;
                  this.addOrEditNodeForm.auditNodeName = res.data.retData.auditNodeName;
                  // this.addOrEditNodeWin = false;
                  this.getNewTreeData(this.setAuditRouteId);
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          } else {
            this.$refs.addOrEditNodeForm.resetFields();
            this.addOrEditNodeForm.id = "";
            this.addOrEditNodeForm.auditRouteName = this.selectData.auditRouteName;
            this.addOrEditNodeForm.auditRouteId = arr[0].id;
          }
        });
      },
      // 新增节点、修改节点页面提交
      addNodeCommit() {
        this.$refs["addOrEditNodeForm"].validate(valid => {
          if (valid) {
            let url = this.type === "add" ? "/bm/audit/auditRoute/func_insertAuditNode" : "/bm/audit/auditRoute/func_updateAuditNode";
            this.submitFlag = true;
            post(this.addOrEditNodeForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.addOrEditNodeWin = false;
                  this.setRouteFormItem.auditNodeName = this.addOrEditNodeForm.auditNodeName;
                  this.getNewTreeData(this.setAuditRouteId);
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
      //子页面删除节点
      deleteNode() {
        let arr = this.$refs["TreeData"].getSelectedNodes();
        if (arr.length === 0) {
          this.$msgTip.info(this, { info: "请先选择左侧树节点！" });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t('m.i.common.confirm'),
          content: this.$t('m.i.bm.confirmDeleteNode') + '?',
          onOk: () => {
            let id = arr[0].id;
            post({ id: id }, "/bm/audit/auditRoute/func_deleteAuditNode").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this, { info: this.$t("m.i.common.deleteSuccess") });
                  this.getNewTreeData(this.setAuditRouteId);
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        })
      },
      // 新增岗位/修改岗位页面
      addPostForm(type) {
        this.type = type;
        let arr = this.$refs["TreeData"].getSelectedNodes();
        if (arr.length === 0) {
          this.$msgTip.info(this, { info: "请先选择左侧树节点！" });
          return;
        }
        this.addOrEditPostWin = true;
        this.$nextTick(() => {
          this.bankLevelAdd = arr[0].anBrchLvl;
          this.$refs.addOrEditPostForm.resetFields();
          this.addOrEditPostForm.auditUseBrchNo = "";
          this.addOrEditPostForm.auditUseBrchName = "";
          this.addOrEditPostForm.advanceEndCondition = [];
          this.addOrEditPostForm.isNeedNextAudit = "";
          this.addOrEditPostForm.stationBillMoneyLimit = "";
          this.addOrEditPostForm.minRate = "";
          this.addOrEditPostForm.maxRate = "";
          this.addOrEditPostForm.auditStationLimit = "";
          this.addOrEditPostForm.auditNodeId = arr[0].id;
          this.addOrEditPostForm.auditRouteName = this.setRouteFormItem.auditRouteName;
          this.addOrEditPostForm.auditNodeName = this.setRouteFormItem.auditNodeName;
          if (this.type === "modify") {
            this.addOrEditPostForm.id = arr[0].id;
            post({ id: this.addOrEditPostForm.id }, "/bm/audit//auditRoute/func_getAuditStationById").then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.addOrEditPostForm.auditStationType = res.data.retData.auditStationType;
                  this.addOrEditPostForm.isEndStation = res.data.retData.isEndStation;
                  if (res.data.retData.advanceEndCondition === "" || res.data.retData.advanceEndCondition === null
                    || res.data.retData.advanceEndCondition === undefined) {
                    this.addOrEditPostForm.advanceEndCondition = [];
                  } else {
                    this.addOrEditPostForm.advanceEndCondition = res.data.retData.advanceEndCondition.split(",");
                  }
                  this.addOrEditPostForm.isNeedNextAudit = res.data.retData.isNeedNextAudit;
                  this.addOrEditPostForm.stationBillMoneyLimit = res.data.retData.stationBillMoneyLimit;
                  this.addOrEditPostForm.minRate = res.data.retData.minRate;
                  this.addOrEditPostForm.maxRate = res.data.retData.maxRate;
                  this.addOrEditPostForm.auditStationName = res.data.retData.auditStationName;
                  this.addOrEditPostForm.auditUseBrchName = res.data.retData.auditUseBrchName;
                  this.addOrEditPostForm.auditUseBrchNo = res.data.retData.auditUseBrchNo;
                  if (res.data.retData.auditStationLimit !== "" || res.data.retData.auditStationLimit != null) {
                    this.addOrEditPostForm.auditStationLimit = res.data.retData.auditStationLimit;
                  }
                  //控制最小最大利率是否展示
                  if (this.mainVueProdNo.toString().substring(0, 4) === "0106"
                    || this.mainVueProdNo.toString().substring(0, 6) === "001010") {
                    if (this.addOrEditPostForm.isEndStation === "1") {
                      this.minRateIsShow = true;
                      this.maxRateIsShow = false;
                    } else {
                      this.minRateIsShow = false;
                      this.maxRateIsShow = false;
                    }
                  } else if (this.mainVueProdNo.toString().substring(0, 6) === "001020") {
                    if (this.addOrEditPostForm.isEndStation === "1") {
                      this.minRateIsShow = false;
                      this.maxRateIsShow = true;
                    } else {
                      this.minRateIsShow = false;
                      this.maxRateIsShow = false;
                    }
                  } else {
                    this.minRateIsShow = false;
                    this.maxRateIsShow = false;
                  }
                  this.modeList = [];
                  this.addOrEditPostForm.list = [];
                  if (res.data.retData.list !== null) {
                    for (let i = 0, j = res.data.retData.list.length - 1; i < res.data.retData.list.length, j >= 0; i++, j--) {
                      this.addMode();
                      this.addOrEditPostForm.list[i].modeUserType = res.data.retData.list[j].modeUserType;
                      this.addOrEditPostForm.list[i].modeTellerType = res.data.retData.list[j].modeTellerType;
                      this.addOrEditPostForm.list[i].modeTimeType = res.data.retData.list[j].modeTimeType;
                      this.addOrEditPostForm.list[i].modelTotalAmt = res.data.retData.list[j].modelTotalAmt;
                    }
                  } else {
                    this.addOrEditPostForm.list = [];
                  }
                } else {
                  this.$msgTip.error(this, { info: msg });
                  this.$refs.datagrid.dataChange(1);
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          } else {
            this.addOrEditPostForm.id = "";
            this.modeList = [];
            this.addOrEditPostForm.list = [];
          }
        });
      },
      // 新增岗位/修改岗位页面提交
      addPostCommit() {
        this.$refs["addOrEditPostForm"].validate(valid => {
          if (valid) {
            if (this.addOrEditPostForm.isEndStation === "0") {
              this.addOrEditPostForm.auditStationLimit = "";
              this.addOrEditPostForm.isNeedNextAudit = "";
              this.addOrEditPostForm.stationBillMoneyLimit = "";
            } else if (this.addOrEditPostForm.isEndStation === "1") {
              this.addOrEditPostForm.auditStationLimit = this.addOrEditPostForm.auditStationLimit.toString().replace(/,/g, "");
              this.addOrEditPostForm.advanceEndCondition = [];
            }
            if (this.addOrEditPostForm.isNeedNextAudit !== "1") {
              this.addOrEditPostForm.stationBillMoneyLimit = "";
            }
            if (this.addOrEditPostForm.auditStationType !== "2") {
              this.addOrEditPostForm.auditUseBrchName = "";
              this.addOrEditPostForm.auditUseBrchNo = "";
            }
            let url = this.type === "add" ? "/bm/audit/auditRoute/func_insertAuditStation" : "/bm/audit/auditRoute/func_updateAuditStation";
            this.submitFlag = true;
            post(this.addOrEditPostForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.setRouteFormItem.auditStationName = this.addOrEditPostForm.auditStationName;
                  if (this.addOrEditPostForm.auditStationLimit != null) {
                    this.setRouteFormItem.auditStationLimit = this.addOrEditPostForm.auditStationLimit;
                  }
                  this.addOrEditPostWin = false;
                  this.getNewTreeData(this.setAuditRouteId);
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
      //子页面删除岗位
      deletePost() {
        let arr = this.$refs["TreeData"].getSelectedNodes();
        if (arr.length === 0) {
          this.$msgTip.info(this, { info: "请先选择左侧树节点！" });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t('m.i.common.confirm'),
          content: this.$t('m.i.bm.confirmDeleteStation') + '?',
          onOk: () => {
            let id = arr[0].id;
            post({ id: id }, "/bm/audit/auditRoute/func_deleteAuditStation").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this, { info: this.$t("m.i.common.deleteSuccess") });
                  this.getNewTreeData(this.setAuditRouteId);
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        })
      },
      //分配审批人员按钮
      handleRouteForm() {
        if (this.stationId === "" || this.stationId === null) {
          this.$msgTip.info(this, { info: "请先选择左侧树节点！" });
          return;
        }
        post({ id: this.stationId }, "/bm/audit/auditRoute/func_getAuditStationById").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.shuttleAuditStationType = res.data.retData.auditStationType;
              this.testReadonly();
              this.mockData = [];
              this.rightMockData = [];
              this.userMockData = [];
              this.rightUserMockData = [];
              this.getMockData();
              this.layer2 = true;
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //是否发布
      noIssueButton() {
        this.noIssueDisabled = true;
        this.hasIssueDisabled = false;
        this.formItem.isValid = "0";
        this.handleSearch();
      },
      hasIssueButton() {
        this.hasIssueDisabled = true;
        this.noIssueDisabled = false;
        this.formItem.isValid = "1";
        this.handleSearch();
      },
      //发布按钮
      releaseRouteForm(type) {
        this.type = type;
        if (!this.selectData) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (this.type === "release") {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确认要发布吗?",
            onOk: () => {
              this.handleReleaseRoute();
            }
          });
        }
        if (this.type === "cancel") {
          let userBrchNo = this.$store.getters.userInfo.brchNo;
          if (this.selectData.auditCreateBrchNo !== userBrchNo) {
            this.$msgTip.info(this, { info: "操作柜员所属机构非审批路线创建机构，不允许撤销发布！" });
            return;
          }
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确认要撤销发布吗?",
            onOk: () => {
              this.handleReleaseRoute();
            }
          });
        }
      },
      handleReleaseRoute() {
        let ids = this.selectData.id;
        if (this.type === "release") {
          this.isValids = "1";
        }
        if (this.type === "cancel") {
          this.isValids = "0";
        }
        post({ id: ids, isValid: this.isValids }, "/bm/audit/auditRoute/func_releaseAuditRoute").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.selectData = null;
            } else {
              this.$msgTip.error(this, { info: msg });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      formatBillMoney(optType) {
        if (optType === "blur") {
          if (!isNaN(parseFloat(this.addOrEditPostForm.auditStationLimit)) && isFinite(this.addOrEditPostForm.auditStationLimit)) {
            this.addOrEditPostForm.auditStationLimit = this.addOrEditPostForm.auditStationLimit == null ? "0.00" : formatNumber(this.addOrEditPostForm.auditStationLimit, 2, ",");
          }
        } else if (optType === "focus") {
          this.addOrEditPostForm.auditStationLimit = this.addOrEditPostForm.auditStationLimit.replace(/,/g, "");
        }
      },
      //审批额度begin
      changeStatus() {
        this.getMockData();
      },
      // 新增审批额度模式设置
      addMode() {
        this.modeList.push({ no: "2" });
        this.addOrEditPostForm.list.push({
          modeUserType: "",
          modeTellerType: "",
          modeTimeType: "",
          modelTotalAmt: ""
        });
      },
      // 删除审批额度模式设置
      deleteMode(index) {
        this.modeList.splice(index, 1);
        this.addOrEditPostForm.list.splice(index, 1);
      },
      //审批额度end
      //穿梭框begin
      getMockData() {
        if (this.assignRoleFormItem.auditChoiceUser === "1") {
          this.auditUser = false;
          this.auditRole = true;
          this.queryRole();
        }
        if (this.assignRoleFormItem.auditChoiceUser === "2") {
          this.auditRole = false;
          this.auditUser = true;
          this.queryUser();
        }

      },
      //初始化查询角色
      queryRole() {
        this.queryRoleFormItem.auditStationId = this.stationId;
        post(this.queryRoleFormItem, "/bm/audit/auditRoute/func_pageQueryRoleListByStationId").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.mockData = [];
              for (let i = 0; i < res.data.retData.list.length; i++) {
                this.mockData.push({
                  key: res.data.retData.list[i].id,
                  label: res.data.retData.list[i].roleName
                });
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
        post(this.queryRoleFormItem, "/bm/audit/auditRoute/func_pageQueryAuditStationRoleList").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.rightMockData = [];
              this.stationRoleId = [];
              for (let i = 0; i < res.data.retData.list.length; i++) {
                this.rightMockData.push(res.data.retData.list[i].roleId);
                this.stationRoleId.push(res.data.retData.list[i].id);
              }
              this.oldRightMockData = this.rightMockData;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //初始化查询用户
      queryUser() {
        //分配用户beg
        this.queryUserFormItem.auditStationId = this.stationId;
        post(this.queryUserFormItem, "/bm/audit/auditRoute/func_pageQueryUserListByStationId").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.userMockData = [];
              for (let i = 0; i < res.data.retData.list.length; i++) {
                this.userMockData.push({
                  key: res.data.retData.list[i].userId,
                  label: res.data.retData.list[i].userName
                });
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
        post(this.queryUserFormItem, "/bm/audit/auditRoute/func_pageQueryAuditStationUserList").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.rightUserMockData = [];
              this.stationUserId = [];
              for (let i = 0; i < res.data.retData.list.length; i++) {
                this.rightUserMockData.push(res.data.retData.list[i].userId);
                this.stationUserId.push(res.data.retData.list[i].id);
              }
              this.oldRightUserMockData = deepClone(this.rightUserMockData);
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
        //分配用户end
      },

      //穿梭框点击实现
      handleChangeMock(newTargetKeys) {
        if (this.assignRoleFormItem.auditChoiceUser === "1") {
          this.rightMockData = newTargetKeys;
        }
        if (this.assignRoleFormItem.auditChoiceUser === "2") {
          this.rightUserMockData = newTargetKeys;
        }
      },
      //穿梭框目标格式
      renderMock(item) {
        return item.label;
      },
      submitShuttleBox() {
        //分配角色
        if (this.assignRoleFormItem.auditChoiceUser === "1") {
          //若进入时查询授权角色为空，点击提交，关闭界面，不更改
          if (this.oldRightMockData.length === 0 && this.rightMockData.length === 0) {
            this.$msgTip.info(this, { info: "请先分配角色" });
            return;
          } else {
            //循环判断，若未修改，则关闭界面，不更改
            let count = 0;
            for (let i = 0; i < this.oldRightMockData.length; i++) {
              for (let j = 0; j < this.rightMockData.length; j++) {
                if (this.oldRightMockData[i] === this.rightMockData[j]) {
                  count++;
                }
              }
            }
            if (count === this.oldRightMockData.length) {
              this.layer2 = false;
            }
          }
          if (this.oldRightMockData.length !== 0 && this.rightMockData.length === 0) {
            //已发布流程删除全部用户或角色
            if(this.hasIssueDisabled){
              this.$msgTip.info(this, { info: "当前流程已发布，不允许删除岗位分配的全部角色！" });
              return;
            }
            this.deleteAuditStationRole();
            this.layer2 = false;
          }
          if (this.oldRightMockData.length === 0 && this.rightMockData.length !== 0) {
            this.addAuditStationRole();
            this.layer2 = false;
          }
          if (this.oldRightMockData.length !== 0 && this.rightMockData.length !== 0) {
            this.deleteAuditStationRole();
            this.addAuditStationRole();
            this.layer2 = false;
          }
        }
        if (this.assignRoleFormItem.auditChoiceUser === "2") {
          //若进入时查询授权用户为空，点击提交，关闭界面，不更改
          if (this.oldRightUserMockData.length === 0 && this.rightUserMockData.length === 0) {
            this.$msgTip.info(this, { info: "请先分配用户" });
            return;
          } else if (this.shuttleAuditStationType === "3" && (this.rightUserMockData.length !== 0) && (this.rightUserMockData.length % 2) === 0) {
            this.$msgTip.info(this, { info: "会签岗位分配用户时，仅能指定个数为奇数的人员！" });
            return;
          } else {
            //循环判断，若未修改，则关闭界面，不更改
            let userCount = 0;
            for (let i = 0; i < this.oldRightUserMockData.length; i++) {
              for (let j = 0; j < this.rightUserMockData.length; j++) {
                if (this.oldRightUserMockData[i] === this.rightUserMockData[j]) {
                  userCount++;
                }
              }
            }
            if (this.oldRightUserMockData.length !== 0 && userCount === this.rightUserMockData.length && userCount === this.oldRightUserMockData.length) {
              this.layer2 = false;
              return;
            }
          }
          if (this.oldRightUserMockData.length !== 0 && this.rightUserMockData.length === 0) {

            //已发布流程删除全部用户或角色
            if(this.hasIssueDisabled){
              this.$msgTip.info(this, { info: "当前流程已发布，不允许删除岗位分配的全部用户！" });
              return;
            }
            this.deleteAuditStationUser();
            this.layer2 = false;
            return;
          }
          if (this.oldRightUserMockData.length === 0 && this.rightUserMockData.length !== 0) {
            this.addAuditStationUser();
            this.layer2 = false;
            return;
          }
          if (this.oldRightUserMockData.length !== 0 && this.rightUserMockData.length !== 0) {
            this.deleteAuditStationUser();
            this.addAuditStationUser();
            this.layer2 = false;
            return;
          }
        }
      },
      //删除已分配用户
      deleteAuditStationUser() {
        let userIds = "";
        for (let i = 0; i < this.stationUserId.length; i++) {
          userIds += this.stationUserId[i];
          if (i < this.stationUserId.length - 1) {
            userIds += ",";
          }
        }
        this.deleteAuditStationUserFormItem.userIds = userIds;
        post(this.deleteAuditStationUserFormItem, "/bm/audit/auditRoute/func_deleteAuditStationUserByUserIds").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //新增用户权限
      addAuditStationUser() {
        let userIds = "";
        for (let i = 0; i < this.rightUserMockData.length; i++) {
          userIds += this.rightUserMockData[i];
          if (i < this.rightUserMockData.length - 1) {
            userIds += ",";
          }
        }
        this.addAuditStationUserFormItem.userIds = userIds;
        this.addAuditStationUserFormItem.auditStationId = this.stationId;
        post(this.addAuditStationUserFormItem, "/bm/audit/auditRoute/func_insertAuditStationUser").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //删除已分配角色
      deleteAuditStationRole() {
        let roleIds = "";
        for (let i = 0; i < this.stationRoleId.length; i++) {
          roleIds += this.stationRoleId[i];
          if (i < this.stationRoleId.length - 1) {
            roleIds += ",";
          }
        }
        this.deleteAuditStationRoleFormItem.roleIds = roleIds;
        post(this.deleteAuditStationRoleFormItem, "/bm/audit/auditRoute/func_deleteAuditStationRoleByRoleIds").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.addAuditStationRole();
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //新增角色权限
      addAuditStationRole() {
        let roleIds = "";
        for (let i = 0; i < this.rightMockData.length; i++) {
          roleIds += this.rightMockData[i];
          if (i < this.rightMockData.length - 1) {
            roleIds += ",";
          }
        }
        this.addAuditStationRoleFormItem.roleIds = roleIds;
        this.addAuditStationRoleFormItem.auditStationId = this.stationId;
        post(this.addAuditStationRoleFormItem, "/bm/audit/auditRoute/func_insertAuditStationRole").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      closeShuttleBox() {
        this.layer2 = false;
      },
      recursiveAssigNode(menuTreeData, arr) {
        this.flag = false;
        for (let i = 0; i < menuTreeData.length; i++) {
          if (this.flag) {
            break;
          }
          if (menuTreeData[i].id === arr.id) {
            menuTreeData[i] = arr;
            this.flag = true;
            break;
          }
          if (menuTreeData[i].children) {
            this.recursiveAssigNode(menuTreeData[i].children, arr)
          }
        }
      },
      isAllExpand(arr) {
        this.flag = true;
        for (let i = 0; i < arr.length; i++) {
          if (!this.flag) {
            break;
          }
          if (arr[i].expand === false && arr[i].children) {
            this.flag = false;
            break;
          }
          if (arr[i].children) {
            this.isAllExpand(arr[i].children)
          }
        }
      },
      toggleExpand(arr, status) {
        let closeCount = 0;
        this.recursiveAssigNode(this.TreeData, arr);
        this.isAllExpand(this.TreeData);
        // 完全收缩
        for (let i = 0; i < this.TreeData.length; i++) {
          if (this.TreeData[i].expand === false) {
            closeCount++;
          }
        }
        if (closeCount === this.TreeData.length) {
          this.isExpandDisabled = false;
          this.isNotExpandDisabled = true;
          return;
        }
        if(!this.flag){
          this.isExpandDisabled = false;
          this.isNotExpandDisabled = false;
        }else{
          this.isExpandDisabled = true;
          this.isNotExpandDisabled = false;
        }

      },
      auditStationTypeChange(){
        debugger;
        let auditStationType=this.addOrEditPostForm.auditStationType;
        if(auditStationType&&"3"===auditStationType&&!this.hasIssueDisabled){
          this.addOrEditPostForm.isEndStation="0";
          this.isEndStationReadonly=true;
        }else{
          this.isEndStationReadonly=false;
        }
      }
      //穿梭框end
    },
    mounted() {
      this.getDictListByGroups("Yon,AuditStationType,BranchLevel,ModeUserType,ModeTellerType,ModeTimeType,AuditChoiceUser,AuditDraftTypeCode,AuditCDMedia,AuditType,AuditRouteRiskType,AdvanceEndCondition").then(res => {
        this.auditTypeList = res.get("AuditType");
        this.billClassList = res.get("AuditCDMedia");
        this.billTypeList = res.get("AuditDraftTypeCode");
        this.auditChoiceUserList = res.get("AuditChoiceUser");
        this.modeTimeTypeList = res.get("ModeTimeType");
        this.modeTellerTypeList = res.get("ModeTellerType");
        this.modeUserTypeList = res.get("ModeUserType");
        this.auditNodeBrchLevelList = res.get("BranchLevel");
        this.auditStationTypeList = res.get("AuditStationType");
        this.YonList = res.get("Yon");
        this.advanceEndConditionList = res.get("AdvanceEndCondition");
        this.auditRouteRiskTypeList=res.get("AuditRouteRiskType");
        this.dictMap = res.get("map");
      });
      post({ paramKey: "ce.disc.is_check_guide_rate" }, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            let auditMode = res.data.retData
            if (auditMode == '1') {
              this.showDiscCheckGuideInput = true;
            }
          }
        }
      });
      post({ paramKey: "be.market.rebuy_check_guide_rate_prod" }, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            let auditMode = res.data.retData
            if (auditMode != null && auditMode != null && auditMode != undefined && auditMode != "|") {
              this.showCheckGuideInput = true;
              this.rebuyCheckProds = auditMode.split("|");
            }
          }
        }
      });

      //获取是否开启交易授权参数值
      post({ paramKey: "pc.flow.is_open_short_audit" }, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            let transAuth = res.data.retData
            if (transAuth === "1" ) {
              this.showShortAuditInput = true;
            } else {
              this.showShortAuditInput = false;
            }
          }
        }
      });

      //获取是否开启单张票据金额超过限额是否需要下一岗审批控制
      post({ paramKey: "pc.flow.is_open_bill_limit_control" }, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            let transAuth = res.data.retData
            if (transAuth === "1" ) {
              this.showBillLimitCheck = true;
            } else {
              this.showBillLimitCheck = false;
            }
          }
        }
      });

    },
    watch:{
      'addOrEditForm.auditProdNo'(val){
        if (!!val&&val.startsWith("01")) {
          this.showAuditRiskTypeItem=true
        }else {
          this.showAuditRiskTypeItem=false
          this.addOrEditForm.auditRouteRiskType="0"
        }
        //判断支付审批票据种类、介质不能选
        if (!!val&&val.startsWith("0211")) {
          this.isPayAudit=true;
          this.addOrEditForm.billClass="ME00";
          this.addOrEditForm.billType="AC00";
        }else {
          this.isPayAudit=false;
        }
      }
    }
  };
</script>

<style scoped>

</style>
