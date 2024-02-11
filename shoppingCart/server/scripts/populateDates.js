import admin from 'firebase-admin';
import serviceAccount from '../data/serviceAccount.js';

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://kitchen-on-selwyn-rd-default-rtdb.firebaseio.com/' // Add your Realtime Database URL here
});

const db = admin.database();

const populateDates = async () => {
  const year = 2024; // Example year
  const months = [ '01_January', '02_February', '03_March', '04_April', '05_May', '06_June', 
  '07_July', '08_August', '09_September', '10_October', '11_November', '12_December'
];

  const datesRef = db.ref('validPickUpDates/' + year);
  months.forEach((month, index) => {
    const daysInMonth = new Date(year, index + 1, 0).getDate();
    let monthData = {};
    for (let day = 1; day <= daysInMonth; day++) {
      // Prepare data for each date
      monthData[month + '/' + day] = {
        isPickUpDate: false,
        times: []
      };
    }
    // Update the database in batches by month
    datesRef.update(monthData, error => {
      if (error) {
        console.error('Error populating dates for', month, ':', error);
      } else {
        console.log('Successfully populated dates for', month);
      }
    });
  });
};

populateDates();