// 学生基本信息
<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="text-lable">姓名：</span>
      <el-input
        v-model="listQuery.Sname"
        placeholder="请输入"
        style="width: 118px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleSelect"
      />
      <span class="text-lable">年级：</span>
      <el-select
        v-model="listQuery.Grade"
        placeholder="请选择"
        clearable
        class="filter-item"
        style="width: 118px"
      >
        <el-option
          v-for="item in GradeOptions"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <span class="text-lable">所属学院：</span>
      <el-select
        v-model="listQuery.Scollege"
        placeholder="请选择"
        clearable
        class="filter-item"
        style="width: 118px"
      >
        <el-option
          v-for="item in ScollegeOptions"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
       <span class="text-lable">校区：</span>
      <el-select
        v-model="listQuery.Scampus"
        placeholder="请选择"
        clearable
        class="filter-item"
        style="width: 118px"
      >
        <el-option
          v-for="item in ScampusOptions"
          :key="item"
          :label="item"
          :value="item"
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
          <a @click="addStuInfo">
            <img src="../../../views/images/添加.png" style="width: 17px">
            <span class="barIcon">添加</span>
          </a>
        </li>
        <li>
          <a  @click="updateStuInfo">
            <img src="../../../views/images/编辑.png" style="width: 17px">
            <span class="barIcon">修改</span>
          </a>
        </li>
        <!-- style="vertical-align: text-bottom;width: 17px;height: 17px" -->
        <li>
          <a @click="deleteRow">
            <img src="../../../views/images/删除.png"  style="width: 17px">
            <span class="barIcon">删除</span>
          </a>
        </li>
        <li class="exportExcel">
          <a @click="exportExcel">
            <img src="../../../views/images/导出excel.png" style="width: 17px">
            <span class="barIcon">导出excel</span>
          </a>
        </li>
      </ul>
    </div>
    <!-- 表格 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      id="el-table"
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
      @row-dblclick="updateStuInfo"
    >
      <!-- 序号 -->
      <el-table-column label="序号" type="index" align="center" width="50px" />
      <!-- 名称 -->
      <el-table-column label="学生姓名" prop="sname" align="left" width="160px" />
      <!-- 表单编码 -->
      <el-table-column label="学号" prop="sid" align="left" min-width="160px" />
      <!-- 表单版本 -->
      <el-table-column label="性别" prop="ssex" align="center" width="80px" />
      <el-table-column label="年级" prop="grade" align="left" width="80px" />
       <el-table-column label="专业" prop="major" align="left" width="160px" />
      <el-table-column label="所属学院" prop="scollege" align="left" width="160px">
      </el-table-column>
       <!-- 手机号 -->
      <el-table-column label="手机号" prop="sphone" align="left" width="160px" />
      <el-table-column label="校区" prop="scampus" align="left" width="160px" />
      <!-- <el-table-column label="操作" prop="formOperateType" align="center" min-width="80">
        <template slot-scope="{ row }">
          <el-button
            type="text"
            size="mini"
            @click="handleStatus(row,'2')"
          >重置密码</el-button>
        </template>
      </el-table-column> -->
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
import { getStuInfo } from '@/api/user'
import { deleteStuInfo } from '@/api/delete'
import FileSaver from "file-saver";
import XLSX from "xlsx";

export default {
  // name: 'StudentInfo',
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
        pageSize: 10,
        sname:'',
        grade:'',
        scollege:'',
        scampus:''
      },
      nowTime: '', // 当前时间
      GradeOptions:['2015','2016','2017','2018','2019'],
      ScampusOptions:['东莞校区', '湛江校区'], // 状态选择
      ScollegeOptions:['生物医学工程学院', '基础医学院','外国语学院','第一临床医学院','第二临床医学院','第三临床医学院','医学检验学院','护理学院','药学院','人文与管理学院','公共卫生学院'], // 类型
      showReviewer: false,
      dialogFormVisible: false,
      form: {
        grade: '',
        major: '',
        scampus: '',
        scollege: '',
        sid: '',
        sname: '',
        sphone: '',
        ssex: ''
      },
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
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
    // 添加学生信息
    addStuInfo() {
      this.$router.push({ path: '../studentInfo/addstuInfo.vue', name: 'AddStuInfo' })
    },
    // 修改学生信息
    updateStuInfo: function(form) {
      if (this.ableCheck) {
        this.$router.push({
          path: '../studentInfo/updatestuInfo.vue',
          name: 'UpdateStuInfo',
          query: {
            id: this.form.id,
            grade: this.form.grade,
            scampus: this.form.scampus,
            major: this.form.major,
            scollege: this.form.scollege,
            sid: this.form.sid,
            sname: this.form.sname,
            sphone: this.form.sphone,
            ssex: this.form.ssex
          }
        })
      } else {
        this.$confirm('请先选择表单', '查看提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      }
    },
    getList() {
      this.listLoading = true
       let data = {
        page: this.listQuery.pageIndex,
        pagesize: this.listQuery.pageSize
        }
        if(this.listQuery.Sname){
          data.Sname = this.listQuery.Sname
        }
        if(this.listQuery.Grade){
          data.Grade = this.listQuery.Grade
        }
        if(this.listQuery.Scollege){
          data.Scollege = this.listQuery.Scollege
        }
        if(this.listQuery.Scampus){
          data.Scampus = this.listQuery.Scampus
        }
        console.log('调用接口前的data',data)
      getStuInfo(data).then(response => {
        this.list = response.data.content
        this.total = response.data.totalElements
        console.log('测试长度', this.list)
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
        this.getList()
    },
    // 删除
    deleteRow() {
      if (this.ableCheck) {
        this.$confirm('确定删除此行信息?', '删除提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        })
        .then(() => {
          deleteStuInfo(this.form.id)
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
    // 获取时间
    getDate: function() {
      var _this = this
      const yy = new Date().getFullYear()
      const mm = new Date().getMonth() + 1
      const dd = new Date().getDate()
      const hh = new Date().getHours()
      const mf =
        new Date().getMinutes() < 10
          ? '0' + new Date().getMinutes()
          : new Date().getMinutes()
      _this.nowTime = yy + '' + mm + '' + dd + '' + hh + '' + mf// 年月日时分
      console.log(_this.nowTime)
    },
    exportExcel() {
      // let time = new Date();
      this.getDate()
      let wb = XLSX.utils.table_to_book(document.querySelector('#el-table'));
      let wbout = XLSX.write(wb, {
          bookType: 'xlsx',
          bookSST: true,
          type: 'array'
      });
      try {
          FileSaver.saveAs(
              new Blob([wbout], { type: 'application/octet-stream' }),
              `${this.nowTime} 学生信息表.xlsx` // 文件名 this.title+".xlsx"
          );
      } catch (e) {
          if (typeof console !== 'undefined') {
              this.$message.error('导出失败');
              console.log(e, wbout);
          }
      }
      return wbout;
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
