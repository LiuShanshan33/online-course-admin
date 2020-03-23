<template>
  <div class="container">
    <div class="top-container">
      <div class="content-title">表单设置</div>
      <hr>
    </div>
    <div class="bottom-container">
      <div class="down-tree" style="width: 20%">
        <!-- tree -->
        <el-scrollbar>
          <el-input v-model="filterText" placeholder="请输入表单项目名称模糊搜索" />
          <el-tree ref="tree" class="filter-tree" :filter-node-method="filterNode" node-key="formCode"
            :data="formList" :props="defaultProps" @node-click="handleNodeClick"/>
        </el-scrollbar>
      </div>
      <div v-if="show" class="right-container">
        <el-scrollbar >
          <el-form ref="form" :model="formItemReEvalData" label-width="80px" class="top-form">
            <el-form-item label="表单名称:" label-width="100px" >
              <span>{{formItemReEvalData.formName}}</span>
            </el-form-item>
            <el-form-item label="项目名称:" :rules="rules.itemCode" label-width="100px" style="margin-bottom:17px">
              <el-select v-model="formItemReEvalData.itemCode" filterable :filter-method="dataFilter" @change="handleItemChange">
                <el-option v-for="item in itemOptions" :key="item.itemCode" :label="item.itemName" :value="item.itemCode"/>
              </el-select>
            </el-form-item>
            <el-form-item v-if="tableShow" label="复评配置:" label-width="100px">
              <el-button style="width:55px" @click="addRow">
                <i class="el-icon-plus">添加</i>
              </el-button>
            </el-form-item>
            <el-table v-if="tableShow" ref="reEvalTable" :data="formItemReEvalData.reEvalList" border fit stripe highlight-current-row
                      :cell-style="{padding:'3px 2px'}" :height="tableHeight"
                      style="margin-top:10px; padding-bottom:10px; width: 100%" :header-cell-style="{background:'#F0F5F7', color:'#333333'}">
              <el-table-column label="匹配表达式" width="auto">
                <template slot-scope="scope">
                  <el-form-item :prop="`reEvalList.${scope.$index}.matchExp`" :rules="rules.matchExp">
                    <el-input v-show="true" v-model="scope.row.matchExp" style="width: 100px"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="匹配表达式类型" width="140px">
                <template slot-scope="scope">
                  <el-form-item :prop="`reEvalList.${scope.$index}.descExpType`" :rules="rules.descExpType" >
                    <el-select v-model="scope.row.descExpType" style="width: 100px">
                      <el-option v-for="item in expType" :key="item.key" :label="item.value" :value="item.key"/>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="描述语表达式" width="auto">
                <template slot-scope="scope">
                  <el-form-item :prop="`reEvalList.${scope.$index}.descExp`" :rules="rules.descExp">
                    <el-input v-show="true" v-model="scope.row.descExp" style="width: 100px"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="描述语表达式类型" width="160px">
                <template slot-scope="scope">
                  <el-form-item :prop="`reEvalList.${scope.$index}.matchExpType`" :rules="rules.matchExpType" >
                    <el-select v-model="scope.row.matchExpType" style="width: 100px">
                      <el-option v-for="item in expType" :key="item.key" :label="item.value" :value="item.key"/>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="复评类型" width="auto">
                <template slot-scope="scope">
                  <el-form-item :prop="`reEvalList.${scope.$index}.type`" :rules="rules.type" >
                    <el-select v-model="scope.row.type" style="width: 100px">
                      <el-option v-for="item in reEvalType" :key="item.key" :label="item.value" :value="item.key"/>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="是否进行水平对比" width="160px">
                <template slot-scope="scope">
                  <el-form-item :prop="`reEvalList.${scope.$index}.levelCompare`" :rules="rules.levelCompare" >
                    <el-switch style="display: block" v-model="scope.row.levelCompare" active-color="#13ce66"
                      inactive-color="">
                    </el-switch>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="水平对比类型" width="auto">
                <template slot-scope="scope">
                  <el-form-item :prop="`reEvalList.${scope.$index}.levelCompareType`" :rules="rules.levelCompareType" >
                    <el-select v-model="scope.row.levelCompareType" style="width: 120px">
                      <el-option v-for="item in levelCompareType" :key="item.key" :label="item.value" :value="item.key"/>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="延时分钟" width="90px">
                <template slot-scope="scope">
                  <el-form-item :prop="`reEvalList.${scope.$index}.delayMinuteOrDay`" :rules="rules.delayMinuteOrDay">
                    <el-input v-show="true" v-model="scope.row.delayMinuteOrDay" style="width: 60px"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="序号" align="left" width="60px">
                <template slot-scope="scope">
                  <el-form-item type="index" :prop="`reEvalList.${scope.$index}.orderNo`" :rules="rules.orderNo">
                    <el-input v-show="true" v-model="scope.row.orderNo" style="width: 40px"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-form-item inline-message="true" >
                    <el-button type="text" size="mini" @click="removeRow(scope.$index)">删除</el-button>
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
            <el-form-item v-if="tableShow" class="bottom-btn">
              <el-button type="primary" @click="saveReEvalForm('form')">保存</el-button>
              <el-button @click="closeForm('tag')">取消</el-button>
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import Pagination from '@/_components/Pagination'
import { getFormItemList, getFormList, deleteForm, saveReEval, getReEvalList } from '@/api/form'
export default {
  name: 'FormMg',
  components: { Pagination },
  directives: { waves },
  data() {
    let validate = (rule, value, callback) => {
      let count = 0
      this.formItemReEvalData.reEvalList.forEach(item => {
        if (value === item.matchExp) {
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
      show: false,
      tableShow: false,
      filterText: '',
      listLoading: true,
      formItemReEvalData: {
        formCode: '',
        formName: '',
        itemCode: '',
        reEvalList: []
      },
      formList:[],
      itemOptions: [],
      reEvalType : [
        { key: '0', value: '时钟评估' },
        { key: '1', value: '日评估' },
        { key: '2', value: '班次评估' }
      ],
      levelCompareType : [
        { key: '0', value: '程度值对比' },
        { key: '1', value: '区间值对比' },
        { key: '2', value: '分值对比' }
      ],
      expType : [
        { key: 'js', value: 'js' },
        { key: 'jeval', value: 'jeval' }
      ],
      rules: {
        itemCode: { type: 'string', required: true, message: ' ', trigger: 'change' },
        matchExp: [
          { type: 'string', required: true, message: ' ', trigger: 'change' },
          { validator: validate, trigger: 'blur' }
        ],
        descExp: { type: 'string', required: true, message: ' ', trigger: 'change' },
        matchExpType: { type: 'string', required: true, message: ' ', trigger: 'change' },
        type: { type: 'string', required: true, message: ' ', trigger: 'change' },
        descExpType: { type: 'string', required: true, message: ' ', trigger: 'change' },
      },
    }
  },
  // 表格高度
  computed: {
    tableHeight() {
      return window.innerHeight - 370
    }
  },
  created() {
    this.getList()
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    dataFilter(val) {
      if (val) { // val存在
        this.itemOptions = this.allItems.filter((item) => {
          if (item.itemName.indexOf(val) != -1 || item.itemName.toUpperCase().indexOf(val.toUpperCase()) != -1) {
            return true
          }
        })
      } else {}
    },
    getList() {
      getFormList().then( response => {
        this.formList = response.data
      })
    },
    saveReEval() {
      if (this.ableCheck) {
        this.$router.push({
          path: '../formSet/saveReEval',
          name: 'saveReEval',
          params: {
            formCode: this.form.formCode,
            itemCode: this.form.itemCode
          }
        })
      } else {
        this.$message({
          message: '请选择一行数据',
          type: 'warning'
        })
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.formName.indexOf(value) != -1
    },
    addRow() {
      this.formItemReEvalData.reEvalList.push({
        matchExp: '',
        descExp: '',
        delayMinuteOrDay: ''
      })
    },
    removeRow(index) {
      if (index !== -1) {
        this.formItemReEvalData.reEvalList.splice(index, 1)
      }
    },
    handleNodeClick(data) {
      this.show = true
      this.tableShow = false
      getFormItemList(data.formCode).then(response => {
        this.itemOptions = response.data.itemList
        this.formItemReEvalData.itemCode = ''
        this.formItemReEvalData.formCode = data.formCode
        this.formItemReEvalData.formName = data.formName
      })
    },
    handleItemChange(event) {
      this.tableShow = true
      getReEvalList(this.formItemReEvalData.formCode, event).then(response => {
        this.formItemReEvalData = response.data
      })
    },
    saveReEvalForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('确定保存?', '保存提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            saveReEval(this.formItemReEvalData).then(response => {
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
          margin-bottom: -15px!important;
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
          /deep/.el-form-item__content{
            margin-left: 0px!important;
            margin-bottom: 0px!important;
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
