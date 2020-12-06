<template>
  <v-app id="inspire">
    <v-main class="light-blue darken-2">
      <v-container fill-height>
        <v-col align="center">
          <h1 class="text-md-center white--text funFont name">Tempo</h1>

          <h1 class="text-md-center white--text funFont">
            The best way to keep track of your time and goals, OH YEAH!
          </h1>
          <p class="text-md-center white--text funFont">
            Tempo is a great tool to keep track of the time that you are putting
            into your goals and show you how far you've come!
          </p>
          <v-btn
            class="md-center"
            elevation="4"
            rounded
            x-large
            @click="googleLogin"
            >Login with Gmail</v-btn
          >
        </v-col>
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

<style>
@import url("https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap");

.funFont {
  font-family: "Fredoka One", "Courier New", Courier, monospace;
}
.name {
  font-size: 5em;
}
</style>