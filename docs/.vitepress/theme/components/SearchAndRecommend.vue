<template>
  <div class="search-and-recommend">
    <div class="left-section">
      <Search />
    </div>
    <div class="right-section">
      <Recommend />
    </div>
  </div>
</template>

<script>
import Search from "./Search.vue";
import Recommend from "./Recommend.vue";

export default {
  name: "SearchAndRecommend",
  components: {
    Search,
    Recommend,
  },
};
</script>

<style scoped>
.search-and-recommend {
  display: flex;
  flex-direction: row;
}

.left-section,
.right-section {
  flex: 1;
  padding: 10px;
}

@media (max-width: 768px) {
  .search-and-recommend {
    flex-direction: column;
  }
}
</style>
