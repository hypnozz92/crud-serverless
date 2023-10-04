const AWS = require('aws-sdk');
let dbClientParams = {};

if (process.env.IS_OFFLINE) {
  dbClientParams = {
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  };
}

const db = new AWS.DynamoDB.DocumentClient(dbClientParams);

exports.update_user = async event => {
  // Parse the request body to extract the user data to update
  const requestBody = JSON.parse(event.body);
  const userId = event.pathParameters.id; // The 'id' must be part of the path

  // Create an update expression for DynamoDB
  const updateExpression = [];
  const expressionAttributeValues = {};

  try {
    for (const key in requestBody) {
      if (key !== 'id') {
        updateExpression.push(`#${key} = :${key}`);
        expressionAttributeValues[`:${key}`] = requestBody[key];
        expressionAttributeValues[`#${key}`] = key;
      }
    }

    // Build the update parameters
    const params = {
      TableName: 'usersTable',
      Key: {
        pk: userId, // Replace with your partition key value
      },
      UpdateExpression: 'SET #name = :name , #id = :id',
      ExpressionAttributeNames: {
        '#name': 'name', // Map 'Name' to the reserved word '#Name'
        '#id': 'id',
      },
      ExpressionAttributeValues: {
        ':name': requestBody.name,
        ':id': requestBody.id,
      },
      KeyConditionExpression: 'pk = :pk',

      ReturnValues: 'ALL_NEW',
    };

    // Perform the update operation
    const updatedUser = await db.update(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(updatedUser.Attributes),
    };
  } catch (error) {
    console.error('Error updating user:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
