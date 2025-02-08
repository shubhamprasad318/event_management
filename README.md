`# Event Management Platform`

`A full-stack event management platform where users can create, manage, and view events. The platform supports user authentication, event creation and management, real-time attendee updates, location features, and more.`

`---`

`## Table of Contents`

`- [Features](#features)`  
`- [Tech Stack](#tech-stack)`  
`- [Installation](#installation)`  
  `- [Backend Setup](#backend-setup)`  
  `- [Frontend Setup](#frontend-setup)`  
`- [Configuration](#configuration)`  
`- [Usage](#usage)`  
`- [API Endpoints](#api-endpoints)`  
`- [Deployment](#deployment)`  
`- [Test Credentials](#test-credentials)`  
`- [License](#license)`  
`- [Additional Notes](#additional-notes)`

`---`

`## Features`

`- **User Authentication**`  
  `- Register and log in using JWT-based authentication`  
    
`- **Event Dashboard**`  
  `- View a list of upcoming and past events.`  
  `- Filter events by search query.`  
    
`- **Event Management**`  
  `- Create, update, and delete events (only by the event creator).`  
  `- Each event includes a name, description, date/time, location, and real-time attendee count.`  
    
`- **Real-Time Updates**`  
  `- Socket.IO integration for live updates (e.g., when attendees are added).`  
    
`- **Responsive Design**`  
  `- Built with Tailwind CSS to ensure a professional look on desktops, tablets, and mobile devices.`

`---`

`## Tech Stack`

`- **Frontend:**`    
  `- Next.js (React)`    
  `- Tailwind CSS`    
  `- Vercel or Netlify for deployment`  
    
`- **Backend:**`    
  `- Node.js`    
  `- Express.js`    
  `- Socket.IO`    
  `- JWT`    
  `- Mongoose`  
    
`- **Database:**`    
  `- MongoDB Atlas (Free Tier)`  

`---`

`## Installation`

`### Backend Setup`

`1. **Clone the Repository & Navigate to the Backend Folder:**`

 `git clone https://github.com/shubhamprasad318/event-management.git`  
   `cd event-management/event-management-backend`

**Install Dependencies:**  
`npm install`

2. 

**Create a `.env` File:**  
In the backend folder, create a file named `.env` and add:  
env

`MONGO_URI=your_mongodb_connection_string`  
`JWT_SECRET=your_jwt_secret_key`  
`PORT=5000`

3. 

**Start the Backend Server:**

`node server.js`

4. **Note:** You may see warnings about `useNewUrlParser` and `useUnifiedTopology`; these are safe to ignore.

### **Frontend Setup**

**Navigate to the Frontend Folder or Root Directory (if using Next.js):**

`cd ../event-management-frontend`

1. **Install Dependencies:**  
   `npm install`  
2. **Start the Development Server:**  
   `npm run dev`  
3. The frontend should now be running on `http://localhost:3000`.

---

## **Configuration**

* **Environment Variables (Backend):**  
  Ensure you set your MongoDB connection string and JWT secret in the `.env` file.  
* **API URL (Frontend):**  
  The frontend is configured to use `http://localhost:5000` by default. Update this as necessary for production.

---

## **Usage**

1. **User Authentication:**  
   * Register a new account or log in with existing credentials.  
   * (*Optional*) Use a guest login for limited features if implemented.  
2. **Event Dashboard:**  
   * View all events on the dashboard.  
   * Filter events using the search bar, upcoming/past buttons, and location filters.  
   * Click "Home" to return to the default event list.  
3. **Event Management:**  
   * Create new events by filling out the event form (includes fields for name, description, date/time, and location).  
   * Edit or delete events you created.  
   * Simulate attendee updates in real time using the "+1 Attendee" button.  
   * Join event rooms to receive real-time updates.

---

## **API Endpoints**

### **Authentication**

* **POST** `/api/auth/register`  
  Register a new user.  
* **POST** `/api/auth/login`  
  Log in an existing user and return a JWT token.

### **Events**

* **POST** `/api/events`  
  Create a new event. *(Requires authentication)*  
* **GET** `/api/events`  
  Retrieve all events.  
* **GET** `/api/events/upcoming`  
  Retrieve events scheduled for the future.  
* **GET** `/api/events/past`  
  Retrieve events that have already occurred.  
* **GET** `/api/events/search?query=...`  
  Search events by name, description, and location.  
* **PUT** `/api/events/:id`  
  Update an event (only accessible by the creator).  
* **DELETE** `/api/events/:id`  
  Delete an event (only accessible by the creator).

### **Real-Time Updates**

* **Socket.IO:**  
  Clients emit `attendeeUpdate` to increment an event’s attendee count. The server broadcasts the updated event via the `attendeeUpdated` event.

---

## **Deployment**

* **Frontend:**  
  Deploy the Next.js application on Vercel or Netlify.  
* **Backend:**  
  Deploy the Node.js/Express API on Render or Railway.app.  
* **Database:**  
  Use MongoDB Atlas for a free database solution.  
* **Image Hosting (Optional):**  
  Use Cloudinary Free Tier for image uploads and hosting.

---

## **Additional Notes**

* **Modular Design:**  
  The codebase is organized with separate folders for the frontend and backend. Each component (authentication, event management, real-time updates, etc.) is modular for easy maintenance and scalability.  
* **Future Enhancements:**  
  Additional features such as advanced location filtering (with maps integration), image uploads, and guest login functionality can be added with minimal changes.  
* **Free Hosting & Tools:**  
  This project leverages free-tier hosting services (Vercel, Render, MongoDB Atlas) and open-source libraries, making it an affordable solution for event management.#   e v e n t _ m a n a g e m e n t  
 #   e v e n t _ m a n a g e m e n t  
 