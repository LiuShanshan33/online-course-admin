// 修改流程角色
<template>
  <el-scrollbar :style="conheight">
    <div class="container">
      <div class="top-container">
        <div class="content-title">修改角色</div>
        <hr />
      </div>
      <div class="bottom-container">
        <div class="scoll">
          <el-form
            ref="DiagnoseForm"
            :label-position="labelPosition"
            :model="DiagnoseForm"
            :rules="rules"
            label-width="128px"
            class="top-form"
          >
            <el-form-item label="角色编码:" prop="roleCode">
              <el-input v-model="DiagnoseForm.roleCode" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="角色名字:" prop="roleName">
              <el-input v-model="DiagnoseForm.roleName" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="是否拥有查看APP 管理权限:">
              <el-switch
                v-model="DiagnoseForm.roleManage"
                active-text="是"
                inactive-color="#BFBFBF"
                inactive-text="否"
                active-value="1"
                inactive-value="0"
              />
            </el-form-item>
            <el-form-item label="关联员工:">
              <el-button style="width:55px" @click="AddItems">
                <i class="el-icon-plus">添加</i>
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-table
                :key="tableKey"
                v-loading="listLoading"
                :data="DiagnoseForm.userList"
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
                <el-table-column label="序列号" type="index" align="left" width="80px" />
                <el-table-column label="员工职称" align="left" width="140px">
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="'userList.' + scope.$index + '.title'"
                      :rules="rules.title"
                      style="margin-bottom:0px!important"
                    >
                      <el-select
                        v-model="scope.row.title"
                        size="small"
                        clearable
                        filterable
                        placeholder="请选择"
                        @change="TitleChange($event, scope.row)"
                      >
                        <el-option
                          v-for="item in titleList"
                          :key="item"
                          :label="item"
                          :value="item"
                        />
                      </el-select>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="员工姓名" align="left" width="120px">
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="`userList.${scope.$index}.empName`"
                      :rules="rules.empName"
                      style="margin-bottom:0px!important"
                    >
                      <el-select
                        v-model="scope.row.empName"
                        size="small"
                        clearable
                        filterable
                        placeholder="请选择"
                        @change="empChange($event, scope.row)"
                      >
                        <el-option
                          v-for="item in empNameList"
                          :key="item.empNo"
                          :label="item.empName"
                          :value="item.empNo"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="员工工号" align="left" width="120px">
                  <template slot-scope="scope">
                    <span>{{ scope.row.empNo }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="病区" align="center" width="140px">
                  <template slot-scope="scope">
                    <span>{{ scope.row.inpatientArea }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" min-width="80px">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      size="mini"
                      @click.native.prevent="deleteRow(scope.$index, delarr)"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
            <el-form-item class="bottom-btn">
              <div style="margin-top:20px">
                <el-button class="add-botton" @click="save('DiagnoseForm')">保存</el-button>
                <el-button @click="closeForm('tag')">关闭</el-button>
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
import { getTitleInfo, getRoleInfo, getRoleDept } from '@/api/user' // 获取员工职称,员工信息
export default {
  name: 'AddDiagnose',
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      hidden: false,
      tableKey: '0',
      DiagnoseForm: {
        roleCode: this.$route.query.roleCode,
        roleName: this.$route.query.roleName,
        roleManage: this.$route.query.roleManage,
        userList: []
      },
      // list: {
      //   empName: ' ',
      //   empNo: ' ',
      //   inpatientArea: ' ',
      //   title: ' '
      // },
      list: [],
      items: [],
      delarr: [], // 存放删除的数据
      labelPosition: 'right',
      seen: false,
      titleList: [],
      listLoading: true,
      empNameList: [],
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
        ],
        title: [
          { type: 'string', required: true, message: '必填字段', trigger: 'change' }
        ],
        empName: [
          { type: 'string', required: true, message: '必填字段', trigger: 'change' }
        ]
      }

    }
  },
  // watch: {
  //   filterText(val) {
  //     this.$refs.tree2.filter(val)
  //   }
  // },
  computed: {
    tableHeight() {
      return window.innerHeight - 380
    }
  },
  created() {
    this.totalHeight()
    this.getList()
    this.getTitle()
  },
  methods: {
    totalHeight() {
      this.conheight.height = window.innerHeight - 100 + 'px'
    },
    getList() {
      this.listLoading = true
      console.log('角色编码', this.DiagnoseForm.roleCode)
      getListByRoleCode(this.DiagnoseForm.roleCode).then(response => {
        this.DiagnoseForm.userList = response.data.userList
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 100)
      })
    },
    getTitle() {
      getTitleInfo(this.DiagnoseForm.userList).then(res => {
        this.titleList = res.data.list
      })
    },
    // 联动科室名改变
    TitleChange(event, row) {
      row.empName = ''
      row.empNo = ''
      row.inpatientArea = ''
      console.log('选择后返回', event)
      this.empNameList = []
      if (event !== '') {
        getRoleInfo(event).then(res => {
          this.empNameList = res.data
          console.log('传回的数据', this.empNameList)
        })
      }
      else {
        return null
      }
    },
    // 获取得到的empCode
    empChange(event, row) {
      console.log(event)
      // console.log(event.empName)
      console.log(row)
      row.empNo = event
      // row.inpatientArea = event.inpatientArea
      if (event !== '') {
        getRoleDept(event).then(res => {
          console.log(res.data.inpatientArea)
          row.inpatientArea = res.data.inpatientArea
        })
      }
    },
    // 添加
    AddItems() {
      this.DiagnoseForm.userList.push({
        empNo: '',
        title: '',
        empName: '',
        inpatientArea: ''
        // sort: this.dictItems.length + 1,
      })
      console.log('有值么', this.DiagnoseForm.userList)
    },
    deleteRow(index, rows) { // 删除该行
      this.DiagnoseForm.userList.splice(index, 1)
      console.log('删除后的list', this.DiagnoseForm.userList)
    },
    // 保存
    save(formName) {
      console.log(formName)
      this.$refs[formName].validate((valid) => {
        console.log('验证消息1', valid)
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
