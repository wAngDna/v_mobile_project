<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.iskeepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.iskeepAlive"></router-view>
  </div>
</template>

<style lang="less">

</style>
