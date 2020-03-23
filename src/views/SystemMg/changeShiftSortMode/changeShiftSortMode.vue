//交接班排序方式
<template>
  <div class="container">
    <div class="top-container">
      <div class="content-title">交接班排序方式</div>
      <hr>
      <el-button class="create-btn" style="margin-top: 20px;margin-bottom: 10px;" type="primary" @click="handleCreate">
        新建
      </el-button>
    </div>
    <div class="bottom-container">
      <div class="down-tree" :style="conheight" style="width: 20%">
        <!-- tree -->
        <el-scrollbar style="height:100%">
          <el-tree v-loading="listLoading" :data="list" :props="defaultProps" @node-click="handleNodeClick">
            <span slot-scope="{ node, data }" class="span-ellipsis">
              <span :title="data.label">{{ node.label }}</span>
              <span :title="data.deptName">{{ node.deptName }}</span>
            </span>
          </el-tree>
        </el-scrollbar></div>
      <div v-if="seen" class="right-container">
        <div class="scoll" :style="conheight">
          <el-scrollbar style="height:100%">
            <div> <p style="font-weight:bold;font-size:13px">新增交班的排序方式</p> <el-button class="create-btn add-botton" style="margin-bottom: 10px;" @click="AddItems">
              添加
            </el-button>
            </div>
            <el-table
              v-if="create"
              :key="tableKey"
              :data="dictItems"
              size="mini"
              border
              empty-text=" "
              fit
              highlight-current-row
              stripe
              style="width: 75%;"
              :header-cell-style="{background:'#F0F5F7'}"
              :cell-style="{padding:'3px 2px'}"
            >

              <el-table-column label="排序内容（新，转，今，明，病，原）" prop="content" align="left" min-width="220px">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.content" size="small" />
                </template>
              </el-table-column>
              <el-table-column label="序号" prop="sortValue" align="left" min-width="220px">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.sortValue" size="small" />
                </template>
              </el-table-column>
              <el-table-column label="操作" align="left" min-width="80">
                <template slot-scope="scope">
                  <el-button type="text" size="mini" @click.native.prevent="deleteRow(scope.$index, delarr)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div style="margin-top: 10px">
              <el-button class="create-btn add-botton" style="margin-bottom: 10px;" @click="saveDict(dictItems)">
                保存
              </el-button>
            </div>
          </el-scrollbar></div>
      </div>
    </div>
  </div></template>

<script>
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import { getDictInfo, getAllDeptVsWard, changeShiftSortMode } from '@/api/user'
import { saveShiftSortMode } from '@/api/addOrSave'
// import data from '../../pdf/content'
// import { get } from 'http'

export default {
  name: 'HandingOffSort',
  data() {
    return {
      defaultProps: {
        label: function (data, node) {
          if (data.hasOwnProperty('wardName')) {
            return data.wardName
          } else {
            return data.deptName
          }
        },
        children: 'list'
      },
      tableKey: 0,
      labelPosition: 'right',
      form: {
        code: '',
        name: ''
      },
      delarr: [],
      seen: false,
      listLoading: true,
      formLabelAlign: {
        name: '',
        type: '',
        rulesDef: '',
        remarks: ''
      },
      list: null,
      items: [],
      dictItems: [],
      saveList:{
        deptCode:'',
        changeShiftSortModes:[]
      },
      conheight: {
        height: ''
      }
    }
  },
  created() {
    // this.getList()
    this.onLoad()
    // window.addEventListener('resize', this.getHeight)
    this.tableHeight()
  },
  methods: {
    onLoad() {
      this.getTreeData()
    },
    tableHeight() {
      this.conheight.height = window.innerHeight - 232 + 'px'
    },
    getTreeData() {
      getAllDeptVsWard().then(res => {
        // const treeList = []
        console.log(res.data.list)
        this.list = res.data.list
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    // // 删除该行
    deleteRow(index, rows) {
      this.dictItems.splice(index, 1)
      console.log(this.dictItems)
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
    // 添加一行
    AddItems() {
        this.dictItems.push({
          content: '',
          sortValue: this.dictItems.length + 1
      }) 
    },
    // 保存
    saveDict() {
      const data = {
        deptCode: this.form.code,
        changeShiftSortModes: this.dictItems
      }
      saveShiftSortMode(data).then(response => {
        console.log('data', data)
        this.$message({
          type: 'success',
          message: '保存成功'
        })
      })
    },
    // 点击节点
    handleNodeClick: function(data) {
      console.log('DeptCode', data)
      this.seen = true
      this.create = true
      this.form.code = data.deptCode //存储科室编码
      if (data && data.deptCode) {
        changeShiftSortMode(data.deptCode).then(res => {
          console.log(data.deptCode)
          this.dictItems = res.data.list
          console.log('能出来么', this.dictItems)
        })
      }
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
    padding: 10px;
  }
  .right-container{
    flex: 5;
    border-radius:3px;
    border:1px solid rgba(211,219,222,1);
    border-width: 1px 1px 1px 0px;
    margin-right: 12px;
    padding-left: 30px;
    .top-form {
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
