import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment.prod";

@Injectable({
  providedIn: "root"
})
export class CampaignsService {
  constructor(private http: HttpClient) {}

  public list(sort: string, direction: string, page: number): any {
    return this.http.get(
      `${
        environment.api
      }campaigns?sort=${sort}&direction=${direction}&page=${page}`
    );
  }

  public single(id: string): any {
    return this.http.get(`${environment.api}campaigns/${id}`);
  }

  public create(data: any) {
    return this.http.post(`${environment.api}campaigns`, data);
  }

  public update(id: string, data: any) {
    return this.http.put(`${environment.api}campaigns/${id}`, data);
  }

  public delete(data: any) {
    return this.http.delete(`${environment.api}campaigns/${data}`);
  }

  public import(data) {
    return this.http.post(`${environment.api}campaigns/import`, data);
  }

  public listAll(cid: string) {
    return this.http.get(`${environment.api}campaigns/all/${cid}`);
  }
}
