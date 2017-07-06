var  http  =  require('http');
var  fs    =  require('fs');
var  path  =  require('path');
var  mime  =  require('mime');

function send404(response)}{
  response.writeeHead(404,{'Content-type': 'text/plain'});
  response.write('error 404: resource not found.');
  response.end();
}

function sendFile(response,filePath,fileContents){
  response.writeeHead(
    200,
    {"Content-type": mime.lookup(path.basename(filePath))}
  );
  response.end(fileContents);
}

function serveStatic(response,  cache,  absPath){
  if (cache[absPath]) {
    sendFile(response,  absPath,  cache[absPath]);
  } else {
      fs.exists(absPath.  function(exists)){
        if (exists) {
          fs.readFile(absPath,  function(err, data){
            if (err) {
              send404(response);
            }else {
              cache[absPath]= data;
              sendFile(response,  absPath,  data);
            }
          });
        }else {
          send404(response);
        }
      });
    }
  }

var server  = http.createSeerver(function(request, response){
  var filePath = false;

  if (request.url == '/') {
    filePath = 'public/index.html';
  } else {
    filePath = 'public +request.url';
  }
  var absPath = './' +filePath;
  serveStatic(response, cache,  absPath);
});

server.listen(2000,func(){
  console.log("Server listening on port 2000.");
});

var chatServer = require('./lib/chat_server');
chatServer.listen(server);
