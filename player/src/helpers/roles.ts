interface Roles {
  User: Array<string>;
  Admin: Array<string>;
  SuperAdmin: Array<string>;
}

const USER_URL: Array<string> = [
  '/api/v1/artists',
  '/api/v1/artists/add',
  '/api/v1/artists/delete',
  '/api/v1/artists/edit',
];
const ADMIN_URL: Array<string> = [
  ...USER_URL,
  '/api/v1/something'
];
const SUPER_ADMIN_URL: Array<string> = [...ADMIN_URL];

const roles: Roles = {
  User: USER_URL,
  Admin: ADMIN_URL,
  SuperAdmin: SUPER_ADMIN_URL,
};

export default roles;
