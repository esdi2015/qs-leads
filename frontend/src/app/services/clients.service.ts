import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment.prod";

@Injectable({
  providedIn: "root"
})
export class ClientsService {
  constructor(private http: HttpClient) {}

  public list(sort: string, direction: string, page: number) {
    return this.http.get(
      `${
        environment.api
      }clients?sort=${sort}&direction=${direction}&page=${page}`
    );
  }

  public listAll() {
    return this.http.get(`${environment.api}clients/all`);
  }

  public single(id: string) {
    return this.http.get(`${environment.api}clients/${id}`);
  }

  public create(data: { name: string }) {
    return this.http.post(`${environment.api}clients`, data);
  }

  public update(id: string, data: { name: string }) {
    return this.http.put(`${environment.api}clients/${id}`, data);
  }

  public delete(data: any) {
    return this.http.delete(`${environment.api}clients/${data}`);
  }
}
