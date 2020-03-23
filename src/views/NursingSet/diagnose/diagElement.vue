<template>
  <div class="app-container">
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
      style="width: 100%;"
      :cell-style="{padding:'3px 2px'}"
      :header-cell-style="{background:'#F0F5F7', color:'#333333'}"
    >
      <el-table-column label="护理诊断编码" prop="code" align="left" min-width="130px" />
      <el-table-column label="因素类型" prop="type" align="center" min-width="130px" />
      <el-table-column label="序号" prop="serialNo" align="center" min-width="130px" />
      <el-table-column label="因素内容" prop="element" align="left" min-width="300px" />
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
import { busDiagElement } from '@/api/columnBtn'

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
      return window.innerHeight - 180
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = false
      busDiagElement(this.DiagnoseTable).then(response => {
        this.DiagnoseTable = response.data
        this.list = response.data.list
        this.total = response.data.count

        // Just to simulate the time of the request
        setTimeout(() => {
          // this.listLoading = false
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
