<template>
  <el-scrollbar style="height:100%">
    <div class="container">
      <div class="top-container">
        <div class="content-title">添加宣教模板</div>
        <hr>
      </div>
      <div class="bottom-container">
        <div class="scoll" :style="conheight">
            <el-form
              ref="MissionTemplateForm"
              :label-position="labelPosition"
              :model="MissionTemplateForm"
              :rules="rules"
              label-width="90px"
              class="top-form"
            >
              <el-form-item label="宣教标题:" prop="title">
                <el-input v-model="MissionTemplateForm.title" placeholder="请输入" />
              </el-form-item>
              <el-form-item label="护理单元:">
                <el-select v-model="MissionTemplateForm.deptCode" clearable filterable placeholder="请选择...">
                  <el-option
                    v-for="dept in DeptOptions"
                    :key="dept.code"
                    :value="dept.code"
                    :label="dept.name"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="类别:" prop="type">
                <el-select v-model="MissionTemplateForm.type" placeholder="请选择...">
                  <el-option v-for="type in TypeOptions" :key="type" :value="type" />
                </el-select>
              </el-form-item>
              <el-form-item label="状态:">
                <el-select v-model="MissionTemplateForm.state" placeholder="请选择...">
                  <el-option
                    v-for="state in StatusOptions"
                    :key="state.key"
                    :value="state.key"
                    :label="state.display_name"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="宣教内容:">
                <tinymce v-model="MissionTemplateForm.content" :height="300" :width="600" />
              </el-form-item>
              <el-form-item class="bottom-btn">
                <el-button type="primary" @click="save('MissionTemplateForm')">保存</el-button>
                <el-button @click="closeForm(tag)">关闭</el-button>
              </el-form-item>
            </el-form>
        </div>
      </div>
    </div>  
  </el-scrollbar>
</template>

<script>
import { getDictInfo } from '@/api/user'// 护理等级获取护理单元字典列表
import { saveMissionTemplate } from '@/api/addOrSave' // 保存修改接口
import Tinymce from '@/_components/Tinymce'
// 状态选择
const StatusOptions = [
  { key: '0', display_name: '启用' },
  { key: '1', display_name: '禁用' }
]
const StatusKeyValue = StatusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'TinymceDemo',
  components: { Tinymce },
  filters: {
    statusFilter(status) {
      return StatusKeyValue[status]
    }
  },
  data() {
    return {
      MissionTemplateForm: {
        deptCode: '',
        title: '',
        type: '',
        state: '',
        content: ''
      },
      list: [],
      items: [],
      conheight: {
        height: ''
      },
      DeptOptions: [],
      TypeOptions: ['入院宣教', '导管宣教', '饮食宣教', '疾病宣教', '药物宣教', '护理常识', '出院宣教', '疼痛宣教', '安全宣教', '中医知识'],
      StatusOptions,
      labelPosition: 'right',
      rules: {
        title: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '必填字段', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.onLoad()
    this.tableHeight()
    this.MissionTemplateForm.state = this.StatusOptions[0].display_name
  },
  methods: {
    onLoad() {
      this.getOptionsData()
    },
    tableHeight() {
      this.conheight.height = window.innerHeight - 150 + 'px'
    },
    getOptionsData() {
      getDictInfo().then(res => {
        this.DeptOptions = res.data.list
        console.log('dsfawefas', this.DeptOptions)
      })
    },
    // 保存
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveMissionTemplate(this.MissionTemplateForm).then(response => {
            this.MissionTemplateForm = response.data
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.closeForm()
          })
        } else {
          this.$message({
            type: 'error',
            message: '提交数据不完整，请改正后再提交！'
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
.bottom-container {
  padding: 12px 0 0 62px;
  .el-input {
    width: 52%;
  }
}
</style>

