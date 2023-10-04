const AWS = require('aws-sdk');
let dbClientParams = {};

if (process.env.IS_OFFLINE) {
  d;
  dbClientParams = {
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  };
}

const db = new AWS.DynamoDB.DocumentClient(dbClientParams);

//----------------------------------------------------------------------------

exports.get_users = async event => {
  const params = {
    TableName: 'usersTable',
  };

  try {
    const data = await db.scan(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(data.Items),
    };
  } catch (error) {
    console.error('Error retrieving users:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
