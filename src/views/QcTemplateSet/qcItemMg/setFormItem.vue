<template>
  <div class="container">
    <el-tabs type="border-card" style="margin-left:0; width: auto; height: auto">
      <el-tab-pane label="基本设置">
        <el-form ref="itemData" :model="itemData" label-width="100px" size="small">
          <el-form-item label="表单项目编号:" label-width="150px">
            <el-input v-model="itemData.itemCode" />
          </el-form-item>
          <el-form-item label="表单项目名称:" label-width="150px">
            <el-input v-model="itemData.itemName" />
          </el-form-item>
          <el-form-item label="表单项目类型:" label-width="150px">
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
        <el-button type="primary" style="margin-left:140px" @click="submitForm">保存</el-button>
      </el-tab-pane>
      <el-tab-pane label="项目内容配置">
        <el-form ref="itemValueData" :model="itemValueData" label-width="100px" class="demo-dynamic" :rules="rules">
          <el-table
            :data="itemValueData"
            border
            :cell-style="{padding:'3px 2px'}"
            style="margin-top:10px; padding-bottom:10px; width: 100%"
            @row-click="checkViews"
          >
            <el-table-column prop="valueCode" label="项目值代码" width="auto" show-overflow-tooltip style="{margin-left: 0;}">
              <template slot-scope="scope">
                <el-form-item prop="valueCode" class="table-form-item">
                  <el-input v-show="true" v-model="scope.row.valueCode" validate-event="true" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="valueName" label="项目值名称" width="auto" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-form-item prop="valueName" class="table-form-item">
                  <el-input v-show="true" v-model="scope.row.valueName" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="valueLevel" label="程度水平" width="120">
              <template slot-scope="scope">
                <el-form-item inline-message="true" class="table-form-item">
                  <el-input v-show="true" v-model="scope.row.valueLevel" class="table-form-item" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="" label="操作" width="100" class="table-form-item">
              <template slot-scope="scope">
                <el-form-item inline-message="true" class="table-form-item">
                  <el-button class="table-form-item" @click="removeRow(scope.$index)">删除</el-button>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
          <el-form-item>
            <el-button type="primary" @click="addRow">添加</el-button>
            <el-button type="primary" @click="submitForm('reEvalData')">保存</el-button>
            <el-button type="primary" @click="resetForm('reEvalData')">删除</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getItemValueList } from '@/api/form'
const TypeOptions = [
  { key: 'I', value: '评估项目' },
  { key: 'M', value: '措施项目' },
  { key: 'C', value: '公共项目' },
  { key: 'K', value: '扩展字段' },
  { key: 'S', value: '存放分数' },
  { key: 'E', value: '其他评估单ID项目' }
]
export default {
  name: 'SetReEval',
  data() {
    return {
      rules: {
        valueCode: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      itemData: {
        itemCode: this.$route.query.itemCode,
        itemName: this.$route.query.itemName,
        itemType: this.$route.query.itemType,
        units: this.$route.query.units
      },
      itemValueData: '',
      TypeOptions
    }
  },
  created() {
    console.log(this.itemData)
    this.getList()
  },
  mounted() {
  },
  methods: {
    getList() {
      getItemValueList(this.itemData.itemCode).then(response => {
        console.log(response.data)
        this.itemValueData = response.data
      })
    },
    addRow() {
      this.itemValueData.push({
        valueCode: '',
        valueName: '',
        valueLevel: ''
      })
    },
    removeRow(index) {
      if (index !== -1) {
        this.itemValueData.splice(index, 1)
      }
    },
    submitForm() {
      console.log(this.itemValueData)
    },
    change(e) {
      this.$forceUpdate()
    },
    checkViews(data) {
      this.form = data
    }
  }
}
</script>

<style lang="css" scoped>
  .table-form-item {
    margin-left: -50px;
  }
</style>
