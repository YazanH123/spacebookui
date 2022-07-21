# Spacebook Assignment

This repository contains the code for the **Referral** Mobile Application Development assignment as part of my degree. The nodes_modules folder has been ignored by Git as set out in the .gitignore file.

### Link to the assignment repository (For assignment submission)

---

> link.

---

### Features of the Spacebook App

---

- Account creation, login, and logout capabilities.
- Possibility to examine and change account information.
- Search for other people and send them a request to be your friend.
- Acceptance or rejection of these friend requests
- Capability to browse your own and your friends' posts
- Like or dislike these postings
- Edit your own posts
- Delete your own posts

---

### How to run the Back-end.

1. Clone Spacebook Server from https://github.com/ash-williams/Spacebook
2. Create ENV file in the Spacebook server project containing :

```
DB_HOST=mudfoot.doc.stu.mmu.ac.uk
DB_PORT=6306
DB_USER=alhariry
DB_PASS=Querkwon7

```

---

### How to run the front-end

---

1. Run Spacebook server on localhost port 3333
2. Clone the repository
3. Run npm install to install nodes_modules and the required dependencies
4. npm start when expo loads press 'w' to open the web app

---

---

### API Endpoints

---

All the endpoints set out below have been fully implemented.

User Management:

- POST /user - Add new user

- POST /user/login - Log into an account

- POST /logout - Log out of an account

- GET /user/{user_id} - Get user information

- PATCH /user/{user_id} - Update user information

- GET /user/{user_id}/photo - get a users profile photo

Friend Management:

- GET /user/{user_id}/friends - Get list of friends for a given user

- POST /user/{user_id}/friends - Add a new friend

- GET /friendrequests - Get a list of outstanding friend requests

- POST /friendrequests/{user_id} - Accept friend request

- DELETE /friendrequests/{user_id} - Reject a friend request

- GET /search - Find friends

Post Management:

- GET /user/{user_id}/post - Get a list of posts for a given user

- POST /user/{user_id}/post - Add a new post

- DELETE /user/{user_id}/post/{post_id} - Delete a post

- PATCH /user/{user_id}/post/{post_id} - Update a post

- POST /user/{user_id}/post/{post_id}/like - Like a post

- DELETE /user/{user_id}/post/{post_id}/like - Remove a like from a post

---
