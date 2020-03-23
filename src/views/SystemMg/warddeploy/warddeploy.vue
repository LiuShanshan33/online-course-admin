//病区动态显示配置
<template>
  <div class="container">
    <div class="top-container">
      <div class="content-title">病区动态显示配置</div>
      <hr>
      <!-- <el-button class="create-btn" style="margin-top: 20px;margin-bottom: 10px;" type="primary">
        新建
      </el-button> -->
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
          />
        </el-scrollbar>
      </div>
      <div v-if="seen" class="right-container">
        <div class="scoll" :style="conheight">
          <el-scrollbar style="height:100%">
            <el-button class="create-btn add-botton" style="margin-top:10px;margin-bottom: 10px;" @click="AddItems">
              新增
            </el-button>
            <el-table
              v-if="create"
              :key="tableKey"
              :data="items.boardConfigures"
              size="mini"
              border
              fit
              highlight-current-row
              stripe
              style="width: 75%;"
              :header-cell-style="{background:'#F0F5F7'}"
              :cell-style="{padding:'3px 2px'}"
            >

              <el-table-column label="配置项" prop="configure" align="left" min-width="220px">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.configure" size="small" />
                </template>
              </el-table-column>
              <el-table-column label="排序" prop="sortValue" align="left" min-width="220px">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.sortValue" size="small" />
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
              <el-button @click="save('boardConfigures')" class="create-btn add-botton" style="margin-top:10px;margin-bottom: 5px;">
                保存
              </el-button>
            </div>
          </el-scrollbar></div>
      </div>
    </div>
  </div></template>

<script>
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import { getDictInfo, getwhiteBoard } from '@/api/user'
import { savewhiteBoard } from '@/api/addOrSave'
export default {
  // name: 'Warddeploy',
  data() {
    return {
      defaultProps: {
        // children: 'children',
        label: 'name'
      },
      labelPosition: 'right',
      form: {
        code: '',
        name: ''
      },
      seen: false,
      tableKey: 0,
      create: false,
      conheight: {
        height: ''
      },
      list: null,
      items: {
        deptCode: '',
        boardConfigures: [
        {
            configure: '',
            sortValue: ''
        }
        ]
      },
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
    this.tableHeight()
  },
  methods: {
    onLoad() {
      this.getTreeData()
    },
    tableHeight() {
      this.conheight.height = window.innerHeight - 170 + 'px'
    },
    getTreeData() {
      getDictInfo().then(res => {
        this.list = res.data.list
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    AddItems() {
      this.items.boardConfigures.push({
        deptCode: '',
        configure: '',
        sortValue: this.items.boardConfigures.length + 1
      })
    },
    // 删除该行
    deleteRow(index, rows) { 
      this.items.boardConfigures.splice(index, 1)
      console.log('删除后的list', this.items.boardConfigures)
    },
    // 保存
    save(formName) {
      this.items.deptCode = this.form.code
      console.log('保存的列表', this.items)
      savewhiteBoard(this.items).then(response => {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
      })
    },
    // 点击节点
    handleNodeClick: function(data) {
      this.seen = true
      this.create = true
      this.form.code = data.code
      if (data && data.code) {
        getwhiteBoard(data.code).then(res => {
          console.log(data.code)
          this.items.boardConfigures = res.data.list
          console.log('能出来么', res.data.list)
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
