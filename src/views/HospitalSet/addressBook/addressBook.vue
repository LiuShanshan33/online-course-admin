<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="text-lable">科室：</span>
      <el-select v-model="listQuery.deptName" clearable filterable placeholder="请选择" style="top: -6px">
        <el-option v-for="o in DeptOptions" :key="o.code" :label="o.name" :value="o.name" />
      </el-select>
      <span class="text-lable">姓名：</span>
      <el-input
        v-model="listQuery.empName"
        placeholder="请输入"
        style="width: 118px;"
        class="filter-item"
        @keyup.enter.native="handleSelect"
      />
      <el-button v-waves class="filter-item search-btn" type="primary" @click="handleSelect">
        <span style="height:17px;line-height:17px;font-size:12px;padding-bottom:6px">搜索</span>
      </el-button>
    </div>
    <!-- 工具栏 -->
    <div class="panelBar">
      <ul class="toolBar">
        <li>
          <a @click="addAddrBook">
            <img src="../../../views/images/添加@2x.png" width="17px" height="17px">
            <span class="barIcon">添加</span>
          </a>
        </li>
        <li>
          <a @click="updateAddrBook">
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
      :header-cell-style="{background:'#F0F5F7', color:'black'}"
      :cell-style="{padding:'3px 2px'}"
      @row-click="checkViews"
      @row-dblclick="updateAddrBook"
    >
      <el-table-column label="科室" prop="deptName" align="left" min-width="130px" />
      <el-table-column label="姓名" prop="empName" align="center" min-width="130px" />
      <el-table-column label="电话" prop="phone" align="center" min-width="130px" />
      <el-table-column label="集团短号" prop="groupPhone" align="center" min-width="130px" />
      <el-table-column
        label="内线电话"
        prop="innerPhone"
        align="center"
        min-width="130px"
        class-name="small-padding fixed-width"
      />
    </el-table>
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
import { getPage_7, getDictInfo } from '@/api/user'
import { deleteAddrBook } from '@/api/delete'

export default {
  name: 'AddressBook',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 20,
        deptName: undefined,
        deptCode: '',
        empName: '',
        phone: '',
        groupPhone: ''
      },
      DeptOptions: [],
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
    this.getOptionsData()
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
    getList() {
      this.listLoading = true
      const data = {
        pageIndex: this.listQuery.pageIndex,
        pageSize: this.listQuery.pageSize,
        deptCode: this.listQuery.deptCode,
        empName: this.listQuery.empName
      }
      getPage_7(this.listQuery).then(response => {
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
      this.ableCheck = true
      console.log('有变化么', this.form)
    },
    // 删除
    deleteRow() {
      if (this.ableCheck) {
        this.$confirm('确定删除此行?', '删除提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          deleteAddrBook(this.form.id)
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
    getOptionsData() {
      getDictInfo().then(res => {
        this.DeptOptions = res.data.list
        console.log('treeList', this.DeptOptions)
      })
    },
    // 搜索
    handleSelect() {
      this.listQuery.page = 1
      this.getList()
    },
    // 添加
    addAddrBook() {
      this.$router.push({ path: '../HospitalSet/addAddrBook' })
    },
    // 修改
    updateAddrBook: function(form) {
      if (this.ableCheck) {
        this.$router.push({
          path: '../HospitalSet/updateAddrBook',
          query: {
            id: this.form.id,
            deptName: this.form.deptName,
            empName: this.form.empName,
            phone: this.form.phone,
            groupPhone: this.form.groupPhone,
            innerPhone: this.form.innerPhone
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
