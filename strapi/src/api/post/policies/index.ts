import isAuthorPolicy from './is-author';
import isSubModeratorPolicy from './is-sub-moderator';
import deletePermissionPolicy from './delete-permission';

export default {
  'is-author': isAuthorPolicy,
  'is-sub-moderator': isSubModeratorPolicy,
  'delete-permission': deletePermissionPolicy,
};