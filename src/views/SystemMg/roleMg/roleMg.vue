<template>
  <div class="app-container">
    <!-- 工具栏 -->
    <div class="panelBar">
      <ul class="toolBar">
        <li>
          <a @click="addRoleMg">
            <img src="../../../views/images/添加.png" width="17px" height="17px">
            <span class="barIcon">新建管理员</span>
          </a>
        </li>
        <li>
          <a>
            <img src="../../../views/images/编辑.png" width="17px" height="17px">
            <span class="barIcon">修改角色</span>
          </a>
        </li>
        <li>
          <a>
            <img src="../../../views/images/删除.png" width="17px" height="17px">
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
    >
      <el-table-column label="用户名" prop="name_zh" align="center" min-width="130px" />
      <el-table-column label="角色" prop="name" align="center" min-width="130px" />
      <el-table-column label="操作" prop="formOperateType" align="center" min-width="80">
        <el-button
          type="text"
          size="mini"
          @click="updateRole()"
        >修改角色</el-button>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :page.sync="listQuery.pageIndex"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
    <!-- 打开的弹窗的内容 -->
    <el-dialog
      title="修改角色"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="用户名：" prop="username" :label-width="formLabelWidth">
          <el-input v-model="form.name_zh" autocomplete="off" />
        </el-form-item>
        <el-form-item label="用户密码：" prop="password" :label-width="formLabelWidth">
          <el-input v-model="form.password" type="password" autocomplete="off" />
        </el-form-item>
         <el-form-item label="用户角色：" prop="role" :label-width="formLabelWidth">
          <el-select v-model="form.role" placeholder="请选择" :disabled="add">
            <el-option
              v-for="item in RoleOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="callOf('form')">取 消</el-button>
        <el-button v-if="!add" type="primary" @click="updateRoleForm('form')">更 新</el-button>
        <el-button v-if="add" type="primary" @click="addRoleForm('form')">添 加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/_components/Pagination' // secondary package based on el-pagination
import { getRoleList } from '@/api/user'
import { updateRolePwd, addRole } from '@/api/addOrSave'

export default {
  name: 'RoleMg',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      RoleOptions:['管理员','教师'],
     listQuery: {
        pageIndex: 1,
        pageSize: 10
      },
      add: false,
      dialogFormVisible:false,
      formLabelWidth: '90px',
      form:{
        name_zh:'',
        password:'',
        role:''
      },
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
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
       let data = {
        page: this.listQuery.pageIndex,
        pagesize: this.listQuery.pageSize
      }
      console.log('调用接口前的data',data)
      getRoleList(data).then(response => {
        this.list = response.data.content
        this.total = response.data.totalElements
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
    // 点击修改
    updateRole() {
      this.ableCheck = true
      this.add = false
      if (this.ableCheck) {
        this.dialogFormVisible = true
      } else {
        this.$confirm('请先选择表单', '查看提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      }
    },
    updateRoleForm(form){
      // let data = {
      //   username: this.form.name_zh,
      //   password: this.form.password,
      //   role: this.form.role
      // }
      // console.log('修改前的data',data)
      updateRolePwd(this.form.name_zh,this.form.password,this.form.role).then(response =>{
        console.log('updateRolePwd',response)
         this.$message({
          type: 'success',
          message: '修改成功'
        })
        this.dialogFormVisible = false
        this.add = false
      })
    },
    addRoleMg(){
      this.dialogFormVisible = true
      this.add = true
      this.form.role = "管理员"
    },
    addRoleForm(form){
       addRole(this.form.name_zh, this.form.password, this.form.role).then(response =>{
         this.$message({
          type: 'success',
          message: '创建成功'
        })
        this.getList()
        this.$refs['form'].resetFields()
        this.dialogFormVisible = false
        this.add = false
      })
    },
     // 点击取消
    callOf(formName) {
  　　this.$refs['form'].resetFields()
      // 关闭对话框
  　　this.dialogFormVisible = false
    },
  }
}
</script>
