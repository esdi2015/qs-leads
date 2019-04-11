import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatSnackBar } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { LeadsService } from "src/app/services/leads.service";
import { CampaignsService } from "../../../services/campaigns.service";
import { ClientsService } from "../../../services/clients.service";

@Component({
  selector: "app-create-lead",
  templateUrl: "./create-lead.component.html",
  styleUrls: ["./create-lead.component.scss"],
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
export class CreateLeadComponent implements OnInit {
  public form: FormGroup;
  public loading: boolean;
  public working: boolean;
  public clients: string[] = [];
  public campaigns: string[] = [];
  public importFile: File;

  public preview = { headers: [], rows: [] };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private clientsService: ClientsService,
    private campaignsService: CampaignsService,
    private leadsService: LeadsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.clientsService.listAll().subscribe((data: any) => {
      this.clients = data;
    });
    this.form = this.fb.group({
      name: [""],
      client: ["", Validators.required],
      campaign: [{ value: "", disabled: true }, Validators.required]
    });
    this.form.get("client").valueChanges.subscribe(value => {
      this.working = true;
      this.form.controls["campaign"].reset();
      this.campaignsService.listAllActive(value).subscribe((data: any) => {
        this.campaigns = data;
        if (this.campaigns && this.campaigns.length > 0) {
          this.form.controls["campaign"].enable();
        }
        this.working = false;
      });
    });
  }

  onImportFileChanged(event) {
    this.importFile = event.target.files[0];
    if (this.importFile) {
      const formData = new FormData();
      formData.append("client", this.form.value.client);
      formData.append("campaign", this.form.value.campaign);
      formData.append("file", this.importFile, this.importFile.name);
      this.working = true;
      this.leadsService.preview(formData).subscribe(
        (data: any) => {
          if (data.content && data.content.length > 0) {
            this.preview.headers = Object.keys(data.content[0]);
            this.preview.rows = data.content;
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
      const formData = new FormData();
      formData.append("name", this.form.value.name);
      formData.append("client", this.form.value.client);
      formData.append("campaign", this.form.value.campaign);
      formData.append("file", this.importFile, this.importFile.name);

      this.leadsService.create(formData).subscribe((data: any) => {
        this.snackBar.open(data.message, "Dismiss", { duration: 2000 });
        this.router.navigateByUrl("/leads");
      });
    }
  }
}
