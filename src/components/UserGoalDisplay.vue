<template>
  <div>
    <div class="goalStyle py-5 mx-lg-auto" v-for="g in goals" :key="g.id">
      <v-card class="blue darken-2" id="goal-display">
        <v-card-title class="headline white--text funFont">
          <h2>
            {{ g.title }}
          </h2>
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
        </v-card-title>

        <v-card-subtitle>

          {{ g.minutesProgress }}/{{ g.minutes }}

          {{ g.details }} - goal time: {{ g.minutes }}</v-card-subtitle
        >
      </v-card>
    </div>
<!-- --------------------------------------------------------------------------------------------------- -->
    <v-card class="mx-auto" max-width="344" outlined>
      <v-list-item three-line>
        <v-list-item-content>
          <div class="overline mb-4">OVERLINE</div>
          <v-list-item-title class="headline mb-1">
            Headline 5
          </v-list-item-title>
          <v-progress-linear
            color="light-blue"
            height="10"
            value="10"
            striped
          ></v-progress-linear>
          <v-list-item-subtitle
            >Greyhound divisely hello coldly fonwderfully</v-list-item-subtitle
          >
        </v-list-item-content>

        <v-list-item-avatar tile size="80" color="grey">test</v-list-item-avatar>
      </v-list-item>

      <v-card-actions>
        <v-btn outlined rounded text> Button </v-btn>
      </v-card-actions>
    </v-card>
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