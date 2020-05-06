<template>
  <div class="container">
    <div class="top-container">
      <div class="content-title">修改密码</div>
      <hr>
    </div>
    <div class="content">
      <el-form ref="PwdForm" :model="PwdForm" :rules="rules" label-width="100px" size="mini">
        <el-form-item label="初始密码" prop="orginalPwd">
          <el-input v-model="PwdForm.orginalPwd" type="password" />
        </el-form-item>
        <el-form-item label="新密码" prop="orginalPwd">
          <el-input v-model="PwdForm.newPwd" type="password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="orginalPwd">
          <el-input v-model="PwdForm.newPwd" type="password" />
        </el-form-item>
        <el-form-item size="small">
          <el-button class="add-botton" @click="saveDept('PwdForm')">保存</el-button>
          <el-button @click="closeForm(tag)">关闭</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { saveDeptInfo } from '@/api/addOrSave'

export default {
  name: 'UpdateTeacherInfo',
  data() {
    return {
     PwdForm: {
       orginalPwd: '',
       newPwd: ''
      },
      TypeOptions: ['其他', '门诊', '住院', '护理单元', '药房', '财务'], // 类型选择
      rules: {
        orginalPwd: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
  },
  methods: {
    saveDept(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveDeptInfo(this.DeptForm).then(response => {
            this.DeptForm = response.data
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
.el-input,
.el-textarea {
  width: 40%;
}
.el-button {
  width: 75px;
  height: 30px;
}
</style>
