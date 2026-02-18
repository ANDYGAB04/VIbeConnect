import { Component, inject } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CdkScrollable } from "@angular/cdk/scrolling";

@Component({
  selector: 'app-roles-modal',
  standalone: true,
  imports: [CdkScrollable],
  templateUrl: './roles-modal.component.html',
  styleUrl: './roles-modal.component.css'
})
export class RolesModalComponent {
  bsModalRef = inject(BsModalRef);
  title = '';
  list: string[] = [];

}
