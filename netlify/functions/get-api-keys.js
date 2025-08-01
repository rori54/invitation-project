exports.handler = async (event, context) => {
  try {
    const imgbbApiKey = process.env.IMGBB_API_KEY;
    
    if (!imgbbApiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'IMGBB API key not configured' })
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: JSON.stringify({
        imgbb: imgbbApiKey
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};