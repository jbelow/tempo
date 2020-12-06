<template>
  <v-dialog v-model="dialog" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">
        View Log
      </v-btn>
    </template>
    <v-card>
      <v-card-text>
        <!-- <div class="font-weight-bold ml-8 mb-2">{{ GoalTitle }}</div> -->
        <div>List of logs for {{ this.goalTitle }}</div>

        <v-timeline align-top dense>
          <v-timeline-item v-for="l in logs" :key="l.id" small>
            <div>
              <div class="font-weight-normal">
                {{ moment(l.LoggedDate).format('MMM Do YYYY') }} <br> you logged: {{ l.loggedMinutes }} minutes
              </div>
              <!-- <div>{{ log.message }}</div> -->
            </div>
          </v-timeline-item>
        </v-timeline>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import firebase from "firebase";
import moment from "moment";

export default {
  props: ["goalId", "goalTitle"],

  data() {
    return {
      dialog: false,
      logs: [],
    };
  },

  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.currentUserId = firebase.auth().currentUser.uid;

        const db = firebase.app().firestore();

        db.collection("users")
          .doc(this.currentUserId)
          .collection("goals")
          .doc(this.goalId)
          .collection("goalLog")
          .onSnapshot((snapshotChange) => {
            this.logs = [];
            snapshotChange.forEach((doc) => {
              const log = {};
              log.id = doc.id;
              log.loggedMinutes = doc.data().goalLoggedMinutes;
              log.LoggedDate = doc.data().goalLoggedDate;
              this.logs.push(log);
              //   console.log(log.LoggedDate);
            });
          });
      }
    });
  },

  methods: {
    moment: function (date) {
      return moment(date);
    },
  },
};
</script>

<style>
</style>