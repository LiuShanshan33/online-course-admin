<template>
  <el-scrollbar style="height:100%">
    <div class="container">
      <div class="top-container">
        <div class="content-title">查看</div>
        <hr>
      </div>
      <div class="content">
        <div class="scoll" :style="conheight">
          <el-form ref="ruleForm" :model="ruleForm" label-width="100px" size="mini">
            <el-form-item style="margin-top: 20px;" label="任务标题:">{{ this.$route.query.title }}</el-form-item>
            <el-form-item label="创建时间:">{{ this.$route.query.createTime }}</el-form-item>
            <el-form-item label="开始时间:">{{ this.$route.query.beginTime }}</el-form-item>
            <el-form-item label="预计结束时间:">{{ this.$route.query.expectedEndTime }}</el-form-item>
            <el-form-item label="结束时间:">{{ this.$route.query.endTime }}</el-form-item>
            <el-form-item label="执行人工号:">{{ this.$route.query.executor }}</el-form-item>
            <el-form-item label="执行人姓名:">{{ this.$route.query.executorName }}</el-form-item>
            <el-form-item label="备注:">{{ this.$route.query.remark }}</el-form-item>
            <el-form-item label="护理单元:">{{ this.$route.query.wardCode }}</el-form-item>
            <el-form-item label="病人ID:">{{ this.$route.query.patientId }}</el-form-item>
            <el-form-item label="就诊流水号:">{{ this.$route.query.visitId }}</el-form-item>
            <el-form-item label="病人姓名:">{{ this.$route.query.patientName }}</el-form-item>
            <el-form-item label="床标号:">{{ this.$route.query.bedLabel }}</el-form-item>
            <el-form-item label="任务类型:">{{ this.$route.query.type }}</el-form-item>
            <el-form-item label="状态:">{{ this.$route.query.status }}</el-form-item>
            <el-form-item label="关联对象名称:">{{ this.$route.query.entity }}</el-form-item>
            <el-form-item label="关联对象主键:">{{ this.$route.query.entityId }}</el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
import { checkNursingTask } from '@/api/user'

export default {
  name: 'CheckNursingTask',
  data() {
    return {
      conheight: {
        height: ''
      }
    }
  },
  created() {
    this.tableHeight()
  },
  methods: {
    tableHeight() {
      this.conheight.height = window.innerHeight - 140 + 'px'
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  .content {
    // height: 500px;
    margin-left: 50px;
    /deep/ .el-form-item {
      margin-bottom: 2px;
    }
  }
}
</style>
