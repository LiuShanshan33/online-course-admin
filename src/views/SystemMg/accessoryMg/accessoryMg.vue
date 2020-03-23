//附件管理
<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="text-lable">对象名称：</span>
      <el-input
        v-model="listQuery.entity"
        placeholder="请输入"
        style="width: 118px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleSelect"
      />
      <span class="text-lable">对象主键：</span>
      <el-input
        v-model="listQuery.entityId"
        placeholder="请输入"
        style="width: 118px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleSelect"
      />
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
          v-for="item in TypeOptions"
          :key="item.key"
          :label="item.display_name"
          :value="item.key"
        />
      </el-select>
      <span class="text-lable">开始时间：</span>
      <el-date-picker v-model="listQuery.startCreateDate" type="date" placeholder="开始日期" @keyup.enter.native="handleSelect" />
      <span class="text-lable" style="padding-left:0px">-</span>
      <el-date-picker v-model="listQuery.endCreateDate" type="date" clearable placeholder="结束日期" @keyup.enter.native="handleSelect" />
      <el-button v-waves class="filter-item search-btn" type="primary" @click="handleSelect">
        <span style="height:17px;line-height:17px;font-size:12px;padding-bottom:6px">搜索</span>
      </el-button>
    </div>
    <!-- 工具栏 -->
    <div class="panelBar">
      <ul class="toolBar">
        <li>
          <a @click="deleteForm">
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
      @row-click="checkViews"
    >
      <el-table-column label="文件名" prop="name" align="center" width="100px" />
      <el-table-column label="文件大小" prop="size" align="center" width="80px" />
      <el-table-column label="文件类型" prop="type" align="left" width="100px" />
      <el-table-column label="文件路径" prop="path" align="left" min-width="160px" />
      <el-table-column label="对象名称" prop="entity" align="center" width="80px" />
      <el-table-column label="对象主键" prop="entityId" align="center" width="80px" />
      <el-table-column label="排序号" prop="sort" align="center" width="60px" />
      <el-table-column label="状态" prop="status" align="center" width="70px">
        <template slot-scope="{row}">{{ map[row.status] }}</template>
      </el-table-column>
      <el-table-column label="上传渠道" prop="channel" align="left" class-name="status-col" width="80px" />
      <el-table-column label="上传者" prop="userId" align="center" class-name="status-col" width="60px" />
      <el-table-column
        label="上传时间"
        prop="createDate"
        align="left"
        class-name="status-col"
        width="100"
        :formatter="timestampToTime"
      />
      <el-table-column
        label="是否公开文件夹"
        prop="publicFile"
        align="center"
        class-name="status-col"
        min-width="100px"
      />
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
import { getPage_11 } from '@/api/user'
import { deleteAccessory } from '@/api/delete'
// 状态选择
const TypeOptions = [
  { key: '0', display_name: '临时' },
  { key: '1', display_name: '使用中' },
  { key: '2', display_name: '已废弃' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const TypeKeyValue = TypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'AccessoryMg',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      form: undefined,
      ableCheck: false,
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 20,
        status: undefined,
        entityId: undefined,
        entity: undefined,
        endCreateDate: undefined,
        startCreateDate: undefined,
        sort: '+id'
      },
      TypeOptions, // 状态选择
      datavalue: {
        startBeginTime: '',
        endBeginTime: ''
      },
      showReviewer: false,
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      map: {
        0: '临时',
        1: '使用中',
        2: '已废弃'
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
        entity: this.listQuery.entity,
        entityId: this.listQuery.entityId,
        status: this.listQuery.status,
        startCreateDate: this.listQuery.startCreateDate,
        endCreateDate: this.listQuery.endCreateDate
      }
      getPage_11(this.listQuery).then(response => {
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
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    checkViews(data) {
      this.form = data
      this.ableCheck = true
      console.log(this.form)
    },
    // 搜索
    handleSelect() {
      this.listQuery.page = 1
      this.getList()
    },
    handleBan() {
      this.$confirm('确定禁用此表单?', '禁用提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      })
    },
    timestampToTime(row, column) {
      if (row != null) {
        var date = new Date(row.createDate) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-'
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        var D = date.getDate() + ' '
        var h = date.getHours() + ':'
        var m = date.getMinutes() + ':'
        var s = date.getSeconds()
        return Y + M + D + h + m + s
      } else {
        return null
      }
    },
    deleteForm() {
      if (this.ableCheck) {
        this.$confirm('确定删除此表单?', '删除提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          deleteAccessory(this.form.id)
            .then(() => {
              this.getList()
              this.$message({
                type: 'success',
                message: '删除成功'
              })
            })
        })
      } else {
        this.$confirm('请先选择表单', '删除提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      }
    }
  }
}
</script>

