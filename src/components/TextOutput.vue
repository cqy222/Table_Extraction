<template>
  <div class="text-output">
    {{ text }}
  </div>
</template>

<script>
export default {
  props: ['text']
}
</script>

<style scoped>
.text-output {
  padding: 10px;
  border: 1px solid #ccc;
  min-height: 100px;
}
</style>
