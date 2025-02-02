<template>
  <HorizontalContainer>
    <HeaderCard title="Canadian Alternatives" :centered="true" v-if="!showAlternatives">
      <div class="placeholder-text">
        Search for a product first to see Canadian alternatives
      </div>
    </HeaderCard>
    <template v-else>
      <HeaderCard title="Canadian Alternatives" :showRefreshIcon="true" />
      <div v-if="loading" class="loading">Loading...</div>
      <template v-else>
        <div v-if="alternativeProducts.length === 0" class="no-results">
          No Canadian alternatives found
        </div>
        <ProductCard
          v-else
          v-for="product in alternativeProducts"
          :key="product.id"
          :product="product"
        />
      </template>
    </template>
  </HorizontalContainer>
</template>

<script>
import { HeaderCard, HorizontalContainer } from "@cynber/vitepress-valence";
import ProductCard from "./ProductCard.vue";

export default {
  name: "Recommend",
  components: {
    HorizontalContainer,
    HeaderCard,
    ProductCard,
  },
  data() {
    return {
      showAlternatives: false,
      alternativeProducts: [],
      loading: false,
    };
  },
  methods: {
    async loadAlternatives(sourceProduct) {
      this.loading = true;
      this.showAlternatives = true;
      
      console.log("Source product:", {
        name: sourceProduct.product_name,
        category: sourceProduct.categories_tags,
        origins: sourceProduct.origins,
        manufacturing: sourceProduct.manufacturing_places
      });

      const hasCanadianIngredients = sourceProduct.origins?.toLowerCase().includes('canada');
      const hasCanadianManufacturing = sourceProduct.manufacturing_places?.toLowerCase().includes('canada');
      
      try {
        let category = sourceProduct.categories_tags?.[0] || '';
        category = category.replace('en:', '').replace('fr:', '');
        
        console.log("Searching with category:", category);
        console.log("Has Canadian ingredients:", hasCanadianIngredients);
        console.log("Has Canadian manufacturing:", hasCanadianManufacturing);

        let searchUrl = new URL('https://world.openfoodfacts.org/api/v2/search');
        let params = new URLSearchParams({
          fields: 'code,product_name,brands,image_url,origins,manufacturing_places,categories_tags',
          page_size: '24'
        });

        if (category) {
          params.append('categories_tags', category);
        }

        if (hasCanadianIngredients) {
          params.append('origins_tags', 'en:canada');
        } else if (hasCanadianManufacturing) {
          params.append('manufacturing_places_tags', 'en:canada');
        } else {
          params.append('origins_tags', 'en:canada');
        }

        searchUrl.search = params.toString();
        
        console.log("Search URL:", searchUrl.toString());

        const response = await fetch(searchUrl, {
          headers: {
            'User-Agent': 'ProductOriginFinder/1.0',
          },
        });
        
        const data = await response.json();
        console.log("Raw results:", data.products.length);

        this.alternativeProducts = data.products
          .filter(p => {
            if (p.code === sourceProduct.code) return false;
            if (!p.product_name) return false;

            if (hasCanadianIngredients) {
              return p.origins?.toLowerCase().includes('canada');
            }
            if (hasCanadianManufacturing) {
              return p.manufacturing_places?.toLowerCase().includes('canada');
            }
            
            return (p.origins?.toLowerCase().includes('canada') || 
                   p.manufacturing_places?.toLowerCase().includes('canada'));
          })
          .map(p => ({
            id: p.code,
            name: p.product_name,
            brand: p.brands || 'Unknown Brand',
            image_url: p.image_url,
            origins: p.origins || 'Origin not specified',
            manufacturing_places: p.manufacturing_places || 'Manufacturing location not specified',
            categories: p.categories_tags
          }));

        console.log("Filtered results:", this.alternativeProducts.length);
        console.log("Final products:", this.alternativeProducts);

      } catch (error) {
        console.error('Error fetching alternatives:', error);
        this.alternativeProducts = [];
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
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
</style>
