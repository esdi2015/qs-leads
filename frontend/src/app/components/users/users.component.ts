import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import * as moment from "moment";
import { UsersService } from "src/app/services/users.service";
import { TableComponent } from "src/app/shared/table/table.component";
import { DialogQuestionComponent } from "src/app/shared/dialog-question/dialog-question.component";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"]
})
export class UsersComponent implements OnInit {
  @ViewChild("appTable")
  appTable: TableComponent;

  public api: any;
  public columns: any[];

  constructor(
    private dialog: MatDialog,
    private usersService: UsersService,
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService
  ) {
    this.api = {
      serviceName: "usersService",
      serviceCall: "list"
    };
    this.columns = [
      {
        key: "firstName",
        header: "Firstname",
        sort: true,
        cell: (row: any) => `${row.firstName}`
      },
      {
        key: "lastName",
        header: "Lastname",
        sort: true,
        cell: (row: any) => `${row.lastName}`
      },
      {
        key: "email",
        header: "Email",
        sort: true,
        cell: (row: any) => `<b>${row.email}</b>`
      },
      {
        key: "role",
        header: "Role",
        sort: true,
        cell: (row: any) => `${row.role}`
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
          edit_user: (row: any) => {
            this.router.navigateByUrl(`/users/edit/${row.id}`);
          },
          delete_user: (row: any) => {
            let dialogRef = this.dialog.open(DialogQuestionComponent, {
              data: {
                title: `Delete User`,
                content: `Are you sure you want to delete <b>${row.firstName} ${
                  row.lastName
                } - ${row.email}</b> user ?`
              }
            });
            dialogRef.afterClosed().subscribe(result => {
              if (result === "yes") {
                this.usersService.delete(row.id).subscribe((data: any) => {
                  this.snackBar.open(data.message, "Dismiss", {
                    duration: 2000
                  });
                  this.appTable.refresh();
                });
              }
            });
          }
        },
        conditions: {
          edit_user: (row: any) => this.authService.current["role"] === "Admin",
          delete_user: (row: any) => this.authService.current["role"] === "Admin" && this.authService.current["id"] !== row.id
        }
      }
    ];
    console.log(this.authService.current);
  }

  ngOnInit() {}
}
