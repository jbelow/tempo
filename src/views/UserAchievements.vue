<template>
  <v-app id="inspire">
      <UserFrame/>
    <v-main>
      <v-container class="py-8 px-6" fluid>

      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import UserFrame from "../components/UserFrame";


export default {
  components: {
    UserFrame,

  },
 
};
</script>
