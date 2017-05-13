# Video Portal Web App
Fullstack Front End application using mongodb and nodejs for backend, for the client side using backbone, underscore and requirejs and implementing mochajs for unit tests

---

## Usage

- Go to your project folder and run:

		[$] npm install

-  Then, in root folder locate the file config.js and confirm your local environment values with your mongodb instance already running:

		configs.applicationPort = 8080; //default port
		configs.dbName = 'CrossoverVideosAssignment';
		configs.dbHost = 'localhost';

-  In your proyect folder run:

		[$] npm start

This generates a new Localhost:8080 intance, and that's it !


---
## Unit Test URL

- Using this browser webpage and Pointing to test route:

- 		http://localhost:8080/#testing.html#test
