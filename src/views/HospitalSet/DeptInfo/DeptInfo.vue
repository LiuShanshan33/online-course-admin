<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="text-lable">名称：</span>
      <el-input
        v-model="listQuery.name"
        placeholder="请输入"
        style="width: 118px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleSelect"
      />
      <span class="text-lable">类型：</span>
      <el-select
        v-model="listQuery.type"
        placeholder="请选择"
        clearable
        style="width: 118px"
        class="filter-item"
        @keyup.enter.native="handleSelect"
      >
        <el-option v-for="item in TypeOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button v-waves class="filter-item search-btn" type="primary" @click="handleSelect">
        <span style="height:17px;line-height:17px;font-size:12px;padding-bottom:6px">搜索</span>
      </el-button>
    </div>
    <!-- 工具栏 -->
    <div class="panelBar">
      <ul class="toolBar">
        <li>
          <a @click="addDept">
            <img src="../../../views/images/添加@2x.png" width="17px" height="17px">
            <span class="barIcon">添加科室</span>
          </a>
        </li>
        <li>
          <a @click="updateDept">
            <img src="../../../views/images/编辑@2x.png" width="17px" height="17px">
            <span class="barIcon">修改科室</span>
          </a>
        </li>
        <li>
          <a :model="list" @click="deleteRow(id)">
            <img src="../../../views/images/删 除@2x.png" width="17px" height="17px">
            <span class="barIcon">删除</span>
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
      @row-dblclick="updateDept"
    >
      <el-table-column label="科室编码" prop="code" align="center" width="130px" />
      <el-table-column label="科室名称" prop="name" align="left" width="130px" />
      <el-table-column label="大科室名称" prop="bigDept" align="left" width="130px" />
      <el-table-column label="科室类别" prop="type" align="center" width="130px" />
      <el-table-column label="内外科标志" prop="symbol" align="center" width="130px" />
      <el-table-column label="位置" prop="postion" align="left" class-name="status-col" width="130" />
      <el-table-column
        label="科室介绍"
        prop="intro"
        align="center"
        min-width="300"
        class-name="small-padding fixed-width"
      />
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
import { getPage_5 } from '@/api/user'
import { deleteDeptInfo } from '@/api/delete'

export default {
  name: 'DeptInfo',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 20,
        name: '',
        type: ''
      },
      ableCheck: false,
      TypeOptions: ['其他', '门诊', '住院', '护理单元', '药房', '财务'], // 类型选择
      downloadLoading: false
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
  },
  methods: {
    getList() {
      this.listLoading = true
      const data = {
        pageIndex: this.listQuery.pageIndex,
        pageSize: this.listQuery.pageSize,
        name: this.listQuery.name,
        type: this.listQuery.type
      }
      getPage_5(data).then(response => {
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
    deleteRow() {
      if (this.ableCheck) {
        this.$confirm('确定删除此行?', '删除提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          deleteDeptInfo(this.form.id)
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        })
      } else {
        this.$confirm('请先选择表单', '查看提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      }
    },
    // 选中某一行
    checkViews: function(data) {
      this.form = data
      this.ableCheck = true
      console.log('有变化么', this.form)
    },
    // 搜索
    handleSelect() {
      if (this.listQuery.name === '') {
        this.listQuery.page = 1
        this.getList()
      } else {
        this.listQuery.page = 1
        this.getList()
      }
    },
    // 添加科室
    addDept() {
      this.$router.push({ path: '../HospitalSet/addDept', name: 'AddDept' })
    },
    // 修改科室
    updateDept: function(form) {
      if (this.ableCheck) {
        this.$router.push({
          path: '../HospitalSet/updateDept',
          name: 'UpdateDept',
          query: {
            id: this.form.id,
            code: this.form.code,
            name: this.form.name,
            alias: this.form.alias,
            bigDept: this.form.bigDept,
            type: this.form.type,
            symbol: this.form.symbol,
            postion: this.form.postion,
            intro: this.form.intro
          }
        })
      } else {
        this.$confirm('请先选择表单', '查看提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      }
    }
  }
}
</script>
