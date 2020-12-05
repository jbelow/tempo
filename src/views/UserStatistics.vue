<template>
  <v-app id="inspire">
    <UserFrame />
    <v-main>
      <v-container class="py-8 px-6" fluid>
        <!--  -->
        <v-card
          class="mx-auto blue darken-2 statStyle"
          id="goal-display"
          outlined
        >
          <v-list-item-content>
            <v-list-item-title class="headline mb-1 text-md-center white--text">
              Total Goals Complated: {{ userLevel }}
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
              Total Time Logged: {{ userExperience }}
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
    userLevel: null,
    userExperience: null,
    userCompletedGoals: null,
  }),

  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
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
          this.userTotalGoalsComplated = doc.data().userTotalGoalsComplated;
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