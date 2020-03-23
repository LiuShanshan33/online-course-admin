// 修改流程角色
<template>
  <el-scrollbar :style="conheight">
    <div class="container">
      <div class="top-container">
        <div class="content-title">添加流程链</div>
        <hr />
      </div>
      <div class="bottom-container">
        <div class="scoll">
          <el-form
            ref="ChainForm"
            :label-position="labelPosition"
            :model="ChainForm"
            :rules="rules"
            label-width="120px"
            class="top-form"
          >
            <el-form-item label="流程链编码:" prop="code">
              <el-input v-model="ChainForm.chainCode" :nodeLists="parentToChild" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="流程链名称:" prop="name">
              <el-input v-model="ChainForm.chainName" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="流程链节点:" prop="nodeIndexNo">
              <nodeForm
                v-for="item in ChainForm.nodeList"
                :data="item"
                :key="item.nodeCode"
                @handleOn="handleOn"
                @handleChildClass="handleChildClass"
              ></nodeForm>
            </el-form-item>
            <el-form-item class="bottom-btn">
              <el-button style="width:75px;" @click="addNewItem">
                <i class="el-icon-plus">新增节点</i>
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button class="add-botton" @click="save('ChainForm')">保存</el-button>
              <el-button @click="closeForm(tag)">关闭</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
import { checkChainList, updateChainList } from '@/api/addOrSave' // 保存修改接口
import nodeForm from './nodeForm'
export default {
  name: 'ChainForm',
  components: { nodeForm },
  data() {
    return {
      ChainForm: {//流程链表单
        chainCode: this.$route.query.chainCode,
        chainName: this.$route.query.chainName,
        nodeList: []
      },
      parentToChild: this.$route.query.chainCode,
      nodeLength: '',
      labelPosition: 'right',
      form: {
        code: '',
        name: ''
      },
      conheight: {
        height: ''
      },
      rules: {
        chainCode: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ],
        chainName: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ]
      },
      data: JSON.parse(window.localStorage.getItem('data')) || {},

    }
  },
  created() {
    this.tableHeight()
    this.getList()
  },
  methods: {
    tableHeight() {
      this.conheight.height = window.innerHeight - 100 + 'px'
    },
    //传递事件给子组件
    handleOn(data) {
      this.data[data.key] = data.val
      window.localStorage.setItem("data", JSON.stringify(this.data))
    },
    // 子组件传递给父组件
    handleChildClass() {
      this[data.key] = data.val
    },
    // 获取流程链表单信息
    getList() {
      checkChainList(this.ChainForm.chainCode).then(res => {
        this.ChainForm = res.data
        this.ChainForm.nodeList = res.data.nodeList
      })
    },
    // 新增节点
    addNewItem() {
      this.ChainForm.nodeList
      this.ChainForm.nodeList.push({
        nodeCode: '',
        nodeIndexNo: this.ChainForm.nodeList.length + 1,
        roleList: []
      })
    },
    // 保存
    save(formName) {
      this.$refs[formName].validate((valid) => {
        console.log('test', this.$refs[formName])
        if (valid) {
          updateChainList(this.ChainForm).then(response => {
            this.ChainForm = response.data
            console.log('response.data', response.data)
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            console.log('this.ChainForm', this.ChainForm)
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
</style>
