<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="text-lable">护理单元：</span>
      <!-- <el-autocomplete
        v-model="listQuery.deptName"
        :fetch-suggestions="querySearchGroup"
        placeholder="请选择"
        clearable
        class="filter-item"
        style="width: 168px;margin-top:0px"
        @select="selectGroup"
        @focus="groupListMe"
      /> -->
      <el-select v-model="listQuery.deptName" clearable filterable placeholder="请选择" style="top: -6px;">
        <el-option v-for="o in DeptOptions" :key="o.code" :label="o.name" :value="o.name" />
      </el-select>
      <span class="text-lable">宣教标题：</span>
      <el-input
        v-model="listQuery.title"
        placeholder="请输入"
        style="width: 118px;"
        clearable
        class="filter-item"
        @keyup.enter.native="handleSelect"
      />
      <span class="text-lable">状态：</span>
      <el-select
        v-model="listQuery.state"
        placeholder="请选择"
        clearable
        class="filter-item"
        style="width: 118px"
      >
        <el-option
          v-for="item in TypeOptions"
          :key="item.key"
          :label="item.display_name"
          :value="item.key"
        />
      </el-select>
      <el-button v-waves class="filter-item search-btn" type="primary" @click="handleSelect">
        <span style="height:17px;line-height:17px;font-size:12px;padding-bottom:6px">搜索</span>
      </el-button>
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
          <a @click="updateForm">
            <img src="../../../views/images/编辑@2x.png" width="17px" height="17px">
            <span class="barIcon">修改</span>
          </a>
        </li>
        <li>
          <a :model="list" @click="deleteRow">
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
      style="width: 100%;"
      :header-cell-style="{background:'#F0F5F7', color:'#333333'}"
      :cell-style="{padding:'3px 2px'}"
      @row-click="checkViews"
      @row-dblclick="updateForm"
    >
      <el-table-column label="护理单元" prop="deptCode" align="center" width="140px" />
      <el-table-column label="宣教类别" prop="type" align="left" width="180px" />
      <el-table-column label="宣教标题" prop="title" align="left" min-width="100px" />
      <el-table-column label="创建人工号" prop="creatorNo" align="center" width="100px" />
      <el-table-column label="创建人名字" prop="creatorName" align="center" width="100px" />
      <el-table-column label="创建时间" prop="createTime" align="center" width="180px" />
      <el-table-column label="状态" prop="state" align="center" width="70px">
        <template slot-scope="{row}">{{ row.state ==='0'?'已启用':'已禁用' }}</template>
      </el-table-column>
      <el-table-column
        label="操作"
        prop="control"
        align="center"
        min-width="160px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button v-if="row.state!='1'" type="text" size="mini" @click="handleStatus(row,'1')">禁用</el-button>
          <el-button v-if="row.state!='0'" type="text" size="mini" @click="handleStatus(row,'0')">启用</el-button>
          <el-button type="text" size="mini" @click="getMissionPage($index,row)">模板展示</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 记录条数 分页-->
    <pagination
      v-show="total>0"
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
import { getPage_4, getDictInfo, delMissionTemplate } from '@/api/user'
import { enable, disable } from '@/api/columnBtn'
// 状态选择
const TypeOptions = [
  { key: '0', display_name: '已启用' },
  { key: '1', display_name: '已禁用' }
]

const TypeKeyValue = TypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'MissionTemplate',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      id: '',
      listQuery: {
        id: '',
        pageIndex: 1,
        pageSize: 20,
        deptCode: '',
        deptName: '',
        title: '',
        state: ''
      },
      content: '',
      groupArr: [],
      groupList: [],
      TypeOptions, // 状态选择
      DeptOptions: [],
      ableCheck: false,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: [],
      showReviewer: false,
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
    'listQuery.deptName': {
      deep: true,
      handler: function(newVal, oldVal) {
        this.groupArr = []// 这是定义好的用于存放下拉提醒框中数据的数组
        var len = this.groupList.length// groupList
        var arr = []
        for (var i = 0; i < len; i++) { // 根据输入框中的值进行模糊匹配
          if (this.groupList[i].name.indexOf(this.listQuery.deptName) >= 0) {
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
    this.groupListMe()
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
    // 获取护理单元列表
    getOptionsData() {
      getDictInfo().then(res => {
        this.DeptOptions = res.data.list
        console.log('treeList', this.DeptOptions)
      })
    },
    getList() {
      this.listLoading = true
      const data = {
        id: this.listQuery.id,
        pageIndex: this.listQuery.pageIndex,
        pageSize: this.listQuery.pageSize,
        title: this.listQuery.title,
        state: this.listQuery.state,
        deptCode: this.listQuery.deptCode
      }
      getPage_4(data).then(response => {
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
    // 搜索
    handleSelect() {
      if (this.listQuery.state !== '' && this.listQuery.title !== '' && this.listQuery.deptCode !== '') {
        this.listQuery.page = 1
        this.getList()
        this.$confirm('未搜到相关表单！', '搜索提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      } else {
        this.listQuery.page = 1
        this.getList()
      }
    },
    // 点击某行事件
    checkViews(data) {
      this.form = data
      this.ableCheck = true
    },
    // 添加
    addForm() {
      this.$router.push({
        path: '../NursingSet/create-template',
        name: 'Create-Template'
      })
    },
    // 修改
    updateForm(form) {
      if (this.ableCheck) {
        this.$router.push({
          path: '../NursingSet/update-missionTemplate',
          name: 'UpdateMissionTemplate',
          query: {
            deptCode: this.form.deptCode,
            title: this.form.title,
            type: this.form.type,
            state: this.form.state,
            content: this.form.content
          }
        })
      } else {
        this.$confirm('请先选择表单', '查看提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      }
    },
    // 删除该行
    // deleteRow(id, rows) {
    //   this.$confirm('确定删除此表单?', '禁用提示', {
    //     cancelButtonText: '取消',
    //     confirmButtonText: '确定',
    //     type: 'warning'
    //   }).then(() => {
    //     console.log(id)
    //     delMissionTemplate(id).then(response => {
    //       if (response.data.code === 200) {
    //         this.list.splice(id, 1)
    //         this.$message({
    //           type: 'success',
    //           message: '删除成功'
    //         })
    //       }
    //     })
    //   })
    //     .catch(() => {
    //       this.$message({
    //         type: 'info',
    //         message: '已取消'
    //       })
    //     })
    // },
    deleteRow() {
      if (this.ableCheck) {
        this.$confirm('确定删除此表单?', '删除提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          delMissionTemplate(this.form.id)
            .then(() => {
              this.getList()
              this.$message({
                type: 'success',
                message: '删除成功'
              })
            })
        })
      } else {
        this.$confirm('请先选择表单', '查看提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      }
    },
    // 禁用启用状态
    handleStatus(row, state) {
      if (row.state === '0') {
        this.$confirm('确定禁用此表单?', '禁用提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        })
          .then(() => {
            enable(row.id)
            row.state = state
            this.$message({
              type: 'success',
              message: '操作成功'
            })
          })
      } else {
        this.$confirm('确定启用此表单?', '启用提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        })
          .then(() => {
            disable(row.id)
            row.state = state
            this.$message({
              type: 'success',
              message: '操作成功'
            })
          })
      }
      // {
      //   disable(row.id)
      //   row.state = state
      // }
    },
    // 模板展示
    getMissionPage(index, row) {
      this.$router.push({
        path: '../NursingSet/missionPage',
        name: 'MissionPage',
        query: {
          content: row.content
        }
      })
    }
  }
}
</script>
