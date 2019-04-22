import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment.prod";

@Injectable({
  providedIn: "root"
})
export class LeadsService {
  constructor(private http: HttpClient) {}

  public list(sort: string, direction: string, page: number, search_text: string = "") {
    if (search_text === "") {
      return this.http.get(
        `${environment.api}leads?sort=${sort}&direction=${direction}&page=${page}`
      );
    } else {
      return this.http.get(
        `${environment.api}leads?sort=${sort}&direction=${direction}&page=${page}&search=${search_text}`
      );
    }
    // return this.http.get(
    //   `${environment.api}leads?sort=${sort}&direction=${direction}&page=${page}`
    // );
  }

  public searchLeads(sort: string, direction: string, page: number, search_text: string) {
    // if (!search_text) {
    //   return false;
    // } else {
    //   return this.http.get(
    //     `${environment.api}leads?sort=${sort}&direction=${direction}&page=${page}&search=${search_text}`
    //   );
    // }
    return this.http.get(
      `${environment.api}leads?sort=${sort}&direction=${direction}&page=${page}&search=${search_text}`
    );
  }

  public listAll() {
    return this.http.get(`${environment.api}leads/all`);
  }

  public single(id: string) {
    return this.http.get(`${environment.api}leads/${id}`);
  }

  public create(data) {
    return this.http.post(`${environment.api}leads`, data);
  }

  public update(id: string, data: { name: string }) {
    return this.http.put(`${environment.api}leads/${id}`, data);
  }

  public delete(data: any) {
    return this.http.delete(`${environment.api}leads/${data}`);
  }

  // public preview(data: string | FormData) {
  //   if ( data === "null" ) {
  //     console.log("null==");
  //     return null;
  //   } else {
  //     return this.http.post(`${environment.api}leads/preview`, data);
  //   }
  // }

  public preview(data) {
    // console.log(this.http.head(`${environment.api}leads/preview`));
    const headers = {headers: new HttpHeaders({
      // "Cache-Control":  "no-cache, no-store, must-revalidate, post-check=0, pre-check=0",
      // "Pragma": "no-cache",
      // "Expires": "0",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      // "Access-Control-Allow-Headers": "*"
    })};
    // , {headers}
    const timestamp = new Date();
    console.log(timestamp.getTime());
    const result = this.http.post(`${environment.api}leads/preview`, data); // , headers
    console.log(result);
    // const httpOptions = { headers: { ["Cache-Control"]: "no-cache, no-store, must-revalidate, post-check=0, pre-check=0"} }
    return result; //, headers
  }

}
