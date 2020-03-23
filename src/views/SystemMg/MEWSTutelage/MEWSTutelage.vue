//MEWS评分监护
<template>
  <div class="container">
    <div class="top-container">
      <div class="content-title">Mews评分监护</div>
      <hr>
      <el-button class="create-btn" style="margin-top: 20px;margin-bottom: 10px;" type="primary" @click="handleCreate">
        新建
      </el-button>
    </div>
    <div class="bottom-container">
      <div class="down-tree" :style="conheight" style="width: 20%">
        <!-- tree -->
        <el-scrollbar style="height:100%"><el-tree v-loading="listLoading" :data="list" :props="defaultProps" @node-click="handleNodeClick" @click="handleCreate">
          <span slot-scope="{ node, data }" class="span-ellipsis">
            <span :title="data.label">{{ node.label }}评分监护</span>
          </span>
        </el-tree>
        </el-scrollbar>
      </div>
      <div v-if="seen" class="right-container">
        <div class="scoll" :style="conheight">
          <el-scrollbar style="height:100%">
            <!-- <el-form ref="form" :label-position="labelPosition" :model="form" label-width="66px" class="top-form">
              <el-form-item label="诊断编码:" class="">
                <el-input v-model="form.code" placeholder="请输入" />
              </el-form-item>
              <el-form-item label="诊断名字:" class="">
                <el-input v-model="form.name" placeholder="请输入" />
              </el-form-item>
            </el-form> -->
            <div> <p style="font-weight:bold;font-size:13px">MEWS表单方案</p>
            <el-button class="create-btn add-botton" style="margin-bottom: 10px;" @click="AddItems">
              添加
            </el-button>
            </div>
            <el-table
              v-if="create"
              :key="tableKey"
              :data="dictItems"
              size="mini"
              border
              fit
              highlight-current-row
              stripe
              style="width: 90%;"
              :header-cell-style="{background:'#F0F5F7'}"
              :cell-style="{padding:'3px 2px'}"
            >

              <el-table-column label="MEWS分数" prop="content" align="left" min-width="160px">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.content" size="small" />
                </template>
              </el-table-column>
              <el-table-column label="单项超标分数" prop="exceptionalCase" align="left" min-width="120px">
                <!-- <el-form ref="dictItems" :label-position="labelPosition" :model="dictItems">
                  <el-input v-model="dictItems.name" />
                </el-form> -->
                <template slot-scope="scope">
                  <el-input v-model="scope.row.exceptionalCase" size="small" />
                </template>
              </el-table-column>
              <!-- <el-table-column label="排序" prop="sort" type="index" align="left" width="70px" /> -->
              <el-table-column label="监护方案" prop="programme" type="index" align="left" width="270px">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.programme" size="small" />
                </template>
              </el-table-column>
              <el-table-column label="操作" align="left" min-width="80">
                <template slot-scope="scope">
                  <el-button type="text" size="mini" @click.native.prevent="deleteRow(scope.$index)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div style="margin-top: 10px">
              <el-button class="create-btn add-botton" style="margin-bottom: 10px;" type="primary" @click="saveItems(form)">
                保存
              </el-button>
              <el-button class="create-btn" style="margin-bottom: 10px;">
                删除
              </el-button>
            </div>
          </el-scrollbar></div>
      </div>
    </div>
  </div>
</template>

<script>
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import { getMewsForm, getmewsScore } from '@/api/user'
import { savemewsTutelage } from '@/api/addOrSave'

export default {
  name: 'MEWSTutelage',
  data() {
    return {
      list: null,
      tableKey: 0,
      dictItems: null,
      defaultProps: {
        // children: 'children',
        label: 'formName'
      },
      labelPosition: 'right',
      form: {
        code: '',
        name: ''
      },
      conheight: {
        height: ''
      },
      seen: false,
      create: false,
      listLoading: true,
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
    window.addEventListener('resize', this.getHeight)
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
      getMewsForm().then(res => {
        this.list = res.data.list
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
        // this.$refs['dataForm'].clearValidate()
      })
    },
    handleNodeClick: function(data) {
      console.log(data)
      this.seen = true
      this.create = true
      this.form.formCode = data.formCode
      if (data && data.formCode) {
        getmewsScore(data.formCode).then(res => {
          console.log(data.formCode)
          this.dictItems = res.data.list
          console.log('能出来么', res.data.list)
        })
      }
    },
     // 添加一行
    AddItems() {
        this.dictItems.push({
          exceptionalCase: '',
          content: '',
          programme: ''
      })
    },
     // // 删除该行
    deleteRow(index, rows) {
      this.dictItems.splice(index, 1)
      console.log(this.dictItems)
    },
    // 保存
    saveItems() {
      const data = {
        formCode: this.form.formCode,
        mewsScoreProgrammes: this.dictItems
    }
    savemewsTutelage(data).then(response => {
        console.log('data', data)
        this.$message({
          type: 'success',
          message: '保存成功'
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
}
.bottom-container{
  display: flex;
  flex-direction: row;
  .down-tree{
    flex: 1;
    max-width:200px;
    height:100%;
    background:rgba(245,248,250,1);
    border-radius:3px;
    border:1px solid rgba(211,219,222,1);
    margin-left: 12px;
    padding: 10px;
     /deep/.el-scrollbar{
      // height: 658px;
      /deep/.el-scrollbar__wrap{
        overflow-x: hidden;
      }
    }
     /deep/.el-tree{
    background:rgba(245,248,250,1);
    }
    .span-ellipsis {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
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
