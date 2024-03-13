import admin from 'firebase-admin';
import serviceAccount from '../data/serviceAccount.js';
import adminUsers from '../data/adminUsers.js';


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://kitchen-on-selwyn-rd-default-rtdb.firebaseio.com/"
  });
  
  // Get a reference to the Auth service
  const auth = admin.auth();

//   // Function to list all users and count anonymous ones
// const countAnonymousUsers = async () => {
//     let anonymousCount = 0;
  
//     const listAllUsers = async (nextPageToken) => {
//       // List batch of users, 1000 at a time.
//       await auth.listUsers(1000, nextPageToken)
//         .then(async (listUsersResult) => {
//           listUsersResult.users.forEach((userRecord) => {
//             // Check for anonymous users
//             if (userRecord.providerData.length === 0) { // Anonymous user has no providers
//               anonymousCount++;
//             }
//           });
//           if (listUsersResult.pageToken) {
//             // List next batch of users.
//             await listAllUsers(listUsersResult.pageToken);
//           } else {
//             // All users have been listed and the count is complete
//             console.log(`Total anonymous users: ${anonymousCount}`);
//           }
//         })
//         .catch((error) => {
//           console.log('Error listing users:', error);
//         });
//     };
  
//     await listAllUsers();
//   };
  
//   // Call the function to start counting anonymous users
//   countAnonymousUsers();
  
  // Function to list all users and delete anonymous ones
  const deleteAnonymousUsers = async () => {
    const listAllUsers = async (nextPageToken) => {
      // List batch of users, 1000 at a time.
      auth.listUsers(1000, nextPageToken)
        .then(async (listUsersResult) => {
          listUsersResult.users.forEach(async (userRecord) => {
            // Check for anonymous users
            if (userRecord.providerData.length === 0) { // Anonymous user has no providers therefore is anonymous
              // Delete the user
              await auth.deleteUser(userRecord.uid);
              console.log(`Deleted user ${userRecord.uid}`);
            }
          });
          if (listUsersResult.pageToken) {
            // List next batch of users.
            await listAllUsers(listUsersResult.pageToken);
          }
        })
        .catch((error) => {
          console.log('Error listing users:', error);
        });
    };
    
    await listAllUsers();
  };
  
  // Call the function to start the deletion process
  deleteAnonymousUsers();