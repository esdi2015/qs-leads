import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import * as _ from "lodash";
import * as moment from "moment";
import { ClientsService } from "src/app/services/clients.service";
import { DialogQuestionComponent } from "src/app/shared/dialog-question/dialog-question.component";
import { TableComponent } from "src/app/shared/table/table.component";

@Component({
  selector: "app-clients",
  templateUrl: "./clients.component.html",
  styleUrls: ["./clients.component.scss"]
})
export class ClientsComponent implements OnInit {
  @ViewChild("appTable")
  appTable: TableComponent;

  public api: any;
  public columns: any[];

  constructor(
    private dialog: MatDialog,
    private clientsService: ClientsService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.api = {
      serviceName: "clientsService",
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
        key: "campaigns",
        header: "Campaigns Count",
        cell: (row: any) => `${_.size(row.campaigns)}`
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
        key: "actions",
        actions: {
          edit: (row: any) => {
            this.router.navigateByUrl(`/clients/edit/${row.id}`);
          },
          delete: (row: any) => {
            let dialogRef = this.dialog.open(DialogQuestionComponent, {
              data: {
                title: `Delete Client`,
                content: `Are you sure you want to delete <b>${
                  row.name
                }</b> client ?`
              }
            });
            dialogRef.afterClosed().subscribe(result => {
              if (result === "yes") {
                this.clientsService.delete(row.id).subscribe((data: any) => {
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
