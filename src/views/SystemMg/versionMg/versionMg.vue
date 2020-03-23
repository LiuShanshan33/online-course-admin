<template>
  <div class="app-container">
    <div class="filter-container" style="display:inline">
      <span class="text-lable">文件类型：</span>
      <el-select v-model="listQuery.note" placeholder="请选择" clearable class="filter-item" style="width: 90px">
        <el-option v-for="item in TypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <span class="text-lable">文件名：</span>
      <el-input v-model="listQuery.fileName" placeholder="请输入" clearable style="width: 90px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <span class="text-lable">文件版本：</span>
      <el-input v-model="listQuery.realVersion" placeholder="请输入" clearable style="width: 90px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <span class="text-lable">是否最新：</span>
      <el-select v-model="listQuery.newest" placeholder="请选择" clearable class="filter-item" style="width: 90px">
        <el-option v-for="item in NewOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <span class="text-lable">创建时间：</span>
      <el-date-picker v-model="listQuery.startCreateTime" type="date" placeholder="开始日期" @keyup.enter.native="handleSelect" />
      <span class="text-lable" style="padding-left:0px">-</span>
      <el-date-picker v-model="listQuery.endCreateTime" type="date" clearable placeholder="结束日期" @keyup.enter.native="handleSelect" />
      <el-button v-waves class="filter-item search-btn" type="primary" @click="handleSelect">
        <span style="height:17px;line-height:17px;font-size:12px;padding-bottom:6px">搜索</span>
      </el-button>
    </div>
    <!-- 工具栏 -->
    <div class="panelBar">
      <ul class="toolBar">
        <li>
          <a @click="addVersionMg">
            <img src="../../../views/images/添加@2x.png" width="17px" height="17px">
            <span class="barIcon">添加</span>
          </a>
        </li>
        <li>
          <a @click="updateVersionMg">
            <img src="../../../views/images/编辑@2x.png" width="17px" height="17px">
            <span class="barIcon">修改</span>
          </a>
        </li>
        <li>
          <a>
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
      size="mini"
      :height="tableHeight"
      border
      fit
      highlight-current-row
      stripe
      style="width: 100%;"
      :cell-style="{padding:'3px 2px'}"
      :header-cell-style="{background:'#F0F5F7', color:'#333333'}"
      :default-sort="{prop: 'id', order: 'ascending'}"
      @row-click="checkViews"
      @row-dblclick="updateVersionMg"
    >
      <el-table-column type="index" label=" " align="center" width="40px" />
      <el-table-column label="文件类型" prop="note" align="center" min-width="130px" />
      <el-table-column label="文件版本" prop="realVersion" align="center" min-width="130px" />
      <el-table-column label="文件名" prop="fileName" align="center" min-width="130px" />
      <el-table-column label="是否最新" prop="newest" align="center" min-width="130px">
        <template slot-scope="scope">
          {{ scope.row.newest ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" :formatter="timestampToTime" align="center" min-width="130" class-name="small-padding fixed-width" />
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
import { getVersion } from '@/api/user'

// 状态选择
const TypeOptions = [
  { key: '0', display_name: '白板APK' }
]
const NewOptions = [
  { key: 'true', display_name: '是' },
  { key: 'false', display_name: '否' }
]
export default {
  name: 'VersionMg',
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
        code: '',
        fileName: '',
        realVersion: '',
        newest: '',
        startCreateTime: '',
        endCreateTime: ''
      },
      TypeOptions,
      NewOptions, // 状态选择
      showReviewer: false,
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
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
        channel: this.listQuery.channel,
        newest: this.listQuery.newest,
        realVersion: this.listQuery.realVersion,
        fileName: this.listQuery.fileName,
        startCreateTime: this.listQuery.startCreateTime,
        endCreateTime: this.listQuery.endCreateTime
      }
      getVersion(this.listQuery).then(response => {
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
    // 选中某一行
    checkViews: function(data) {
      this.form = data
      this.ableCheck = true
      console.log('有变化么', this.form)
    },
    // 搜索
    handleSelect() {
      this.listQuery.pageIndex = 1
      this.getList()
    },
    handleBan() {
      this.$confirm('确定禁用此表单?', '禁用提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      })
    },
    timestampToTime(row, column) {
      if (row != null) {
        var date = new Date(row.createTime) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-'
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        var D = date.getDate() + ' '
        var h = date.getHours() + ':'
        var m = date.getMinutes() + ':'
        var s = date.getSeconds()
        return Y + M + D + h + m + s
      } else {
        return null
      }
    },
    // 添加
    addVersionMg() {
      this.$router.push({ path: '../SystemMg/addVersionMg' })
    },
    // 修改
    updateVersionMg: function(form) {
      if (this.ableCheck) {
        this.$router.push({
          path: '../SystemMg/updateVersionMg',
          query: {
            id: this.form.id,
            code: this.form.code,
            file: this.form.file,
            realVersion: this.form.realVersion,
            fileName: this.form.fileName,
            newest: this.form.newest,
            note: this.form.note
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
<style scoped>
.el-date-editor {
  width: 128px !important;
}
</style>
