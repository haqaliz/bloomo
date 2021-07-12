<template>
  <div class="fluid-container not-found">
    <it-icon name="search" />
    <h2>Not Found :(</h2>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
};
</script>

<style lang='scss'>
  .not-found {
    h2 {
      margin-left: $large-gap;
    }
  }
</style>
