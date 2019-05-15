import { Component, OnInit } from "@angular/core";
import { Validators, FormBuilder, FormGroup, FormArray } from "@angular/forms";
import { MatSnackBar, MatDialog } from "@angular/material";
import { CampaignsService } from "../../../services/campaigns.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { ClientsService } from "../../../services/clients.service";
import { DialogQuestionComponent } from "../../../shared/dialog-question/dialog-question.component";
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";
// import { url } from "inspector";

@Component({
  selector: "app-create-campaign",
  templateUrl: "./create-campaign.component.html",
  styleUrls: ["./create-campaign.component.scss"],
  animations: [
    trigger("listInOut", [
      // ...
      state(
        "*",
        style({
          opacity: 1,
          transform: "scale(1)",
          height: "*"
        })
      ),
      state(
        "void",
        style({
          opacity: 0.5,
          transform: "scale(0.5)",
          height: 0
        })
      ),
      transition("* => void", [animate("0.1s")]),
      transition("void => *", [animate("0.1s")])
    ])
  ]
})
export class CreateCampaignComponent implements OnInit {
  public form: FormGroup;
  public loading: boolean;
  public working: boolean;
  public clients: string[] = [];
  public clientsFiltered: Observable<string[]>;
  public importFile: File;

  public isEdit: boolean;
  public isClone: boolean;
  public campaignId: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private clientsService: ClientsService,
    private campaignsService: CampaignsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.route.params.subscribe(params => {
      this.route.url.subscribe(sections => {
        const routeUrl = sections.join("/");
        if (routeUrl.indexOf("clone") !== -1) {
          this.isClone = true;
        }
        // console.log(params);
        if (params.id) {
          this.loading = true;
          this.isEdit = true;
          this.campaignId = params.id;
          this.campaignsService.single(params.id).subscribe(data => {
            for (let field in data) {
              if (this.form.get(field)) {
                if (field === "structure") {
                  for (let structureRow of data["structure"]) {
                    (this.form.get("structure") as FormArray).push(
                      this.fb.group({
                        field_csv: [
                          structureRow["field_csv"],
                          Validators.required
                        ],
                        field_api: [
                          structureRow["field_api"],
                          Validators.required
                        ],
                        field_api_value: [
                          structureRow["field_api_value"]
                        ]
                      })
                    );
                  }
                } else {
                  if (this.isClone && field === "name") {
                    this.form.get(field).setValue(data[field] + "[CLONE]");
                  } else {
                    this.form.get(field).setValue(data[field]);
                  }
                }
              }
            }
            this.loading = false;
          });
        }
      });
    });
  }

  ngOnInit() {
    this.clientsService.listAll().subscribe((data: any) => {
      this.clients = data;
    });
    this.form = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(3), Validators.pattern(new RegExp(/^[A-Z0-9]/i))]],
      url: ["", [Validators.required, Validators.minLength(10), Validators.pattern(new RegExp(/^http/i))]],
      delay: [1, Validators.required],
      client: [null, Validators.required],
      status: [null, Validators.required],
      structure: this.fb.array([])
    });
    this.clientsFiltered = this.form.get("client").valueChanges.pipe(
      startWith(""),
      map(value => {
        const filterValue = value.toLowerCase();
        return this.clients.filter((option: any) =>
          option.name.toLowerCase().includes(filterValue)
        );
      })
    );
  }

  addFieldsRow() {
    (this.form.get("structure") as FormArray).push(
      this.fb.group({
        field_csv: ["", Validators.required],
        field_api: ["", Validators.required],
        field_api_value: [""]
      })
    );
  }

  removeFieldsRow(index: number) {
    (this.form.get("structure") as FormArray).removeAt(index);
  }

  onImportFileChanged(event) {
    this.importFile = event.target.files[0];
    if (this.importFile) {
      const formData = new FormData();
      formData.append("file", this.importFile, this.importFile.name);
      this.working = true;
      this.campaignsService.import(formData).subscribe(
        (data: any) => {
          if (data.content) {
            let dialogRef = this.dialog.open(DialogQuestionComponent, {
              data: {
                title: "Import Fields",
                content: `Found ${
                  Object.keys(data.content).length
                } fields, replace current fields with imported ?`
              }
            });
            dialogRef.afterClosed().subscribe(result => {
              if (result === "yes") {
                this.form.removeControl("structure");
                this.form.addControl("structure", this.fb.array([]));

                const fields = data.content;
                // tslint:disable-next-line: forin
                for (let field in fields) {
                  (this.form.get("structure") as FormArray).push(
                    this.fb.group({
                      field_csv: [field, Validators.required],
                      field_api: [field, Validators.required],
                      field_api_value: ""
                      // field_api_value: [fields[field]]
                    })
                  );
                }
              } else {
                // this.form.removeControl("structure");
              }
            });
          } else {
            this.snackBar.open("Invalid file uploaded", "Dismiss", {
              duration: 2000
            });
          }
          this.working = false;
        },
        error => {
          this.snackBar.open("Invalid file uploaded", "Dismiss", {
            duration: 2000
          });
          this.working = false;
        }
      );
    }
  }

  submit() {
    if (this.form.valid) {
      this.working = true;
      if (this.isEdit && !this.isClone) {
        this.campaignsService
          .update(this.campaignId, this.form.value)
          .subscribe((data: any) => {
            this.snackBar.open(data.message, "Dismiss", { duration: 2000 });
            this.router.navigateByUrl("/campaigns");
          });
      } else if (!this.isEdit && !this.isClone) {
        this.campaignsService.create(this.form.value).subscribe((data: any) => {
          this.snackBar.open(data.message, "Dismiss", { duration: 2000 });
          this.router.navigateByUrl("/campaigns");
        });
      } else if (this.isEdit && this.isClone) {
          this.campaignsService.create(this.form.value).subscribe((data: any) => {
            this.snackBar.open(data.message, "Dismiss", { duration: 2000 });
            this.router.navigateByUrl("/campaigns");
          });
      }
    }
  }
}
