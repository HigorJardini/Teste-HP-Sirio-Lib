import express from "express";
import dataSource from "./configs/data-source";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import { setupSwagger } from "./configs/swagger";

const app = express();
const port = 3000;

setupSwagger(app);

dataSource
  .initialize()
  .then(() => {
    app.use(express.json());

    // Config Routes
    app.use("/api/auth", authRoutes);
    app.use("/api/users", userRoutes);

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Error during Data Source initialization", error);
  });
