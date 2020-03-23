//字典管理
<template>
  <div class="container">
    <div class="top-container">
      <div class="content-title">字典管理</div>
      <hr>
      <el-button class="create-btn" style="margin-top: 20px;margin-bottom: 10px;" type="primary" @click="handleCreate">
        新建
      </el-button>
    </div>
    <div class="bottom-container">
      <div class="down-tree" :style="conheight" style="width: 10%">
        <!-- tree -->
        <el-scrollbar style="height:100%">
          <el-tree v-loading="listLoading" :data="list" :props="defaultProps" @node-click="handleNodeClick">
            <span slot-scope="{ node, data }" class="span-ellipsis">
              <span :title="data.label">{{ node.label }}</span>
            </span>
          </el-tree>
        </el-scrollbar></div>
      <div v-if="seen" class="right-container">
        <div class="scoll" :style="conheight">
          <el-scrollbar style="height:100%">
            <el-form ref="form" :label-position="labelPosition" :model="form" label-width="66px" class="top-form">
              <el-form-item label="诊断编码:" class="">
                <el-input v-model="form.code" placeholder="请输入" />
              </el-form-item>
              <el-form-item label="诊断名字:" class="">
                <el-input v-model="form.name" placeholder="请输入" />
              </el-form-item>
            </el-form>
            <div> <p style="font-weight:bold;font-size:13px">新增字典项</p> <el-button class="create-btn add-botton" style="margin-bottom: 10px;" @click="AddItems">
              添加
            </el-button>
            </div>

            <el-table
              v-if="create"
              :key="tableKey"
              v-loading="listLoading"
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

              <el-table-column label="编码" prop="code" align="left" min-width="220px">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.code" size="small" />
                </template>
              </el-table-column>
              <el-table-column label="名称" prop="name" align="left" min-width="220px">
                <!-- <el-form ref="dictItems" :label-position="labelPosition" :model="dictItems">
                  <el-input v-model="dictItems.name" />
                </el-form> -->
                <template slot-scope="scope">
                  <el-input v-model="scope.row.name" size="small" />
                </template>
              </el-table-column>
              <!-- <el-table-column label="排序" prop="sort" type="index" align="left" width="70px" /> -->
              <el-table-column label="排序" prop="sort" type="index" align="left" width="70px">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.sort" size="small" />
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
              <el-button class="create-btn add-botton" style="margin-bottom: 10px;" @click="saveDict(form)">
                保存
              </el-button>
              <el-button class="create-btn add-botton" style="margin-bottom: 10px;" @click="AddItems">
                复制
              </el-button>
              <el-button v-if="itemsdelete" class="create-btn" style="margin-bottom: 10px;">
                删除
              </el-button>
            </div>
          </el-scrollbar></div>
      </div>
    </div></div></template>

<script>
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import { getdictTable, getDictItem, saveDictItem, deleteDictItem } from '@/api/user'
import data from '../../pdf/content'

export default {
  name: 'DictionaryMg',
  data() {
    return {
      list: [],
      items: [],
      tableKey: 0,
      listLoading: null,
      itemsdelete: true,
      create: false,
      // tables: [],
      defaultProps: {
        // children: 'children',
        label: 'name'
      },

      msg: '', // 记录每一条的信息，便于取id
      delarr: [], // 存放删除的数据
      delVisible: false,
      labelPosition: 'right',
      form: {
        code: '',
        name: '',
        type: null,
        description: null,
        sort: null,
        itemList: []
      },
      conheight: {
        height: ''
      },
      seen: false,
      dictItems: null,
      add: {
        id: null,
        code: '',
        name: null,
        sort: '1'
      }
    }
  },
  computed: {
    itemsHeight() {
      return window.innerHeight - 430 + 'px'
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  created() {
    // this.getList()
    this.getTreeData()
    window.addEventListener('resize', this.getHeight)
    this.tableHeight()
  },
  methods: {
    tableHeight() {
      this.conheight.height = window.innerHeight - 232 + 'px'
    },
    getTreeData() {
      getdictTable().then(res => {
        this.listLoading = true
        let treeList = []
        console.log(res.data.list)
        const { data: { list }} = res
        list.map((obj, index) => {
          // this.items = item.items
          obj.items.map((item, index) => {
            if (!item) { return }
            treeList = [...treeList, JSON.parse(JSON.stringify(item))]
            // treeList.push({
            //   label: item.name
            //   // children: treechildList
            // })
          })
        })
        console.log('treeList', treeList)
        this.list = treeList
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    // 点击新建
    handleCreate: function() {
      this.seen = true
      this.dictItems.length = 1
      // this.create = true
      // this.dictItems = this.add
      // this.itemsdelete = false
      if (this.dictItems.length > 0) {
        this.dictItems[0] = ''
        this.dictItems = this.add
        // this.dictItems.push({
        //   id: this.dictItems.id,
        //   code: '',
        //   name: null,
        //   sort: '1'
        // })
        this.dictItems.push({
          id: { dictId: this.dictItems.id, code: '' },
          name: '',
          sort: this.dictItems.length + 1,
          code: ''
        })
      } else {
        this.dictItems.push({
          id: { dictId: this.dictItems.id, code: '' },
          name: '',
          sort: this.dictItems.length + 1,
          code: ''
        })
      }
      // this.dialogStatus = 'create'
      // this.dialogFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate()
      // })
    },
    // 添加
    AddItems() {
      if (this.dictItems.length > 0) {
        this.dictItems.push({
          id: { dictId: this.form.id,
            code: '111' },
          name: '',
          sort: this.dictItems.length + 1,
          code: ''
        })
        console.log('有值么', this.dictItems)
      } else {
        this.create = true
        this.dictItems = this.add
      }
    },
    deleteRow(index, rows) { // 删除该行
      this.dictItems.splice(index, 1)
      console.log(this.dictItems)
    },
    // onSave() {
    //   console.log('submit!')
    //   this.$message.success('保存成功')
    // },
    // saveDelete() {
    //   const data = {
    //     code: this.form.code,
    //     name: this.form.name,
    //     sort: this.form.sort,
    //     itemList: this.dictItems
    //   }
    //   deleteDictItem(this.form).then(response => {
    //     this.dictItems = response.data
    //     // this.form = response.data
    //     console.log('DictItem', this.dictItems)
    //     this.$message({
    //       type: 'success',
    //       message: '保存成功'
    //     })
    //   })
    // },
    saveDict() {
      const data = {
        id: this.form.id,
        code: this.form.code,
        type: this.form.type,
        name: this.form.name,
        sort: this.form.sort,
        itemList: this.dictItems
      }
      saveDictItem(data).then(response => {
        // this.dictItems = response.data
        this.form = response.data
        console.log('DictItem', this.dictItems, this.form)
        this.$message({
          type: 'success',
          message: '保存成功'
        })
      })
      // this.saveDelete()
    },
    handleNodeClick: function(data) {
      console.log(data)
      this.seen = true
      this.create = true
      this.form = data
      // return data('code', 'name')
      if (data && data.id) {
        getDictItem(data.id).then(res => {
          console.log(data.id)
          // this.listLoading = true
          this.dictItems = res.data.list
          console.log('能出来么', this.dictItems)
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
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
    // height:100%;
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
    .span-ellipsis {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
     /deep/.el-loading-spinner{
        top: 2%!important;
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
      margin-top: 20px;
      .el-form-item{
        width: 600px;
        margin-bottom: 10px;
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
