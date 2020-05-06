// 添加教师信息
<template>
  <el-scrollbar style="height:100%">
    <div class="container">
      <div class="top-container">
        <div class="content-title">添加教师信息</div>
        <hr>
      </div>
      <div class="content">
        <el-form ref="TeaForm" :model="TeaForm" :rules="rules" label-width="100px" size="mini">
          <el-form-item label="教师姓名" prop="tname">
            <el-input v-model="TeaForm.tname" />
          </el-form-item>
          <el-form-item label="工号">
            <el-input v-model="TeaForm.tid" />
          </el-form-item>
          <el-form-item label="性别" prop="tsex">
            <el-select v-model="TeaForm.tsex" placeholder="请选择">
              <el-option v-for="o in TsexOptions" :key="o" :value="o" />
            </el-select>
          </el-form-item>
          <el-form-item label="职称">
            <el-select v-model="TeaForm.positon" placeholder="请选择">
              <el-option v-for="positon in PositonOptions" :key="positon" :value="positon" />
            </el-select>
          </el-form-item>
          <el-form-item label="校区">
            <el-select v-model="TeaForm.tcampus" placeholder="请选择">
              <el-option v-for="o in campusOptions" :key="o" :value="o" />
            </el-select>
          </el-form-item>
          <el-form-item label="所属学院">
            <el-select v-model="TeaForm.tcollege" placeholder="请选择">
              <el-option v-for="o in collegeOptions" :key="o" :value="o" />
            </el-select>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="TeaForm.tphone" />
          </el-form-item>

          <el-form-item size="small">
            <el-button class="add-botton" @click="saveTeaInfo('TeaForm')">保存</el-button>
            <el-button @click="closeForm(tag)">关闭</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
import { addTeaInfo } from '@/api/addOrSave'

export default {
  name: 'AddTeacherInfo',
  data() {
    return {
      TeaForm: {
        tphone: '',
        tname: '',
        tid: '',
        tcampus: '',
        tsex: '',
        positon: '',
        tcollege: ''
      },
      TsexOptions: ['男', '女'], // 性别选择
      PositonOptions: ['高级教师', '讲师'], // 职称选择
      campusOptions: ['湛江校区', '东莞校区'], // 校区选择
      collegeOptions: ['生物医学工程学院', '基础医学院'], // 学院选择
      rules: {
        tname: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ],
        tid: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    // this.TeaForm.type = this.TypeOptions[0]
  },
  methods: {
    saveTeaInfo(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // tphone,tcampus,tid,tname,tsex,positon,tcollege
            console.log('this.TeaForm', this.TeaForm)
            const tphone = this.TeaForm.tphone
            const tcampus = this.TeaForm.tcampus
            const tid = this.TeaForm.tid
            const tname = this.TeaForm.tname
            const tsex = this.TeaForm.tsex
            const positon = this.TeaForm.positon
            const tcollege = this.TeaForm.tcollege
          addTeaInfo(
            tname, tsex, tid, tphone, tcampus, tcollege, positon
            )
          .then(response => {
            console.log('response成功', response)
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
