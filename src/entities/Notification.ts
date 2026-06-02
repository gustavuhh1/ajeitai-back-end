import { randomUUID } from "node:crypto";

export type NotificationType = "NEW_QUOTE" | "NEW_MESSAGE" | "STATUS_CHANGE" | "SERVICE_DELETED";

export interface NotificationProps {
  id?: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead?: boolean;
  link?: string | null;
  createdAt?: Date;
}

export class Notification {
  private props: NotificationProps;

  constructor(props: NotificationProps) {
    this.props = {
      ...props,
      id: props.id ?? randomUUID(),
      isRead: props.isRead ?? false,
      createdAt: props.createdAt ?? new Date(),
    };
  }

  get id() {
    return this.props.id;
  }
  get userId() {
    return this.props.userId;
  }
  get title() {
    return this.props.title;
  }
  get message() {
    return this.props.message;
  }
  get type() {
    return this.props.type;
  }
  get isRead() {
    return this.props.isRead;
  }
  get link() {
    return this.props.link;
  }
  get createdAt() {
    return this.props.createdAt;
  }

  public markAsRead() {
    this.props.isRead = true;
  }
}
