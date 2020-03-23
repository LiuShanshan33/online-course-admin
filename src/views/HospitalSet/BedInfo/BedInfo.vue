<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="text-lable">护理单元：</span>
      <!-- <el-autocomplete
        v-model="listQuery.deptCode"
        :fetch-suggestions="querySearchGroup"
        placeholder="请选择"
        clearable
        class="filter-item"
        style="width: 168px;margin-top:0px"
        @select="selectGroup"
        @focus="groupListMe"
      /> -->
      <el-select v-model="listQuery.deptCode" clearable filterable placeholder="请选择" style="top: -6px">
        <el-option v-for="o in DeptOptions" :key="o.code" :label="o.name" :value="o.name" />
      </el-select>
      <span class="text-lable">床位等级：</span>
      <el-select
        v-model="listQuery.bedLevel"
        placeholder="请选择"
        clearable
        style="width: 118px"
        class="filter-item"
      >
        <el-option v-for="item in GradeOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <span class="text-lable">床位编制：</span>
      <el-select
        v-model="listQuery.bedApproved"
        placeholder="请选择"
        clearable
        style="width: 118px"
        class="filter-item"
      >
        <el-option v-for="item in EstablishOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <span class="text-lable">状态：</span>
      <el-select
        v-model="listQuery.status"
        placeholder="请选择"
        clearable
        style="width: 118px"
        class="filter-item"
      >
        <el-option v-for="item in StatusOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button class="filter-item search-btn" type="primary" @click="handleSelect">
        <span style="height:17px;line-height:17px;font-size:12px;padding-bottom:6px">搜索</span>
      </el-button>
    </div>
    <!-- 工具栏 -->
    <div class="panelBar">
      <ul class="toolBar">
        <li>
          <a @click="addBed">
            <img src="../../../views/images/添加@2x.png" width="17px" height="17px">
            <span class="barIcon">添加床位</span>
          </a>
        </li>
        <li>
          <a @click="updateBed">
            <img src="../../../views/images/编辑@2x.png" width="17px" height="17px">
            <span class="barIcon">修改床位</span>
          </a>
        </li>
        <li>
          <a :model="list" @click="deleteRow(id)">
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
      @row-dblclick="updateBed"
    >
      <el-table-column label="护理单元" prop="deptCode" align="left" min-width="120" />
      <el-table-column label="房间号" prop="roomNo" align="center" min-width="100" />
      <el-table-column label="床标号" prop="bedLabel" align="center" min-width="100" />
      <el-table-column label="床位等级" prop="bedLevel" align="center" min-width="100" />
      <el-table-column label="床位编制" prop="bedApproved" align="center" min-width="100" />
      <el-table-column label="床位性别" prop="bedSex" align="center" min-width="100" />
      <el-table-column
        label="排序号"
        prop="sort"
        align="center"
        class-name="status-col"
        min-width="100"
      />
      <el-table-column
        label="状态"
        prop="status"
        align="center"
        min-width="100"
        class-name="small-padding fixed-width"
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
import { getPage_6, getDictInfo } from '@/api/user'
import { deleteBedInfo } from '@/api/delete'
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
  name: 'BedInfo',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        EstablishOptions: undefined,
        bedLevel: undefined,
        bedApproved: undefined,
        StatusOptions: undefined,
        title: undefined,
        type: undefined,
        sort: '+id',
        deptCode: ''
      },
      ableCheck: false,
      form: [],
      groupArr: [],
      groupList: [],
      DeptOptions: [], // 类型
      GradeOptions: ['A级单人房', 'B级三人房', '层流房'],
      EstablishOptions: ['在编', '非编', '加床', '挂床', '虚床'],
      StatusOptions: ['在床', '空床'],
      TypeOptions, // 状态选择
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
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
  watch: {
    'listQuery.deptCode': {
      deep: true,
      handler: function(newVal, oldVal) {
        this.groupArr = []// 这是定义好的用于存放下拉提醒框中数据的数组
        var len = this.groupList.length// groupList
        var arr = []
        for (var i = 0; i < len; i++) { // 根据输入框中的值进行模糊匹配
          if (this.groupList[i].name.indexOf(this.listQuery.deptCode) >= 0) {
            arr.push({
              value: this.groupList[i].name,
              id: this.groupList[i].code
            })
          }
        }
        this.groupArr = arr
      }
    }
  },
  created() {
    this.getList()
    this.onLoad()
  },
  methods: {
    groupListMe() {
      getDictInfo().then(res => {
        if (res.data) {
          this.groupList = []
          this.groupArr = []
          this.groupList = res.data.list
          for (const item of this.groupList) {
            this.groupArr.push({
              value: item.name,
              id: item.code
            })
          }
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    querySearchGroup(queryString, cb) {
      var groupArr = this.groupArr
      cb(groupArr)
    },
    selectGroup(val) {
      this.groupId = val.code
    },
    deleteRow() {
      if (this.ableCheck) {
        this.$confirm('确定删除此行?', '删除提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          deleteBedInfo(this.form.id)
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
    // 选中某一行
    checkViews: function(data) {
      this.form = data
      this.ableCheck = true
      console.log('有变化么', this.form)
    },
    getList() {
      this.listLoading = true
      const data = {
        pageIndex: this.listQuery.pageIndex,
        pageSize: this.listQuery.pageSize,
        deptCode: this.listQuery.deptCode,
        bedLevel: this.listQuery.bedLevel,
        bedApproved: this.listQuery.bedApproved,
        status: this.listQuery.status
      }
      getPage_6(data).then(response => {
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
    onLoad() {
      this.groupListMe()
      this.getOptionsData()
    },
    getOptionsData() {
      getDictInfo().then(res => {
        this.DeptOptions = res.data.list
        console.log('treeList', this.DeptOptions)
      })
    },
    handleBan() {
      this.$confirm('确定禁用此表单?', '禁用提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      })
    },
    // 查询
    handleSelect() {
      if (this.listQuery.deptCode === '') {
        this.listQuery.page = 1
        this.getList()
      } else {
        this.listQuery.page = 1
        this.getList()
      }
    },
    // 添加床位
    addBed() {
      this.$router.push({ path: '../HospitalSet/addBed' })
    },
    // 修改床位
    updateBed: function(form) {
      if (this.ableCheck) {
        this.$router.push({
          path: '../HospitalSet/updateBed',
          query: {
            id: this.form.id,
            deptCode: this.form.deptCode,
            roomNo: this.form.roomNo,
            bedLabel: this.form.bedLabel,
            bedLevel: this.form.bedLevel,
            bedSex: this.form.bedSex,
            sort: this.form.sort,
            status: this.form.status,
            bedApproved: this.form.bedApproved
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
