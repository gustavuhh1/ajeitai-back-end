export interface INotificationService {
  dispatch(userId: string, payload: {
    title: string;
    message: string;
    type: "NEW_QUOTE" | "NEW_MESSAGE" | "STATUS_CHANGE" | "SERVICE_DELETED";
    link?: string | null;
  }): Promise<void>;
}
