const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

// In-memory data store for users (replace this with a real database in production)
const users = [
    {
      id: 1,
      username: 'user1',
      email: 'test@gmail.com',
      password: '12345678',
      images: ['hotel-1979406.jpg', 'room-2269594.jpg', 'villa-1737168.jpg'],
      videos: ['video1.mp4', 'video2.mp4', 'video3.mp4'],
    },

    {
        id: 2,
        username: 'user2',
        email: 'test2@gmail.com',
        password: '12345678',
        images: ['hotel-1979406.jpg', 'room-2269594.jpg', 'villa-1737168.jpg'],
        videos: ['video1.mp4', 'video2.mp4', 'video3.mp4'],
      },

      {
        id: 3,
        username: 'user3',
        email: 'test3@gmail.com',
        password: '12345678',
        images: ['hotel-1979406.jpg', 'room-2269594.jpg', 'villa-1737168.jpg'],
        videos: ['video1.mp4', 'video2.mp4', 'video3.mp4'],
      },
   
  ];
  

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
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
console.log('Start');
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
    }, 1000); 
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
    getUserImages(req.session.user.id)
      .then((userImages) => {
        getUserVideos(req.session.user.id) 
          .then((userVideos) => {
            console.log('User Images:', userImages);
            console.log('User Videos:', userVideos);
            res.render('dashboard', { user: req.session.user, images: userImages, videos: userVideos });
          })
          .catch((error) => {
            console.log('Error fetching user videos:', error);
            res.render('dashboard', { user: req.session.user, images: userImages, videos: [] });
          });
      })
      .catch((error) => {
        console.log('Error fetching user images:', error);
        res.render('dashboard', { user: req.session.user, images: [], videos: [] });
      });
  });
  
  

  function getUserImages(userId) {
    return new Promise((resolve, reject) => {
  
      const user = users.find(user => user.id === userId);
      if (user) {
        resolve(user.images || []);
      } else {
        reject(new Error('User not found'));
      }
    });
  }

  function getUserVideos(userId) {
    return new Promise((resolve, reject) => {

      const user = users.find(user => user.id === userId);
      if (user) {

        setTimeout(())
        resolve(user.videos || []);
      } else {
        reject(new Error('User not found'));
      }
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

