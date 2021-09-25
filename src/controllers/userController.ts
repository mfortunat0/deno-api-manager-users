import { Request, Response } from "https://deno.land/x/opine@1.8.0/mod.ts";
import { create, verify } from "https://deno.land/x/djwt@v2.3/mod.ts";
import { SmtpClient } from "https://deno.land/x/smtp/mod.ts";
import { key } from "../util/key.ts";

interface User {
  nickname: string;
  email: string;
  password: string;
}

export class UserController {
  users: User[] = [];
  client = new SmtpClient();

  constructor() {
    this.create = this.create.bind(this);
    this.login = this.login.bind(this);
  }

  async create(req: Request, res: Response) {
    const { nickname, email, password } = req.body as User;

    if (!nickname || !email || !password) {
      return res.setStatus(400).json();
    }

    const user = {
      nickname,
      email,
      password,
    };

    await this.client.connectTLS({
      hostname: Deno.env.get("SMTP_HOSTNAME") || "",
      port: Number(Deno.env.get("SMTP_PORT")) || 0,
      username: Deno.env.get("SMTP_USERNAME") || "",
      password: Deno.env.get("SMTP_PASSWORD") || "",
    });

    await this.client.send({
      from: "matheus.xmaz10@gmail.com",
      to: "nelson.homenick16@ethereal.email",
      subject: "Mail Title",
      content: "Mail Content",
      html: "<a href='https://github.com'>Github</a>",
    });

    await this.client.close();

    this.users.push(user);
    return res.setStatus(201).json(user);
  }

  async login(req: Request, res: Response) {
    const token = req.headers.get("authorization")?.split(" ")[1] as string;
    if (token) {
      const payload = await verify(token, key);
      const id = (payload.id as number) ?? 0;
      return res.setStatus(200).json(this.users[id]);
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.setStatus(400).json();
    }

    const id = this.users.findIndex(
      (user) => user.email === email && user.password === password
    );
    const jwt = await create({ alg: "HS512", typ: "JWT" }, { id }, key);

    if (id > -1) {
      return res.setStatus(200).json({
        token: jwt,
      });
    } else {
      return res.setStatus(204).json();
    }
  }
}
