// 课件管理
<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="text-lable">课程名称：</span>
      <el-input
        v-model="listQuery.name"
        placeholder="请输入课程名称"
        style="width: 145px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleSelect"
      />
      <span class="text-lable">课程类型：</span>
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
          <a @click="addForm">
            <img src="../../../views/images/添加@2x.png" width="17px" height="17px">
            <span class="barIcon">添加</span>
          </a>
        </li>
        <li>
          <a @click="Alldelete">
            <img src="../../../views/images/删 除@2x.png" width="17px" height="17px">
            <span class="barIcon">查看</span>
          </a>
        </li>
      </ul>
    </div>

    <!-- 表格 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      ref="NodeTable"
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
      @row-dblclick="DblUpdateNode"
    >
      <!-- 序列号 -->
      <el-table-column label="序号" type="index" align="left" width="80px" />
      <!-- 名称 -->
      <el-table-column label="课程文件名" prop="nodeCode" align="left" width="210px">
      <template slot-scope="scope">
          <img src="../../../views/images/文件夹.png" style="width:16px;vertical-align: text-bottom;">
          <router-link class="table-link" :to="{name:'CoursewareDetail',query:{}}">{{scope.row.nodeName}}</router-link>
        </template>
      </el-table-column>
      <!-- 表单编码 -->
      <el-table-column label="课程类型" prop="nodeName" align="left" width="140px" />
      <!-- 表单版本 -->
      <el-table-column label="所属教研室" prop="pendingNodeName" align="left" width="210px" />
      <el-table-column label="大小" prop="handledNodeName" align="left" width="140px" />
      <el-table-column label="创建时间" prop="handledNodeName" align="left" width="210px" />
      <!-- <el-table-column label="类型" prop="type" align="center" width="80px">
        <template slot-scope="scope">
          {{ map[scope.row.type] }}
        </template>
      </el-table-column> -->
      <el-table-column label="操作" prop="formOperateType" align="center" min-width="120px">
        <template slot-scope="scope">
          <!-- <el-button
            type="text"
            size="mini"
            @click="UpdateNode(scope.$index,scope.row)"
          >修改</el-button> -->
          <el-button
            type="text"
            size="mini"
            @click.native.prevent="deleteRow(scope.$index, delarr)"
          >查看</el-button>
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
import { getProcessNode } from '@/api/user'
import { deleteNodeCode } from '@/api/delete'

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
  // name: 'CoursewareMg',
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
      delarr:[],
      // NodeTable: {},
      ableCheck: false,
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 20,
        nodeName: '',
        nodeCode: '',
        pendingNodeName: '',
        handledNodeName: ''
      },
      StatusOptions, // 状态选择
      TypeOptions, // 类型
      showReviewer: false,
      dialogFormVisible: false,
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      multipleSelection: [],
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
    checkViews(row) {
      this.$refs.NodeTable.toggleRowSelection(row)
      this.form = row
      this.ableCheck = true
      console.log('有变化么', this.form)
    },
    getList() {
      this.listLoading = true
      const data = {
        pageIndex: this.listQuery.pageIndex,
        pageSize: this.listQuery.pageSize,
        nodeName: this.listQuery.nodeName,
        nodeCode: this.listQuery.nodeCode
      }
      getProcessNode(data).then(response => {
        this.list = response.data.list
        this.total = response.data.count
        console.log('测试长度', response.data)
        if (this.listQuery.length === 0) {
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
    // 添加
    addForm() {
      this.$router.push({
        path: '../QualityCtrlMg/ProcessNode/addNode.vue',
        name: 'AddProcessNode'
      })
    },
    // 修改节点
    UpdateNode(index, row) {
      this.$router.push({
        path: '../QualityCtrlMg/updateNode',
        name: 'UpdateNode',
        query: {
          nodeCode: row.nodeCode,
          nodeName: row.nodeName,
          pendingNodeName: row.pendingNodeName,
          handledNodeName: row.handledNodeName
        }
      })
    },
    // 搜索
    handleSelect() {
        this.listQuery.page = 1
        this.getList()
    },
    DblUpdateNode(form) {
        this.$router.push({
        path: '../QualityCtrlMg/updateNode',
        name: 'UpdateNode',
        query: {
          nodeCode: this.form.nodeCode,
          nodeName: this.form.nodeName,
          pendingNodeName: this.form.pendingNodeName,
          handledNodeName: this.form.handledNodeName
        }
      })
    },
    deleteRow(index, rows) { // 删除该行
    this.$confirm('确定删除此行?', '删除提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          deleteNodeCode(this.form.nodeCode)
          .then(() => {
              this.list.splice(index, 1)
              console.log(this.list)
              this.getList()
              this.$message({
                type: 'success',
                message: '删除成功'
              })
          })
        })
    },
    handleSelectionChange(val) {
        this.multipleSelection = val
        console.log('多选选中的行', this.multipleSelection)
    },
    Alldelete() { // 多选删除
    if (this.ableCheck) {
    this.$confirm('确定删除?', '删除提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          for(let i = 0 ; i < this.multipleSelection.length; i++){
            console.log(this.multipleSelection[i].nodeCode)
            deleteNodeCode(this.multipleSelection[i].nodeCode)
          }
        }).then(() => {
              console.log(this.list)
              this.getList()
              this.$message({
                type: 'success',
                message: '删除成功'
              })
          })
      } else {
        this.$confirm('请先选择表单', '删除提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      }
    },
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
// 下划线蓝色字
// .table-link{
//   color:#0585c0;
//   text-decoration: underline;
// }
</style>
