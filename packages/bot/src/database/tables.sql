CREATE TABLE IF NOT EXISTS Guilds (
  id text NOT NULL PRIMARY KEY,
  scope_bot TEXT CHECK (scope_bot IN ('public', 'private', 'owner')) NOT NULL DEFAULT 'public'
);
CREATE TABLE IF NOT EXISTS Guilds_Features (
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
  forked TEXT,
  version varchar(10) NOT NULL,
  visibility text CHECK (visibility IN ('public', 'private')) NOT NULL DEFAULT 'private',
  w integer NOT NULL,
  h integer NOT NULL,
  bg_color text,
  layer_cast_color text,
  layers JSON,
  FOREIGN KEY (forked) REFERENCES Canvas (id),
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
CREATE TABLE IF NOT EXISTS ColorsSettings (
  guild_id text NOT NULL PRIMARY KEY,
  is_active boolean DEFAULT false,
  pointer_id text,
  templete json,
  FOREIGN KEY (guild_id) REFERENCES Guilds (id)
);
CREATE TABLE IF NOT EXISTS Goodbyes (
  guild_id text NOT NULL PRIMARY KEY,
  message JSON NOT NULL,
  channel_id text,
  FOREIGN KEY (guild_id) REFERENCES Guilds (id)
);
CREATE TABLE IF NOT EXISTS Welcomes (
  guild_id text NOT NULL PRIMARY KEY,
  message JSON NOT NULL,
  channel_id text,
  FOREIGN KEY (guild_id) REFERENCES Guilds (id)
);