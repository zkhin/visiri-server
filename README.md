# visiri API server
- This server is based on the REST standards and provides backend functionality to the visiri client
- Technologies used are node.js, express.js, and postgresql
## Summary
- This server handles user registration, login, and authentication with password encryption and token based authentication
- Data related to user created experiments such as cell type, experiment parameters, and labeled cell regions are handled by the server and stored as database models
- Images uploaded by users are stored on AWS servers with urls and metadata stored in the database itself
- Labeled image data can be used to generate training datasets for automated cell counting via convolutional neural networks

## Endpoints
### `/api/experiments/:experimentId`
- GET, POST

### `/api/experiments/:experimentId/regions`
- GET, POST

### `/api/experiments/:experimentId/images`
- POST

### `/api/images/:image`
- GET
