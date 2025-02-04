<template>
  <HorizontalContainer>
    <HeaderCard title="Canadian Alternatives" :centered="true" v-if="!showAlternatives">
      <div class="placeholder-text">
        Search for a product first to see Canadian alternatives
      </div>
    </HeaderCard>
    <template v-else>
      <HeaderCard title="Canadian Alternatives">
        <div class="controls">
          <button class="refresh-button" @click="refreshResults">Refresh Results</button>
        </div>
      </HeaderCard>
      <div v-if="loading" class="loading">Loading...</div>
      <template v-else>
        <div v-if="filteredAlternatives.length === 0" class="no-results">
          We could not find any Canadian alternatives for this product based on its
          categories. You can
          <a href="/guide/#add-product-information">edit this item</a> to update its
          categories, and then try again later.
        </div>
        <template v-else>
          <div class="category-filters">
            <div class="filter-section">
              <div class="category-filter-info">
                Filter for products with Canadian origins or manufacturing:
              </div>
              <button
                class="category-pill"
                :class="{ active: canadianFilters.ingredients }"
                @click="toggleCanadianFilter('ingredients')"
              >
                Ingredients
              </button>
              <button
                class="category-pill"
                :class="{ active: canadianFilters.manufacturing }"
                @click="toggleCanadianFilter('manufacturing')"
              >
                Manufacturing / Processing
              </button>
            </div>
            <div class="filter-section">
              <div class="category-filter-info">
                The product you looked up had the following categories. You can click on them to further
                filter the results:
              </div>
              <button
                v-for="category in uniqueCategories"
                :key="category"
                class="category-pill"
                :class="{ active: selectedCategories.includes(category) }"
                @click="toggleCategory(category)"
              >
                {{ formatCategory(category) }}
              </button>
            </div>
          </div>

          <div class="pagination-info">
            Showing {{ paginationStart + 1 }}-{{ paginationEnd }} of
            {{ filteredAlternatives.length }}
            <div class="pagination-controls">
              <button
                class="pagination-button"
                :disabled="currentPage === 0"
                @click="previousPage"
              >
                ←
              </button>
              <button class="pagination-button" :disabled="isLastPage" @click="nextPage">
                →
              </button>
            </div>
          </div>

          <div class="product-cards">
            <ProductCardSimple
              v-for="product in currentPageProducts"
              :key="product.id"
              :product="product"
            />
          </div>

          <div class="pagination-info">
            Showing {{ paginationStart + 1 }}-{{ paginationEnd }} of
            {{ filteredAlternatives.length }}
            <div class="pagination-controls">
              <button
                class="pagination-button"
                :disabled="currentPage === 0"
                @click="previousPage"
              >
                ←
              </button>
              <button class="pagination-button" :disabled="isLastPage" @click="nextPage">
                →
              </button>
            </div>
          </div>
        </template>
      </template>
    </template>
  </HorizontalContainer>
</template>

<script>
import { HeaderCard, HorizontalContainer } from "@cynber/vitepress-valence";
import ProductCardSimple from "./card/ProductCardSimple.vue";

export default {
  name: "Recommend",
  components: {
    HorizontalContainer,
    HeaderCard,
    ProductCardSimple,
  },
  data() {
    return {
      showAlternatives: false,
      allAlternatives: [],
      selectedCategories: [],
      currentPage: 0,
      itemsPerPage: 5,
      loading: false,
      sourceCategories: [],
      canadianFilters: {
        ingredients: false,
        manufacturing: false,
      },
    };
  },
  computed: {
    uniqueCategories() {
      return this.sourceCategories;
    },
    filteredAlternatives() {
      if (this.selectedCategories.length === 0) {
        return [];
      }
      return this.allAlternatives.filter((product) => {
        const matchesCategories = this.selectedCategories.some((category) =>
          product.categories?.includes(category)
        );

        let matchesCanadianFilters = true;
        if (this.canadianFilters.ingredients) {
          matchesCanadianFilters =
            matchesCanadianFilters && product.origins?.toLowerCase().includes("canada");
        }
        if (this.canadianFilters.manufacturing) {
          matchesCanadianFilters =
            matchesCanadianFilters &&
            product.manufacturing_places?.toLowerCase().includes("canada");
        }

        return matchesCategories && matchesCanadianFilters;
      });
    },
    currentPageProducts() {
      return this.filteredAlternatives.slice(this.paginationStart, this.paginationEnd);
    },
    paginationStart() {
      return this.currentPage * this.itemsPerPage;
    },
    paginationEnd() {
      return Math.min(
        (this.currentPage + 1) * this.itemsPerPage,
        this.filteredAlternatives.length
      );
    },
    isLastPage() {
      return this.paginationEnd >= this.filteredAlternatives.length;
    },
  },
  methods: {
    formatCategory(category) {
      return category
        .replace("en:", "")
        .replace("fr:", "")
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    },
    toggleCategory(category) {
      const index = this.selectedCategories.indexOf(category);
      if (index === -1) {
        this.selectedCategories.push(category);
      } else {
        this.selectedCategories.splice(index, 1);
      }
      this.currentPage = 0;
    },
    previousPage() {
      if (this.currentPage > 0) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (!this.isLastPage) {
        this.currentPage++;
      }
    },
    refreshResults() {
      this.selectedCategories = [...this.sourceCategories];
      this.currentPage = 0;
      this.allAlternatives = this.shuffleArray([...this.allAlternatives]);
    },
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
    toggleCanadianFilter(type) {
      this.canadianFilters[type] = !this.canadianFilters[type];
      this.currentPage = 0;
    },

    async searchWithCategory(category, hasCanadianIngredients, hasCanadianManufacturing) {
      let searchUrl = new URL("https://world.openfoodfacts.org/api/v2/search");
      let params = new URLSearchParams({
        fields:
          "code,product_name,brands,image_url,origins,manufacturing_places,categories_tags,categories_hierarchy",
        page_size: "100",
      });

      params.append("categories_tags", category);

      if (hasCanadianIngredients) {
        params.append("origins_tags", "en:canada");
      } else if (hasCanadianManufacturing) {
        params.append("manufacturing_places_tags", "en:canada");
      } else {
        params.append("origins_tags", "en:canada");
      }

      searchUrl.search = params.toString();
      console.log("Searching category:", category);

      const response = await fetch(searchUrl, {
        headers: {
          "User-Agent": "ProductCardOriginFinder/1.0",
        },
      });

      return await response.json();
    },
    async loadAlternatives(sourceProduct) {
      this.loading = true;
      this.showAlternatives = true;

      this.sourceCategories = (sourceProduct.categories_hierarchy || []).map((cat) =>
        cat.replace("en:", "").replace("fr:", "")
      );

      this.selectedCategories = [...this.sourceCategories];

      const hasCanadianIngredients = sourceProduct.origins
        ?.toLowerCase()
        .includes("canada");
      const hasCanadianManufacturing = sourceProduct.manufacturing_places
        ?.toLowerCase()
        .includes("canada");

      try {
        const categories = sourceProduct.categories_hierarchy || [];
        console.log("Category hierarchy:", categories);

        let results = [];
        for (let i = categories.length - 1; i >= 0; i--) {
          const category = categories[i].replace("en:", "").replace("fr:", "");
          const data = await this.searchWithCategory(
            category,
            hasCanadianIngredients,
            hasCanadianManufacturing
          );

          results = data.products.filter((p) => {
            if (p.code === sourceProduct.code) return false;
            if (!p.product_name) return false;

            if (hasCanadianIngredients) {
              return p.origins?.toLowerCase().includes("canada");
            }
            if (hasCanadianManufacturing) {
              return p.manufacturing_places?.toLowerCase().includes("canada");
            }

            return (
              p.origins?.toLowerCase().includes("canada") ||
              p.manufacturing_places?.toLowerCase().includes("canada")
            );
          });

          console.log(`Found ${results.length} results for category ${category}`);

          if (results.length >= 5) {
            console.log("Found enough results, stopping category traversal");
            break;
          }
        }

        this.allAlternatives = results.map((p) => ({
          id: p.code,
          name: p.product_name,
          brand: p.brands || "Unknown Brand",
          image_url: p.image_url,
          origins: p.origins || "Origin not specified",
          manufacturing_places:
            p.manufacturing_places || "Manufacturing location not specified",
          categories: (p.categories_hierarchy || []).map((cat) =>
            cat.replace("en:", "").replace("fr:", "")
          ),
        }));
      } catch (error) {
        console.error("Error fetching alternatives:", error);
        this.allAlternatives = [];
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
:deep(.horizontal-container) {
  gap: 16px; /* Adjust this value */
}

.placeholder-text {
  color: var(--vp-c-text-2);
  text-align: center;
  padding: 20px;
}

.loading {
  text-align: center;
  padding: 20px;
  color: var(--vp-c-text-2);
}

.no-results {
  text-align: center;
  padding: 20px;
  color: var(--vp-c-text-2);
}

.results-info {
  text-align: center;
  padding: 10px;
  color: var(--vp-c-text-2);
  font-size: 0.9em;
  margin-top: 10px;
}
.controls {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
  width: 100%;
}

.refresh-button {
  padding: 8px 16px;
  background-color: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: inline-block;
}

.category-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  margin: -16px auto;
}

.category-filter-info {
  color: var(--vp-c-text-1);
  font-size: 0.9em;
  margin-bottom: 8px;
}

.filter-section {
  width: 100%;
  margin-bottom: 16px;
}

.filter-section:last-child {
  margin-bottom: 0;
}

.category-pill {
  padding: 4px 12px;
  margin: 4px;
  border-radius: 16px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.2s;
}

.category-pill.active {
  background-color: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
  border-color: var(--vp-button-brand-border);
}

.pagination-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  color: var(--vp-c-text-2);
  font-size: 0.9em;
}

.pagination-controls {
  display: flex;
  gap: 8px;
}

.pagination-button {
  padding: 4px 12px;
  background-color: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
  border: 1px solid var(--vp-button-brand-border);
  border-radius: 4px;
  cursor: pointer;
}

.pagination-button:disabled {
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-3);
  cursor: not-allowed;
}

.product-cards {
  background: var(--vp-c-bg-alt);
  margin: -24px auto;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}
</style>
