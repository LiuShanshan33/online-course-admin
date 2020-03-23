<template>
    <div>
      <el-form :model="data" ref="'nodeForm' + '{{data.nodeIndexNo}}'">
          <el-form-item label="节点">{{data.nodeIndexNo}}</el-form-item>
          <el-form-item label="节点名称：">
            {{data.nodeCode}}
              <!--<template>
              <select>
                <option
                  v-for="item in NodeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></option>
              </select>
            </template>-->
          </el-form-item>
          <el-form-item label="关联角色：">
            <el-button style="width:75px;margin-bottom:12px;">
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
              <el-table-column label="角色编码" prop="roleCode" align="center" min-width="100px" />
              <!--<el-table-column
                label="是否拥有查看APP管理权限"
                prop="roleManager"
                align="center"
                min-width="100px"
              />-->
              <el-table-column
                label="是否需要组权限"
                prop="needGroupAuth"
                align="center"
                min-width="200px"
              />
              <el-table-column
                label="是否需要科室权限"
                prop="needDeptAuth"
                align="center"
                min-width="200px"
              />

              <el-table-column label="操作" align="center" min-width="80px">
                <template>
                  <el-button type="text" size="mini" @click="handleStatus(row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
    </div>
</template>

<script>
  import ScrollPane from "../../../layout/components/TagsView/ScrollPane";
  export default {
    name: "addNode",
    components: {ScrollPane},
    data() {
      return {
        liveClass:[],
      }
    },
    props: {
      data: Object
    },
    mounted() {
      this.$emit('handleChildClass', this.data)
    },
    watch:{
      //监听双向绑定数据变化  调用handleOn方法  存入localStorage 做到双向绑定
      data:{
        handler:function (val, oldVal) {
          for (var key in val) {
            if (val.hasOwnProperty(key)) {
              this.$emit('handleOn',{key:key,val:val[key]})
            }
          }
        },
        deep:true
      }
    },
  }
</script>

<style scoped>

</style>
