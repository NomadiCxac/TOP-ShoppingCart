import { useState, useEffect } from 'react'
import updateRequestBody from '../data/formBody'

const CreateGoogleForm = () => {


    const handleFormCreation = async () => {
        const createRequestBody = {
            "info": {
                "title": "Request Order Date",
            }
    }



    try {
        const createResponse = await fetch('https://forms.googleapis.com/v1/forms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "ya29.a0AfB_byBOJbqgS2_0JFxAcvFFBHqeDz2oHPfMWitBZT7_sd-493pyZP0GNE52do1w2xjv4zaYPCJYjS_17PDf3clzrI8fb66YNXcOYAwWT39xsaCifNt2IXBwQ6Jh_ENzwtMgERamgR1fJY-mn2YGuSMbXrYiVjBkdhQbaCgYKAcsSARISFQHGX2MiVPfe31g3eT8ks3NyyRM6pg0171"
            },
            body: JSON.stringify(createRequestBody)
        }) 

        if (!createResponse.ok) {
            throw new Error('Form creation failed');
        }

        const createResponseData = await createResponse.json();
        
        const formId = createResponseData.formId; // Replace with actual response field
  
        try {
            const updateResponse = await fetch(`https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': "ya29.a0AfB_byBOJbqgS2_0JFxAcvFFBHqeDz2oHPfMWitBZT7_sd-493pyZP0GNE52do1w2xjv4zaYPCJYjS_17PDf3clzrI8fb66YNXcOYAwWT39xsaCifNt2IXBwQ6Jh_ENzwtMgERamgR1fJY-mn2YGuSMbXrYiVjBkdhQbaCgYKAcsSARISFQHGX2MiVPfe31g3eT8ks3NyyRM6pg0171" // Replace with actual token
              },
              body: JSON.stringify(updateRequestBody)
            });
          
            if (!updateResponse.ok) {
              throw new Error('Form update failed');
            }
          
            // Process the update response...
          } catch (error) {
            console.error('Error updating form:', error);
            // Handle errors here
          }
  
      } catch (error) {
        console.error('Error creating form:', error);
        // Handle errors here
      }
    }

    useEffect(() => {
        handleFormCreation();
    }, []);

    return (
        <button onClick={handleFormCreation}>Create Google Form</button>
    );

}

export default CreateGoogleForm;