<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="text-lable">渠道：</span>
      <el-input
        v-model="listQuery.title"
        placeholder="请输入"
        style="width: 138px;"
        class="filter-item"
        @keyup.enter.native="handleSelect"
      />
      <el-button v-waves class="filter-item search-btn" type="primary" @click="handleSelect">
        <span style="height:17px;line-height:17px;font-size:12px;padding-bottom:6px">搜索</span>
      </el-button>
    </div>
    <!-- 工具栏 -->
    <div class="panelBar">
      <ul class="toolBar">
        <li>
          <a @click="addAppAuthorization">
            <img src="../../../views/images/添加@2x.png" width="17px" height="17px">
            <span class="barIcon">添加</span>
          </a>
        </li>
        <li>
          <a @click="updateAppAuthorization">
            <img src="../../../views/images/编辑@2x.png" width="17px" height="17px">
            <span class="barIcon">修改</span>
          </a>
        </li>
        <li>
          <a @click="deleteForm">
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
      @row-dblclick="updateAppAuthorization"
    >
      <el-table-column fixed type="index" label=" " align="center" width="45px" />
      <el-table-column label="渠道" prop="channel" align="center" width="100px" />
      <el-table-column label="授权KEY" prop="appKey" align="center" width="280px" />
      <el-table-column label="授权密码" prop="appSecret" align="center" min-width="200px" />
      <el-table-column
        label="操作"
        prop="formOperateType"
        align="center"
        width="300"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="getVisitPage(scope.$index,scope.row)">访问授权</el-button>
        </template>
      </el-table-column>
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
import { getAuthorizeInfo } from '@/api/user'
import { deleteAppAuth } from '@/api/delete'
// 状态选择
const TypeOptions = [
  { key: 'ON', display_name: '已启用' },
  { key: 'OFF', display_name: '禁用' }
]
export default {
  name: 'AppAuthorization',
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
        pageSize: 10,
        channel: undefined,
        sort: '+id'
      },
      importanceOptions: ['表单', '列表', '列表和打印'], // 类型
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
        channel: this.listQuery.channel
      }
      getAuthorizeInfo(this.listQuery).then(response => {
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
    deleteForm() {
      if (this.ableCheck) {
        this.$confirm('确定删除此表单?', '删除提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          deleteAppAuth(this.form.id)
            .then(() => {
              this.getList()
              this.$message({
                type: 'success',
                message: '删除成功'
              })
            })
        })
      } else {
        this.$confirm('请先选择表单', '删除提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      }
    },
    // 搜索
    handleSelect() {
      this.listQuery.page = 1
      this.getList()
    },
    // 添加
    addAppAuthorization() {
      this.$router.push({ path: '../SystemMg/addAppAuthorization' })
    },
    // 访问授权
    getVisitPage(index, row) {
      this.$router.push({
        path: '../SystemMg/visitAuthorization',
        name: 'VisitAuthorization',
        query: {
          id: row.id
        }
      })
    },
    // 修改
    updateAppAuthorization: function(form) {
      if (this.ableCheck) {
        this.$router.push({
          path: '../SystemMg/updateAppAuthorization',
          query: {
            id: this.form.id,
            channel: this.form.channel
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
