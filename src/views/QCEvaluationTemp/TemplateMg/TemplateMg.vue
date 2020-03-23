// 模板管理
<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="text-lable">质控所属的组：</span>
      <el-select v-model="listQuery.groupCode" clearable filterable placeholder="请选择" style="width: 168px;top: -6px">
        <el-option v-for="o in groupOptions" :key="o.code" :label="o.name + ' ' + o.code" :value="o.code">{{ o.name + ' ' + o.code }}</el-option>
      </el-select>
      <span class="text-lable">是否公共：</span>
      <el-select
        v-model="listQuery.publicUse"
        placeholder="请选择"
        clearable
        style="width: 88px"
        class="filter-item"
      >
        <el-option v-for="item in publicOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <span class="text-lable">是否评价表可以填写多个护士：</span>
      <el-select
        v-model="listQuery.writeMoreNurse"
        placeholder="请选择"
        clearable
        style="width: 88px"
        class="filter-item"
      >
        <el-option v-for="item in MoreNurseOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <span class="text-lable">是否与归档选项：</span>
      <el-select
        v-model="listQuery.MoreNurseOptions"
        placeholder="请选择"
        clearable
        style="width: 88px"
        class="filter-item"
      >
        <el-option v-for="item in hasArchiveItemOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <br>
      <span class="text-lable">质控级别：</span>
      <el-select
        v-model="listQuery.qcLevel"
        placeholder="全部"
        clearable
        style="width: 118px"
        class="filter-item"
      >
        <el-option v-for="item in qcLevelOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-input
        v-model="listQuery.qcCode"
        placeholder="请输入模版编号或名称搜索"
        style="width: 168px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleSelect"
      />
      <el-button class="filter-item search-btn" type="primary" @click="handleSelect">
        <span style="height:17px;line-height:17px;font-size:12px;padding-bottom:6px">搜索</span>
      </el-button>
    </div>
    <!-- 工具栏 -->
    <div class="panelBar">
      <ul class="toolBar">
        <li>
          <a @click="addForm">
            <img src="../../../views/images/添加@2x.png" width="17px" height="17px">
            <span class="barIcon">添加</span>
          </a>
        </li>
      </ul>
    </div>
    <!-- 表格 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      :height="tableHeight"
      fit
      highlight-current-row
      stripe
      size="mini"
      style="width: 100%;"
      :header-cell-style="{background:'#F0F5F7', color:'#333333'}"
      :cell-style="{padding:'3px 2px'}"
      @row-click="checkViews"
      @row-dblclick="updateTemplateMg"
    >
      <el-table-column label="序号" type="index" align="center" width="50px" />
      <el-table-column label="模版编号" prop="qcCode" align="left" width="100px" />
      <el-table-column label="模版名称" prop="qcName" align="left" width="120px" />
      <el-table-column label="模版简称" prop="simpleName" align="left" width="120px" />
      <el-table-column label="说明" prop="intro" align="left" width="180px" />
      <el-table-column label="质控表所属的组" prop="groupCode" align="center" width="120px" />
      <el-table-column label="是否公共" prop="publicUse" align="center" width="75px">
        <template slot-scope="scope">{{ !!(scope.row.publicUse)?'是':'否' }}</template>
      </el-table-column>
      <el-table-column
        label="是否评价表可以填写多个护士"
        prop="writeMoreNurse"
        align="center"
        class-name="status-col"
        width="120px"
      >
      <template slot-scope="scope">{{ !!(scope.row.writeMoreNurse)?'是':'否' }}</template>
      </el-table-column>
      <el-table-column
        label=" 是否与归档选项"
        prop="hasArchiveItem"
        align="center"
        width="70px"
        class-name="small-padding fixed-width"
      >
       <template slot-scope="scope">{{ !!(scope.row.hasArchiveItem)?'是':'否' }}</template>
      </el-table-column>
      <el-table-column
        label="质控级别"
        prop="qcLevel"
        align="center"
        min-width="100"
        class-name="small-padding fixed-width"
      >
      <template slot-scope="scope">
          {{ map[scope.row.qcLevel] }}
        </template>
      </el-table-column>
      <el-table-column
        label="质控科室列表来源"
        prop="qcDeptSource"
        align="center"
        width="140px"
        class-name="small-padding fixed-width"
      />
      <el-table-column label="操作" align="center" fixed="right" min-width="100px">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            @click="UpdateRow(scope.$index,scope.row)"
          >修改</el-button>
          <el-button
            type="text"
            size="mini"
             @click.native.prevent="deleteRow(scope.$index)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 记录条数 分页-->
    <pagination
      :total="total"
      :page.sync="listQuery.pageIndex"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/_components/Pagination' // secondary package based on el-pagination
import { getTemplateMg, getQcTemplateGroup } from '@/api/user'
import { deleteQcCode } from '@/api/delete'
// 状态选择
const TypeOptions = [
  { key: 'ON', display_name: '已启用' },
  { key: 'OFF', display_name: '禁用' }
]
const publicOptions = [
  { key: true, display_name: '是' },
  { key: false, display_name: '否' }
]
const MoreNurseOptions = [
  { key: true, display_name: '是' },
  { key: false, display_name: '否' }
]
const hasArchiveItemOptions = [
  { key: true, display_name: '是' },
  { key: false, display_name: '否' }
]
const qcLevelOptions = [
  { key: "1", display_name: '一级' },
  { key: "2", display_name: '二级' },
  { key: "3", display_name: '三级' },
]

// arr to obj, such as { CN : "China", US : "USA" }
const TypeKeyValue = TypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
const publicKeyValue = publicOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})


export default {
  name: 'TemplateMg',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        pageSize: 20,
        qcCode: undefined,
        qcName: undefined,
        groupCode: undefined,
        publicUse: undefined,
        writeMoreNurse: undefined,
        hasArchiveItem: undefined,
        qcLevel: ''
      },
      ableCheck: false,
      form: [],
      groupArr: [],
      groupList: [],
      groupOptions: [], // 类型
      publicOptions, // 是否公共
      MoreNurseOptions, // 是否可填写多个护士
      hasArchiveItemOptions,
      qcLevelOptions,
      TypeOptions, // 状态选择
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
       map: {
        1: '一级',
        2: '二级',
        3: '三级'
      }
    }
  },
  // 表格高度
  computed: {
    tableHeight() {
      return window.innerHeight - 310
    }
  },
  created() {
    this.getList()
    this.onLoad()
  },
  methods: {
    deleteRow(index, rows) { // 删除该行
    this.$confirm('确定删除此行?', '删除提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          deleteQcCode(this.form.qcCode)
          .then(() => {
              this.list.splice(index, 1)
              console.log(this.list)
              this.getList()
              this.$message({
                type: 'success',
                message: '删除成功'
              })
          })
        })
    },
    // 选中某一行
    checkViews: function(data) {
      this.form = data
      this.ableCheck = true
      console.log('有变化么', this.form)
    },
    getList() {
      this.listLoading = true
      const data = {
        pageIndex: this.listQuery.pageIndex,
        pageSize: this.listQuery.pageSize,
        qcCode: this.listQuery.qcCode,
        qcName: this.listQuery.qcName,
        groupCode: this.listQuery.groupCode,
        publicUse: this.listQuery.publicUse,
        writeMoreNurse: this.listQuery.writeMoreNurse,
        hasArchiveItem: this.listQuery.hasArchiveItem,
        qcLevel: this.listQuery.qcLevel
      }
      getTemplateMg(data).then(response => {
        this.list = response.data.list
        console.log('表格返回的数据', this.list)
        this.total = response.data.count
        if (this.list.length === 0) {
          this.$confirm('未搜到相关表单！', '搜索提示', {
            confirmButtonText: '确定',
            type: 'warning'
          })
        }
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    onLoad() {
      this.getOptionsData()
    },
    // 获取质控列表
    getOptionsData() {
      getQcTemplateGroup().then(res => {
        this.groupOptions = res.data
        console.log('groupOptions', this.groupOptions)
      })
    },
    // 添加
    addForm() {
      this.$router.push({
        path: '../QCEvaluationTemp/TemplateMg/AddTemplateMg.vue',
        name: 'AddTemplateMg'
      })
    },
    // 查询
    handleSelect() {
      if (this.listQuery.deptCode === '') {
        this.listQuery.page = 1
        this.getList()
      } else {
        this.listQuery.page = 1
        this.getList()
      }
    },
    // 添加床位
    addBed() {
      this.$router.push({ path: '../HospitalSet/addBed' })
    },
    UpdateRow(index, row) {
      this.$router.push({
        path: '../QCEvaluationTemp/TemplateMg/UpdateTemplateMg.vue',
        name: 'UpdateTemplateMg',
        query: {
          qcCode: row.qcCode,
          qcName: row.qcName,
          simpleName: row.simpleName,
          intro: row.intro,
          groupCode: row.groupCode,
          indexNo: row.indexNo,
          publicUse: row.publicUse,
          writeMoreNurse: row.writeMoreNurse,
          hasArchiveItem: row.hasArchiveItem,
          qcLevel: row.qcLevel,
          qcDeptSource: row.qcDeptSource
        }
      })
    },
    // 修改床位
    updateTemplateMg(form) {
        this.$router.push({
          path: '../QCEvaluationTemp/TemplateMg/UpdateTemplateMg.vue',
          name: 'UpdateTemplateMg',
          query: {
            qcCode: this.form.qcCode,
            qcName: this.form.qcName,
            simpleName: this.form.simpleName,
            intro: this.form.intro,
            groupCode: this.form.groupCode,
            indexNo: this.form.indexNo,
            publicUse: this.form.publicUse,
            writeMoreNurse: this.form.writeMoreNurse,
            hasArchiveItem: this.form.hasArchiveItem,
            qcLevel: this.form.qcLevel,
            qcDeptSource: this.form.qcDeptSource
          }
        })
    }
  }
}
</script>
