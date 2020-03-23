<template>
  <div class="container">
    <div class="top-container">
      <div class="content-title">添加质控评价项目</div>
      <hr>
    </div>
    <div class="bottom-container">
      <div class="scoll" :style="conheight">
        <el-scrollbar style="height:100%">
          <el-form
            ref="QcForm"
            :label-position="labelPosition"
            :model="QcForm"
            :rules="rules"
            label-width="190px"
            class="top-form"
          >
            <el-form-item label="项目编号:" prop="qcItemCode">
              <el-input v-model="QcForm.qcItemCode" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="项目名称:" prop="qcItemName">
              <el-input v-model="QcForm.qcItemName" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="项目好的描述:" style="width:60%">
              <el-input v-model="QcForm.qcItemGoodDesc" type="textarea" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="项目坏的描述:" style="width:60%">
              <el-input v-model="QcForm.qcItemBadDesc" type="textarea" placeholder="请输入" />
            </el-form-item>
             <el-form-item label="项目改进描述:" style="width:60%">
              <el-input v-model="QcForm.qcItemImproveDesc" type="textarea" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="项目类别：" >
              <el-select v-model="QcForm.qcItemType" clearable filterable placeholder="请选择" style="width: 168px">
                    <el-option v-for="o in itemsTypeOptions" :key="o.qcItemType" :title="o.qcItemTypeName + ' ' + o.qcItemType" :label="o.qcItemTypeName + ' ' + o.qcItemType" :value="o.qcItemType"  style="width: 168px">{{ o.qcItemTypeName + ' ' + o.qcItemType }}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button class="add-botton" @click="save('QcForm')">保存</el-button>
              <el-button @click="closeForm('tag')">关闭</el-button>
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import { saveqcItem } from '@/api/addOrSave' // 保存修改接口
import { getqcItemType } from '@/api/user'

const typeOptions = [
  { key: '1', display_name: '护理诊断' },
  { key: '2', display_name: '合作性问题' }
]
const qcLevelOptions = [
  { key: 1, display_name: '一级' },
  { key: 2, display_name: '二级' },
  { key: 3, display_name: '三级' },
]
const TypeKeyValue = typeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
export default {
  name: 'AddProcessNode',
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      value1: '1',
      QcForm: {
        indexNo: '', // 序号
        qcItemName: '',
        qcItemCode:'',
        simpleName:'',
        intro:'',
        groupCode:'',
        publicUse:'',
        writeMoreNurse:'',
        hasArchiveItem:'',
        qcLevel: '',
        qcDeptSource: ''
      },
      list: [],
      items: [],
      typeOptions,
      groupOptions: [],
      qcLevelOptions,
      itemsTypeOptions: [],
      labelPosition: 'right',
      form: {
        code: '',
        name: ''
      },
      seen: false,
      conheight: {
        height: ''
      },
      rules: {
        qcItemName: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ],
        qcItemCode: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ]
      }

    }
  },
  computed: {
    tdHeight() {
      return window.innerHeight - 275
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  // list组价的activated钩子
  activated() {
    // isUseCache为false时才重新刷新获取数据
    // 因为对list使用keep-alive来缓存组件，所以默认是会使用缓存数据的
    if (!this.$route.meta.isUseCache) {
      this.list = [] // 清空原有数据
      this.onLoad() // 这是我们获取数据的函数
    }
  },
  created() {
    this.tableHeight()
    this.getOptionsData()
    this.QcForm.type = this.typeOptions[0]
  },
  methods: {
    tableHeight() {
      this.conheight.height = window.innerHeight - 190 + 'px'
    },
    // 获取质控列表
    getOptionsData() {
      getqcItemType().then(res => {
        this.itemsTypeOptions = res.data
        console.log('itemsTypeOptions', this.itemsTypeOptions)
      })
    },
    // 保存
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveqcItem(this.QcForm).then(response => {
            JSON.stringify(this.QcForm)
            this.QcForm = response.data
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.closeForm()
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
    closeForm(tag) {
      this.QcForm = {brand_right:0}
      this.$store.state.tagsView.visitedViews.splice(this.$store.state.tagsView.visitedViews.findIndex(item => item.path === this.$route.path), 1)
      this.$router.push(this.$store.state.tagsView.visitedViews[this.$store.state.tagsView.visitedViews.length - 1].path)
    }
  }

}
</script>

<style lang="scss" scoped>
/deep/ .el-scrollbar {
  /deep/ .scrollbar-wrapper {
    height: 100%;
  }
}
.bottom-container {
  padding: 12px 0 0 12px;
  .el-input {
    width: 52%;
  }
}
/deep/ .el-form-item{
  margin-bottom: 16px!important;
}
</style>
