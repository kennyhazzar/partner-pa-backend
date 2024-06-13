export class CommonConfigs {
  port: number;
  env: string;
  secret: string;
}

export class DatabaseConfigs {
  type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
}

export class RedisConfigs {
  host: string;
  port: number;
}

export class EmailConfigs {
  host: string;
  port: number;
  user: string;
  pass: string;
}
