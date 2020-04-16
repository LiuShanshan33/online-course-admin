// 学生基本信息
<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="text-lable">姓名：</span>
      <el-input
        v-model="listQuery.name"
        placeholder="请输入"
        style="width: 118px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleSelect"
      />
      <span class="text-lable">学号：</span>
      <el-input
        v-model="listQuery.name"
        placeholder="请输入"
        style="width: 118px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleSelect"
      />
      <span class="text-lable">年级：</span>
      <el-select
        v-model="listQuery.status"
        placeholder="请选择"
        clearable
        class="filter-item"
        style="width: 118px"
      >
        <el-option
          v-for="item in StatusOptions"
          :key="item.key"
          :label="item.display_name"
          :value="item.key"
        />
      </el-select>
      <span class="text-lable">所属学院：</span>
      <el-select
        v-model="listQuery.status"
        placeholder="请选择"
        clearable
        class="filter-item"
        style="width: 118px"
      >
        <el-option
          v-for="item in StatusOptions"
          :key="item.key"
          :label="item.display_name"
          :value="item.key"
        />
      </el-select>
       <span class="text-lable">校区：</span>
      <el-select
        v-model="listQuery.status"
        placeholder="请选择"
        clearable
        class="filter-item"
        style="width: 118px"
      >
        <el-option
          v-for="item in StatusOptions"
          :key="item.key"
          :label="item.display_name"
          :value="item.key"
        />
      </el-select>
      <el-button v-waves class="filter-item search-btn" type="primary" @click="handleSelect">
        <span>搜索</span>
      </el-button>
    </div>
    <!-- 工具栏 -->
    <div class="panelBar">
      <ul class="toolBar">
        <li>
          <a @click="addStuInfo">
            <img src="../../../views/images/添加.png" style="width: 17px">
            <span class="barIcon">添加</span>
          </a>
        </li>
        <li>
          <a  @click="updateStuInfo">
            <img src="../../../views/images/编辑.png" style="width: 17px">
            <span class="barIcon">修改</span>
          </a>
        </li>
        <!-- style="vertical-align: text-bottom;width: 17px;height: 17px" -->
        <li>
          <a>
            <img src="../../../views/images/删除.png"  style="width: 17px">
            <span class="barIcon">删除</span>
          </a>
        </li>
      </ul>
    </div>
    <!-- 表格 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      size="mini"
      :height="tableHeight"
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%;"
      :header-cell-style="{background:'#F0F5F7', color:'#333333'}"
      :cell-style="{padding:'3px 2px'}"
      @row-click="checkViews"
      @row-dblclick="updateStuInfo"
    >
      <!-- 序号 -->
      <el-table-column label="序号" type="index" align="center" width="50px" />
      <!-- 名称 -->
      <el-table-column label="学生姓名" prop="name" align="left" width="160px" />
      <!-- 表单编码 -->
      <el-table-column label="学号" prop="formCode" align="left" min-width="160px" />
      <!-- 表单版本 -->
      <el-table-column label="性别" prop="formVersion" align="center" width="80px" />
      <el-table-column label="年级" prop="type" align="left" width="80px">
        <template slot-scope="scope">
          {{ map[scope.row.type] }}
          <!-- {{ scope.row.type == 1 ? '表单' : scope.row.type == 2 ?'列表': '列表和打印' }} -->
        </template>
      </el-table-column>
       <el-table-column label="专业" prop="formVersion" align="left" width="160px" />
      <el-table-column label="所属学院" prop="status" align="left" width="160px">
        <template slot-scope="{row}">
          {{ row.status =='1' ?'已启用':'已禁用' }}
          <!-- {{ row.status }} -->
        </template>
      </el-table-column>
       <!-- 手机号 -->
      <el-table-column label="手机号" prop="formCode" align="left" width="160px" />
      <el-table-column label="校区" prop="formCode" align="left" width="160px" />
      <!-- <el-table-column label="操作" prop="formOperateType" align="center" min-width="80">
        <template slot-scope="{ row }">
          <el-button
            type="text"
            size="mini"
            @click="handleStatus(row,'2')"
          >重置密码</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <!-- 记录条数 分页-->
    <pagination
      class="page"
      :total="total"
      :page.sync="listQuery.pageIndex"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/_components/Pagination' // secondary package based on el-pagination
import { getPage_1 } from '@/api/user'
import { enableStatus, disableStatus } from '@/api/columnBtn'

// 类型
const TypeOptions = [
  { key: '1', display_name: '表单' },
  { key: '2', display_name: '列表' },
  { key: '3', display_name: '列表和打印' }
]
// 状态选择
const StatusOptions = [
  { key: '1', display_name: '已启用' },
  { key: '2', display_name: '已禁用' }
]

const TypeKeyValue = TypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const StatusKeyValue = StatusOptions.reduce((abc, curr) => {
  abc[curr.key] = curr.display_name
  return abc
}, {})

export default {
  name: 'Assess',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      return StatusKeyValue[status]
    },
    typeFilter(type) {
      return TypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      id: '',
      ableCheck: false,
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 20,
        name: '',
        type: '',
        status: '',
        sort: '+id'
      },
      StatusOptions, // 状态选择
      TypeOptions, // 类型
      showReviewer: false,
      dialogFormVisible: false,
      form: {
        name: ''
      },
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      map: {
        1: '表单',
        2: '列表',
        3: '列表和打印'
      }
    }
  },
  // 表格高度
  computed: {
    tableHeight() {
      return window.innerHeight - 275
    }
  },
  created() {
    this.getList()
  },
  methods: {
    checkViews: function(data) {
      this.form = data
      this.ableCheck = true
      console.log('有变化么', this.form)
      // console.log(this.form.title)
    },
    // 添加学生信息
    addStuInfo() {
      this.$router.push({ path: '../studentInfo/addstuInfo.vue', name: 'AddStuInfo' })
    },
    // 修改学生信息
    updateStuInfo: function(form) {
      if (this.ableCheck) {
        this.$router.push({
          path: '../studentInfo/updatestuInfo.vue',
          name: 'UpdateStuInfo',
          query: {
            id: this.form.id,
            code: this.form.code,
            name: this.form.name,
            alias: this.form.alias,
            bigDept: this.form.bigDept,
            type: this.form.type,
            symbol: this.form.symbol,
            postion: this.form.postion,
            intro: this.form.intro
          }
        })
      } else {
        this.$confirm('请先选择表单', '查看提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      }
    },
    getList() {
      this.listLoading = true
      const data = {
        pageIndex: this.listQuery.pageIndex,
        pageSize: this.listQuery.pageSize,
        name: this.listQuery.name,
        type: this.listQuery.type,
        status: this.listQuery.status
      }
      getPage_1(data).then(response => {
        this.list = response.data.list
        this.total = response.data.count
        console.log('测试长度', this.list.length)
        if (this.list.length === 0) {
          this.$confirm('未搜到相关表单！', '搜索提示', {
            confirmButtonText: '确定',
            type: 'warning'
          })
        }
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 100)
      })
    },

    // 搜索
    handleSelect() {
      if (this.listQuery.name !== '' && this.listQuery.type !== '' && this.listQuery.status !== '') {
        this.listQuery.page = 1
        this.getList()
      } else { // 全空做刷新
        this.listQuery.page = 1
        this.getList()
      }
    },
    dbhandleCurrentChange: function(form) {
      if (this.ableCheck) {
        this.$router.push({
          path: '../NursingSet/setting-assessment',
          name: 'Setting-Assessment',
          query: {
            name: this.form.name,
            publicUse: this.form.publicUse,
            deptCode: this.form.deptCode,
            unit: this.form.unit,
            evalState: this.form.evalState,
            executorName: this.form.executorName,
            printDesc: this.form.printDesc,
            evalCurveX: this.form.evalCurveX,
            evalCurveY: this.form.evalCurveY,
            seqNo: this.form.seqNo,
            intro: this.form.intro,
            id: this.form.id
          }
        })
      } else {
        this.$confirm('请先选择表单', '查看提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      }
    },
    // (row,) {
    //   this.$router.push({ path: '../NursingSet/setting-assessment' })
    // },
    // 禁用启用状态
    handleStatus(row, status) {
      if (row.status === '1') {
        this.$confirm('确定禁用此表单?', '禁用提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        })
          .then(() => {
            disableStatus(row.id)
            row.status = status
            this.$message({
              type: 'success',
              message: '操作成功'
            })
          })
      } else {
        this.$confirm('确定启用此表单?', '启用提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        })
          .then(() => {
            disableStatus(row.id)
            row.status = status
            this.$message({
              type: 'success',
              message: '操作成功'
            })
          })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-form-item--small .el-form-item__content {
  margin-left: 25%;
  .el-button {
    margin-right: 50px;
  }
}
</style>
