const express = require('express');
const recharge = require('./recharge');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
;

app.get('/recharge',(req,res) => {
  res.render("index");
})


app.post('/rec', async (req, res) => {

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
  res.send("success");

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});