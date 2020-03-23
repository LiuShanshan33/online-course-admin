<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="text-lable">护理单元：</span>
      <el-select
        v-model="listQuery.deptCode"
        name="deptOptions"
        placeholder="请选择"
        style="width: 138px"
        class="filter-item"
      >
        <el-option
          v-for="o in deptOptions"
          :key="o.code"
          :label="o.name"
          :value="o.code"
        >{{ o.name }}</el-option>
      </el-select>
      <span class="text-lable">床位等级：</span>
      <el-select
        v-model="listQuery.gradeOptions"
        placeholder="请选择"
        clearable
        style="width: 118px"
        class="filter-item"
      >
        <el-option v-for="item in gradeOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <span class="text-lable">类型：</span>
      <el-select
        v-model="listQuery.establishOptions"
        placeholder="请选择"
        clearable
        style="width: 118px"
        class="filter-item"
      >
        <el-option v-for="item in establishOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <span class="text-lable">状态：</span>
      <el-select
        v-model="listQuery.statusOptions"
        placeholder="请选择"
        clearable
        style="width: 118px"
        class="filter-item"
      >
        <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button v-waves class="filter-item search-btn" type="primary" @click="handleSelect">
        <span style="height:17px;line-height:17px;font-size:12px;padding-bottom:6px">搜索</span>
      </el-button>
    </div>
    <!-- 工具栏 -->
    <div class="panelBar">
      <ul class="toolBar">
        <li>
          <a @click="addMsg">
            <img src="../../../views/images/添加@2x.png" width="17px" height="17px">
            <span class="barIcon">添加</span>
          </a>
        </li>
        <li>
          <a @click="updateMsg">
            <img src="../../../views/images/编辑@2x.png" width="17px" height="17px">
            <span class="barIcon">修改</span>
          </a>
        </li>
        <li>
          <a>
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
      :header-cell-style="{background:'#F0F5F7', color:'#333333'}"
      :cell-style="{padding:'3px 2px'}"
      @sort-change="sortChange"
      @row-click="checkViews"
      @row-dblclick="updateMsg"
    >
      <el-table-column label="主题" prop="title" align="left" min-width="130px" />
      <el-table-column label="内容" prop="content" align="left" width="230px" />
      <el-table-column label="发件人工号" prop="senderNo" align="center" width="130px" />
      <el-table-column label="发件人姓名" prop="senderName" align="center" width="130px" />
      <el-table-column label="发件时间" prop="sendTime" align="center" min-width="130px" />
      <el-table-column label="类型" prop="type" align="center" width="80" />
      <el-table-column
        label="是否已删除"
        prop="deleted"
        align="center"
        class-name="status-col"
        width="100"
      />
      <el-table-column
        label="状态"
        prop="status"
        align="center"
        class-name="small-padding fixed-width"
      />
    </el-table>
    <!-- 记录条数 分页-->
    <!-- <el-pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /> -->
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
import { getPage_8, getDictInfo } from '@/api/user'

// 状态选择
const TypeOptions = [
  { key: 'ON', display_name: '已启用' },
  { key: 'OFF', display_name: '禁用' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const TypeKeyValue = TypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'MsgMg',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      // options: null,
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 20,
        // deptOptions: undefined,
        establishOptions: undefined,
        bedLevel: undefined,
        statusOptions: undefined,
        title: undefined,
        type: undefined,
        sort: '+id',
        deptCode: ''
      },
      downloadLoading: false
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
    this.onLoad()
  },
  methods: {
    getList() {
      this.listLoading = true
      const data = {
        pageIndex: this.listQuery.pageIndex,
        pageSize: this.listQuery.pageSize,
        name: this.listQuery.name,
        type: this.listQuery.type
      }
      getPage_8(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.count

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    onLoad() {
      this.getOptionsData()
    },
    getOptionsData() {
      getDictInfo().then(res => {
        this.deptOptions = res.data.list
        console.log('treeList', this.deptOptions)
      })
    },
    // 选中某一行
    checkViews: function(data) {
      this.form = data
      this.ableCheck = true
      console.log('有变化么', this.form)
    },
    // 搜索
    handleSelect() {
      this.$confirm('未搜到相关表单！', '搜索提示', {
        confirmButtonText: '确定',
        type: 'warning'
      })
    },
    // 添加
    addMsg() {
      this.$router.push({ path: '../HospitalSet/addMsg' })
    },
    // 修改
    updateMsg: function(form) {
      if (this.ableCheck) {
        this.$router.push({
          path: '../HospitalSet/updateMsg',
          query: {
            id: this.form.id,
            title: this.form.title,
            content: this.form.content,
            senderNo: this.form.senderNo,
            senderName: this.form.senderName,
            sendTime: this.form.sendTime,
            type: this.form.type,
            deleted: this.form.deleted,
            status: this.form.status
          }
        })
      } else {
        this.$confirm('请先选择表单', '查看提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      }
    }
  }
}
</script>
