// 添加护理诊断
<template>
  <el-scrollbar style="height:100%">
    <div class="container">
      <div class="top-container">
        <div class="content-title">修改护理诊断</div>
        <hr>
      </div>
      <div class="bottom-container">
        <div class="scoll" :style="conheight">
            <el-form
              ref="DiagnoseForm"
              :label-position="labelPosition"
              :rules="rules"
              :model="DiagnoseForm"
              label-width="90px"
              class="top-form"
            >
              <el-form-item label="诊断编码:" prop="code">
                <el-input v-model="DiagnoseForm.code" placeholder="请输入" />
              </el-form-item>
              <el-form-item label="诊断名字:" prop="name">
                <el-input v-model="DiagnoseForm.name" placeholder="请输入" />
              </el-form-item>
              <el-tabs type="border-card">
                <el-tab-pane label="定义">
                  <el-form
                    :label-position="labelPosition"
                    label-width="100px"
                    :model="DiagnoseForm"
                    class="tabs-form"
                  >
                    <el-form-item label="诊断名字英文:">
                      <el-input v-model="DiagnoseForm.nameEn" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="诊断类型:">
                      <el-select v-model="DiagnoseForm.type" placeholder="请选择...">
                        <el-option v-for="types in typeOptions" :key="types.key" :value="types.key" :label="types.display_name" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="定义:">
                      <el-input v-model="DiagnoseForm.definition" type="textarea" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="备注:">
                      <el-input v-model="DiagnoseForm.remark" type="textarea" placeholder="请输入" />
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
                <el-tab-pane label="诊断依据">诊断依据</el-tab-pane>
                <el-tab-pane label="相关因素">相关因素</el-tab-pane>
                <el-tab-pane label="护理目标">护理目标</el-tab-pane>
                <el-tab-pane label="护理措施">护理措施</el-tab-pane>
              </el-tabs>
              <el-form-item class="bottom-btn">
                <el-button class="add-botton" @click="save('DiagnoseForm')">保存</el-button>
                <el-button @click="closeForm(tag)">关闭</el-button>
              </el-form-item>
            </el-form>
          </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
import { saveDiagnose } from '@/api/addOrSave' // 保存修改接口

const typeOptions = [
  { key: '1', display_name: '护理诊断' },
  { key: '2', display_name: '合作性问题' }
]
const TypeKeyValue = typeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
export default {
  name: 'UpdateDiagnose',
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      DiagnoseForm: {
        id: this.$route.query.id,
        code: this.$route.query.code,
        name: this.$route.query.name,
        nameEn: this.$route.query.nameEn,
        type: this.$route.query.type,
        definition: this.$route.query.definition,
        wardCode: '',
        remark: this.$route.query.remark,
        basis: '',
        element: '',
        target: '',
        measure: ''
      },
      list: [],
      items: [],
      typeOptions,
      labelPosition: 'right',
      seen: false,
      conheight: {
        height: ''
      },
      rules: {
        name: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ]
      }

    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  created() {
    this.tableHeight()
  },
  methods: {
    tableHeight() {
      this.conheight.height = window.innerHeight - 135 + 'px'
    },
    // 保存
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveDiagnose(this.DiagnoseForm).then(response => {
            this.DiagnoseForm = response.data
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
  padding: 12px 0 0 62px;
  // margin-right: 30px;
  .el-input {
    width: 52%;
  }
}
</style>
