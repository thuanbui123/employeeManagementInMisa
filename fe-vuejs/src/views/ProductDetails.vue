<template>
  <div>
    <h1>Product Details</h1>
    <p>Product ID: {{ $route.params.id }}</p>
  </div>
</template>

<script>
export default {
  name: 'ProductDetails'
}
</script>
