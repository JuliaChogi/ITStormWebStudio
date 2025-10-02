import {Component, OnInit} from '@angular/core';
import {LoaderService} from "../../services";

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  constructor(private readonly loaderService: LoaderService) {
  }

  protected isShowed: boolean = false;

  public ngOnInit(): void {
    this.loaderService.isShowed$.subscribe((isShowed: boolean): void => {
      this.isShowed = isShowed;
    });
  }
}
