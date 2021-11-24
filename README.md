# proxifetch

A simple proxy server to get around annoying cors issues encountered during student projects
To set up your own, fork this repo and deploy it to heroku, 
then make a post request to your Heroku app's url and provide the following object as the body.

params, body, and auth token are optional

```js
{ 
  method: <http method>, 
  params: <object containing key value pairs>, 
  body: <valid JSON>, 
  token: <auth token> 
}
```
