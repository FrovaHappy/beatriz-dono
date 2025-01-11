CREATE TABLE IF NOT EXISTS Guilds (
  id text NOT NULL PRIMARY KEY,
  scope_bot TEXT CHECK (scope_bot IN ('public', 'private', 'owner')) NOT NULL DEFAULT 'public'
);
CREATE TABLE IF NOT EXISTS Users (
  id text NOT NULL PRIMARY KEY,
  FOREIGN KEY (id) REFERENCES Guilds (id)
);
CREATE TABLE IF NOT EXISTS Canvas (
  id text NOT NULL PRIMARY KEY,
  user_id text NOT NULL,
  guild_id text NOT NULL,
  title varchar(150) NOT NULL,
  forked integer,
  public boolean NOT NULL,
  base JSON,
  layers JSON,
  FOREIGN KEY (user_id) REFERENCES Users (id),
  FOREIGN KEY (guild_id) REFERENCES Guilds (id)
);
CREATE TABLE IF NOT EXISTS Colors (
  id text NOT NULL PRIMARY KEY,
  guild_id text NOT NULL,
  hex_color text NOT NULL,
  role_id text NOT NULL,
  FOREIGN KEY (guild_id) REFERENCES Guilds (id)
);
CREATE TABLE IF NOT EXISTS ColorSetting (
  id text NOT NULL PRIMARY KEY,
  guild_id text NOT NULL,
  is_active boolean NOT NULL,
  pointer_id integer NOT NULL,
  templete JSON,
  FOREIGN KEY (guild_id) REFERENCES Guilds (id)
);
CREATE TABLE IF NOT EXISTS Goodbye_Messages (
  id text NOT NULL PRIMARY KEY,
  guild_id text NOT NULL,
  is_active boolean NOT NULL,
  content text,
  embed JSON,
  image text,
  FOREIGN KEY (guild_id) REFERENCES Guilds (id),
  FOREIGN KEY (image) REFERENCES Canvas (id)
);
CREATE TABLE IF NOT EXISTS Welcome_Messages (
  id text NOT NULL PRIMARY KEY,
  guild_id text NOT NULL,
  is_active boolean NOT NULL,
  content text,
  embed JSON,
  image text,
  FOREIGN KEY (guild_id) REFERENCES Guilds (id)
);