// 修改流程节点
<template>
  <div class="container">
    <div class="top-container">
      <div class="content-title">修改节点</div>
      <hr>
    </div>
    <div class="bottom-container">
      <div class="scoll" :style="conheight">
        <el-scrollbar style="height:100%">
          <el-form
            ref="DiagnoseForm"
            :label-position="labelPosition"
            :model="DiagnoseForm"
            :rules="rules"
            label-width="130px"
            class="top-form"
          >
            <el-form-item label="节点编码:" prop="nodeCode">
              <el-input v-model="DiagnoseForm.nodeCode" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="节点名称:" prop="nodeName">
              <el-input v-model="DiagnoseForm.nodeName" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="待处理节点名称:" prop="pendingNodeName">
              <el-input v-model="DiagnoseForm.pendingNodeName" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="已处理节点名称:" prop="handledNodeName">
              <el-input v-model="DiagnoseForm.handledNodeName" placeholder="请输入" />
            </el-form-item>
            <el-form-item>
              <el-button class="add-botton" @click="save('DiagnoseForm')">保存</el-button>
              <el-button @click="closeForm('tag')">关闭</el-button>
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import { saveProcessNode } from '@/api/addOrSave' // 保存修改接口

const typeOptions = [
  { key: '1', display_name: '护理诊断' },
  { key: '2', display_name: '合作性问题' }
]
const TypeKeyValue = typeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
export default {
  // name: 'UpdateNode',
  data() {
    return {
      DiagnoseForm: {
        nodeCode: this.$route.query.nodeCode,
        nodeName: this.$route.query.nodeName,
        pendingNodeName: this.$route.query.pendingNodeName,
        handledNodeName: this.$route.query.handledNodeName
      },
      list: [],
      typeOptions,
      labelPosition: 'right',
      form: {
        code: '',
        name: ''
      },
      seen: false,
      listLoading: true,
      conheight: {
        height: ''
      },
      rules: {
        nodeName: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ],
        nodeCode: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ],
        pendingNodeName: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ],
        handledNodeName: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ]
      }

    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  // list组价的activated钩子
  activated() {
    // isUseCache为false时才重新刷新获取数据
    // 因为对list使用keep-alive来缓存组件，所以默认是会使用缓存数据的
    if (!this.$route.meta.isUseCache) {
      this.list = [] // 清空原有数据
      this.onLoad() // 这是我们获取数据的函数
    }
  },
  created() {
    this.tableHeight()
    // this.DiagnoseForm.type = this.typeOptions[0]
  },
  methods: {
    tableHeight() {
      this.conheight.height = window.innerHeight - 190 + 'px'
    },
    // 保存
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveProcessNode(this.DiagnoseForm).then(response => {
            console.log(JSON.stringify(this.DiagnoseForm))
            JSON.stringify(this.DiagnoseForm)
            this.DiagnoseForm = response.data
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
  padding: 12px 0 0 12px;
  .el-input {
    width: 52%;
  }
}
/deep/ .el-form-item{
  margin-bottom: 16px!important;
}
</style>
