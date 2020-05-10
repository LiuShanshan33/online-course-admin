<template>
  <el-scrollbar style="height:100%">
    <div class="container">
      <div class="top-container">
        <div class="content-title">课件上传</div>
        <hr>
      </div>
      <div class="content">
        <div class="scoll" :style="conheight">
          <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" size="mini">
            <el-form-item label="课件类型">
              <el-select v-model="TypeOptions" placeholder="请选择">
                <el-option
                  v-for="item in TypeOptions"
                  :key="item.key"
                  :label="item.display_name"
                  :value="item.display_name"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="教学科目" prop="name">
              <el-select v-model="TypeOptions" placeholder="请选择">
                <el-option
                  v-for="item in TypeOptions"
                  :key="item.key"
                  :label="item.display_name"
                  :value="item.display_name"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="课程类型" prop="name">
              <el-radio-group v-model="radio">
                <el-radio :label="0">选修课</el-radio>
                <el-radio :label="1">必修课</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="面向专业" prop="name">
              <el-radio-group v-model="MajorRadio" @change="radioChange">
                <el-radio :label="0">全体学生</el-radio>
                <el-radio :label="1">部分学生</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="MajorRadio" label="院系专业">
              <el-cascader
                :options="options"
                :props="cascaderProp"
                size="medium"
                class="cascader"
                clearable
              />
            </el-form-item>
            <el-form-item label="上传课件">
              <el-upload
                class="upload-demo"
                action="http://47.98.251.65:80/api/upload/"
                ref="upload"
                :file-list="fileList"
                :http-request="modeUpload"
                multiple
                :limit="3"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">请选择需要上传的课件，一次不超过3个</div>
              </el-upload>
            </el-form-item>
            <el-form-item label="课件描述">
              <el-input v-model="ruleForm.intro" type="textarea" placeholder="请输入" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitUpload">确认上传</el-button>
              <!-- <el-button @click="resetForm('ruleForm')">取消</el-button> -->
            </el-form-item>
          </el-form></div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>

import { uploadCourseware } from '@/api/user'

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
  name: 'HospitalInfo',
  data() {
    return {
      radio: 0,
      MajorRadio: 0,
      fileList: [],
      Campus: ['湛江校区', '东莞校区'],
      TypeOptions:['PPT', 'Word', '视频'],
      mode:{},
      ruleForm: {
        type: '视频'
      },
      conheight: {
        height: ''
      },
      rules: {
        name: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ],
        bedNum: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ],
        zipCode: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ]
      },
      options: [{
          value: 'zhinan',
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
          value: 'zujian',
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
          value: 'ziyuan',
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
        checkStrictly: true
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
    // submitUpload() {
    //     this.$refs.upload.submit()
    //     this.$message({
    //       type: 'success',
    //       message: '上传成功'
    //     })
    // },
    // handleRemove(file, fileList) {
    //   console.log(file, fileList)
    // },
    // handleExceed(files, fileList) {
    //   this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    // },
    // beforeRemove(file, fileList) {
    //   return this.$confirm(`确定移除 ${file.name}？`)
    // },
    // 上传列表
    modeUpload: function(item) {
        console.log('item.file',item.file)
        this.mode = item.file
        console.log('this.mode',this.mode)
    },
    // 点击确认上传
    submitUpload() {
      let Courseware = new FormData()
      Courseware.append('files', this.mode)
      console.log('上传的东西', Courseware.get('files'))
      uploadCourseware(Courseware).then(response => {
        console.log(response.data);
      })
    },
    radioChange($event) {
      console.log('选中状态改变时radio的值', this.radio)
    },
    // saveHosInfo(formName) {
    //   this.$refs[formName].validate((valid) => {
    //     if (valid) {
    //       saveHospital(this.ruleForm).then(response => {
    //         this.ruleForm = response.data
    //         this.$message({
    //           type: 'success',
    //           message: '保存成功'
    //         })
    //       })
    //     } else {
    //       this.$message({
    //         type: 'error',
    //         message: '提交数据不完整，请改正后再提交！'
    //       })
    //       return false
    //     }
    //   })
    // }
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
