<template>
  <el-scrollbar :style="conheight">
    <div class="container">
      <div class="top-container">
        <div class="content-title">修改模版管理</div>
        <hr />
      </div>
      <div class="bottom-container">
        <div class="scoll">
          <el-form
            ref="TemplateForm"
            :label-position="labelPosition"
            :model="TemplateForm"
            :rules="rules"
            label-width="190px"
            class="top-form"
          >
            <el-form-item label="模板编号:" prop="qcCode">
              <el-input v-model="TemplateForm.qcCode" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="模板名称:" prop="qcName">
              <el-input v-model="TemplateForm.qcName" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="模版简称:">
              <el-input v-model="TemplateForm.simpleName" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="说明:" style="width:60%">
              <el-input v-model="TemplateForm.intro" type="textarea" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="质控表所属的组:">
              <el-select v-model="TemplateForm.groupCode" clearable filterable placeholder="请选择">
                <el-option
                  v-for="o in groupOptions"
                  :key="o.code"
                  :label="o.name + ' ' + o.code"
                  :value="o.code"
                >{{ o.name + ' ' + o.code }}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否公共:">
              <el-switch
                v-model="TemplateForm.publicUse"
                active-text="是"
                inactive-color="#BFBFBF"
                inactive-text="否"
              />
            </el-form-item>
            <el-form-item label="是否评价表可以填写多个护士:">
              <el-switch
                v-model="TemplateForm.writeMoreNurse"
                active-text="是"
                inactive-color="#BFBFBF"
                inactive-text="否"
              />
            </el-form-item>
            <el-form-item label="是否与归档选项:">
              <el-switch
                v-model="TemplateForm.hasArchiveItem"
                active-text="是"
                inactive-color="#BFBFBF"
                inactive-text="否"
              />
            </el-form-item>
            <el-form-item label="质控级别:">
              <el-select
                v-model="TemplateForm.qcLevel"
                placeholder="全部"
                clearable
                class="filter-item"
              >
                <el-option
                  v-for="item in qcLevelOptions"
                  :key="item.key"
                  :label="item.display_name"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="质控科室列表来源:" style="width:60%">
              <el-input v-model="TemplateForm.qcDeptSource" type="textarea" placeholder="请输入" />
            </el-form-item>
            <el-form-item>
              <el-button class="add-botton" @click="save('TemplateForm')">保存</el-button>
              <el-button @click="closeForm('tag')">关闭</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
import { saveqcTemplate } from '@/api/addOrSave' // 保存修改接口
import { getTemplateMg, getQcTemplateGroup } from '@/api/user'


const qcLevelOptions = [
  { key: "1", display_name: '一级' },
  { key: "2", display_name: '二级' },
  { key: "3", display_name: '三级' },
]
const qcLevelKeyValue = qcLevelOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})


export default {
  name: 'AddProcessNode',
  filters: {
    qcLevelFilter(qcLevel) {
      return qcLevelKeyValue[qcLevel]
    },
    // CodeFilter(code) {
    //   return CodeKeyValue[code]
    // }
  },
  data() {
    return {
      TemplateForm: {
        indexNo: this.$route.query.indexNo, // 序号
        qcName: this.$route.query.qcName,
        qcCode: this.$route.query.qcCode,
        simpleName: this.$route.query.simpleName,
        intro: this.$route.query.intro,
        groupCode: this.$route.query.groupCode,
        publicUse: this.$route.query.publicUse,
        writeMoreNurse: this.$route.query.writeMoreNurse,
        hasArchiveItem: this.$route.query.hasArchiveItem,
        qcLevel: this.$route.query.qcLevel,
        qcDeptSource: this.$route.query.qcDeptSource
      },
      list: [],
      groupOptions: [],
      qcLevelOptions,
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
        qcName: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ],
        qcCode: [
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
    // this.TemplateForm.type = this.typeOptions[0]
  },
  methods: {
    tableHeight() {
      this.conheight.height = window.innerHeight - 100 + 'px'
    },
    // 获取质控列表
    getOptionsData() {
      getQcTemplateGroup().then(res => {
        this.groupOptions = res.data
        console.log('groupOptions', this.groupOptions)
      })
    },
    // 保存
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveqcTemplate(this.TemplateForm).then(response => {
            JSON.stringify(this.TemplateForm)
            this.TemplateForm = response.data
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
      this.TemplateForm = { brand_right: 0 }
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
/deep/ .el-form-item {
  margin-bottom: 16px !important;
}
</style>
