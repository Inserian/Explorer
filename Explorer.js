const express = require("express");
const Blockchain = require("./blockchain");
const PORT = 3000;

const app = express();
const myChain = new Blockchain();

app.get("/block/:blockHeight", (req, res) => {
  const blockHeight = req.params.blockHeight;
  if (blockHeight < 0 || blockHeight >= myChain.chain.length) {
    res.status(404).json({error: "Block not found"});
    return;
  }
  const block = myChain.chain[blockHeight];
  res.json({
    blockHeight: blockHeight,
    timestamp: block.timestamp,
    data: block.data,
    previousHash: block.previousHash,
    hash: block.hash
  });
});

app.get("/transaction/:transactionId", (req, res) => {
  const transactionId = req.params.transactionId;
  let transactionFound = false;
  myChain.chain.forEach((block) => {
    block.data.forEach((transaction) => {
      if (transaction.id === transactionId) {
        transactionFound = true;
        res.json({
          id: transaction.id,
          amount: transaction.amount,
          sender: transaction.sender,
          recipient: transaction.recipient
        });
      }
    });
  });
  if (!transactionFound) {
    res.status(404).json({error: "Transaction not found"});
  }
});

app.listen(PORT, () => {
  console.log(`Blockchain explorer listening on port ${PORT}!`);
});
