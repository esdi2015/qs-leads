import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment.prod";

@Injectable({
  providedIn: "root"
})
export class LeadsService {
  constructor(private http: HttpClient) {}

  public list(sort: string, direction: string, page: number) {
    return this.http.get(
      `${environment.api}leads?sort=${sort}&direction=${direction}&page=${page}`
    );
  }

  public searchLeads(sort: string, direction: string, page: number, search_text: string) {
    console.log("searchLeads");
    if (!search_text) {
      search_text = "234026";
    }
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

  public preview(data) {
    return this.http.post(`${environment.api}leads/preview`, data);
  }
}
