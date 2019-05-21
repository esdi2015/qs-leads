import { Component, OnInit, SimpleChanges } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "./services/auth.service";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  public form: FormGroup;
  public sidenavOpened = true;
  public form_search: FormGroup;

  constructor(
    public router: Router,
    public auth: AuthService,
    private fb: FormBuilder,
    private fbls: FormBuilder,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required]
    });
    this.form_search = this.fbls.group({
      search_leads: ["",
        [
          Validators.minLength(2),
          Validators.pattern(new RegExp(/^[^\s].+/i))
        ]
      ]
    });
    this.form_search.setValue({"search_leads": ""});
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
        },
        error => {
          this.snackBar.open(error.error.message, "Dismiss", { duration: 7000 });
        });
    }
  }

  logout() {
    this.auth.logout().subscribe(() => {
      this.router.navigateByUrl("/");
    });
  }

  search_leads(event: any): void {
    const text = this.form_search.value.search_leads;

    if (text === "" && (event && event.type === "submit"))  {
      // this.form_search.setErrors({isEmpty: true});
      this.snackBar.open("Search field can't be empty", "Dismiss", { duration: 5000 });
      return;
    }

    if (this.form_search.valid) {
      if (text && text !== "") {
        this.router.navigate( ["/leads"], { queryParams: { search: text } } );
      } else {
        this.form_search.setValue({"search_leads": ""});
        this.router.navigateByUrl("/leads");
      }
    } else {
      // console.log(this.form_search.errors);
    }
  }
}
