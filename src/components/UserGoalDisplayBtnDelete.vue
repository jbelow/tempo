<template>
  <v-list-item link>
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-list-item-title color="red lighten-2" dark v-bind="attrs" v-on="on">
          Delete
        </v-list-item-title>
      </template>
      <v-card>
        <v-card-text class="headline">
          When you delete this goal there is no way of getting it back, instead
          you might want to just make the goal complate? <b>{{ goalTitle}}</b
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
</template>

<script>
import firebase from "firebase";
export default {
  props: ["goalId", "goalTitle"],

  data() {
    return {
      dialog: false,
    };
  },

  methods: {
    deleteGoal(id) {
      const db = firebase.app().firestore();
      db.collection("users")
        .doc(this.currentUserId)
        .collection("goals")
        .doc(id)
        .delete()
        .then(() => {})
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>

<style>
</style>