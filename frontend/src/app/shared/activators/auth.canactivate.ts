import { AuthService } from "src/app/services/auth.service";
import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router/src/utils/preactivation";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";

@Injectable()
export class AuthCanActivate implements CanActivate {
  path: ActivatedRouteSnapshot[];
  route: ActivatedRouteSnapshot;
  constructor(private auth: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.auth.exists();
  }
}
