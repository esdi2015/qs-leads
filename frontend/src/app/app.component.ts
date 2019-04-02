import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "./services/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  public form: FormGroup;
  public sidenavOpened: boolean = true;

  constructor(
    public router: Router,
    public auth: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required]
    });
  }

  toggleSideNav() {
    this.sidenavOpened = !this.sidenavOpened;
  }

  submit() {
    if (this.form.valid) {
      this.auth
        .login(this.form.value.email, this.form.value.password)
        .subscribe(result => {
          this.router.navigateByUrl("/dashboard");
        });
    }
  }

  logout() {
    this.auth.logout().subscribe(() => {
      this.router.navigateByUrl("/");
    });
  }
}
