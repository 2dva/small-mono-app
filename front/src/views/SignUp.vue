<template>
  <div :class="$style['page-outer']">
    <div :class="$style['page-wrap']">
      <h1>Sign up</h1>
      <Segment title="Sign up" size="1" children="">
        <form @submit.prevent="">
          <input label="Nick" name="nick" />
        </form>
      </Segment>
    </div>
  </div>
</template>

<script setup lang="ts">
import Segment from '../components/Segment.vue'

</script>

<style module>
.page-outer {
  margin: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 400px;
}

.page-wrap {
  margin: 0 auto;
}
</style>