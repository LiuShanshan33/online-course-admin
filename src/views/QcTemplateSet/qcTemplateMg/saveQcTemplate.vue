<template>
  <div class="container">
    <div class="top-container">
      <div class="content-title">添加质控模板</div>
      <hr>
    </div>
    <div class="bottom-container">
      <div class="scoll" :style="conheight">
        <el-scrollbar style="height:100%">
          <el-form
            ref="qcTemplateForm"
            :label-position="labelPosition"
            :model="qcTemplateData"
            label-width="80px"
            class="top-form"
          >
            <el-form-item label="模板编号:">
              <el-input v-model="qcTemplateData.qcCode" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="模板名称:">
              <el-input v-model="qcTemplateData.qcName" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="模板简称:">
              <el-input v-model="qcTemplateData.simpleName" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="说明:">
              <el-input v-model="qcTemplateData.intro" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="质控表所属的组:">
              <el-input v-model="qcTemplateData.groupCode" type="textarea" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="是否公共:">
              <el-select v-model="qcTemplateData.publicUse" placeholder="请选择...">
                <el-option v-for="types in typeOptions" :key="types" :value="types" />
              </el-select>
            </el-form-item>
            <el-form-item label="序号:">
              <el-input v-model="qcTemplateData.indexNo" type="textarea" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="质控级别:">
              <el-select v-model="qcTemplateData.qcLevel" placeholder="请选择...">
                <el-option v-for="types in typeOptions" :key="types" :value="types" />
              </el-select>
            </el-form-item>
            <el-form-item class="bottom-btn">
              <el-button type="primary" @click="submitForm('DiagnoseForm')">保存</el-button>
              <el-button @click="closeForm(tag)">关闭</el-button>
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import { getTemplateInfo, saveQcTemplate } from '@/api/qcTemplate'
import QcTemplateMg from '../qcTemplateMg/qcTemplateMg'
export default {
  name: 'SaveQcTemplate',
  components: { QcTemplateMg },
  data() {
    return {
      formData: {
        qcCode: this.$route.query.qcCode
      },
      qcTemplateData: '',
      ableCheck: false
    }
  },
  created() {
    this.getList()
  },
  mounted() {
  },
  methods: {
    getList() {
      getTemplateInfo(this.formData.qcCode).then(response => {
        this.qcTemplateData = response.data
      })
    },
    submitForm(formName) {
      this.$refs.reEvalForm.validateField('matchExp')
      /* console.log(this.reEvalData.reEvalList)
          this.$refs[formName].validate((valid) => {
            if (valid) {
              alert('submit!');
            } else {
              console.log('error submit!!');
              return false;
            }
          });*/
    },
    closeForm() {

    },
    change(e) {
      this.$forceUpdate()
    }
  }
}
</script>

<style scoped>

</style>
