# Role-Based Newsroom CMS

This is a full-stack project built with Node.js and Express for the backend, MongoDB for the database, and React for the frontend.

To run the project locally, first clone the repository using `git clone https://github.com/syedowaisahmed123/Role-Based-Newsroom-CMS.git` and navigate into the project folder with `cd Role-Based-Newsroom-CMS`. 

For the backend, go into the `server` directory using `cd server` and install the dependencies with `npm install`. Copy the `.env.example` file to `.env` and fill in your environment variables such as `PORT`, `MONGO_URI`, `JWT_SECRET`, and email credentials. Start the server using `npm run dev`; by default, it will run on `http://localhost:5000`.

For the frontend, navigate to the `client` folder using `cd ../client` and install its dependencies with `npm install`. Copy `.env.example` to `.env` and update the environment variables like `VITE_API_URL`. Run the frontend with `npm run dev`; it will typically run on `http://localhost:5173`.

To create an admin user, first register a new user through the app. Then, go to your MongoDB database (Atlas or local), find the `users` collection, and manually change the `role` of your registered user to `"Admin"`. After this, the user will have full admin access in the application.

Please note that `node_modules` folders and `.env` files are not included in the repository. Ensure that MongoDB is running and all required environment variables are properly set before starting the app.
