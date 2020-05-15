<template>
  <el-scrollbar style="height:100%">
    <div class="container">
      <div class="top-container">
        <div class="content-title">添加课程</div>
        <hr>
      </div>
      <div class="content">
        <div class="scoll" :style="conheight">
          <el-form ref="courseForm" :model="courseForm" :rules="rules" label-width="80px" size="mini">
            <el-form-item label="课程名称" prop="coursename">
              <el-input v-model="courseForm.coursename" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="课程类型" prop="type">
              <el-radio-group v-model="courseForm.type">
                <el-radio label="必修">必修课</el-radio>
                <el-radio label="选修">选修课</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="面向专业" prop="subject">
              <el-radio-group v-model="courseForm.subject" @change="radioChange">
                <el-radio label="全体">全体学生</el-radio>
                <el-radio label="部分">部分学生</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="changesubject" label="院系专业">
              <el-cascader
                ref="myCascader"
                v-model="subject"
                :options="options"
                :props="cascaderProp"
                size="medium"
                class="cascader"
                @change="cascaderChange"
                clearable
              />
            </el-form-item>
            <el-form-item label="课程负责人">
              <el-input v-model="courseForm.principal" placeholder="如有多个请用“,”隔开" />
            </el-form-item>
             <el-form-item label="课程描述">
              <el-input v-model="courseForm.introduction" type="textarea" placeholder="请输入" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveCourse('courseForm')">确认添加</el-button>
              <!-- <el-button @click="resetForm('courseForm')">取消</el-button> -->
            </el-form-item>
          </el-form></div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>

import { addCourseInfo } from '@/api/addOrSave'

// 类型
// const TypeOptions = [
//   { key: '1', display_name: '视频' },
//   { key: '2', display_name: 'PPT' },
//   { key: '3', display_name: 'Word文档' }
// ]
// const TypeKeyValue = TypeOptions.reduce((acc, cur) => {
//   acc[cur.key] = cur.display_name
//   return acc
// }, {})
export default {
  name: 'AddCourse',
  data() {
    return {
      radio: 0,
      changesubject: 0,
      subject: [],
      saveSubject: "",
      fileList: [],
      Campus: ['湛江校区', '东莞校区'],
      TypeOptions:['PPT', 'Word', '视频'],
      mode:{},
      courseForm: {
        type: '必修',
        subject: '全体'
      },
      conheight: {
        height: ''
      },
      rules: {
        coursename: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ],
        introduction: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ],
        principal: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ],
        subject: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ]
      },
      options: [{
          value: '2016',
          label: '2016',
          children: [{
            value: 'shejiyuanze',
            label: '生物医学工程学院',
            children: [{
              value: 'yizhi',
              label: '信息管理与信息系统'
            }, {
              value: 'fankui',
              label: '信息资源管理'
            },{
              value: 'kekong',
              label: '生物医学工程'
            }]
          }, {
            value: 'daohang',
            label: '人文与管理学院',
            children: [{
              value: 'cexiangdaohang',
              label: '应用心理学'
            }, {
              value: 'dingbudaohang',
              label: '社会工作'
            },{
              value: 'dingbudaohang',
              label: '劳保'
            }
            ]
          },
          {
            value: 'daohang',
            label: '药学院',
            children: [{
              value: 'cexiangdaohang',
              label: '中药学'
            }, {
              value: 'dingbudaohang',
              label: '药物分析'
            },{
              value: 'dingbudaohang',
              label: '应用化学'
            },{
              value: 'dingbudaohang',
              label: '药学'
            }
            ]
          },{
            value: 'navigation',
            label: '基础医学院',
            children: [{
              value: 'menu',
              label: '口腔医学'
            }, {
              value: 'tabs',
              label: '法医'
            }, {
              value: 'breadcrumb',
              label: '康复治疗学'
            }]
          }]
        }, {
          value: '2017',
          label: '2017',
          children: [{
            value: 'basic',
            label: '生物医学工程学院',
            children: [{
              value: 'layout',
              label: '信息管理与信息系统'
            }, {
              value: 'color',
              label: '信息资源管理'
            }]
          }, {
            value: 'form',
            label: '人文与管理学院',
            children: [{
              value: 'radio',
              label: '应用心理学'
            }, {
              value: 'checkbox',
              label: '社会工作'
            }, {
              value: 'input',
              label: '劳保'
            }]
          }, {
            value: 'data',
            label: '药学院',
            children: [{
              value: 'table',
              label: '中药学'
            }, {
              value: 'tag',
              label: '药物分析'
            }, {
              value: 'progress',
              label: '应用化学'
            }, {
              value: 'tree',
              label: '药学'
            }]
          }, {
            value: 'navigation',
            label: '基础医学院',
            children: [{
              value: 'menu',
              label: '口腔医学'
            }, {
              value: 'tabs',
              label: '法医'
            }, {
              value: 'breadcrumb',
              label: '康复治疗学'
            }]
          }]
        }, {
          value: '2018',
          label: '2018',
          children: [{
            value: 'axure',
            label: '基础医学院'
          }, {
            value: 'sketch',
            label: '生物医学工程学院'
          }, {
            value: 'jiaohu',
            label: '外国语学院'
          }]
        },
        {
          value: '2019',
          label: '2019',
          children: [{
            value: 'jichu',
            label: '基础医学院'
          }, {
            value: 'swyx',
            label: '生物医学工程学院'
          }, {
            value: 'wgy',
            label: '外国语学院'
          }]
        },
        ],
      cascaderProp: {
        multiple: true,
        // checkStrictly: true
      }
    }
  },
  created() {
    this.tableHeight()
  },
  methods: {
    tableHeight() {
      this.conheight.height = window.innerHeight - 140 + 'px'
    },
    radioChange($event) {
      this.changesubject = !this.changesubject
      console.log('选中状态改变时radio的值', this.courseForm.subject)
    },
    // 获取级联选择器选中值
    cascaderChange() {
      console.log('subject', this.subject)
      let Ssubject = ""
      for(let i = 0 ; i < this.subject.length; i++ ) {
        Ssubject += this.$refs['myCascader'].getCheckedNodes()[i].pathLabels[0] + this.$refs['myCascader'].getCheckedNodes()[i].pathLabels[2] + ","
        console.log('测试pathLabels', this.$refs['myCascader'].getCheckedNodes()[i]) 
      }
      this.courseForm.subject = Ssubject
      console.log('subject', this.saveSubject)      
    },
    saveCourse(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('保存this.courseForm', this.courseForm)
          const coursename = this.courseForm.coursename
          const introduction = this.courseForm.introduction
          const type = this.courseForm.type
          const principal = this.courseForm.principal
          let subject = this.courseForm.subject
          // if(this.saveSubject !==''){
          //   this.subject = this.saveSubject
          //   console.log('保存subject', subject)
          // }else{
          //   this.subject = this.courseForm.subject
          //   console.log('else')
          // }
          console.log('保存subject', this.subject)
          addCourseInfo(coursename, introduction, type, principal, subject).then(response => {
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
  // margin-right: 30px;
  font-size: 12px !important;
}
/deep/ .el-form-item__label {
  font-size: 12px;
}
.el-input {
  width: 50%;
}
.el-textarea {
  width: 50%;
}
.cascader{
  width: 50%;
}

</style>
