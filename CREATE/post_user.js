const aws = require('aws-sdk');
let dbClientParams = {};

if (process.env.IS_OFFLINE) {
  dbClientParams = {
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  };
};

const db = new aws.DynamoDB.DocumentClient(dbClientParams);
const crypto = require('crypto');

//----------------------------------------------------------------------------

exports.post_user = async event => {
  try {
    // Parse the request body to extract the user data
    const requestBody = JSON.parse(event.body);

    // Validate the request body to ensure it contains the required data
    if (!requestBody.id || !requestBody.name) {
      return {
        statusCode: 400, // Bad Request
        body: JSON.stringify({ message: 'Name and pk are required fields' }),
      };
    }

    // Create a new user object
    const newUser = {
      pk: crypto.randomUUID(), // Replace with your partition key value
      name: requestBody.name,
      id: requestBody.id,
      // Add more user attributes as needed
    };

    // Define the DynamoDB parameters for the put operation
    const params = {
      TableName: 'usersTable', // Replace with your DynamoDB table name
      Item: newUser,
    };

    // Perform the put operation to insert the new user into DynamoDB
    await db.put(params).promise();

    return {
      statusCode: 201, // Created
      body: JSON.stringify(newUser),
    };
  } catch (error) {
    console.error('Error creating user:', error);

    return {
      statusCode: 500, // Internal Server Error
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
