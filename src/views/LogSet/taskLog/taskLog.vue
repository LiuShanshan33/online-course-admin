<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="text-lable">任务：</span>
      <el-input
        v-model="listQuery.taskId"
        placeholder="请输入"
        clearable
        style="width: 118px;"
        class="filter-item"
        @keyup.enter.native="handleSelect"
      />
      <span class="text-lable">执行结果：</span>
      <el-select
        v-model="listQuery.success"
        placeholder="请选择"
        clearable
        style="width: 118px"
        class="filter-item"
        @keyup.enter.native="handleSelect"
      >
        <el-option v-for="item in TypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <span class="text-lable">执行日期：</span>
      <el-date-picker
        v-model="listQuery.startBeginTime"
        type="date"
        placeholder="开始日期"
        @keyup.enter.native="handleSelect"
      />
      <span class="text-lable" style="padding-left:0px">-</span>
      <el-date-picker
        v-model="listQuery.endBeginTime"
        type="date"
        clearable
        placeholder="结束日期"
        @keyup.enter.native="handleSelect"
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
      :height="tableHeight"
      fit
      highlight-current-row
      stripe
      style="width: 100%;"
      :cell-style="{padding:'3px 2px'}"
      :header-cell-style="{background:'#F0F5F7', color:'#333333'}"
      @row-click="checkViews"
    >
      <el-table-column label=" " type="index" align="center" width="43px" />
      <el-table-column label="任务" prop="taskId" align="center" width="100px" />
      <el-table-column label="开始日期" prop="begintime" :formatter="timesBeginToTime" align="center" min-width="130px" />
      <el-table-column label="结束日期" prop="endtime" :formatter="timestampToTime" align="center" width="160px" />
      <el-table-column label="结果" prop="success" align="center" width="130px">
        <template slot-scope="scope">{{ !!(scope.row.success)?'成功':'失败' }}</template>
      </el-table-column>
      <el-table-column
        label="日志"
        prop="result"
        align="left"
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
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/_components/Pagination' // secondary package based on el-pagination
import { getTaskLog } from '@/api/user'
// 状态选择
const TypeOptions = [
  { key: true, display_name: '成功' },
  { key: false, display_name: '失败' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const TypeKeyValue = TypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'TaskLog',
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
        taskId: undefined,
        success: '',
        channel: undefined,
        startBegintime: undefined,
        endBegintime: undefined
      },
      form: null,
      TypeOptions, // 状态选择
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
        taskId: this.listQuery.taskId,
        success: this.listQuery.success,
        channel: this.listQuery.channel,
        startBegintime: this.listQuery.startBegintime,
        endBegintime: this.listQuery.endBegintime
      }
      getTaskLog(data).then(response => {
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
    checkViews: function(data) {
      this.form = data
      this.ableCheck = true
      console.log('有变化么', this.form)
    },
    // 结束时间
    timesBeginToTime(row, column) {
      if (row != null) {
        var date = new Date(row.begintime) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
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
    timestampToTime(row, column) {
      if (row != null) {
        var date = new Date(row.endtime) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
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
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 搜索
    handleSelect() {
      if (this.listQuery.taskId !== '' || this.listQuery.success !== '' || this.listQuery.startBegintime !== '' || this.listQuery.endBegintime !== '') {
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
