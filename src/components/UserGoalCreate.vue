<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" scrollable max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="cyan darken-2" dark v-bind="attrs" v-on="on">
          Create New Goal
        </v-btn>
      </template>
      <v-form ref="form" @submit.prevent="submit">
        <v-card>
          <v-card-title>
            <span class="headline">New Goal</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="goal.title"
                    label="Goal Title"
                    :rules="titleRules"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="goal.minutes"
                    label="Minutes"
                    type="number"
                    :rules="minutesRules"
                    hint="how many minutes before this goal is complete"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="goal.details"
                    label="Details"
                    :rules="detailsRules"
                    hint="give more details about what your goal really is"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-autocomplete
                    v-model="goal.difficulty"
                    :rules="difficultyRules"
                    :items="['Easy', 'Medium', 'Hard']"
                    label="Difficulty"
                  ></v-autocomplete>
                </v-col>

                <v-col cols="12" sm="6" md="4">
                  <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    :return-value.sync="date"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="goal.date"
                        label="Due date"
                        :rules="dateRules"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="goal.date" no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="menu = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.menu.save(date)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-container>
            <v-divider></v-divider>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="resetForm()">
              Close
            </v-btn>
            <v-btn color="blue darken-1" text @click="goalCreate()">
              Create
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
  data: () => ({
    goal: [],

    title: "",
    titleRules: [(v) => !!v || "Title is required"],

    Minutes: "",
    minutesRules: [(v) => !!v || "Minutes is required"],
    details: "",
    detailsRules: [(v) => !!v || "details is required"],
    difficulty: "",
    difficultyRules: [(v) => !!v || "difficulty is required"],
    date: new Date().toISOString().substr(0, 10),
    dateRules: [(v) => !!v || "date is required"],

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

    goalCreate() {
      if (this.$refs.form.validate()) {
        //the user doesn't get to pick how much xp they get, but instead they pick how hard the goal is
        switch (this.goal.difficulty) {
          case "Easy":
            this.goal.experience = 10;
            break;
          case "Medium":
            this.goal.experience = 25;
            break;
          case "Hard":
            this.goal.experience = 50;
            break;
          default:
            this.goal.experience = 0;
            break;
        }

        let splitDate = this.goal.date.split("-");
        let timeStamp = new Date(splitDate[0], splitDate[1], splitDate[2]);

        const db = firebase.app().firestore();
        db.collection("users")
          .doc(this.currentUserId)
          .collection("goals")
          .doc()
          .set({
            goalTitle: this.goal.title,
            goalDetails: this.goal.details,
            goalDueDate: timeStamp,
            goalExperienceReward: this.goal.experience,
            goalMinutes: this.goal.minutes,
            goalMinutesProgress: 0,
            goalDifficulty: this.goal.difficulty,
          });
        //once the goal is made then reset
        this.resetForm();
      }
    },
  },
};
</script>

<style>
</style>