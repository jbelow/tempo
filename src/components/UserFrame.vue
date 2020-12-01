<template>
  <v-app id="inspire">
    <v-app-bar app>
      <v-toolbar-title>Hello</v-toolbar-title>
      <v-spacer></v-spacer>
      <button @click="signOut">Sign out</button>
    </v-app-bar>

    <v-navigation-drawer
      class="blue lighten-5"
      v-model="drawer"
      app
      disable-resize-watcher
    >
      <v-sheet class="pa-9 light-blue darken-3">
        <v-avatar class="mb-4" size="64"><img v-bind:src="userPfp" /></v-avatar>
        <div>{{ userName }}</div>
        <div>Level: {{ userLevel }}</div>
      </v-sheet>

      <v-divider></v-divider>

      <v-list>
        <v-list-item v-for="[icon, text] in links" :key="icon" link>
          <v-list-item-icon>
            <v-icon>{{ icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container class="py-8 px-6" fluid>
        <UserGoals v-bind:currentUserId="currentUserId" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import firebase from "firebase";
import "firebase/auth";
import UserGoals from "../views/UserGoals";
import UserAchievements from "../views/UserAchievements";
import UserStatistics from "../views/UserStatistics";

export default {
  components: {
    UserGoals,
    UserAchievements,
    UserStatistics,
  },

  data: () => ({
    drawer: null,
    links: [["Goals"], ["Achievements"], ["Stats"]],
    //TODO: help: why is it that I need to put this here but not everyting has to go here like now goal info isn't needed here?
    currentUser: null,
    userLevel: null,
  }),

  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.currentUser = user;
        this.userPfp = firebase.auth().currentUser.photoURL;
        this.userName = firebase.auth().currentUser.displayName;
        this.currentUserId = firebase.auth().currentUser.uid;
        // a user has just logged in, so we need to get his/her document
        // from our users collection
        this.getUserDocument(user.uid);
      } else {
        this.currentUser = null;
        this.userRole = null;
      }
    });
  },

  mounted() {
    //console.log("ROUTE PARAMS: ", this.$route.params);
    this.userRole = this.$route.params.userRole;
    if (this.userRole || this.userRole == "user") {
      // if the user trying to access this page is not an admin,
      //then redirect them to the home page
      this.getUserDocument();
    } else {
      this.$router.push("home");
    }
  },

  methods: {


    signOut() {
      firebase
        .auth()
        .signOut()
        .then(
          () => {
            this.$router.push("home").catch(() => {});
            // when a user logs out, redirect to the home view
            // note that if you don't put the catch(), then
            // you may get a warning saying you should avoid redundant navigation
            console.log("Logged Out");
          },
          (error) => {
            console.log("error logging out", error);
          }
        );
    },
  },
};
</script>
    