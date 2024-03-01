<template>
  <table class="table-output">
    <thead>
      <tr>
        <th>列1</th>
        <th>列2</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in rows" :key="row.id">
        <td>{{ row.col1 }}</td>
        <td>{{ row.col2 }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: ['rows']
}
</script>

<style scoped>
.table-output-container {
  flex-basis: 45%;
  overflow: auto;
}

.table-output {
  width: 100%;
  border-collapse: collapse;
  /* ...其他样式... */
}
</style>
