export class ChatMessage {
  constructor(id, sender, text, timestamp) {
    this.id = id;
    this.sender = sender;
    this.text = text;
    this.timestamp = timestamp;
  }
}

export class GamePhase {
  constructor(phase) {
    this.phase = phase;
  }
}
