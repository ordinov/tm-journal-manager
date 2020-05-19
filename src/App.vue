<template>
  <div id="app">
    <logs-table></logs-table>
  </div>
</template>

<script>
import LogsTable from './components/LogsTable.vue'
export default {
  components: { LogsTable }
}
</script>

<style>
#app {
  padding: 20px!important;
}
</style>