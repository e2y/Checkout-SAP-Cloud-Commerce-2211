import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cxMultiLine',
  standalone: false,
})
export class MultiLinePipe implements PipeTransform {
  transform(value: string): string {
    const lastIndex: number = value.lastIndexOf(' ');

    if (lastIndex === -1) {
      return value;
    }

    return (
      value.substring(0, lastIndex) +
      '<br />' +
      value.substring(lastIndex, value.length).trim()
    );
  }
}
