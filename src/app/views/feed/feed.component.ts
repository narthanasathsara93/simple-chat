
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatMessage } from '../../models/chat-message.model';
import { ChatService } from '../../services/chat.service';
@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class FeedComponent implements OnInit {
  feedObservable: Observable<ChatMessage[]>;
  constructor(private chatService: ChatService) {}

  ngOnInit(): void {  
    this.feedObservable = this.chatService.getMessages();
  }

  ngOnChanges(): void {
    this.feedObservable = this.chatService.getMessages();
  }
}
