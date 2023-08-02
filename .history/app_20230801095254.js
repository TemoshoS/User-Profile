const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

// In-memory data store for users (replace this with a real database in production)
const users = [
  { id: 1, username: 'user1', email: 'user1@example.com', password: 'password1' },
  { id: 2, username: 'user2', email: 'user2@example.com', password: 'password2' },
];

app.set('view engine', 'ejs');

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
}));

app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to check if the user is logged in
function requireLogin(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  } else {
    return res.redirect('/login');
  }
}

app.get('/', requireLogin, (req, res) => {
  res.redirect('/dashboard');
});

app.get('/login', (req, res) => {
  res.render('login', { message: '' });
});

// Simulating an asynchronous login function
function performLogin(email, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find(user => user.email === email && user.password === password);
      if (user) {
        resolve(user);
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 1000); // Simulating a delay of 1 second
  });
}

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await performLogin(email, password);
    req.session.user = user;
    res.redirect('/dashboard');
  } catch (error) {
    res.render('login', { message: 'Invalid credentials, please try again.' });
  }
});

app.get('/dashboard', requireLogin, (req, res) => {
  const userImages = getUserImages(req.session.user.id);
  const userVideos = getUserVideos(userImages);

  Promise.all([userImages, userVideos]).then(([images, videos]) => {
    console.log('User Images:', images);
    console.log('User Videos:', videos);
    res.render('dashboard', { user: req.session.user, images, videos });
  });
});

function getUserImages(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([`image1 of user ${userId}`, `image2 of user ${userId}`, `image3 of user ${userId}`]);
    }, 1000); // Simulating a delay of 1 second
  });
}

function getUserVideos(images) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userId = images[0].split(' ')[3]; // Extracting user ID from the first image
      resolve([`video1 of user ${userId}`, `video2 of user ${userId}`, `video3 of user ${userId}`, `video4 of user ${userId}`]);
    }, 1000); // Simulating a delay of 1 second
  });
}

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect('/login');
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
