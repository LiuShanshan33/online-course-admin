<template>
  <div class="container">
    <div class="top-container">
      <div class="content-title">修改床位</div>
      <hr>
    </div>
    <div class="content">
      <el-form ref="BedForm" :model="BedForm" :rules="rules" label-width="100px" size="mini">
        <el-form-item label="护理单元">
          <el-select v-model="BedForm.deptCode" clearable filterable placeholder="请选择">
            <el-option v-for="o in DeptOptions" :key="o.code" :label="o.name" :value="o.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="房间号">
          <el-input v-model="BedForm.roomNo" />
        </el-form-item>
        <el-form-item label="床标号" prop="bedLabel">
          <el-input v-model="BedForm.bedLabel" />
        </el-form-item>
        <el-form-item label="床位等级">
          <el-select v-model="BedForm.bedLevel" placeholder="请选择">
            <el-option v-for="o in GradeOptions" :key="o" :value="o" />
          </el-select>
        </el-form-item>
        <el-form-item label="床位编制">
          <el-select v-model="BedForm.bedApproved" placeholder="请输入">
            <el-option v-for="o in ApprovedOptions" :key="o" :value="o" />
          </el-select>
        </el-form-item>
        <el-form-item label="床位性别">
          <el-select v-model="BedForm.bedSex" placeholder="请输入">
            <el-option v-for="s in SexOptions" :key="s" :value="s" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序号">
          <el-input v-model="BedForm.sort" />
        </el-form-item>
        <el-form-item size="small">
          <el-button class="add-botton" @click="saveBed('BedForm')">保存</el-button>
          <el-button @click="closeForm(tag)">关闭</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { saveBedInfo } from '@/api/addOrSave'
import { getDictInfo } from '@/api/user'

export default {
  name: 'UpdateBed',
  data() {
    return {
      BedForm: {
        id: this.$route.query.id,
        deptCode: this.$route.query.deptCode,
        roomNo: this.$route.query.roomNo,
        bedLabel: this.$route.query.bedLabel,
        bedLevel: this.$route.query.bedLevel,
        bedApproved: this.$route.query.bedApproved,
        bedSex: this.$route.query.bedSex,
        sort: this.$route.query.sort
      },
      DeptOptions: [],
      GradeOptions: ['A级单人房', 'B级三人房', '层流房'],
      SexOptions: ['请选择', '其他', '男', '女'],
      ApprovedOptions: ['在编', '非编', '加床', '挂床', '虚床'],
      rules: {
        bedLabel: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.onLoad()
  },
  methods: {
    onLoad() {
      this.getOptionsData()
    },
    getOptionsData() {
      getDictInfo().then(res => {
        this.DeptOptions = res.data.list
        console.log('treeList', this.DeptOptions)
      })
    },
    saveBed(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveBedInfo(this.BedForm).then(response => {
            this.BedForm = response.data

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
