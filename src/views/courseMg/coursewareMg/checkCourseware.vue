// 查看课件详情
<template>
  <div class="app-container">
    <div class="cwname">
      <div class="content-title">{{cwname}}</div>
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
          <a @click="Alldelete">
            <img src="../../../views/images/删除.png" width="17px" height="17px">
            <span class="barIcon">删除</span>
          </a>
        </li>
      </ul>
    </div>
    <!-- 表格 -->
    <el-table
      :key="tableKey"
      ref="Courseware"
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
      @row-click="checkViews"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55px"
      />
      <!-- 序列号 -->
      <el-table-column label="序号" type="index" align="left" width="80px" />
      <!-- 名称 -->
      <el-table-column label="文件名称" prop="teafilename" align="left" min-width="200px" />
      <el-table-column label="文件类型" prop="teafiletype" align="left" width="210px" />
      <el-table-column label="文件大小" prop="teafilesize" align="left" width="210px">
        <template slot-scope="scope">
          <span>{{scope.row.teafilesize | filterType}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="formOperateType" align="center" min-width="120px">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
          >下载</el-button>
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
     <!-- 打开的弹窗的内容 -->
    <el-dialog
      title="添加课件"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="上传课件">
          <input type="file" multiple="multiple" ref="fileInt" value="changeHandle" id="changeHandle" @change="fileChange">
          <p v-if="showFileList" class="comment"><pre>{{ fileNameAll }}</pre></p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="callOf('form')">取 消</el-button>
        <el-button type="primary" @click="AddFiles">添 加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/_components/Pagination' // 
import { getCwDetail } from '@/api/user'
import { addCwFile } from '@/api/addOrSave'
import { deleteCwFile } from '@/api/delete'

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
  name: 'CheckCourseware',
  components: { Pagination },
  directives: { waves },
  filters: {
    filterType(val) {
      if(val ===0 )return "0 B"
      let k = 1024
      let sizes = ["B","KB","MB","GB","TB","PB","EB"]
      let i = Math.floor(Math.log(val)/ Math.log(k))
      return (val / Math.pow(k ,i)).toPrecision(3) + " " + sizes[i]
    },
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      id: '',
      form: {},
      fileList:[],
      ableCheck: false,
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 20
      },
      fileNameAll:"",
      cwid: this.$route.query.id,
      cwname: this.$route.query.cwname,
      StatusOptions, // 状态选择
      TypeOptions, // 类型
      showFileList: false,
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
      this.$refs.Courseware.toggleRowSelection(row)
      this.form = row
      this.ableCheck = true
      console.log('有变化么', this.form)
    },
    getList() {
      this.listLoading = true
      const data = {
        page: this.listQuery.pageIndex,
        pagesize: this.listQuery.pageSize,
        cwid: this.cwid
      }
      console.log('ceshi接口getCwDetail', data)
      getCwDetail(data).then(response => {
        this.list = response.data.content
        this.total = response.data.totalElements
        console.log('测试长度', response.data)
        if (this.listQuery.length === 0) {
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
    // 添加打开对话框
    addForm() {
      this.dialogFormVisible = true
    },
    AddFiles() {
        // const file = this.$refs.fileInt.files[0]
        // let count = this.$refs.fileInt.files.length
        // console.log('count',count)
        // 将文件循环添加到fileList[]
        for (let i = 0; i < this.$refs.fileInt.files.length; i++) {
          this.fileList.push(this.$refs.fileInt.files[i])
        }
        console.log('fileList',this.fileList)
        // 循环append添加
        const data = new FormData()
        this.fileList.forEach(function (file) {
          data.append('file',file)
        })
        console.log(data.getAll('file'))
        // data.append('file', file)
        data.append('cwid', this.cwid)
        console.log('上传前的data',data)
        addCwFile(data).then(res => {
          console.log(res)
          this.$message({
            type: 'success',
            message: '上传成功'
          })
          this.dialogFormVisible = false
          this.getList()
        }).catch(err => {
          console.log(err);
        })
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
    fileChange(){
        this.fileNameAll = ''
         for(var i = 0; i < this.$refs.fileInt.files.length; i++){
          this.fileNameAll += this.$refs.fileInt.files[i].name + "\n"
        }
        if(this.$refs.fileInt.files.length>1){
          this.showFileList = true
        }else{
          this.showFileList = false
        }      
        console.log('fileNameAll',this.fileNameAll)
    },
    deleteRow(index, rows) { // 删除该行
    this.$confirm('确定删除此行?', '删除提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          deleteCwFile(this.form.id)
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
        this.ableCheck = true
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
            console.log(this.multipleSelection[i].id)
            deleteCwFile(this.multipleSelection[i].id)
          }
        }).then(() => {
              console.log(this.list)
              this.$message({
                type: 'success',
                message: '删除成功'
              })
            this.getList()
          })
      } else {
        this.$confirm('请先选择表单', '删除提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      }
    },

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
.cwname{
  margin: 0 5px 5px 5px;
  .content-title {
    width: 120px;
    height: 30px;
    font-size: 15px;
    font-family: STSongti-SC-Black, STSongti-SC;
    font-weight: 900;
    color: rgba(51, 51, 51, 1);
    line-height: 25px;
    border-bottom: 3px solid #58d1b3;
  }
}
</style>
