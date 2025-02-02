<template>
  <div class="search-and-recommend">
    <div class="left-section">
      <Search @find-alternatives="findAlternatives" />
    </div>
    <div class="right-section">
      <Recommend ref="recommend" />
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
  methods: {
    async findAlternatives(product) {
      await this.$refs.recommend.loadAlternatives(product);
    },
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
