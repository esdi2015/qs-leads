import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment.prod";

@Injectable({
  providedIn: "root"
})
export class OverviewService {
  constructor(private http: HttpClient) {}

  public overviewChart() {
    return this.http.get(`${environment.api}overview/chart`);
  }
}
