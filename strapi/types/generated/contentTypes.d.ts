import type { Schema, Struct } from '@strapi/strapi';

export interface AdminApiToken extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_api_tokens';
  info: {
    description: '';
    displayName: 'Api Token';
    name: 'Api Token';
    pluralName: 'api-tokens';
    singularName: 'api-token';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Schema.Attribute.DefaultTo<''>;
    expiresAt: Schema.Attribute.DateTime;
    lastUsedAt: Schema.Attribute.DateTime;
    lifespan: Schema.Attribute.BigInteger;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::api-token'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'admin::api-token-permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    type: Schema.Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'read-only'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_api_token_permissions';
  info: {
    description: '';
    displayName: 'API Token Permission';
    name: 'API Token Permission';
    pluralName: 'api-token-permissions';
    singularName: 'api-token-permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::api-token-permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    token: Schema.Attribute.Relation<'manyToOne', 'admin::api-token'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminPermission extends Struct.CollectionTypeSchema {
  collectionName: 'admin_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'Permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<{}>;
    conditions: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<[]>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::permission'> &
      Schema.Attribute.Private;
    properties: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<{}>;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.Relation<'manyToOne', 'admin::role'>;
    subject: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminRole extends Struct.CollectionTypeSchema {
  collectionName: 'admin_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'Role';
    pluralName: 'roles';
    singularName: 'role';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::role'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<'oneToMany', 'admin::permission'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users: Schema.Attribute.Relation<'manyToMany', 'admin::user'>;
  };
}

export interface AdminTransferToken extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_transfer_tokens';
  info: {
    description: '';
    displayName: 'Transfer Token';
    name: 'Transfer Token';
    pluralName: 'transfer-tokens';
    singularName: 'transfer-token';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Schema.Attribute.DefaultTo<''>;
    expiresAt: Schema.Attribute.DateTime;
    lastUsedAt: Schema.Attribute.DateTime;
    lifespan: Schema.Attribute.BigInteger;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminTransferTokenPermission
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    description: '';
    displayName: 'Transfer Token Permission';
    name: 'Transfer Token Permission';
    pluralName: 'transfer-token-permissions';
    singularName: 'transfer-token-permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token-permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    token: Schema.Attribute.Relation<'manyToOne', 'admin::transfer-token'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminUser extends Struct.CollectionTypeSchema {
  collectionName: 'admin_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'User';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    blocked: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    firstname: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    isActive: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    lastname: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::user'> &
      Schema.Attribute.Private;
    password: Schema.Attribute.Password &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    preferedLanguage: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    registrationToken: Schema.Attribute.String & Schema.Attribute.Private;
    resetPasswordToken: Schema.Attribute.String & Schema.Attribute.Private;
    roles: Schema.Attribute.Relation<'manyToMany', 'admin::role'> &
      Schema.Attribute.Private;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    username: Schema.Attribute.String;
  };
}

export interface ApiAnonymousPostAuthorAnonymousPostAuthor
  extends Struct.CollectionTypeSchema {
  collectionName: 'anonymous_post_authors';
  info: {
    description: '';
    displayName: 'AnonymousPostAuthor';
    pluralName: 'anonymous-post-authors';
    singularName: 'anonymous-post-author';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::anonymous-post-author.anonymous-post-author'
    > &
      Schema.Attribute.Private;
    post: Schema.Attribute.Relation<'oneToOne', 'api::post.post'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users_permissions_user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
  };
}

export interface ApiCommentComment extends Struct.CollectionTypeSchema {
  collectionName: 'comments';
  info: {
    description: 'Commentaires sur les posts';
    displayName: 'Comment';
    pluralName: 'comments';
    singularName: 'comment';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    author: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    children: Schema.Attribute.Relation<'oneToMany', 'api::comment.comment'>;
    content: Schema.Attribute.Text & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    downvotes: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::comment.comment'
    > &
      Schema.Attribute.Private;
    parent: Schema.Attribute.Relation<'manyToOne', 'api::comment.comment'>;
    post: Schema.Attribute.Relation<'manyToOne', 'api::post.post'>;
    publishedAt: Schema.Attribute.DateTime;
    publishedDate: Schema.Attribute.DateTime;
    reports: Schema.Attribute.Relation<'oneToMany', 'api::report.report'>;
    saved_items: Schema.Attribute.Relation<
      'oneToMany',
      'api::saved-item.saved-item'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    upvotes: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    user_flair_assignments: Schema.Attribute.Relation<
      'oneToMany',
      'api::user-flair-assignment.user-flair-assignment'
    >;
    votes: Schema.Attribute.Relation<'oneToMany', 'api::vote.vote'>;
  };
}

export interface ApiModerationActionModerationAction
  extends Struct.CollectionTypeSchema {
  collectionName: 'moderation_actions';
  info: {
    displayName: 'Moderation Action';
    pluralName: 'moderation-actions';
    singularName: 'moderation-action';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    action_type: Schema.Attribute.Enumeration<
      [
        'post_flagged',
        'post_removed',
        'user_warned',
        'user_banned',
        'comment_removed',
      ]
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    details: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::moderation-action.moderation-action'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    subrhetic: Schema.Attribute.Relation<
      'manyToOne',
      'api::subrhetic.subrhetic'
    >;
    target_id: Schema.Attribute.String;
    target_type: Schema.Attribute.Enumeration<['post', 'comment', 'user']>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users_permissions_user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
  };
}

export interface ApiNotificationNotification
  extends Struct.CollectionTypeSchema {
  collectionName: 'notifications';
  info: {
    description: '';
    displayName: 'Notification';
    pluralName: 'notifications';
    singularName: 'notification';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    content: Schema.Attribute.JSON & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    is_read: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::notification.notification'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    read_at: Schema.Attribute.DateTime;
    reference_id: Schema.Attribute.UID;
    reference_type: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<
      ['comment_reply', 'post_reply', 'mention', 'mod_action', 'system']
    > &
      Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users_permissions_user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
  };
}

export interface ApiPostFlairAssignmentPostFlairAssignment
  extends Struct.CollectionTypeSchema {
  collectionName: 'post_flair_assignments';
  info: {
    description: '';
    displayName: 'PostFlairAssignment';
    pluralName: 'post-flair-assignments';
    singularName: 'post-flair-assignment';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::post-flair-assignment.post-flair-assignment'
    > &
      Schema.Attribute.Private;
    post: Schema.Attribute.Relation<'manyToOne', 'api::post.post'>;
    post_flair: Schema.Attribute.Relation<
      'manyToOne',
      'api::post-flair.post-flair'
    >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users_permissions_user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
  };
}

export interface ApiPostFlairPostFlair extends Struct.CollectionTypeSchema {
  collectionName: 'post_flairs';
  info: {
    description: '';
    displayName: 'PostFlair';
    pluralName: 'post-flairs';
    singularName: 'post-flair';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    background_color: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'#FF4500'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    emoji: Schema.Attribute.String;
    is_mod_only: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::post-flair.post-flair'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    position: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    post_flair_assignments: Schema.Attribute.Relation<
      'oneToMany',
      'api::post-flair-assignment.post-flair-assignment'
    >;
    publishedAt: Schema.Attribute.DateTime;
    subrhetic: Schema.Attribute.Relation<
      'manyToOne',
      'api::subrhetic.subrhetic'
    >;
    text_color: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'#FFFFFF'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiPostPost extends Struct.CollectionTypeSchema {
  collectionName: 'posts';
  info: {
    description: 'Posts cr\u00E9\u00E9s par les utilisateurs dans des subrhetics sp\u00E9cifiques';
    displayName: 'Post';
    pluralName: 'posts';
    singularName: 'post';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    anonymous_post_author: Schema.Attribute.Relation<
      'oneToOne',
      'api::anonymous-post-author.anonymous-post-author'
    >;
    author: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    comments: Schema.Attribute.Relation<'oneToMany', 'api::comment.comment'>;
    content: Schema.Attribute.Text & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    downvotes: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::post.post'> &
      Schema.Attribute.Private;
    Media: Schema.Attribute.Media<'images' | 'files' | 'videos', true>;
    post_flair_assignments: Schema.Attribute.Relation<
      'oneToMany',
      'api::post-flair-assignment.post-flair-assignment'
    >;
    publishedAt: Schema.Attribute.DateTime;
    publishedDate: Schema.Attribute.DateTime;
    reports: Schema.Attribute.Relation<'oneToMany', 'api::report.report'>;
    saved_items: Schema.Attribute.Relation<
      'oneToMany',
      'api::saved-item.saved-item'
    >;
    slug: Schema.Attribute.String & Schema.Attribute.Unique;
    subrhetic: Schema.Attribute.Relation<
      'manyToOne',
      'api::subrhetic.subrhetic'
    >;
    title: Schema.Attribute.String;
    total_votes: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    upvotes: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    votes: Schema.Attribute.Relation<'oneToMany', 'api::vote.vote'>;
  };
}

export interface ApiPrivateMessagePrivateMessage
  extends Struct.CollectionTypeSchema {
  collectionName: 'private_messages';
  info: {
    description: '';
    displayName: 'PrivateMessage';
    pluralName: 'private-messages';
    singularName: 'private-message';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    content: Schema.Attribute.Text & Schema.Attribute.Required;
    content_html: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    is_read: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::private-message.private-message'
    > &
      Schema.Attribute.Private;
    parent: Schema.Attribute.Relation<
      'manyToOne',
      'api::private-message.private-message'
    >;
    private_messages: Schema.Attribute.Relation<
      'oneToMany',
      'api::private-message.private-message'
    >;
    publishedAt: Schema.Attribute.DateTime;
    recipient: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    sender: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    subject: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiReportReport extends Struct.CollectionTypeSchema {
  collectionName: 'reports';
  info: {
    description: '';
    displayName: 'Report';
    pluralName: 'reports';
    singularName: 'report';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    action_taken: Schema.Attribute.String;
    comment: Schema.Attribute.Relation<'manyToOne', 'api::comment.comment'>;
    content_typ: Schema.Attribute.Enumeration<['post', 'comment', 'user']> &
      Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    details: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::report.report'
    > &
      Schema.Attribute.Private;
    post: Schema.Attribute.Relation<'manyToOne', 'api::post.post'>;
    publishedAt: Schema.Attribute.DateTime;
    reason: Schema.Attribute.String & Schema.Attribute.Required;
    reported_user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    reporter: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    reviewed_by: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    statu: Schema.Attribute.Enumeration<['pending', 'reviewed', 'resolve']> &
      Schema.Attribute.DefaultTo<'pending'>;
    subrhetic: Schema.Attribute.Relation<
      'manyToOne',
      'api::subrhetic.subrhetic'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiSavedItemSavedItem extends Struct.CollectionTypeSchema {
  collectionName: 'saved_items';
  info: {
    description: '';
    displayName: 'SavedItem';
    pluralName: 'saved-items';
    singularName: 'saved-item';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    category: Schema.Attribute.String;
    comment: Schema.Attribute.Relation<'manyToOne', 'api::comment.comment'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    item_type: Schema.Attribute.Enumeration<['post', 'comment']> &
      Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::saved-item.saved-item'
    > &
      Schema.Attribute.Private;
    notes: Schema.Attribute.String;
    post: Schema.Attribute.Relation<'manyToOne', 'api::post.post'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users_permissions_user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
  };
}

export interface ApiSubrheticEmojiReactionSubrheticEmojiReaction
  extends Struct.CollectionTypeSchema {
  collectionName: 'subrhetic_emoji_reactions';
  info: {
    description: '';
    displayName: 'SubrheticEmojiReaction';
    pluralName: 'subrhetic-emoji-reactions';
    singularName: 'subrhetic-emoji-reaction';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::subrhetic-emoji-reaction.subrhetic-emoji-reaction'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    subrhetic: Schema.Attribute.Relation<
      'manyToOne',
      'api::subrhetic.subrhetic'
    >;
    subrhetic_emoji: Schema.Attribute.Relation<
      'manyToOne',
      'api::subrhetic-emoji.subrhetic-emoji'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users_permissions_user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
  };
}

export interface ApiSubrheticEmojiSubrheticEmoji
  extends Struct.CollectionTypeSchema {
  collectionName: 'subrhetic_emojis';
  info: {
    description: '';
    displayName: 'SubrheticEmoji';
    pluralName: 'subrhetic-emojis';
    singularName: 'subrhetic-emoji';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    emoji: Schema.Attribute.String & Schema.Attribute.Required;
    is_active: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::subrhetic-emoji.subrhetic-emoji'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    subrhetic: Schema.Attribute.Relation<
      'manyToOne',
      'api::subrhetic.subrhetic'
    >;
    subrhetic_emoji_reactions: Schema.Attribute.Relation<
      'oneToMany',
      'api::subrhetic-emoji-reaction.subrhetic-emoji-reaction'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users_permissions_user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
  };
}

export interface ApiSubrheticRuleSubrheticRule
  extends Struct.CollectionTypeSchema {
  collectionName: 'subrhetic_rules';
  info: {
    description: '';
    displayName: 'SubrheticRule';
    pluralName: 'subrhetic-rules';
    singularName: 'subrhetic-rule';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    is_active: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::subrhetic-rule.subrhetic-rule'
    > &
      Schema.Attribute.Private;
    made_by: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    position: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    publishedAt: Schema.Attribute.DateTime;
    subrhetic: Schema.Attribute.Relation<
      'manyToOne',
      'api::subrhetic.subrhetic'
    >;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    violation_reason: Schema.Attribute.Text;
  };
}

export interface ApiSubrheticTopicSubrheticTopic
  extends Struct.CollectionTypeSchema {
  collectionName: 'subrhetic_topics';
  info: {
    description: '';
    displayName: 'SubrheticTopic';
    pluralName: 'subrhetic-topics';
    singularName: 'subrhetic-topic';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    a: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::subrhetic-topic.subrhetic-topic'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    subrhetic: Schema.Attribute.Relation<
      'manyToOne',
      'api::subrhetic.subrhetic'
    >;
    topic: Schema.Attribute.Relation<'manyToOne', 'api::topic.topic'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users_permissions_user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
  };
}

export interface ApiSubrheticSubrhetic extends Struct.CollectionTypeSchema {
  collectionName: 'subrhetics';
  info: {
    description: 'Community groups similar to subreddits';
    displayName: 'Subrhetic';
    pluralName: 'subrhetics';
    singularName: 'subrhetic';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    banned_users: Schema.Attribute.Relation<
      'manyToMany',
      'plugin::users-permissions.user'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    creator: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    description: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::subrhetic.subrhetic'
    > &
      Schema.Attribute.Private;
    members: Schema.Attribute.Relation<
      'manyToMany',
      'plugin::users-permissions.user'
    >;
    moderation_actions: Schema.Attribute.Relation<
      'oneToMany',
      'api::moderation-action.moderation-action'
    >;
    moderators: Schema.Attribute.Relation<
      'manyToMany',
      'plugin::users-permissions.user'
    >;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    post_flairs: Schema.Attribute.Relation<
      'oneToMany',
      'api::post-flair.post-flair'
    >;
    posts: Schema.Attribute.Relation<'oneToMany', 'api::post.post'>;
    publishedAt: Schema.Attribute.DateTime;
    reports: Schema.Attribute.Relation<'oneToMany', 'api::report.report'>;
    slug: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    subrhetic_emoji_reactions: Schema.Attribute.Relation<
      'oneToMany',
      'api::subrhetic-emoji-reaction.subrhetic-emoji-reaction'
    >;
    subrhetic_emojis: Schema.Attribute.Relation<
      'oneToMany',
      'api::subrhetic-emoji.subrhetic-emoji'
    >;
    subrhetic_rules: Schema.Attribute.Relation<
      'oneToMany',
      'api::subrhetic-rule.subrhetic-rule'
    >;
    subrhetic_topics: Schema.Attribute.Relation<
      'oneToMany',
      'api::subrhetic-topic.subrhetic-topic'
    >;
    topics: Schema.Attribute.Relation<'manyToMany', 'api::topic.topic'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    user_flair_assignments: Schema.Attribute.Relation<
      'oneToMany',
      'api::user-flair-assignment.user-flair-assignment'
    >;
    user_flairs: Schema.Attribute.Relation<
      'oneToMany',
      'api::user-flair.user-flair'
    >;
  };
}

export interface ApiTopicTopic extends Struct.CollectionTypeSchema {
  collectionName: 'topics';
  info: {
    description: '';
    displayName: 'Topic';
    pluralName: 'topics';
    singularName: 'topic';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    icon_url: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::topic.topic'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    parent: Schema.Attribute.Relation<'manyToOne', 'api::topic.topic'>;
    publishedAt: Schema.Attribute.DateTime;
    subrhetic_topics: Schema.Attribute.Relation<
      'oneToMany',
      'api::subrhetic-topic.subrhetic-topic'
    >;
    subrhetics: Schema.Attribute.Relation<
      'manyToMany',
      'api::subrhetic.subrhetic'
    >;
    subscriber_count: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    topics: Schema.Attribute.Relation<'oneToMany', 'api::topic.topic'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiUserActivityLogUserActivityLog
  extends Struct.CollectionTypeSchema {
  collectionName: 'user_activity_logs';
  info: {
    description: '';
    displayName: 'UserActivityLog';
    pluralName: 'user-activity-logs';
    singularName: 'user-activity-log';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    activity_type: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ip_adress: Schema.Attribute.String;
    item_id: Schema.Attribute.UID;
    item_type: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::user-activity-log.user-activity-log'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    user_agent: Schema.Attribute.Text;
    users_permissions_user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
  };
}

export interface ApiUserBlockUserBlock extends Struct.CollectionTypeSchema {
  collectionName: 'user_blocks';
  info: {
    description: '';
    displayName: 'UserBlock';
    pluralName: 'user-blocks';
    singularName: 'user-block';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    blocked: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    blocker: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::user-block.user-block'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    reason: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiUserFlairAssignmentUserFlairAssignment
  extends Struct.CollectionTypeSchema {
  collectionName: 'user_flair_assignments';
  info: {
    description: '';
    displayName: 'UserFlairAssignment';
    pluralName: 'user-flair-assignments';
    singularName: 'user-flair-assignment';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    comment: Schema.Attribute.Relation<'manyToOne', 'api::comment.comment'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    custom_text: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::user-flair-assignment.user-flair-assignment'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    subrhetic: Schema.Attribute.Relation<
      'manyToOne',
      'api::subrhetic.subrhetic'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    user_flair: Schema.Attribute.Relation<
      'manyToOne',
      'api::user-flair.user-flair'
    >;
    users_permissions_user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
  };
}

export interface ApiUserFlairUserFlair extends Struct.CollectionTypeSchema {
  collectionName: 'user_flairs';
  info: {
    description: '';
    displayName: 'UserFlair';
    pluralName: 'user-flairs';
    singularName: 'user-flair';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    background_color: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'#0079D3'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    emoji: Schema.Attribute.String;
    is_mod_only: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::user-flair.user-flair'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    subrhetic: Schema.Attribute.Relation<
      'manyToOne',
      'api::subrhetic.subrhetic'
    >;
    text_color: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#FFFFFF'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    user_flair_assignments: Schema.Attribute.Relation<
      'oneToMany',
      'api::user-flair-assignment.user-flair-assignment'
    >;
  };
}

export interface ApiUserOnlineStatusUserOnlineStatus
  extends Struct.CollectionTypeSchema {
  collectionName: 'user_online_statuses';
  info: {
    displayName: 'User Online Status';
    pluralName: 'user-online-statuses';
    singularName: 'user-online-status';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    is_online: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    last_active: Schema.Attribute.DateTime;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::user-online-status.user-online-status'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users_permissions_user: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::users-permissions.user'
    >;
  };
}

export interface ApiUserPreferenceUserPreference
  extends Struct.CollectionTypeSchema {
  collectionName: 'user_preferences';
  info: {
    description: '';
    displayName: 'UserPreference';
    pluralName: 'user-preferences';
    singularName: 'user-preference';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    content_preferences: Schema.Attribute.JSON;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email_notifications: Schema.Attribute.JSON;
    language: Schema.Attribute.String & Schema.Attribute.DefaultTo<'fr'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::user-preference.user-preference'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    push_notifications: Schema.Attribute.JSON;
    show_nsfw: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    theme: Schema.Attribute.Enumeration<['auto', 'light', 'dark']> &
      Schema.Attribute.DefaultTo<'auto'>;
    timezone: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users_permissions_user: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::users-permissions.user'
    >;
  };
}

export interface ApiVoteVote extends Struct.CollectionTypeSchema {
  collectionName: 'votes';
  info: {
    description: 'Votes sur les posts et commentaires';
    displayName: 'Vote';
    pluralName: 'votes';
    singularName: 'vote';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    comment: Schema.Attribute.Relation<'manyToOne', 'api::comment.comment'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::vote.vote'> &
      Schema.Attribute.Private;
    post: Schema.Attribute.Relation<'manyToOne', 'api::post.post'>;
    publishedAt: Schema.Attribute.DateTime;
    type: Schema.Attribute.Enumeration<['upvote', 'downvote']> &
      Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
  };
}

export interface PluginContentReleasesRelease
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_releases';
  info: {
    displayName: 'Release';
    pluralName: 'releases';
    singularName: 'release';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    actions: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release-action'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    releasedAt: Schema.Attribute.DateTime;
    scheduledAt: Schema.Attribute.DateTime;
    status: Schema.Attribute.Enumeration<
      ['ready', 'blocked', 'failed', 'done', 'empty']
    > &
      Schema.Attribute.Required;
    timezone: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginContentReleasesReleaseAction
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_release_actions';
  info: {
    displayName: 'Release Action';
    pluralName: 'release-actions';
    singularName: 'release-action';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentType: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    entryDocumentId: Schema.Attribute.String;
    isEntryValid: Schema.Attribute.Boolean;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release-action'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    release: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::content-releases.release'
    >;
    type: Schema.Attribute.Enumeration<['publish', 'unpublish']> &
      Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginI18NLocale extends Struct.CollectionTypeSchema {
  collectionName: 'i18n_locale';
  info: {
    collectionName: 'locales';
    description: '';
    displayName: 'Locale';
    pluralName: 'locales';
    singularName: 'locale';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Schema.Attribute.String & Schema.Attribute.Unique;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::i18n.locale'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.SetMinMax<
        {
          max: 50;
          min: 1;
        },
        number
      >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginReviewWorkflowsWorkflow
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_workflows';
  info: {
    description: '';
    displayName: 'Workflow';
    name: 'Workflow';
    pluralName: 'workflows';
    singularName: 'workflow';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentTypes: Schema.Attribute.JSON &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'[]'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    stageRequiredToPublish: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::review-workflows.workflow-stage'
    >;
    stages: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow-stage'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginReviewWorkflowsWorkflowStage
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_workflows_stages';
  info: {
    description: '';
    displayName: 'Stages';
    name: 'Workflow Stage';
    pluralName: 'workflow-stages';
    singularName: 'workflow-stage';
  };
  options: {
    draftAndPublish: false;
    version: '1.1.0';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    color: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#4945FF'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow-stage'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    permissions: Schema.Attribute.Relation<'manyToMany', 'admin::permission'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    workflow: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::review-workflows.workflow'
    >;
  };
}

export interface PluginUploadFile extends Struct.CollectionTypeSchema {
  collectionName: 'files';
  info: {
    description: '';
    displayName: 'File';
    pluralName: 'files';
    singularName: 'file';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    alternativeText: Schema.Attribute.String;
    caption: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ext: Schema.Attribute.String;
    folder: Schema.Attribute.Relation<'manyToOne', 'plugin::upload.folder'> &
      Schema.Attribute.Private;
    folderPath: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    formats: Schema.Attribute.JSON;
    hash: Schema.Attribute.String & Schema.Attribute.Required;
    height: Schema.Attribute.Integer;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::upload.file'
    > &
      Schema.Attribute.Private;
    mime: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    previewUrl: Schema.Attribute.String;
    provider: Schema.Attribute.String & Schema.Attribute.Required;
    provider_metadata: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    related: Schema.Attribute.Relation<'morphToMany'>;
    size: Schema.Attribute.Decimal & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    url: Schema.Attribute.String & Schema.Attribute.Required;
    width: Schema.Attribute.Integer;
  };
}

export interface PluginUploadFolder extends Struct.CollectionTypeSchema {
  collectionName: 'upload_folders';
  info: {
    displayName: 'Folder';
    pluralName: 'folders';
    singularName: 'folder';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    children: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.folder'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    files: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.file'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::upload.folder'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    parent: Schema.Attribute.Relation<'manyToOne', 'plugin::upload.folder'>;
    path: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    pathId: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'role';
    pluralName: 'roles';
    singularName: 'role';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.role'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    type: Schema.Attribute.String & Schema.Attribute.Unique;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    >;
  };
}

export interface PluginUsersPermissionsUser
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'user';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    anonymous_post_authors: Schema.Attribute.Relation<
      'oneToMany',
      'api::anonymous-post-author.anonymous-post-author'
    >;
    avatar: Schema.Attribute.Media<'images'>;
    banned_from_subrhetics: Schema.Attribute.Relation<
      'manyToMany',
      'api::subrhetic.subrhetic'
    >;
    bio: Schema.Attribute.Text;
    blocked: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    comments: Schema.Attribute.Relation<'oneToMany', 'api::comment.comment'>;
    confirmationToken: Schema.Attribute.String & Schema.Attribute.Private;
    confirmed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    createdSubrhetics: Schema.Attribute.Relation<
      'oneToMany',
      'api::subrhetic.subrhetic'
    >;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    email_verified: Schema.Attribute.Boolean;
    is_active: Schema.Attribute.Boolean;
    joined_subrhetics: Schema.Attribute.Relation<
      'manyToMany',
      'api::subrhetic.subrhetic'
    >;
    last_login_at: Schema.Attribute.DateTime;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    > &
      Schema.Attribute.Private;
    moderatedSubrhetics: Schema.Attribute.Relation<
      'manyToMany',
      'api::subrhetic.subrhetic'
    >;
    moderation_actions: Schema.Attribute.Relation<
      'oneToMany',
      'api::moderation-action.moderation-action'
    >;
    notifications: Schema.Attribute.Relation<
      'oneToMany',
      'api::notification.notification'
    >;
    password: Schema.Attribute.Password &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    post_flair_assignments: Schema.Attribute.Relation<
      'oneToMany',
      'api::post-flair-assignment.post-flair-assignment'
    >;
    posts: Schema.Attribute.Relation<'oneToMany', 'api::post.post'>;
    private_messages: Schema.Attribute.Relation<
      'oneToMany',
      'api::private-message.private-message'
    >;
    provider: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    report: Schema.Attribute.Relation<'oneToMany', 'api::report.report'>;
    reports: Schema.Attribute.Relation<'oneToMany', 'api::report.report'>;
    resetPasswordToken: Schema.Attribute.String & Schema.Attribute.Private;
    role: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    saved_items: Schema.Attribute.Relation<
      'oneToMany',
      'api::saved-item.saved-item'
    >;
    subrhetic_emoji_reactions: Schema.Attribute.Relation<
      'oneToMany',
      'api::subrhetic-emoji-reaction.subrhetic-emoji-reaction'
    >;
    subrhetic_emojis: Schema.Attribute.Relation<
      'oneToMany',
      'api::subrhetic-emoji.subrhetic-emoji'
    >;
    subrhetic_rules: Schema.Attribute.Relation<
      'oneToMany',
      'api::subrhetic-rule.subrhetic-rule'
    >;
    subrhetic_topics: Schema.Attribute.Relation<
      'oneToMany',
      'api::subrhetic-topic.subrhetic-topic'
    >;
    two_factor_enabled: Schema.Attribute.Boolean;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    user_activity_logs: Schema.Attribute.Relation<
      'oneToMany',
      'api::user-activity-log.user-activity-log'
    >;
    user_blocks: Schema.Attribute.Relation<
      'oneToMany',
      'api::user-block.user-block'
    >;
    user_flair_assignments: Schema.Attribute.Relation<
      'oneToMany',
      'api::user-flair-assignment.user-flair-assignment'
    >;
    user_online_status: Schema.Attribute.Relation<
      'oneToOne',
      'api::user-online-status.user-online-status'
    >;
    user_preference: Schema.Attribute.Relation<
      'oneToOne',
      'api::user-preference.user-preference'
    >;
    username: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    votes: Schema.Attribute.Relation<'oneToMany', 'api::vote.vote'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ContentTypeSchemas {
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::permission': AdminPermission;
      'admin::role': AdminRole;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'admin::user': AdminUser;
      'api::anonymous-post-author.anonymous-post-author': ApiAnonymousPostAuthorAnonymousPostAuthor;
      'api::comment.comment': ApiCommentComment;
      'api::moderation-action.moderation-action': ApiModerationActionModerationAction;
      'api::notification.notification': ApiNotificationNotification;
      'api::post-flair-assignment.post-flair-assignment': ApiPostFlairAssignmentPostFlairAssignment;
      'api::post-flair.post-flair': ApiPostFlairPostFlair;
      'api::post.post': ApiPostPost;
      'api::private-message.private-message': ApiPrivateMessagePrivateMessage;
      'api::report.report': ApiReportReport;
      'api::saved-item.saved-item': ApiSavedItemSavedItem;
      'api::subrhetic-emoji-reaction.subrhetic-emoji-reaction': ApiSubrheticEmojiReactionSubrheticEmojiReaction;
      'api::subrhetic-emoji.subrhetic-emoji': ApiSubrheticEmojiSubrheticEmoji;
      'api::subrhetic-rule.subrhetic-rule': ApiSubrheticRuleSubrheticRule;
      'api::subrhetic-topic.subrhetic-topic': ApiSubrheticTopicSubrheticTopic;
      'api::subrhetic.subrhetic': ApiSubrheticSubrhetic;
      'api::topic.topic': ApiTopicTopic;
      'api::user-activity-log.user-activity-log': ApiUserActivityLogUserActivityLog;
      'api::user-block.user-block': ApiUserBlockUserBlock;
      'api::user-flair-assignment.user-flair-assignment': ApiUserFlairAssignmentUserFlairAssignment;
      'api::user-flair.user-flair': ApiUserFlairUserFlair;
      'api::user-online-status.user-online-status': ApiUserOnlineStatusUserOnlineStatus;
      'api::user-preference.user-preference': ApiUserPreferenceUserPreference;
      'api::vote.vote': ApiVoteVote;
      'plugin::content-releases.release': PluginContentReleasesRelease;
      'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::review-workflows.workflow': PluginReviewWorkflowsWorkflow;
      'plugin::review-workflows.workflow-stage': PluginReviewWorkflowsWorkflowStage;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
    }
  }
}
