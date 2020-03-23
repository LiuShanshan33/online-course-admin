//质控模板关联项目
<template>
  <div class="container">
    <div class="top-container">
      <div class="content-title">模版关联评价项目</div>
      <hr>
    </div>
    <div class="bottom-container">
      <div class="down-tree" :style="conheight" style="width: 20%">
        <!-- tree -->
        <el-scrollbar style="height: 100%">
          <el-input
            clearable
            placeholder="输入模板名称进行过滤"
            v-model="filterText">
          </el-input>
          <el-tree
            v-loading="listLoading"
            :data="items"
            :props="defaultProps"
            default-expand-all
            :filter-node-method="filterNode"
            @node-click="handleNodeClick"
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
            <div class="content-title" style="width:fit-content">{{ this.form.qcName }}</div>
            <hr>
          </div>
            <div>
              <p style="font-weight:bold;font-size:13px;padding-top:5px">项目选项</p>
            </div>
            <el-form
            ref="dictItems"
            :model="dictItems"
            :rules="rules"
          >
            <el-table
              v-if="create"
              ref="dictItems"
              :key="tablekey"
              v-loading="tableLoading"
              :data="dictItems.list"
              size="mini"
              border
              empty-text=" "
              fit
              highlight-current-row
              stripe
              style="width: 98%;"
              :header-cell-style="{background:'#F0F5F7'}"
              :cell-style="{padding:'3px 2px'}"
            >
            <el-table-column label="项目类型" align="left" width="195px">
                <template slot-scope="scope">
                <el-form-item :prop="'list.' + scope.$index + '.qcItemType'" :rules="rules.qcItemType" style="margin-bottom:0px!important">
                  <el-select v-model="scope.row.qcItemType" @change="TypeChange($event, scope.row)" clearable filterable placeholder="请选择">
                    <el-option v-for="o in itemsTypeOptions" :key="o.qcItemType" :title="o.qcItemTypeName + ' ' + o.qcItemType" :label="o.qcItemTypeName + ' ' + o.qcItemType" :value="o.qcItemType" style="width: 168px">{{ o.qcItemTypeName + ' ' + o.qcItemType }}</el-option>
                  </el-select>
                </el-form-item>
                </template>
            </el-table-column>
            <el-table-column label="项目名称" align="left" width="195px">
                <template slot-scope="scope">
                  <el-form-item :prop="'list.' + scope.$index + '.qcItemCode'" :rules="rules.qcItemCode" style="margin-bottom:0px!important">
                  <el-select v-model="scope.row.qcItemCode" :title="scope.row.qcItemName" clearable filterable placeholder="请选择"  @change="empChange($event, scope.row)" style="width: 168px">
                    <el-option v-for="o in itemsOptions" :key="o.qcItemCode" :value="o.qcItemCode" :label="o.qcItemName" :title="o.qcItemName" style="width: 168px">
                    </el-option>
                  </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="序号" prop="indexNo" align="center" width="50px" />
              <el-table-column label="选项显示编号" prop="itemShowCode" align="left" width="120px">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.itemShowCode"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="选项否时描述语" prop="valueIsNoDesc" align="left" width="120px">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.valueIsNoDesc"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="选项否时措施" prop="valueIsNoMeasure" align="left" width="120px">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.valueIsNoMeasure"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" min-width="80px">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="mini"
                    @click.native.prevent="deleteRow(scope.$index)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            </el-form>
            <div style="margin-top: 10px">
              <el-button
                @click="AddItems"
                class="create-btn"
                style="margin-bottom: 10px;"
              >新增选项</el-button>
              <el-button
                class="create-btn add-botton"
                style="margin-bottom: 10px;"
                type="primary"
                @click="save('dictItems')"
              >保存</el-button>
              <el-button v-if="itemsdelete" class="create-btn" style="margin-bottom: 10px;">取消</el-button>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import { getqcTemplate, getTemplateVsItem, getTempItem, getQCEPM, getqcItemType, getListByType } from '@/api/user'
import { saveTemplateVsItem } from '@/api/addOrSave'

export default {
  name: 'MEWSRule',
  data() {
    let validateItemCode = (rule, value, callback) => {
      let count = 0
    this.dictItems.list.forEach(item =>{
      if(value === item.qcItemCode){
        count ++
      }
      if(count>1){
        callback(new Error(' '))
      }    
    })
      callback()
    }
    return {
      filterText: '',
      tablekey: 0,
      list: null,
      items: null,
      itemsdelete: true,
      listLoading: true,
      tableLoading: true,
      dictItems: {
        qcCode:'',
        list:[{
            qcItemCode: '',
            indexNo: '',
            itemShowCode: '',
            valueIsNoDesc: '',
            valueIsNoMeasure: ''
        }]
      },
      defaultProps: {
        // children: 'children',
        label: 'qcName'
      },
      itemsTypeOptions: [],
      ItemList: null,
      itemsDefault: null,
      labelPosition: 'right',
      itemsOptions: [],
      form: {
        code: '',
        name: ''
      },
      conheight: {
        height: ''
      }, 
      listQuery: {
        page: 1,
        limit: 20,
        pageSize: 20,
        qcItemCode: undefined,
        qcItemName: undefined,
        qcItemType: undefined,
        qcLevel: ''
      },
      seen: false,
      rules: {
        qcItemCode: [
          { required: true, message: '必填字段', trigger: 'blur' },
          { required: true, message: '必填字段', trigger: 'change' },
          { validator: validateItemCode, trigger: 'blur' }
        ],
        qcItemType: [
          { required: true, message: '必填字段', trigger: 'blur' },
          { required: true, message: '必填字段', trigger: 'change' }
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
    // window.addEventListener('resize', this.getHeight)
    this.tableHeight()
    // this.getList()
    // this.getItemsInfo()
  },
  methods: {
    onLoad() {
      this.getTreeData()
      this.getOptionsData()
    },
    tableHeight() {
      this.conheight.height = window.innerHeight - 180 + 'px'
    },
    getTreeData() {
      getqcTemplate().then(res => {
        this.items = res.data
        console.log('tree数据', this.items)
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    filterNode(value, data) {
        if (!value) return true;
        return data.qcName.indexOf(value) !== -1;
    },
    // 联动科室名改变
    TypeChange(event, row) {
      console.log('选择后返回', event)
      console.log('选择那一行', row)
      row.qcItemCode = ''
      this.itemsOptions = []
      if (event !== '') {
        getListByType(event).then(res => {
          this.itemsOptions = res.data
          console.log('传回的数据', this.itemsOptions)
        })
      }
      else {
        return null
      }
    },
    
    // 添加
    AddItems() {
      this.dictItems.qcCode = this.form.qcCode,
      this.dictItems.list.push({ 
        qcItemCode: '',
        indexNo: this.dictItems.list.length + 1,
        itemShowCode: '',
        valueIsNoDesc: '',
        valueIsNoMeasure: '',
        // qcItemName: '',
        qcItemType: ''
        // sort: this.dictItems.length + 1,
      })
      console.log('添加一行后的数据', this.dictItems)
    },
    // 获取质控列表
    getOptionsData() {
      getqcItemType().then(res => {
        this.itemsTypeOptions = res.data
        console.log('itemsTypeOptions', this.itemsTypeOptions)
      })
    },
    // 
    empChange(event, row) {
      console.log('选中的项目编号', event)
      console.log(row)
       if (event !== '') {
        getTempItem(event).then(res => {
          console.log('根据项目编号返回', res.data)
          // row.inpatientArea = res.data.inpatientArea
        })
      }
    },
    // 点击节点
    handleNodeClick(data, node, obj) {
      console.log(data)
      this.seen = true
      this.create = true
      this.form = data
      this.tableLoading = true
        getTemplateVsItem(this.form.qcCode).then(res => {
          console.log('模板编号', this.form.qcCode, res)
          this.dictItems.list = res.data.list
          this.itemsOptions = []
          this.itemsDefault = []
          res.data.list.forEach((item) => {
            this.itemsDefault.push(item)
            this.itemsOptions = this.itemsDefault
            console.log('关联的列表', this.itemsOptions)
          })
          setTimeout(() => {
          this.tableLoading = false
            }, 1 * 1000)
          console.log('能出来么', this.dictItems)
        })
    },
    // 删除该行
    deleteRow(index, rows) { 
      this.dictItems.list.splice(index, 1)
      console.log('删除后的list', this.dictItems.list)
    },
    // 清除整个表单的验证
    clearValidate(formName) {
      this.$refs[formName].clearValidate();
    },
    // 保存
    save(formName) {
      this.dictItems.qcCode = this.form.qcCode,
      console.log('保存的表格', this.dictItems)
            this.$refs[formName].validate((valid) => {
        console.log('验证消息1', valid)
        if (valid) {
           saveTemplateVsItem(this.dictItems).then(response => {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            console.log('保存以后', response.data)
          }).then(() => {
             this.clearValidate('dictItems')
          })
        } else {
          this.$message({
            type: 'error',
            message: '提交数据不完整，请改正后再提交!'
          })
            return false
          }
        })
      }
    }
}
</script>

<style lang="scss" scoped>
.top-container {
  margin: 20px 12px 5px 12px;
  .content-title {
    width: 120px;
    height: 30px;
    font-size: 15px;
    font-family: STSongti-SC-Black, STSongti-SC;
    font-weight: 900;
    color: rgba(51, 51, 51, 1);
    line-height: 25px;
    border-bottom: 3px solid #419793;
  }
  hr {
    width: 100%;
    margin: 0 auto;
    border: 0;
    height: 0;
    border-bottom: 1px solid rgba(203, 203, 203, 1);
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
    padding-left: 30px;
    .top-form {
      margin-top: 20px;
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
        /deep/.el-input--medium .el-input__inner {
          height: 30px !important;
          line-height: 30px !important;
        }
      }
    }
    /deep/.tabs-form {
      .el-form-item {
        width: 540px !important;
        font-family: STSongti-SC-Bold, STSongti-SC;
        font-weight: bold;
        line-height: 17px;
        .el-select .el-input {
          width: 440px;
        }
        /deep/.el-form-item__label {
          color: rgba(51, 51, 51, 1) !important;
          font-size: 12px;
          font-family: STSongti-SC-Bold, STSongti-SC;
        }
        /deep/.el-input--medium .el-input__inner {
          height: 30px !important;
          line-height: 30px !important;
        }
      }
      .el-textarea__inner {
        min-height: 80px !important;
      }
    }
  }
}
</style>
