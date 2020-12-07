<template>
  <v-list-item link>
    <v-dialog v-model="dialog" width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-list-item-title dark v-bind="attrs" v-on="on">
          Complate
        </v-list-item-title>
      </template>
      <v-card>
        <v-card-text class="headline">
          Are you sure you want to mark {{ goalTitle }} complated?
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
            @click="complateGoal(goalId), (dialog = false)"
          >
            Complate
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-list-item>
</template>

<script>
import firebase from "firebase";
export default {
  props: ["goalId", "goalTitle", "goalExperience"],

  data() {
    return {
      dialog: false,
      currentUserTotalGoalsComplated: null,
      currentUserExperience: null,
    };
  },

  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.currentUserId = firebase.auth().currentUser.uid;
      }
    });

    const db = firebase.app().firestore();

    db.collection("users")
      .doc(this.currentUserId)
      .get()
      .then((doc) => {
        this.currentUserTotalGoalsComplated = doc.data().userTotalGoalsComplated;
        this.currentUserExperience = doc.data().userExperience;
        console.log(this.currentUserTotalGoalsComplated);
      });
  },

  methods: {
    complateGoal(id) {
      // let newUserTotalGoalsComplated = this.currentUserTotalGoalsComplated + 1
      // let newUserExperience = this.currentUserExperience + this.experience;

      const db = firebase.app().firestore();
      db.collection("users")
        .doc(this.currentUserId)
        .collection("goals")
        .doc(id)
        .set({
          goalComplated: true,
        });

      // db.collection("users").doc(this.currentUserId).set({
      //   UserTotalGoalsComplated: newcurrentUserTotalGoalsComplated,
      //   userExperience:
      // });

      //once the goal is made then reset
      this.resetForm();
    },
  },
};
</script>

<style>
</style>