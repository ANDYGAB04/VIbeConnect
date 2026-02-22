import { Component, inject } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confim-dialog',
  standalone: true,
  imports: [],
  templateUrl: './confim-dialog.component.html',
  styleUrl: './confim-dialog.component.css'
})
export class ConfimDialogComponent {
  bsModalRef = inject(BsModalRef);
  title = '';
  message = '';
  btnOkText = '';
  btnCancelText = '';
  result = false;

  confirm() {
    this.result = true;
    this.bsModalRef.hide();

  }

  decline() {
    this.bsModalRef.hide();
  }
}
