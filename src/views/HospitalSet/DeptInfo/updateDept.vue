<template>
  <div class="container">
    <div class="top-container">
      <div class="content-title">修改科室</div>
      <hr>
    </div>
    <div class="content">
      <el-form ref="DeptForm" :model="DeptForm" :rules="rules" label-width="100px" size="mini">
        <el-form-item label="科室编码" prop="code">
          <el-input v-model="DeptForm.code" />
        </el-form-item>
        <el-form-item label="科室名称" prop="name">
          <el-input v-model="DeptForm.name" />
        </el-form-item>
        <el-form-item label="科室别名">
          <el-input v-model="DeptForm.alias" />
        </el-form-item>
        <el-form-item label="大科室名称">
          <el-input v-model="DeptForm.bigDept" />
        </el-form-item>
        <el-form-item label="科室类别">
          <el-select v-model="DeptForm.type" placeholder="请选择">
            <el-option v-for="o in TypeOptions" :key="o" :value="o" />
          </el-select>
        </el-form-item>
        <el-form-item label="内外科标志">
          <el-input v-model="DeptForm.bigDept" />
        </el-form-item>
        <el-form-item label="位置">
          <el-input v-model="DeptForm.postion" />
        </el-form-item>
        <el-form-item label="科室介绍">
          <el-input v-model="DeptForm.intro" type="textarea" placeholder="请输入" />
        </el-form-item>
        <el-form-item size="small">
          <el-button class="add-botton" @click="saveDept('DeptForm')">保存</el-button>
          <el-button @click="closeForm(tag)">关闭</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { saveDeptInfo } from '@/api/addOrSave'

export default {
  name: 'UpdateDept',
  data() {
    return {
      DeptForm: {
        id: this.$route.query.id,
        code: this.$route.query.code,
        name: this.$route.query.name,
        alias: this.$route.query.alias,
        bigDept: this.$route.query.bigDept,
        type: this.$route.query.type,
        symbol: this.$route.query.symbol,
        postion: this.$route.query.postion,
        intro: this.$route.query.intro
      },
      TypeOptions: ['其他', '门诊', '住院', '护理单元', '药房', '财务'], // 类型选择
      rules: {
        code: [
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
