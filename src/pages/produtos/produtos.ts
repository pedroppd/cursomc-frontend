import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ProdutoDTO } from '../../models/produto.dto';
import { ProdutoService } from '../../services/domain/produto.service';
import { API_CONFIG } from '../../config/api.config';

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {
  items: ProdutoDTO[] =[];
  page: number=0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public produtoService: ProdutoService, public loadinController: LoadingController) {
  }

  loadData(){
    let categoria_id = this.navParams.get('categoria_id');
    let loader = this.presentLoading();
    this.produtoService.findByCategoria(categoria_id, this.page, 10)
    .subscribe(response => {
      let start = this.items.length;
      this.items = this.items.concat(response['content']);
      let end = this.items.length -1;
      loader.dismiss();
      this.loadImageUrl(start, end);
    }, error => {
      loader.dismiss();
    });
  }

  ionViewDidLoad() {
   this.loadData();
  };

 loadImageUrl(start: number, end:number){
   for(var i=start; i<=end; i++){
       let item = this.items[i];
       this.produtoService.getSmallImageFromBucket(item.id)
       .subscribe(response => {
         item.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.id}-small.jpg`;
       }, error => {});
   }
 }

 showDetail(produto_id: string) {
  this.navCtrl.push('ProdutoDetailPage', {produto_id : produto_id});
}

presentLoading(){
  let loader =this.loadinController.create({
    content: "aguarde ..."
  });
  loader.present();
  return loader;
}

doInfinite(infiniteScroll){
  this.page++;
  this.loadData();
  setTimeout(() => {
    infiniteScroll.complete();
  }, 1000);
}

}
