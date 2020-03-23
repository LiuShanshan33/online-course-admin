<template>
  <div class="container">
    <div class="top-container">
      <div class="content-title">添加版本</div>
      <hr>
    </div>
    <div class="bottom-container">
      <div class="scoll" :style="conheight">
        <el-scrollbar style="height:100%">
          <el-form
            ref="VersionForm"
            :label-position="labelPosition"
            :model="VersionForm"
            label-width="80px"
            class="top-form"
          >
            <el-form-item label="文件编码:">
              <el-select v-model="VersionForm.code" placeholder="请选择...">
                <!-- <el-option value="whiteboardapk">白板APK</el-option> -->
                <el-option v-for="code in CodeOptions" :key="code" :value="code" />
              </el-select>
            </el-form-item>
            <el-form-item label="文件版本:">
              <el-input v-model="VersionForm.realVersion " placeholder="请输入" />
            </el-form-item>
            <el-form-item label="文件:">
              <!-- <el-input class="valid" name="file" type="file" /> -->
              <el-upload
                class="upload-demo"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                multiple
                :limit="3"
                :on-exceed="handleExceed"
                :file-list="fileList"
              >
                <el-button size="mini" class="add-botton">点击上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="文件名:">
              <el-input v-model="VersionForm.fileName" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="是否更新:">
              <el-select v-model="VersionForm.newest" placeholder="请选择...">
                <el-option v-for="newest in NewestOptions" :key="newest" :value="newest" />
              </el-select>
            </el-form-item>
            <el-form-item label="文件描述:">
              <el-input v-model="VersionForm.note" type="textarea" placeholder="请输入" />
            </el-form-item>

            <el-form-item class="bottom-btn">
              <el-button class="add-botton" @click="save('VersionForm')">保存</el-button>
              <el-button @click="closeForm(tag)">关闭</el-button>
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import { saveVersion } from '@/api/addOrSave' // 保存修改接口

export default {
  name: 'AddVersionMg',
  data() {
    return {
      VersionForm: {
        id: '',
        code: '',
        file: '',
        realVersion: '',
        fileName: '',
        newest: '',
        note: ''
      },
      fileList: [{
        name: '',
        url: ''
      }],
      NewestOptions: ['是', '否'],
      CodeOptions: ['白板APK'],
      conheight: {
        height: ''
      }

    }
  },
  created() {
    this.VersionForm.newest = this.NewestOptions[0]
    this.VersionForm.code = this.CodeOptions[0]
    this.tableHeight()
  },
  methods: {
    tableHeight() {
      this.conheight.height = window.innerHeight - 190 + 'px'
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 保存
    save() {
      saveVersion(this.VersionForm).then(response => {
        this.VersionForm = response.data
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
/deep/ .el-scrollbar {
  /deep/ .scrollbar-wrapper {
    height: 100%;
  }
}
.bottom-container {
  padding: 12px 0 0 62px;
  .el-input,
  .el-textarea {
    width: 52%;
  }
  /deep/ .el-input__inner {
    line-height: 12px !important;
  }
}
</style>
