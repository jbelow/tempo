<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" scrollable max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark v-bind="attrs" v-on="on"> Add time </v-btn>
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
            <v-btn color="blue darken-1" text @click="addTime()">
              Add
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </v-row>
</template>

<script>
import firebase from "firebase";

export default {

  props: ['goalId'],

  data: () => ({
    goal: [],

    Minutes: "",
    minutesRules: [(v) => !!v || "Minutes is required"],

    currentMinutesProgress: null,

    valid: true,
    checkbox: false,
    dialog: false,
    menu: false,
  }),

  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.currentUserId = firebase.auth().currentUser.uid;
        
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
      console.log("this is in addTime: " + this.goalId)
      this.$refs.form.validate();
      const db = firebase.app().firestore();
      db.collection("users")
        .doc(this.currentUserId)
        .collection("goals")
        .doc(this.goalId)
        .set({
          goalMinutesProgress: this.goal.minutesProgress,
        }, { merge: true });
      //once the goal is made then reset
      this.resetForm();
    },
  },
};
</script>
