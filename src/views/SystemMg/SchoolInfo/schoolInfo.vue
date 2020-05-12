<template>
<el-scrollbar style="height:100%">
  <div class="container">
    <div class="top-container">
      <div class="content-title">学校信息</div>
      <hr>
    </div>
    <div class="content">
      <div class="scoll" :style="conheight">
          <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" size="mini">
            <el-form-item label="院校代码">
              <el-input v-model="ruleForm.code" />
            </el-form-item>
            <el-form-item label="学校名称" prop="name">
              <el-input v-model="ruleForm.name" />
            </el-form-item>
            <el-form-item label="学校级别">
              <el-select v-model="ruleForm.grade" placeholder="请输入">
                <el-option v-for="grades in gradeItems" :key="grades" :value="grades" />
              </el-select>
            </el-form-item>
             <el-form-item label="所在校区">
              <el-select v-model="ruleForm.type" placeholder="请选择">
                <el-option v-for="types in typeItems" :key="types" :value="types" />
              </el-select>
            </el-form-item>
            <el-form-item label="电话">
              <el-input v-model="ruleForm.telephone" />
            </el-form-item>
            <el-form-item label="地址" prop="address">
              <el-input v-model="ruleForm.address" />
            </el-form-item>
            <el-form-item label="邮政编码" prop="zipCode">
              <el-input v-model="ruleForm.zipCode" />
            </el-form-item>
            <el-form-item label="描述">
              <el-input v-model="ruleForm.intro" type="textarea" placeholder="请输入" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveHosInfo('ruleForm')">保存</el-button>
              <!-- <el-button @click="resetForm('ruleForm')">取消</el-button> -->
            </el-form-item>
          </el-form></div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
import { getHospital } from '@/api/user'
import { saveHospital } from '@/api/addOrSave'

export default {
  name: 'HospitalInfo',
  data() {
    return {
      typeItems: ['湛江校区', '东莞校区','海东校区'],
      gradeItems: ['一本','二本','三本','专科院校'],
      ruleForm: {},
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
    this.getHosInfo()
    this.tableHeight()
    // this.saveHosInfo()
  },
  methods: {
    tableHeight() {
      this.conheight.height = window.innerHeight - 140 + 'px'
    },
    getHosInfo() {
      this.listLoading = false
      getHospital().then(response => {
        this.ruleForm = response.data
        console.log('HospitalInfo', this.ruleForm)
      })
    },
    saveHosInfo(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveHospital(this.ruleForm).then(response => {
            this.ruleForm = response.data
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
