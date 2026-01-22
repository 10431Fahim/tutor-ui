import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import * as moment from 'moment-timezone';
import { unitOfTime } from 'moment-timezone';


@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) {
  }

  /**
  * getYoutubeVideoId()
  * getDateWithCurrentTime()
  * getRandomOtpCode6()
  * getDateString()
  * getImageName()
  * getRandomInt()
  * getDateDifference()
  * getNextDateString()
  * roundNumber()
  * roundNumberString()
  * removeUrlQuery
  */

  public getYoutubeVideoId(url: string) {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length == 11) {
      return match[2];
    } else {
      return '';
    }
  }

  getDateWithCurrentTime(date: Date): Date {
    const _ = moment().tz('Asia/Dhaka');;
    const newDate = moment(date).add({ hours: _.hour(), minutes: _.minute() });
    return newDate.toDate();
  }

  getRandomOtpCode6(): string {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  getDateString(date: Date, format?: string): string {
    const fm = format ? format : 'YYYY-MM-DD';
    return moment(date).format(fm);
  }

  getCurrentTime() {
    return new Date().toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  }
  getImageName(originalName: string): string {
    const array = originalName.split('.');
    array.pop();
    return array.join('');
  }

  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getDateDifference(startDate: Date, endDate: Date, unitOfTime: unitOfTime.Diff) {

    const a = moment(startDate, 'M/D/YYYY');
    const b = moment(endDate, 'M/D/YYYY');
    return a.diff(b, unitOfTime);
  }

  getNextDateString(date: Date, day) {
    return moment(date).add(day, 'days').toDate();
  }

  validateEmail(str: string) {
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return !!str.match(mailFormat);
  }

  roundNumber(num: number): number {
    const integer = Math.floor(num);
    const fractional = num - integer;

    const frac2int = (fractional * 100) / 5;
    const fracCeil = Math.ceil(frac2int);

    const FracOut = (fracCeil * 5) / 100;
    const ans = integer + FracOut;

    return Number((Math.round(ans * 100) / 100).toFixed(2));
  }

  roundNumberString(num: number): string {
    const integer = Math.floor(num);
    const fractional = num - integer;

    const frac2int = (fractional * 100) / 5;
    const fracCeil = Math.ceil(frac2int);

    const FracOut = (fracCeil * 5) / 100;
    const ans = integer + FracOut;

    return (Math.round(ans * 100) / 100).toFixed(2);
  }

  removeUrlQuery(url: string): string {
    if (url) {
      return url.replace(/\?.*/, '');
    }
    return '';
  }


  getHostBaseUrl() {
    return new URL(document.location.href).origin;
  }

}

