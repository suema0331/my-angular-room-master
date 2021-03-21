import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // login User取得
  user$ = this.afAuth.user;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore
  ) { }

  // tslint:disable-next-line:typedef
  login(){
    this.afAuth.signInAnonymously().then(result => {
      // dbにアクセスしてuser作成して保存
      this.db.doc(`users/${result.user.uid}`).set({
        uid: result.user.uid,
        leftPosition: Math.floor(Math.random() * 800 ) + 'px', // 生成位置
        avaterId: Math.floor(Math.random() * 10 ) + 1, // モンスタ指定
      });
    });
  }

  logout(uid: string){
    this.db.doc(`users/${uid}`).delete();
  }

}
