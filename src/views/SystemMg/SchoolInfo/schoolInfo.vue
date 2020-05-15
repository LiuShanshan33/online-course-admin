<template>
<el-scrollbar style="height:100%">
  <div class="container">
    <div class="top-container">
      <div class="content-title">学校信息</div>
      <hr>
    </div>
    <div class="content">
      <div class="scoll" :style="conheight">
          <el-form ref="schoolForm" :model="schoolForm" :rules="rules" label-width="100px" size="mini">
            <el-form-item label="院校代码">
              <el-input v-model="schoolForm.cid" />
            </el-form-item>
            <el-form-item label="学校名称" prop="name">
              <el-input v-model="schoolForm.cname" />
            </el-form-item>
            <el-form-item label="学校级别">
              <el-select v-model="schoolForm.clevel" placeholder="请输入">
                <el-option v-for="grades in gradeItems" :key="grades" :value="grades" />
              </el-select>
            </el-form-item>
             <el-form-item label="所在校区">
              <el-select v-model="schoolForm.ccampus" placeholder="请选择" @change="campusChange">
                <el-option v-for="items in CampusItems" :key="items.key" :value="items.display_name" />
              </el-select>
            </el-form-item>
            <el-form-item label="电话">
              <el-input v-model="schoolForm.cphone" />
            </el-form-item>
            <el-form-item label="地址" prop="address">
              <el-input v-model="schoolForm.caddress" />
            </el-form-item>
            <el-form-item label="邮政编码" prop="zipCode">
              <el-input v-model="schoolForm.ccode" />
            </el-form-item>
            <el-form-item label="简介">
              <el-input v-model="schoolForm.ccontent" type="textarea" placeholder="请输入" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveHosInfo('schoolForm')">保存</el-button>
              <!-- <el-button @click="resetForm('schoolForm')">取消</el-button> -->
            </el-form-item>
          </el-form></div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
import { getSchoolInfo } from '@/api/user'
import { saveHospital } from '@/api/addOrSave'

const CampusItems = [
  { key: '1', display_name: '湛江校区' },
  { key: '2', display_name: '东莞校区' }
]


const CampusKeyValue = CampusItems.reduce((abc, curr) => {
  abc[curr.key] = curr.display_name
  return abc
}, {})

export default {
  name: 'SchoolInfo',
  data() {
    return {
      typeItems: ['湛江校区', '东莞校区','海东校区'],
      gradeItems: ['一本','二本','三本','专科院校'],
      CampusItems,
      schoolForm: {
        cid:'',
        cname:'',
        clevel:'',
        ccampus: "湛江校区",
        cphone:'',
        caddress:'',
        ccode:'',
        ccontent:''
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
      }
    }
  },
  created() {
    this.getSchInfo()
    this.tableHeight()
    // this.schoolForm.ccampus = this.CampusItems[0].display_name
    // this.saveHosInfo()
  },
  methods: {
    tableHeight() {
      this.conheight.height = window.innerHeight - 140 + 'px'
    },
    getSchInfo() {
      this.listLoading = false
      let data = {
        ccampus: this.schoolForm.ccampus
      }
      console.log(this.schoolForm.ccampus)
      getSchoolInfo(data).then(response => {
        this.schoolForm = response.data[0]
        console.log('getSchoolInfo', response)
      })
    },
    campusChange(){
      console.log('校区更改',this.schoolForm.ccampus)
      this.getSchInfo()
    },
    saveHosInfo(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveHospital(this.schoolForm).then(response => {
            this.schoolForm = response.data
            this.$message({
              type: 'success',
              message: '保存成功'
            })
          })
        } else {
          this.$message({
            type: 'error',
            message: '提交数据不完整，请改正后再提交！'
          })
          return false
        }
      })
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
.el-button {
  width: 75px;
  height: 30px;
  &:nth-last-of-type(1) {
    background: linear-gradient(
      180deg,
      rgba(31, 147, 151, 1) 0%,
      rgba(85, 176, 171, 1) 100%
    );
    border-radius: 2px;
  }
}
</style>
