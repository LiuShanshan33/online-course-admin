<template>
  <el-scrollbar style="height:100%">
    <div class="container">
      <div class="top-container">
        <div class="content-title">修改任务</div>
        <hr>
      </div>
      <div class="bottom-container">
        <div class="scoll" :style="conheight">
            <el-form
              ref="TaskMgForm"
              :label-position="labelPosition"
              :model="TaskMgForm"
              :rules="rules"
              label-width="110px"
              class="top-form"
            >
              <el-form-item label="任务名称:" prop="name">
                <el-input v-model="TaskMgForm.name" placeholder="请输入" />
              </el-form-item>
              <el-form-item label="表达式:" prop="cronExpression">
                <el-input v-model="TaskMgForm.cronExpression" placeholder="请输入" />
                <el-button type="text" class="inputBtn" @click="getDeptPage=true">选择表达式</el-button>
              <el-dialog title="选择" :visible.sync="getDeptPage" top="13vh">
                  <div class="dialog-container">
                      <ul>
                        <li><a class="listItem" @click="bringback('0/10 * * * ?')">0/10 * * * ?(每十分钟执行一次)</a></li>
                        <li><a class="listItem" @click="bringback('10 12 * * ?')">10 12 * * ?(每天中午12:10执行一次)</a></li>
                        <li><a class="listItem" @click="bringback('* 14 * * ?')">* 14 * * ?(每天从14:00开始到14:59结束, 每分钟执行一次)</a></li>
                        <li><a class="listItem" @click="bringback('15 10 ? * 2-6')">15 10 ? * 2-6(从周一到周五,在10:15执行一次)</a></li>
                        <li><a class="listItem" @click="bringback('0 0 1 * ?')">0 0 1 * ?(每月1号凌晨执行一次)</a></li>
                        <li><a class="listItem" @click="bringback('15 10 15 * ?')">15 10 15 * ?(每个月15日，在10:15执行一次)</a></li>
                         <li><a class="listItem" @click="bringback('15 10 L * ?')">15 10 L * ?(每个月最后一天，在10:15执行一次)</a></li>
                      </ul>
                  </div>
              </el-dialog>
              </el-form-item>
              <el-form-item label="表达式说明:">
                <el-table
                  :data="list"
                  style="width: 52%;"
                  border
                  :height="tableHeight"
                  fit
                  size="mini"
                  :cell-style="{padding:'3px 2px'}"
                  :header-cell-style="{background:'#F0F5F7', color:'#333333'}"
                >
                  <el-table-column prop="position" label="位置" width="60px" />
                  <el-table-column prop="timeDomain" label="时间域名" width="120px" />
                  <el-table-column prop="allowValue" label="允许值" width="150px" />
                  <el-table-column prop="speCha" label="允许的特殊字符" min-width="150px" />
                </el-table>
              </el-form-item>
              <el-form-item label="描述:">
                <el-input v-model="TaskMgForm.description" type="textarea" placeholder="请输入" />
              </el-form-item>
              <el-form-item label="任务计划脚本:" prop="filePath">
                <el-input v-model="TaskMgForm.filePath" placeholder="请输入" />
              </el-form-item>
              <el-form-item class="bottom-btn">
                <el-button class="add-botton" @click="save('TaskMgForm')">保存</el-button>
                <el-button @click="closeForm(tag)">关闭</el-button>
              </el-form-item>
            </el-form>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
import { saveTask } from '@/api/addOrSave' // 保存修改接口

export default {
  name: 'UpdateTaskMg',
  data() {
    return {
      TaskMgForm: {
        id: this.$route.query.id,
        name: this.$route.query.name,
        status: this.$route.query.status,
        cronExpression: this.$route.query.cronExpression,
        description: this.$route.query.description,
        filePath: this.$route.query.filePath,
        updateDate: this.$route.query.updateDate
      },
      getDeptPage: false,
      labelPosition: 'right',
      conheight: {
        height: ''
      },
      list: [{
        position: '1',
        timeDomain: '分钟',
        allowValue: '0-59',
        speCha: ', - * /'
      }, {
        position: '2',
        timeDomain: '小时',
        allowValue: '0-23',
        speCha: ', - * /'
      }, {
        position: '3',
        timeDomain: '日期',
        allowValue: '1-31',
        speCha: ', - * ? / L W C '
      }, {
        position: '4',
        timeDomain: '月份',
        allowValue: '1-12',
        speCha: ', - * /'
      }, {
        position: '5',
        timeDomain: '星期',
        allowValue: '1-7',
        speCha: ', - * ? / L W C'
      }, {
        position: '6',
        timeDomain: '年(可选)',
        allowValue: '空值1970-2099',
        speCha: ', - * ? / '
      }
        // {
        //   '[*] 表示所有值[?] 表示不指定值 [-] 表示区间[,] 表示指定多个值[/] 用于递增触发[L] 表示最后的意思[W]表示离指定日期的最近那个工作日[#] 序号(表示每月的第几个周几)'
        // }
      ],
      rules: {
        name: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ],
        cronExpression: [
          { required: true, message: '必填字段', trigger: 'change' }
        ],
        filePath: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ]
      }
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
          saveTask(this.TaskMgForm).then(response => {
            this.TaskMgForm = response.data
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
    },
    bringback(data) {
      console.log(data),
      this.TaskMgForm.cronExpression = data,
      this.getDeptPage = false
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
  .el-input,
  .el-textarea {
    width: 52%;
  }
  .inputBtn {
    position: relative;
    right: 85px;
  }
}
</style>
