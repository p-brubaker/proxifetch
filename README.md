# proxifetch

A simple proxy server to get around annoying cors issues encountered while making api requests from the browser while working on student projects.
To set up your own, fork this repo and deploy it to heroku, 
then make a post request to your Heroku app's url and provide the following object as the body.

params, body, and auth token are optional

If you would rather just use my active proxy server than go through the steps of setting one up,
ask me for the url.

```js
{ 
  url: <the url you want to make your request to>
  method: <http method>, 
  params: <object containing key value pairs>, 
  body: <valid JSON>, 
  token: <auth token> 
}
```
