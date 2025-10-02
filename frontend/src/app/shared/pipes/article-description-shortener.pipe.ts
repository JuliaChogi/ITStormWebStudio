import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'articleDescriptionShortener'
})

export class ArticleDescriptionShortenerPipe implements PipeTransform {

  public transform(value: string, limit: number = 150): string {
    if (!value) return '';
    if (value.length <= limit) return value;
    const cutAt: number = value.lastIndexOf('.', limit);
    if (cutAt !== -1 && cutAt > limit * 0.6) {
      return value.slice(0, cutAt + 1);
    }
    const cutSpace: number = value.lastIndexOf(' ', limit);
    if (cutSpace !== -1) {
      return value.slice(0, cutSpace) + '…';
    }

    return value.slice(0, limit) + '…';
  }
}
