<template>
  <div class="container">
    <div class="top-container">
      <div class="content-title">添加模块</div>
      <hr />
    </div>
    <div class="bottom-container">
      <div class="scoll" :style="conheight">
        <el-scrollbar style="height:100%">
          <el-form ref="ModuleMgForm" :model="ModuleMgForm" label-width="100px" class="top-form">
            <el-form-item label="父模块:">
              <el-input v-model="ModuleMgForm.parentId" />
              <el-button type="text" class="inputBtn" @click="getDeptPage=true">选择</el-button>
              <el-dialog title="选择" :visible.sync="getDeptPage" top="13vh">
                <el-scrollbar class="scrollbar-wrapper" style="height:400px;">
                  <div class="dialog-container">
                    <el-tree
                      ref="tree"
                      :data="treeData"
                      :props="defaultProps"
                      default-expand-all
                      node-key="code"
                      highlight-current
                      @node-click="getNode"
                    >
                      <template slot-scope="{node,data}">{{ data.name }}</template>
                    </el-tree>
                  </div>
                </el-scrollbar>
              </el-dialog>
            </el-form-item>
            <el-form-item label="名称:">
              <el-input v-model="ModuleMgForm.name" />
              <br />
              <el-checkbox v-model="ModuleMgForm.menu">菜单</el-checkbox>
            </el-form-item>
            <el-form-item label="附加图标:">
              <el-input v-model="ModuleMgForm.attached" />
              <el-button type="text" class="inputBtn">选择图标</el-button>
            </el-form-item>
            <el-form-item label="页面地址:">
              <el-input v-model="ModuleMgForm.url" />
            </el-form-item>
            <el-form-item label="授权访问地址:">
              <el-input v-model="ModuleMgForm.authUrl" type="textarea" />
            </el-form-item>
            <el-form-item label="排序:">
              <el-input v-model="ModuleMgForm.sort" />
            </el-form-item>
            <el-form-item class="bottom-btn">
              <el-button class="add-botton" @click="save('ModuleMgForm')">保存</el-button>
              <el-button @click="closeForm(tag)">关闭</el-button>
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import { saveMoudle, ModuleSelect } from '@/api/addOrSave' // 保存修改接口

export default {
  data() {
    return {
      getDeptPage: false,
      ModuleMgForm: {
        id: '',
        name: '',
        url: '',
        authUrl: '',
        attached: '',
        parentId: '',
        menu: '',
        sort: ''
      },
      parentId: '',
      treeData: [],
      defaultProps: {
        children: 'moudleList',
        label: 'name'
      },
      conheight: {
        height: ''
      }

    }
  },
  created() {
    this.tableHeight()
    this.getModule()
  },
  methods: {
    tableHeight() {
      this.conheight.height = window.innerHeight - 190 + 'px'
    },
    // 获取父模块数据
    getModule() {
      ModuleSelect().then(response => {
        this.treeData = response.data
      })
    },
    // 节点被点击时的回调
    getNode(data, node, obj) {
      this.getDeptPage = false // 点击节点即退出对话框
      const mName = data // 定义变量存入点击该节点的对象
      this.ModuleMgForm.parentId = mName.name // 输入框的值等于点击节点的值
    },
    // 保存
    save() {
      saveMoudle(this.ModuleMgForm).then(response => {
        this.ModuleMgForm = response.data
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
  .inputBtn {
    position: relative;
    right: 72px;
  }
}
</style>
