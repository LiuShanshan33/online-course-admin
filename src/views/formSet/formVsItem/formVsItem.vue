<template>
  <div class="container">
    <div class="top-container">
      <div class="content-title">表单设置</div>
      <hr>
      <el-button class="create-btn" style="margin-top: 20px;margin-bottom: 10px;" type="primary" @click="newForm">
        新建
      </el-button>
    </div>
    <div class="bottom-container">
      <div class="down-tree" :style="conheight" style="width: 20%">
        <!-- tree -->
        <el-scrollbar style="height: 100%">
          <el-input v-model="filterText" placeholder="请输入表单项目名称模糊搜索" />
          <el-tree ref="tree" class="filter-tree" :filter-node-method="filterNode" node-key="formCode"
            :data="list" :props="defaultProps" @node-click="handleNodeClick"/>
        </el-scrollbar>
      </div>
      <div v-if="show" class="right-container">
        <el-scrollbar >
          <el-form ref="formVsItemForm" :model="formVsItemData" class="top-form">
            <el-form-item label="表单编码:" prop="formCode" :rules="rules.formCode" label-width="90px">
              <el-input :disabled="isAllow" v-model="formVsItemData.formCode" placeholder="请输入"  style="width: auto;"/>
            </el-form-item>
            <el-form-item label="表单名称:" prop="formName" :rules="rules.formName">
              <el-input v-model="formVsItemData.formName" placeholder="请输入" style="width: auto;"/>
            </el-form-item>
            <el-tabs type="border-card" style="width: 90%">
              <el-tab-pane label="关联项目设置">
                <el-form-item>
                  <el-button style="width:55px" @click="addVsRow">
                    <i class="el-icon-plus">添加</i>
                  </el-button>
                </el-form-item>
                <el-table ref="vsTable" v-loading="listLoading" :data="formVsItemData.itemList" border fit stripe highlight-current-row
                  :cell-style="{padding:'3px 2px'}" :height="tableHeight" style="width: 100%;"
                          :header-cell-style="{background:'#F0F5F7', color:'#333333'}" >
                  <el-table-column label="序号" type="index" align="left" width="80px" />
                  <el-table-column label="项目类型" width="auto">
                    <template slot-scope="scope">
                      <el-form-item :prop="'itemList.' + scope.$index + '.itemType'" :rules="rules.itemType">
                        <el-select v-model="scope.row.itemType" placeholder="请选择" filterable clearable
                          class="filter-item" @change="changeTypeValue(scope)">
                          <el-option v-for="item in TypeOptions" :key="item.key" :label="item.value" :value="item.key" />
                        </el-select>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="项目名称" width="auto">
                    <template slot-scope="scope">
                      <el-form-item :prop="`itemList.${scope.$index}.itemCode`" :rules="rules.itemCode" >
                        <el-select v-model="scope.row.itemCode" :title="scope.row.itemName" filterable :loading="loading" @click.native="loadItemOptions(scope)">
                          <el-option v-for="item in itemOptions" :key="item.itemCode" :title="item.itemName" :label="item.itemName" :value="item.itemCode"/>
                        </el-select>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="项目编码" width="auto">
                    <template slot-scope="scope">
                      <el-form-item >
                        <span>{{ scope.row.itemCode }}</span>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="" label="操作" width="100" >
                    <template slot-scope="scope">
                      <el-form-item inline-message="true">
                        <el-button type="text" size="mini" @click="removeVsRow(scope.$index)">删除</el-button>
                      </el-form-item>
                    </template>
                  </el-table-column>
                </el-table>
                <el-form-item class="bottom-btn">
                  <el-button type="primary" @click="subVsForm('formVsItemForm')">保存</el-button>
                  <el-button @click="closeForm('tag')">取消</el-button>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="诊断表达式设置">
                <el-form ref="diagsExpForm" label-width="100px" :model="diagsExpData" class="tabs-form">
                  <el-form-item>
                    <el-button style="width:55px" @click="addDiagRow">
                      <i class="el-icon-plus">添加</i>
                    </el-button>
                  </el-form-item>
                  <el-table ref="dragsTable" v-loading="listLoading" :data="diagsExpData.diagsExpList" border fit stripe highlight-current-row
                            :cell-style="{padding:'3px 2px'}" :height="tableHeight"
                    style="margin-top:10px; padding-bottom:10px; width: 100%" :header-cell-style="{background:'#F0F5F7', color:'#333333'}">
                    <el-table-column label="序号" type="index" align="left" width="80px" />
                    <el-table-column label="诊断表达式" width="auto">
                      <template slot-scope="scope">
                        <el-form-item :prop="`diagsExpList.${scope.$index}.diagExp`" :rules="rules.diagExp">
                          <el-input v-show="true" v-model="scope.row.diagExp" style="width: auto"/>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column label="诊断编码" width="auto">
                      <template slot-scope="scope">
                        <el-form-item :prop="`diagsExpList.${scope.$index}.diagCodes`" :rules="rules.diagCodes">
                          <el-input v-show="true" v-model="scope.row.diagCodes" style="width: auto"/>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100">
                      <template slot-scope="scope">
                        <el-form-item inline-message="true" >
                          <el-button type="text" size="mini" @click="removeDiagsRow(scope.$index)">删除</el-button>
                        </el-form-item>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-form-item class="bottom-btn">
                    <el-button type="primary" @click="subDiagsForm('diagsExpForm', 'formVsItemForm')">保存</el-button>
                    <el-button @click="closeForm('tag')">取消</el-button>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
            </el-tabs>
            <el-form-item class="bottom-btn" style="margin-top: -20px; margin-left: 105px">
              <el-button type="primary" @click="delDiagsForm()">删除</el-button>
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import { TypeOptions, getFormList, getFormItemPage, getFormItemList, getDiagsExpList,
  getItemList, getListByType, saveFormExp, saveFormVsItem, deleteForm } from '@/api/form'

export default {
  name: 'FormVsItem',
  // 滚动条懒加载指令
  directives: {
    'el-select-loadmore': {
      bind(el, binding) {
        const SELECTWRAP_DOM = el.querySelector(
          '.el-select-dropdown .el-select-dropdown__wrap'
        )
        SELECTWRAP_DOM.addEventListener('scroll', function () {
          const condition = this.scrollHeight - this.scrollTop <= this.clientHeight
          if (condition) {
            binding.value()
          }
        })
      }
    }
  },
  data() {
    let validate = (rule, value, callback) => {
      let count = 0
      this.formVsItemData.itemList.forEach(item => {
        if (value === item.itemCode) {
          count++
        }
        if (count>1){
          callback(new Error(' '))
        }
      })
      callback()
    };
    return {
      defaultProps: {
        label: 'formName'
      },
      diagsExpData: {
        diagsExpList: []
      },
      formVsItemData: {
        formCode: '',
        formName: '',
        itemList: []
      },
      typeOptionList: {},
      list: [],
      filterText: '',
      loading: false,
      listLoading: false,
      show: false,
      isAllow: true,
      allItems: [], // 总数组
      itemOptions: [], // 下拉数组
      selectInitData: {},// 下拉参数
      selectData: {
        itemType: '',
        pageIndex: 1,
        pageSize: 20
      },
      conheight: {
        height: ''
      },
      options: [], // 搜索选择
      TypeOptions,
      rules: {
        formCode: { type: 'string', required: true, message: ' ', trigger: 'change' },
        formName: { type: 'string', required: true, message: ' ', trigger: 'change' },
        itemType: { type: 'string', required: true, message: ' ', trigger: 'change' },
        itemCode: [
          { type: 'string', required: true, message: ' ', trigger: 'change' },
          { validator: validate, trigger: 'blur' }
        ],
        diagExp: { type: 'string', required: true, message: ' ', trigger: 'change' },
        diagCodes: { type: 'string', required: true, message: ' ', trigger: 'change' }
      }
    }
  },
   // 表格高度
  computed: {
    table() {
      return window.innerHeight - 440
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  computed: {
    tableHeight() {
      return window.innerHeight - 520
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    // this.itemOptions = []
  },
  methods: {
    newForm() {
      this.isAllow = false
      this.show = true
      this.formVsItemData.formCode = ''
      this.formVsItemData.formName = ''
      this.formVsItemData.itemList = []
      this.diagsExpData.diagsExpList = []
    },
    getList() {
      getFormList().then( response => {
        this.list = response.data
      })
      getItemList().then(response => {
        this.allItems = response.data
      })
    },
    loadItemOptions(scope) {
      getListByType(scope.row.itemType).then(response => {
        this.itemOptions = response.data
      })
    },
    // 类型下拉值变化
    changeTypeValue(scope) {
      scope.row.itemName = ''
      scope.row.itemCode = ''
      getListByType(scope.row.itemType).then(response => {
        this.itemOptions = response.data
      })
    },
    // 树节点搜索过滤
    filterNode(value, data) {
      if (!value) return true
      return data.formName.indexOf(value) != -1
    },
    handleNodeClick(data) {
      this.show = true
      this.isAllow = true
      getFormItemList(data.formCode).then(response => {
        this.formVsItemData = response.data
        this.itemOptions = response.data.itemList
      })
      getDiagsExpList(data.formCode).then(response => {
        this.diagsExpData = response.data
      })
    },
    // 添加/删除关联行
    addVsRow() {
      this.formVsItemData.itemList.push({
        itemCode: '',
      })
    },
    removeVsRow(index) {
      if (index !== -1) {
        this.formVsItemData.itemList.splice(index, 1)
      }
    },
    // 添加或删除诊断表达式行
    addDiagRow() {
      this.diagsExpData.diagsExpList.push({
        diagExp: '',
        diagCodes: ''
      })
    },
    removeDiagsRow(index) {
      if (index !== -1) {
        this.diagsExpData.diagsExpList.splice(index, 1)
      }
    },
    // 提交诊断表达式列表
    subDiagsForm(formName, formName2) {
      var vaild2 = false
      this.$refs[formName2].validate((valid, model) => {
        if (valid){
          vaild2 = valid
        }else if (!model.hasOwnProperty('formCode') && !model.hasOwnProperty('formName')){
          vaild2 = true
        }else {
          vaild2 = false
        }
      })
      this.$refs[formName].validate((valid, model) => {
        if (valid && vaild2) {
          this.$confirm('确定保存?', '保存提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            saveFormExp(this.diagsExpData).then(response => {
              if (response.code == 200) {
                this.$message({
                  type: 'success',
                  message: '保存成功!'
                })
                this.closeForm()
              }
            }).catch( error => {
              this.$message({
                type: 'error',
                message: '数据填写错误，保存失败!'
              })
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消保存'
            })
          })
        } else {
          this.$message({
            type: 'error',
            message: '提交数据不完整或错误，请改正后再提交!'
          })
          return false
        }
      })
    },
    // 提交关联列表
    subVsForm(formName) {
      this.$refs[formName].validate((valid, model) => {
        if (valid) {
          this.$confirm('确定保存?', '保存提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            saveFormVsItem(this.formVsItemData).then(response => {
              if (response.code == 200) {
                this.$message({
                  type: 'success',
                  message: '保存成功!'
                })
                this.closeForm()
              }
            }).catch( error => {
              this.$message({
                type: 'error',
                message: '数据填写错误，保存失败!'
              })
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消保存'
            })
          })
        } else {
          this.$message({
            type: 'error',
            message: '提交数据不完整或错误，请改正后再提交!'
          })
          return false
        }
      })
    },
    closeForm(tag) {
      this.$store.state.tagsView.visitedViews.splice(this.$store.state.tagsView.visitedViews.findIndex(item => item.path === this.$route.path), 1)
      this.$router.go(-1)
    },
    delDiagsForm() {
      this.$confirm('确定删除?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteForm(this.formVsItemData.formCode).then(response => {
          if (response.code == 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.closeForm()
          }
        }).catch( error => {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
  }

}
</script>

<style lang="scss" scoped>
  .top-container{
    margin: 20px 12px 5px 12px;
    .content-title{
      width:120px;
      height:30px;
      font-size:15px;
      font-family:STSongti-SC-Black,STSongti-SC;
      font-weight:900;
      color:rgba(51,51,51,1);
      line-height:25px;
      border-bottom: 3px solid #419793;
    }
    hr{
      width:100%;
      margin:0 auto;
      border: 0;
      height: 0;
      border-bottom: 1px solid rgba(203, 203, 203, 1);
    }
    .create-btn{
      width:75px;
      height:30px;
      background:linear-gradient(180deg,rgba(241,246,249,1) 0%,rgba(214,224,229,1) 54%,rgba(236,241,243,1) 100%);
      border-radius:2px;
      border:1px solid rgba(204,204,204,1);
      font-size:12px;
      font-family:STSongti-SC-Bold,STSongti-SC;
      font-weight:bold;
      color:rgba(51,51,51,1);
      line-height:17px;
      padding: 3px;
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
    padding: 14px;
    overflow: hidden;
    .span-ellipsis {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .right-container {
    flex: 5;
    border-radius: 3px;
    border: 1px solid rgba(211, 219, 222, 1);
    border-width: 1px 1px 1px 0px;
    margin-right: 12px;
    padding-left: 30px;
    .top-form {
      margin-top: 30px;
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
        /deep/.el-form-item__content{
          margin-left: 0px!important;
          margin-bottom: 0px!important;
          margin-top: 0px!important;
        }
        /deep/.el-input--medium .el-input__inner {
          height: 30px !important;
          line-height: 30px !important;
        }
      }
    }
    /deep/.tabs-form {
      padding: 15px!important;
    }
    /deep/.el-tabs{
      /deep/.el-tabs__content{
        margin-bottom: -40px;
      }
    }
  }
}
</style>
