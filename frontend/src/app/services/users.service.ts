import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment.prod";

@Injectable({
  providedIn: "root"
})
export class UsersService {
  constructor(private http: HttpClient) {}

  public list(sort: string, direction: string, page: number) {
    return this.http.get(
      `${
        environment.api
      }users?sort=${sort}&direction=${direction}&page=${page}`
    );
  }

  public listAll() {
    return this.http.get(`${environment.api}users/all`);
  }

  public single(id: string) {
    return this.http.get(`${environment.api}users/${id}`);
  }

  public create(data: { name: string }) {
    return this.http.post(`${environment.api}users`, data);
  }

  public update(id: string, data: { name: string }) {
    return this.http.put(`${environment.api}users/${id}`, data);
  }

  public delete(data: any) {
    return this.http.delete(`${environment.api}users/${data}`);
  }
}
