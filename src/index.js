
// Import required modules
const express = require("express");
const path = require("path");
const app = express();
const LogInCollection = require("./mongo");
const port = process.env.PORT || 3000;

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json()); //parsing
app.use(express.urlencoded({ extended: false }));



// Set up view engine and static directory
const tempelatePath = path.join(__dirname, '../tempelates');
const publicPath = path.join(__dirname, '../public');
app.set('view engine', 'hbs');
app.set('views', tempelatePath);
app.use(express.static(publicPath));

// Route to render signup form
app.get('/signup', (req, res) => {
    res.render('signup');
});

// Route to render login form
app.get('/', (req, res) => {
    res.render('login');
});

// Route for user signup
app.post('/signup', async (req, res) => {
    try {
        const existingUser = await LogInCollection.findOne({ name: req.body.name });
        if (existingUser) {
            return res.send("User details already exist");
        }
        // Create a new user document and save it to the database
        const newUser = new LogInCollection({
            name: req.body.name,
            password: req.body.password
        });
        await newUser.save();
        res.status(201).render("home", { naming: req.body.name });
    } catch (error) {
        console.error("Error in signup:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Route for user login
app.post('/login', async (req, res) => {
    try {
        const user = await LogInCollection.findOne({ name: req.body.name });
        if (!user || user.password !== req.body.password) {
            return res.send("Incorrect username or password");
        }
        res.status(201).render("home", { naming: req.body.name });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Start the server
app.listen(port, () => {
    console.log('Server is running on port', port);
});
