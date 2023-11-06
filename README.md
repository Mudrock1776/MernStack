This is my test code for the mern stack

Please Note that if you wanted to run this on your local machine you will need to run the commmands:
npm install
npm run build
npm start

You will also need to update the MONGOURL in the config.env file to a valid connection string, I left it empty because it would have credentials that people aim to hack

/server:
This file contains the server, its routes, and the database connection

/models:
This file contains the information about the types of collections one for users and another for contacts, please look into mongoose schemas

/controllers:
this contains the backend code such as the CRUD operations

/client:
this folder pertains to the React app, all the important files are in the src folder
