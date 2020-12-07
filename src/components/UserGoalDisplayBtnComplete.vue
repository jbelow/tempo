<template>
  <div>
    <v-dialog v-model="dialog" width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="cyan darken-1 white--text" dark v-bind="attrs" v-on="on">
          Complete
        </v-btn>
      </template>
      <v-card>
        <v-card-text class="headline">
          Are you sure you want to mark {{ goalTitle }} complete?
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="completeGoal(goalId), (dialog = false)"
          >
            Complete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import firebase from "firebase";
export default {
  props: ["goalId", "goalTitle", "goalExperience"],

  data() {
    return {
      dialog: false,
      currentUserTotalGoalsCompleted: null,
      currentUserExperience: null,
      currentUserId: null,
    };
  },

  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      this.setId(user.uid);

      const db = firebase.app().firestore();

      db.collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          this.userRole = doc.data().role;
          this.currentUserTotalGoalsCompleted = doc.data().userTotalGoalsCompleted;
          this.currentUserExperience = doc.data().userExperience;
          console.log(this.currentUserTotalGoalsCompleted);
        });
    });
  },

  methods: {
    //the id is being really hard to work with so I made this to get it
    setId(userId) {
      this.currentUserId = userId;
      console.log(this.currentUserId);

    },

    completeGoal(id) {
      console.log("10 " + this.currentUserId)
      let newUserTotalGoalsCompleted = this.currentUserTotalGoalsCompleted + 1
      let newUserExperience = (this.currentUserExperience + this.experience);

      const db = firebase.app().firestore();
      db.collection("users")
        .doc(this.currentUserId)
        .collection("goals")
        .doc(id)
        .set({
          goalCompleted: true,
        });

      db.collection("users").doc(this.currentUserId).set({
        UserTotalGoalsCompleted: newUserTotalGoalsCompleted,
        userExperience: newUserExperience,
      },
      { merge: true }
      );
    },
  },
};
</script>

<style>
</style>