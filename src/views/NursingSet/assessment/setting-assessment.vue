<template>
  <el-scrollbar style="height:100%">
    <div class="container">
      <div class="scoll" :style="conheight">
        <el-tabs type="border-card" width="100%">
          <el-tab-pane label="评估设置">
            <el-form
              ref="ruleForm"
              :model="ruleForm"
              :rules="rules"
              label-width="100px"
              size="small"
            >
              <div class="scoll" :style="conheight">
                <el-scrollbar style="height:100%">
                  <el-form-item label="表单名称:" prop="name">
                    <el-input v-model="ruleForm.name" />
                  </el-form-item>
                  <el-form-item label="护理单元:">
                    <el-input v-model="ruleForm.deptCode" />
                    <div style="display:inline">
                      <span style="font-size:12px;color:#606266;">全科室共用</span>
                      <el-checkbox
                        v-model="ruleForm.publicUse"
                        style="font-size:20px;margin-left:5px;"
                      />
                      <el-button type="text" @click="select_btn=true">选择科室</el-button>
                      <el-dialog title="选择科室" :visible.sync="select_btn" @click="getdepartInfo">
                        <div class="dialog-container">
                          <div class="dialog-head" style="float:right;font-size:14px;">
                            <el-checkbox>全选/反选</el-checkbox>
                            <el-button>选择带回</el-button>
                          </div>
                          <div class="dialog-form">
                            <el-table ref="multipleTable" :data="list" border height="500px">
                              <el-table-column type="selection" />
                              <el-table-column label="护理单元名称" prop="name" />
                            </el-table>
                          </div>
                        </div>
                      </el-dialog>
                    </div>
                  </el-form-item>
                  <el-form-item label="评估单位:">
                    <el-input v-model="ruleForm.unit" />
                  </el-form-item>
                  <el-form-item label="评估声明:">
                    <el-input v-model="ruleForm.evalState" />
                  </el-form-item>
                  <el-form-item label="列表打印的评估说明:">
                    <el-input v-model="ruleForm.printDesc" />
                  </el-form-item>
                  <el-form-item label="评分曲线x轴:">
                    <el-input v-model="ruleForm.evalCurveX" />
                  </el-form-item>
                  <el-form-item label="评分曲线y轴:">
                    <el-input v-model="ruleForm.evalCurveY" />
                  </el-form-item>
                  <el-form-item label="排序号:">
                    <el-input v-model="ruleForm.seqNo" />
                  </el-form-item>
                  <el-form-item label="表单介绍:">
                    <el-input v-model="ruleForm.intro" />
                  </el-form-item>
                </el-scrollbar>
              </div>
            </el-form>
            <el-button class="add-botton" style="margin-left:140px" @click="savebtn('ruleForm')">保存</el-button>
          </el-tab-pane>
          <el-tab-pane label="诊断设置" />
          <el-tab-pane label="复评设置" />
          <el-tab-pane label="危险等级设置" />
        </el-tabs>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
import { getDictInfo } from '@/api/user'
import { update } from '@/api/user'
export default {
  data() {
    return {
      select_btn: false,
      list: [],
      conheight: {
        height: ''
      },
      ruleForm: {
        id: this.$route.query.id,
        name: this.$route.query.name,
        publicUse: this.$route.query.publicUse,
        deptCode: this.$route.query.deptCode,
        unit: this.$route.query.unit,
        evalState: this.$route.query.evalState,
        executorName: this.$route.query.executorName,
        printDesc: this.$route.query.printDesc,
        evalCurveX: this.$route.query.evalCurveX,
        evalCurveY: this.$route.query.evalCurveY,
        seqNo: this.$route.query.seqNo,
        intro: this.$route.query.intro
      },
      rules: {
        name: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ]
        // date2: [
        //   { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        // ],
        // type: [
        //   { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        // ],
        // resource: [
        //   { required: true, message: '请选择活动资源', trigger: 'change' }
        // ],
        // desc: [
        //   { required: true, message: '请填写活动形式', trigger: 'blur' }
        // ]
      }
    }
  },
  created() {
    this.tableHeight()
  },
  methods: {
    tableHeight() {
      this.conheight.height = window.innerHeight - 90 + 'px'
    },
    getdepartInfo() { // 获取科室信息
      getDictInfo().then(res => {
        this.list = res.data.list
      })
    },
    savebtn(formName) { // 保存
      this.$refs[formName].validate((valid) => {
        if (valid) {
          update(this.ruleForm).then(response => {
            this.ruleForm = response.data
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.closeForm()
          })
        } else {
          this.$message({
            type: 'error',
            message: '提交数据不完整，1个字段有错误，请改正后再提交!'
          })
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 关闭页面
    closeForm(tag) {
      this.$store.state.tagsView.visitedViews.splice(this.$store.state.tagsView.visitedViews.findIndex(item => item.path === this.$route.path), 1)
      this.$router.push(this.$store.state.tagsView.visitedViews[this.$store.state.tagsView.visitedViews.length - 1].path)
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  // height: 100%;
  .el-tabs {
    margin-top: 20px;
    /deep/.el-scrollbar {
      // height: 368px;
      /deep/.el-scrollbar__wrap {
        overflow-x: hidden;
      }
    }
  }
}
/deep/ .el-form-item__label {
  font-size: 12px;
  width: 138px !important;
}
/deep/ .el-form-item__content {
  margin-left: 140px !important;
}
/deep/ .el-dialog__body {
  padding: 0px 20px;
}
</style>
