import { Component, OnInit, ViewChild } from '@angular/core';
import { TableComponent } from "src/app/shared/table/table.component";
import { Router } from "@angular/router";
import { MatDialog, MatSnackBar } from "@angular/material";
import { LeadsService } from "src/app/services/leads.service";
import { DialogQuestionComponent } from "src/app/shared/dialog-question/dialog-question.component";
import { environment } from "src/environments/environment";

import * as moment from "moment";
import * as _ from "lodash";
import { HtmlTagDefinition } from "@angular/compiler";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  @ViewChild("appTable")
  appTable: TableComponent;

  public api: any;
  public columns: any[];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private historyService: LeadsService,
    private snackBar: MatSnackBar
  ) {
    this.api = {
      serviceName: "historyService",
      serviceCall: "list"
    };
    this.columns = [
      {
        key: "user",
        header: "User",
        sort: true,
        search: true,
        cell: (row: any) => { if (row.user) {return `${row.user.firstName} ${row.user.lastName}`} else return "None" }
      },
      // {
      //   key: "name",
      //   header: "Name",
      //   sort: true,
      //   cell: (row: any) => `<b>${row.name}</b>`
      // },
      {
        key: "client",
        header: "Client",
        cell: (row: any) => { if (row.client != null) { return `${row.client.name}` } else return "None" }
      },
      {
        key: "campaign",
        header: "Campaign",
        search: true,
        cell: (row: any) => { if (row.campaign != null) { return `${row.campaign.name}` } else return "None" }
      },
      {
        key: "filename",
        header: "Filename",
        cell: (row: any) => `${row.filename}`
      },
      // {
      //   key: "status",
      //   header: "Status",
      //   cell: (row: any) => `${row.status}`,
      //   progress: (row: any) => {
      //     const parsed = row.status.replace("Processing ", "").split("/");
      //     const current = parseInt(parsed[0], 10);
      //     const total = parseInt(parsed[1], 10);
      //     return (current / total) * 100;
      //   },
      //   conditions: {
      //     progress: (row: any) => row.status.startsWith("Processing")
      //   }
      // },
      {
        key: "createdAt",
        header: "Uploaded",
        sort: true,
        cell: (row: any) =>
          `${moment(row.createdAt).format("YYYY-MM-DD H:mm:ss")}`
      },
      // {
      //   key: "updatedAt",
      //   header: "Modified",
      //   sort: true,
      //   cell: (row: any) =>
      //     `${moment(row.updatedAt).format("YYYY-MM-DD H:mm:ss")}`
      // },
      // {
      //   key: "actions",
      //   actions: {
      //     result: (row: any) => {
      //       this.router.navigateByUrl(`/leads/results/${row.id}`);
      //     },
      //     download: (row: any) => {
      //       window.location.href = `${environment.api}leads/download/${
      //         row.id
      //       }`;
      //     }
      //   },
      //   conditions: {
      //     result: (row: any) => row.status === "Finished",
      //     download: (row: any) => row.status === "Finished"
      //   }
      // }
    ];
  }

  ngOnInit() {
  }

  truncate(str, length, ending?) {
    if (length == null) {
      length = 100;
    }
    if (ending == null) {
      ending = "...";
    }
    if (str.length > length) {
      return str.substring(0, length - ending.length) + ending;
    } else {
      return str;
    }
  }

}
