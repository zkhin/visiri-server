# visiri API server
- This server is based on the REST standards and provides backend functionality to the visiri client
- Technologies used are node.js, express.js, and postgresql
## Summary
1. This server handles user registration, login, and authentication with password encryption and token based authentication
2. Data related to user created experiments such as cell type, experiment parameters, and labeled cell regions are handled by the server and stored as database models
3. Images uploaded by users are stored on AWS servers with urls and metadata stored in the database itself
4. Labeled image data can be used to generate training datasets for automated cell counting via convolutional neural networks

## Endpoints
