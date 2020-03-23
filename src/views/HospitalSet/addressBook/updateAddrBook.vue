<template>
  <div class="container">
    <div class="top-container">
      <div class="content-title">修改通讯录</div>
      <hr>
    </div>
    <div class="content">
      <el-form
        ref="AddrBookForm"
        :model="AddrBookForm"
        :rules="rules"
        label-width="100px"
        size="mini"
      >
        <el-form-item label="科室">
          <el-select v-model="AddrBookForm.deptName" clearable filterable placeholder="请选择">
            <el-option v-for="o in DeptOptions" :key="o.code" :label="o.name" :value="o.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="empName">
          <el-input v-model="AddrBookForm.empName" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="AddrBookForm.phone" />
        </el-form-item>
        <el-form-item label="集团短号">
          <el-input v-model="AddrBookForm.groupPhone" />
        </el-form-item>
        <el-form-item label="内线电话">
          <el-input v-model="AddrBookForm.innerPhone" />
        </el-form-item>
        <el-form-item size="small">
          <el-button type="primary" @click="save('AddrBookForm')">保存</el-button>
          <el-button @click="closeForm(tag)">关闭</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { saveAddrBook } from '@/api/addOrSave'
import { getDictInfo } from '@/api/user'

export default {
  name: 'UpdateAddrBook',
  data() {
    return {
      AddrBookForm: {
        id: this.$route.query.id,
        deptName: this.$route.query.deptName,
        empName: this.$route.query.empName,
        phone: this.$route.query.phone,
        groupPhone: this.$route.query.groupPhone,
        innerPhone: this.$route.query.innerPhone
      },
      DeptOptions: [],
      rules: {
        phone: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ],
        empName: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.onLoad()
  },
  methods: {
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveAddrBook(this.AddrBookForm).then(response => {
            this.AddrBookForm = response.data

            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.closeForm()
          })
        } else {
          this.$message({
            type: 'error',
            message: '提交数据不完整，请改正后再提交!'
          })
          return false
        }
      })
    },
    onLoad() {
      this.getOptionsData()
    },
    getOptionsData() {
      getDictInfo().then(res => {
        this.DeptOptions = res.data.list
        console.log('treeList', this.DeptOptions)
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
.el-input {
  width: 50%;
}
.el-button {
  width: 75px;
  height: 30px;
}
</style>
