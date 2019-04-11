import { Component, OnInit, Input, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";

@Component({
  selector: "app-dialog-question",
  templateUrl: "./dialog-question.component.html",
  styleUrls: ["./dialog-question.component.scss"]
})
export class DialogQuestionComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogQuestionComponent>
  ) {}

  ngOnInit() {}

  onYes() {
    this.dialogRef.close("yes");
  }
}
