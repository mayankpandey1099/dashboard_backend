import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({
    data: null,
    status: 200,
    message: "Banana Clicker Backend is running",
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
