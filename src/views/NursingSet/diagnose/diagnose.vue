<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="text-lable">诊断编码：</span>
      <el-input
        v-model="listQuery.code"
        style="width: 118px;"
        class="filter-item"
        clearable
        placeholder="请输入"
        @keyup.enter.native="handleSelect"
      />
      <span class="text-lable">护理诊断名称：</span>
      <el-input
        v-model="listQuery.name"
        style="width: 118px;"
        class="filter-item"
        clearable
        placeholder="请输入"
        @keyup.enter.native="handleSelect"
      />
      <span class="text-lable">英文名称：</span>
      <el-input
        v-model="listQuery.nameEn"
        style="width: 118px;"
        class="filter-item"
        clearable
        placeholder="请输入"
        @keyup.enter.native="handleSelect"
      />
      <span class="text-lable">诊断类型：</span>
      <el-select
        v-model="listQuery.type"
        placeholder="请选择"
        clearable
        class="filter-item"
        style="width: 118px"
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
          <a @click="addForm">
            <img src="../../../views/images/添加@2x.png" width="17px" height="17px">
            <span class="barIcon">添加</span>
          </a>
        </li>
        <li>
          <a @click="updateForm">
            <img src="../../../views/images/编辑@2x.png" width="17px" height="17px">
            <span class="barIcon">修改</span>
          </a>
        </li>
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
      :cell-style="{padding:'3px 2px'}"
      :header-cell-style="{background:'#F0F5F7', color:'#333333'}"
      @row-click="checkViews"
      @row-dblclick="updateForm"
    >
      <el-table-column label="序列号" prop="id" align="center" width="80px" />
      <el-table-column label="诊断编码" prop="code" align="left" width="100px" />
      <el-table-column label="诊断名字" prop="name" align="left" min-width="150px" />
      <el-table-column label="诊断名字英文" prop="nameEn" align="left" width="110px" />
      <el-table-column label="诊断类型" prop="type" align="center" width="100px">
        <template slot-scope="{row}">{{ map[row.type] }}</template>
      </el-table-column>
      <el-table-column label="是否有措施" prop="hasMeasure" align="center" width="90">
        <template slot-scope="scope">{{ !!(scope.row.hasMeasure)?'有':'无' }}</template>
      </el-table-column>
      <el-table-column label="创建人" prop="createUser" align="center" width="90" />
      <el-table-column
        label="创建时间"
        prop="createTime"
        :formatter="timestampToTime"
        align="left"
        width="150"
      />
      <el-table-column label="操作" prop="formOperateType" class-name="status-col" min-width="130">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="getElePage(scope.$index,scope.row)">因素</el-button>
          <el-button type="text" size="mini" @click="getBasisPage(scope.$index,scope.row)">依据</el-button>
          <el-button type="text" size="mini" @click="getTargetPage(scope.$index,scope.row)">目标</el-button>
          <el-button type="text" size="mini" @click="getMeasurePage(scope.$index,scope.row)">措施</el-button>
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
import { getPage_2 } from '@/api/user'
import { deleteDiagnose } from '@/api/delete'
// 状态选择
const TypeOptions = [
  { key: '1', display_name: '护理诊断' },
  { key: '2', display_name: '合作性问题' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const TypeKeyValue = TypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'Diagonse',
  components: { Pagination },
  directives: { waves },
  filters: {
    TypeFilter(type) {
      return TypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      ableDiagnose: false,
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 20,
        id: '',
        code: '',
        name: '',
        nameEn: '',
        type: '',
        remark: '',
        definition: '',
        sort: '+id'
      },
      importanceOptions: ['列表', 2, 3], // 类型
      TypeOptions, // 状态选择
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['已启用', '已禁用'],
      showReviewer: false,
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      map: {
        1: '护理诊断',
        2: '合作性问题'

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
        code: this.listQuery.code,
        name: this.listQuery.name,
        nameEn: this.listQuery.nameEn,
        type: this.listQuery.type,
        remark: this.listQuery.remark,
        definition: this.listQuery.definition
      }
      getPage_2(data).then(response => {
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
    // 时间戳转化为时间
    timestampToTime(row, column) {
      if (row.createTime != null) {
        var date = new Date(row.createTime) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
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
    // 搜索
    handleSelect() {
      if (this.listQuery.name !== '' && this.listQuery.code !== '' && this.listQuery.type !== '' && this.listQuery.nameEn !== '') {
        this.listQuery.page = 1
        this.getList()
        this.$confirm('未搜到相关表单！', '搜索提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      } else {
        this.listQuery.page = 1
        this.getList()
      }
    },
    // 点击某行事件
    checkViews(data) {
      this.form = data
      this.ableCheck = true
      console.log(this.form)
    },
    // 添加
    addForm() {
      this.$router.push({
        path: '../NursingSet/add-diagnose',
        name: 'AddDiagnose'
      })
    },
    // 修改
    updateForm(form) {
      if (this.ableCheck) {
        this.$router.push({
          path: '../NursingSet/update-diagnose',
          name: 'UpdateDiagnose',
          query: {
            id: this.form.id,
            code: this.form.code,
            name: this.form.name,
            nameEn: this.form.nameEn,
            type: this.form.type,
            remark: this.form.remark,
            definition: this.form.definition
          }
        })
      } else {
        this.$confirm('请先选择表单', '查看提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      }
    },
    // 删除
    deleteForm() {
      if (this.ableCheck) {
        this.$confirm('确定删除此表单?', '删除提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          deleteDiagnose(this.form.id)
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
    },
    // 因素
    getElePage(index, row) {
      this.$router.push({
        path: '../NursingSet/diagElement',
        name: 'DiagElement',
        query: {
          code: row.code
        }
      })
    },
    // 依据
    getBasisPage(index, row) {
      this.$router.push({
        path: '../NursingSet/diagBasis',
        name: 'DiagBasis',
        query: {
          code: row.code
        }
      })
    },
    // 目标
    getTargetPage(index, row) {
      this.$router.push({
        path: '../NursingSet/diagTarget',
        name: 'DiagTarget',
        query: {
          code: row.code
        }
      })
    },
    // 措施
    getMeasurePage(index, row) {
      this.$router.push({
        path: '../NursingSet/diagMeasureDetail',
        name: 'DiagMeasureDetail',
        query: {
          code: row.code
        }
      })
    },
    pagination(a, b, c) {
      console.log(a, b, c, '999')
    }
  }
}
</script>
