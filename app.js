const express = require('express');
const recharge = require('./recharge');

const app = express();

app.use(express.json());

app.post('/recharge', async (req, res) => {

  const { stbNumber } = req.body;

  if (!stbNumber || stbNumber.trim() === '') {

    console.log("Invalid STB Number");

    return res.status(400).json({
      success: false,
      message: 'STB Number is required'
    });
  }

  console.log("Recharge Request:", stbNumber);

  const result = await recharge(stbNumber);

  res.json(result);

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});