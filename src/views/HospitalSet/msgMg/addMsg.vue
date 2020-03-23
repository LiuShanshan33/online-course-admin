<template>
  <div class="container">
    <div class="top-container">
      <div class="content-title">添加消息</div>
      <hr>
    </div>
    <div class="content">
      <el-form ref="MsgForm" :model="MsgForm" :rules="rules" label-width="100px" size="mini">
        <el-form-item label="护理单元">
          <el-select v-model="MsgForm.deptCode" placeholder="请选择">
            <el-option v-for="o in deptOptions" :key="o.code" :value="o.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="房间号">
          <el-input v-model="MsgForm.roomNo" />
        </el-form-item>
        <el-form-item label="床标号" prop="label">
          <el-input v-model="MsgForm.bedLabel" />
        </el-form-item>
        <el-form-item label="床位等级">
          <el-select v-model="MsgForm.bedLevel" placeholder="请选择">
            <el-option v-for="o in gradeOptions" :key="o" :value="o" />
          </el-select>
        </el-form-item>
        <el-form-item label="床位编制">
          <el-select v-model="MsgForm.bedApproved" placeholder="请选择">
            <el-option v-for="o in approvedOptions" :key="o" :value="o" />
          </el-select>
        </el-form-item>
        <el-form-item label="床位性别">
          <el-select v-model="MsgForm.bedSex" placeholder="请选择">
            <el-option v-for="s in sexOptions" :key="s" :value="s" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序号">
          <el-input v-model="MsgForm.sort" />
        </el-form-item>
        <el-form-item size="small">
          <el-button type="primary" @click="save('MsgForm')">保存</el-button>
          <el-button @click="closeForm(tag)">关闭</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getMsgMail } from '@/api/addOrSave'

export default {
  data() {
    return {
      MsgForm: {
        deptCode: '',
        roomNo: '',
        bedLabel: '',
        bedLevel: '',
        bedApproved: '',
        bedSex: ''
      },
      deptOptions: [],
      gradeOptions: ['A级单人房', 'B级三人房', '层流房'],
      sexOptions: ['请选择', '其他', '男', '女'],
      approvedOptions: ['在编', '非编', '加床', '挂床', '虚床'],
      rules: {
        label: [
          { required: true, message: '必填字段', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    save() {
      getMsgMail(this.MsgForm).then(response => {
        this.MsgForm = response.data

        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.closeForm()
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
