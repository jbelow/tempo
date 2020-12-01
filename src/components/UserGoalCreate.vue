<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" scrollable max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark v-bind="attrs" v-on="on">
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
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="goal.minutes"
                    label="Minutes"
                    hint="how many minutes before this goal is complete"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="goal.details"
                    label="Details"
                    hint="give more details about what your goal really is"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-autocomplete
                    v-model="goal.difficulty"
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

    valid: true,
    name: "",
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 10) || "Name must be less than 10 characters",
    ],
    email: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    select: null,
    items: ["Item 1", "Item 2", "Item 3", "Item 4"],
    checkbox: false,
    dialog: false,

    date: new Date().toISOString().substr(0, 10),
    menu: false,
  }),

  props: ["currentUserId"],

  methods: {
    resetForm() {
      this.form = Object.assign({}, this.defaultForm);
      this.$refs.form.reset();
      this.dialog = false;
    },

    goalCreate() {
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
          goalDifficulty: this.goal.difficulty,
        });
      //once the goal is made then reset
      this.resetForm();
    },
  },
};
</script>

<style>
</style>