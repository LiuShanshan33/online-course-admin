<template>
  <el-scrollbar style="height:100%">
    <div class="container">
      <div class="top-container">
        <div class="content-title">课件上传</div>
        <hr>
      </div>
      <div class="content">
        <div class="scoll" :style="conheight">
          <el-form ref="cwForm" :model="cwForm" :rules="rules" label-width="80px" size="mini">
             <el-form-item label="课件名称">
              <el-input v-model="cwForm.cwname" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="课件类型">
              <el-select v-model="cwForm.cwtype" placeholder="请选择"  @change="TypeChange($event)">
                <el-option
                  v-for="item in TypeOptions"
                  :key="item.key"
                  :label="item.display_name"
                  :value="item.display_name"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="教学课程" prop="name">
              <el-select v-model="cwForm.courseid" placeholder="请选择" @change="CourseChange($event)">
                <el-option
                  v-for="item in courseOptions"
                  :key="item.id"
                  :label="item.coursename + '(' + item.subject + ')'"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="上传课件">
              <input type="file" multiple="multiple" ref="fileInt" value="changeHandle" id="changeHandle" :accept="courseType" @change="fileChange">
              <p class="comment"><pre>{{ fileNameAll }}</pre></p>
            </el-form-item>
            <el-form-item label="课件描述">
              <el-input v-model="cwForm.cwintroduction" type="textarea" placeholder="请输入" /> 
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="changeHandle">确认上传</el-button>
              <!-- <el-button @click="resetForm('cwForm')">取消</el-button> -->
            </el-form-item>
          </el-form></div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>

import { uploadCourseware, getCourse } from '@/api/user'

// 类型
const TypeOptions = [
  { key: '1', display_name: '视频' },
  { key: '2', display_name: 'PPT' },
  { key: '3', display_name: '文档' },
  { key: '4', display_name: '图片' }
]
const TypeKeyValue = TypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})


export default {
  name: 'HospitalInfo',
  data() {
    return {
      radio: 0,
      MajorRadio: 0,
      fileList: [],
      Campus: ['湛江校区', '东莞校区'],
      TypeOptions,
      courseOptions:'',
      mode:{},
      fileNameAll:"",
      cwForm: {
        type: '视频'
      },
      courseType:"",
      listQuery: {
        pageIndex: 1,
        pageSize: 10
      },
      conheight: {
        height: ''
      },
      fileList:[],
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
    this.getCourseList()
  },
  methods: {
    tableHeight() {
      this.conheight.height = window.innerHeight - 140 + 'px'
    },
    // 获取课程
    getCourseList() {
      this.listLoading = true
      let data = {
        page: this.listQuery.pageIndex,
        pagesize: this.listQuery.pageSize
      }
      if(this.listQuery.Type){
          data.type = this.listQuery.Type
        }
        if(this.listQuery.coursename){
          data.coursename = this.listQuery.coursename
        }
      console.log('调用接口前的data',data)
      getCourse(data).then(response => {
        this.courseOptions = response.data.content
        console.log('this.courseOptions', this.courseOptions)
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 100)
      })
    },
      fileChange(){
        this.fileNameAll = ''
         for(var i = 0; i < this.$refs.fileInt.files.length; i++){
          this.fileNameAll += this.$refs.fileInt.files[i].name + "\n"
        }      
        console.log('fileNameAll',this.fileNameAll)
      },
      // 课程选择改变
      CourseChange(event) {
        console.log('选择后返回courseid', event)
      },
      // 课件类型改变
      TypeChange(event) {
        console.log('选择后返回type', event)
        if( event === "视频"){
          this.courseType = ".avi,.mp4,.mov.flv.mkv,.rmvb,.wmv"
          console.log('视频courseType', this.courseType)
        }
        else if(event === "PPT"){
          this.courseType = ".ppt,.pptx"
          console.log('PPTcourseType', this.courseType)
        }
        else if(event === "文档"){
          this.courseType = ".doc,.docx,.pdf,.xls,xlsx,.txt,.htm,.html"
          console.log('文档courseType', this.courseType)
        }
        else{
          this.courseType = ".png,.jpg,.jpeg"
          console.log('文档courseType', this.courseType)
        }
      },
      // 确认上传
      changeHandle() {
        const file = this.$refs.fileInt.files[0]
        let count = this.$refs.fileInt.files.length
        console.log('count',count)
        // 将文件循环添加到fileList[]
        for (let i = 0; i < this.$refs.fileInt.files.length; i++) {
          this.fileList.push(this.$refs.fileInt.files[i])
        }
        console.log('fileList',this.fileList)
        // 循环append添加
        const data = new FormData()
        this.fileList.forEach(function (file) {
          data.append('file',file)
        })
        console.log(data.getAll('file'))
        // data.append('file', file)
        data.append('cwname', this.cwForm.cwname)
        data.append('cwtype', this.cwForm.cwtype)
        data.append('cwintroduction', this.cwForm.cwintroduction)
        data.append('courseid', this.cwForm.courseid)
        // let form = {
        //   cwname: this.cwForm.cwname, 
        //   cwtype: this.cwForm.cwtype,
        //   cwintroduction: this.cwForm.cwintroduction,
        //   courseid: this.cwForm.courseid
        // }
        console.log('上传前的data',data)
        uploadCourseware(data).then(res => {
          console.log(res)
          this.$message({
            type: 'success',
            message: '上传成功'
          })
        }).catch(err => {
          console.log(err);
        })
      },

    // 上传列表
    modeUpload: function(item) {
        console.log('item.file',item.file)
        this.mode = item.file
        console.log('this.mode',this.mode)
    },
    // 点击确认上传
    // submitUpload() {
    //   let file = this.mode
    //   let Courseware = new FormData()
    //   Courseware.append('files', file)
    //   console.log('上传的东西', Courseware.get('files'))
    //   uploadCourseware(Courseware).then(response => {
    //     console.log(response.data);
    //   })
    // },
    radioChange($event) {
      console.log('选中状态改变时radio的值', this.radio)
    },
    // saveHosInfo(formName) {
    //   this.$refs[formName].validate((valid) => {
    //     if (valid) {
    //       saveHospital(this.cwForm).then(response => {
    //         this.cwForm = response.data
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
.comment{
    white-space:pre-wrap;
} 
</style>
