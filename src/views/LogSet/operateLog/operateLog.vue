<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="text-lable">员工号：</span>
      <el-input v-model="listQuery.empNo" style="width: 100px;" clearable placeholder="请输入" class="filter-item" @keyup.enter.native="handleSelect" />
      <span class="text-lable">渠道：</span>
      <el-input v-model="listQuery.channel" style="width: 100px;" clearable placeholder="请输入" class="filter-item" @keyup.enter.native="handleSelect" />
      <span class="text-lable">操作</span>
      <el-input v-model="listQuery.operate" style="width: 100px;" clearable placeholder="请输入" class="filter-item" @keyup.enter.native="handleSelect" />
      <span class="text-lable">IP：</span>
      <el-input v-model="listQuery.ip" style="width: 100px;" clearable placeholder="请输入" class="filter-item" @keyup.enter.native="handleSelect" />
      <!-- <span class="text-lable">登录结果：</span>
      <el-select v-model="listQuery.result" placeholder="请选择" clearable style="width: 98px" class="filter-item">
        <el-option v-for="item in TypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select> -->
      <span class="text-lable">登录日期：</span>
      <el-date-picker
        v-model="listQuery.startBeginTime"
        type="date"
        placeholder="开始日期"
      />
      <span class="text-lable" style="padding-left:0px">-</span>
      <el-date-picker
        v-model="listQuery.endBeginTime"
        type="date"
        clearable
        placeholder="结束日期"
      />
      <el-button v-waves class="filter-item search-btn" type="primary" @click="handleSelect">
        <span style="height:17px;line-height:17px;font-size:12px;padding-bottom:6px">搜索</span>
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      size="mini"
      :height="tableHeight"
      fit
      highlight-current-row
      stripe
      style="width: 100%;"
      :cell-style="{padding:'3px 2px'}"
      :header-cell-style="{background:'#F0F5F7', color:'#333333'}"
    >
      <el-table-column label="员工号" prop="empNo" align="center" width="80px" />
      <el-table-column label="渠道" prop="channel" align="center" width="120px" />
      <el-table-column label="操作" prop="operate" align="left" width="180px" />
      <el-table-column label="IP" prop="ip" align="center" width="130px" />
      <el-table-column label="操作日期" prop="createDate" align="center" :formatter="timestampToTime" width="160px" />
      <el-table-column label="内容" prop="content" align="left" min-width="220" class-name="small-padding fixed-width" /></el-table>
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
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/_components/Pagination' // secondary package based on el-pagination
import { getOperateLog } from '@/api/user'
// 状态选择
const TypeOptions = [
  { key: 'true', display_name: '成功' },
  { key: 'false', display_name: '不成功' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const TypeKeyValue = TypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'OperateLog',
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
        result: undefined,
        channel: undefined,
        startBegintime: undefined,
        endBegintime: undefined,
        ip: undefined,
        empNo: undefined,
        operate: undefined,
        sort: '+id'
      },
      TypeOptions, // 状态选择
      statusOptions: ['已启用', '禁用'],
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
      return window.innerHeight - 225
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
        type: this.listQuery.type,
        channel: this.listQuery.channel,
        startBegintime: this.listQuery.startBegintime,
        endBegintime: this.listQuery.endBegintime,
        ip: this.listQuery.ip,
        empNo: this.listQuery.empNo,
        operate: this.listQuery.operate
      }
      getOperateLog(data).then(response => {
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
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    timestampToTime(row, column) {
      if (row != null) {
        var date = new Date(row.createDate) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
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
    // 搜索
    handleSelect() {
      if (this.listQuery.empNo !== '' && this.listQuery.channel !== '' && this.listQuery.ip !== '') {
        this.listQuery.page = 1
        this.getList()
      } else { // 全空做刷新
        this.listQuery.page = 1
        this.getList()
      }
    },
    handleBan() {
      this.$confirm('确定禁用此表单?', '禁用提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      })
    }
  }
}
</script>
