import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InternalService {

  constructor() {}

  numberToWords(num: number): string {
    const units = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "Ten",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
  
    if (num === 0) return "Zero";
  
    function convertChunk(chunk: any) {
      let words = "";
      if (chunk >= 100) {
        words += units[Math.floor(chunk / 100)] + " Hundred ";
        chunk %= 100;
      }
      if (chunk >= 20) {
        words += tens[Math.floor(chunk / 10)] + " ";
        chunk %= 10;
      } else if (chunk >= 10) {
        words += teens[chunk - 10] + " ";
        chunk = 0;
      }
      if (chunk > 0 && chunk < 10) {
        words += units[chunk] + " ";
      }
      return words.trim();
    }
  
    let words = "";
    if (num >= 100000) {
      const lakh = Math.floor(num / 100000);
      words += convertChunk(lakh) + " Lakh ";
      num %= 100000;
    }
    if (num >= 1000) {
      const thousand = Math.floor(num / 1000);
      words += convertChunk(thousand) + " Thousand ";
      num %= 1000;
    }
    if (num > 0) {
      words += convertChunk(num);
    }
  
    return words.trim();
  }
  
}