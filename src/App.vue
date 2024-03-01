<template>
  <div id="app">
    <div class="navigation">
      <div class="nav-title">Table EX</div>
      <button @click="goToView('ViewOne')">View One</button>
      <button @click="goToView('ViewTwo')">View Two</button>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    goToView(viewName) {
      this.$router.push({ name: viewName });
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
  width: 100%;
  overflow: hidden; /* Prevent scrolling on the entire app */
}

#app {
  display: flex;
}

.navigation {
  width: 200px;
  background-color: #2c3e50;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.nav-title {/* 这个是导航栏上部字 */
  font-size: 24px;   /* Adjust the font size as needed */
  color: #FFFFFF; /* This is white color, adjust if needed */
  font-weight: bold; /* Makes the font bold */
  margin: 30px 0;   /* Adjust the space from the top and the first button */
  padding-top: 20px; /* Space from the top of the navigation bar */
}

button {
  background-color: #34495e;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 20px 0; /* Increased space between buttons */
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
  width: 70%; /* Controls the button width to not span the full width of the nav */
}

button:hover {
  background-color: #4a69bd;
}

.content {
  flex: 1; /* Fill the remaining space */
  background-color: #ecf0f1;
  /* No need to set width or height here as flex: 1 takes care of it */
}
</style>
