import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatSnackBar } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { UsersService } from "../../../services/users.service";

@Component({
  selector: "app-create-user",
  templateUrl: "./create-user.component.html",
  styleUrls: ["./create-user.component.scss"]
})
export class CreateUserComponent implements OnInit {
  public form: FormGroup;
  public loading: boolean;
  public working: boolean;

  public isEdit: boolean;
  public userId: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private usersService: UsersService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.route.params.subscribe(params => {
      if (params.id) {
        this.loading = true;
        this.isEdit = true;
        this.userId = params.id;
        this.usersService.single(params.id).subscribe(data => {
          for (let field in data) {
            if (this.form.get(field)) {
              this.form.get(field).setValue(data[field]);
            }
          }
          this.loading = false;
        });
      }
    });
  }

  ngOnInit() {
    this.form = this.fb.group({
      firstName: ["", [Validators.required, Validators.minLength(3), Validators.pattern(new RegExp(/^[A-Z0-9]/i))]],
      lastName: ["", [Validators.required, Validators.minLength(3), Validators.pattern(new RegExp(/^[A-Z0-9]/i))]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6), Validators.pattern(new RegExp(/^[A-Z0-9#%&_]*$/i))]],
      role: ["User", Validators.required]
    });
  }

  submit() {
    if (this.form.valid) {
      this.working = true;
      if (this.isEdit) {
        this.usersService
          .update(this.userId, this.form.value)
          .subscribe((data: any) => {
            this.snackBar.open(data.message, "Dismiss", { duration: 2000 });
            this.router.navigateByUrl("/users");
          });
      } else {
        this.usersService.create(this.form.value).subscribe((data: any) => {
          this.snackBar.open(data.message, "Dismiss", { duration: 2000 });
          this.router.navigateByUrl("/users");
        });
      }
    }
  }
}
