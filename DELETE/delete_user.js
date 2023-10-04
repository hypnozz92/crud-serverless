const AWS = require('aws-sdk');
let dbClientParams = {};

if (process.env.IS_OFFLINE) {
  dbClientParams = {
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  };
}

const db = new AWS.DynamoDB.DocumentClient(dbClientParams);

//----------------------------------------------------------------------------

exports.delete_user = async event => {
  const userId = event.pathParameters.id;

  if (!userId) {
    return {
      statusCode: 400, // Bad Request
      body: JSON.stringify({ message: 'Invalid user ID' }),
    };
  }

  console.log(userId);

  const params = {
    Key: {
      pk: userId,
    },
    TableName: 'usersTable',
  };

  console.log(params);

  try {
    const data = await db.get(params).promise();

    if (!data.Item) {
      return {
        statusCode: 404, // Not Found
        body: JSON.stringify({ message: 'User not found' }),
      };
    }

    await db.delete(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(`User ${data.Item.name} was deleted succesfully`),
    };
  } catch (error) {
    console.error('Error retrieving user:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
