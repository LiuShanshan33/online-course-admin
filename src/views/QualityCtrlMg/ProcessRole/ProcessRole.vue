// 流程角色管理
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
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
          <a @click="addForm">
            <img src="../../../views/images/添加@2x.png" width="17px" height="17px" />
            <span class="barIcon">添加</span>
          </a>
        </li>
        <li>
          <a @click="Alldelete">
            <img src="../../../views/images/删 除@2x.png" width="17px" height="17px" />
            <span class="barIcon">删除</span>
          </a>
        </li>
      </ul>
    </div>
    <!-- 表格 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      ref="RoleTable"
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
      @row-dblclick="DblUpdateRole"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55px" />
      <el-table-column label="序列号" type="index" align="left" width="80px" />
      <el-table-column label="角色编码" prop="roleCode" align="left" width="200px" />
      <el-table-column label="角色名称" prop="roleName" align="left" width="200px" />
      <el-table-column label="是否拥有APP管理权限" prop="roleManage" align="left" width="200px">
         <template slot-scope="scope">
          {{ map[scope.row.roleManage] }}
        </template>
      </el-table-column>
      <el-table-column label="关联员工" prop="empCount" align="left" width="160px">
      <template slot-scope="scope">
              <span>{{ scope.row.empCount }}人</span>
      </template>
      </el-table-column>
      <!-- <el-table-column label="类型" prop="type" align="center" width="80px">

      </el-table-column>-->
      <el-table-column label="操作" prop="formOperateType" align="center" min-width="80px">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="UpdateRole(scope.$index,scope.row)">修改</el-button>
          <el-button type="text" size="mini" @click="CheckRole(scope.$index,scope.row)">查看</el-button>
          <el-button type="text" size="mini" @click.native.prevent="deleteRow(scope.$index, delarr)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 记录条数 分页-->
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
import { parseTime } from '@/utils'
import Pagination from '@/_components/Pagination' // secondary package based on el-pagination
import { getProcessRole } from '@/api/user'
import { deleteRoleCode } from '@/api/delete'

// 类型
const TypeOptions = [
  { key: '1', display_name: '表单' },
  { key: '2', display_name: '列表' },
  { key: '3', display_name: '列表和打印' }
]
// 状态选择
const StatusOptions = [
  { key: '1', display_name: '已启用' },
  { key: '2', display_name: '已禁用' }
]

const TypeKeyValue = TypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const StatusKeyValue = StatusOptions.reduce((abc, curr) => {
  abc[curr.key] = curr.display_name
  return abc
}, {})

export default {
  name: 'ProcessRole',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      return StatusKeyValue[status]
    },
    typeFilter(type) {
      return TypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      id: '',
      delarr:[],
      ableCheck: false,
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 20,
        name: '',
        type: '',
        status: '',
        sort: '+id'
      },
      StatusOptions, // 状态选择
      TypeOptions, // 类型
      showReviewer: false,
      dialogFormVisible: false,
      form: { },
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      map: {
        0: '否',
        1: '是'
      }
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
   checkViews(row) {
      this.$refs.RoleTable.toggleRowSelection(row)
      this.form = row
      this.ableCheck = true
      console.log('有变化么', this.form)
    },
    getList() {
      this.listLoading = true
      const data = {
        pageIndex: this.listQuery.pageIndex,
        pageSize: this.listQuery.pageSize,
        name: this.listQuery.name,
        type: this.listQuery.type,
        status: this.listQuery.status
      }
      getProcessRole(data).then(response => {
        this.list = response.data.list
        this.total = response.data.totalCount
        console.log('测试长度', this.list.length)
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
    // 修改角色
    UpdateRole(index, row) {
      this.$router.push({
        path: '../QualityCtrlMg/updateRole',
        name: 'UpdateRole',
        query: {
          roleCode: row.roleCode,
          roleName: row.roleName,
          roleManage: row.roleManage
        }
      })
    },
    // 查看角色
    CheckRole(index, row) {
      this.$router.push({
        path: '../QualityCtrlMg/checkProcessRole',
        name: 'CheckProcessRole',
        query: {
          roleCode: row.roleCode,
          roleName: row.roleName,
          roleManage: row.roleManage
        }
      })
    },
    // 双击修改
    DblUpdateRole(form) {
       if (this.ableCheck) {
        this.$router.push({
          path: '../QualityCtrlMg/updateRole',
          name: 'UpdateRole',
          query: {
            roleCode: this.form.roleCode,
            roleName: this.form.roleName,
            roleManage: this.form.roleManage
        }
        })
      } else {
        this.$confirm('请先选择表单', '查看提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      }
    },
    // 添加
    addForm() {
      this.$router.push({
        path: '../QualityCtrlMg/ProcessRole/addRole.vue',
        name: 'AddProcessRole'
      })
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
    deleteRow(index, rows) { // 删除该行
    this.$confirm('确定删除此行?', '删除提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          deleteRoleCode(this.form.roleCode)
          .then(() => {
              this.list.splice(index, 1)
              console.log(this.list)
              this.getList()
              this.$message({
                type: 'success',
                message: '删除成功'
              })
          })
        })
    },
    handleSelectionChange(val) {
        this.multipleSelection = val
        console.log('多选选中的行', this.multipleSelection)
    },
    Alldelete() { // 多选删除
    if (this.ableCheck) {
    this.$confirm('确定删除?', '删除提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          for(let i = 0 ; i < this.multipleSelection.length; i++){
            console.log(this.multipleSelection[i].roleCode)
            deleteRoleCode(this.multipleSelection[i].roleCode)
          }
        }).then(() => {
              console.log(this.list)
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.getList()
          })
      } else {
        this.$confirm('请先选择表单', '删除提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      }
    },
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
