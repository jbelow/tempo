<template>
  <div>
    <div class="goalStyle py-5 mx-lg-auto" v-for="g in goals" :key="g.id">

      <div v-if="(g.complated == false)">
        <v-card class="blue darken-2">
          <v-card-title class="white--text blue">
            <h3>
              {{ g.title }} :
              {{ moment(g.dueDate).format("MMM Do, YYYY") }}
            </h3>
            <v-spacer></v-spacer>
            <!-- options/menu -->
            <v-menu bottom left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn dark icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <UserGoalDisplayBtnEdit v-bind:goalId="g.id" />
                <UserGoalDisplayBtnViewLog
                  v-bind:goalId="g.id"
                  v-bind:goalTitle="g.title"
                />
                <UserGoalDisplayBtnDelete
                  v-bind:goalId="g.id"
                  v-bind:goalTitle="g.title"
                />
              </v-list>
            </v-menu>
            <!--  options/menu end-->
          </v-card-title>

          <v-list-item>
            <v-list-item-content class="white--text">
              Progress: {{ g.minutesProgress }}/{{ g.minutes }} minutes
              <br />
              Difficulty: {{ g.difficulty }}
              <br>
              Details: {{ g.details }}
            </v-list-item-content>
          </v-list-item>

          <v-card-actions>
            <UserGoalDisplayBtnAddTime
              v-bind:goalId="g.id"
              v-bind:currentMinutesProgress="g.minutesProgress"
            />
            <UserGoalDisplayBtnComplate v-bind:goalId="g.id" v-bind:goalExperience="g.experience"/>
          </v-card-actions>
        </v-card>
      </div>

    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import moment from "moment";

import UserGoalDisplayBtnAddTime from "../components/UserGoalDisplayBtnAddTime";
import UserGoalDisplayBtnComplate from "../components/UserGoalDisplayBtnComplate";
import UserGoalDisplayBtnEdit from "../components/UserGoalDisplayBtnEdit";
import UserGoalDisplayBtnViewLog from "../components/UserGoalDisplayBtnViewLog";
import UserGoalDisplayBtnDelete from "../components/UserGoalDisplayBtnDelete";

export default {
  components: {
    UserGoalDisplayBtnAddTime,
    UserGoalDisplayBtnComplate,
    UserGoalDisplayBtnEdit,
    UserGoalDisplayBtnViewLog,
    UserGoalDisplayBtnDelete,
  },

  data() {
    return {
      goals: [],
      dialog: false,
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
          .onSnapshot((snapshotChange) => {
            this.goals = [];
            snapshotChange.forEach((doc) => {
              const goal = {};
              goal.id = doc.id;
              goal.title = doc.data().goalTitle;
              goal.dueDate = doc.data().goalDueDate;
              goal.details = doc.data().goalDetails;
              goal.minutesProgress = doc.data().goalMinutesProgress;
              goal.minutes = doc.data().goalMinutes;
              goal.difficulty = doc.data().goalDifficulty;
              goal.complated = doc.data().goalComplated;
              goal.experience = doc.data().goalExperience;
              (goal.progress = goal.minutesProgress / goal.minutes),
                this.goals.push(goal);
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
@import url("https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap");

.goalStyle {
  width: 71%;
  margin: auto;
}

.funFont {
  font-family: "Fredoka One", "Courier New", Courier, monospace;
}
</style>