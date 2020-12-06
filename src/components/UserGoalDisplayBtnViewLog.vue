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
        <div>List of logs for {{this.goalTitle}}</div>

        <v-timeline align-top dense>
          <v-timeline-item v-for="l in logs" :key="l.id" small>
            <div>
              <div class="font-weight-normal">
                <div>{{ l.LoggedDate }}</div>
                <strong>{{ l.loggedDate }}</strong> {{ l.loggedMinutes }}
                <div>test {{ l.loggedMinutes }}</div>
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

export default {
  props: ["goalId", "goalTitle"],

  data() {
    return {
      dialog: false,
      logs: [],
      messages: [
        {
          from: "You",
          message: `Sure, I'll see you later.`,
          time: "10:42am",
          color: "deep-purple lighten-1",
        },
        {
          from: "John Doe",
          message: "Yeah, sure. Does 1:00pm work?",
          time: "10:37am",
          color: "green",
        },
        {
          from: "You",
          message: "Did you still want to grab lunch today?",
          time: "9:47am",
          color: "deep-purple lighten-1",
        },
      ],
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
};
</script>

<style>
</style>