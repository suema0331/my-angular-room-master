import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {User} from '../interfaces/user';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Light} from '../interfaces/light';
import {Message} from '../interfaces/message';
import {Video} from '../interfaces/video';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  // 流れてきたデータをpipeで変換する
  // どんなデータを取得するか、interfaceで指定
  lightStatus$ = this.db.doc<Light>('room/light').valueChanges().pipe(
    map(data => data && data.status)
  );

  videoId$: Observable<string> = this.db.doc<Video>('room/video').valueChanges().pipe(
    map(data => data && data.id)
  );

  constructor(
    private db: AngularFirestore
  ) {
  }

  getUsers(): Observable<User[]> {
    // User形式のデータがusersコレクションに入る
    return this.db.collection<User>('users').valueChanges();
  }

  // roomというコレクションにlightドキュメント作成し、値をセット
  toggleLight(status: boolean) {
    this.db.doc('room/light').set({
      status: !status
    });
  }

  sendMessage(uid: string, body: string) {
    const id = this.db.createId(); // 自分が捕捉できるidを作成
    // this.db.collection(`messages/${id}`).add({
    // メッセージにidをセット
    this.db.doc(`messages/${id}`).set({
      // uid: uid,
      // body: body
      id,
      uid,
      body,
      createdAt: new Date()
    });
  }

  deleteMessage(id: string){
    this.db.doc(`messages/${id}`).delete();
  }

  getLatestMessage(): Observable<Message[]> {
    return this.db.collection<Message>('messages', ref => ref.orderBy('createdAt', 'desc').limit(1)).valueChanges();
  }

  changeVideo(url: string): string{
    // https://www.youtube.com/watch?v=sAICHX1xywI
    const matcher = url.match(/https:\/\/www\.youtube\.com\/watch\?v=(.+)/);
    if (matcher){
      // console.log(matcher[1]); // 全体
      // console.log(matcher[1]); // sAICHX1xywI
      // const videoId = matcher[1];
      this.db.doc('room/video').set({
        id: matcher[1]
      });
      // return videoId;
    } else {
      console.log('URLが不正です');
      return null;
    }
  }
}

  // getLatestMessages(): Observable<Message[]> {
  //   return this.db.collection<Message>('messages', ref => ref.orderBy('createdAt', 'desc')
  //     .limit(1)).valueChanges();
  //     // .pipe(
  //     //   map(docs => docs && docs[0])
  //     // );
  // // }
  // }
