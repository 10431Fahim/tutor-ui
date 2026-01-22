import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UtilsService } from '../core/utils.service';
import { ImageUploadResponse, ResponsePayload } from '../../interfaces/core/response-payload.interface';


const API_URL = environment.ftpBaseLink + (environment.ftpPrefix ? `/${environment.ftpPrefix}/upload/` : '/upload/');


@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  // Inject
  private readonly httpClient = inject(HttpClient);
  private readonly utilsService = inject(UtilsService);

  /**
   * UPLOAD IMAGE
   * uploadSingleImage()
   * uploadSingleConvertToMulti()
   * uploadMultiImageOriginal()
   */

  uploadSingleImage(fileData: any) {
    const data = new FormData();
    data.append('folderPath', fileData.folderPath);
    data.append('image', fileData.file, fileData.fileName);
    return this.httpClient.post<{ message: string, url: string }>(API_URL + 'single-image', data);

  }

  uploadSingleConvertToMulti(fileData: string | any, fileName?: string) {
    const data = new FormData();
    data.append('productImage', fileData, fileName);
    return this.httpClient.post<{ images: object }>(API_URL + 'single-image-to-multi-convert', data);

  }

  uploadMultiImageOriginal(files: File[]) {
    const data = new FormData();
    files.forEach(f => {
      const fileName = this.utilsService.getImageName(f.name) + this.utilsService.getRandomInt(100, 5000) + '.' + f.name.split('.').pop();
      data.append('imageMulti', f);
    });
    return this.httpClient.post<ImageUploadResponse[]>(API_URL + 'multiple-image', data);

  }


  /**
   * REMOVE IMAGE
   * deleteMultipleFile()
   * removeSingleFile()
   */

  deleteMultipleFile(data: string[]) {
    return this.httpClient.post<ResponsePayload>(API_URL + 'delete-multiple-image', { url: data });
  }

  removeSingleFile(url: string) {
    return this.httpClient.post<{ message: string }>(API_URL + 'delete-single-image', { url });
  }

}
