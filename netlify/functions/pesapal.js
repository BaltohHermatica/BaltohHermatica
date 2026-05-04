const crypto = require("crypto");

exports.handler = async function(event, context) {
  const consumerKey = "60es+/UH3C+0x/MCUqePf0Mcl7Us4NnY";
  const consumerSecret = "2rncHaKyB1ryHjvtx109A8cvOa8=";

  const callbackUrl = "https://your-site-name.netlify.app/callback"; 

  const method = "GET";
  const url = "https://demo.pesapal.com/api/PostPesapalDirectOrderV4";
  const params = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: Math.random().toString(36).substring(2),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(new Date().getTime() / 1000),
    oauth_version: "1.0",
    oauth_callback: callbackUrl
  };

  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join("&");

  const baseString = `${method}&${encodeURIComponent(url)}&${encodeURIComponent(sortedParams)}`;

  const signingKey = `${consumerSecret}&`;
  const signature = crypto.createHmac("sha1", signingKey).update(baseString).digest("base64");

  const signedUrl = `${url}?${sortedParams}&oauth_signature=${encodeURIComponent(signature)}`;

  return {
    statusCode: 200,
    body: JSON.stringify({
      checkoutUrl: signedUrl
    })
  };
};
