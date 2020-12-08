import { ChatService } from '../../services/chat.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-form',
  templateUrl: './chat-form.component.html',
  styleUrls: ['./chat-form.component.scss'],
})
export class ChatFormComponent implements OnInit {
  message: string;

  constructor(private chat: ChatService) {}

  ngOnInit() {}

  // send the message to chat service function
  send() {
    this.chat.sendMessage(this.message);
    this.message = '';
  }

  // check the pressed key is Enter key
  handleSubmit(event: { keyCode: number }) {
    if (event.keyCode === 13) {
      this.send();
    }
  }
}
