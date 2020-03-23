<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="text-lable" style="width: auto">模板编码：</span>
      <el-input v-model="listQuery.qcCode" clearable placeholder="请输入" style="width: auto;" class="filter-item" @keyup.enter.native="handleSelect" />
      <span class="text-lable">模板名称：</span>
      <el-input v-model="listQuery.qcName" placeholder="请输入" clearable style="width: auto;" class="filter-item" @keyup.enter.native="handleSelect" />
      <span class="text-lable">是否公共：</span>
      <el-select v-model="listQuery.publicUse" placeholder="请选择" clearable style="width: auto" class="filter-item">
        <el-option v-for="item in TypeOptions" :key="item.key" :label="item.value" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item search-btn" type="primary" @click="handleSelect">
        <span style="height:17px;line-height:17px;font-size:12px;padding-bottom:6px">搜索</span>
      </el-button>
    </div>
    <div class="panelBar">
      <el-button type="primary" icon="el-icon-edit" style="width: auto" @click="saveQcTemplate">保存</el-button>
      <el-button type="primary" icon="el-icon-edit" style="width: auto" @click="saveQcTemplate">修改</el-button>
      <el-button type="primary" icon="el-icon-edit" style="width: auto" @click="deleteQcTemplate">删除</el-button>
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
      :cell-style="{padding:'3px 2px'}"
      :header-cell-style="{background:'#F0F5F7', color:'black'}"
      @row-click="checkViews"
      @row-dblclick="saveQcTemplate"
    >
      <el-table-column label="模板编码" prop="qcCode" align="center" min-width="auto" />
      <el-table-column label="模板名称" prop="qcName" align="center" width="auto" />
      <el-table-column label="模板说明" prop="intro" align="center" width="auto" />
      <el-table-column label="是否公共" prop="publicUse" align="center" width="auto">
        <template slot-scope="scope">
          {{ mapData[scope.row.itemType] }}
        </template>
      </el-table-column>
    </el-table>
    <!-- 记录条数 分页-->
    <pagination
      :total="total"
      :page.sync="listQuery.pageIndex"
      :limit.sync="listQuery.pageSize"
      @pagination="getPage"
    />
  </div>
</template>

<script>
import waves from '@/directive/waves'
import Pagination from '@/_components/Pagination'
import { getTemplatePage, deleteTemplate } from '@/api/qcTemplate'

const TypeOptions = [
  { key: '1', value: '是' },
  { key: '0', value: '否' }
]
export default {
  name: 'QcTemplateMg',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      mapData: {}, // map数据结构
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      ableCheck: false,
      listQuery: {
        pageIndex: 1,
        pageSize: 20,
        qcCode: undefined,
        qcName: undefined,
        publicUse: undefined
      },
      TypeOptions
    }
  },
  created() {
    this.getPage()
    this.initType()
  },
  methods: {
    getPage() {
      const data = {
        pageIndex: this.listQuery.pageIndex,
        pageSize: this.listQuery.pageSize,
        qcCode: this.listQuery.qcCode,
        qcName: this.listQuery.qcName,
        publicUse: this.listQuery.publicUse
      }
      getTemplatePage(data).then(response => {
        this.list = response.data.list
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

    // 表格高度
    computed: {
      tableHeight() {
        return window.innerHeight - 225
      }
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getPage()
    },
    handleSelect() {
      if (this.listQuery.qcCode !== '' && this.listQuery.qcName !== '' && this.listQuery.publicUse !== '') {
        this.listQuery.page = 1
        this.getPage()
      } else { // 全空做刷新
        this.listQuery.page = 1
        this.getPage()
      }
    },
    saveQcTemplate() {
      if (this.ableCheck) {
        this.$router.push({
          path: '../qcTemplateMg/saveQcTemplate',
          name: 'saveQcTemplate',
          query: {
            qcCode: this.form.formCode,
            qcName: this.form.itemCode
          }
        })
      } else {
        this.$message({
          message: '请选择一行数据',
          type: 'warning'
        })
      }
    },
    deleteQcTemplate() {

    },
    checkViews(data) {
      this.form = data
      this.ableCheck = true
    },
    formatType(row, column, cellValue) {
      for (const i in this.TypeOptions) {
        if (cellValue === this.TypeOptions[i].key) {
          return this.TypeOptions[i].value
        }
      }
    },
    initType() {
      for (const i in this.TypeOptions) {
        this.$set(this.mapData, this.TypeOptions[i].key, this.TypeOptions[i].value)
      }
    }
  }
}
</script>

<style scoped>
</style>
