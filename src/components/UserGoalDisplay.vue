<template>
  <div>
    <div class="goalStyle py-5 mx-lg-auto" v-for="g in goals" :key="g.id">
      <v-card class="blue darken-2" id="goal-display" outlined>
        <v-card-title class="white--text">
          <h3>
            {{ g.title }}
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
              <v-list-item link>
                <!-- --------------------------------- -->
                <v-dialog v-model="dialog" width="500">
                  <template v-slot:activator="{ on, attrs }">
                    <v-list-item-title
                      color="red lighten-2"
                      dark
                      v-bind="attrs"
                      v-on="on"
                    >
                      Delete
                    </v-list-item-title>
                  </template>
                  <v-card>
                    <v-card-text class="headline">
                      Are you sure you want to delete <b>{{ g.title }}</b
                      >?
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="dialog = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        color="primary"
                        text
                        @click="deleteGoal(g.id), (dialog = false)"
                      >
                        Delete
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <!-- --------------------------------- -->
              </v-list-item>
              <v-list-item link>
                <v-dialog v-model="dialog" width="500">
                  <template v-slot:activator="{ on, attrs }">
                    <v-list-item-title
                      color="red lighten-2"
                      dark
                      v-bind="attrs"
                      v-on="on"
                    >
                      Edit
                    </v-list-item-title>
                  </template>
                  <v-card>
                    <v-card-text class="headline">
                      Are you sure you want to edit <b>{{ g.title }}</b
                      >?
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="dialog = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        color="primary"
                        text
                        @click="deleteGoal(g.id), (dialog = false)"
                      >
                        Delete
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-list-item>
            </v-list>
          </v-menu>
          <!--  options/menu end-->
          <v-list-item>
            <v-list-item-content class=" white--text">
              Progress: {{ g.minutesProgress }}/{{ g.minutes }} minutes
              <br />
              Difficulty: {{ g.difficulty }}
              <br />
              Details: {{ g.details }}
            </v-list-item-content>
          </v-list-item>
        </v-card-title>

        <v-card-actions>
          <v-btn> Add Time </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
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
              goal.details = doc.data().goalDetails;
              goal.minutesProgress = doc.data().goalMinutesProgress;
              goal.minutes = doc.data().goalMinutes;
              goal.difficulty = doc.data().goalDifficulty;
              (goal.progress = goal.minutesProgress / goal.minutes),
                // console.log(goal);
                this.goals.push(goal);
            });
          });
      }
    });
  },

  methods: {
    deleteGoal(id) {
      const db = firebase.app().firestore();
      db.collection("users")
        .doc(this.currentUserId)
        .collection("goals")
        .doc(id)
        .delete()
        .then(() => {
          // console.log("Document deleted!");
        })
        .catch((error) => {
          console.error(error);
        });
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