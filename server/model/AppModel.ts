// import companiesFromDatabase from "../database/database.json";
import { writeFileSync } from "fs";
import { Organization } from "../interfaces/interface";
import path from 'path';
import fs from "fs"

const dbPath = path.resolve('.','./database/database.json');

// function processObj(obj: any) {
//   const propertiesToHide = ["id", "createdAt", "updatedAt"];
//   return Object.fromEntries(
//     Object.entries(obj).filter((arr) => !propertiesToHide.includes(arr[0]))
//   );
// }

function makeSureDatabaseExist() { 
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify([]));
  }
}


function getDatabase() {
  makeSureDatabaseExist();
 let dbContent =  eval(fs.readFileSync(dbPath).toString())
 return dbContent as Array<Organization>;
}


function findCompanyById(id: number) {
  return new Promise((resolve, reject) => {
    const companiesFromDatabase = getDatabase()
    let company = companiesFromDatabase.find((company) => company.id == id) || {}
    if (Object.keys(company).length > 0) {
      resolve(company);
    } else {
      resolve(false);
    }
  });
}

function findAllCompanies() {
  return new Promise((resolve, reject) => {
    const companiesFromDatabase = getDatabase()
    resolve(companiesFromDatabase);
  });
}

function addCompany(obj: any): boolean {
  if (obj) {
    const companiesFromDatabase = getDatabase()
    const id = companiesFromDatabase.length + 1;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const noOfEmployees = obj.employees.length;
    companiesFromDatabase.push({
      ...obj,
      id,
      createdAt,
      updatedAt,
      noOfEmployees
    });
    writeFileSync(dbPath, JSON.stringify(companiesFromDatabase, null, " "));
    return true;
  } else {
    return false;
  }
}

function updateCompany(obj: Organization, id: number): boolean {
  //get index for company
  const companiesFromDatabase = getDatabase()
  const index = companiesFromDatabase.findIndex((company) => company.id === Number(id));
  //get object with the passed id
  const companyObj = companiesFromDatabase[index];
  const noOfEmployees = companyObj.employees.length;
  if (companyObj) {
    //object exist in db
    const updatedAt = new Date().toISOString();
    const updatedObj = {
      ...companyObj,
      ...obj,
      updatedAt,
      noOfEmployees
    };
    companiesFromDatabase.splice(index, 1, updatedObj);
    writeFileSync(dbPath, JSON.stringify(companiesFromDatabase, null, " "));
    return true;
  } else {
    return false;
  }
}

function deleteCompany(id: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const companiesFromDatabase = getDatabase()
    //if company not in database return false
    let indexOfCompany = companiesFromDatabase.findIndex((company) => company.id === id);
    if (indexOfCompany > -1) {
      //delete the company
      companiesFromDatabase.splice(indexOfCompany, 1);
      writeFileSync(dbPath, JSON.stringify(companiesFromDatabase, null, " "));
      resolve(true);
      return;
    } else {
      resolve(false);
    }
  });
}

function deleteAllCompany(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    //if company not in database return false
    try {
      const companiesFromDatabase = getDatabase()
      companiesFromDatabase.length = 0;
      resolve(true);
      writeFileSync(dbPath, JSON.stringify(companiesFromDatabase));
    } catch {
      resolve(false);
    }
  });
}

export = {
  findCompanyById,
  findAllCompanies,
  addCompany,
  updateCompany,
  deleteCompany,
  deleteAllCompany,
};
