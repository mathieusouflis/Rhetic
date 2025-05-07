export interface NotificationType {
    id: string;
    documentId: string;
    type: 'comment_reply' | 'post_reply' | 'mention' | 'mod_action' | 'system';
    content: string | {
      message?: string;
      title?: string;
      description?: string;
    };
    reference_id?: string;
    reference_type?: string;
    is_read: boolean;
    read_at?: Date;
    createdAt: Date;
    updatedAt: Date;
    publishedAt: Date;
    liveblocks_delivered?: boolean;
  }