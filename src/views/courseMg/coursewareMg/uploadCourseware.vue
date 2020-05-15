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
             <el-form-item label="课件名称" prop="cwname">
              <el-input v-model="cwForm.cwname" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="课件类型" prop="cwtype">
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
        cwname:[
          { required: true, message: '必填字段', trigger: 'blur' }
        ],
        cwtype:[
          { required: true, message: '请选择课件类型', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请选择教学课程', trigger: 'blur' }
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
