// 登录日志
<template>
  <div class="app-container">
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
       <!-- 序号 -->
      <el-table-column label="序号" type="index" align="center" width="80px" />
      <el-table-column label="登录用户名" prop="loginusername" align="center" width="210px" />
      <el-table-column label="登录角色" prop="loginrole" align="center" width="210px" />
      <el-table-column label="登录时间" prop="logintime" align="center" min-width="320px" />
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
      return window.innerHeight - 185
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      let data = {
        page: this.listQuery.pageIndex,
        pagesize: this.listQuery.pageSize
      }
      getLoginLog(data).then(response => {
        this.list = response.data.content
        this.total = response.data.totalElements
        console.log('LoginLog',response)
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
      .catch((e) => {
            this.$message.error('对不起，当前账号无权访问！')
            console.log('错误捕捉返回')
        }) 
      
    },
    closeForm(tag) {
      this.$store.state.tagsView.visitedViews.splice(this.$store.state.tagsView.visitedViews.findIndex(item => item.path === this.$route.path), 1)
      this.$router.push({ path: '../home/home.vue', name: 'Working' })
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
  }
}
</script>

