import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ClientsService } from "../../../services/clients.service";
import { MatSnackBar } from "@angular/material";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-create-client",
  templateUrl: "./create-client.component.html",
  styleUrls: ["./create-client.component.scss"]
})
export class CreateClientComponent implements OnInit {
  public form: FormGroup;
  public loading: boolean;
  public working: boolean;

  public isEdit: boolean;
  public clientId: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private clientsService: ClientsService,
    private snackBack: MatSnackBar
  ) {
    this.route.params.subscribe(params => {
      if (params.id) {
        this.loading = true;
        this.isEdit = true;
        this.clientId = params.id;
        this.clientsService.single(params.id).subscribe(data => {
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
      name: ["", Validators.required]
    });
  }

  submit() {
    if (this.form.valid) {
      this.working = true;
      if (this.isEdit) {
        this.clientsService
          .update(this.clientId, { name: this.form.value.name })
          .subscribe((data: any) => {
            this.snackBack.open(data.message, "Dismiss", { duration: 2000 });
            this.router.navigateByUrl("/clients");
          });
      } else {
        this.clientsService
          .create({ name: this.form.value.name })
          .subscribe((data: any) => {
            this.snackBack.open(data.message, "Dismiss", { duration: 2000 });
            this.router.navigateByUrl("/clients");
          });
      }
    }
  }
}
