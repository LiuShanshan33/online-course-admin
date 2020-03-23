/* eslint-disable no-unreachable */
<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="text-lable">名称：</span>
      <el-input
        v-model="listQuery.name"
        placeholder="请输入"
        style="width: 118px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleSelect"
      />
      <span class="text-lable">类型：</span>
      <el-select
        v-model="listQuery.type"
        placeholder="请选择"
        clearable
        style="width: 118px"
        class="filter-item"
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
          <a @click="dialogFormVisible = true">
            <img src="../../../views/images/添加@2x.png" width="17px" height="17px">
            <span class="barIcon">添加表单</span>
          </a>
        </li>
        <el-dialog title="上传表单" :visible.sync="dialogFormVisible" width="30%">
          <el-form :model="form">
            <el-form-item label="文件">
              <el-upload>
                <el-input v-model="form.name" placeholder="请上传文件" />
              </el-upload>
            </el-form-item>
            <el-form-item size="small">
              <el-button type="primary">上传</el-button>
              <el-button @click="dialogFormVisible = false">关闭</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <li>
          <a @click="dbhandleCurrentChange">
            <img src="../../../views/images/评估设置@2x.png" width="17px" height="17px">
            <span class="barIcon">评估设置</span>
          </a>
        </li>
        <li>
          <a>
            <img src="../../../views/images/编辑@2x.png" width="17px" height="17px">
            <span class="barIcon">编辑页面</span>
          </a>
        </li>
        <li>
          <a>
            <img src="../../../views/images/表单工具@2x.png" width="17px" height="17px">
            <span class="barIcon">表单工具</span>
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
      @row-dblclick="dbhandleCurrentChange"
    >
      <!-- 序号 -->
      <el-table-column label=" " type="index" align="center" width="43px" />
      <!-- 序列号 -->
      <el-table-column label="序列号" prop="id" align="center" width="100px" />
      <!-- 名称 -->
      <el-table-column label="名称" prop="name" align="left" width="260px" />
      <!-- 表单编码 -->
      <el-table-column label="表单编码" prop="formCode" align="left" min-width="240px" />
      <!-- 表单版本 -->
      <el-table-column label="表单版本" prop="formVersion" align="center" width="80px" />
      <el-table-column label="类型" prop="type" align="center" width="80px">
        <template slot-scope="scope">
          {{ map[scope.row.type] }}
          <!-- {{ scope.row.type == 1 ? '表单' : scope.row.type == 2 ?'列表': '列表和打印' }} -->
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" align="center" width="90px">
        <template slot-scope="{row}">
          {{ row.status =='1' ?'已启用':'已禁用' }}
          <!-- {{ row.status }} -->
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="formOperateType" align="center" min-width="80">
        <template slot-scope="{ row }">
          <el-button
            v-if="row.status!='2'"
            type="text"
            size="mini"
            @click="handleStatus(row,'2')"
          >禁用</el-button>
          <el-button
            v-if="row.status!='1'"
            type="text"
            size="mini"
            @click="handleStatus(row,'1')"
          >启用</el-button>
          <el-button :loading="downloadLoading" type="text" size="mini">下载</el-button>
        </template>
      </el-table-column>
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
