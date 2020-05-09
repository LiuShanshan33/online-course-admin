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
      ref="AnnTable"
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
      <el-table-column label="发布时间" prop="creattime" align="left" width="210px" />
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
      <el-table-column label="发布者" prop="publisher" align="left" width="210px" />
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
      @pagination="getList"
    />
    <!-- 打开的弹窗的内容 -->
    <el-dialog
      title="公告详情"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules">
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
import Pagination from '@/_components/Pagination' // addAnnInfo
import { getAnnInfo, getInfo } from '@/api/user'
import { addAnnInfo, updateAnnInfo } from '@/api/addOrSave'
import { deleteAnnInfo } from '@/api/delete'

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
      list: null,
      total: 0,
      id: '',
      delarr: [],
          // 打开对话框
      ableCheck: false,
      listIndex: 0,
      listLoading: false,
      listQuery: {
        pageIndex: 1,
        pageSize: 10
      },
      formRow: null,
      form: {
        title: '',
        content: '',
        creattime: '',
        publisher: '',
        index: 0
      },
      // 时间
      nowDate: '', // 当前日期
      nowTime: '', // 当前时间
      nowWeek: '', // 当前星期
      nowYear: '', // 当前年份
      userInfo: {
        roleString: '',
        userString: ''
      },
      // 定义属性
      add: false,
      title: undefined,
      content: undefined,
      showReviewer: false,
      dialogFormVisible: false,
      formLabelWidth: '90px',
      rules: {
        content: [{ required: true, message: 'type is required', trigger: 'blur' }],
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
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      console.log(this.listQuery.pageIndex)
      getAnnInfo(this.listQuery.pageIndex).then(response => {
        this.list = response.data.content
        this.total = response.data.totalElements
        console.log('公告response', response)
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
    checkViews(row) {
      this.$refs.AnnTable.toggleRowSelection(row)
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
    // 点击更新后重新赋值表格
    updateAnnouncement(form) {
      this.add = false
      // this.$set(this.list, this.form.index, { creattime: this.nowDate, title: this.form.title, content: this.form.content, publisher: this.userInfo.userString })
      
      updateAnnInfo(this.form.id,this.form.content,this.form.title).then(response => {
            console.log('response成功', response)
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            console.log('修改this.form',this.form)
        })
      this.getList()
      this.$refs['form'].resetFields()
      this.add = false
      this.dialogFormVisible = false
    },
    // 添加
    addForm(form) {
      this.add = true
      this.dialogFormVisible = true
      this.form.title = ''
      this.form.content = ''
      console.log('this.form', this.form)
    },
     // 点击添加后重新赋值表格
    addAnnouncement(forName) {
      console.log('this.form',this.form)
      addAnnInfo(this.form.content,this.form.title).then(response => {
            console.log('response成功', response)
            this.$message({
              type: 'success',
              message: '保存成功'
            })
        })
      this.$refs['form'].resetFields()
      this.add = false
      this.dialogFormVisible = false
      this.getList()
    },
    // 点击取消
    callOf(formName) {
  　　this.$refs['form'].resetFields()
      // 关闭对话框
  　　this.dialogFormVisible = false
    },

    deleteRow(index, rows) { // 删除该行
    this.$confirm('确定删除此行?', '删除提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          deleteAnnInfo(this.formRow.id)
          .then(() => {
              this.getList()
              console.log(this.list)
              this.$message({
                type: 'success',
                message: '删除成功'
              })
          })
        })
    },
    handleSelectionChange(val) {
        this.multipleSelection = val
        this.ableCheck = true
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
            console.log(this.multipleSelection[i].id)
            deleteAnnInfo(this.multipleSelection[i].id)
          }
        }).then(() => {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.getList()
              console.log(this.list)
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
