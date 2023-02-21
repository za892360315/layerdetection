<template>
  <el-row
    v-loading="loading"
    element-loading-text="截图中，请勿乱动"
    element-loading-spinner="el-icon-loading"
    style="height: 60vh; font-size: 14px"
  >
    <el-row style="margin-top: 10px">
      <el-row>
        <i
          class="iconmodule iconfont"
          style="color: #3977f4; margin-right: 5px"
        />基本信息</el-row
      >
      <el-row>
        <el-col :span="6" :title="form.name" class="information-col"
          >项目名称：{{ form.name }}</el-col
        >
        <el-col :span="6" :title="form.department" class="information-col"
          >建设单位：{{ form.department }}</el-col
        >
        <el-col :span="6" :title="geometryYdxz" class="information-col"
          >用地性质：{{ geometryYdxz }}</el-col
        >
        <el-col :span="6" class="information-col"
          >用地面积：{{ geometryArea }} ㎡</el-col
        >
      </el-row>
    </el-row>
    <el-row style="font-size: 14px">
      <i
        class="iconmodule iconfont"
        style="color: #3977f4; margin-right: 5px"
      />检测结果</el-row
    >
    <el-row style="height: calc(100% - 90px)">
      <el-col :span="8" style="height: 100%">
        <el-scrollbar style="height: 100%">
          <div class="analysis-container">
            <div
              v-for="(item, index1) of analysisData"
              :key="index1"
              class="item"
            >
              <div v-if="item.data.length > 0" class="title">
                <div class="img"></div>
                <div>{{ item.displayName }}</div>
              </div>
              <div v-if="item.data.length > 0" class="content">
                <div class="line"></div>
                <div class="project">
                  <div
                    v-for="(element, index) of item.data"
                    :key="index"
                    :class="
                      currentPanel === element.displayName ? 'activeTip' : ''
                    "
                    class="tip"
                    @click="showDetailPanel(element)"
                  >
                    <span>{{ index + 1 }}</span>
                    <div :title="element.displayName" class="name">
                      {{ element.displayName }}
                    </div>
                    <div class="menu-result">
                      <div
                        v-if="element.loading"
                        class="el-icon-loading iconfont"
                      ></div>
                      <div v-else-if="element.analysis === 'fail'">
                        请求失败
                      </div>
                      <div
                        v-else-if="
                          element.displayName.includes('控制性详细规划检测') &&
                          element.tableResult.isVisible &&
                          element.tableResult
                        "
                      >
                        查看
                      </div>
                      <div
                        v-else-if="
                          element.displayName.includes('涉及') &&
                          element.tableResult
                        "
                      >
                        {{ element.tableResult.isOccupy ? '涉及' : '不涉及' }}
                      </div>
                      <div
                        v-else-if="element.displayName && element.tableResult"
                      >
                        {{ element.tableResult.isOccupy ? '是' : '否' }}
                      </div>
                      <div v-else class="analysis-img"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </el-col>
      <el-col :span="16" style="height: 100%">
        <el-scrollbar style="height: calc(100% - 33px)">
          <div
            v-for="(item, index) in analysisData"
            :key="index"
            class="result-container"
          >
            <div
              v-for="(childrenItem, childrenIndex) in item.data"
              :key="childrenIndex"
            >
              <div
                v-if="
                  childrenItem.tableResult &&
                  currentPanel === childrenItem.displayName
                "
                class="result"
              >
                <div class="title">
                  <span v-if="childrenItem.displayName.includes('符合')"
                    >{{ childrenItem.displayName }}：{{
                      childrenItem.tableResult.isOccupy ? '否' : '是'
                    }}</span
                  >
                  <span v-else
                    >{{ childrenItem.displayName }}：{{
                      childrenItem.tableResult.isOccupy ? '是' : '否'
                    }}</span
                  >
                  <span
                    v-if="
                      childrenItem.tableResult.isOccupy &&
                      childrenItem.tableResult.landArea
                    "
                    class="area"
                    >占地总面积(m²)：{{ childrenItem.tableResult.landArea }}
                  </span>
                  <el-dropdown
                    v-if="layersTree.length > 0"
                    size="mini"
                    style="position: absolute; right: 0px"
                  >
                    <el-button type="primary" size="mini">
                      检测图层<i class="el-icon-arrow-down el-icon--right" />
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-row
                        v-for="tree in layersTree"
                        :key="tree.name"
                        class="checkboxGroup"
                      >
                        <el-checkbox v-model="tree.isShow">{{
                          tree.displayName
                        }}</el-checkbox>
                      </el-row>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
                <div
                  v-if="
                    childrenItem.tableResult.isOccupy ||
                    childrenItem.tableResult.isVisible
                  "
                  class="table"
                >
                  <el-table
                    v-if="childrenItem.displayName === '是否占用耕地'"
                    :data="childrenItem.tableResult.analysisResult"
                    style="width: 100%"
                  >
                    <el-table-column
                      v-for="(
                        landKyesItem, landKeysIndex
                      ) of childrenItem.landKeys"
                      :key="landKeysIndex"
                      :prop="landKyesItem.key"
                      :label="landKyesItem.name"
                    >
                      <template slot-scope="scope">
                        {{ scope.row[landKyesItem.key] }}
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-table
                    v-if="childrenItem.displayName === '是否占用永久基本农田'"
                    :data="childrenItem.tableResult.analysisResult"
                    style="width: 100%"
                  >
                    <el-table-column
                      v-for="(
                        landKyesItem, landKeysIndex
                      ) of childrenItem.landKeys"
                      :key="landKeysIndex"
                      :prop="landKyesItem.key"
                      :label="landKyesItem.name"
                    >
                      <template slot-scope="scope">
                        {{
                          landKyesItem.key === '小计'
                            ? scope.row[landKyesItem.key]
                            : scope.row[landKyesItem.key].toFixed(2)
                        }}
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-table
                    v-if="childrenItem.displayName === '是否占用林地'"
                    :data="childrenItem.tableResult.analysisResult"
                    style="width: 100%"
                  >
                    <el-table-column label="占用林地情况(m²)">
                      <el-table-column label="林地保护等级" width="200">
                        <template slot-scope="scope">
                          <el-row
                            ><el-col :span="12" class="display border-right">{{
                              scope.row.level
                            }}</el-col
                            ><el-col :span="12" class="display">{{
                              scope.row.levelArea
                            }}</el-col></el-row
                          >
                        </template>
                      </el-table-column>
                      <el-table-column label="森林类别">
                        <template slot-scope="scope">
                          <el-row v-if="scope.row.bothName"
                            ><el-col :span="6" class="display border-right">{{
                              scope.row.name
                            }}</el-col
                            ><el-col :span="6" class="display border-right">{{
                              scope.row.area
                            }}</el-col
                            ><el-col :span="6" class="display border-right">{{
                              scope.row.bothName
                            }}</el-col
                            ><el-col :span="6" class="display">{{
                              scope.row.bothArea
                            }}</el-col></el-row
                          ><el-row v-else
                            ><el-col :span="6" class="display">{{
                              scope.row.name
                            }}</el-col
                            ><el-col :span="18" class="display">{{
                              scope.row.area
                            }}</el-col></el-row
                          >
                        </template>
                      </el-table-column>
                    </el-table-column>
                  </el-table>
                  <el-table
                    v-if="childrenItem.displayName === '是否涉及新增建设用地'"
                    :data="childrenItem.tableResult.analysisResult"
                    style="width: 100%"
                  >
                    <el-table-column
                      v-for="(
                        landKyesItem, landKeysIndex
                      ) of childrenItem.landKeys"
                      :key="landKeysIndex"
                      :prop="landKyesItem.key"
                      :label="landKyesItem.name"
                    >
                      <template slot-scope="scope">
                        {{
                          landKyesItem.key === '小计'
                            ? scope.row[landKyesItem.key]
                            : scope.row[landKyesItem.key].toFixed(2)
                        }}
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-table
                    v-if="childrenItem.displayName === '是否涉及用海'"
                    :data="childrenItem.tableResult.analysisResult"
                    style="width: 100%"
                  >
                    <el-table-column
                      v-for="(
                        landKyesItem, landKeysIndex
                      ) of childrenItem.landKeys"
                      :key="landKeysIndex"
                      :prop="landKyesItem.key"
                      :label="landKyesItem.name"
                    >
                      <template slot-scope="scope">
                        {{
                          landKyesItem.key === '涉及情况'
                            ? scope.row[landKyesItem.key]
                            : scope.row[landKyesItem.key].toFixed(2)
                        }}
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-table
                    v-if="childrenItem.displayName === '是否占用湿地'"
                    :data="childrenItem.tableResult.analysisResult"
                    style="width: 100%"
                  >
                    <el-table-column
                      v-for="(
                        landKyesItem, landKeysIndex
                      ) of childrenItem.landKeys"
                      :key="landKeysIndex"
                      :prop="landKyesItem.key"
                      :label="landKyesItem.name"
                    >
                    </el-table-column>
                  </el-table>
                  <el-table
                    v-if="childrenItem.displayName === '是否涉及古树名木'"
                    :data="childrenItem.tableResult.analysisResult"
                    style="width: 100%"
                  >
                    <el-table-column label="涉及古树名木情况">
                      <template slot-scope="scope">
                        <el-row
                          ><el-col :span="12" class="display border-right">{{
                            scope.row.name
                          }}</el-col
                          ><el-col :span="12" class="display">{{
                            scope.row.count
                          }}</el-col></el-row
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-table
                    v-if="childrenItem.displayName === '是否涉及已供应土地'"
                    :data="childrenItem.tableResult.analysisResult"
                    style="width: 100%"
                  >
                    <el-table-column label="与已供应土地重叠情况（㎡）">
                      <template slot-scope="scope">
                        <el-row
                          ><el-col :span="12" class="display border-right">{{
                            scope.row.name
                          }}</el-col
                          ><el-col :span="12" class="display">{{
                            scope.row.count
                          }}</el-col></el-row
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-table
                    v-if="
                      childrenItem.displayName === '是否位于城市建设用地范围内'
                    "
                    :data="childrenItem.tableResult.analysisResult"
                    style="width: 100%"
                  >
                    <el-table-column label="城市建设用地范围比对情况（㎡）">
                      <template slot-scope="scope">
                        <el-row
                          ><el-col :span="12" class="display border-right">{{
                            scope.row.name
                          }}</el-col
                          ><el-col :span="12" class="display">{{
                            scope.row.area
                          }}</el-col></el-row
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-table
                    v-if="
                      childrenItem.displayName ===
                      '是否位于建设用地管制区范围内'
                    "
                    :data="childrenItem.tableResult.analysisResult"
                    :span-method="landeSpanMethod"
                    style="width: 100%"
                  >
                    <el-table-column label="建设用地管制区范围比对情况（㎡）">
                      <el-table-column prop="layerName" label="名称">
                      </el-table-column>
                      <el-table-column prop="type" label="类型">
                      </el-table-column>
                      <el-table-column prop="area" label="面积">
                      </el-table-column>
                    </el-table-column>
                  </el-table>
                  <el-table
                    v-if="childrenItem.displayName === '控制性详细规划检测'"
                    :data="childrenItem.tableResult.analysisResult"
                    style="width: 100%"
                  >
                    <el-table-column label="控制线详细规划比对情况">
                      <template slot-scope="scope">
                        <el-row v-if="scope.row.value"
                          ><el-col :span="12" class="display border-right">{{
                            scope.row.name
                          }}</el-col
                          ><el-col :span="12" class="display">{{
                            scope.row.value
                          }}</el-col></el-row
                        >
                        <el-row v-else
                          ><el-col class="display">{{
                            scope.row.name
                          }}</el-col></el-row
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-table
                    v-if="childrenItem.displayName === '是否涉及海洋功能区划'"
                    :data="childrenItem.tableResult.analysisResult"
                    style="width: 100%"
                  >
                    <el-table-column label="海洋功能区划比对情况（㎡）">
                      <template slot-scope="scope">
                        <el-row
                          ><el-col :span="12" class="display border-right">{{
                            scope.row.type
                          }}</el-col
                          ><el-col :span="12" class="display">{{
                            scope.row.area
                          }}</el-col></el-row
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-table
                    v-if="childrenItem.displayName === '是否涉及生态保护红线'"
                    :data="childrenItem.tableResult.analysisResult"
                    :span-method="ecologicalSpanMethod"
                    style="width: 100%"
                  >
                    <el-table-column label="生态保护红线比对情况（㎡）">
                      <el-table-column label="名称" prop="layerName">
                      </el-table-column>
                      <el-table-column label="面积">
                        <template slot-scope="scope">
                          <el-row v-if="scope.row.type"
                            ><el-col :span="12" class="display border-right">{{
                              scope.row.type
                            }}</el-col
                            ><el-col :span="12" class="display">{{
                              scope.row.area
                            }}</el-col></el-row
                          >
                          <el-row v-else
                            ><el-col class="display">{{
                              scope.row.area
                            }}</el-col></el-row
                          >
                        </template></el-table-column
                      >
                    </el-table-column>
                  </el-table>
                  <el-table
                    v-if="childrenItem.displayName === '是否涉及生态控制线'"
                    :data="childrenItem.tableResult.analysisResult"
                    style="width: 100%"
                  >
                    <el-table-column label="生态控制线比对情况（㎡）">
                      <template slot-scope="scope">
                        <el-row
                          ><el-col :span="12" class="display border-right">{{
                            scope.row.name
                          }}</el-col
                          ><el-col :span="12" class="display">{{
                            scope.row.area
                          }}</el-col></el-row
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-table
                    v-if="childrenItem.displayName === '是否涉及国家自然保护区'"
                    :data="childrenItem.tableResult.analysisResult"
                    style="width: 100%"
                  >
                    <el-table-column label="国家自然保护区比对情况（㎡）">
                      <template slot-scope="scope">
                        <el-row
                          ><el-col :span="12" class="display border-right">{{
                            scope.row.type
                          }}</el-col
                          ><el-col :span="12" class="display">{{
                            scope.row.area
                          }}</el-col></el-row
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-table
                    v-if="
                      childrenItem.displayName ===
                      '是否涉及厦门国家级海洋公园总体规划'
                    "
                    :data="childrenItem.tableResult.analysisResult"
                    style="width: 100%"
                  >
                    <el-table-column
                      label="厦门国家级海洋公园总体规划比对情况（㎡）"
                    >
                      <template slot-scope="scope">
                        <el-row
                          ><el-col :span="12" class="display border-right">{{
                            scope.row.type
                          }}</el-col
                          ><el-col :span="12" class="display">{{
                            scope.row.area
                          }}</el-col></el-row
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-table
                    v-if="childrenItem.displayName === '是否位于地质灾害易发区'"
                    :data="childrenItem.tableResult.analysisResult"
                    style="width: 100%"
                  >
                    <el-table-column label="地质灾害点及易发区比对情况（㎡）">
                      <template slot-scope="scope">
                        <el-row
                          ><el-col :span="12" class="display border-right">{{
                            scope.row.type
                          }}</el-col
                          ><el-col :span="12" class="display">{{
                            scope.row.area
                          }}</el-col></el-row
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-table
                    v-if="
                      childrenItem.displayName === '是否涉及轨道收储平衡用地'
                    "
                    :data="childrenItem.tableResult.analysisResult"
                    style="width: 100%"
                  >
                    <el-table-column label="轨道收储平衡用地比对情况（㎡）">
                      <template slot-scope="scope">
                        <el-row v-if="scope.row.typeStr"
                          ><el-col :span="6" class="display border-right">{{
                            scope.row.type
                          }}</el-col>
                          <el-col :span="6" class="display border-right">{{
                            scope.row.area
                          }}</el-col>
                          <el-col :span="6" class="display border-right">{{
                            scope.row.name
                          }}</el-col
                          ><el-col :span="6" class="display">{{
                            scope.row.typeStr
                          }}</el-col></el-row
                        >
                        <el-row v-else
                          ><el-col :span="12" class="display">{{
                            scope.row.type
                          }}</el-col>
                          <el-col :span="12" class="display">{{
                            scope.row.area
                          }}</el-col></el-row
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-table
                    v-if="childrenItem.displayName === '是否涉及文物保护范围'"
                    :data="childrenItem.tableResult.analysisResult"
                    style="width: 100%"
                  >
                    <el-table-column label="文物保护范围比对情况">
                      <template slot-scope="scope">
                        <el-row v-if="scope.row.area"
                          ><el-col :span="12" class="display border-right">{{
                            scope.row.type
                          }}</el-col
                          ><el-col :span="12" class="display">{{
                            scope.row.area
                          }}</el-col></el-row
                        >
                        <el-row v-else
                          ><el-col class="display">{{
                            scope.row.type
                          }}</el-col></el-row
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-table
                    v-if="
                      childrenItem.displayName ===
                      '是否涉及气象探测环境保护规划要求'
                    "
                    :data="childrenItem.tableResult.analysisResult"
                    style="width: 100%"
                  >
                    <el-table-column label="气象探测保护规划比对情况">
                      <template slot-scope="scope">
                        <el-row
                          ><el-col :span="8" class="display border-right">{{
                            scope.row.name
                          }}</el-col
                          ><el-col :span="8" class="display border-right">{{
                            scope.row.isInvolve
                          }}</el-col
                          ><el-col :span="8" class="display">{{
                            scope.row.minHeight
                          }}</el-col></el-row
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-table
                    v-if="childrenItem.displayName === '是否位于风景名胜区内'"
                    :data="childrenItem.tableResult.analysisResult"
                    style="width: 100%"
                  >
                    <el-table-column label="风景名胜区比对情况（㎡）">
                      <template slot-scope="scope">
                        <el-row
                          ><el-col :span="12" class="display border-right">{{
                            scope.row.type
                          }}</el-col
                          ><el-col :span="12" class="display">{{
                            scope.row.area
                          }}</el-col></el-row
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-table
                    v-if="childrenItem.displayName === '是否涉及轨道保护线'"
                    :data="childrenItem.tableResult.analysisResult"
                    style="width: 100%"
                  >
                    <el-table-column label="轨道交通安全保护区范围比对情况">
                      <template slot-scope="scope">
                        <el-row
                          ><el-col class="display">{{
                            scope.row.isOccupy
                          }}</el-col></el-row
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-table
                    v-if="childrenItem.displayName === '是否涉及铁路安全保护区'"
                    :data="childrenItem.tableResult.analysisResult"
                    style="width: 100%"
                  >
                    <el-table-column label="铁路安全保护区范围比对情况">
                      <template slot-scope="scope">
                        <el-row
                          ><el-col class="display">{{
                            scope.row.isOccupy
                          }}</el-col></el-row
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-table
                    v-if="
                      childrenItem.displayName ===
                      '是否涉及河道水系生态蓝线保护范围'
                    "
                    :data="childrenItem.tableResult.analysisResult"
                    style="width: 100%"
                  >
                    <el-table-column label="河道水系生态蓝线保护范围比对情况">
                      <template slot-scope="scope">
                        <el-row
                          ><el-col :span="12" class="display border-right">{{
                            scope.row.name
                          }}</el-col>
                          <el-col :span="12" class="display">{{
                            scope.row.isInvolve
                          }}</el-col></el-row
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-table
                    v-if="childrenItem.displayName === '是否涉及安全控制区域'"
                    :data="childrenItem.tableResult.analysisResult"
                    style="width: 100%"
                  >
                    <el-table-column label="安全控制区域比对情况">
                      <template slot-scope="scope">
                        <el-row
                          ><el-col :span="12" class="display border-right">{{
                            scope.row.name
                          }}</el-col>
                          <el-col :span="12" class="display">{{
                            scope.row.area
                          }}</el-col></el-row
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-table
                    v-if="childrenItem.displayName === '是否位于工业控制线内'"
                    :data="childrenItem.tableResult.analysisResult"
                    style="width: 100%"
                  >
                    <el-table-column label="工业控制线比对情况">
                      <template slot-scope="scope">
                        <el-row
                          ><el-col :span="12" class="display border-right">{{
                            scope.row.name
                          }}</el-col>
                          <el-col :span="12" class="display">{{
                            scope.row.area
                          }}</el-col></el-row
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-table
                    v-if="childrenItem.displayName === '是否位于特别控制区'"
                    :data="childrenItem.tableResult.analysisResult"
                    style="width: 100%"
                  >
                    <el-table-column label="特别控制区比对情况">
                      <template slot-scope="scope">
                        <el-row
                          ><el-col :span="12" class="display border-right">{{
                            scope.row.name
                          }}</el-col>
                          <el-col :span="12" class="display">{{
                            scope.row.area
                          }}</el-col></el-row
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
                <div
                  v-if="
                    childrenItem.projectList &&
                    childrenItem.tableResult.isOccupy &&
                    childrenItem.projectList.length > 0
                  "
                  class="projectList-title"
                >
                  <el-row>涉及项目列表</el-row>
                  <el-table
                    :data="childrenItem.projectList"
                    style="width: 100%"
                    height="300"
                    @row-click="handleClick"
                  >
                    <el-table-column
                      prop="name"
                      label="项目名称"
                      align="center"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="pzwh"
                      label="批准文号"
                      align="center"
                    >
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </div>
        </el-scrollbar>
        <!-- <el-button class="btn-export" @click="exportWord">导出报告</el-button> -->
      </el-col>
    </el-row>
  </el-row>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
// import config from '../../../modules/appConfig'
// import { changeExtent, defaultScreenshot } from '../../../modules/esriCommand'
import { getMainView, getModules } from '~/modules/arcgisAPI'

import { exportPlanCheckWord } from '~/modules/js/downtemplater'
@Component({
  name: 'OneDetectionResult',
})
export default class extends Vue {
  @Prop({ default: () => {} }) private form!: any
  @Prop({ default: () => 0 }) private geometryArea!: any
  @Prop({ default: () => '' }) private geometryYdxz!: string
  @Prop({ default: () => '' }) private geometryXzq!: string
  @Prop({ default: () => {} }) private resultsContent!: any

  analysisData: any = [] // 总数据
  currentPanel: string = ''
  landSpanArr: any = [] // 是否位于建设用地管制区范围内 合并项
  ecologicalSpanArr: any = [] // 是否符合生态保护红线 合并项
  featureLayer = null
  layerMap = new Map()
  layersTree: any = []
  layerArray: any = []
  image: any = null // 地块范围截图
  detectCategoryMap = new Map()
  loading = false
  projectList = []
  dkfw = null

  @Watch('resultsContent', { deep: true, immediate: true })
  changeResultsContent(newVal: any) {
    this.analysisData = JSON.parse(newVal)
    // console.log('%c [ this.analysisData ]-811', 'font-size:13px; background:pink; color:#bf2c9f;', this.analysisData)
    this.dataClassify()
    this.resetDKFW()
    this.layerArray.forEach((element: any) => {
      element.visible = false
    })
  }

  @Watch('layersTree', { deep: true, immediate: true })
  onLayersTreeChange(value: any[]) {
    if (value.length === 0) {
      return
    }
    this.layerArray = []
    for (const item of value) {
      const url = item.serviceUrl
      const isShow = item.isShow
      this.setLayer(url, isShow)
    }
  }

  resetDKFW() {
    if (this.dkfw) {
      const view = getMainView()
      view.graphics.remove(this.dkfw)
    }
  }

  async handleClick(row: any) {
    try {
      const view = getMainView()
      const [Polygon, Graphic] = await getModules([
        'esri/geometry/Polygon',
        'esri/Graphic',
      ])
      const polygon = new Polygon({
        rings: row.geometry.rings,
        spatialReference: view.spatialReference,
      })
      //   const polygon = new config.esriConstructors.Polygon({
      //     rings: row.geometry.rings,
      //     spatialReference: view.spatialReference,
      //   })
      const fillSymbol = {
        type: 'simple-fill',
        color: [227, 139, 79, 0.8],
        outline: {
          color: [0, 0, 0],
          width: 2,
        },
      }
      const graphic = new Graphic({
        geometry: polygon,
        symbol: fillSymbol,
        id: new Date().getTime(),
      })
      //   const graphic = new config.esriConstructors.Graphic({
      //     geometry: polygon,
      //     symbol: fillSymbol,
      //     id: new Date().getTime(),
      //   })
      view.graphics.remove(this.dkfw)
      view.graphics.add(graphic)
      this.dkfw = graphic
      //   view.extent = changeExtent(polygon.extent.clone())
    } catch (error) {
      console.log(error)
    }
  }

  async setLayer(url: string, visible: boolean) {
    const view = getMainView()
    const [MapImageLayer] = await getModules(['esri/layers/MapImageLayer'])
    let layer = this.layerMap.get(url)
    if (!layer) {
      if (!visible) {
        return
      }
      const index = url.lastIndexOf('/')
      const id = parseInt(url.substring(index + 1, url.length))

      layer =new MapImageLayer({
        title: 'temporary',
        url: url.substring(0, index),
        sublayers: [
          {
            id,
            visible: true,
          },
        ],
      })
      this.layerMap.set(url, layer)
      view.map.layers.unshift(layer)
    } else {
      layer.visible = visible
    }
    this.layerArray.push(layer)
  }

  removeLayers() {
    const view = getMainView()
    for (const key of this.layerMap) {
      view.map.layers.remove(key[1])
    }
  }

  // 数据归类
  dataClassify() {
    this.analysisData.forEach((item: any) => {
      item.data.forEach((element: any) => {
        if (element.result && element.result.length) {
          this.currentPanel = element.displayName
          this.showDetailPanel(element)
        }
        if (element.loading) {
          return
        }
        switch (element.displayName) {
          case '是否占用耕地':
            element.tableResult =
              element.result.length > 0 ? element.result[0] : {}
            element.landKeys = [
              { name: '分等定级', key: 'DJ' },
              { name: '小计', key: '小计' },
            ]
            this.dealLandData(element.tableResult, element.landKeys)
            break
          case '是否占用永久基本农田':
            element.tableResult =
              element.result.length > 0 ? element.result[0] : {}
            element.landKeys = [
              { name: '占用永久基本农田情况(m²)', key: '小计' },
            ]
            this.dealfarmLandData(element.tableResult)
            break
          case '是否占用林地':
            element.tableResult = {}
            this.dealForestLandData(element)
            break
          case '是否涉及用海':
            element.landKeys = [{ name: '涉及用海情况', key: '涉及情况' }]
            this.dealSeaData(element)
            break
          case '是否涉及新增建设用地':
            element.tableResult =
              element.result.length > 0 ? element.result[0] : {}
            element.landKeys = [{ name: '涉及新增建设用地(m²)', key: '小计' }]
            this.dealNewLandData(element)
            break
          case '是否占用湿地':
            element.landKeys = [
              { name: '湿地类型', key: '湿地类型' },
              { name: '占用长度（km）/面积（㎡）', key: '小计' },
              { name: '所属自然保护区', key: 'typeStr' },
            ]
            this.dealWetLandData(element)
            break
          case '是否涉及古树名木':
            this.dealTreeData(element)
            break
          case '是否涉及已供应土地':
            element.landKeys = [
              { name: '图层名', key: 'layerName' },
              { name: '小计', key: 'count' },
            ]
            this.dealHasProvideLandData(element)
            break
          case '是否位于城市建设用地范围内':
            element.landKeys = [
              { name: '图层名', key: 'name' },
              { name: '小计', key: 'area' },
            ]
            this.dealUrbanPlanningData(element)
            break
          case '是否位于建设用地管制区范围内':
            this.dealLandPlanningData(element)
            break
          case '控制性详细规划检测':
            element.landKeys = [
              { name: '图层名', key: 'name' },
              { name: '小计', key: 'value' },
            ]
            this.dealControlPlanningData(element)
            break
          case '是否涉及海洋功能区划':
            element.landKeys = [
              { name: '图层名', key: 'type' },
              { name: '小计', key: 'area' },
            ]
            this.dealSeaFuncPlanningData(element)
            break
          case '是否涉及生态保护红线':
            this.dealEcologicalData(element)
            break
          case '是否涉及生态控制线':
            this.dealEcologicalControlData(element)
            break
          case '是否涉及国家自然保护区':
            element.landKeys = [
              { name: '图层名', key: 'type' },
              { name: '小计', key: 'area' },
            ]
            this.dealNatureReserveData(element)
            break
          case '是否涉及厦门国家级海洋公园总体规划':
            element.landKeys = [
              { name: '图层名', key: 'type' },
              { name: '小计', key: 'area' },
            ]
            this.dealOceanParkData(element)
            break
          case '是否位于地质灾害易发区':
            element.landKeys = [
              { name: '图层名', key: 'type' },
              { name: '小计', key: 'area' },
            ]
            this.dealGeologicalDisasterData(element)
            break
          case '是否涉及轨道收储平衡用地':
            this.dealPathwayData(element)
            break
          case '是否涉及文物保护范围':
            this.dealCulturalRelicData(element)
            break
          case '是否涉及气象探测环境保护规划要求':
            element.landKeys = [
              { name: '图层名', key: 'name' },
              { name: '是否涉及', key: 'isInvolve' },
              { name: '限高要求', key: 'minHeight' },
            ]
            this.dealWeatherData(element)
            break
          case '是否位于风景名胜区内':
            element.landKeys = [
              { name: '图层名', key: 'type' },
              { name: '小计', key: 'area' },
            ]
            this.dealTouristAttractionData(element)
            break
          case '是否涉及轨道保护线':
            this.dealtrafficData(element)
            break
          case '是否涉及铁路安全保护区':
            this.dealRailwayData(element)
            break
          case '是否涉及河道水系生态蓝线保护范围':
            element.landKeys = [
              { name: '图层名', key: 'name' },
              { name: '内容', key: 'isInvolve' },
            ]
            this.dealRiverData(element)
            break
          case '是否涉及安全控制区域':
            this.dealSafetyAreaData(element)
            break
          case '是否位于工业控制线内':
            element.landKeys = [
              { name: '图层名', key: 'name' },
              { name: '小计', key: 'area' },
            ]
            this.dealIndustryData(element)
            break
          case '是否位于特别控制区':
            element.landKeys = [
              { name: '图层名', key: 'name' },
              { name: '小计', key: 'area' },
            ]
            this.dealIndustryData(element)
            break
          default:
            break
        }
      })
    })
    console.log(this.analysisData)
  }

  // 处理耕地数据
  dealLandData(item: any, landKeys: any) {
    try {
      if (item.analysisResult.length === 0) {
        return
      }
      Object.keys(item.analysisResult[0]).forEach((key: any) => {
        if (!JSON.stringify(landKeys).includes(key)) {
          landKeys.splice(1, 0, {
            name: key + '(m²)',
            key,
          })
        }
      })
      // 取占用面积
      item.analysisResult.forEach((reslutItem: any) => {
        if (reslutItem['小计']) {
          reslutItem['小计'] = reslutItem['小计'].toFixed(2)
          item.landArea = reslutItem['小计']
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  // 处理永久基本农田数据
  dealfarmLandData(item: any) {
    // 取占用面积
    item.analysisResult.forEach((reslutItem: any) => {
      if (reslutItem.name === '小计') {
        reslutItem['小计'] = reslutItem['小计'].toFixed(2)
        item.landArea = reslutItem['小计']
      }
    })
  }

  // 处理林地数据
  dealForestLandData(item: any) {
    try {
      for (let i = 0; i < item.detectControlPlanCategoryItems.length; i++) {
        item.result[i].displayName =
          item.detectControlPlanCategoryItems[i].displayName
      }
      item.tableResult.analysisResult = [
        {
          level: 'I级',
          levelArea: '0',
          name: '国家级公益林',
          area: '0',
          bothName: '其中：一级国家级公益林',
          bothArea: '0',
        },

        {
          level: 'II级',
          levelArea: '0',
          name: '省级公益林',
          area: '0',
          bothName: '',
          bothArea: '',
        },
        {
          level: 'III级',
          levelArea: '0',
          name: '市级公益林',
          area: '0',
          bothName: '',
          bothArea: '',
        },
        {
          level: 'IV级',
          levelArea: '0',
          name: '县级公益林',
          area: '0',
          bothName: '',
          bothArea: '',
        },
        {
          level: '',
          levelArea: '',
          name: '商品林',
          area: '0',
          bothName: '',
          bothArea: '',
        },
      ]
      item.tableResult.isOccupy = false
      const tableResult = item.tableResult
      item.result.forEach((ele: any) => {
        if (ele.analysisResult.length === 0) {
          return
        }
        if (!item.tableResult.isOccupy) {
          item.tableResult.isOccupy = ele.isOccupy
        }
        switch (ele.displayName) {
          case '林地保护等级范围与分类':
            ele.analysisResult.forEach((res: any) => {
              switch (res.BH_DJ) {
                case '1':
                  tableResult.analysisResult[0].levelArea = res.area.toFixed(2)
                  break
                case '2':
                  tableResult.analysisResult[1].levelArea = res.area.toFixed(2)
                  break
                case '3':
                  tableResult.analysisResult[2].levelArea = res.area.toFixed(2)
                  break
                case '4':
                  tableResult.analysisResult[3].levelArea = res.area.toFixed(2)
                  break
                default:
                  break
              }
            })
            break
          case '国家级公益林':
            tableResult.analysisResult[0].area =
              ele.analysisResult[0]['小计'].toFixed(2)
            break
          case '省级公益林':
            tableResult.analysisResult[1].area =
              ele.analysisResult[0]['小计'].toFixed(2)
            break
          case '市级公益林':
            tableResult.analysisResult[2].area =
              ele.analysisResult[0]['小计'].toFixed(2)
            break
          case '县级公益林':
            tableResult.analysisResult[3].area =
              ele.analysisResult[0]['小计'].toFixed(2)
            break
          case '商品林':
            tableResult.analysisResult[4].area =
              ele.analysisResult[0]['小计'].toFixed(2)
            break
          default:
            break
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  // 处理用海数据
  dealSeaData(item: any) {
    try {
      for (let i = 0; i < item.detectControlPlanCategoryItems.length; i++) {
        item.result[i].displayName =
          item.detectControlPlanCategoryItems[i].displayName
      }
      let isOccupy = false // 是否涉及用海
      let projectList: any = []
      item.result.forEach((ele: any) => {
        if (ele.analysisResult.length === 0) {
          return
        }
        if (ele.displayName !== '海域使用权许可' && ele.isOccupy === true) {
          isOccupy = true
        }
        const fields = (window as any).oneDetection.seaField
        const list = this.combineList(ele.projectList, fields)
        projectList = projectList.concat(list)
      })
      item.tableResult = {
        state: 'success',
        isOccupy,
        analysisResult: [
          { name: '涉及情况', 涉及情况: isOccupy ? '涉及' : '不涉及' },
        ],
        projectList,
      }
      item.projectList = projectList
    } catch (error) {
      console.log(error)
    }
  }

  // 处理涉及的项目 字段统一化
  async combineList(projectList: any, fields: any) {
    const arr: any = []
    const map = new Map()
    try {
      for (const item of projectList) {
        let isExist = true
        for (const key of fields) {
          if (!item.attributes[key]) {
            isExist = false
            console.log('字段匹配不上', fields)
            break
          }
        }
        if (isExist) {
          const name = item.attributes[fields[0]]
          const pzwh = item.attributes[fields[1]]
          const pzwhProject = map.get(pzwh)
          if (pzwhProject) {
            const [geometryEngine] = await getModules([
              'esri/geometry/geometryEngine',
            ])
            pzwhProject.geometry = geometryEngine.union([
              pzwhProject.geometry,
              item.geometry,
            ])
          } else {
            const obj: any = {
              name,
              pzwh,
              geometry: item.geometry,
            }
            map.set(pzwh, obj)
          }
        }
      }
      map.forEach((item) => {
        arr.push(item)
      })
      return arr
    } catch (error) {
      console.log(error)
      return arr
    }
  }

  // 处理新增用地
  async dealNewLandData(item: any) {
    try {
      // 把位于服务范围外的地块群，进行求重叠，满足都位于范围外的
      let sameGeo: any = null
      const [Polygon, geometryEngine] = await getModules([
        'esri/geometry/Polygon',
        'esri/geometry/geometryEngine',
      ])
      item.result.forEach((geo: any) => {
        const polygon = new Polygon(geo.analysisResult)
        if (!sameGeo) {
          sameGeo = polygon
        }
        sameGeo = geometryEngine.intersect(sameGeo, polygon)
      })
      if (sameGeo) {
        const landArea = geometryEngine.planarArea(sameGeo, 'square-meters')
        item.tableResult.landArea = landArea.toFixed(2)
        const sum = geometryEngine.planarArea(sameGeo, 'square-meters')
        item.tableResult.isOccupy = true
        item.tableResult.analysisResult = [
          { name: '小计', 小计: sum.toFixed(2) },
        ]
      } else {
        item.isOccupy = false
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 处理湿地用地
  dealWetLandData(item: any) {
    try {
      const list = [
        {
          湿地类型: '线状',
          小计: '0',
          typeStr: '',
        },
        {
          湿地类型: '面状',
          小计: '0',
          typeStr: '',
        },
      ]
      let isOccupy = false
      item.result.forEach((res: any) => {
        if (res.isOccupy) {
          isOccupy = true
        }
        res.analysisResult.forEach((ele: any) => {
          switch (ele.type) {
            case 'polygon':
              list[1]['小计'] = ele['小计'].toFixed(2)
              list[1].typeStr = ele.typeStr
              break
            case 'polyline':
              list[0]['小计'] = (ele['小计'] / 1000).toFixed(2)
              list[0].typeStr = ele.typeStr
              break
            default:
              break
          }
        })
      })
      item.tableResult = { isOccupy, analysisResult: list, state: 'success' }
    } catch (error) {
      console.log(error)
    }
  }

  // 处理古树名木
  dealTreeData(item: any) {
    const list: any = []
    let isOccupy = false
    item.result.forEach((el: any) => {
      el.analysisResult.forEach((res: any) => {
        isOccupy = true
        const a = {
          name: '压覆数量（株）',
          count: res['小计'],
        }
        list.push(a)
      })
    })
    item.tableResult = { isOccupy, analysisResult: list, state: 'success' }
  }

  // 处理是否涉及已供应土地
  dealHasProvideLandData(item: any) {
    try {
      const list = [
        {
          name: '公开出让',
          layerName: '公开出让',
          count: '',
        },
        {
          name: '建设用地红线',
          layerName: '批准红线',
          count: '',
        },
      ]
      let isOccupy = false
      const detectControlPlanCategoryItems = item.detectControlPlanCategoryItems
      let projectList: any = []
      for (let i = 0; i < detectControlPlanCategoryItems.length; i++) {
        const displayName = detectControlPlanCategoryItems[i].displayName
        list.forEach((el: any) => {
          const layerName = el.layerName
          if (displayName === layerName) {
            if (!isOccupy) {
              isOccupy = item.result[i].isOccupy
            }
            if (item.result[i].analysisResult[0]) {
              el.count = item.result[i].analysisResult[0]['小计'].toFixed(2)
            } else {
              el.count = 0
            }
          }
        })
      }
      item.result.forEach((ele: any) => {
        if (ele.analysisResult.length === 0) {
          return
        }
        const fields = (window as any).oneDetection.landField
        const list = this.combineList(ele.projectList, fields)
        projectList = projectList.concat(list)
      })
      item.tableResult = {
        isOccupy,
        analysisResult: list,
        state: 'success',
        projectList,
      }
      item.projectList = projectList
    } catch (error) {
      console.log(error)
    }
  }

  // 是否位于城市建设用地范围内
  dealUrbanPlanningData(item: any) {
    try {
      if (item.result && item.result.length > 0) {
        let isOccupy = true
        let landArea = 0
        item.result.forEach((el: any) => {
          const analysisResult = el.analysisResult
          analysisResult.forEach((res: any) => {
            landArea += res['小计']
          })
        })
        if (this.geometryArea - landArea <= 2) {
          isOccupy = false
        }
        const area = landArea.toFixed(2)
        const list = [
          { name: '城市建设用地范围内', area },
          {
            name: '城市建设用地范围外',
            area: (this.geometryArea - landArea).toFixed(2),
          },
          { name: '小计', area: this.geometryArea },
        ]
        item.tableResult = {
          isOccupy,
          analysisResult: list,
          state: 'success',
          landArea: area,
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 处理是否位于建设用地管制区范围内
  dealLandPlanningData(item: any) {
    try {
      let isOccupy = false
      if (item.result && item.result.length > 0) {
        const data: any = []
        let landArea = 0
        item.result.forEach((el: any) => {
          const analysisResult = el.analysisResult
          analysisResult.forEach((res: any) => {
            landArea += res.area
            if (res['土地用途分区名称']) {
              const a = {
                layerName: '土地用途分区名称',
                type: res['土地用途分区名称'],
                area: res.area.toFixed(2),
              }
              data.push(a)
            } else if (res['管制分区名称']) {
              const name = res['管制分区名称']
              const a = {
                layerName: '管制分区名称',
                type: name,
                area: res.area.toFixed(2),
              }
              if (name !== '允许建设区') {
                isOccupy = true
              }
              data.push(a)
            }
          })
        })
        item.tableResult = {
          isOccupy,
          analysisResult: data,
          state: 'success',
          landArea: landArea.toFixed(2),
        }
        this.landSpanArr = this.getSpanArr(item.tableResult)
      }
    } catch (error) {
      console.log(error)
    }
  }

  getSpanArr(tableResult: any) {
    const spanArr: any = []
    let contactDot = 0
    const table = tableResult.analysisResult
    table.forEach((item: any, index: any) => {
      if (index === 0) {
        spanArr.push(1)
      } else if (item.layerName === table[index - 1].layerName) {
        spanArr[contactDot] += 1
        spanArr.push(0)
      } else {
        contactDot = index
        spanArr.push(1)
      }
    })
    return spanArr
  }

  landeSpanMethod({ row, column, rowIndex, columnIndex }: any) {
    if (columnIndex === 0) {
      const _row = this.landSpanArr[rowIndex]
      const _col = _row > 0 ? 1 : 0
      console.log(row, column)
      return {
        // [0,0] 表示这一行不显示， [2,1]表示行的合并数
        rowspan: _row,
        colspan: _col,
      }
    }
  }

  // 控制性详细规划检测
  dealControlPlanningData(item: any) {
    try {
      if (item.result && item.result.length > 0) {
        let isOccupy = false // 是否占用
        let isVisible = false
        const list: any = [
          {
            name: '边界是否一致',
            value: '',
          },
          {
            name: '是否涉及在编控规范围',
            value: '',
          },
        ]
        item.detectControlPlanCategoryItems.forEach(
          (el: any, index: number) => {
            const occupy = item.result[index].isOccupy
            const displayName = el.displayName
            switch (displayName) {
              case '在编控规范围':
                list[1].value = occupy ? '是' : '否'
                if (!isVisible) {
                  isVisible = occupy
                }
                break
              case '一张蓝图_地块范围':
                const analysisResult = item.result[index].analysisResult
                const isContain = item.result[index].isContain
                list[0].value = isContain ? '是' : '否'
                if (!isOccupy) {
                  isOccupy = !isContain
                }
                const a = { name: '规划用地分项面积（㎡）' }
                list.push(a)
                for (const ss of analysisResult) {
                  const b = {
                    name: ss['规划用地性质名称'],
                    value: ss.area.toFixed(2),
                  }
                  list.push(b)
                }
                break
              default:
                break
            }
          }
        )
        item.tableResult = {
          isOccupy,
          isVisible,
          analysisResult: list,
          state: 'success',
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 是否涉及海洋功能区划
  dealSeaFuncPlanningData(item: any) {
    const field = '功能区类型'
    this.returnTableResult(item, field, true)
  }

  // 是否涉及生态保护红线
  dealEcologicalData(item: any) {
    try {
      if (item.result && item.result.length > 0) {
        let isOccupy = false
        const list: any = [
          {
            layerName: '占用陆域生态红线',
            type: '',
            area: 0,
          },
          {
            layerName: '占用海洋生态红线',
            type: '',
            area: 0,
          },
        ]
        let sum = 0
        item.detectControlPlanCategoryItems.forEach(
          (el: any, index: number) => {
            const displayName = el.displayName
            if (item.result[index].isOccupy) {
              isOccupy = item.result[index].isOccupy
            }
            const analysisResult = item.result[index].analysisResult
            analysisResult.forEach((res: any) => {
              switch (displayName) {
                case '陆域生态红线':
                  list[0].area = res['小计'].toFixed(2)
                  break
                case '海洋生态红线':
                  sum += res.area
                  // eslint-disable-next-line no-case-declarations
                  const a = {
                    layerName: '其中',
                    type: res['类型'],
                    area: res.area.toFixed(2),
                  }
                  list.push(a)
                  break
                default:
                  break
              }
            })
          }
        )
        list[1].area = sum.toFixed(2)
        item.tableResult = {
          isOccupy,
          analysisResult: list,
          state: 'success',
        }
        this.ecologicalSpanArr = this.getSpanArr(item.tableResult)
      }
    } catch (error) {
      console.log(error)
    }
  }

  ecologicalSpanMethod({ row, column, rowIndex, columnIndex }: any) {
    if (columnIndex === 0) {
      const _row = this.ecologicalSpanArr[rowIndex]
      const _col = 1
      console.log(_row, _col, row, column)
      return {
        // [0,0] 表示这一行不显示， [2,1]表示行的合并数
        rowspan: _row,
        colspan: _col,
      }
    }
  }

  // 是否涉及生态控制线
  dealEcologicalControlData(item: any) {
    try {
      if (item.result && item.result.length > 0) {
        let isOccupy = false
        let landArea = 0
        item.result.forEach((el: any) => {
          if (el.isOccupy) {
            isOccupy = el.isOccupy
          }
          const analysisResult = el.analysisResult
          analysisResult.forEach((res: any) => {
            landArea += res['小计']
          })
        })
        const area = landArea.toFixed(2)
        const list = [{ name: '占用面积', area }]
        item.tableResult = {
          isOccupy,
          analysisResult: list,
          state: 'success',
          landArea: area,
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 是否涉及国家自然保护区
  dealNatureReserveData(item: any) {
    const field = '保护区类型'
    this.returnTableResult(item, field, true)
  }

  // 是否涉及厦门国家级海洋公园总体规划
  dealOceanParkData(item: any) {
    const field = '区域'
    this.returnTableResult(item, field, true)
  }

  // 是否位于地质灾害易发区
  dealGeologicalDisasterData(item: any) {
    try {
      if (item.result && item.result.length > 0) {
        let isOccupy = false
        const list: any = []
        item.detectControlPlanCategoryItems.forEach(
          (el: any, index: number) => {
            const displayName = el.displayName
            if (item.result[index].isOccupy) {
              isOccupy = item.result[index].isOccupy
            }
            const analysisResult = item.result[index].analysisResult
            analysisResult.forEach((res: any) => {
              const a = {
                type: displayName,
                area: res['小计'].toFixed(2),
              }
              list.push(a)
            })
          }
        )
        item.tableResult = {
          isOccupy,
          analysisResult: list,
          state: 'success',
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 是否涉及文物保护范围
  dealCulturalRelicData(item: any) {
    try {
      if (item.result && item.result.length > 0) {
        let isOccupy = false
        const list: any = [
          {
            type: '占用文物保护专项规划（㎡）',
          },
          {
            type: '文物保护范围',
            area: 0,
          },
          {
            type: '文物建筑控制',
            area: 0,
          },
          {
            type: '文物本体边界',
            area: 0,
          },
          {
            type: '第三次全国文物保护规划（㎡）',
          },
          {
            type: '保护范围',
            area: 0,
          },
          {
            type: '文物边界',
            area: 0,
          },
        ]
        item.detectControlPlanCategoryItems.forEach(
          (el: any, index: number) => {
            const displayName = el.displayName
            if (item.result[index].isOccupy) {
              isOccupy = item.result[index].isOccupy
            }
            const analysisResult = item.result[index].analysisResult
            analysisResult.forEach((res: any) => {
              const area = res['小计'].toFixed(2)
              switch (displayName) {
                case '文物保护范围':
                  list[1].area = area
                  break
                case '文物建筑控制':
                  list[2].area = area
                  break
                case '文物本体边界':
                  list[3].area = area
                  break
                case '保护范围':
                  list[5].area = area
                  break
                case '文物边界':
                  list[6].area = area
                  break
                default:
                  break
              }
            })
          }
        )
        item.tableResult = {
          isOccupy,
          analysisResult: list,
          state: 'success',
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 是否涉及轨道收储平衡用地
  dealPathwayData(item: any) {
    try {
      if (item.result && item.result.length > 0) {
        let isOccupy = false
        const list: any = [
          {
            type: '轨道平衡用地',
            area: 0,
            name: '规划用途',
            typeStr: '',
          },
          {
            type: '非轨道平衡用地',
            area: 0,
          },
          {
            type: '轨道收储用地',
            area: 0,
          },
          {
            type: '非轨道收储用地',
            area: 0,
          },
        ]
        item.detectControlPlanCategoryItems.forEach(
          (el: any, index: number) => {
            const displayName = el.displayName
            if (item.result[index].isOccupy) {
              isOccupy = item.result[index].isOccupy
            }
            const analysisResult = item.result[index].analysisResult
            analysisResult.forEach((res: any) => {
              const area = res['小计'].toFixed(2)
              switch (displayName) {
                case '轨道平衡用地':
                  list[0].area = area
                  list[0].typeStr = res.typeStr
                  list[1].area = (this.geometryArea - area).toFixed(2)
                  break
                case '轨道收储范围':
                  list[2].area = area
                  list[3].area = (this.geometryArea - area).toFixed(2)
                  break
                default:
                  break
              }
            })
          }
        )
        item.tableResult = {
          isOccupy,
          analysisResult: list,
          state: 'success',
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 是否涉及气象探测环境保护规划要求
  dealWeatherData(item: any) {
    try {
      if (item.result && item.result.length > 0) {
        let isOccupy = false
        const list: any = [
          { name: '台站', isInvolve: '是否涉及', minHeight: '限高要求（m)' },
        ]
        item.detectControlPlanCategoryItems.forEach(
          (el: any, index: number) => {
            const displayName = el.displayName
            const isInvolve = item.result[index].isOccupy
            if (item.result[index].isOccupy) {
              isOccupy = isInvolve
            }
            const minHeight = item.result[index].minHeight
            const a = {
              name: displayName,
              isInvolve: isInvolve ? '涉及' : '不涉及',
              minHeight: isInvolve ? minHeight : '',
            }
            list.push(a)
          }
        )
        item.tableResult = {
          isOccupy,
          analysisResult: list,
          state: 'success',
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 是否位于风景名胜区内
  dealTouristAttractionData(item: any) {
    const field = '用地性质名称'
    this.returnTableResult(item, field, false)
  }

  // 是否涉及轨道保护线
  dealtrafficData(item: any) {
    this.returnIsOccupy(item)
  }

  // 是否涉及铁路安全保护区
  dealRailwayData(item: any) {
    this.returnIsOccupy(item)
  }

  // 是否涉及河道水系生态蓝线保护范围
  dealRiverData(item: any) {
    try {
      if (item.result && item.result.length > 0) {
        let isOccupy = false
        const list: any = []
        item.detectControlPlanCategoryItems.forEach(
          (el: any, index: number) => {
            const displayName = el.displayName
            const isInvolve = item.result[index].isOccupy
            if (!isInvolve) {
              const a = {
                name: displayName,
                isInvolve: isInvolve ? '涉及' : '不涉及',
              }
              list.push(a)
            }
            if (item.result[index].isOccupy) {
              isOccupy = isInvolve
            }
            const analysisResult = item.result[index].analysisResult

            analysisResult.forEach((res: any) => {
              const typeStr = res.typeStr
              switch (displayName) {
                case '原水管线':
                  const a = {
                    name: displayName,
                    isInvolve: isInvolve ? '涉及' : '不涉及',
                  }
                  list.push(a)
                  break
                default:
                  const b = {
                    name: displayName,
                    isInvolve: isInvolve ? '涉及' + typeStr : '不涉及',
                  }
                  list.push(b)
                  break
              }
            })
          }
        )
        item.tableResult = {
          isOccupy,
          analysisResult: list,
          state: 'success',
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 是否涉及安全控制区域
  dealSafetyAreaData(item: any) {
    try {
      if (item.result && item.result.length > 0) {
        let isOccupy = false
        let landArea = 0
        item.result.forEach((el: any) => {
          if (el.isOccupy) {
            isOccupy = el.isOccupy
          }
          const analysisResult = el.analysisResult
          analysisResult.forEach((res: any) => {
            landArea += res['小计']
          })
        })
        const area = landArea.toFixed(2)
        const list = [{ name: '占用面积（㎡）', area }]
        item.tableResult = {
          isOccupy,
          analysisResult: list,
          state: 'success',
          landArea: area,
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 是否位于工业控制线内
  dealIndustryData(item: any) {
    try {
      if (item.result && item.result.length > 0) {
        let isOccupy = false
        let landArea = 0
        item.result.forEach((el: any) => {
          if (el.isOccupy) {
            isOccupy = el.isOccupy
          }
          const analysisResult = el.analysisResult
          analysisResult.forEach((res: any) => {
            landArea += res['小计']
          })
        })
        const area = landArea.toFixed(2)
        const list = [
          { name: '范围内面积（㎡）', area },
          {
            name: '范围外面积（㎡）',
            area: (this.geometryArea - landArea).toFixed(2),
          },
        ]
        item.tableResult = {
          isOccupy,
          analysisResult: list,
          state: 'success',
          landArea: area,
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 提供item跟字段类型 返回类型统计的数组跟小计
  returnTableResult(item: any, field: any, showSum: boolean) {
    try {
      if (item.result && item.result.length > 0) {
        let isOccupy = false
        const list: any = []
        let sum = 0
        item.result.forEach((res: any) => {
          if (res.isOccupy) {
            isOccupy = res.isOccupy
          }
          res.analysisResult.forEach((el: any) => {
            sum += el.area
            const a = {
              type: el[field],
              area: el.area.toFixed(2),
            }
            list.push(a)
          })
        })
        const landArea = sum.toFixed(2)
        if (showSum) {
          list.push({ type: '小计', area: landArea })
        }
        item.tableResult = {
          isOccupy,
          analysisResult: list,
          state: 'success',
          landArea,
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  returnIsOccupy(item: any) {
    try {
      if (item.result && item.result.length > 0) {
        let isOccupy = false
        let landArea = 0
        item.result.forEach((el: any) => {
          if (el.isOccupy) {
            isOccupy = el.isOccupy
          }
          const analysisResult = el.analysisResult
          analysisResult.forEach((res: any) => {
            landArea += res['小计']
          })
        })
        const list = [{ isOccupy: isOccupy ? '涉及' : '不涉及' }]
        item.tableResult = {
          isOccupy,
          analysisResult: list,
          state: 'success',
          landArea: landArea.toFixed(2),
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  showDetailPanel(element: any) {
    this.layerArray.forEach((element: any) => {
      element.visible = false
    })
    this.getLayers(element.detectControlPlanCategoryItems)
    this.currentPanel = element.displayName
  }

  getLayers(detectCategorys: any) {
    const layersTree = []
    for (const item of detectCategorys) {
      const layer = Object.assign({}, item.layer)
      layer.isShow = false
      layersTree.push(layer)
    }
    this.layersTree = layersTree
  }

  exportWord() {
    this.loading = true
    // const that = this
    // this.$emit('setGeometryCenter')
    // const screenLayerList = this.createLayerList(this.analysisData)
    // const index = 0
    // defaultScreenshot(
    //   function (image: any) {
    //     that.image = image
    //     that.layerScreen(screenLayerList, index)
    //   },
    //   function () {
    //     that.image = null
    //     that.layerScreen(screenLayerList, index)
    //   }
    // )
  }

  createLayerList(data: any) {
    const list: any = []
    data.forEach((item: any) => {
      item.data.forEach((childItem: any) => {
        if (childItem.tableResult && childItem.tableResult.isOccupy) {
          if (childItem.detectControlPlanCategoryItems) {
            childItem.detectControlPlanCategoryItems.forEach(
              (categoryItems: any) => {
                if (categoryItems.layer) {
                  list.push(categoryItems.layer)
                }
              }
            )
          }
        }
      })
    })
    return list
  }

  async layerScreen(screenLayerList: any, index: number) {
    try {
      const view = getMainView()
      const that = this
      const screenList = screenLayerList[index]
      const serviceUrl = screenList.serviceUrl
      if (this.featureLayer) {
        view.map.layers.remove(this.featureLayer)
        this.featureLayer = null
      }
      const [FeatureLayer] = await getModules(['esri/layers/FeatureLayer'])
      this.featureLayer = new FeatureLayer({
        url: serviceUrl,
      })
      view.map.layers.add(this.featureLayer)
      view
        .whenLayerView(that.featureLayer)
        .then(function (layerView: any) {
          layerView.watch('updating', function () {
            // defaultScreenshot(
            //   function (image: any) {
            //     that.detectCategoryMap.set(screenList.displayName, image)
            //     index++
            //     if (index < screenLayerList.length) {
            //       that.layerScreen(screenLayerList, index)
            //     } else {
            //       that.combineWordData()
            //     }
            //   },
            //   function () {
            //     index++
            //     if (index < screenLayerList.length) {
            //       that.layerScreen(screenLayerList, index)
            //     } else {
            //       that.combineWordData()
            //     }
            //   }
            // )
          })
        })
        .catch((err: any) => {
          console.log(err)
        })
    } catch (error) {
      console.log(error)
      this.combineWordData()
    }
  }

  combineWordData() {
    try {
      const basicData: any = {
        name: this.form.name,
        department: this.form.department,
        geometryYdxz: this.geometryYdxz,
        geometryArea: this.geometryArea,
        geometryXzq: this.geometryXzq,
        sumIndex: 0,
        zy: 0,
        bzy: 0,
        other: 0,
      }
      this.analysisData.forEach((item: any) => {
        item.data.forEach((el: any) => {
          basicData.sumIndex++
          const displayName = el.displayName
          const tableResult = el.tableResult
          if (displayName.includes('占用')) {
            if (tableResult && tableResult.isOccupy) {
              basicData.zy++
            } else {
              basicData.bzy++
            }
          } else {
            basicData.other++
          }
        })
      })
      if (this.image) {
        basicData.imageData = this.image.imgUrl
      }
      const tableData = this.generateWordType(this.analysisData)
      const wordData = {
        basicData,
        tableData,
      }
      if (this.featureLayer) {
        const view = getMainView()
        view.map.layers.remove(this.featureLayer)
        this.featureLayer = null
      }
      const url = '/word/AKeyTestReport.docx'
      exportPlanCheckWord(url, wordData, (file: any) => {
        this.$message.success('导出报告成功')
        console.log(file)
        this.loading = false
      })
    } catch (error) {
      console.log(error)
      this.loading = false
    }
  }

  generateWordType(data: any) {
    try {
      let tableData: any = {}
      data.forEach((item: any) => {
        const displayName = item.displayName
        let indexName = ''
        let field = ''
        switch (displayName) {
          case '土地利用现状分析':
            indexName = 'tdlyxzfx'
            tableData[indexName] = { name: displayName }
            item.data.forEach((el: any) => {
              const name = el.displayName
              switch (name) {
                case '是否占用耕地':
                  field = 'sfzygd'
                  tableData = this.getTableData(tableData, el, indexName, field)
                  break
                case '是否占用永久基本农田':
                  field = 'sfzyyjjbnt'
                  tableData = this.getTableData(tableData, el, indexName, field)
                  break
                case '是否占用林地':
                  field = 'sfzyld'
                  tableData = this.getTableData(tableData, el, indexName, field)
                  break
                case '是否涉及用海':
                  field = 'sfsjyh'
                  tableData = this.getTableData(tableData, el, indexName, field)
                  tableData[indexName][field].projectList =
                    el.tableResult.projectList
                  break
                case '是否涉及新增建设用地':
                  field = 'sfsjxzjsyd'
                  tableData = this.getTableData(tableData, el, indexName, field)
                  break
                case '是否占用湿地':
                  field = 'sfzysd'
                  tableData = this.getTableData(tableData, el, indexName, field)
                  break
                case '是否涉及古树名木':
                  field = 'sfsjgsmm'
                  tableData = this.getTableData(tableData, el, indexName, field)
                  break
                case '是否涉及已供应土地':
                  field = 'sfsjygytd'
                  tableData = this.getTableData(tableData, el, indexName, field)
                  tableData[indexName][field].projectList =
                    el.tableResult.projectList
                  break
                default:
                  break
              }
            })
            break
          case '合规性分析':
            indexName = 'hgxfx'
            tableData[indexName] = { name: displayName }
            item.data.forEach((el: any) => {
              const name = el.displayName
              switch (name) {
                case '是否位于城市建设用地范围内':
                  field = 'sffhcsztgh'
                  tableData = this.getTableData(tableData, el, indexName, field)
                  break
                case '是否位于建设用地管制区范围内':
                  field = 'sffhtdlyztgh'
                  tableData = this.getTableData(tableData, el, indexName, field)
                  break
                case '控制性详细规划检测':
                  field = 'sffhkzxxxgh'
                  tableData = this.getTableData(tableData, el, indexName, field)
                  break
                case '是否涉及海洋功能区划':
                  field = 'sffhhygnqh'
                  tableData = this.getTableData(tableData, el, indexName, field)
                  break
                case '是否涉及生态保护红线':
                  field = 'sfsjstbhhx'
                  tableData = this.getTableData(tableData, el, indexName, field)
                  break
                case '是否涉及生态控制线':
                  field = 'sfsjstkzx'
                  tableData = this.getTableData(tableData, el, indexName, field)
                  break
                case '是否涉及国家自然保护区':
                  field = 'sfsjgjzrbhq'
                  tableData = this.getTableData(tableData, el, indexName, field)
                  break
                case '是否涉及厦门国家级海洋公园总体规划':
                  field = 'sffhhygytzgh'
                  tableData = this.getTableData(tableData, el, indexName, field)
                  break
                case '是否位于地质灾害易发区':
                  field = 'sfwyzhd'
                  tableData = this.getTableData(tableData, el, indexName, field)
                  break
                case '是否涉及轨道收储平衡用地':
                  field = 'sfsjgdscphyd'
                  tableData = this.getTableData(tableData, el, indexName, field)
                  break
                case '是否涉及文物保护范围':
                  field = 'sfsjwwbhfw'
                  tableData = this.getTableData(tableData, el, indexName, field)
                  break
                default:
                  break
              }
            })
            break
          case '参考要素':
            indexName = 'ckys'
            tableData[indexName] = { name: displayName }
            item.data.forEach((el: any) => {
              const name = el.displayName
              switch (name) {
                case '是否涉及气象探测环境保护规划要求':
                  field = 'sffhqx'
                  tableData = this.getTableData(tableData, el, indexName, field)
                  break
                case '是否位于风景名胜区内':
                  field = 'sfwyfjmsqn'
                  tableData = this.getTableData(tableData, el, indexName, field)
                  break
                case '是否涉及轨道保护线':
                  field = 'sfsjgdbhq'
                  tableData = this.getTableData(tableData, el, indexName, field)
                  break
                case '是否涉及铁路安全保护区':
                  field = 'sfsjtlaqbhq'
                  tableData = this.getTableData(tableData, el, indexName, field)
                  break
                case '是否涉及河道水系生态蓝线保护范围':
                  field = 'sfsjhdsxlx'
                  tableData = this.getTableData(tableData, el, indexName, field)
                  break
                case '是否涉及安全控制区域':
                  field = 'sfsjaqkzqy'
                  tableData = this.getTableData(tableData, el, indexName, field)
                  break
                case '是否位于工业控制线内':
                  field = 'sfwygykzxn'
                  tableData = this.getTableData(tableData, el, indexName, field)
                  break
                case '是否位于特别控制区':
                  field = 'sfwytbkzqn'
                  tableData = this.getTableData(tableData, el, indexName, field)
                  break
                default:
                  break
              }
            })
            break
          default:
            break
        }
      })
      return tableData
    } catch (error) {
      console.log(error)
    }
  }

  getTableData(tableData: any, el: any, indexName: any, field: any) {
    tableData[indexName][field] = this.createWordFormat(el)
    tableData[indexName][field].imageData = this.getImageData(el)
    tableData[indexName][field].layerName = this.getLayerStr(el)
    return tableData
  }

  getImageData(el: any) {
    const arr: any = []
    el.detectControlPlanCategoryItems.forEach((item: any) => {
      if (item.layer) {
        const name = item.layer.displayName
        const image = this.detectCategoryMap.get(name)
        if (image) {
          const a = { name: '上图为：' + name + ' 图层', image: image.imgUrl }
          arr.push(a)
        }
      }
    })

    return arr
  }

  // 获取检测的图层名称
  getLayerStr(el: any) {
    let layerStr = ''
    el.detectControlPlanCategoryItems.forEach((item: any, index: number) => {
      if (item.layer) {
        const name = item.layer.displayName
        layerStr += '(' + (index + 1) + ')' + name
      }
    })
    return layerStr
  }

  createWordFormat(el: any) {
    try {
      const tableResult = el.tableResult
      const isOccupy = tableResult.isOccupy
      let isOccupyStr = isOccupy ? '是' : '否'
      if (el.displayName.includes('符合')) {
        isOccupyStr = isOccupy ? '否' : '是'
      }
      const name = el.displayName
      const controlItem: any = {
        name,
        isOccupy: isOccupyStr,
      }
      switch (name) {
        case '是否占用耕地':
          controlItem.table = this.transformLand(tableResult.analysisResult)
          break
        case '是否占用永久基本农田':
          controlItem.table = this.getResult(tableResult.landArea)
          break
        case '是否占用林地':
          controlItem.table = this.transformForest(tableResult.analysisResult)
          break
        case '是否涉及用海':
          const isInvolveSea = isOccupy ? '涉及' : '不涉及'
          controlItem.table = isInvolveSea
          break
        case '是否涉及新增建设用地':
          controlItem.table = this.getResult(tableResult.landArea)
          break
        case '是否占用湿地':
          controlItem.table = this.transformTable(
            tableResult.analysisResult,
            el.landKeys
          )
          break
        case '是否涉及古树名木':
          if (tableResult.analysisResult[0]) {
            controlItem.table = this.getResult(
              tableResult.analysisResult[0].count
            )
          } else {
            controlItem.table = 0
          }
          break
        case '是否涉及已供应土地':
          controlItem.table = this.transformTable(
            tableResult.analysisResult,
            el.landKeys
          )
          break
        case '是否位于城市建设用地范围内':
          controlItem.table = this.transformTable(
            tableResult.analysisResult,
            el.landKeys
          )
          break
        case '是否位于建设用地管制区范围内':
          controlItem.table = this.transformLandPlan(tableResult.analysisResult)
          break
        case '控制性详细规划检测':
          controlItem.table = this.transformControlPlan(
            tableResult.analysisResult,
            el.landKeys
          )
          break
        case '是否涉及海洋功能区划':
          controlItem.table = this.transformTable(
            tableResult.analysisResult,
            el.landKeys
          )
          break
        case '是否涉及生态保护红线':
          controlItem.table = this.transformSTBHX(tableResult.analysisResult)
          break
        case '是否涉及生态控制线':
          controlItem.table = this.getResult(tableResult.landArea)
          break
        case '是否涉及国家自然保护区':
          controlItem.table = this.transformTable(
            tableResult.analysisResult,
            el.landKeys
          )
          break
        case '是否涉及厦门国家级海洋公园总体规划':
          controlItem.table = this.transformTable(
            tableResult.analysisResult,
            el.landKeys
          )
          break
        case '是否位于地质灾害易发区':
          controlItem.table = this.transformDisaster(tableResult.analysisResult)
          break
        case '是否涉及轨道收储平衡用地':
          controlItem.table = this.transformGDSCPH(tableResult.analysisResult)
          break
        case '是否涉及文物保护范围':
          controlItem.table = this.transformWWBHFW(tableResult.analysisResult)
          break
        case '是否涉及气象探测环境保护规划要求':
          controlItem.table = this.transformTable(
            tableResult.analysisResult,
            el.landKeys
          )
          break
        case '是否位于风景名胜区内':
          controlItem.table = this.transformScene(tableResult.analysisResult)
          break
        case '是否涉及轨道保护线':
          controlItem.table = isOccupy ? '涉及' : '不涉及'
          break
        case '是否涉及铁路安全保护区':
          controlItem.table = isOccupy ? '涉及' : '不涉及'
          break
        case '是否涉及河道水系生态蓝线保护范围':
          controlItem.table = this.transformTable(
            tableResult.analysisResult,
            el.landKeys
          )
          break
        case '是否涉及安全控制区域':
          controlItem.table = this.getResult(tableResult.landArea)
          break
        case '是否位于工业控制线内':
          controlItem.table = this.transformTable(
            tableResult.analysisResult,
            el.landKeys
          )
          break
        case '是否位于特别控制区':
          controlItem.table = this.transformTable(
            tableResult.analysisResult,
            el.landKeys
          )
          break
        default:
          break
      }
      return controlItem
    } catch (error) {
      console.log(error)
      return false
    }
  }

  getResult(num: any) {
    try {
      if (num) {
        return num
      } else {
        return 0
      }
    } catch (error) {
      console.log(error)
      return 0
    }
  }

  // 下面方法transform的都是表格转化为word输出格式
  // 通用转化
  transformTable(result: any, landKeys: any) {
    try {
      const table: any = []
      result.forEach((feature: any) => {
        const tableFeature: any = {}
        let index = 1
        landKeys.forEach((field: any) => {
          tableFeature['value' + index] = feature[field.key]
          index++
        })
        table.push(tableFeature)
      })
      return table
    } catch (error) {
      console.log(error)
      console.log('transformTable方法出错')
    }
  }

  // 转化为耕地数据格式
  transformLand(analysisResult: any) {
    try {
      const obj = {
        level1_sjd: 0,
        level1_st: 0,
        level1_hd: 0,
        level1_xj: 0,

        level2_sjd: 0,
        level2_st: 0,
        level2_hd: 0,
        level2_xj: 0,

        level3_sjd: 0,
        level3_st: 0,
        level3_hd: 0,
        level3_xj: 0,

        level4_sjd: 0,
        level4_st: 0,
        level4_hd: 0,
        level4_xj: 0,

        level5_sjd: 0,
        level5_st: 0,
        level5_hd: 0,
        level5_xj: 0,

        sum_sjd: 0,
        sum_st: 0,
        sum_hd: 0,
        sum_xj: 0,
      }
      for (const item of analysisResult) {
        switch (item.DJ) {
          case '1':
            obj.level1_sjd = this.getResult(item['水浇地'])
            obj.level1_st = this.getResult(item['水田'])
            obj.level1_hd = this.getResult(item['旱地'])
            obj.level1_xj = this.getResult(item['小计'])
            break
          case '2':
            obj.level2_sjd = this.getResult(item['水浇地'])
            obj.level2_st = this.getResult(item['水田'])
            obj.level2_hd = this.getResult(item['旱地'])
            obj.level2_xj = this.getResult(item['小计'])
            break
          case '3':
            obj.level3_sjd = this.getResult(item['水浇地'])
            obj.level3_st = this.getResult(item['水田'])
            obj.level3_hd = this.getResult(item['旱地'])
            obj.level3_xj = this.getResult(item['小计'])
            break
          case '4':
            obj.level4_sjd = this.getResult(item['水浇地'])
            obj.level4_st = this.getResult(item['水田'])
            obj.level4_hd = this.getResult(item['旱地'])
            obj.level4_xj = this.getResult(item['小计'])
            break
          case '5':
            obj.level5_sjd = this.getResult(item['水浇地'])
            obj.level5_st = this.getResult(item['水田'])
            obj.level5_hd = this.getResult(item['旱地'])
            obj.level5_xj = this.getResult(item['小计'])
            break
          case '小计':
            obj.sum_sjd = this.getResult(item['水浇地'])
            obj.sum_st = this.getResult(item['水田'])
            obj.sum_hd = this.getResult(item['旱地'])
            obj.sum_xj = this.getResult(item['小计'])
            break
          default:
            break
        }
      }
      return obj
    } catch (error) {
      console.log(error)
    }
  }

  // 转化为林地
  transformForest(analysisResult: any) {
    try {
      const obj = {
        level1: analysisResult[0].levelArea,
        level2: analysisResult[1].levelArea,
        level3: analysisResult[2].levelArea,
        level4: analysisResult[3].levelArea,
        area1: analysisResult[0].area,
        area2: analysisResult[1].area,
        area3: analysisResult[2].area,
        area4: analysisResult[3].area,
        area5: analysisResult[4].area,
        bothArea1: analysisResult[0].bothArea,
      }
      return obj
    } catch (error) {
      console.log(error)
    }
  }

  // 转化为是否位于建设用地管制区范围内
  transformLandPlan(analysisResult: any) {
    try {
      const obj: any = {
        ybnydq: 0,
        jtydq: 0,
        qtjcssydq: 0,
        qtydq: 0,
        czydq: 0,
        cszydq: 0,
        jbntbhq: 0,
        lyydq: 0,
        slydq: 0,
        syydq: 0,
        ckydq: 0,
        fjmsjtsydq: 0,
        yxjsq: 0,
        ytjjsq: 0,
        jzjsq: 0,
        xzjsq: 0,
      }
      analysisResult.forEach((item: any) => {
        const area = item.area
        switch (item.type) {
          case '一般农用地区':
            obj.ybnydq = area
            break
          case '交通用地区':
            obj.jtydq = area
            break
          case '其他基础设施用地区':
            obj.qtjcssydq = area
            break
          case '其他用地区':
            obj.qtydq = area
            break
          case '城镇用地区':
            obj.cszydq = area
            break
          case '基本农田保护区':
            obj.jbntbhq = area
            break
          case '村镇用地区':
            obj.czydq = area
            break
          case '林业用地区':
            obj.lyydq = area
            break
          case '水利用地区':
            obj.slydq = area
            break
          case '水域用地区':
            obj.syydq = area
            break
          case '采矿用地区':
            obj.ckydq = area
            break
          case '风景名胜及特殊用地区':
            obj.fjmsjtsydq = area
            break
          case '允许建设区':
            obj.yxjsq = area
            break
          case '有条件建设区':
            obj.ytjjsq = area
            break
          case '禁止建设区':
            obj.jzjsq = area
            break
          case '限制建设区':
            obj.xzjsq = area
            break
          default:
            break
        }
      })
      return obj
    } catch (error) {
      console.log(error)
    }
  }

  // 转化控制性详细规划检测
  transformControlPlan(analysisResult: any, landKeys: any) {
    try {
      const obj: any = {}
      const arr: any = []
      analysisResult.forEach((el: any) => {
        const name = el.name
        const value = el.value
        switch (name) {
          case '边界是否一致':
            obj.order = value
            break
          case '是否涉及在编控规范围':
            obj.range = value
            break
          case '规划用地分项面积（㎡）':
            break
          default:
            arr.push(el)
            break
        }
      })
      const table = this.transformTable(arr, landKeys)
      obj.table = table
      return obj
    } catch (error) {
      console.log(error)
    }
  }

  // 转化是否涉及生态保护红线
  transformSTBHX(analysisResult: any) {
    try {
      const obj: any = {
        land: 0,
        sea: 0,
        protection: 0,
        relic: 0,
        tree: 0,
        coast: 0,
      }
      analysisResult.forEach((item: any) => {
        const area = item.area
        const name = item.type.length > 0 ? item.type : item.layerName
        switch (name) {
          case '占用陆域生态红线':
            obj.land = area
            break
          case '占用海洋生态红线':
            obj.sea = area
            break
          case '海洋保护区':
            obj.protection = area
            break
          case '海洋自然景观与历史文化遗迹':
            obj.relic = area
            break
          case '红树林':
            obj.tree = area
            break
          case '重要自然岸线及沙源保护海域':
            obj.coast = area
            break
          default:
            break
        }
      })
      return obj
    } catch (error) {
      console.log(error)
    }
  }

  // 转化是否位于地质灾害易发区
  transformDisaster(analysisResult: any) {
    try {
      const obj = {
        value1: 0,
        value2: 0,
        value3: 0,
        value4: 0,
      }
      for (const item of analysisResult) {
        switch (item.type) {
          case '山洪危险区':
            obj.value1 = item.area
            break
          case '大中型矿山地质灾害易发区':
            obj.value2 = item.area
            break
          case '大中型水库地质灾害易发区':
            obj.value3 = item.area
            break
          case '斜坡及坡脚地质灾害易发区':
            obj.value4 = item.area
            break
          default:
            break
        }
      }
      return obj
    } catch (error) {
      console.log(error)
    }
  }

  // 转化是否位于风景名胜区内
  transformScene(analysisResult: any) {
    try {
      const obj = {
        value1: 0,
        value2: 0,
        value3: 0,
        value4: 0,
        value5: 0,
      }
      for (const item of analysisResult) {
        switch (item.type) {
          case '国家一级保护区':
            obj.value1 = item.area
            break
          case '国家二级保护区':
            obj.value2 = item.area
            break
          case '国家级三级保护区（陆域）':
            obj.value3 = item.area
            break
          case '国家级三级保护区（海域）':
            obj.value4 = item.area
            break
          case '鼓浪屿万石山风景名胜区范围（国家级）':
            obj.value5 = item.area
            break
          default:
            break
        }
      }
      return obj
    } catch (error) {
      console.log(error)
    }
  }

  // 转化轨道收储平衡用地
  transformGDSCPH(analysisResult: any) {
    try {
      const obj: any = {}
      analysisResult.forEach((item: any) => {
        const area = item.area
        switch (item.type) {
          case '轨道平衡用地':
            obj.gdph = area
            obj.use = item.typeStr
            break
          case '非轨道平衡用地':
            obj.fgdph = area
            break
          case '轨道收储用地':
            obj.gdsc = area
            break
          case '非轨道收储用地':
            obj.fgdsc = area
            break
          default:
            break
        }
      })
      return obj
    } catch (error) {
      console.log(error)
    }
  }

  // 转化文物保护范围
  transformWWBHFW(analysisResult: any) {
    try {
      const obj: any = {}
      analysisResult.forEach((item: any) => {
        const area = item.area
        switch (item.type) {
          case '文物保护范围':
            obj.wwhbfw = area
            break
          case '文物建筑控制':
            obj.wwjzkz = area
            break
          case '文物本体边界':
            obj.wwbtbj = area
            break
          case '保护范围':
            obj.bhfw = area
            break
          case '文物边界':
            obj.wwbj = area
            break
          default:
            break
        }
      })
      return obj
    } catch (error) {
      console.log(error)
    }
  }
}
</script>

<style lang="scss" scoped>
.information-col {
  padding: 0 5px;
  height: 40px;
  line-height: 40px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.btn-export {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 80px;
  height: 30px;
  background: #3d7eff;
  color: #fff;
  padding: 0;
}
.analysis-container {
  padding: 10px;
  .item {
    height: 100%;
    .title {
      display: flex;
      margin-bottom: 5px;
      line-height: 40px;
      .img {
        width: 40px;
        height: 40px;
        // background: url('./../../../static/images/01.png') no-repeat;
        background-size: 100%;
        margin-right: 10px;
      }
    }
    .content {
      display: flex;
      .line {
        width: 4px;
        // background: url('./../../../static/images/02.png') repeat-y;
        margin-left: 17px;
      }
      .project {
        padding-left: 30px;
        width: 100%;
        .tip {
          height: 30px;
          display: flex;
          align-items: center;
          position: relative;
          cursor: pointer;
          &::after {
            content: '';
            display: inline-block;
            width: 15px;
            height: 22px;
            // background: url('./../../../static/images/03.png') no-repeat;
            position: absolute;
            left: 3px;
            top: 26px;
          }
          span {
            display: inline-block;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #ccc;
            color: #fff;
            line-height: 20px;
            text-align: center;
            margin-right: 10px;
          }
          .name {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .iconfont {
            margin-left: 10px;
          }
          .analysis-img {
            margin-left: 10px;
          }
          margin-bottom: 15px;
          &:last-child {
            margin-bottom: 0;
            &::after {
              width: 0;
            }
          }
        }
        .name {
          width: 80%;
          border-bottom: 1px solid #fae1e1;
        }
        .menu-result {
          width: 20%;
          color: #ff9600;
          border-bottom: 1px solid #fae1e1;
        }
        .activeTip {
          span {
            background: #ff9600;
          }
          .name {
            color: #ff9600;
          }
        }
      }
    }
  }
}
.display {
  min-height: 1px;
}
.border-right {
  border-right: 1px solid #ebeef5;
}
.result-container {
  .result {
    .title {
      margin-bottom: 15px;
      .area {
        margin-left: 30px;
      }
    }
  }
}
.projectList-title {
  margin: 10px 0px;
}
/deep/ .el-table th {
  background: #ade3fe;
  text-align: center;
  color: #333;
}
/deep/.el-table--enable-row-transition .el-table__body td {
  text-align: center;
}
/deep/.el-table tr:nth-child(even) {
  background: #e2f0fd;
}
</style>
