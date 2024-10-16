# AccessiTest

## Overview

AccessiTest is a modern web application designed to analyze accessibility issues in web pages. It provides users with a platform to log in, manage their profiles, and utilize various testing tools to enhance web accessibility.

## Technologies Used

- **Next.js**: A React framework for building server-rendered applications and static websites.
- **Firebase**: Utilized Firestore as a NoSQL database to store user information and manage application data.
- **JWT (JSON Web Tokens)**: Implemented for managing user sessions and authentication without using Firebase Authentication. JWT tokens are generated upon successful login and stored in local storage.
- **React**: For building the user interface and managing component states.
- **Tailwind CSS**: For styling and responsive design, ensuring a modern and user-friendly interface.
- **React Toastify**: For displaying toast notifications to enhance user experience during login, registration, and other actions.

## Features

- User registration and login system.
- Profile management, where users can view and update their account details.
- JWT-based session management to maintain user authentication.
- Responsive design for a seamless experience on both desktop and mobile devices.

## Hosting

AccessiTest is hosted on [Vercel](https://vercel.com), providing a fast and reliable deployment platform. The live application can be accessed at:

[https://accessitest-ccc6u9f1m-arun664s-projects.vercel.app](https://accessitest-ccc6u9f1m-arun664s-projects.vercel.app)

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd accessitest
2. Install Node Package
   ```bash
   npm install
3. Run the project in development mode
   ```bash
   npm run dev