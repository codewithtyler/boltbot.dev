const express = require('express');
const config = require('../config');

exports.startWebServer = function () {
  const app = express();

  app.get('/', (req, res) => {
    res.send(`
      <html>
        <head>
          <title>Bolt Discord Bot</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              background: #0d1117;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
            }
            .container {
              text-align: center;
              padding: 2rem;
              background: #161b22;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0,0,0,0.2);
              color: #c9d1d9;
            }
            h1 {
              color: #5865F2;
              margin-bottom: 1.5rem;
            }
            .status {
              color: #57F287;
              font-weight: bold;
              margin: 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Bolt Discord Bot</h1>
            <p class="status">🟢 Bot is running</p>
          </div>
        </body>
      </html>
    `);
  });

  app.listen(config.port, () => {
    console.log('Web server started successfully');
  });
}