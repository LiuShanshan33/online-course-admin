<template>
  <div class="container">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <div class="top-container">
        <div class="content-title">修改版本</div>
        <hr>
      </div>
      <div class="bottom-container">
        <div class="scoll" :style="conheight">
          <el-scrollbar style="height:100%">
            <el-form
              ref="VersionForm"
              :label-position="labelPosition"
              :model="VersionForm"
              :rules="rules"
              label-width="90px"
              class="top-form"
              enctype="multipart/form-data"
            >
              <el-form-item label="文件编码:">
                <el-select v-model="VersionForm.code" placeholder="请选择...">
                  <el-option
                    v-for="code in CodeOptions"
                    :key="code"
                    :label="code.display_name"
                    :value="code.key"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="文件版本:" prop="realVersion">
                <el-input v-model="VersionForm.realVersion " placeholder="请输入" />
              </el-form-item>
              <el-form-item label="文件:">
                <el-input class="valid" name="file" type="file" />
              </el-form-item>
              <el-form-item label="文件名:">
                <el-input v-model="VersionForm.fileName" placeholder="请输入" />
              </el-form-item>
              <el-form-item label="是否最新:">
                <el-select v-model="VersionForm.newest" placeholder="请选择...">
                  <el-option
                    v-for="newest in NewestOptions"
                    :key="newest.key"
                    :label="newest.display_name"
                    :value="newest.key"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="文件描述:">
                <el-input
                  v-model="VersionForm.note"
                  type="textarea"
                  placeholder="请输入"
                  :width="600"
                />
              </el-form-item>

              <el-form-item class="bottom-btn">
                <el-button class="add-botton" @click="save('VersionForm')">保存</el-button>
                <el-button @click="closeForm(tag)">关闭</el-button>
              </el-form-item>
            </el-form>
          </el-scrollbar>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { saveVersion } from '@/api/addOrSave' // 保存修改接口

const NewestOptions = [
  { key: true, display_name: '是' },
  { key: false, display_name: '否' }
]
const CodeOptions = [
  { key: 'whiteboardapk', display_name: '白板APK' }
]

const NewestKeyValue = NewestOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const CodeKeyValue = CodeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'UpdateVersionMg',
  filters: {
    NewestFilter(newest) {
      return NewestKeyValue[newest]
    },
    CodeFilter(code) {
      return CodeKeyValue[code]
    }
  },
  data() {
    return {
      VersionForm: {
        id: this.$route.query.id,
        code: this.$route.query.code,
        file: this.$route.query.file,
        realVersion: this.$route.query.realVersion,
        fileName: this.$route.query.fileName,
        newest: this.$route.query.newest,
        note: this.$route.query.note
      },
      labelPosition: 'right',
      NewestOptions,
      CodeOptions,
      conheight: {
        height: ''
      },
      rules: {
        realVersion: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ]
      }

    }
  },
  created() {
    this.tableHeight()
  },
  methods: {
    tableHeight() {
      this.conheight.height = window.innerHeight - 190 + 'px'
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
  // margin-right: 30px;
  .el-input {
    width: 52%;
  }
  /deep/ .el-input__inner {
    line-height: 12px !important;
    padding-top: 3px !important;
  }
}
</style>
