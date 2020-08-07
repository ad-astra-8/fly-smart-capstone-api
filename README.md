# Fly-Smart-capstone-client

The app helps travelers getting more organized and alert for their upcoming trips. 
It provides users with safety guidelines related to COVID 19 pandemic.
Logged in users can check if they have everything they need before their flight by checking boxes of lists (initially provided) of mostly recommended items.
Users are able to identify which category they belong to and follow related guidelines: example:
"traveling with babies" - "elderly people" - "groups and families".
Also, according to their needs, users can create new entries and annex them to the list initially provided.
Users also have access to airport maps for eventual connections or just to spot airport amenities.
It’s user-friendly, and accessible to everyone.

## Working Prototype
You can access a working prototype of the node app here: https://fly-smart-api.herokuapp.com/ and react app 

## User Stories
This app is for logged-in user.

#### Landing Page
* As a visitor,
* I want to understand what I can do with this app (or sign up, or log in), 
* So I can decide if I want to use it.

#### Login Page
* As a returning register user
* I want to enter my password and username to use this app,
* So I can have access to my account.

#### Sign Up
* As a visitor
* I want to register to use this app
* So I can create a personal Fly Smart account.

#### Home Page
* As a logged-in user,
* I want to be able to preview the content of the app,
* So i can start looking for guidelines about traveling by plane during the COVID 19 pandemic.

#### Checklist Page
* As a logged-in user,
* I want to be able to match the recommended items with the items I am packing, 
* So that I can organize my trip.

#### My List Page
* As a logged-in user,
* I want to be able to add new entries to my personal to-bring list,
* So that I can create a list according to my personal needs.

### Wireframes
Landing/Login Page
:-------------------------:
![Landing/Login Page](/github-images/wireframes/fly-smart-capstone-client-landingpage.jpg) 
Home Page
![Home Page](/github-images/wireframes/fly-smart-capstone-client-homepage.jpg) 
Forum Page
![Checklist Page](/github-images/wireframes/fly-smart-capstone-client-checklist.jpg) 
My Posts Page
![My List Page](/github-images/wireframes/fly-smart-capstone-client-mylist.jpg) 

### Graybox Wireframes
Full website graybox wireframes
:-------------------------:
![Full website graybox wireframes](/github-images/wireframes/graybox-wireframes.png) 

## Screenshot
Full Page Screenshot 
:-------------------------:
![Landing Page](/github-images/screenshots/homepage.png) MODIFY PLEASE

## Functionality
The app's functionality includes:
* User can create entries 
* User can mark entries as completed

## Business Objects (back-end structure)
* Users (database table)
    * id  
    * email (email validation)
    * password (at least one number, one lowercase and one uppercase letter at least eight characters that are letters, numbers or the underscore)

* Checklist 
    * id 
    * user_id
    * title
    * completed 

* Notes 
    * id 
    * user_id
    * title
    * completed 
  

## Components Structure
* __Index.js__ (stateless)
    * __App.js__ (stateful)
        * __LandingPage.js__ (stateful) - gets the _"prop name"_ and the _"callback prop name"_ from the __App.js__
            * __Login.js__ (stateful) - 
            * __Register.js__ (stateful) - 
        * __HomePage.js__ (stateful)  - 
            * __Navbar.js__ (stateless) - 
        * __Checklist.js__ (stateful) - 
            * __Navbar.js__ (stateless) - 
        * __MyList.js__ (stateful) - 
            * __Navbar.js__ (stateless) - 

## Technology
* Front-End: HTML5, CSS3, JavaScript ES6, React
* Back-End: Node.js, Express.js, Mocha, Chai, RESTful API Endpoints, Postgress
* Development Environment: Heroku

## Responsive
App is built to be usable on mobile devices, as well as responsive across mobile, tablet, laptop, and desktop screen resolutions.

## Development Roadmap
This is v1.0 of the app, but future enhancements are expected to include:
* More pages in order to include more search results 

## How to run it
Use command line to navigate into the project folder and run the following in terminal

### Local Node scripts
* To install the node project ===> npm install
* To migrate the database ===> npm run migrate -- 1
* To run Node server (on port 8000) ===> npm run dev
* To run tests ===> npm run test

### Local React scripts
* To install the react project ===> npm install
* To run react (on port 3000) ===> npm start
* To run tests ===> npm run test
































































 


