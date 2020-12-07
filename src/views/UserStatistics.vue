<template>
  <v-app id="inspire">
    <UserFrame />

    <!-- 
      TODO:
      1. xp
      2. user role
      3. total goals
      4. total minutes
      5. timeline of all logs (this is a maybe todo)
     -->
    <v-main>
      <v-container class="py-8 px-6" fluid>

        <v-card
          class="mx-auto blue darken-2 statStyle"
          id="goal-display"
          outlined
        >
          <v-list-item-content>
            <v-list-item-title class="headline mb-1 text-md-center white--text">
              Goals Completed: {{ userTotalGoalsCompleted }}
            </v-list-item-title>
          </v-list-item-content>
        </v-card>
        <br />

        <v-card
          class="mx-auto blue darken-2 statStyle"
          id="goal-display"
          outlined
        >
          <v-list-item-content>
            <v-list-item-title class="headline mb-1 text-md-center white--text">
              Minutes Logged: {{ userTotalMinutes }}
            </v-list-item-title>
          </v-list-item-content>
        </v-card>
        <br />

        <v-card
          class="mx-auto blue darken-2 statStyle"
          id="goal-display"
          outlined
        >
          <v-list-item-content>
            <v-list-item-title class="headline mb-1 text-md-center white--text">
              Experience: {{ userExperience }}
            </v-list-item-title>
          </v-list-item-content>
        </v-card>



      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import firebase from "firebase";
import UserFrame from "../components/UserFrame";

export default {
  components: {
    UserFrame,
  },

  data: () => ({
    currentUser: null,
    userName: null,
    userLevel: null,
    userExperience: null,
    userCompletedGoals: null,
    userTotalGoalsCompleted: null,
    userTotalMinutes: null,
  }),

  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.userName = firebase.auth().currentUser.displayName;
        this.getUserDocument(user.uid);
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
          // console.log("User document:", doc.data());
          this.userRole = doc.data().role;
          this.userExperience = doc.data().userExperience;
          this.userLevel = doc.data().userLevel;
          this.userTotalGoalsCompleted = doc.data().userTotalGoalsCompleted;
          this.userTotalMinutes = doc.data().userTotalMinutes;
        })
        .catch((error) => console.log(error));
    },
  },
};
</script>

<style>
.statStyle {
  width: 50%;
  margin: auto;
}
</style>