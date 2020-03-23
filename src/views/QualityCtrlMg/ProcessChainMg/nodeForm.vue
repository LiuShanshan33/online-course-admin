// 添加流程角色
<template>
  <el-form ref="nodeList" v-model="nodeList">
    <el-form-item>
      <span style="color:#419793;">节点{{data.nodeIndexNo}}</span>
    </el-form-item>
    <el-form-item label="节点名称：">
      <template>
        <el-select v-model="data.nodeCode" style="width:300px">
          <el-option 
          v-for="item in NodeOptions" 
          :key="item.nodeCode" 
          :label="item.nodeCode + ',' + item.nodeName" 
          :value="item.nodeCode + ',' + item.nodeName" >
          </el-option>
        </el-select>
        <el-button style="width:75px;" @click="addNewNode">
          <i class="el-icon-plus">新增节点</i>
        </el-button>
      </template>
    </el-form-item>
    <el-form-item label="关联角色：">
      <el-button style="width:75px;margin-bottom:12px;" @click="AddItems">
        <i class="el-icon-plus">添加</i>
      </el-button>
    </el-form-item>
    <el-form-item>
      <el-table
        :data="data.roleList"
        size="mini"
        border
        fit
        stripe
        highlight-current-row
        style="width: 70%;"
        :header-cell-style="{background:'#F0F5F7', color:'#333333'}"
        :cell-style="{padding:'3px 2px'}"
      >
        <el-table-column label="序列号" type="index" align="center" width="60px" />
        <el-table-column label="角色名称" prop="data.roleCode" align="center" min-width="200px">
          <template slot-scope="scope">
            <el-select v-model="scope.row.roleCode">
              <el-option
                v-for="item in roNmList"
                :key="item.roleCode"
                :label="item.roleName"
                :value="item.roleCode"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="角色编码" prop="data.roleCode" align="center" min-width="120px">
          <template slot-scope="{row}">
            <el-form-item prop="data.roleCode" class="table-form-item">
              <el-input v-show="true" v-model="row.roleCode" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column
          label="是否拥有查看APP管理权限"
          prop="data.roleManage"
          align="center"
          min-width="100px"
        >
          <template slot-scope="{row}">
            <el-form-item prop="data.roleManage" class="table-form-item">
              <el-input v-show="true" v-model="row.roleManage" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="是否需要组权限" prop="data.needGroupAuth" align="center" min-width="120px">
          <template slot-scope="{row}">
            <el-form-item prop="data.needGroupAuth" class="table-form-item">
              <el-input v-show="true" v-model="row.needGroupAuth?'是': '否'" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="是否需要科室权限" prop="data.needDeptAuth" align="center" min-width="120px">
          <template slot-scope="{row}">
            <el-form-item prop="data.needDeptAuth" class="table-form-item">
              <el-input v-show="true" v-model="row.needDeptAuth ? '是': '否'" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="80px">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="deleteRow(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
  </el-form>
</template>

<script>
import { getAllNode, getRoleByCode, getAllRole } from '@/api/addOrSave' // 保存修改接口

export default {
  name: "nodeForm",
  data() {
    return {
      nodeList: [],
      nodeIndexNo: '',
      roleList: [],//角色表格
      roNmList: [],//角色名称下拉选项
      NodeOptions: [],//节点下拉选项
      roCd: ''
    }
  },
  created() {
    this.getNodeList()
    this.getRoleList()
  },
  props: {
    data: Object
  },
  watch: {
    //监听双向绑定数据变化  调用handleOn方法  存入localStorage 做到双向绑定
    data: {
      handler: function (val, oldVal) {
        for (var key in val) {
          if (val.hasOwnProperty(key)) {
            this.$emit('handleOn', { key: key, val: val[key] })
          }
        }
      },
      deep: true
    }
  },
  methods: {
    // 获取节点下拉选项
    getNodeList() {
      getAllNode().then(res => {
        res.data.forEach(item => {
          this.NodeOptions.push({
            nodeCode:item.nodeCode,
            nodeName:item.nodeName
          })
        })
      })
      getAllRole().then(res =>{
        res.data.forEach(item => {
          this.roNmList.push({
            roleName:item.roleName,
            roleCode:item.roleCode,
            roleManage:item.roleManage
          })
        })
      })
    },
    // 获取角色表格
    getRoleList() {
      this.data.roleList.forEach(item =>{
      console.log('code',item.roleCode)
        getRoleByCode(item.roleCode).then(res => {
          item.roleManage = res.data.roleManage
        console.log('res',res.data)
        // res.data.forEach(item1 => {
        //   this.roNmList.push(item1)
        //   this.data.roleList.forEach(item2 => {
        //     this.roCd = item2.roleCode
        //     if (item1.roleCode == this.roCd) {
        //       item2.roleName = item1.roleName
        //       item2.roleManage = item1.roleManage
        //     }
        //   })
        // })
      })
      
      })
    },
    // 添加节点-> 跳转到流程节点的添加页面
    addNewNode() {
      this.$router.push({
        path: '../QualCtrl/addProcessNode',
        name: 'AddProcessNode'
      })
    },
    // 添加一行角色
    AddItems() {
      this.data.roleList.push({
        roleName: '',
        roleCode: '',
        roleManage: '',
        needGroupAuth: '',
        needDeptAuth: ''
      })
    },
    // 删除该行
    deleteRow(index, rows) {
      this.data.roleList.splice(index, 1)
    },
  }

}
</script>
