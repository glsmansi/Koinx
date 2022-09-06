const request = require("request");
const User = require("../models/User");
const EthereumCost = require("../models/EthereumCost");

module.exports.userDetails = async (req, res) => {
  const { address } = req.params;
  console.log(address);
  request(
    `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${process.env.ETHERSCAN_API_KEY}`,
    async (error, response, body) => {
      console.error("error:", error); // Print the error if one occurred
      console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
      //   console.log("body:", body); // Print the HTML for the Google homepage.
      const oldUser = await User.findOne({ address });
      transactions = JSON.parse(body);
      console.log(typeof transactions);
      if (oldUser) {
        oldUser.transactions = transactions.result;
        await oldUser.save();
        res.send(oldUser);
      } else {
        const newUser = await User.create({
          address,
          transactions: transactions.result,
        });
        await newUser.save();
        res.send(newUser);
      }
    }
  );
};

module.exports.userBalance = async (req, res) => {
  const { address } = req.params;
  balance = 0;

  const cost = await EthereumCost.findOne({});
  //   console.log(cost.cost);
  const user = await User.findOne({ address: address });

  user.transactions.forEach((transaction) => {
    if (transaction.from == address) {
      balance -= parseInt(transaction.value);
    } else {
      balance += parseInt(transaction.value);
    }
  });
  details = { balance: balance, ethereumCost: cost.cost };
  res.send(details);
};
