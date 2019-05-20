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
  // public showSearchForm = false;

  constructor(
    public router: Router,
    // private route: ActivatedRoute,
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
      search_leads: ["", [Validators.minLength(2), Validators.pattern(new RegExp(/^[^\s]/i))]]
    });
    this.form_search.setValue({"search_leads": ""});
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   for (let propName in changes) {
  //     let chng = changes[propName];
  //     let cur  = JSON.stringify(chng.currentValue);
  //     let prev = JSON.stringify(chng.previousValue);
  //     console.log(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
  //   }
  // }

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

  search_leads(): void {
    if (this.form_search.valid) {
      const text = this.form_search.value.search_leads;
      if (text) {
        this.router.navigate( ["/leads"], { queryParams: { search: text } } );
      } else {
        this.router.navigateByUrl("/leads");
      }
    } else {
      // console.log(this.form_search.valid);
    }
  }
}
