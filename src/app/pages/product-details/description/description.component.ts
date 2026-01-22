import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Product } from 'src/app/interfaces/common/product';
import { Author } from 'src/app/interfaces/common/author.interface';
import { Subscription } from 'rxjs';
import { AuthorService } from 'src/app/services/common/author.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/common/user.service';
import { ReloadService } from 'src/app/services/core/reload.service';
import { UiService } from 'src/app/services/core/ui.service';
import {Banner} from "../../../interfaces/common/banner.interface";

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss']
})
export class DescriptionComponent implements OnChanges{

  //Store Data
  @Input() product: Product;
  @Input() data: Banner;

  author: Author;
  id: string | any;
  tabNo = 0;
  isFollowAuthor: boolean = true;

  //Subscription
  private subAuthorData: Subscription;
  private subAuthorQParam: Subscription;
  private subCheckFollwedAuthor: Subscription;
  private subFollowUnFollow: Subscription;
  constructor(
    private matDialog: MatDialog,
    private authorService: AuthorService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private reloadService: ReloadService,
    private uiService: UiService
  ) {

  }
  ngOnInit() {

    this.id = this.product?.author[0]._id;


    // this.subAuthorQParam = this.activatedRoute.queryParamMap.subscribe(res => {
    //   this.id = res.get('authorId');
    //   if (this.id) {
    //     // this.getSingleAuthorById(this.id);
    //     this.checkFollwedAuthor(this.id);
    //   }
    // })
    //
    // this.getSingleAuthorById(this.product?.author[0]._id);
    // console.log('this.product?.author[0]._id222',this.product?.author[0]._id);
  }

  ngOnChanges(changes: SimpleChanges) {
    // this.getSingleAuthorById(this.product?.author[0]._id);
    // console.log('this.product111',this.product);
    // console.log('this.product?.author[0]._id',this.product?.author[0]._id);
  }


  /**
  *  HTTP REQUEST HANDLE
  *  getAuthorById()
  *  checkFollwedAuthor()
  */
  getSingleAuthorById(id: string) {
    this.subAuthorData = this.authorService.getAuthorById(id).subscribe(
      (res) => {
        if (res.success) {
          this.author = res.data;
          // console.log('this.author',this.author);
        }
      },
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    )
  }
  checkFollwedAuthor(id: string) {
    this.subCheckFollwedAuthor = this.userService.checkFollwedAuthor(id).subscribe((res) => {
      if (res.success) {
        this.isFollowAuthor = res.data;
      }
    },
      (err) => {
        console.log(err);
      }
    )
  }

  followUnfollowAuthorByUser(type: string) {
    const data = {
      type: type,
      author: this.id
    }
    if (data) {
      this.subFollowUnFollow = this.userService.followUnfollowAuthorByUser(data).subscribe((res) => {
        if (res.success) {
          this.uiService.success(res.message);
          this.reloadService.needRefreshData$();
        }
      },
        (err) => {
          if (err) {
            console.log(err);
          }
        }

      )
    }
  }



  /**
   * TAB HANDLING
   * tabHandle()
   */
  tabHandle(step: number) {
    this.tabNo = step;
  }

  /**
   * ON NG DESTROY
   */

  ngOnDestroy() {
    if (this.subAuthorData) {
      this.subAuthorData.unsubscribe();
    }
    if (this.subAuthorQParam) {
      this.subAuthorQParam.unsubscribe();
    }
    if (this.subCheckFollwedAuthor) {
      this.subCheckFollwedAuthor.unsubscribe();
    }
    if (this.subFollowUnFollow) {
      this.subFollowUnFollow.unsubscribe();
    }
  }

}
