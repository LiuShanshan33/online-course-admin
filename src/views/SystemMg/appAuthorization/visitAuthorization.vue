// 访问授权
<template>
  <div class="app-container">
    <div class="top-content">
      <p>
        AppID:
        <span>{{ this.$route.query.id }}</span>
      </p>
    </div>
    <div class="panelBar">
      <ul class="toolBar">
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
      ref="DiagnoseTable"
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
      <el-table-column label="授权码" prop="authToken" align="left" min-width="130px" />
      <el-table-column label="授权日期" prop="createDate" :formatter="timestampToTime" align="center" min-width="130px" />
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
import { visitAuthorizeInfo } from '@/api/user'

export default {
  name: 'VisitAuthorization',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      AuthID: {
        id: this.$route.query.id
      },
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 20,
        code: ''
      },
      showReviewer: false,
      downloadLoading: false
    }
  },
  // 表格高度
  computed: {
    tableHeight() {
      return window.innerHeight - 210
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      visitAuthorizeInfo(this.AuthID).then(response => {
        this.AuthID = response.data
        this.list = response.data.list
        this.total = response.data.count
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    timestampToTime(row, column) {
      if (row.createDate != null) {
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
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-date-editor {
  height: 36px !important;
}
.el-range-editor.el-input__inner {
  padding-top: 8px !important;
}
</style>
