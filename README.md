# visiri API server
- This server is based on the REST standards and provides backend functionality to the visiri client
- Technologies used:  
  Node.js, Express.js
  Postgres  
  Heroku  
  
## Summary
- This server handles user registration, login, and password encryption and token based authentication
- Data related to user created experiments such as cell type, experiment parameters, and labeled cell regions are handled by the server and stored as database models
- Images uploaded by users are stored on AWS servers with urls and metadata stored in the database itself
- Labeled image data can be used to generate training datasets for automated cell counting via convolutional neural networks

## Endpoints

#### Authorized requests to the API should use an Authorization header with the value Bearer `TOKEN`, where `TOKEN` is an access token obtained through the authentication flow.
  
### Experiments  
`/api/experiments/:experimentId`  
- Methods: `GET, POST`  
- Parameters: `[experimentId]`  
- Authorization: `Bearer [token]`  
- Headers: `application/json`  
- Example:  
```
{  
celltype: 2,  
experiment_type: 'Calibration',  
}  
```

- Description: Data related to an experiment that includes cell type, experiment type, date created, region data, and images  
  
`/api/experiments/:experimentId/regions`  
- Methods: `GET, POST`  
- Parameters: `[experimentId]`  
- Authorization: `Bearer [token]`  
- Headers: `application/json`  
- Example:  
```
    {  
      experiment_id: 1,  
      regions: [  
        {  
          color: '#ffffff',  
          point: {x: 123, y: 123},  
          size: 56  
        },  
        {  
          color: 'red',  
          point: {x: 321, y: 234},  
          size: 34  
        }  
      ]  
    }
```
- Description: Label data of cell regions with size, color coding, and coordinates for a single experiment  
  
`/api/experiments/:experimentId/images`  
- Methods: `GET, POST`  
- Parameters: `[experimentId]`  
- Authorization: `Bearer [token]`  
- Headers: `multipart/form-data`
- Example:  
```
{
  experiment_id: 1,
  image: [imagefile],
  width: 123,
  height: 123
}
```
- Description: Image files and metadata related to an experiment  
  
### Images  
`/api/images/:image`  
- Methods: `GET`  
- Parameters: `[image]` path to image file.  
- Example:  
```
https://visiri.now.sh/image-37682617835.jpeg
```
- Description: Encoded semi-private shareable image url of experiment images
  
