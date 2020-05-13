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
            label: '设计原则',
            children: [{
              value: 'yizhi',
              label: '一致'
            }, {
              value: 'fankui',
              label: '反馈'
            }, {
              value: 'xiaolv',
              label: '效率'
            }, {
              value: 'kekong',
              label: '可控'
            }]
          }, {
            value: 'daohang',
            label: '导航',
            children: [{
              value: 'cexiangdaohang',
              label: '侧向导航'
            }, {
              value: 'dingbudaohang',
              label: '顶部导航'
            }]
          }]
        }, {
          value: '2017',
          label: '2017',
          children: [{
            value: 'basic',
            label: 'Basic',
            children: [{
              value: 'layout',
              label: 'Layout 布局'
            }, {
              value: 'color',
              label: 'Color 色彩'
            }, {
              value: 'typography',
              label: 'Typography 字体'
            }, {
              value: 'icon',
              label: 'Icon 图标'
            }, {
              value: 'button',
              label: 'Button 按钮'
            }]
          }, {
            value: 'form',
            label: 'Form',
            children: [{
              value: 'radio',
              label: 'Radio 单选框'
            }, {
              value: 'checkbox',
              label: 'Checkbox 多选框'
            }, {
              value: 'input',
              label: 'Input 输入框'
            }, {
              value: 'input-number',
              label: 'InputNumber 计数器'
            }, {
              value: 'select',
              label: 'Select 选择器'
            }, {
              value: 'cascader',
              label: 'Cascader 级联选择器'
            }, {
              value: 'switch',
              label: 'Switch 开关'
            }, {
              value: 'slider',
              label: 'Slider 滑块'
            }, {
              value: 'time-picker',
              label: 'TimePicker 时间选择器'
            }, {
              value: 'date-picker',
              label: 'DatePicker 日期选择器'
            }, {
              value: 'datetime-picker',
              label: 'DateTimePicker 日期时间选择器'
            }, {
              value: 'upload',
              label: 'Upload 上传'
            }, {
              value: 'rate',
              label: 'Rate 评分'
            }, {
              value: 'form',
              label: 'Form 表单'
            }]
          }, {
            value: 'data',
            label: 'Data',
            children: [{
              value: 'table',
              label: 'Table 表格'
            }, {
              value: 'tag',
              label: 'Tag 标签'
            }, {
              value: 'progress',
              label: 'Progress 进度条'
            }, {
              value: 'tree',
              label: 'Tree 树形控件'
            }, {
              value: 'pagination',
              label: 'Pagination 分页'
            }, {
              value: 'badge',
              label: 'Badge 标记'
            }]
          }, {
            value: 'notice',
            label: 'Notice',
            children: [{
              value: 'alert',
              label: 'Alert 警告'
            }, {
              value: 'loading',
              label: 'Loading 加载'
            }, {
              value: 'message',
              label: 'Message 消息提示'
            }, {
              value: 'message-box',
              label: 'MessageBox 弹框'
            }, {
              value: 'notification',
              label: 'Notification 通知'
            }]
          }, {
            value: 'navigation',
            label: 'Navigation',
            children: [{
              value: 'menu',
              label: 'NavMenu 导航菜单'
            }, {
              value: 'tabs',
              label: 'Tabs 标签页'
            }, {
              value: 'breadcrumb',
              label: 'Breadcrumb 面包屑'
            }, {
              value: 'dropdown',
              label: 'Dropdown 下拉菜单'
            }, {
              value: 'steps',
              label: 'Steps 步骤条'
            }]
          }, {
            value: 'others',
            label: 'Others',
            children: [{
              value: 'dialog',
              label: 'Dialog 对话框'
            }, {
              value: 'tooltip',
              label: 'Tooltip 文字提示'
            }, {
              value: 'popover',
              label: 'Popover 弹出框'
            }, {
              value: 'card',
              label: 'Card 卡片'
            }, {
              value: 'carousel',
              label: 'Carousel 走马灯'
            }, {
              value: 'collapse',
              label: 'Collapse 折叠面板'
            }]
          }]
        }, {
          value: '2018',
          label: '2018',
          children: [{
            value: 'axure',
            label: 'Axure Components'
          }, {
            value: 'sketch',
            label: 'Sketch Templates'
          }, {
            value: 'jiaohu',
            label: '组件交互文档'
          }]
        }],
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
