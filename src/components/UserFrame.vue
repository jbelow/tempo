<template>
  <div>
    <v-app-bar app>
      <v-toolbar-title>Hello</v-toolbar-title>
      <v-spacer></v-spacer>
      <button @click="logout">Sign out</button>
    </v-app-bar>

    <v-navigation-drawer
      class="blue lighten-5"
      v-model="drawer"
      app
      disable-resize-watcher
    >
      <v-sheet class="pa-9 light-blue darken-3 white--text">
        <v-avatar class="mb-4" size="64"><img v-bind:src="userPfp" /></v-avatar>
        <div>{{ userName }}</div>
        <div>Level: {{ userLevel }}</div>

      </v-sheet>

      <v-divider></v-divider>
      <v-list dense nav>
        <v-list-item v-for="item in items" :key="item.title" link>
          <v-list-item-content>
            <v-list-item :to="item.link">{{ item.title }}</v-list-item>
<!-- {{ item.title }} -->
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import firebase from "firebase";
import "firebase/auth";

export default {
  data: () => ({
    selectedItem: 0,
    items: [
      { title: "Goals", link: "user-goals" },
      { title: "Achievements", link: "user-achievements" },
      { title: "Statistics", link: "user-statistics" },
    ],
    drawer: null,
    currentUser: null,
    userLevel: null,
    userPfp: null,
    userName: null,

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
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.currentUser = user;
        this.currentUserId = firebase.auth().currentUser.uid;
        this.userPfp = firebase.auth().currentUser.photoURL;
        this.userName = firebase.auth().currentUser.displayName;
        // a user has just logged in, so we need to get his/her document
        // from our users collection
        this.getUserDocument(user.uid);
      } else {
        this.currentUser = null;
        this.userRole = null;
        this.$router.push("/");
      }
    });
  },

  methods: {
    //checking if the user is made or not
    getUserDocument(userId) {
      const db = firebase.app().firestore();
      db.collection("users")
        .doc(userId)
        .get()
        .then((doc) => {
          if (doc.exists == true) {
            // console.log("User document:", doc.data());
            this.userRole = doc.data().role;
            this.userExperience = doc.data().userExperience;
            this.userLevel = doc.data().userLevel;
            this.userTotalGoalsComplated = doc.data().userTotalGoalsComplated;
            this.userTotalMinutes = doc.data().userTotalMinutes;
          } else {
            // console.log("THE USER DOCUMENT DOES NOT EXIST...");
            this.createUserDocument();
          }
        })
        .catch((error) => console.log(error));
    },

    createUserDocument() {
      const user = firebase.auth().currentUser;
      if (user) {
        const db = firebase.app().firestore();
        //defaults fields
        this.userRole = "user";
        this.userExperience = 0;
        this.userLevel = 0;
        this.userTotalGoalsComplated = 0;
        this.userTotalMinutes = 0;

        db.collection("users")
          .doc(user.uid)
          .set(
            {
              userExperience: this.userExperience,
              userLevel: this.userLevel,
              role: this.userRole,
              userTotalGoalsComplated: this.userTotalGoalsComplated,
              userTotalMinutes: this.userTotalMinutes,
            },
            { merge: true }
          )
          .then(() => console.log("USER DOCUMENT CREATED"))
          .catch((e) => console.log(e));

        //this will make an example goal for the user but just remember it doesn't make any logs
        db.collection("users")
          .doc(user.uid)
          .collection("goals")
          .doc()
          .set({
            goalDetails: "Information that you want to add on top of the goal",
            goalDueDate: Date().toLocaleString(),
            goalExperienceReward: 150,
            goalMinutes: 2,
            goalTitle: "Study for 2 hours!",
            goalDifficulty: "hard",
            tagId: ["zLj4InU289szGUs2i6lZ", "stuffandthings"],
          });

        db.collection("users")
          .doc(user.uid)
          .collection("achievments")
          .doc()
          .set({});

        //TODO: make it so that when there is a new user they are welcomed to the site with a pop up! and not just a console.log...
      } else {
        console.log("cannot create user doc!");
      }
    },

    logout() {
      firebase
        .auth()
        .signOut()
        .then(
          () => {
            this.$router.push("/").catch(() => {});
            // when a user logs out, redirect to the login view
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

<style>
</style>