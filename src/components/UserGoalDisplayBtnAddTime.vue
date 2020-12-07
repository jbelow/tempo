<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" scrollable max-width="400px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="cyan darken-1 white--text" dark v-bind="attrs" v-on="on">
          Add time
        </v-btn>
      </template>
      <v-form ref="form" @submit.prevent="submit">
        <v-card>
          <v-card-title>
            <span class="headline">Log you minutes</span>
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="goal.minutesProgress"
              label="Minutes"
              type="number"
              :rules="minutesRules"
              hint="how much time have you worked on this goal?"
              required
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="resetForm()">
              Close
            </v-btn>
            <v-btn color="blue darken-1" text @click="addTime()"> Add </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </v-row>
</template>

<script>
import firebase from "firebase";
import moment from "moment";

export default {
  props: ["goalId", "currentMinutesProgress"],

  data: () => ({
    goal: [],

    Minutes: "",
    minutesRules: [(v) => !!v || "Minutes is required"],

    valid: true,
    checkbox: false,
    dialog: false,
    menu: false,
    currentUserMinutes: null,
  }),

  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.currentUserId = firebase.auth().currentUser.uid;

        const db = firebase.app().firestore();
        db.collection("users")
          .doc(this.currentUserId)
          .get()
          .then((doc) => {
            this.currentUserMinutes = doc.data().userTotalMinutes;
            // console.log("in the then:" + this.currentUserMinutes);
          })
          .catch((error) => console.log(error));
      }
    });
  },

  methods: {
    resetForm() {
      this.form = Object.assign({}, this.defaultForm);
      this.$refs.form.reset();
      this.dialog = false;
    },

    addTime() {
      if (this.$refs.form.validate()){
      this.$refs.form.validate();
      const db = firebase.app().firestore();

      let newMinutes =
        parseInt(this.currentMinutesProgress) +
        parseInt(this.goal.minutesProgress);

      db.collection("users")
        .doc(this.currentUserId)
        .collection("goals")
        .doc(this.goalId)
        .set(
          {
            goalMinutesProgress: newMinutes,
          },
          { merge: true }
        );

      let goalLoggedDate = moment().valueOf()
      console.log(goalLoggedDate);

      db.collection("users")
        .doc(this.currentUserId)
        .collection("goals")
        .doc(this.goalId)
        .collection("goalLog")
        .doc()
        .set({
          goalLoggedDate: goalLoggedDate,
          goalLoggedMinutes: this.goal.minutesProgress,
        });

      // console.log("outside the then: " + this.currentUserMinutes);

      let newUserMinutes = parseInt(this.goal.minutesProgress) + parseInt( this.currentUserMinutes);
      // console.log("new user minutes" + newUserMinutes);

      db.collection("users").doc(this.currentUserId).set({
        userTotalMinutes: newUserMinutes,
      },
      { merge: true });

      //once the goal is made then reset
      this.resetForm();
      }
    },
  },
};
</script>
