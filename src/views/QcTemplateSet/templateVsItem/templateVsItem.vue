<template>
  <div class="container">
    <div class="top-container">
      <div class="content-title">表单设置</div>
      <hr>

      <el-button class="create-btn" style="margin-top: 20px;margin-bottom: 10px;" type="primary" @click="">
        新建
      </el-button>
    </div>
    <div class="bottom-container">
      <div class="down-tree" :style="conheight" style="width: 20%">
        <!-- tree -->
        <el-scrollbar>
          <el-input v-model="filterText" placeholder="输入关键字进行过滤" />
          <el-tree
            ref="tree"
            class="filter-tree"
            :filter-node-method="filterNode"
            node-key="formCode"
            :data="list"
            :props="defaultProps"
            :style="conheight"
            @node-click="handleNodeClick"
            @click=""
          />
        </el-scrollbar>
      </div>
      <div v-if="show" class="right-container">
        <div class="scoll" :style="conheight">
          <el-scrollbar style="height:100%">
            <el-form ref="form" :label-position="labelPosition" :model="formData" label-width="80px" class="top-form">
              <el-form-item label="表单编码:" class="">
                <el-input v-model="formData.formCode" placeholder="请输入" />
              </el-form-item>
              <el-form-item label="表单名称:" class="">
                <el-input v-model="formData.formName" placeholder="请输入" />
              </el-form-item>
              <el-tabs type="border-card" style="width: auto">
                <el-tab-pane label="关联项目设置">
                  <el-form :label-position="labelPosition" label-width="100px" :model="formLabelAlign" class="tabs-form">
                    <el-table
                      :data="formVsItemData"
                      border
                      :cell-style="{padding:'3px 2px'}"
                      style="margin-top:10px; padding-bottom:10px; width: 100%"
                      @row-click="checkViews"
                    >
                      <el-table-column prop="itemCode" label="项目名称" width="auto" show-overflow-tooltip style="{margin-left: 0;}">
                        <template slot-scope="scope">
                          <el-form-item prop="itemCode" class="table-form-item">
                            <el-select v-model="scope.row.itemCode" filterable>
                              <el-option
                                v-for="item in itemOptions"
                                :key="item.itemCode"
                                :label="item.itemName"
                                :value="item.itemCode"
                              />
                            </el-select>
                            <!--<el-input v-show="true" v-model="scope.row.itemCode"></el-input>-->
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="" label="操作" width="100" class="table-form-item">
                        <template slot-scope="scope">
                          <el-form-item inline-message="true" class="table-form-item">
                            <el-button class="table-form-item" @click="removeVsRow(scope.$index)">删除</el-button>
                          </el-form-item>
                        </template>
                      </el-table-column>
                    </el-table>
                    <el-form-item class="bottom-btn">
                      <el-button type="primary" @click="addVsRow">添加</el-button>
                      <el-button type="primary" @click="subVsForm">保存</el-button>
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
                <el-tab-pane label="诊断表达式设置">
                  <el-form>
                    <el-table
                      :data="diagsExpData"
                      border
                      :cell-style="{padding:'3px 2px'}"
                      style="margin-top:10px; padding-bottom:10px; width: 100%"
                      @row-click=""
                    >
                      <el-table-column prop="diagExp" label="诊断表达式" width="auto" show-overflow-tooltip style="{margin-left: 0;}">
                        <template slot-scope="scope">
                          <el-form-item prop="diagExp">
                            <el-input v-show="true" v-model="scope.row.diagExp" validate-event="true" />
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="diagCodes" label="诊断编码" width="auto" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item prop="diagCodes">
                            <el-input v-show="true" v-model="scope.row.diagCodes" />
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="" label="操作" width="100">
                        <template slot-scope="scope">
                          <el-form-item inline-message="true">
                            <el-button @click="removeDiagsRow(scope.$index)">删除</el-button>
                          </el-form-item>
                        </template>
                      </el-table-column>
                    </el-table>
                    <el-form-item class="bottom-btn">
                      <el-button type="primary" @click="addDiagRow">添加</el-button>
                      <el-button type="primary" @click="subDiagsForm">保存</el-button>
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
              </el-tabs>
              <el-form-item class="bottom-btn">
                <el-button>取消</el-button>
              </el-form-item>
            </el-form>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { getFormList, getFormItemList, getDiagsExpList, getItemList } from '@/api/form'
export default {
  name: 'TemplateVsItem',
  data() {
    return {
      defaultProps: {
        label: 'formName'
      },
      diagsExpData: '',
      formVsItemData: '',
      typeOptionList: {},
      list: '',
      formData: '',
      filterText: '',
      show: false,
      itemOptions: ''
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleNodeClick(data) {
      this.show = true
      this.form = data
      this.formData = data
      this.init(data.formCode)
    },
    init(formCode) {
      getFormItemList(formCode).then(response => {
        console.log(response.data.itemList)
        this.formVsItemData = response.data.itemList
      })
      getDiagsExpList(formCode).then(response => {
        console.log(response.data)
        this.diagsExpData = response.data.diagsExpList
      })
    },
    removeVsRow(index) {
      if (index !== -1) {
        this.formVsItemData.splice(index, 1)
      }
    },
    removeDiagsRow(index) {
      if (index !== -1) {
        this.diagsExpData.splice(index, 1)
      }
    },
    getList() {
      getFormList().then(response => {
        this.list = response.data
      })
      getItemList().then(response => {
        this.itemOptions = response.data
      })
      console.log(this.itemOptions)
    },
    filterNode(value, data) {
      if (!value) return true
      return data.formName.indexOf(value) !== -1
    },
    addVsRow() {
      this.formVsItemData.push({
        itemCode: ''
      })
    },
    addDiagRow() {
      this.diagsExpData.push({
        diagExp: '',
        diagCodes: ''
      })
    },
    subDiagsForm() {
      console.log(this.diagsExpData)
    },
    subVsForm() {
      console.log(this.formVsItemData)
    }
  },
  checkViews(data) {
    this.form = data
  }
}
</script>

<style lang="scss" scoped>
  .table-form-item {
    margin-left: -50px;
  }
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
  }
  .bottom-container{
    display: flex;
    flex-direction: row;
    .down-tree{
      flex: 1;
      max-width:200px;
      height:678px;
      background:rgba(245,248,250,1);
      border-radius:3px;
      border:1px solid rgba(211,219,222,1);
      margin-left: 12px;
      padding: 14px;
      overflow:hidden;
    /deep/.el-scrollbar{
        height: 658px;
      /deep/.el-scrollbar__wrap{
        overflow-x: hidden;
      }
    }
  }
  .right-container{
      flex: 5;
      border-radius:3px;
      border:1px solid rgba(211,219,222,1);
      border-width: 1px 1px 1px 0px;
      margin-right: 12px;
      padding-left:30px;
    .top-form {
      margin-top: 30px;
      .el-form-item{
        width: 600px;
        margin-bottom: 15px;
        font-family:STSongti-SC-Bold,STSongti-SC;
        font-weight:bold;
        line-height:17px;
        /deep/.el-form-item__label{
          color:rgba(51,51,51,1)!important;
          font-size:12px;
          font-family:STSongti-SC-Bold,STSongti-SC;
        }
        /deep/.el-input--medium .el-input__inner {
          height: 30px!important;
          line-height: 30px!important;
        }
      }
    }
    /deep/.tabs-form{
        .el-form-item{
          width: 540px!important;
          font-family:STSongti-SC-Bold,STSongti-SC;
          font-weight:bold;
          line-height:17px;
        .el-select .el-input{
          width: 440px;
        }
        /deep/.el-form-item__label{
          color:rgba(51,51,51,1)!important;
          font-size:12px;
          font-family:STSongti-SC-Bold,STSongti-SC;
        }
        /deep/.el-input--medium .el-input__inner {
          height: 30px!important;
          line-height: 30px!important;
        }
      }
        .el-textarea__inner{
          min-height: 80px!important;
        }
      }
    }
  }
</style>
