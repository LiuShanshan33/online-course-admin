// 质控评价管理
<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="text-lable">项目类别：</span>
      <el-select v-model="listQuery.qcItemType" clearable filterable placeholder="请选择" style="width: 168px;top: -6px">
            <el-option v-for="o in itemsTypeOptions" :key="o.qcItemType" :title="o.qcItemTypeName + ' ' + o.qcItemType" :label="o.qcItemTypeName + ' ' + o.qcItemType" :value="o.qcItemType"  style="width: 168px">{{ o.qcItemTypeName + ' ' + o.qcItemType }}</el-option>
      </el-select>
      <el-input
        v-model="listQuery.qcItemCode"
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
      <el-table-column label="项目编号" prop="qcItemCode" align="left" width="90px" />
      <el-table-column label="项目名称" prop="qcItemName" align="left" width="160px" />
      <el-table-column label="项目好的描述语" prop="qcItemGoodDesc" align="left" width="200px" />
      <el-table-column label="项目坏的描述语" prop="qcItemBadDesc" align="left" width="200px" />
      <el-table-column label="项目改进描述语" prop="qcItemImproveDesc" align="left" width="200px" />
      <el-table-column
        label="项目类别"
        prop="qcItemType"
        align="left"
        width="90px"
        class-name="small-padding fixed-width"
      >
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="100px">
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
import { getQCEPM, getqcItemType } from '@/api/user'
import { deleteQcItem } from '@/api/delete'
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
const qcItemTypeOptions = [
  { key: true, display_name: '是' },
  { key: false, display_name: '否' }
]
const qcLevelOptions = [
  { key: "1", display_name: '一级' },
  { key: "2", display_name: '二级' },
  { key: "3", display_name: '三级' },
]


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
        qcItemCode: undefined,
        qcItemName: undefined,
        qcItemGoodDesc: undefined,
        qcItemBadDesc: undefined,
        qcItemImproveDesc: undefined,
        qcItemType: undefined,
        qcLevel: ''
      },
      ableCheck: false,
      form: [],
      groupArr: [],
      groupList: [],
      itemsTypeOptions: [], // 类型
      publicOptions, // 是否公共
      MoreNurseOptions, // 是否可填写多个护士
      qcItemTypeOptions,
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
      return window.innerHeight - 275
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
          deleteQcItem(this.form.qcItemCode)
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
        qcItemType: this.listQuery.qcItemType,
        qcLevel: this.listQuery.qcLevel
      }
      getQCEPM(data).then(response => {
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
      getqcItemType().then(res => {
        this.itemsTypeOptions = res.data
        console.log('itemsTypeOptions', this.itemsTypeOptions)
      })
    },
    // 添加
    addForm() {
      this.$router.push({
        path: '../QCEvaluationTemp/QCEPM/AddQCEPM.vue',
        name: 'AddQCEPM',
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
        path: '../QCEvaluationTemp/QCEPM/UpdateQCEPM.vue',
        name: 'UpdateQCEPM',
        query: {
          qcItemCode: row.qcItemCode,
          qcItemName: row.qcItemName,
          qcItemGoodDesc: row.qcItemGoodDesc,
          qcItemBadDesc: row.qcItemBadDesc,
          qcItemImproveDesc: row.qcItemImproveDesc,
          indexNo: row.indexNo,
          qcItemBadDesc: row.qcItemBadDesc,
          qcItemImproveDesc: row.qcItemImproveDesc,
          qcItemType: row.qcItemType,
          qcLevel: row.qcLevel,
          qcDeptSource: row.qcDeptSource
        }
      })
    },
    // 修改床位
    updateTemplateMg(form) {
        this.$router.push({
          path: '../QCEvaluationTemp/QCEPM/UpdateQCEPM.vue',
          name: 'UpdateQCEPM',
          query: {
            qcItemCode: this.form.qcItemCode,
            qcItemName: this.form.qcItemName,
            qcItemGoodDesc: this.form.qcItemGoodDesc,
            qcItemBadDesc: this.form.qcItemBadDesc,
            qcItemImproveDesc: this.form.qcItemImproveDesc,
            qcItemType: this.form.qcItemType
          }
        })
    }
  }
}
</script>
<style scoped>
  .span-ellipsis {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
