import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ModalService} from "../../services";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  private activeFragment: string | null = null;

  constructor(private readonly modalService: ModalService, private readonly activeRoute: ActivatedRoute) {
  }

  protected openConsultation(): void {
    this.modalService.open('consultation');
  }

  public ngOnInit(): void {
    this.activeRoute.fragment.subscribe((fragment: string | null): void => {
      this.activeFragment = fragment;
    });
  }

  protected isActive(fragment: string): boolean {
    return this.activeFragment === fragment;
  }
}
