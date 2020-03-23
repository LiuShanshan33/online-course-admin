<template>
  <div class="container">
    <div class="top-container">
      <div class="content-title">添加应用授权</div>
      <hr>
    </div>
    <div class="bottom-container">
      <div class="scoll" :style="conheight">
        <el-scrollbar style="height:100%">
          <el-form
            ref="AppAuthorizationForm"
            :model="AppAuthorizationForm"
            :rules="rules"
            label-width="80px"
            class="top-form"
          >
            <el-form-item label="渠道:" prop="channel">
              <el-input v-model="AppAuthorizationForm.channel" placeholder="请输入" />
            </el-form-item>
            <el-form-item class="bottom-btn">
              <el-button class="add-botton" @click="save('AppAuthorizationForm')">保存</el-button>
              <el-button @click="closeForm(tag)">关闭</el-button>
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import { saveAppAuthorization } from '@/api/addOrSave' // 保存修改接口

export default {
  name: 'AddAppAuthorization',
  data() {
    return {
      AppAuthorizationForm: {
        id: '',
        channel: '',
        appKey: '',
        appSecret: '',
        authApis: ''
      },
      conheight: {
        height: ''
      },
      tag: '',
      rules: {
        channel: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ]
      }
    }
  },
  // 保存
  methods: {
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveAppAuthorization(this.AppAuthorizationForm).then(response => {
            this.AppAuthorizationForm = response.data
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
/deep/ .el-scrollbar {
  /deep/ .scrollbar-wrapper {
    height: 100%;
  }
}
.bottom-container {
  padding: 12px 0 0 62px;
  .el-input {
    width: 52%;
  }
}
</style>
