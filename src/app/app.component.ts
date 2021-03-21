import { Component } from '@angular/core';
import {AuthService} from './service/auth.service';
import {RoomService} from './service/room.service';
import {skip, tap} from 'rxjs/operators';
import {FormBuilder, Validators} from '@angular/forms';
import {Item} from './interfaces/item';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'rooms';

  messages = {};
  // observableは慣習的に$
  lightStatus$ = this.roomService.lightStatus$.pipe(
    tap(status => this.lightStatus = status)
  );
  // そうめん流しの中で取ってきて値を取得
  lightStatus: boolean;

  users$ = this.roomService.getUsers();
  user$ = this.authService.user$;
  form = this.fb.group({
    body: ['', Validators.required]
  });

  id = '3jWRrafhO7M';
  player: YT.Player;
  playerVars = {
    // controls: 0
  };
  youtubeForm = this.fb.group({
    url: ['', Validators.required]
  });
  muteStatus = false;

  // 家具の要素分
  items = new Array(44);
  roomItems: Item[] = [];

  constructor(
    private authService: AuthService,
    private roomService: RoomService,
    private fb: FormBuilder,
  ) {
    this.roomService.getLatestMessage().pipe(skip(1)).subscribe(messages => {
      if (!messages[0]) {
        return;
      }

      const message = messages[0];
      if (!this.messages[message.uid]) {
        this.messages[message.uid] = [];
      }
      this.messages[message.uid].unshift(message.body);
      setTimeout(() => {
        this.messages[message.uid].pop();
        this.roomService.deleteMessage(message.id);
      }, 5000);
    });

    // videoIdを常に監視
    this.roomService.videoId$.subscribe(videoId => {
      if (this.player){ // 存在すれば更新
        this.player.loadVideoById(videoId);
      }
    });
  }

    // // 最新のメッセージを取ってきて、誰のメッセージかをキーにして、メッセージ格納
    // this.roomService.getLatestMessages().subscribe(message => {
    //   if (!this.messages[message.uid]){
    //     this.messages[message.uid] = [];
    //   }
    //   // 配列の一番上につっこむ
    //   this.messages[message.uid].unshift(message.body);
    // });


  login(){
    this.authService.login();
  }

  logout(uid: string){
    this.authService.logout(uid);
  }

  toggleLight(){
    this.roomService.toggleLight(this.lightStatus);
  }

  sendMessage(uid: string){
    this.roomService.sendMessage(
      uid,
      this.form.value.body
    );
    this.form.reset();
  }

  savePlayer(player) {
    this.player = player;
    // console.log('player instance', player);
    this.player.playVideo();
    // this.player.mute(); // 音無
  }
  // onStateChange(event) {
  //   console.log('player state', event.data);
  // }

  changeVideo(){
    // サービスにurlを渡す
    if (this.youtubeForm.valid) {
      this.roomService.changeVideo(this.youtubeForm.value.url);
      // this.player.loadVideoById(videoId); // ローカルでの確認用
    }
  }

  putItem(id: number){
    this.roomItems.push(
      {
        id,
        size: 'md',
      });
  }

  changeItemSize( index: number , size: 'lg' | 'md' | 'sm'){
    this.roomItems[index].size = size;
  }

  changeMute(){
      // console.log('player instance', player);
      console.log(this.muteStatus);
      this.player.mute(); // 音無
      console.log('player instance', this.player);
      this.player.playVideo();
      this.muteStatus = true;
  }

  changeVolumeOn(){
    console.log(this.muteStatus);
    this.player.playVideo();
    this.muteStatus = false;
  }
}
