import https from 'node:https';

// Usage example
// const testEmail = "free_email@example.com";
// const testIpAddress = "99.110.204.1"; 
const apiKey = '1d8ba1be902647d1b0c074b91920b4e5';

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

async function processEmailValidation(email, ipAddress) {
    const validationResult = await getEmailValidationResult(email, ipAddress);
    if (validationResult) {
        return validationResult; 
    } else {
        throw new Error("Validation failed or returned no result");
    }
}

export default processEmailValidation;