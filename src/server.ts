import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";

import filterCourses from "./services/filterCourses";

const app: Application = express();

app.get("/api/test", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ message: "Let's colaborote" });
});

app.use(bodyParser.json({ limit: '50mb' }));
app.post("/api/filter", (req: Request, res: Response) => {
  res
    .status(200)
    .json(filterCourses(req.body.requiredRange))
});

const port = 3000;

app.listen(port, () => {
  console.log(`\nServer listening on http://localhost:${port}\n`);
})
