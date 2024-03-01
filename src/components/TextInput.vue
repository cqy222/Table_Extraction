<template>
    <div class="text-input">
      <input type="text" :placeholder="placeholder" v-model="inputValue">
      <button @click="submitValue">提交</button>
    </div>
  </template>
  
  <script>
  export default {
    props: ['placeholder'],
    data() {
      return {
        inputValue: ''
      }
    },
    methods: {
      submitValue() {
        this.$emit('submit', this.inputValue);
      }
    }
  }
  </script>
  
  <style scoped>
  .text-input {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  </style>
  