import { Request, Response } from "https://deno.land/x/opine@1.7.2/mod.ts";
import { create, verify } from "https://deno.land/x/djwt@v2.3/mod.ts";
import { key } from "./key.ts";

interface User {
  nickname: string;
  email: string;
  password: string;
}

interface Header {
  header: {
    authorization: string;
  };
}

export class UserController {
  users: User[] = [];
  constructor() {
    this.create = this.create.bind(this);
    this.login = this.login.bind(this);
  }

  create(req: Request, res: Response) {
    const { nickname, email, password } = req.body as User;

    if (!nickname || !email || !password) {
      res.setStatus(400).json();
    }

    const user = {
      nickname,
      email,
      password,
    };

    this.users.push(user);
    res.setStatus(201).json(user);
  }

  async login(req: Request, res: Response) {
    const token = req.headers.get("authorization")?.split(" ")[1] as string;
    if (token) {
      const payload = await verify(token, key);
      const id = (payload.id as number) ?? 0;
      res.json(this.users[id]);
    }

    const { email, password } = req.body;

    if (!email || !password) {
      res.setStatus(400).json();
    }

    const id = this.users.findIndex(
      (user) => user.email === email && user.password === password
    );
    const jwt = await create({ alg: "HS512", typ: "JWT" }, { id }, key);

    if (id > -1) {
      res.setStatus(200).json({
        token: jwt,
      });
    } else {
      res.setStatus(204).json();
    }
  }
}
