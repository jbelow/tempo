<template>
  <v-app>
    <router-view/>
  </v-app>
</template>

<script>
import firebase from "firebase";
export default {
  name: "App",
  
  mounted() {
    // listen for when a user logs in or logs out
    // When a user logs in fetch their data from the users collection
    // If the user is loggin in for the first time, then we need to add a document for them to the users collection
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$router.push("user").catch(() => {});
      } else {
        console.log("this is App.vue and it says you are not logged in")
        // this.currentUser = "";
        // this.userRole = null;
      }
    });
  },
};
</script>


<style lang="scss">
</style>
