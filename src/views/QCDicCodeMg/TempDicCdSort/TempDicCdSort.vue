<template>
  <div class="container">
    <div class="top-container">
      <div class="content-title">模板字典编码排序</div>
      <hr />
    </div>
    <div class="bottom-container">
      <div class="down-tree" :style="conheight" style="width: 20%">
        <!-- tree -->
        <el-scrollbar style="height: 100%">
          <el-input clearable placeholder="请输入关键字搜索" v-model="filterText"></el-input>
          <el-tree
            v-loading="listLoading"
            :data="list"
            :props="defaultProps"
            default-expand-all
            :filter-node-method="filterNode"
            @node-click="getNode"
            ref="tree"
          >
            <span slot-scope="{ node, data }" class="span-ellipsis">
              <span :title="data.label">{{ node.label }}</span>
            </span>
          </el-tree>
        </el-scrollbar>
      </div>
      <div v-if="seen" class="right-container">
        <div class="scoll" :style="conheight">
          <el-scrollbar style="height:100%">
            <div class="top-container" style="margin-left:0px">
              <div class="content-title" style="width:fit-content">{{ this.form.name }}</div>
              <hr />
            </div>
            <el-form
              ref="DictForm"
              :label-position="labelPosition"
              label-width="90px"
              :rules="rules"
              :model="DictForm"
              class="tabs-form"
            >
              <el-form-item label="字典:" prop="dictCode">
                <el-select
                  v-model="DictForm.dictCode"
                  @change="DictChange($event)"
                  placeholder="请选择..."
                >
                  <el-option
                    v-for="o in DictList"
                    :key="o.code"
                    :value="o.code"
                    :label="o.name"
                    :title="o.name"
                    style="width: 168px"
                  />
                </el-select>
              </el-form-item>
              <div v-if="selectDict">
                <el-form-item label="项目选项:">
                  <template>
                    <el-button @click="AddItems('DictForm')">新增选项</el-button>
                    <el-table
                      :data="DictForm.list"
                      border
                      size="mini"
                      stripe
                      style="width:50%;margin-top:12px;"
                      :header-cell-style="{background:'#F0F5F7', color:'#333333'}"
                      :cell-style="{padding:'3px 2px'}"
                    >
                      <el-table-column label="选项" prop="itemCode" align="left" width="140px">
                        <template slot-scope="scope">
                          <el-form-item
                            :prop="'list.' + scope.$index + '.itemCode'"
                            :rules="rules.itemCode"
                            style="margin-bottom:0px!important"
                          >
                            <el-input v-model="scope.row.itemCode" />
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column label="扩展名称" prop="expand" align="left" width="140px">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.expand"></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column label="排序" prop="indexNo" align="left " width="100px">
                        <template slot-scope="scope">
                          <el-form-item
                            :prop="'list.' + scope.$index + '.indexNo'"
                            :rules="rules.indexNo"
                            style="margin-bottom:0px!important"
                          >
                            <el-input v-model="scope.row.indexNo" />
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" align="center" min-width="80px">
                        <template slot-scope="scope">
                          <el-button type="text" @click.native.prevent="deleteRow(scope.$index)">删除</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                </el-form-item>
                <el-form-item>
                  <template>
                    <el-button class="add-botton" @click="save('DictForm')">保存</el-button>
                    <el-button>取消</el-button>
                  </template>
                </el-form-item>
              </div>
            </el-form>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import {getqcTemplate,getDictSort,  getAllDictCd } from '@/api/user'
import { saveOrUpdateDictSort } from '@/api/addOrSave'
import data from '../../pdf/content';

export default {
  name: 'MEWSRule',
  data() {
    let validateName = (rule, value, callback) => {
      let count = 0
      this.DictForm.list.forEach(item => {
        if (value === item.itemName) {
          count++
        }
        if (count > 1) {
          callback(new Error(' '))
        }
      })
      callback()
    }
    return {
      filterText: '',
      tablekey: 0,
      list: null,
      itemsdelete: true,
      listLoading: true,
      dictItems: {},
      selectDict: false,
      defaultProps: {
        // children: 'children',
        label: 'qcName'
      },
      ItemList: null,
      DictList: [],
      DictOptions: [],
      labelPosition: 'right',
      itemsOptions: [],
      form: {
        code: '',
        name: ''
      },
      conheight: {
        height: ''
      },
      seen: false,
      DictForm: {
        dictCode: '',
        templateCode:'',
        list: [{}],
      },
      rules: {
        dictCode: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ],
        indexNo: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ],
        itemName: [
          { required: true, message: '必填字段', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.onLoad()
    this.tableHeight()
  },
  methods: {
    onLoad() {
      this.getTreeData()
      this.getOptions()
    },
    tableHeight() {
      this.conheight.height = window.innerHeight - 180 + 'px'
    },
    getTreeData() {
      getqcTemplate().then(res => {
        this.list = res.data
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    // tree 过滤器
    filterNode(value, data) {
      if (!value) return true;
      return data.qcName.indexOf(value) !== -1;
    },
    // 获取字典列表
    getOptions() {
      getAllDictCd().then(response => {
        // this.DictList = response.data.list
        response.data.list.forEach((item1) => {
          item1.dictCodes.forEach((item2) => {
            this.DictList.push(item2)
            // console.log('项目列表', this.DictList)
          })
        })
      })
    },
    // 清除整个表单的验证
    clearValidate(formName) {
      this.$refs[formName].clearValidate()
    },
    // 重置表单验证
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
     // 点击节点的回调事件
    getNode(data, node, obj) {
      this.seen = true
      this.DictForm.templateCode = data.qcCode
      this.form.code = data.qcCode
      this.form.name = data.qcName
      if (this.DictForm.dictCode){
        getDictSort(this.DictForm.dictCode,this.form.code).then(res => {
        this.DictForm.list = res.data.list
        })
        // this.DictChange()
      }
    },
    // 选择字典
    DictChange(event) {
      this.DictForm.dictCode = event
      this.selectDict = true
      console.log('选择的字典', this.DictForm.dictCode)
      console.log('选择的模块', this.form.code)
      getDictSort( event,this.form.code).then(res => {
        this.DictForm.list = res.data.list
        console.log('传回的项目列表', this.DictForm)
      })
    },
    // 增加一行
    AddItems(formName) {
      if (this.DictForm.dictCode !== '') {
        this.DictForm.list.push({
          itemCode: '',
          indexNo: this.DictForm.list.length + 1,
          expand: ''
        });
      }
      else {
        this.$message({
          type: 'error',
          message: '请先选择字典'
        })
      }
    },
    // 删除
    deleteRow(index, rows) {
      this.DictForm.list.splice(index, 1)
      console.log('删除后的list', this.DictForm.list)
    },
    // 保存
    save(formName) {
      console.log('保存的表格', this.DictForm.list)
      this.$refs[formName].validate((valid) => {
        // console.log('验证消息1', valid)
        if (valid) {
          saveOrUpdateDictSort(this.DictForm).then(response => {
            // this.DictForm.list = response.data
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            console.log('保存以后', response.data)
          }).then(() => {
            this.clearValidate('DictForm')
          })
        } else {
          this.$message({
            type: 'error',
            message: '提交数据不完整或有重复数据，请改正后再提交!'
          })
          return false
        }
      })
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
    height: 100%;
    background: rgba(245, 248, 250, 1);
    border-radius: 3px;
    border: 1px solid rgba(211, 219, 222, 1);
    margin-left: 12px;
    padding: 10px;
    /deep/.el-scrollbar {
      // height: 658px;
      /deep/.el-scrollbar__wrap {
        overflow-x: hidden;
      }
    }
    /deep/.el-tree {
      background: rgba(245, 248, 250, 1);
    }
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
    padding-left: 20px;
  }
}
</style>
