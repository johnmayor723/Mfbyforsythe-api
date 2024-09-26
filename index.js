const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;  // Use the port assigned by Render or default to 3000

// Root route
app.get('/', (req, res) => {
  res.send('Server started running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});