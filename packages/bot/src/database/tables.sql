CREATE TABLE IF NOT EXISTS Guilds (
  id text NOT NULL PRIMARY KEY,
  scope_bot TEXT CHECK (scope_bot IN ('public', 'private', 'owner')) NOT NULL DEFAULT 'public'
);
CREATE TABLE IF NOT EXISTS Guild_Features (
  guild_id text NOT NULL PRIMARY KEY,
  welcome boolean NOT NULL DEFAULT false,
  goodbye boolean NOT NULL DEFAULT false,
  colors boolean NOT NULL DEFAULT false,
  FOREIGN KEY (guild_id) REFERENCES Guilds (id)
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
  guild_id text NOT NULL PRIMARY KEY,
  is_active boolean DEFAULT false,
  pointer_id text,
  templete json,
  FOREIGN KEY (guild_id) REFERENCES Guilds (id)
);
CREATE TABLE IF NOT EXISTS Goodbyes (
  guild_id text NOT NULL PRIMARY KEY,
  content text,
  embed JSON,
  channel_id text,
  FOREIGN KEY (guild_id) REFERENCES Guilds (id)
);
CREATE TABLE IF NOT EXISTS Welcomes (
  guild_id text NOT NULL PRIMARY KEY,
  content text,
  embed JSON,
  channel_id text,
  FOREIGN KEY (guild_id) REFERENCES Guilds (id)
);