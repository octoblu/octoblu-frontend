# Group API

## 1. Background
Groups in octoblu allow users to manage access to their devices. A user can have 2 type of Groups associated with their
 octoblu account :

 The Group model has the following properties

 * _Operators_ Group - A user can only have 1 operators group. The operators group is a collection of people that the
  user intends to share devices with. It is more like a group of contacts and it should not have any devices or permissions

 * _Default_ Groups -  A user can have multiple default Groups. Users can add remove members, set Group Permissions and

### Group Model Properties
* name
* uuid
* type
* permissions
* members
* devices

## 2. Permissions
1. Discover
2. Configure
3. Message

## 3. Rest Endpoints
1. /api/groups - _GET_    - Get all groups for the current user
2. /api/groups - _PUT_   Update an existing group
3. /api/groups - _POST_   Add a new group
4. /api/groups/:uuid -  _GET_
5. /api/groups/:uuid - _DELETE_

### 3.1 Requred Header Fields
* ob_skynetuuid
* ob_skynettoken




