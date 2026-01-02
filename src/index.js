const express = require("express");
const app = express();

const eventsRouter = require("./events");

app.use(express.json());
app.use("/events", eventsRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
