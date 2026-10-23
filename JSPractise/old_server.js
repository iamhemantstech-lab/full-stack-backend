import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();
app.use(cors());

const API_BASE_URL = `/api/${process.env.API_VERSION}`;

app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.get(`${API_BASE_URL}/users`, (req, res) => {
  const dummyData = [
    {
      id: 1,
      name: "John",
      email: "john@example.com",
      role: "Developer",
      salary: 50000,
    },
    {
      id: 2,
      name: "Priya",
      email: "priya@example.com",
      role: "Designer",
      salary: 45000,
    },
    {
      id: 3,
      name: "Rahul",
      email: "rahul@example.com",
      role: "Manager",
      salary: 65000,
    },
  ];
  res.send(dummyData);
});

const port = process.env.PORT | 3000;

app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});
