<template>
  <v-app id="inspire">
    <v-app-bar app color="white" flat>
      <v-tabs centered class="ml-n9" color="grey darken-1">
        <v-tab v-for="link in links" :key="link">
          {{ link }}
        </v-tab>
      </v-tabs>
      <!-- <div id="firebaseui-auth-container"></div> -->
      <!-- login goes here -->
      <button @click="googleLogin">Sign In With GMail Account</button>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-sheet min-height="70vh" class="grey lighten-3">
          <div>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Expedita
            laboriosam temporibus, voluptate suscipit facilis sint excepturi
            corrupti quaerat cumque voluptatibus nostrum eos harum iste!
            Reiciendis odit quia quidem suscipit impedit!
          </div>
        </v-sheet>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import firebase from "firebase";

export default {
  data: () => ({
    links: ["Dashboard", "Messages", "Profile", "Updates"],
  }),

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