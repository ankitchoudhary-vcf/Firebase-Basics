const auth = firebase.auth();

const whenSignIn = document.getElementById("whenSignIn");
const whenSignOut = document.getElementById("whenSignOut");

const SignInBtn = document.getElementById("signInBtn");
const SignOutBtn = document.getElementById("signOutBtn");

const userDetails = document.getElementById("userDetails");

const provider = new firebase.auth.GoogleAuthProvider();

SignInBtn.onclick = () => auth.signInWithPopup(provider);

SignOutBtn.onclick = () => auth.signOut();

const db = firebase.firestore();

const createThing = document.getElementById("createThings");
const thingsList = document.getElementById("thingsList");

let thingsRef;
let unsubscribe;


auth.onAuthStateChanged(user => {
    if (user) {
        // signed in
        whenSignIn.hidden = false;
        whenSignOut.hidden = true;
        userDetails.innerHTML = `<h3> Hello ${user.displayName} !!</h3><p> user ID: ${user.uid} </p>`;

        createThings.disabled = false;



        // Database Reference
        thingsRef = db.collection('things');

        createThings.onclick = () => {

            const { serverTimestamp } = firebase.firestore.FieldValue;

            thingsRef.add({
                uid: user.uid,
                name: faker.commerce.productName(),
                createdAt: serverTimestamp()
            });
        };


        // Query
        unsubscribe = thingsRef
            .where('uid', '==', user.uid)
            .orderBy('createdAt') // Requires a query
            .onSnapshot(querySnapshot => {

                // Map results to an array of li elements

                const items = querySnapshot.docs.map(doc => {

                    return `<li>${doc.data().name}</li>`

                });

                thingsList.innerHTML = items.join('');

            });

    }
    else {
        // not signed in
        whenSignIn.hidden = true;
        whenSignOut.hidden = false;
        userDetails.innerHTML = '';


        // Unsubscribe when the user signs out
        unsubscribe && unsubscribe();
        createThings.disabled = true;

    }
});

