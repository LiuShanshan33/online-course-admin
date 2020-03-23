<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="text-lable">员工号：</span>
      <el-input
        v-model="listQuery.empNo"
        style="width: 80px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleSelect"
      />
      <span class="text-lable">员工姓名：</span>
      <el-input
        v-model="listQuery.empName"
        style="width: 80px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleSelect"
      />
      <span class="text-lable">默认科室代码：</span>
      <el-input
        v-model="listQuery.deptCode"
        style="width: 118px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleSelect"
      />
      <span class="text-lable">默认科室名称：</span>
      <el-input
        v-model="listQuery.deptName"
        style="width: 118px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleSelect"
      />
      <span class="text-lable">性别：</span>
      <el-select
        v-model="listQuery.sex"
        placeholder="请选择"
        clearable
        style="width: 118px"
        class="filter-item"
      >
        <el-option
          v-for="item in SexOptions"
          :key="item.key"
          :label="item.display_name"
          :value="item.key"
        />
      </el-select>
      <span class="text-lable">职称：</span>
      <el-select
        v-model="listQuery.title"
        placeholder="请选择"
        clearable
        style="width: 118px"
        class="filter-item"
      >
        <el-option v-for="item in TitleOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <span class="text-lable">学历：</span>
      <el-select
        v-model="listQuery.education"
        placeholder="请选择"
        clearable
        style="width: 118px"
        class="filter-item"
      >
        <el-option v-for="item in EducationOptions" :key="item" :label="item" :value="item" />
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
      <el-button v-waves class="filter-item search-btn" type="primary" @click="handleSelect">
        <span style="height:17px;line-height:17px;font-size:12px;padding-bottom:6px">搜索</span>
      </el-button>
    </div>
    <!-- 工具栏 -->
    <div class="panelBar">
      <ul class="toolBar">
        <li>
          <a @click="addStaff">
            <img src="../../../views/images/添加@2x.png" width="17px" height="17px" />
            <span class="barIcon">添加员工</span>
          </a>
        </li>
        <li>
          <a @click="updateStaff">
            <img src="../../../views/images/编辑@2x.png" width="17px" height="17px" />
            <span class="barIcon">修改</span>
          </a>
        </li>
        <li>
          <a @click="deleteRow(id)">
            <img src="../../../views/images/删 除@2x.png" width="17px" height="17px" />
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
      @row-dblclick="updateStaff"
    >
      <el-table-column label="员工号" prop="empNo" align="center" min-width="60px" />
      <el-table-column label="员工姓名" prop="empName" align="center" min-width="80px" />
      <el-table-column label="默认科室代码" prop="deptCode" align="center" min-width="100px" />
      <el-table-column label="默认科室名称" prop="deptName" align="center" min-width="125px" />
      <el-table-column label="性别" prop="sex" align="center" min-width="50px">
        <template slot-scope="{row}">{{ map[row.sex] }}</template>
      </el-table-column>
      <el-table-column label="出生日期" prop="birthday" align="center" min-width="80" />
      <el-table-column label="职称" prop="title" align="center" min-width="80" />
      <el-table-column label="开始从事护理工作时间" prop="orderField" align="center" min-width="155" />
      <el-table-column label="手机号" prop="phone" align="center" min-width="95" />
      <el-table-column label="学历" prop="education" align="center" min-width="50" />
      <el-table-column label="岗位" prop="job" align="center" min-width="100" />
      <el-table-column
        label="状态"
        prop="status"
        align="center"
        class-name="status-col"
        min-width="55"
      />
      <el-table-column
        label="操作"
        prop="control"
        align="center"
        min-width="80"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="selectInfo(scope.row.empNo)">护理单元</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="护理单元" :visible.sync="getDeptPage" top="13vh">
      <div class="dialog-container">
        <div class="dialog-table">
          <el-table
            ref="multipleTable"
            :data="staffList"
            border
            stripe
            highlight-current-row
            height="430px"
            @selection-change="handleSelectChange"
            row-key="userId"
          >
            <el-table-column type="selection" :reserve-selection="true" width="40" align="center" />
            <el-table-column label="科室编码" prop="code" width="100" />
            <el-table-column label="科室名称" prop="name" min-width="130" />
            <el-table-column label="是否为默认" prop="defaultCode">
              <template slot-scope="scope">
                <el-radio
                  v-model="radio"
                  size="mini"
                  :disabled="!selectList.includes(scope.row)"
                  :label="scope.row.code"
                >默认</el-radio>
              </template>
            </el-table-column>
          </el-table>
          <div class="dialog-head">
            <ul style="list-style:none;">
              <li class="formBar">
                <el-button class="add-botton buttonActive" @click="save('staffList')">保存</el-button>
              </li>
              <li class="formBar">
                <el-button type="default" class="buttonClose" @click="closeDialog">关闭</el-button>
              </li>
              <li class="formBar">
                只显示选中
                <el-checkbox size="mini" @change="showSelect" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </el-dialog>
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
import { getSysUser, getDictInfo } from '@/api/user'
import { deleteStaffdInfo } from '@/api/delete'
import { getDepts, saveUnit } from '@/api/columnBtn'

// 状态选择
const TypeOptions = [
  { key: 'ON', display_name: '已启用' },
  { key: 'OFF', display_name: '禁用' }
]
const SexOptions = [
  { key: '0', display_name: '男' },
  { key: '1', display_name: '女' }
]

const TypeKeyValue = TypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'StaffInfo',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      radio: '',
      selectList: [],
      tableKey: 0,
      list: [],
      SList: [],
      staffList: {
        code: '',
        name: ''
      },
      total: 0,
      getDeptPage: false,
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 20,
        empNo: '',
        empName: '',
        sex: '',
        deptCode: '',
        deptName: '',
        education: '',
        status: '',
        title: ''
      },
      SexOptions, // 类型
      TitleOptions: ['护士', '护师', '主管护师', '副主任护师', '主任护师'], // 状态选择
      EducationOptions: ['中专', '高职高专', '大学本科', '硕士研究生', '博士研究生'],
      StatusOptions: ['在岗', '停职', '离职', '研究生'],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      ableCheck: false,
      downloadLoading: false,
      checkVaule: [],
      map: {
        0: '男',
        1: '女'
      }
    }
  },
  // 表格高度
  computed: {
    tableHeight() {
      return window.innerHeight - 320
    }
  },
  created() {
    this.getList()
    this.getdepartInfo()
  },
  methods: {
    getList() {
      this.listLoading = true
      const data = {
        pageIndex: this.listQuery.pageIndex,
        pageSize: this.listQuery.pageSize,
        empNo: this.listQuery.empNo,
        empName: this.listQuery.empName,
        sex: this.listQuery.sex,
        deptCode: this.listQuery.deptCode,
        deptName: this.listQuery.deptName,
        education: this.listQuery.education,
        status: this.listQuery.status,
        title: this.listQuery.title
      }
      getSysUser(data).then(response => {
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
    checkViews: function (data) {
      this.form = data
      this.ableCheck = true
    },
    // 护理单元
    getdepartInfo() { // 获取科室信息
      getDictInfo().then(res => {
        this.staffList = res.data.list
        this.SList = res.data.list
      })
    },
    // 通过员工号获取员工护理单元
    selectInfo(row) {
      this.getDeptPage = true
      getDepts(row).then(res => {// 默认选中
        res.data.list.forEach(item1 => {
          this.staffList.forEach(item2 => {
            let i = item2
            if (item1 == i.code) {
              this.$refs.multipleTable.toggleRowSelection(item2, true)
            }
          })
        })
      })
      this.$nextTick(() => {// 点开其他查看回显时清空，弹框弹出时清空
        this.$refs.multipleTable.clearSelection();
      })
    },
    // 删除
    deleteRow() {
      if (this.ableCheck) {
        this.$confirm('确定删除此行?', '删除提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          deleteStaffdInfo(this.form.id)
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
    // 搜索
    handleSelect() {
      this.listQuery.page = 1
      this.getList()
    },
    // 添加员工
    addStaff() {
      this.$router.push({ path: '../HospitalSet/addStaff' })
    },
    // 修改员工
    updateStaff: function (form) {
      if (this.ableCheck) {
        this.$router.push({
          path: '../HospitalSet/updateStaff',
          query: {
            empNo: this.form.empNo,
            empName: this.form.empName,
            deptCode: this.form.deptCode,
            deptName: this.form.deptName,
            sex: this.form.sex,
            birthday: this.form.birthday,
            title: this.form.title,
            orderField: this.form.orderField,
            phone: this.form.phone,
            education: this.form.education,
            job: this.form.job,
            status: this.form.status
          }
        })
      } else {
        this.$confirm('请先选择表单', '查看提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      }
    },
    // 护理单元多选xxxx
    handleSelectChange(val) {
      this.selectList = val
      this.checkVaule = val
    },
    // 只显示选中的
    showSelect(val) {
      if (val) {
        this.staffList = this.selectList
        console.log('ssdfa', this.selectList)
      } else {
        this.staffList = this.SList
        this.selectList.forEach(item1 => {
          let i1 = item1
          this.staffList.forEach(item2 => {
            let i2 = item2
            if (i1.code == i2.code) {
              this.$refs.multipleTable.toggleRowSelection(item2, true)
            }
          })
        })
      }
    },
    save() {
      saveUnit(this.staffList).then(res => {
        this.staffList = res.data
        this.$message({
          type: 'success',
          message: '保存成功'
        })
      })
      this.closeDialog()
    },
    closeDialog() {
      this.getDeptPage = false // 点击退出对话框
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-dialog__header {
  padding-bottom: 0px;
}
/deep/ .el-dialog__body {
  padding-top: 0px;
  padding-bottom: 55px;
}
/deep/ .dialog-head {
  float: left;
  margin-bottom: 12px;
  padding-left: 25%;
  // background: #fff;
  .formBar {
    float: left !important;
    margin-right: 40px;
    line-height: 30px;
  }
}
</style>

