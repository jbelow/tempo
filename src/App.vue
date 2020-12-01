<template>
  <v-app>
    <router-view v-bind:currentUser="currentUser"/>
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/user-goals">user</router-link>
    </div>
  </v-app>
</template>

<script>
import firebase from "firebase";
export default {
  name: "App",
  data() {
    return {
      currentUser: null,
      userRole: null,
    };
  },
  mounted() {
    // listen for when a user logs in or logs out
    // When a user logs in fetch their data from the users collection
    // If the user is loggin in for the first time, then we need to add a document for them to the users collection
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.currentUser = user;
        // a user has just logged in, so we need to get his/her document
        // from our users collection
        this.getUserDocument(user.uid);
        this.$router.push("user-goals").catch(() => {});
      } else {
        this.currentUser = null;
        this.userRole = null;
      }
    });
  },
  methods: {
    //checking if the user is made or not
    getUserDocument(userId) {
      // console.log("GETTING USER DOCUMENT...", userId);
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
  },
};
</script>


<style lang="scss">
</style>
