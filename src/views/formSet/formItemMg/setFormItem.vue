<template>
  <div class="container">
    <el-tabs type="border-card" style="margin-left:0; width: auto; height: auto">
      <el-tab-pane label="基本设置">
        <el-form ref="itemForm" :model="itemData" label-width="100px" size="small" :rules="itemRules">
          <el-form-item label="表单项目编号:" prop="itemCode" label-width="150px">
            <el-input :disabled="show" v-model="itemData.itemCode"/>
          </el-form-item>
          <el-form-item label="表单项目名称:" prop="itemName" label-width="150px">
            <el-input v-model="itemData.itemName" />
          </el-form-item>
          <el-form-item label="表单项目类型:" prop="itemType" label-width="150px">
            <el-select v-model="itemData.itemType">
              <el-option
                v-for="item in TypeOptions"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="别名:" label-width="150px">
            <el-input v-model="itemData.units" />
          </el-form-item>
        </el-form>
        <el-button type="primary" style="margin-left:140px" @click="saveItemForm('itemForm')">保存</el-button>
        <el-button @click="closeForm(tag)">关闭</el-button>
      </el-tab-pane>
      <el-tab-pane v-if="show" label="项目内容配置">
        <div class="scoll">
          <el-scrollbar style="height:100%">
            <el-form ref="itemValueForm" :model="itemValueData" label-width="128px" class="top-form" >
              <el-form-item label="项目名称:">
                <span>{{itemValueData.itemName}}</span>
              </el-form-item>
              <el-form-item label="项目值数据:">
                <el-button style="width:55px" @click="addRow">
                  <i class="el-icon-plus">添加</i>
                </el-button>
              </el-form-item>
              <el-form-item>
                <el-table :data="itemValueData.valueDictList" size="mini" :height="tableHeight"
                  border fit stripe highlight-current-row style="width: 70%;"
                  :header-cell-style="{background:'#F0F5F7', color:'#333333'}"
                  :cell-style="{padding:'3px 2px'}">
                  <el-table-column label="序号" type="index" align="left" width="80px" />
                  <el-table-column label="项目值代码" width="auto" style="{margin-left: 0;}">
                    <template slot-scope="scope">
                      <el-form-item :prop="'valueDictList.' + scope.$index + '.valueCode'" :rules="rules.valueCode">
                        <el-input v-show="true" v-model="scope.row.valueCode"  validate-event="true" />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="项目值名称" width="auto">
                    <template slot-scope="scope">
                      <el-form-item :prop="'valueDictList.' + scope.$index + '.valueName'" :rules="rules.valueName">
                        <el-input v-show="true" v-model="scope.row.valueName" />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="程度水平" width="120">
                    <template slot-scope="scope">
                      <el-form-item :prop="'valueDictList.' + scope.$index + '.valueLevel'" :rules="rules.valueLevel">
                        <el-input v-show="true" v-model="scope.row.valueLevel"/>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                      <el-form-item inline-message="true">
                        <el-button type="text" size="mini" @click="removeRow(scope.$index)">删除</el-button>
                      </el-form-item>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
              <el-form-item class="bottom-btn">
                <div style="margin-top:20px">
                  <el-button class="add-botton" @click="saveValueForm('itemValueForm')">保存</el-button>
                  <el-button @click="closeForm('tag')">关闭</el-button>
                </div>
              </el-form-item>
            </el-form>
          </el-scrollbar>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { TypeOptions, getItemValueList, saveOrUpdateItem, getItem, saveItemValue } from '@/api/form'
export default {
  name: 'SetReEval',
  data() {
    return {
      itemData: {},
      show: this.$route.query.show,
      itemValueData: {
        itemCode: this.$route.query.itemCode,
        itemName:'',
        valueDictList: []
      },
      TypeOptions,
      rules: {
        valueCode: { type: 'string', required: true, message: '必填字段', trigger: 'change' },
        valueName: { type: 'string', required: true, message: '必填字段', trigger: 'change' },
        valueLevel: { required: true, message: '必填字段', trigger: 'change' }
      },
      itemRules: {
        itemCode: { type: 'string', required: true, message: '必填字段', trigger: 'change' },
        itemName: { type: 'string', required: true, message: '必填字段', trigger: 'change' },
        itemType: { type: 'string', required: true, message: '必填字段', trigger: 'change' }
      }
    }
  },
  computed: {
    tableHeight() {
      return window.innerHeight - 370
    }
  },
  created() {
    this.getList()
  },
  mounted() {
  },
  methods: {
    getList() {
      if (this.show){
        getItemValueList(this.itemValueData.itemCode).then(response => {
          this.itemValueData.valueDictList = response.data
        })
        getItem(this.itemValueData.itemCode).then(response => {
          this.itemData = response.data
          this.itemValueData.itemName = response.data.itemName
        })
      }
    },
    addRow() {
      this.itemValueData.valueDictList.push({
        valueCode: '',
        valueName: '',
        valueLevel: ''
      })
    },
    removeRow(index) {
      if (index !== -1) {
        this.itemValueData.valueDictList.splice(index, 1)
      }
    },
    saveItemForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('确定保存表单项目?', '保存提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            saveOrUpdateItem(this.itemData).then(response => {
              if (response.code == 200) {
                this.$message({
                  type: 'success',
                  message: '保存成功!'
                })
                this.closeForm()
              }
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
            message: '提交数据不完整，请改正后再提交!'
          })
          return false
        }
      })
    },
    saveValueForm(formName) {
      console.log("保存项目值", this.itemValueData)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('确定保存表单项目?', '保存提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            saveItemValue(this.itemValueData).then(response => {
              if (response.code == 200) {
                this.$message({
                  type: 'success',
                  message: '保存成功!'
                })
                this.closeForm()
              }
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
            message: '提交数据不完整，请改正后再提交!'
          })
          return false
        }
      })
    },
    change(e) {
      this.$forceUpdate()
    },
    closeForm(tag) {
      this.$store.state.tagsView.visitedViews.splice(this.$store.state.tagsView.visitedViews.findIndex(item => item.path === this.$route.path), 1)
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="css" scoped>
  .table-form-item {
    margin-left: -50px;
  }
</style>
