//大屏交接班科室配置
<template>
  <div class="container">
    <div class="top-container">
      <div class="content-title">大屏交接班科室配置</div>
      <hr>
    </div>
    <div class="bottom-container">
      <div class="down-tree" :style="conheight" style="width: 20%">
        <el-scrollbar style="height:100%">
          <el-tree v-loading="listLoading" :data="list" :props="defaultProps" @node-click="handleNodeClick" />
        </el-scrollbar></div>
      <div v-if="seen" class="right-container">
        <div class="scoll" :style="conheight">
          <el-scrollbar style="height:100%">
            <div> <p style="font-weight:bold;font-size:13px">新增交班大屏得科室显示</p> <el-button class="create-btn add-botton" style="margin-bottom: 10px;" @click="AddItems">
              添加
            </el-button>
            </div>
            <el-table
              v-if="create"
              :key="tableKey"
              :data="dictItems.changeShiftDeptCodes"
              size="mini"
              border
              fit
              highlight-current-row
              stripe
              style="width: 75%;"
              :header-cell-style="{background:'#F0F5F7'}"
              :cell-style="{padding:'3px 2px'}"
            >

              <el-table-column label="科室编码和名称" align="left" min-width="220px">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.deptCode" size="small">
                    <el-option v-for="o in wardOptions" :key="o.deptCode" :title="o.deptCode + ' - ' + o.deptName" :lable="o.deptCode + ' - ' + o.deptName" :value="o.deptCode" >{{ o.deptCode + ' - ' + o.deptName }}</el-option>
                  </el-select>
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
              <el-button class="create-btn add-botton" style="margin-bottom: 10px;" @click="saveDept('dictItems')">
                保存
              </el-button>
            </div>
          </el-scrollbar></div>
      </div>
    </div>
  </div></template>

<script>
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import { getDictInfo, changeShiftDeptCode } from '@/api/user'
import { savechangeShift } from '@/api/addOrSave'
export default {
  name: 'ScreenHandingOff',
  data() {
    return {
      defaultProps: {
        // children: 'children',
        label: 'name'
      },
      labelPosition: 'right',
      // selected: this.dictItems.deptcode + this.dictItems.deptName,
      create: false,
      seen: false,
      listLoading: true,
      list: null,
      dictItems: {
        deptCode:'',
        changeShiftDeptCodes:[{

        }]
      },
      form: {
        code: '',
        name: ''
      },
      wardOptions:[],
      tableKey: 0,
      conheight: {
        height: ''
      }

    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  created() {
    // this.getList()
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
    saveDept(){
      console.log('保存', this.dictItems)
      savechangeShift(this.dictItems).then(response => {
          this.$message({
          type: 'success',
          message: '保存成功'
      })
    })
    },
    handleNodeClick: function(data) {
      console.log('点击节点的数据', data)
      this.seen = true
      this.create = true
      this.form.code = data.code
      this.dictItems.deptCode = data.code
      console.log('deptCode', data.code)
      changeShiftDeptCode(this.form.code).then(res => {
        this.dictItems.changeShiftDeptCodes = res.data.list
        this.wardOptions = res.data.wardList
        parseInt(this.wardOptions.deptCode)
        parseInt(this.dictItems.changeShiftDeptCodes.deptCode)
        console.log('wardOptions', this.wardOptions)
      })
    },
    AddItems() {
        this.dictItems.changeShiftDeptCodes.push({
          deptCode: this.wardOptions[0].deptCode,
          deptName: this.wardOptions[0].deptName,
          nurseDeptCode: this.dictItems.deptCode
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.top-container{
  margin: 20px 12px 5px 12px;
  .content-title{
    width:140px;
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
    // height:678px;
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
