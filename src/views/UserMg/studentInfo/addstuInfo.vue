// 添加学生信息
<template>
<el-scrollbar style="height:100%">
  <div class="container">
    <div class="top-container">
      <div class="content-title">添加学生信息</div>
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
        <el-form-item label="性别">
          <el-select v-model="StuForm.ssex" placeholder="请选择">
            <el-option v-for="o in SsexOptions" :key="o" :value="o" />
          </el-select>
        </el-form-item>
        <el-form-item label="年级">
          <el-select v-model="StuForm.grade" placeholder="请选择">
            <el-option v-for="o in GradeOptions" :key="o" :value="o" />
          </el-select>
        </el-form-item>
        <el-form-item label="校区">
          <el-select v-model="StuForm.scampus" placeholder="请选择">
            <el-option v-for="o in ScampusOptions" :key="o" :value="o" />
          </el-select>
        </el-form-item>
         <el-form-item label="所属学院">
          <el-select v-model="StuForm.scollege" placeholder="请选择" @change="scollegeChange($event)">
            <el-option v-for="o in ScollegeOptions" :key="o.code" :value="o.value">{{o.value}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专业">
          <el-select v-model="StuForm.major" placeholder="请选择">
            <el-option v-for="o in MajorOptions" :key="o.code" :value="o.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="StuForm.sphone" />
        </el-form-item>

        <el-form-item size="small">
          <el-button class="add-botton" @click="saveStuInfo('StuForm')">保存</el-button>
          <el-button @click="closeForm(tag)">关闭</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</el-scrollbar>
</template>

<script>
import { getSecCollege, getSubject } from '@/api/user'
import { addStuInfo } from '@/api/addOrSave'

export default {
  name: 'AddStuInfo',
  data() {
    return {
      StuForm: {
        grade: '',
        major: '',
        scampus: '',
        scollege: '',
        sid: '',
        sname: '',
        sphone: '',
        ssex: ''
      },
      scollegecode:'',
      SsexOptions: ['男', '女'], // 性别选择
      GradeOptions: ['2015', '2016', '2017', '2018', '2019'], // 年级选择
      ScampusOptions: ['湛江校区', '东莞校区'], // 校区选择
      ScollegeOptions:['生物医学工程学院', '基础医学院','外国语学院','第一临床医学院','第二临床医学院','第三临床医学院','医学检验学院','护理学院','药学院','人文与管理学院','公共卫生学院'], // 专业选择
      MajorOptions: ['信息管理与信息系统', '生物医学工程', '信息资源管理'], // 类型选择
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
    this.getCollegeList()
    // this.StuForm.type = this.TypeOptions[0]
  },
  methods: {
    getCollegeList(){
      let data = {
        page: 1,
        pagesize: 50,
        collegecode: 1
      }
      getSecCollege(data).then(response=>{
        this.ScollegeOptions = response.data.content
        console.log('data',response)
      })
    },
    scollegeChange(event) {
        // this.scollege = event.target.key; //getSubject
        console.log('event',event)
        this.StuForm.major = ''
        if(event === "第一临床医学院"){
          this.scollegecode = 1
        }else if(event === "第二临床医学院"){
          this.scollegecode = 2
        }else if(event === "第三临床医学院"){
          this.scollegecode = 3
        }else if(event === "公共卫生学院"){
          this.scollegecode = 4
        }else if(event === "护理学院"){
          this.scollegecode = 5
        }else if(event === "基础医学院"){
          this.scollegecode = 6
        }else if(event === "外国语学院"){
          this.scollegecode = 7
        }else if(event === "人文与管理学院"){
          this.scollegecode = 8
        }else if(event === "生物医学工程学院"){
          this.scollegecode = 9
        }else if(event === "药学院"){
          this.scollegecode = 10
        }else if(event === "医学检验学院"){
          this.scollegecode = 11
        }
        console.log('this.scollegecode',this.scollegecode)
        let data = {
          collegecode: 1,
          secondarycollegecode:this.scollegecode,
          page: 1,
          pagesize: 50,
        }
        getSubject(data).then(response=>{
           this.MajorOptions = response.data.content
          console.log('data',response)
        })
    },
     saveStuInfo(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // tphone,tcampus,tid,tname,tsex,positon,tcollege
            console.log('this.StuForm', this.StuForm)
            const grade = this.StuForm.grade
            const major = this.StuForm.major
            const scampus = this.StuForm.scampus
            const scollege = this.StuForm.scollege
            const sid = this.StuForm.sid
            const sname = this.StuForm.sname
            const sphone = this.StuForm.sphone
            const ssex = this.StuForm.ssex
          addStuInfo(
            scollege, sid, scampus, grade, major, sphone, sname, ssex
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
