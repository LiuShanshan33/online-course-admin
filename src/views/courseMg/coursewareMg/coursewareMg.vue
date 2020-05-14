// 课件管理
<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="text-lable">课程名称：</span>
      <el-input
        v-model="listQuery.coursename"
        placeholder="请输入课程名称"
        style="width: 145px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleSelect"
      />
      <span class="text-lable">课程类型：</span>
      <el-select
        v-model="listQuery.Type"
        placeholder="请选择"
        clearable
        class="filter-item"
        style="width: 118px"
      >
        <el-option
          v-for="item in TypeOptions"
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
          <a @click="addForm">
            <img src="../../../views/images/添加.png" width="17px" height="17px">
            <span class="barIcon">添加</span>
          </a>
        </li>
        <li>
          <a @click="checkCourseware">
            <img src="../../../views/images/查看.png" width="17px" height="17px">
            <span class="barIcon">查看</span>
          </a>
        </li>
      </ul>
    </div>

    <!-- 表格 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      ref="courseTable"
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
      @row-dblclick="checkCourseware"
    >
      <!-- 序列号 -->
      <el-table-column label="序号" type="index" align="left" width="80px" />
      <!-- 名称 -->
      <el-table-column label="课程文件名" prop="coursename" align="left" width="200px">
      <template slot-scope="scope">
          <img src="../../../views/images/文件夹.png" style="width:16px;vertical-align: text-bottom;">
          <router-link class="table-link" :to="{name:'CoursewareDetail',query:{ id:scope.row.id, coursename:scope.row.coursename }}">{{scope.row.coursename}}</router-link>
        </template>
      </el-table-column>
      <!-- 表单编码 -->
      <el-table-column label="课程类型" prop="type" align="center" width="100px" />
      <!-- 表单版本 -->
      <el-table-column label="面向专业" prop="subject" align="left" width="200px" />
      <el-table-column label="授课教师" prop="principal" align="left" width="120px" />
      <el-table-column label="课程简介" prop="introduction" align="left" width="160px">
        <template slot-scope="scope">
          <span
            class="span-ellipsis"
            :title="scope.row.introduction"
          >
            {{ scope.row.introduction }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="creattime" align="left" width="160px" />
      <el-table-column label="操作" prop="formOperateType" align="center" min-width="100px">
        <template slot-scope="scope">
          <!-- <el-button
            type="text"
            size="mini"
            @click="UpdateNode(scope.$index,scope.row)"
          >修改</el-button> -->
          <el-button
            type="text"
            size="mini"
            @click.native.prevent="deleteRow(scope.$index)"
          >删除</el-button>
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
import { getCourse } from '@/api/user'
import { deleteCourse } from '@/api/delete'


export default {
  // name: 'CoursewareMg',
  components: { Pagination },
  directives: { waves },
  filters: {
    // statusFilter(status) {
    //   return StatusKeyValue[status]
    // },
    // typeFilter(type) {
    //   return TypeKeyValue[type]
    // }
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
        pageSize: 10
      },
      TypeOptions:['必修','选修'], // 类型
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
      // this.$refs.NodeTable.toggleRowSelection(row)
      this.form = row
      this.ableCheck = true
      console.log('有变化么', this.form)
    },
    getList() {
      this.listLoading = true
      let data = {
        page: this.listQuery.pageIndex,
        pagesize: this.listQuery.pageSize
      }
      if(this.listQuery.Type){
          data.type = this.listQuery.Type
        }
        if(this.listQuery.coursename){
          data.coursename = this.listQuery.coursename
        }
      console.log('调用接口前的data',data)
      getCourse(data).then(response => {
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
    // 添加
    addForm() {
      this.$router.push({
        path: '../courseMg/coursewareMg/addCourse.vue',
        name: 'AddCourse'
      })
    },
    // 点击某行查看跳转
    checkCourseware() {
      if (this.ableCheck) {
       this.$router.push({
          path: '../coursewareMg/coursewareDetail.vue',
          name: 'CoursewareDetail',
          query: {
            id: this.form.id,
            coursename: this.form.coursename
          }
        })
      } else {
        this.$confirm('请先选择数据', '查看提示', {
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
    deleteRow(index, rows) { // 删除该行
    this.$confirm('确定删除此行?', '删除提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          deleteCourse(this.form.id)
          .then(() => {
              this.getList()
              this.$message({
                type: 'success',
                message: '删除成功'
              })
          })
        })
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
// 显示不全省略号样式
.span-ellipsis {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
// 下划线蓝色字
// .table-link{
//   color:#0585c0;
//   text-decoration: underline;
// }
</style>
