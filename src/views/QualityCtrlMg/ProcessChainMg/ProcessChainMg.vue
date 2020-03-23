// 流程链管理
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.chainName"
        placeholder="输入编码/流程链名称关键词模糊搜索"
        style="width: 245px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleSelect"
      />
      <el-button v-waves class="filter-item search-btn" type="primary" @click="handleSelect">
        <span>搜索</span>
      </el-button>
    </div>
    <!-- 工具栏 -->
    <div class="panelBar">
      <ul class="toolBar">
        <li>
          <a @click="addChain">
            <img src="../../../views/images/添加@2x.png" width="17px" height="17px">
            <span class="barIcon">添加</span>
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
      stripe
      highlight-current-row
      style="width: 100%;"
      :header-cell-style="{background:'#F0F5F7', color:'#333333'}"
      :cell-style="{padding:'3px 2px'}"
      @row-click="checkViews"
      @row-dblclick="checkChain"
    >
      <el-table-column type="selection" width="55px" />
      <el-table-column label="序列号" type="index" align="center" width="80px" />
      <el-table-column label="流程链编码" prop="chainCode" align="left" min-width="200px" />
      <el-table-column label="流程链名称" prop="chainName" align="left" min-width="200px" />
      <el-table-column label="操作" align="center" min-width="80px">
        <template slot-scope="{ row }">
          <el-button type="text" size="mini" @click="alterChain($index,row)">修改</el-button>
          <el-button type="text" size="mini" @click="checkChain($index,row)">查看</el-button>
          <el-button type="text" size="mini" @click="deleteChain($index,row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      class="page"
      :total="total"
      :page.sync="listQuery.pageIndex"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/_components/Pagination' // secondary package based on el-pagination
import { getProcessChain } from '@/api/user'
import { enableStatus, disableStatus } from '@/api/columnBtn'
export default {
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      id: '',
      ableCheck: false,
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 20,
        chainName: '',
        chainCode: ''
      },
      showReviewer: false,
      form: {
        name: ''
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
    checkViews(data) {
      this.form = data
      console.log(this.form)
      this.ableCheck = true
    },
    getList() {
      this.listLoading = true
      const data = {
        pageIndex: this.listQuery.pageIndex,
        pageSize: this.listQuery.pageSize,
        chainName: this.listQuery.chainName,
        chainCode: this.listQuery.chainCode
      }
      getProcessChain(data).then(response => {
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
        }, 1.5 * 100)
      })
    },

    // 搜索
    handleSelect() {
      if (this.listQuery.chainName !== '' || this.listQuery.chainCode !== '') {
        this.listQuery.page = 1
        this.getList()
      } else { // 全空做刷新
        this.listQuery.page = 1
        this.getList()
      }
    },
    // 添加
    addChain() {
      this.$router.push({
        path: '../ProcessChainMg/addChain',
        name: 'AddProcessChain'
      })
    },
    // 查看
    checkChain(index, row) {
      this.$router.push({
        path: '../ProcessChainMg/checkProcessChain',
        name: 'CheckProcessChain',
        query: {
          chainName: row.chainName,
          chainCode: row.chainCode
        }
      })
    },
    // 修改
    alterChain(index, row) {
      this.$router.push({
        path: '../ProcessChainMg/alterChain.vue',
        name: 'AlterProcessChain',
        query: {
          chainName: row.chainName,
          chainCode: row.chainCode
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-form-item--small .el-form-item__content {
  margin-left: 25%;
  .el-button {
    margin-right: 50px;
  }
}
</style>
