import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {ApiAiClient} from 'api-ai-javascript';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';


// Message class for displaying messages in the component
export class Message {
  constructor(public content: string, public sentBy: string, private date: Date) {
  }
}


@Injectable()

export class ChatService {

  readonly token = environment.dialogflow.angularBot;
  readonly client = new ApiAiClient({accessToken: this.token});
  conversation = new BehaviorSubject<Message[]>([]);

  constructor() {}


  // Sends and receives messages via DialogFlow
  converse(msg: string) {
    const userMessage = new Message(msg, 'user', new Date());
    this.update(userMessage);
    return this.client.textRequest(msg)
      .then(res => {
        const speech = res.result.fulfillment.speech;
        const botMessage = new Message(speech, 'bot', new Date());
        this.update(botMessage);
      });
  }


  // Adds message to source
  update(msg: Message) {
    this.conversation.next([msg]);
  }

  fillConversation(msgArray: Message[]) {
    this.conversation.next(msgArray);
  }
  clearConversation() {
    this.conversation = new BehaviorSubject<Message[]>([]);
  }

}
