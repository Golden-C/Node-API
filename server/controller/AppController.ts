import companyModel from "../model/AppModel";
import { IncomingMessage, ServerResponse } from "http";
import url from "url";


async function getAllCompanies(req: IncomingMessage, res: ServerResponse) {
    const companies = await companyModel.findAllCompanies();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(
      {
        status: 'success',
        datas: companies
      }, null, " "));
}

async function getCompany(req: IncomingMessage, res: ServerResponse) {
  let urlObj = new url.URL(req.url as string, `http://${req.headers.host}`);
  //get id if any from search parameters
  let id = urlObj.searchParams.get("id");
  if (id) {
    const company = await companyModel.findCompanyById(Number(id));
    if (company) {
      res.end(JSON.stringify({
        status: 'success',
        datas: company
      }
        , null, " "));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          status: "error!",
          msg: "Company doesn't exist.",
        })
      );
    }
  } else {
    getAllCompanies(req, res);
  }
}

async function addCompany(req: IncomingMessage, res: ServerResponse) {
  //get content of post
  let postData = "";
  req.on("data", (chunk) => {
    postData += chunk;
  });
  req.on("end", () => {
    try {
      let uploadedObject = JSON.parse(postData);
      const response = companyModel.addCompany(uploadedObject);
      if (response) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify(
            {
              status: "success",
              msg: "Company successfully added.",
            }, null, " ")
        );
      } else {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            status: "error",
            msg: "company not added, please try again.",
          }, null, " ")
        );
      }
    } catch(err) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          status: "error",
          msg: "malformed object, please check what you are sending.",
        })
      );
    }
  });
}

async function updateCompany(req: IncomingMessage, res: ServerResponse) {
  let urlObj = new url.URL(req.url as string, `http://${req.headers.host}`);
  //get id if any from search parameters
  let id = urlObj.searchParams.get("id");
  //get data from req
  let postData = "";
  req.on("data", (chunk) => {
    postData += chunk;
  });
  req.on("end", () => {
    try {
      let uploadedObject = JSON.parse(postData);
      let updated = companyModel.updateCompany(uploadedObject, Number(id));
      if (updated) {
        res.end(
          JSON.stringify(
            {
              status: "success",
              msg: "Company updated successfully to the database",
            },
            null,
            " "
          )
        );
      } else {
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            status: "error",
            msg: "Unable to update, please check what you are trying to update.",
          }, null, " ")
        );
      }
    } catch {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          status: "error",
          msg: "malformed object, please check what you are sending.",
        }, null, " ")
      );
    }
  });
}

async function deleteCompany(req: IncomingMessage, res: ServerResponse) {
  let urlObj = new url.URL(req.url as string, `http://${req.headers.host}`);
  //get id if any from search parameters
  let id = urlObj.searchParams.get("id") || -1;
  let deleted;
  if (id > -1) {
    deleted = await companyModel.deleteCompany(Number(id));
  } else {
    deleted = await companyModel.deleteAllCompany();
  }
  if (deleted) {
    res.end(
      JSON.stringify(
        {
          status: "success",
          msg: "Company deleted successfully from the database",
        }, null, " "
      )
    );
  } else {
    res.writeHead(403, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "error",
        msg: "Unable to delete object.",
      }, null, " ")
    );
  }
}

export = {
  getCompany,
  addCompany,
  updateCompany,
  deleteCompany,
};
