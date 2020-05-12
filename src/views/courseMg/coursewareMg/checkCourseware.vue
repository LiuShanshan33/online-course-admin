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
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/_components/Pagination' // secondary package based on el-pagination
import { getCwDetail } from '@/api/user'
import { deleteNodeCode } from '@/api/delete'

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
      i = Math.floor(Math.log(val)/ Math.log(k))
      return (val / Math.pow(k ,i)).toPrecision(3) + " " + sizes[i]
    },
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      id: '',
      delarr: [],
      // NodeTable: {},
      ableCheck: false,
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 20
      },
      cwid: this.$route.query.id,
      cwname: this.$route.query.cwname,
      StatusOptions, // 状态选择
      TypeOptions, // 类型
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
      this.$refs.NodeTable.toggleRowSelection(row)
      this.form = row
      this.ableCheck = true
      console.log('有变化么', this.form)
    },
    getList() {
      this.listLoading = true
      const data = {
        page: this.listQuery.pageIndex,
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
    // 添加
    addForm() {
      this.$router.push({
        path: '../QualityCtrlMg/ProcessNode/addNode.vue',
        name: 'AddProcessNode'
      })
    },
    // // 修改节点
    // UpdateNode(index, row) {
    //   this.$router.push({
    //     path: '../QualityCtrlMg/updateNode',
    //     name: 'UpdateNode',
    //     query: {
    //       nodeCode: row.nodeCode,
    //       nodeName: row.nodeName,
    //       pendingNodeName: row.pendingNodeName,
    //       handledNodeName: row.handledNodeName
    //     }
    //   })
    // },
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
