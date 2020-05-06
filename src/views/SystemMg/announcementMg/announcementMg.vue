// 公告管理
<template>
  <div class="app-container">
    <!-- 工具栏 -->
    <div class="panelBar">
      <ul class="toolBar">
        <li>
          <a @click="addForm('form')">
            <img src="../../../views/images/添加@2x.png" width="17px" height="17px">
            <span class="barIcon">添加</span>
          </a>
        </li>
        <li>
          <a @click="Alldelete">
            <img src="../../../views/images/删 除@2x.png" width="17px" height="17px">
            <span class="barIcon">删除</span>
          </a>
        </li>
      </ul>
    </div>

    <!-- 表格 -->
    <el-table
      :key="tableKey"
      ref="NodeTable"
      v-loading="listLoading"
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
      :row-class-name="tableRowClassName"
      @row-click="checkViews"
      @row-dblclick="dblAnnounceMore"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55px"
      />
      <!-- 序列号 -->
      <el-table-column label="序号" type="index" align="left" width="80px" />
      <!-- 名称 -->
      <el-table-column label="发布时间" prop="date" align="left" width="210px" />
      <el-table-column label="公告标题" prop="title" align="left" width="210px">
      <!-- <template slot-scope="scope">
          <router-link class="table-link" :to="{name:'CoursewareDetail',query:{}}">{{scope.row.title}}</router-link>
        </template> -->
      </el-table-column>
      <!-- 表单编码 -->
      <el-table-column label="公告内容" prop="content" align="left" width="210px">
        <template slot-scope="scope">
          <a
            class="span-ellipsis"
            :title="scope.row.content"
            @click="announceMore(scope.row,scope.$index)"
          >
            {{ scope.row.content }}
          </a>
        </template>
      </el-table-column>
      <!-- 表单版本 -->
      <el-table-column label="发布者" prop="user" align="left" width="210px" />
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
    />
    <!-- 打开的弹窗的内容 -->
    <el-dialog
      title="公告详情"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form">
        <el-form-item label="公告标题：" prop="title" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off" />
        </el-form-item>
        <el-form-item label="公告内容：" prop="content" :label-width="formLabelWidth">
          <el-input v-model="form.content" type="textarea" autocomplete="off">{{ form.content }}</el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="callOf('form')">取 消</el-button>
        <el-button v-if="!add" type="primary" @click="updateAnnouncement('form')">更 新</el-button>
        <el-button v-if="add" type="primary" @click="addAnnouncement('form')">添 加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/_components/Pagination' // secondary package based on el-pagination
import { getProcessNode } from '@/api/user'
import { deleteNodeCode } from '@/api/delete'
import { mapGetters, mapState } from 'vuex'

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
      list: [{
              date: '2016-05-02',
              title: '王小虎',
              content: '郑州市普陀区金沙江路 1518 弄',
              user: 'superman'
            }, {
              date: '2016-05-04',
              title: '王大虎',
              content: '南京市普陀区金沙江路 1517 弄',
              user: 'superman'
            }, {
              date: '2016-05-01',
              title: '王虎虎',
              content: '北京市普陀区金沙江路 1519 弄',
              user: 'superman'
            }, {
              date: '2016-05-03',
              title: '王二虎',
              content: '上海市普陀区金沙江路 1516 弄',
              user: 'superman'
            }],
      total: 0,
      id: '',
      delarr: [],
      announceContent: '根据近期各位老师对于课件上传功能的意见反馈，我们决定于5月1日0:00 - 24:00对此模块进行更新维护，维护期间此功能暂停开放，请需要上传课件的老师于5月2日登录系统进行上传，感谢各位的理解与合作。',
      // NodeTable: {},
          // 打开对话框
      ableCheck: false,
      listIndex: 0,
      listLoading: false,
      listQuery: {
        pageIndex: 1,
        pageSize: 20,
        nodeName: '',
        nodeCode: '',
        pendingNodeName: '',
        handledNodeName: ''
      },
      formRow: null,
      form: {
        title: '',
        content: '',
        date: '',
        user: '',
        index: 0
      },
      // 时间
      nowDate: '', // 当前日期
      nowTime: '', // 当前时间
      nowWeek: '', // 当前星期
      nowYear: '', // 当前年份
      // 定义属性
      add: false,
      title: undefined,
      content: undefined,
      showReviewer: false,
      dialogFormVisible: false,
      formLabelWidth: '80px',
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      multipleSelection: []
    }
  },
  // 表格高度
  computed: {
    tableHeight() {
      return window.innerHeight - 240
    },
    user1() {
      return this.$store.state.user
    },
    ...mapState(['user']),
    ...mapGetters([
      'empNo',
      'empName',
      'sidebar',
      'avatar',
      'device'
    ])
  },
  created() {
    // this.getList()
    this.getDate()
  },
  methods: {
    checkViews(row) {
      this.$refs.NodeTable.toggleRowSelection(row)
      this.formRow = row
      this.ableCheck = true
      console.log('有变化么', this.formRow)
    },
    // 获取每行索引值
    tableRowClassName({ row, rowIndex }) {
      // 把每一行的索引放进row
      row.index = rowIndex
    },
    // 点击表格内的公告内容查看
    announceMore(row, index) {
      // 打开弹窗
      this.dialogFormVisible = true
      // 记录数据
      this.form = Object.assign({}, row)
      // 记录index
      this.form.index = index
      console.log('点击时间', this.nowDate)
     },
    // 双击修改
    dblAnnounceMore(row) {
      // 打开弹窗
      this.dialogFormVisible = true
      // 记录数据
      this.form = this.formRow
      this.form.index = row.index
      console.log('点击时间', this.nowDate)
     },
     getDate() {
      var _this = this
      const yy = new Date().getFullYear()
      const mm = new Date().getMonth() + 1
      const dd = new Date().getDate()
      const week = new Date().getDay()
      const hh = new Date().getHours()
      const mf =
        new Date().getMinutes() < 10
          ? '0' + new Date().getMinutes()
          : new Date().getMinutes()
      if (week === 1) {
        this.nowWeek = '星期一'
      } else if (week === 2) {
        this.nowWeek = '星期二'
      } else if (week === 3) {
        this.nowWeek = '星期三'
      } else if (week === 4) {
        this.nowWeek = '星期四'
      } else if (week === 5) {
        this.nowWeek = '星期五'
      } else if (week === 6) {
        this.nowWeek = '星期六'
      } else {
        this.nowWeek = '星期日'
      }
      _this.nowTime = hh + ':' + mf// 时间
      _this.nowDate = yy + '-' + mm + '-' + dd// 日期
      _this.nowYear = yy
     },
    // 点击更新后重新赋值表格
    updateAnnouncement(form) {
      this.add = false
      // 根据索引，赋值到list制定的数
      console.log('时间', this.nowDate)
      console.log('当前用户', this.user1.user.empNo)
      // this.list[_index] = this.form
      this.$set(this.list, this.form.index, { date: this.nowDate, title: this.form.title, content: this.form.content, user: this.user1.user.empNo })
      console.log('确定前的this.form', this.form)
      this.dialogFormVisible = false
    },
    // 添加
    addForm(form) {
      this.add = true
      this.dialogFormVisible = true
      this.form.user = this.user1.user.empNo
      this.form.date = this.nowDate
      this.form.title = ''
      this.form.content = ''
      console.log('this.form', this.form)
    },
     // 点击添加后重新赋值表格
    addAnnouncement(forName) {
      console.log('时间', this.nowDate)
      console.log('当前用户', this.user1.user.empNo)
      this.list.push({ date: this.nowDate, user: this.form.user, title: this.form.title, content: this.form.content })
      console.log('点击添加前', this.form)
      this.$refs['form'].resetFields()
      this.add = false
      this.dialogFormVisible = false
    },
    // 点击取消
    callOf(formName) {
  　　this.$refs['form'].resetFields()
      // 关闭对话框
  　　this.dialogFormVisible = false
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
          for (let i = 0; i < this.multipleSelection.length; i++) {
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
  text-decoration: underline;
}
// 下划线蓝色字
// .table-link{
//   color:#0585c0;
//   text-decoration: underline;
// }
</style>
