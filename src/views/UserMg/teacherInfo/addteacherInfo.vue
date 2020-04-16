// 添加教师信息
<template>
<el-scrollbar style="height:100%">
  <div class="container">
    <div class="top-container">
      <div class="content-title">添加教师信息</div>
      <hr>
    </div>
    <div class="content">
      <el-form ref="DeptForm" :model="DeptForm" :rules="rules" label-width="100px" size="mini">
        <el-form-item label="学生姓名" prop="code">
          <el-input v-model="DeptForm.code" />
        </el-form-item>
        <el-form-item label="学号" prop="name">
          <el-input v-model="DeptForm.name" />
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="DeptForm.type" placeholder="请选择">
            <el-option v-for="o in TypeOptions" :key="o" :value="o" />
          </el-select>
        </el-form-item>
        <el-form-item label="年级">
          <el-select v-model="DeptForm.type" placeholder="请选择">
            <el-option v-for="o in TypeOptions" :key="o" :value="o" />
          </el-select>
        </el-form-item>
        <el-form-item label="校区">
          <el-select v-model="DeptForm.type" placeholder="请选择">
            <el-option v-for="o in TypeOptions" :key="o" :value="o" />
          </el-select>
        </el-form-item>
         <el-form-item label="所属学院">
          <el-select v-model="DeptForm.type" placeholder="请选择">
            <el-option v-for="o in TypeOptions" :key="o" :value="o" />
          </el-select>
        </el-form-item>
        <el-form-item label="专业">
          <el-select v-model="DeptForm.type" placeholder="请选择">
            <el-option v-for="o in TypeOptions" :key="o" :value="o" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="DeptForm.name" />
        </el-form-item>

        <el-form-item size="small">
          <el-button class="add-botton" @click="saveDept('DeptForm')">保存</el-button>
          <el-button @click="closeForm(tag)">关闭</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</el-scrollbar>
</template>

<script>
import { saveDeptInfo } from '@/api/addOrSave'

export default {
  name: 'AddTeacherInfo',
  data() {
    return {
      DeptForm: {
        code: '',
        name: '',
        alias: '',
        bigDept: '',
        type: '',
        symbol: '',
        postion: '',
        intro: ''
      },
      TypeOptions: ['其他', '门诊', '住院', '护理单元', '药房', '财务'], // 类型选择
      rules: {
        name: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.DeptForm.type = this.TypeOptions[0]
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
