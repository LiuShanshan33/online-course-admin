<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="text-lable">员工号：</span>
      <el-input v-model="listQuery.empNo" clearable placeholder="请输入" style="width: 100px;" class="filter-item" @keyup.enter.native="handleSelect" />
      <span class="text-lable">渠道：</span>
      <el-input v-model="listQuery.channel" placeholder="请输入" clearable style="width: 100px;" class="filter-item" @keyup.enter.native="handleSelect" />
      <span class="text-lable">IP：</span>
      <el-input v-model="listQuery.ip" placeholder="请输入" clearable style="width: 100px;" class="filter-item" @keyup.enter.native="handleSelect" />
      <span class="text-lable">登录结果：</span>
      <el-select v-model="listQuery.result" placeholder="请选择" clearable style="width: 98px" class="filter-item">
        <el-option v-for="item in TypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
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
      :height="tableHeight"
      fit
      highlight-current-row
      stripe
      size="mini"
      style="width: 100%;"
      :cell-style="{padding:'3px 2px'}"
      :header-cell-style="{background:'#F0F5F7', color:'#333333'}"
    >
      <el-table-column label="员工号" prop="empNo" align="center" min-width="130px" />
      <el-table-column label="登录渠道" prop="channel" align="center" width="130px" />
      <el-table-column label="IP" prop="ip" align="left" width="130px" />
      <el-table-column label="登录结果" prop="result" align="center" width="130px">
        <template slot-scope="scope">{{ !!(scope.row.result)?'成功':'失败' }}</template>
      </el-table-column>
      <el-table-column label="登录日期" prop="createDate" :formatter="timestampToTime" align="center" width="300px" />
      <el-table-column label="错误密码" prop="errorPassword" align="center" min-width="260" class-name="small-padding fixed-width" /></el-table>
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
import { getLoginLog } from '@/api/user'
// 状态选择
const TypeOptions = [
  { key: 'true', display_name: '成功' },
  { key: 'false', display_name: '失败' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const TypeKeyValue = TypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'Signlog',
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
        startCreateDate: undefined,
        endCreateDate: undefined,
        result: undefined,
        channel: undefined,
        type: undefined,
        ip: undefined,
        empNo: undefined,
        sort: '+id'
      },
      TypeOptions, // 状态选择
      // sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
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
        empNo: this.listQuery.empNo,
        channel: this.listQuery.channel,
        ip: this.listQuery.ip,
        startCreateDate: this.listQuery.startCreateDate,
        endCreateDate: this.listQuery.endCreateDate,
        result: this.listQuery.result
      }
      getLoginLog(data).then(response => {
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
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 搜索
    handleSelect() {
      if (this.listQuery.name !== '' && this.listQuery.type !== '' && this.listQuery.status !== '') {
        this.listQuery.page = 1
        this.getList()
      } else { // 全空做刷新
        this.listQuery.page = 1
        this.getList()
      }
    },
    // // 点击某行事件
    // checkViews: function(data) {
    //   this.form = data
    //   this.ableCheck = true
    //   console.log('有变化么', this.form)
    //   // console.log(this.form.title)
    // },
    // handleSelect() {
    //   this.$confirm('未搜到相关表单！', '搜索提示', {
    //     confirmButtonText: '确定',
    //     type: 'warning'
    //   })
    // },
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

