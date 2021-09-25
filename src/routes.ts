import { Router } from "https://deno.land/x/opine@1.8.0/mod.ts";
import { UserController } from "./controllers/userController.ts";

const routes = Router();

const userController = new UserController();

routes.post("/login", userController.login);
routes.post("/users", userController.create);

export { routes };
