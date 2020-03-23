<template>
  <div class="container">
    <div class="top-container">
      <div class="content-title">添加员工</div>
      <hr>
    </div>
    <div class="content">
      <el-form ref="StaffForm" :model="StaffForm" :rules="rules" label-width="100px" size="mini">
        <el-form-item label="员工号" prop="empNo">
          <el-input v-model="StaffForm.empNo" />
        </el-form-item>
        <el-form-item label="员工姓名" prop="empName">
          <el-input v-model="StaffForm.empName" />
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="StaffForm.sex" placeholder="请选择" clearable>
            <el-option v-for="item in SexOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker v-model="StaffForm.birthday" clearable style="top:1px" />
        </el-form-item>
        <el-form-item label="职称">
          <el-input v-model="StaffForm.title" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="StaffForm.phone" />
        </el-form-item>
        <el-form-item label="学历">
          <el-select v-model="StaffForm.education" placeholder="请选择" clearable>
            <el-option v-for="item in EducationOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始工作时间">
          <el-input v-model="StaffForm.orderField" />
        </el-form-item>
        <el-form-item label="入职日期">
          <el-input v-model="StaffForm.orderType" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="StaffForm.status" placeholder="请选择" clearable>
            <el-option v-for="item in StatusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="岗位">
          <el-select v-model="StaffForm.job" placeholder="请选择" clearable>
            <el-option v-for="item in JobOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item size="small">
          <el-button class="add-botton" @click="save('StaffForm')">保存</el-button>
          <el-button @click="closeForm(tag)">关闭</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { saveUser } from '@/api/addOrSave'

export default {
  name: 'AddStaff',
  data() {
    return {
      StaffForm: {
        id: '',
        empNo: '',
        empName: '',
        sex: '',
        birthday: '',
        title: '',
        phone: '',
        education: '',
        orderField: '',
        orderType: '',
        status: '',
        job: '',
        superuser: false
      },
      SexOptions: ['男', '女', '其他'],
      EducationOptions: ['中专', '高职高专', '大学本科', '硕士研究生', '博士研究生'],
      StatusOptions: ['在岗', '停职', '离职', '研究生'],
      JobOptions: ['一线', '二线', '护长', '实习生'],
      rules: {
        empNo: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ],
        empName: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.StaffForm.status = this.StatusOptions[0]
  },
  methods: {
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveUser(this.StaffForm).then(response => {
            this.StaffForm = response.data
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.closeForm()
          })
        } else {
          this.$message({
            type: 'error',
            message: '提交数据不完整，请改正后再提交！'
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
.content {
  padding: 12px 0 0 62px;
  font-size: 12px !important;
}
.el-input {
  width: 50%;
}
.el-button {
  width: 75px;
  height: 30px;
}
/deep/ .el-select-dropdown .el-popper{
  top: -10px!important;
}
</style>
