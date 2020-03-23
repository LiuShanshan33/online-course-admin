<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="text-lable">开始时间：</span>
      <el-date-picker v-model="listQuery.startBeginTime" type="date" placeholder="开始日期" />
      <span class="text-lable" style="padding-left:0px">-</span>
      <el-date-picker v-model="listQuery.endBeginTime" type="date" clearable placeholder="结束日期" />
      <span class="text-lable">患者编号：</span>
      <el-input
        v-model="listQuery.patientId"
        placeholder="请输入"
        style="width: 118px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleSelect"
      />
      <span class="text-lable">类型：</span>
      <el-select
        v-model="listQuery.type"
        placeholder="全部"
        clearable
        class="filter-item"
        style="width: 118px"
        @keyup.enter.native="handleSelect"
      >
        <el-option
          v-for="item in TypeOptions"
          :key="item.key"
          :label="item.display_name"
          :value="item.key"
        />
      </el-select>
      <span class="text-lable">状态：</span>
      <el-select
        v-model="listQuery.status"
        placeholder="全部"
        clearable
        class="filter-item"
        style="width: 118px"
        @keyup.enter.native="handleSelect"
      >
        <el-option
          v-for="item in StatusOptions"
          :key="item.key"
          :value="item.key"
          :label="item.display_name"
        />
      </el-select>
      <el-button v-waves class="filter-item search-btn" type="primary" @click="handleSelect">
        <span style="height:17px;line-height:17px;font-size:12px;padding-bottom:6px">搜索</span>
      </el-button>
    </div>
    <!-- 工具栏 -->
    <div class="panelBar">
      <ul class="toolBar">
        <li>
          <a @click="showCheckViews">
            <img src="../../../views/images/查看@2x.png" width="17px" height="17px">
            <span class="barIcon">查看</span>
          </a>
        </li>
      </ul>
    </div>
    <!-- 表格 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      :height="tableHeight"
      fit
      highlight-current-row
      stripe
      size="mini"
      style="width: 100%;"
      :header-cell-style="{background:'#F0F5F7', color:'#333333'}"
      :cell-style="{padding:'3px 2px'}"
      @row-click="checkViews"
      @row-dblclick="showCheckViews"
    >
      <el-table-column label="任务标题" prop="title" align="left" min-width="150px" />
      <el-table-column label="患者名称" prop="patientName" align="center" width="100px" />
      <el-table-column label="患者编号" prop="patientId" align="center" width="100px" />
      <el-table-column label="就诊流水号" prop="visitId" align="center" width="90px" />
      <el-table-column label="开始时间" prop="beginTime" align="center" width="160px" />
      <el-table-column label="预计完成时间" prop="expectedEndTime" align="center" width="160px" />
      <el-table-column label="完成时间" prop="endTime" align="center" width="160px" />
      <el-table-column label="类型" prop="type" align="center" class-name="status-col" width="100px">
        <template slot-scope="scope">{{ mapType[scope.row.type] }}</template>
      </el-table-column>
      <el-table-column
        label="状态"
        prop="status"
        align="center"
        class-name="small-padding fixed-width"
        min-width="60px"
      >
        <template slot-scope="scope">{{ mapStatus[scope.row.status] }}</template>
      </el-table-column>
    </el-table>
    <!-- 记录条数 分页-->
    <pagination
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
import { getPage_3 } from '@/api/user'
// 类型选择
const TypeOptions = [
  { key: '1', display_name: '基础任务' },
  { key: '2', display_name: '文书任务' },
  { key: '3', display_name: '护理任务' },
  { key: '4', display_name: '执行单任务' },
  { key: '5', display_name: '其他任务' },
  { key: '6', display_name: '宣教任务' }
]
// 状态选择
const StatusOptions = [
  { key: '0', display_name: '未执行' },
  { key: '1', display_name: '已执行' },
  { key: '2', display_name: '已取消' }
]
const TypeKeyValue = TypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
const StatusKeyValue = StatusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'NursingTask',
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
      listLoading: true,
      ableCheck: false,
      listQuery: {
        code: undefined,
        pageIndex: 1,
        pageSize: 20,
        patientId: undefined,
        startBeginTime: undefined,
        endBeginTime: undefined,
        title: undefined,
        type: undefined,
        sort: '+id',
        status: ' '
      },
      datavalue: {
        startBeginTime: '',
        endBeginTime: ''
      },
      TypeOptions, // 类型选择
      StatusOptions, // 状态选择
      showReviewer: false,
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      mapStatus: {
        0: '未执行',
        1: '已执行',
        2: '已取消'
      },
      mapType: {
        1: '基础任务',
        2: '文书任务',
        3: '护理任务',
        4: '执行单任务',
        5: '其他任务',
        6: '宣教任务'
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
    getList() {
      this.listLoading = true
      getPage_3(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.count
        if (this.list.length === 0) {
          this.$confirm('未搜到相关表单！', '搜索提示', {
            confirmButtonText: '确定',
            type: 'warning'
          })
        }
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    // 搜索
    handleSelect() {
      this.listQuery.page = 1
      this.getList()
    },
    // 点击某行事件
    checkViews: function(data) {
      this.form = data
      this.ableCheck = true
      console.log('有变化么', this.form)
      // console.log(this.form.title)
    },
    // 查看
    showCheckViews: function(form) {
      if (this.ableCheck) {
        this.$router.push({
          path: '../NursingSet/check-nursingTask',
          name: 'CheckNursingTask',
          query: {
            title: this.form.title,
            type: this.form.type,
            createTime: this.form.createTime,
            beginTime: this.form.beginTime,
            executor: this.form.executor,
            executorName: this.form.executorName,
            remark: this.form.remark,
            wardCode: this.form.wardCode,
            bedLabel: this.form.bedLabel,
            patientName: this.form.patientName,
            visitId: this.form.visitId,
            expectedEndTime: this.form.expectedEndTime,
            endTime: this.form.endTime,
            status: this.form.status,
            patientId: this.form.patientId,
            entity: this.form.entity,
            entityId: this.form.entityId,
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
    handleBan() {
      this.$confirm('确定禁用此表单?', '禁用提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      })
    }
  }
}
</script>
