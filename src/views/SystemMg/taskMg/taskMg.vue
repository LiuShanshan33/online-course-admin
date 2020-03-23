<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="text-lable">状态：</span>
      <el-select
        v-model="listQuery.status"
        placeholder="请选择"
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
      <el-button v-waves class="filter-item search-btn" type="primary" @click="handleSelect">
        <span style="height:17px;line-height:17px;font-size:12px;padding-bottom:6px">搜索</span>
      </el-button>
    </div>
    <!-- 工具栏 -->
    <div class="panelBar">
      <ul class="toolBar">
        <li>
          <a @click="addTaskMg">
            <img src="../../../views/images/添加@2x.png" width="17px" height="17px">
            <span class="barIcon">添加</span>
          </a>
        </li>
        <li>
          <a @click="updateTaskMg">
            <img src="../../../views/images/编辑@2x.png" width="17px" height="17px">
            <span class="barIcon">修改</span>
          </a>
        </li>
        <li>
          <a @click="deleteRow(id)">
            <img src="../../../views/images/删 除@2x.png" width="17px" height="17px">
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
      border
      :height="tableHeight"
      fit
      highlight-current-row
      stripe
      size="mini"
      style="width: 100%;"
      :cell-style="{padding:'3px 2px'}"
      :header-cell-style="{background:'#F0F5F7', color:'#333333'}"
      @row-click="checkViews"
      @row-dblclick="updateTaskMg"
    >
      <el-table-column label="序列号" prop="id" align="center" width="90px" />
      <el-table-column label="任务名" prop="name" align="left" width="180px" />
      <el-table-column label="说明" prop="description" align="left" width="240px" />
      <el-table-column label="表达式" prop="cronExpression" align="left" width="140px" />
      <el-table-column label="任务计划脚本" prop="filePath" align="left" min-width="140px" />
      <el-table-column label="状态" prop="status" align="center" width="90">
        <template slot-scope="{row}">{{ map[row.status] }}</template>
      </el-table-column>
      <el-table-column label="操作" prop="formOperateType" class-name="status-col" max-width="120px">
        <template slot-scope="{row}">
          <el-button
            v-if="row.status ==='0'"
            type="text"
            size="mini"
            @click="handleStatus(row,'1')"
          >立刻执行</el-button>
          <el-button
            v-if="row.status ==='0'"
            type="text"
            size="mini"
            @click="changeStatus(row,'2')"
          >暂停</el-button>
          <el-button
            v-if="row.status ==='2'"
            type="text"
            size="mini"
            @click="changeStatus(row,'0')"
          >恢复</el-button>
          <el-button
            v-if="row.status ==='1' || row.status ==='3'"
            type="text"
            size="mini"
            @click="handleStatus(row,'0')"
          >重新初始化</el-button>
        </template>
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
import { getPage_10 } from '@/api/user'
import { deleteTask } from '@/api/delete'
import { pauseStatus, resumeStatus, recreateStatus, runOnceStatus } from '@/api/columnBtn'

// 状态选择
const TypeOptions = [
  { key: '0', display_name: '就绪' },
  { key: '1', display_name: '执行中' },
  { key: '2', display_name: '暂停' },
  { key: '3', display_name: '错误' }
]

const TypeKeyValue = TypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'TaskMg',
  components: { Pagination },
  directives: { waves },
  filters: {
    typeFilter(type) {
      return TypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      ableCheck: false,
      form: [],
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 20,
        code: '',
        name: '',
        nameEn: '',
        status: undefined,
        sort: '+id'
      },
      TypeOptions, // 状态选择
      showReviewer: false,
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      map: {
        0: '就绪',
        1: '执行中',
        2: '暂停',
        3: '错误'

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
      const data = {
        pageIndex: this.listQuery.pageIndex,
        pageSize: this.listQuery.pageSize,
        status: this.listQuery.status
      }
      getPage_10(data).then(response => {
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
    // 选中某一行
    checkViews: function(data) {
      this.form = data
      console.log(this.form)
      this.ableCheck = true
    },
    deleteRow() {
      if (this.ableCheck) {
        this.$confirm('确定删除此行?', '删除提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          deleteTask(this.form.id)
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        })
      } else {
        this.$confirm('请先选择表单', '查看提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      }
    },

    // 时间戳转化为时间
    timestampToTime(row, column) {
      if (row != null) {
        var date = new Date(row.createTime) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-'
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        var D = date.getDate() + ' '
        var h = date.getHours() + ':'
        var m = date.getMinutes() + ':'
        var s = date.getSeconds()
        return Y + M + D + h + m + s
      }
      // else{return null}
    },
    // 搜索
    handleSelect() {
      this.listQuery.page = 1
      this.getList()
    }, // 添加
    addTaskMg() {
      this.$router.push({
        path: '../SystemMg/addTaskMg'
      })
    },
    // 修改
    updateTaskMg(form) {
      if (this.ableCheck) {
        this.$router.push({
          path: '../SystemMg/updateTaskMg',
          query: {
            id: this.form.id,
            name: this.form.name,
            status: this.form.status,
            cronExpression: this.form.cronExpression,
            description: this.form.description,
            filePath: this.form.filePath,
            updateDate: this.form.updateDate
          }
        })
      } else {
        this.$confirm('请先选择表单', '查看提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      }
    },
    // 执行--重新初始化
    handleStatus(row, status) {
      if (row.status === '1' || row.status === '3') {
        this.$confirm('确定要重新初始化吗?', '确认提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        })
          .then(() => {
            recreateStatus(row.id)
            row.status = status
            this.$message({
              type: 'success',
              message: '操作成功'
            })
          })
      } else {
        this.$confirm('确定要执行吗?', '确认提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        })
          .then(() => {
            runOnceStatus(row.id)
            row.status = status
            this.$message({
              type: 'success',
              message: '操作成功'
            })
          })
      }
    },
    // 暂停--恢复
    changeStatus(row, status) {
      if (row.status === '2') {
        this.$confirm('确定要恢复吗?', '确认提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          resumeStatus(row.id)
          row.status = status
          this.$message({
            type: 'success',
            message: '操作成功'
          })
        })
      } else {
        this.$confirm('确定要暂停吗?', '确认提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        })
          .then(() => {
            pauseStatus(row.id)
            row.status = status
            this.$message({
              type: 'success',
              message: '操作成功'
            })
          })
      }
    },
    pagination(a, b, c) {
      console.log(a, b, c, '999')
    },
    handleDownload() { }
  }
}
</script>

