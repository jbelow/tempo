<template>
  <v-app id="inspire">
      <UserFrame/>
    <v-main>
      <v-container class="py-8 px-6" fluid>
        <UserGoalCreate />
        <UserGoalDisplay />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import UserFrame from "../components/UserFrame";
import UserGoalDisplay from "../components/UserGoalDisplay";
import UserGoalCreate from "../components/UserGoalCreate";

export default {
  components: {
    UserFrame,
    UserGoalDisplay,
    UserGoalCreate,
  },
 
};
</script>

<style>
</style>