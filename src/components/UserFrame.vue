<template>
  <div>
    <v-app-bar app class="light-blue darken-1 white--text">
      <v-app-bar-nav-icon class="white--text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title class="funFont">Tempo</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn class="white--text" text @click="logout">Log out</v-btn>
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
      </v-sheet>

      <v-divider></v-divider>
      <v-list dense nav>
        <v-list-item v-for="item in items" :key="item.title" link>
          <v-list-item-content>
            <v-list-item :to="item.link">{{ item.title }}</v-list-item>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import firebase from "firebase";
import "firebase/auth";
import moment from "moment";

export default {
  data: () => ({
    selectedItem: 0,
    items: [
      { title: "Goals", link: "user-goals" },
      { title: "Statistics", link: "user-statistics" },
    ],
    drawer: null,
    currentUser: null,
    userPfp: null,
    userName: null,
  }),

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
        this.$router.push({ name: "home" });
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
          if (doc.exists) {
            // console.log("User document:", doc.data());
            this.userRole = doc.data().role;
            this.userExperience = doc.data().userExperience;
            this.userLevel = doc.data().userLevel;
            this.userTotalGoalsCompleted = doc.data().userTotalGoalsCompleted;
            this.userTotalMinutes = doc.data().userTotalMinutes;
          } else {
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
        this.userTotalGoalsCompleted = 0;
        this.userTotalMinutes = 0;

        db.collection("users")
          .doc(user.uid)
          .set(
            {
              userExperience: this.userExperience,
              userLevel: this.userLevel,
              userRole: this.userRole,
              userTotalGoalsCompleted: this.userTotalGoalsCompleted,
              userTotalMinutes: this.userTotalMinutes,
            },
            { merge: true }
          )
          .then(() => console.log("USER DOCUMENT CREATED"))
          .catch((e) => console.log(e));

        let timeStamp = moment().valueOf();

        //this will make an example goal for the user but just remember it doesn't make any logs
        db.collection("users")
          .doc(user.uid)
          .collection("goals")
          .doc()
          .set({
            goalDetails: "Information that you want to add on top of the goal",
            goalDueDate: timeStamp,
            goalExperienceReward: 150,
            goalMinutesProgress: 0,
            goalMinutes: 120,
            goalTitle: "Study for 2 hours!",
            goalDifficulty: "hard",
            goalCompleted: false,
            tagId: ["zLj4InU289szGUs2i6lZ", "stuffandthings"],
          });

        // db.collection("users")
        //   .doc(user.uid)
        //   .collection("achievments")
        //   .doc()
        //   .set({});
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
.funFont {
  font-family: "Fredoka One", "Courier New", Courier, monospace;
}
</style>