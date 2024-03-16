import https from 'node:https';
import admin from 'firebase-admin';
import serviceAccount from '../data/serviceAccount.js';


const apiKey = '1d8ba1be902647d1b0c074b91920b4e5';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://kitchen-on-selwyn-rd-default-rtdb.firebaseio.com/' // Add your Realtime Database URL here
});

const db = admin.database();

async function checkValidatedEmail(email) {
    const sanitizedEmail = email.replace(/\./g, ','); // Firebase keys cannot contain '.' character
    const emailRef = db.ref(`validatedEmails/${sanitizedEmail}`);
    const snapshot = await emailRef.once('value');
    return snapshot.exists();
}

async function validateEmail(email, ip_address = '') {
    return new Promise((resolve, reject) => {
        const url = `https://api.zerobounce.net/v2/validate?api_key=${apiKey}&email=${email}&ip_address=${ip_address}`;

        https.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(data);
                    resolve(parsedData);
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                    reject(error);
                }
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}


async function getEmailValidationResult(email, ipAddress) {
    try {
        const response = await validateEmail(email, ipAddress);
        console.log(response); 
        
        return response; 
    } catch (error) {
        console.error(error);
    }
}

async function storeValidatedEmail(email) {
    const ref = db.ref("validatedEmails");
    const sanitizedEmail = email.replace('.', ','); 
    await ref.child(sanitizedEmail).set({
        email: email,
        validatedAt: admin.database.ServerValue.TIMESTAMP
    });
}

async function processEmailValidation(email, ipAddress) {
    // First, check if the email has already been validated
    const isEmailValidated = await checkValidatedEmail(email);

    if (isEmailValidated) {
        return { status: 'valid', email: email };
    } else {
        // Proceed with validation
        const validationResult = await getEmailValidationResult(email, ipAddress);
        if (validationResult && validationResult.status === 'valid') {
            // Store validated email
            await storeValidatedEmail(email);
            return validationResult; // Return the validation result
        } else {
            // Handle non-valid results accordingly
            throw new Error("Validation failed or email is not valid");
        }
    }
}

export default processEmailValidation;