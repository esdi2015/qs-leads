import { Component, OnInit, ViewChild } from "@angular/core";
import { TableComponent } from "src/app/shared/table/table.component";
import { Router } from "@angular/router";
import { MatDialog, MatSnackBar } from "@angular/material";
import { CampaignsService } from "src/app/services/campaigns.service";
import { DialogQuestionComponent } from "src/app/shared/dialog-question/dialog-question.component";

import * as moment from "moment";
import * as _ from "lodash";
import { HtmlTagDefinition } from "@angular/compiler";


@Component({
  selector: "app-campaigns",
  templateUrl: "./campaigns.component.html",
  styleUrls: ["./campaigns.component.scss"]
})

export class CampaignsComponent implements OnInit {
  @ViewChild("appTable")
  appTable: TableComponent;

  public api: any;
  public columns: any[];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private campaignsService: CampaignsService,
    private snackBar: MatSnackBar
  ) {
    this.api = {
      serviceName: "campaignsService",
      serviceCall: "list"
    };
    this.columns = [
      {
        key: "name",
        header: "Name",
        sort: true,
        cell: (row: any) => `<b>${row.name}</b>`
      },
      {
        key: "url",
        header: "URL",
        sort: true,
        cell: (row: any) => `<b>${row.url}</b>`
      },
      {
        key: "client",
        header: "Client",
        sort: false,
        cell: (row: any) => `${_.get(row, "client.name")}`
      },
      {
        key: "createdAt",
        header: "Created",
        sort: true,
        cell: (row: any) =>
          `${moment(row.createdAt).format("YYYY-MM-DD H:mm:ss")}`
      },
      {
        key: "updatedAt",
        header: "Modified",
        sort: true,
        cell: (row: any) =>
          `${moment(row.updatedAt).format("YYYY-MM-DD H:mm:ss")}`
      },
      {
        key: "status",
        header: "Status",
        sort: false,
        cell: (row: any) => `${row.status}`
      },
      {
        key: "actions",
        sort: false,
        actions: {
          clone: (row: any) => {
            this.router.navigateByUrl(`/campaigns/clone/${row.id}`);
          },
          edit: (row: any) => {
            this.router.navigateByUrl(`/campaigns/edit/${row.id}`);
          },
          delete: (row: any) => {
            let dialogRef = this.dialog.open(DialogQuestionComponent, {
              data: {
                title: `Delete Campaign`,
                content: `Are you sure you want to delete <b>${
                  row.name
                }</b> campaign ?`
              }
            });
            dialogRef.afterClosed().subscribe(result => {
              if (result === "yes") {
                this.campaignsService.delete(row.id).subscribe((data: any) => {
                  this.snackBar.open(data.message, "Dismiss", {
                    duration: 2000
                  });
                  this.appTable.refresh();
                });
              }
            });
          }
        }
      }
    ];
  }

  ngOnInit() {}
}
