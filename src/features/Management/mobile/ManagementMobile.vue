<script setup lang="ts">
import ResponsiveRoute from "@/core/lib/components.vue";
import ManagementScreen from "./screen/ManagementScreen.vue";
import AddProductScreen from "./screen/AddProductScreen.vue";
import EditProductScreen from "./screen/EditProductScreen.vue";
import AddCategoryScreen from "./screen/AddCategoryScreen.vue";
import EditCategoryScreen from "./screen/EditCategoryScreen.vue";
import AddTagScreen from "./screen/AddTagScreen.vue";
import EditTagScreen from "./screen/EditTagScreen.vue";
import AddDiscountScreen from "./screen/AddDiscountScreen.vue";
import EditDiscountScreen from "./screen/EditDiscountScreen.vue";
import AddSizeScreen from "./screen/AddSizeScreen.vue";
import EditSizeScreen from "./screen/EditSizeScreen.vue";
import AddHeroScreen from "./screen/AddHeroScreen.vue";
import EditHeroScreen from "./screen/EditHeroScreen.vue";
</script>

<template>
  <ResponsiveRoute path="/" :component="ManagementScreen" />
  <ResponsiveRoute path="/add-product" :component="AddProductScreen" />
  <ResponsiveRoute path="/edit-product" :component="EditProductScreen" />
  <ResponsiveRoute path="/add-category" :component="AddCategoryScreen" />
  <ResponsiveRoute path="/edit-category" :component="EditCategoryScreen" />
  <ResponsiveRoute path="/add-tag" :component="AddTagScreen" />
  <ResponsiveRoute path="/edit-tag" :component="EditTagScreen" />
  <ResponsiveRoute path="/add-discount" :component="AddDiscountScreen" />
  <ResponsiveRoute path="/edit-discount" :component="EditDiscountScreen" />
  <ResponsiveRoute path="/add-size" :component="AddSizeScreen" />
  <ResponsiveRoute path="/edit-size" :component="EditSizeScreen" />
  <ResponsiveRoute path="/add-hero" :component="AddHeroScreen" />
  <ResponsiveRoute path="/edit-hero" :component="EditHeroScreen" />
</template>
