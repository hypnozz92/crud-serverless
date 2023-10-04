const aws = require('aws-sdk');
let dbClientParams = {};

if (process.env.IS_OFFLINE) {
  dbClientParams = {
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  };
};

const db = new aws.DynamoDB.DocumentClient(dbClientParams);

//----------------------------------------------------------------------------

exports.get_userid = async event => {
  const userId = event.pathParameters.id;

  const params = {
    Key: {
      pk: userId,
    },
    TableName: 'usersTable',
  };

  try {
    const data = await db.get(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(data.Item),
    };
  } catch (error) {
    console.error('Error retrieving user:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
