import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { environment } from "../../environments/environment.prod";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(private http: HttpClient) {}

  public login(email: string, password: string) {
    console.log("angular log in");
    return this.http
      .post(`${environment.api}auth/login`, { email, password })
      .pipe(
        map((result: any) => {
          this.set(result.content);
          return result;
        })
      );
  }

  public logout() {
    return this.http.post(`${environment.api}auth/logout`, {}).pipe(
      map(result => {
        this.remove();
        return result;
      })
    );
  }

  private set(user) {
    localStorage.setItem("leadspeed_user", JSON.stringify(user));
  }

  private remove() {
    localStorage.removeItem("leadspeed_user");
  }

  public exists(): boolean {
    return !!localStorage.getItem("leadspeed_user");
  }

  public get current(): any {
    return JSON.parse(localStorage.getItem("leadspeed_user"));
  }
}
