# visiri API server
- This server is based on the REST standards and provides backend functionality to the visiri client
- Technologies used are node.js, express.js, and postgresql
## Summary
- This server handles user registration, login, and password encryption and token based authentication
- Data related to user created experiments such as cell type, experiment parameters, and labeled cell regions are handled by the server and stored as database models
- Images uploaded by users are stored on AWS servers with urls and metadata stored in the database itself
- Labeled image data can be used to generate training datasets for automated cell counting via convolutional neural networks

## Endpoints

#### Authorized requests to the API should use an Authorization header with the value Bearer `TOKEN`, where `TOKEN` is an access token obtained through the authentication flow.
  
### Experiments  
`/api/experiments/:experimentId`  
- methods: `GET, POST`  
- parameters: `[experimentId]`  
- example:  
> {  
>  celltype: 2,  
>  experiment_type: 'Calibration',  
> }  

- description: Data related to an experiment that includes cell type, experiment type, date created, region data, and images  
  
`/api/experiments/:experimentId/regions`  
- methods: `GET, POST`  
- parameters: `[experimentId]`  
- example:  
> {  
>  experiment_id: 1,  
>  regions: 
> {\[
>   color: '#ffffff',  
>   point: {x: 123, y: 123},    
> \]}  
>                 
- description: Label data of cell regions with size, color coding, and coordinates for a single experiment  
  
`/api/experiments/:experimentId/images`  
- methods: `GET, POST`  
- parameters: `[experimentId]`  
- description: Image files and metadata related to an experiment  
  
### Images  
`/api/images/:image`  
- methods: `GET`  
- parameters: `[image]` path to image file.  
  
