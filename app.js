const express = require("express");
const port = process.env.PORT || 3001;
const request = require("request");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const EthereumCost = require("./models/EthereumCost");
const userController = require("./controllers/user");

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/koinx";
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongodb connected"))
  .catch((e) => console.log(e));

const app = express();

app.get("/api/:address", userController.userDetails);

app.get("/balance/:address", userController.userBalance);

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});

function ethereumCost() {
  request(
    "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr",
    async function (error, response, body) {
      cost = JSON.parse(body);
      //   console.log(cost.ethereum.inr);
      await EthereumCost.deleteMany();
      ethereumPrice = await EthereumCost.create({
        cost: cost.ethereum.inr,
      });
    }
  );
  setTimeout(async function () {
    await ethereumCost();
  }, 600000);
}

ethereumCost();
