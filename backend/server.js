const express = require('express');
// const mongoose = require('mongoose');
const cors = require("cors");
const mysql = require('mysql2/promise');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// app.use(express.json());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
const connection = require('./db');

async function createUserTable() {
  try {
    // Check if the User table already exists
    const [rows] = await connection.query('SHOW TABLES LIKE "User"');

    // If User table does not exist, create it
    if (rows.length === 0) {
      const createUserTableQuery = `
              CREATE TABLE User (
                  id INT AUTO_INCREMENT PRIMARY KEY,
                  email VARCHAR(255) UNIQUE NOT NULL,
                  password VARCHAR(255) NOT NULL,
                  firstName VARCHAR(30) NOT NULL,
                  lastName VARCHAR(30) NOT NULL,
                  notifyUser BOOLEAN DEFAULT FALSE,
                  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
              )
          `;

      // Execute the query to create the User table
      await connection.query(createUserTableQuery);
      console.log('User table created successfully!');
    } else {
      console.log('User table already exists.');
    }
  } catch (error) {
    console.error('Error creating User table:', error);
  }
}

createUserTable();

async function createArticleTable() {
  try {
    // Check if the Article table already exists
    const [rows] = await connection.query('SHOW TABLES LIKE "Article"');

    // If Article table does not exist, create it
    if (rows.length === 0) {
      const createArticleTableQuery = `
          CREATE TABLE Article (
              id INT AUTO_INCREMENT PRIMARY KEY,
              createdBy INT NOT NULL,
              lastModifiedBy INT,
              title VARCHAR(20) NOT NULL,
              subTitle VARCHAR(30),
              content VARCHAR(200) NOT NULL,
              slug VARCHAR(10) NOT NULL,
              status ENUM('Published', 'Scheduled', 'Draft') NOT NULL,
              showAuthor BOOLEAN,
              authorName VARCHAR(255),
              publishDate   VARCHAR(255),
              publishTime VARCHAR(255),
              publishTaskReference VARCHAR(255),
              mailTaskReference VARCHAR(255),
              accessSlug BOOLEAN NOT NULL,
              attachments VARCHAR(255),
              createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              FOREIGN KEY (createdBy) REFERENCES User(id) ON DELETE CASCADE ON UPDATE CASCADE,
              FOREIGN KEY (lastModifiedBy) REFERENCES User(id) ON DELETE CASCADE ON UPDATE CASCADE
          )
      `;

      // Execute the query to create the Article table
      await connection.query(createArticleTableQuery);
      console.log('Article table created successfully!');
    } else {
      console.log('Article table already exists.');
    }
  } catch (error) {
    console.error('Error creating Article table:', error);
  }
}

createArticleTable();

// const uri = process.env.ATLAS_URI;
// mongoose.connect(uri);
// const connection = mongoose.connection;
// connection.once('open', () => {
//   console.log("MongoDB database connection established successfully");
// })

const articlesRouter = require('./routes/articles');
const usersRouter = require('./routes/users');

app.use('/articles', articlesRouter);
app.use('/users', usersRouter);

//static files
// app.use(express.static(path.join(__dirname, "../build")));

// app.get("*", function (req, res) {
//   res.sendFile(path.join(__dirname, "../build/index.html"));
// });

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});