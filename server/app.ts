import http, { IncomingMessage, Server, ServerResponse } from "http";
import companyController from "./controller/AppController";
import path from 'path';
import fs from 'fs';

//console.log( path.resolve('.','./lib/database/database.json')) 
const dbPath = path.resolve('.','./database/database.json');
const server: Server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    if( req.method === "GET"){
      companyController.getCompany(req, res);
    }else if( req.method === "POST"){
      companyController.addCompany(req, res);
    }else if( req.method === "PUT"){
      companyController.updateCompany(req, res);
    }else if( req.method === "DELETE"){
      companyController.deleteCompany(req, res);
    }
    else {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          status: "Bad request",
          message: "Invalid request method.",
        })
      );
    } 
  });
   
const port = 3000;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
