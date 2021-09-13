import { config } from "https://raw.githubusercontent.com/daychongyang/dotenv/master/mod.ts";
import { opine, json } from "https://deno.land/x/opine@1.7.2/mod.ts";
import { UserController } from "./controllers/userController.ts";

config();
// Deno.env.get("DB_TYPE")
const app = opine();
app.use(json());

const userController = new UserController();

app.post("/login", userController.login);
app.post("/users", userController.create);

app.listen(3000, () =>
  console.log("server has started on http://localhost:3000 🚀")
);
