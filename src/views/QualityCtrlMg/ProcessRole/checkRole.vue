// 查看流程角色
<template>
  <el-scrollbar :style="conheight">
    <div class="container">
      <div class="top-container">
        <div class="content-title">查看角色</div>
        <hr />
      </div>
      <div class="bottom-container">
        <div class="scoll">
          <el-form
            ref="DiagnoseForm"
            :label-position="labelPosition"
            :model="DiagnoseForm"
            label-width="128px"
            class="top-form"
          >
            <el-form-item label="角色编码:">{{ DiagnoseForm.roleCode }}</el-form-item>
            <el-form-item label="角色名字:">{{ DiagnoseForm.roleName }}</el-form-item>
            <el-form-item
              label="是否拥有查看APP 管理权限:"
            >{{ (DiagnoseForm.roleManage === '1' ) ? '是' : '否' }}</el-form-item>
            <el-form-item label="关联员工:" class="bottom-btn">
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
                style="width: 70%;"
                :header-cell-style="{background:'#F0F5F7', color:'#333333'}"
                :cell-style="{padding:'3px 2px'}"
              >
                <el-table-column label="序列号" type="index" align="left" width="100px" />
                <el-table-column label="员工姓名" prop="empName" align="left" width="140px"></el-table-column>
                <el-table-column label="员工工号" prop="empNo" align="left" width="140px"></el-table-column>
                <el-table-column label="员工职称" prop="title" align="left" width="140px"></el-table-column>
                <el-table-column label="病区" prop="inpatientArea" align="center" min-width="140px"></el-table-column>
              </el-table>
              <div style="margin-top:20px">
                <el-button @click="closeForm('tag')">返回</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
import { saveProcessRole, getListByRoleCode } from '@/api/addOrSave' // 保存修改接口

export default {
  name: 'AddDiagnose',
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      tableKey: '0',
      DiagnoseForm: {
        roleCode: this.$route.query.roleCode,
        roleName: this.$route.query.roleName,
        roleManage: this.$route.query.roleManage,
        // userList: this.list
      },
      list: [],
      items: [],
      delarr: [], // 存放删除的数据
      labelPosition: 'right',
      seen: false,
      listLoading: true,
      formLabelAlign: {
        name: '',
        type: '',
        rulesDef: '',
        remarks: ''
      },
      conheight: {
        height: ''
      },
      rules: {
        roleCode: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ],
        roleName: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ]
      }

    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  computed: {
    tableHeight() {
      return window.innerHeight - 440
    }
  },
  created() {
    this.totalHeight()
    this.getList()
  },
  methods: {
    totalHeight() {
      this.conheight.height = window.innerHeight - 100 + 'px'
    },
    getList() {
      this.listLoading = true,
        getListByRoleCode(this.DiagnoseForm.roleCode).then(response => {
          this.list = response.data.userList
          console.log('测试长度', this.list)
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 100)
        }).then(() => {
          this.DiagnoseForm.userList = this.list
          console.log('关联员工列表', this.DiagnoseForm)
        })
    },
    // getItems(){
    //   this.DiagnoseForm.userList = this.list
    //   console.log('关联员工列表', this.DiagnoseForm.userList)
    // },
    // 添加
    AddItems() {
      this.list.push({
        empNo: '',
        title: '',
        empName: '',
        inpatientArea: ''
        // sort: this.dictItems.length + 1,
      })
      console.log('有值么', this.list)
    },
    deleteRow(index, rows) { // 删除该行
      this.list.splice(index, 1)
      console.log('删除后的list', this.list)
    },
    // 保存
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveProcessRole(this.DiagnoseForm).then(response => {
            // this.DiagnoseForm.userList = this.list
            this.DiagnoseForm = response.data
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            // this.getList()
            this.closeForm()
            console.log('保存以后', response.data)
          })
        } else {
          this.$message({
            type: 'error',
            message: '提交数据不完整，请改正后再提交!'
          })
          return false
        }
      })
    },
    closeForm(tag) {
      this.$store.state.tagsView.visitedViews.splice(this.$store.state.tagsView.visitedViews.findIndex(item => item.path === this.$route.path), 1)
      this.$router.push(this.$store.state.tagsView.visitedViews[this.$store.state.tagsView.visitedViews.length - 1].path)
    }
  }

}
</script>

<style lang="scss" scoped>
/deep/ .el-scrollbar {
  /deep/ .scrollbar-wrapper {
    height: 100%;
  }
}
.bottom-container {
  padding: 12px 0 0 12px;
  .el-input {
    width: 52%;
  }
}
/deep/ .el-form-item {
  margin-bottom: 12px !important;
}
</style>
