<template>
  <div class="container">
    <div class="top-container">
      <div class="content-title">修改学生信息</div>
      <hr>
    </div>
    <div class="content">
      <el-form ref="StuForm" :model="StuForm" :rules="rules" label-width="100px" size="mini">
        <el-form-item label="学生姓名" prop="sname">
          <el-input v-model="StuForm.sname" />
        </el-form-item>
        <el-form-item label="学号" prop="sid">
          <el-input v-model="StuForm.sid" />
        </el-form-item>
        <el-form-item label="性别" prop="ssex">
          <el-select v-model="StuForm.ssex" placeholder="请选择">
            <el-option v-for="o in SsexOptions" :key="o" :value="o" />
          </el-select>
        </el-form-item>
        <el-form-item label="年级" prop="grade">
          <el-select v-model="StuForm.grade" placeholder="请选择">
            <el-option v-for="o in GradeOptions" :key="o" :value="o" />
          </el-select>
        </el-form-item>
        <el-form-item label="校区" prop="scampus">
          <el-select v-model="StuForm.scampus" placeholder="请选择">
            <el-option v-for="o in ScampusOptions" :key="o" :value="o" />
          </el-select>
        </el-form-item>
         <el-form-item label="所属学院" prop="sid">
          <el-select v-model="StuForm.scollege" placeholder="请选择">
            <el-option v-for="o in ScollegeOptions" :key="o" :value="o" />
          </el-select>
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-select v-model="StuForm.major" placeholder="请选择">
            <el-option v-for="o in MajorOptions" :key="o" :value="o" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="sphone"> 
          <el-input v-model="StuForm.sphone" />
        </el-form-item>

        <el-form-item size="small">
          <el-button class="add-botton" @click="saveStuForm('StuForm')">保存</el-button>
          <el-button @click="closeForm(tag)">关闭</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { updateStuInfo } from '@/api/addOrSave'

export default {
  name: 'UpdateStuInfo',
  data() {
    return {
      StuForm: {
        id: this.$route.query.id,
        grade: this.$route.query.grade,
        scampus: this.$route.query.scampus,
        major: this.$route.query.major,
        scollege: this.$route.query.scollege,
        sid: this.$route.query.sid,
        sname: this.$route.query.sname,
        sphone: this.$route.query.sphone,
        ssex: this.$route.query.ssex
      },
      SsexOptions: ['男', '女'], // 性别选择
      GradeOptions: ['2015', '2016', '2017', '2018', '2019'], // 年级选择
      ScampusOptions: ['湛江校区', '东莞校区'], // 校区选择
      ScollegeOptions:['生物医学工程学院', '基础医学院','外国语学院','第一临床医学院','第二临床医学院','第三临床医学院','医学检验学院','护理学院','药学院','人文与管理学院','公共卫生学院'], // 专业选择
      MajorOptions: ['信息管理与信息系统', '生物医学工程', '信息资源管理'], // 类型选择
      rules: {
        sname: [
          { required: true, message: '请输入学生姓名', trigger: 'blur' }
        ],
        sid: [
          { required: true, message: '请输入学号', trigger: 'blur' },
          {min: 11,max: 13,message: '请输入正确的学号！'},
        ],
        ssex: [
          { required: true, message: '必选字段', trigger: 'blur' }
        ],
         grade: [
          { required: true, message: '必选字段', trigger: 'blur' }
        ],
         major:[
          { required: true, message: '必选字段', trigger: 'blur' }
        ],
         scampus:[
          { required: true, message: '必选字段', trigger: 'blur' }
        ],
         scollege: [
          { required: true, message: '必选字段', trigger: 'blur' }
        ],
         sphone:[
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {validator:function(rule,value,callback){
	            if(/^1[34578]\d{9}$/.test(value) == false){
	                callback(new Error("请输入正确的手机号"));
	            }else{
	                callback();
	            }
	        }, trigger: 'blur'}
        ],
      }
    }
  },
  created() {
  },
  methods: {
    saveStuForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const id = this.StuForm.id
          const grade = this.StuForm.grade
          const scampus = this.StuForm.scampus
          const major = this.StuForm.major
          const scollege = this.StuForm.scollege
          const sid = this.StuForm.sid
          const sname = this.StuForm.sname
          const sphone = this.StuForm.sphone
          const ssex = this.StuForm.ssex
          updateStuInfo(id, scollege, sid, scampus, grade, major, sphone, sname, ssex).then(response => {
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
