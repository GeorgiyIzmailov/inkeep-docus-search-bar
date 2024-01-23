import { defineNuxtModule, createResolver, addPlugin } from '@nuxt/kit';

const module = defineNuxtModule({
  meta: {
    name: "inkeep-search-bar",
    configKey: "inkeep"
  },
  defaults: {},
  setup() {
    const { resolve } = createResolver(import.meta.url);
    addPlugin({
      src: resolve("./runtime/search-bar-plugin"),
      name: "SearchBar"
    });
  }
});

export { module as default };
