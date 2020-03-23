// 添加流程角色
<template>
  <el-scrollbar :style="conheight">
    <div class="container">
      <div class="top-container">
        <div class="content-title">查看流程链</div>
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
              {{ChainForm.chainCode}}
              <!-- <el-input v-model="ChainForm.chainCode" :nodeLists="parentToChild" placeholder="请输入" /> -->
            </el-form-item>
            <el-form-item label="流程链名称:" prop="name">
              {{ChainForm.chainName}}
              <!-- <el-input v-model="ChainForm.chainName" placeholder="请输入" /> -->
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
            <el-form-item>
              <el-button class="add-botton" @click="save()">修改</el-button>
              <el-button @click="closeForm(tag)">关闭</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
import { saveDiagnose, getAllNode, checkChainList } from '@/api/addOrSave' // 保存修改接口
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
        name: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ],
        code: [
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
    // 保存
    save() {
     this.$router.push({
        path: '../QualCtrl/alterProcessChain',
        name: 'AlterProcessChain',
        query: {
          chainName: this.ChainForm.chainName,
          chainCode: this.ChainForm.chainCode
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
