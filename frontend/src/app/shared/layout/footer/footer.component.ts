import {Component, OnInit} from '@angular/core';
import {ModalService} from "../../services/modal.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  private activeFragment: string | null = null;

  constructor(private modalService: ModalService, private _activeRoute: ActivatedRoute) {
  }

  openConsultation() {
    this.modalService.open('consultation');
  }

  ngOnInit(): void {
    this._activeRoute.fragment.subscribe(fragment => {
      this.activeFragment = fragment;
    });
  }

  isActive(fragment: string): boolean {
    return this.activeFragment === fragment;
  }
}
