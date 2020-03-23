<template>
  <div class="app-container">
    <div class="top-content">
      <p>
        诊断编码:
        <span>{{ this.$route.query.code }}</span> 措施大纲:
      </p>
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
      <el-table-column label="护理措施类型" prop="type" align="left" min-width="130px" />
      <el-table-column label="护理措施" prop="measure" align="center" min-width="130px" />
      <el-table-column label="护理措施详情" prop="measureDetail" align="left" min-width="300px" />
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
import { busDiagMeasureDetail } from '@/api/columnBtn'

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      DiagnoseTable: {
        code: this.$route.query.code
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
      busDiagMeasureDetail(this.DiagnoseTable).then(response => {
        this.DiagnoseTable = response.data
        this.list = response.data.list
        this.total = response.data.count

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
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
