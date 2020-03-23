//pda表单配置
<template>
  <div class="container">
    <div class="top-container">
      <div class="content-title">字典编码管理</div>
      <hr />
    </div>
    <div class="bottom-container">
      <div class="down-tree" :style="conheight" style="width: 20%">
        <!-- tree -->
        <el-scrollbar style="height:100%">
          <el-input v-model="filterText" placeholder="请输入关键字搜索" clearable />
          <el-tree
            v-loading="listLoading"
            :filter-node-method="filterNode"
            ref="tree"
            :data="list"
            :props="defaultProps"
            @node-click="getNode"
          ></el-tree>
        </el-scrollbar>
      </div>
      <div v-if="seen" class="right-container">
        <div class="scoll" :style="conheight">
          <el-scrollbar style="height:100%">
            <div class="top-container" style="border-width:fit-content;">
              <div class="content-title">
                <span>{{ form.formName }}</span>
              </div>
              <hr />
            </div>
            <el-form :label-position="labelPosition" label-width="120px" :model="formLabelAlign">
              <el-form-item label="字典:">
                <el-input v-model="form.formDict" label="form.formDict" style="width:30%"></el-input>
              </el-form-item>
              <el-form-item label="项目选项:">
                <template>
                  <el-button @click="addRow">新增选项</el-button>
                  <el-table
                    :data="DictTable"
                    border
                    size="mini"
                    stripe
                    style="width:70%;margin-top:12px;"
                    :header-cell-style="{background:'#F0F5F7', color:'#333333'}"
                    :cell-style="{padding:'3px 2px'}"
                  >
                    <el-table-column label="选项名称" prop="itemName" align="left" width="140px">
                      <template slot-scope="scope">
                        <el-form-item prop="itemName" class="table-form-item">
                          <el-input v-show="true" v-model="scope.row.itemName" />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column label="选项编码" prop="itemCode" align="left" min-width="100px">
                      <template slot-scope="scope">
                        <el-form-item prop="itemCode" class="table-form-item">
                          <el-input v-show="true" v-model="scope.row.itemCode" />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column label="排序" prop="indexNo" align="left" width="80px">
                      <template slot-scope="scope">
                        <el-form-item :prop="scope.$index + '.indexNo'" class="table-form-item">
                          <el-input v-show="true" v-model="scope.row.indexNo" />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column label="扩展字段1" prop="expand1" align="left" min-width="100px">
                      <template slot-scope="scope">
                        <el-form-item prop="expand1" class="table-form-item">
                          <el-input v-show="true" v-model="scope.row.expand1" />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column label="扩展字段2" prop="expand2" align="left" min-width="100px">
                      <template slot-scope="scope">
                        <el-form-item prop="expand2" class="table-form-item">
                          <el-input v-show="true" v-model="scope.row.expand2" />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" align="left" width="80px">
                      <template slot-scope="scope">
                        <el-button prop type="text" @click="deleteRow(scope.$index)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-form-item>
              <el-form-item>
                <template>
                  <el-button class="add-botton" @click="onSave">保存</el-button>
                  <el-button>取消</el-button>
                </template>
              </el-form-item>
            </el-form>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAllDictCd, saveDictCd } from '@/api/user'

export default {
  name: 'PdaForm',
  data() {
    return {
      defaultProps: {
        label:'label',
        children: 'children'
      },
      labelPosition: 'right',
      form: {
        formName: '',
        formDict: '',
        dictCode: ''
      },
      seen: false,
      filterText: '',
      listLoading: true,
      list: null,
      DictTable: [],
      conheight: {
        height: ''
      },
      formLabelAlign: {
        name: '',
        type: '',
        rulesDef: '',
        remarks: ''
      },
      rules: {
        indexNo: { type: "number", required: true, message: "必填字段", trigger: "change" }
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
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
      this.conheight.height = window.innerHeight - 185 + 'px'
    },
    //树节点搜索过滤
    filterNode(value, data) {
      console.log('value',value,"data",data)
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 获取树列表的数据
    getTreeData() {
      getAllDictCd().then(res => {
        if(res.data.list.length>0){
          res.data.list.map((item,index)=>{
            item.id=item.groupCode
            item.label=item.groupName
            item.children=[]
            if(item.dictCodes.length>0){
              item.dictCodes.map((i,k)=>{
               item.children.push({
                 id:i.code,
                 label:i.name
               })
              })
            }
          })
          this.list=res.data.list
        }
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    onSave() {
      const data = {
        dictCode: this.form.dictCode,
        list: this.DictTable
      }
      saveDictCd(data).then(res => {
        this.DictTable = res.data
        this.$message.success('保存成功')
      })
    },
    // 点击节点的回调事件
    getNode(data, node, obj) {
      if (node.isLeaf) {
        this.seen = true
        this.form.formName = node.parent.data.label
        this.form.formDict = data.label
        this.form.dictCode = data.code
      } else {
        this.form.formName = data.label
      }
    },
    // 新增选项
    addRow() {
      this.DictTable.push({
        itemName: '',
        itemCode: '',
        indexNo: '',
        expand1: '',
        expand2: ''
      });
    },
    // 删除
    deleteRow(index) {
      if (index !== -1) {
        this.DictTable.splice(index, 1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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
  .right-container {
    flex: 5;
    border-radius: 3px;
    border: 1px solid rgba(211, 219, 222, 1);
    border-width: 1px 1px 1px 0px;
  }
}
</style>
