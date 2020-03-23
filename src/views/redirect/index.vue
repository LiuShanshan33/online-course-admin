<script>
// export default {
//   beforeCreate() {
//     const { query } = this.$route
//     const path = query.path
//     this.$router.replace({ path: path })
//   },
//   mounted() {
//     // 页面刷新前缓存和赋值
//     this.beforeUnload()
//   },
//   created() {
//     const { params, query } = this.$route
//     const { path } = params
//     this.$router.replace({ path: '/' + path, query })
//   },
//   render: function(h) {
//     return h() // avoid warning message
//   }
// }
// </script>
<script>
export default {
  beforeCreate() {
    const { query } = this.$route
    const path = query.path
    this.$router.replace({ path: path })
  },
  mounted() {},
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>

