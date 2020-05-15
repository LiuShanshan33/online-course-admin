// 教师基本信息
<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="text-lable">姓名：</span>
      <el-input
        v-model="listQuery.Tname"
        placeholder="请输入"
        style="width: 118px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleSelect"
      />
      <span class="text-lable">工号：</span>
      <el-input
        v-model="listQuery.Tid"
        placeholder="请输入"
        style="width: 118px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleSelect"
      />
      <span class="text-lable">职称：</span>
      <el-select
        v-model="listQuery.Positon"
        placeholder="请选择"
        clearable
        class="filter-item"
        style="width: 118px"
      >
        <el-option
          v-for="item in PositonOptions"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <span class="text-lable">所属学院：</span>
      <el-select
        v-model="listQuery.Tcollege"
        placeholder="请选择"
        clearable
        class="filter-item"
        style="width: 118px"
      >
        <el-option
          v-for="item in TcollegeOptions"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-button v-waves class="filter-item search-btn" type="primary" @click="getList">
        <span>搜索</span>
      </el-button>
    </div>
    <!-- 工具栏 -->
    <div class="panelBar">
      <ul class="toolBar">
        <li>
          <a @click="addTeacherInfo">
            <img src="../../../views/images/添加.png" style="width: 17px">
            <span class="barIcon">添加</span>
          </a>
        </li>
        <li>
          <a @click="updateTeacherInfo">
            <img src="../../../views/images/编辑.png" style="width: 17px">
            <span class="barIcon">修改</span>
          </a>
        </li>
        <!-- style="vertical-align: text-bottom;width: 17px;height: 17px" -->
        <li>
          <a @click="deleteRow">
            <img src="../../../views/images/删除.png" style="width: 17px">
            <span class="barIcon">删除</span>
          </a>
        </li>
        <!-- 导出功能 -->
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
      id="el-table"
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
      @row-dblclick="updateTeacherInfo"
    >
      <!-- 序号 -->
      <el-table-column label="序号" type="index" align="center" width="50px" />
      <!-- 名称 -->
      <el-table-column label="教师姓名" prop="tname" align="left" width="160px" />
      <!-- 表单编码 -->
      <el-table-column label="工号" prop="tid" align="left" min-width="160px" />
      <!-- 表单版本 -->
      <el-table-column label="性别" prop="tsex" align="center" width="80px" />
      <el-table-column label="职称" prop="positon" align="left" width="160px" />
      <el-table-column label="所属学院" prop="tcollege" align="left" width="160px" />
      <!-- 手机号 -->
      <el-table-column label="手机号" prop="tphone" align="left" min-width="200px" />
      <el-table-column v-if="resetShow" label="操作" prop="formOperateType" align="center" min-width="80">
        <el-button
          type="text"
          size="mini"
          @click="resetPwd"
        >重置密码</el-button>
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
import { getInfo, selectTeacher, resetTeaPwd } from '@/api/user'
import { deleteTeaInfo } from '@/api/delete'
import FileSaver from "file-saver";
import XLSX from "xlsx";


export default {
  // name: 'Assess',
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
        Tname:'',
        Tid:'',
        Positon:'',
        Tcollege:''
      },
      userInfo: {
        roleString: '',
        userString: ''
      },
      nowDate: '', // 当前日期
      nowTime: '', // 当前时间
      nowWeek: '', // 当前星期
      nowYear: '', // 当前年份
      PositonOptions: ['助教', '讲师','副教授','教授'], // 职称选择
      // campusOptions: ['湛江校区', '东莞校区'], // 校区选择
      TcollegeOptions: ['生物医学工程学院', '基础医学院','外国语学院','第一临床医学院','第二临床医学院','第三临床医学院','医学检验学院','护理学院','药学院','人文与管理学院','公共卫生学院'], // 学院选择
      showReviewer: false,
      dialogFormVisible: false,
      resetShow:false,
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
    this.getUserInfo()
  },
  methods: {
    // 判断是否选择某行
    checkViews: function(data) {
      this.form = data
      this.ableCheck = true
      console.log('选中行的信息', this.form)
      // console.log(this.form.title)
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
      // _this.nowTime = hh + ':' + mf// 时间
      _this.nowDate = yy + mm + '月' + dd + '日' // 日期
      _this.nowTime = yy + '' + mm + '' + dd + '' + hh + '' + mf// 年月日时分
      console.log(_this.nowTime)
    },
    // 添加教师信息
    addTeacherInfo() {
      this.$router.push({ path: '../teacherInfo/addteacherInfo.vue', name: 'AddTeacherInfo' })
    },
    // 修改教师信息
    updateTeacherInfo: function(form) {
      if (this.ableCheck) {
        this.$router.push({
          path: '../teacherInfo/updateteacherInfo.vue',
          name: 'UpdateTeacherInfo',
          query: {
            id: this.form.id,
            tphone: this.form.tphone,
            tname: this.form.tname,
            tid: this.form.tid,
            tcampus: this.form.tcampus,
            tsex: this.form.tsex,
            positon: this.form.positon,
            tcollege: this.form.tcollege
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
        if(this.listQuery.Tname){
          data.Tname = this.listQuery.Tname
        }
        if(this.listQuery.Tid){
          data.Tid = this.listQuery.Tid
        }
        if(this.listQuery.Positon){
          data.Positon = this.listQuery.Positon
        }
        if(this.listQuery.Tcollege){
          data.Tcollege = this.listQuery.Tcollege
        }
        console.log('调用接口前的data',data)
      selectTeacher(data).then(response => {
        console.log('接口测试', response)
        this.list = response.data.content
        this.total = response.data.totalElements
        console.log('this.list', this.list)
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
    getUserInfo() {
      getInfo().then(response => {
        console.log('教师管理用户角色', response.data)
        this.userInfo = response.data.data
        console.log('this.userInfo', this.userInfo)
        this.UserRole()
        // this.$store.dispatch('/user', res.data.data)
      })
    },
    UserRole(){
    console.log('this.userInfo.roleString', this.userInfo.roleString)
      if(this.userInfo.roleString === "管理员"){
        this.resetShow = true
      }else{
        this.resetShow = false
      }
    },
    // 重置密码
    resetPwd() {
      this.$confirm('确定重置该用户的密码吗?', '重置密码提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        console.log('',this.form.tid)
        let data = {
        username: this.form.tid
        }
        resetTeaPwd(data).then(res => {
      })
      })
        .then(() => {
            this.$message({
              type: 'success',
              message: '密码已重置'
            })
        })
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
          deleteTeaInfo(this.form.id)
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
    //  `名字 ${time.getTime()}.xlsx` // 文件名
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
              `${this.nowTime} 教师信息表.xlsx` // 文件名 this.title+".xlsx"
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
