<template>
  <div class="app-container">
    <!-- 工具栏 -->
    <div class="panelBar">
      <ul class="toolBar">
        <li>
          <a @click="addRoleMg">
            <img src="../../../views/images/添加@2x.png" width="17px" height="17px">
            <span class="barIcon">添加角色</span>
          </a>
        </li>
        <li>
          <a @click="updateRoleMg">
            <img src="../../../views/images/编辑@2x.png" width="17px" height="17px">
            <span class="barIcon">修改角色</span>
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
      border
      :height="tableHeight"
      fit
      highlight-current-row
      stripe
      size="mini"
      style="width: 100%;"
      :cell-style="{padding:'3px 2px'}"
      :header-cell-style="{background:'#F0F5F7', color:'#333333'}"
      @row-click="checkViews"
      @row-dblclick="updateRoleMg"
    >
      <el-table-column label="ID" prop="id" align="center" width="40px" />
      <el-table-column label="名称" prop="name" align="center" min-width="130px" />
      <el-table-column
        label="拥有所有功能权限"
        prop="ownsAllRight"
        align="center"
        min-width="130px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">{{ !!(scope.row.ownsAllRight)?'是':'否' }}</template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :page.sync="listQuery.pageIndex"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import Pagination from '@/_components/Pagination' // secondary package based on el-pagination
import { getRolePage } from '@/api/user'

export default {
  name: 'RoleMg',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        ownsAllRight: '',
        showAllMoudle: ''
      },
      showReviewer: false,
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
      getRolePage(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.count
        console.log('treeList', this.list)
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    // 点击某行事件
    checkViews(data) {
      this.form = data
      this.ableCheck = true
      console.log(this.form)
    },
    // 添加
    addRoleMg() {
      this.$router.push({
        path: '../SystemMg/addRoleMg'
      })
    },
    // 修改
    updateRoleMg(form) {
      if (this.ableCheck) {
        this.$router.push({
          path: '../SystemMg/updateRoleMg',
          query: {
            id: this.form.id,
            name: this.form.name,
            ownsAllRight: this.form.ownsAllRight,
            showAllMoudle: this.form.showAllMoudle
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
