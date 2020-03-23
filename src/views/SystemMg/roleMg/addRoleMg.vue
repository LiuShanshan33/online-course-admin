<template>
  <div class="container">
    <div class="top-container">
      <div class="content-title">添加角色</div>
      <hr>
    </div>
    <div class="bottom-container">
      <div class="scoll" :style="conheight">
        <el-scrollbar style="height:100%">
          <el-form
            ref="RoleMgForm"
            :label-position="labelPosition"
            :model="RoleMgForm"
            :rules="rules"
            label-width="140px "
            class="top-form"
          >
            <el-form-item label="名称:" prop="name">
              <el-input v-model="RoleMgForm.name" />
            </el-form-item>
            <el-form-item label="拥有所有功能权限:">
              <el-checkbox v-model="RoleMgForm.ownsAllRight" style="width:52%;float:right" />
            </el-form-item>
            <el-form-item v-if="!RoleMgForm.ownsAllRight" label="显示所有模块:">
              <el-checkbox v-model="RoleMgForm.showAllMoudle" style="width:52%;float:right" />
            </el-form-item>
            <el-form-item v-if="!RoleMgForm.ownsAllRight">
              <el-tree
                ref="tree"
                :data="treeData"
                show-checkbox
                default-expand-all
                node-key="id"
                style="margin-right:200px;"
                :props="defaultProps"
                :node-click="getNode"
              >
                <span slot-scope="{ node,data }">
                  <span class="icon-item" v-html="data.attached" />
                  &nbsp;{{ data.name }}
                </span>
              </el-tree>
            </el-form-item>
            <el-form-item class="bottom-btn">
              <el-button class="add-botton" @click="save('RoleMgForm')">保存</el-button>
              <el-button @click="closeForm(tag)">关闭</el-button>
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import { saveRole, AllModuleSelect } from '@/api/addOrSave' // 保存修改接口

export default {
  name: 'AddRoleMg',
  data() {
    return {
      RoleMgForm: {
        id: '',
        name: '',
        ownsAllRight: true,
        showAllMoudle: false,
        moudleIds: []
      },
      treeData: [],
      defaultProps: {
        label: 'name',
        children: 'children',
        icon: 'attached'
      },
      labelPosition: 'right',
      conheight: {
        height: ''
      },
      rules: {
        name: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ]
      }

    }
  },
  created() {
    this.getModule()
  },
  methods: {
    // 获取所有模块的数据
    getModule() {
      AllModuleSelect().then(response => {
        if (response.code === 200) {
          this.treeData = response.data
        }
      })
    },
    // 节点被点击时的回调
    getNode(data, node, obj) {
      var resIds = [3, 31, 32, 251, 252, 253, 261, 262, 263, 264, 265, 266]
      setTimeout(() => {
        this.$refs.tree.setCheckedKeys(resIds)
      }, 200)
    },
    // 保存
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveRole(this.RoleMgForm).then(response => {
            this.RoleMgForm = response.data
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
/deep/ .el-tree .el-icon-caret-right:before {
  background: none !important;
  content: "\E602";
  font-size: 12px;
  position: relative;
  top: 5px;
}

/deep/ .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
  content: "\E63c";
  font-size: 12px;
  position: relative;
  top: 5px;
}
</style>
<style lang="css">
@import "../../../font-awesome/css/font-awesome-ie7.min.css";
@import "../../../font-awesome/css/font-awesome.min.css";
</style>
