<template>
  <v-app id="inspire">
    <v-main class="light-blue darken-2">
      <v-container fill-height>
        <v-row >
          <v-col cols="12" sm="6" md="8">
            <h1 class="text-md-center white--text">Keep track of how your goals with time</h1>
            <p class="text-md-center white--text">Tempo is a great tool to keep track of the time that you are putting into your goals and show you how far you've come!</p>
          </v-col>
          <v-col cols="6" md="4">
            <v-btn class="md-center" elevation="4" rounded x-large @click="googleLogin">Login with Gmail</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import firebase from "firebase";

export default {


  methods: {

    googleLogin() {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then((userCredential) => {
          console.log("LOGGED IN W GMAIL:", userCredential.user);
        })
        .catch((error) => console.log(error));
    },

  },
};
</script>