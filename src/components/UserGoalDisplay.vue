<template>
  <div>
    <div class="goalStyle py-5 mx-lg-auto" v-for="g in goals" :key="g.id">
      <v-card class="blue darken-2" id="goal-display">
        <v-card-title class="headline"
          >{{ g.title }}
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
              <!-- <v-list-item link>
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
                </v-dialog>
              </v-list-item> -->
            </v-list>
          </v-menu>
          <!--  options/menu end-->
        </v-card-title>

        <v-card-subtitle>{{ g.details }} - goal time: {{g.minutes}}</v-card-subtitle>
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
  props: ["currentUserId"],

  created() {
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
          goal.minutes = doc.data().goalMinutes;
          // console.log(goal);
          this.goals.push(goal);
        });
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
.goalStyle {
  width: 71%;
  margin: auto;
}
</style>