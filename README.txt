## Database structure

**users**

 - id (INT PK)
 - first_name (VARCHAR)
 - last_name (VARCHAR)
 - email (VARCHAR)
 - password (VARCHAR)
 - last_login (DATETIME)
 - date_joined (DATETIME)
 
**posts**

 - id (INT PK)
 - title (VARCHAR)
 - description (TEXT)
 - photo (TEXT)
 - user_id (FK)
 - created_at (DATETIME)
 - updated_at (DATETIME)
 - published (BOOLEAN)
 - published_at (DATETIME)

**tokens**

 - id (INT PK)
 - raw (VARCHAR)
 
 - expired_at (DATETIME)
 - user_id (FK)


## RESTful API Endpoints

 1. **POST** `/login` to authenticate and get a new token
	 - REQUEST BODY: { `email`, `password`}
	 - RESPONSE BODY [200 OK]: { `user_id`, `first_name`, `last_name`, `email`, `token`, `expired_at` }
 2. **DELETE** `/logout` to logout and delete one or all the tokens
	 - AUTHORIZATION: `Bearer {token}`
	 - REQUEST BODY: { `device: all|single|null` }
 3. **POST** `/register` to register and get a new token
	 - REQUEST BODY: { `email`, `password`, `first_name?`, `last_name?` }
	 - RESPONSE BODY [200 OK]: { `user_id`, `first_name`, `last_name`, `email`, `token`, `expired_at` }
	 
 4. **GET** `/users/me` to get details related to authenticated user
	 - AUTHORIZATION: `Bearer {token}`
	 - RESPONSE BODY [200 OK]: { `first_name`, `last_name`, `email`, `date_joined`, `last_login`}

### Post section



 1. **GET** `/posts` to get all public posts
	 - RESPONSE BODY [200 OK]: [ {`id`,  `title`, `description`, `photo`, `created_at`, `update_at`, `published_at` }, ... ]
 2. **GET** `/posts` to get all posts
	 - AUTHORIZATION: `Bearer {token}`
	 - RESPONSE BODY [200 OK]: [{`id`,  `title`, `description`, `photo`, `created_at`, `update_at`, `published`,`published_at` }, ... ]
 3. **POST** `/posts` to create post
	 - AUTHORIZATION: `Bearer {token}`
 	 - REQUEST BODY: { `title`, `description`, `photo`}
	 - RESPONSE BODY [201 CREATED]: { `id`}
 4. **GET** `/posts/{id}` to get a post details
	 - AUTHORIZATION: `Bearer {token}`
	 - RESPONSE BODY [200 OK]: { `id`,  `title`, `description`, `photo`, `created_at`, `update_at`, `publihsed`, `published_at` }
 5. **PUT** `/posts/{id}` to edit a post
	 - AUTHORIZATION: `Bearer {token}`
 	 - REQUEST BODY: { `title`, `description`, `photo`}
	 - RESPONSE BODY [200 OK]: { `id`,  `title`, `description`, `photo`, `date_created` }
	 
 6. **DELETE** `/posts/{id}` to delete a post
	 - AUTHORIZATION: `Bearer {token}`
	 - RESPONSE BODY [204 NO_CONTENT]:
 7. **PUT** `/posts/{id}/status` to edit a post
	 - AUTHORIZATION: `Bearer {token}`
 	 - REQUEST BODY: { `published`: true|false }
	 - RESPONSE BODY [200 OK]: { `id`,  `published` }


Can be improved by adding
 1. Tags for each post
 2. User can like or comment on posts

