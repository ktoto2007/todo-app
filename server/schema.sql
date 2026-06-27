CREATE TABLE IF NOT EXISTS folders (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS todos (
    id         SERIAL PRIMARY KEY,
    title      VARCHAR(255) NOT NULL,
    completed  BOOLEAN DEFAULT FALSE,
    important  BOOLEAN DEFAULT FALSE,
    deadline   DATE,
    folder_id  INTEGER REFERENCES folders(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW()
);