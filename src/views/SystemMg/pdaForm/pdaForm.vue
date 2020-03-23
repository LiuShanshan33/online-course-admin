//pda表单配置
<template>
  <div class="container">
    <div class="top-container">
      <div class="content-title">pda表单配置</div>
      <hr>
    </div>
    <div class="bottom-container">
      <div class="down-tree" :style="conheight" style="width: 20%">
        <!-- tree -->
        <el-scrollbar style="height:100%">
          <el-tree
            v-loading="listLoading"
            :data="list"
            :props="defaultProps"
            @node-click="handleNodeClick"
            @click="handleCreate"
          ><span slot-scope="{ node, data }" class="span-ellipsis">
            <span :title="data.label">{{ node.label }}</span>
          </span>
          </el-tree>
        </el-scrollbar></div>
      <div v-if="seen" class="right-container">
        <div class="scoll" :style="conheight">
          <el-scrollbar style="height:100%">
            <p style="font-weight:bold">{{ form.formName }}</p>
            <el-tabs type="border-card">
              <el-tab-pane label="基本设置">
                <el-form
                  :label-position="labelPosition"
                  label-width="120px"
                  :model="formLabelAlign"
                  class="tabs-form"
                >
                  <el-form-item label="显示类型:">
                    <el-select v-model="formLabelAlign.code" placeholder="请选择...">
                      <el-option label="婴儿" value="yiner" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="是否拥有患者签名:">
                    <el-select v-model="formLabelAlign.code" placeholder="请选择...">
                      <el-option label="婴儿" value="yiner" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="评估头说明:">
                    <el-input v-model="formLabelAlign.rulesDef" type="textarea" placeholder="请输入" />
                  </el-form-item>
                  <el-form-item label="结尾说明:">
                    <el-input v-model="formLabelAlign.remarks" type="textarea" placeholder="请输入" />
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="评估项目设置">评估项目设置</el-tab-pane>
              <!-- <el-tab-pane label="相关因素">相关因素</el-tab-pane> -->
            </el-tabs>
            <div style="margin-bottom:10px">
              <el-button class="add-botton" @click="onSave">保存</el-button>
              <el-button>取消</el-button>
            </div></el-scrollbar></div>
      </div>
    </div>
  </div></template>

<script>
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import { getFormList } from '@/api/user'

export default {
  name: 'PdaForm',
  data() {
    return {
      defaultProps: {
        // children: 'children',
        label: 'formName'
      },
      labelPosition: 'right',
      form: {
        formCode: '',
        formName: '',
        remark: ''
      },
      seen: false,
      listLoading: true,
      list: null,
      conheight: {
        height: ''
      },
      formLabelAlign: {
        name: '',
        type: '',
        rulesDef: '',
        remarks: ''
      }

    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  created() {
    this.onLoad()
    this.tableHeight()
  },
  methods: {
    onLoad() {
      this.getTreeData()
    },
    tableHeight() {
      this.conheight.height = window.innerHeight - 170 + 'px'
      console.log('当前页面高度', window.innerHeight)
    },
    getTreeData() {
      getFormList().then(res => {
        this.list = res.data
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    // 点击新建
    handleCreate: function() {
      this.seen = true
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    onSave() {
      console.log('submit!')
      this.$message.success('保存成功')
    },
    // createData() {
    //   this.$refs['dataForm'].validate((valid) => {
    //     if (valid) {
    //       this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
    //       this.temp.author = 'vue-element-admin'
    //       createArticle(this.temp).then(() => {
    //         this.list.unshift(this.temp)
    //         this.dialogFormVisible = false
    //         this.$notify({
    //           title: 'Success',
    //           message: 'Created Successfully',
    //           type: 'success',
    //           duration: 2000
    //         })
    //       })
    //     }
    //   })
    // }
    handleNodeClick: function(data) {
      console.log(data)
      this.seen = true
      this.form = data
      // return data('code', 'name')
    }
  }
}
</script>

<style lang="scss" scoped>
.top-container {
  margin: 20px 12px 5px 12px;
  .content-title {
    width: 140px;
    height: 30px;
    font-size: 15px;
    font-family: STSongti-SC-Black, STSongti-SC;
    font-weight: 900;
    color: rgba(51, 51, 51, 1);
    line-height: 25px;
    border-bottom: 3px solid #419793;
  }
  hr {
    width: 100%;
    margin: 0 auto;
    border: 0;
    height: 0;
    border-bottom: 1px solid rgba(203, 203, 203, 1);
  }
  .create-btn {
    width: 75px;
    height: 30px;
    background: linear-gradient(
      180deg,
      rgba(241, 246, 249, 1) 0%,
      rgba(214, 224, 229, 1) 54%,
      rgba(236, 241, 243, 1) 100%
    );
    border-radius: 2px;
    border: 1px solid rgba(204, 204, 204, 1);
    font-size: 12px;
    font-family: STSongti-SC-Bold, STSongti-SC;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    line-height: 17px;
    padding: 3px;
  }
}
.bottom-container {
  display: flex;
  flex-direction: row;
  .down-tree {
    flex: 1;
    max-width: 200px;
    height: 678px;
    background: rgba(245, 248, 250, 1);
    border-radius: 3px;
    border: 1px solid rgba(211, 219, 222, 1);
    margin-left: 12px;
    padding: 12px;
  }
  .span-ellipsis {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      /deep/.el-loading-spinner{
        top: 8%!important;
      }
  .right-container {
    flex: 5;
    border-radius: 3px;
    border: 1px solid rgba(211, 219, 222, 1);
    border-width: 1px 1px 1px 0px;
    margin-right: 12px;
    padding-left: 30px;
    .top-form {
      .el-form-item {
        width: 600px;
        margin-bottom: 15px;
        font-family: STSongti-SC-Bold, STSongti-SC;
        font-weight: bold;
        line-height: 17px;
        /deep/.el-form-item__label {
          color: rgba(51, 51, 51, 1) !important;
          font-size: 12px;
          font-family: STSongti-SC-Bold, STSongti-SC;
        }
        /deep/.el-input--medium .el-input__inner {
          height: 30px !important;
          line-height: 30px !important;
        }
      }
    }
    /deep/.el-tabs{
      margin-left: 0px!important;
    }
    /deep/.tabs-form {
      .el-form-item {
        width: 540px !important;
        font-family: STSongti-SC-Bold, STSongti-SC;
        font-weight: bold;
        line-height: 17px;
        .el-select .el-input {
          width: 440px;
        }
        /deep/.el-form-item__label {
          color: rgba(51, 51, 51, 1) !important;
          font-size: 12px;
          font-family: STSongti-SC-Bold, STSongti-SC;
        }
        /deep/.el-input--medium .el-input__inner {
          height: 30px !important;
          line-height: 30px !important;
        }
      }
      .el-textarea__inner {
        min-height: 80px !important;
      }
    }
  }
}
</style>
