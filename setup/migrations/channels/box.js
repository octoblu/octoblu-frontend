var record = {
  "application" : {
    "base" : "https://api.box.com/2.0",
    "resources" : [
      {
        "httpMethod" : "GET",
        "path" : "/folders/{folder id}/items",
        "displayName" : "/folders/{folder id}/items",
        "category" : "folders",
        "doc" : {
          "t" : "Retrieves the files and/or folders contained within this folder without any other metadata about the folder. Any attribute in the full files or folders objects can be passed in with the fields parameter to get specific attributes, and only those specific attributes back; otherwise, the mini format is returned for each item by default. Multiple attributes can be passed in separated by commas e.g. fields=name,created_at. Paginated results can be retrieved using the limit and offset parameters.An collection of items contained in the folder is returned. An error is thrown if the folder does not exist, or if any of the parameters are invalid.",
          "doc" : ""
        },
        "params" : [
          {
            "name" : "fields",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "  Attribute(s) to include in the response  "
            }
          },
          {
            "name" : "limit",
            "type" : "integer (default=100, max=1000)",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "  The number of items to return  "
            }
          },
          {
            "name" : "offset",
            "type" : "integer (default=0)",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "  The item at which to begin the response  "
            }
          }
        ]
      },
      {
        "httpMethod" : "POST",
        "path" : "/folders",
        "displayName" : "/folders",
        "category" : "folders",
        "doc" : {
          "t" : "Used to create a new empty folder. The new folder will be created inside of the specified parent folder  A full folder object is returned if the parent folder ID is valid and if no name collisions occur.",
          "doc" : ""
        },
        "params" : [
          {
            "name" : "name",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The desired name for the folder"
            }
          },
          {
            "name" : "parent",
            "type" : "object",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The parent folder"
            }
          },
          {
            "name" : "id",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The ID of the parent folder"
            }
          }
        ]
      },
      {
        "httpMethod" : "GET",
        "path" : "/folders/{folder id}",
        "displayName" : "/folders/{folder id}",
        "category" : "folders",
        "doc" : {
          "t" : "Retrieves the full metadata about a folder, including information about when it was last updated as well as the files and folders contained in it. The root folder of a Box account is always represented by the id “0″.A full file object is returned, including the most current information available about it. An error is thrown if the folder does not exist or if the user does not have access to it.",
          "doc" : ""
        },
        "params" : [
          {
            "name" : "{folder id}",
            "type" : "",
            "required" : true,
            "style" : "url",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : ""
            }
          }
        ]
      },
      {
        "httpMethod" : "PUT",
        "path" : "/folders/{folder id}",
        "displayName" : "/folders/{folder id}",
        "category" : "folders",
        "doc" : {
          "t" : "Used to update information about the folder. To move a folder, update the ID of its parent. To enable an email address that can be used to upload files to this folder, update the folder_upload_email attribute. An optional If-Match header can be included to ensure that client only updates the folder if it knows about the latest version. The updated folder is returned if the name is valid. Errors generally occur only if there is a name collision.",
          "doc" : ""
        },
        "params" : [
          {
            "name" : "If-Match",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "This is in the ‘etag’ field of the folder object."
            }
          },
          {
            "name" : "name",
            "type" : "",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The name of the folder.\nType: string"
            }
          },
          {
            "name" : "description",
            "type" : "",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The description of the folder.\nType: string"
            }
          },
          {
            "name" : "parent",
            "type" : "object",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The parent folder of this file."
            }
          },
          {
            "name" : "id",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The ID of the parent folder."
            }
          },
          {
            "name" : "shared_link",
            "type" : "object",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "An object representing this item’s shared link and associated permissions."
            }
          },
          {
            "name" : "access",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The level of access required for this shared link. Can be open, company, collaborators."
            }
          },
          {
            "name" : "unshared_at",
            "type" : "timestamp",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The day that this link should be disabled at. Timestamps are rounded off to the given day."
            }
          },
          {
            "name" : "permissions",
            "type" : "object",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The set of permissions that apply to this link."
            }
          },
          {
            "name" : "permissions.can_download",
            "type" : "boolean",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "Whether this link allows downloads."
            }
          },
          {
            "name" : "permissions.can_preview",
            "type" : "boolean",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "Whether this link allows previews."
            }
          },
          {
            "name" : "folder_upload_email",
            "type" : "object",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The email-to-upload address for this folder."
            }
          },
          {
            "name" : "access",
            "type" : "object",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "Can be open or collaborators."
            }
          },
          {
            "name" : "owned_by",
            "type" : "object",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The user who owns the folder. Only used when moving a collaborated folder that you are not the owner of to a folder you are the owner of. Not a substitute for changing folder owners, please reference collaborations to accomplish folder ownership changes."
            }
          },
          {
            "name" : "id",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The ID of the user, should be your own user ID."
            }
          },
          {
            "name" : "sync_state",
            "type" : "",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "Whether Box Sync clients will sync this folder. Values of synced or not_synced can be sent, while partially_synced may also be returned.\nType: string"
            }
          },
          {
            "name" : "tags",
            "type" : "",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "All tags attached to this folder. To add/remove a tag to/from a folder, you can first get the folder’s current tags (be sure to specify ?fields=tags, since the tags field is not returned by default); then modify the list as required; and finally, set the folder’s entire list of tags.\nType: array of strings"
            }
          }
        ]
      },
      {
        "httpMethod" : "DELETE",
        "path" : "/folders/{folder id}",
        "displayName" : "/folders/{folder id}",
        "category" : "folders",
        "doc" : {
          "t" : "Used to delete a folder. A recursive parameter must be included in order to delete folders that have items inside of them. An optional If-Match header can be included to ensure that client only deletes the folder if it knows about the latest version.An empty 204 response will be returned upon successful deletion. An error is thrown if the folder is not empty and the ‘recursive’ parameter is not included.",
          "doc" : ""
        },
        "params" : [
          {
            "name" : "If-Match",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "This is in the ‘etag’ field of the folder object."
            }
          },
          {
            "name" : "recursive",
            "type" : "boolean",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "Whether to delete this folder if it has items inside of it"
            }
          }
        ]
      },
      {
        "httpMethod" : "POST",
        "path" : "/folders/{folder id}/copy",
        "displayName" : "/folders/{folder id}/copy",
        "category" : "folders",
        "doc" : {
          "t" : "Used to create a copy of a folder in another folder. The original version of the folder will not be altered.A full folder object is returned if the ID is valid and if the update is successful. Errors can be thrown if the destination folder is invalid or if a file-name collision occurs. A 409 will be returned if the intended destination folder is the same, as this will cause a name collision.",
          "doc" : ""
        },
        "params" : [
          {
            "name" : "parentrequired",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "Object representing the new location of the folder"
            }
          },
          {
            "name" : "idrequired",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The ID of the destination folder"
            }
          },
          {
            "name" : "name",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "An optional new name for the folder"
            }
          }
        ]
      },
      {
        "httpMethod" : "PUT",
        "path" : "/folders/{folder id}",
        "displayName" : "/folders/{folder id}",
        "category" : "folders",
        "doc" : {
          "t" : "Used to create a shared link for this particular folder. Please see here for more information on the permissions available for shared links. In order to disable a shared link, send this same type of PUT request with the value of shared_link set to null, i.e. {\"shared_link\": null} A full folder object containing the updated shared link is returned if the ID is valid and if the update is successful.",
          "doc" : ""
        },
        "params" : [ ]
      },
      {
        "httpMethod" : "GET",
        "path" : "/folders/{id}/collaborations",
        "displayName" : "/folders/{id}/collaborations",
        "category" : "folders",
        "doc" : {
          "t" : "Use this to get a list of all the collaborations on a folder i.e. all of the users that have access to that folder.A collection of collaboration objects are returned. If there are no collaborations on this folder, an empty collection will be returned.",
          "doc" : ""
        },
        "params" : [ ]
      },
      {
        "httpMethod" : "GET",
        "path" : "/folders/trash/items",
        "displayName" : "/folders/trash/items",
        "category" : "folders",
        "doc" : {
          "t" : "Retrieves the files and/or folders that have been moved to the trash. Any attribute in the full files or folders objects can be passed in with the fields parameter to get specific attributes, and only those specific attributes back; otherwise, the mini format is returned for each item by default. Multiple attributes can be passed in separated by commas e.g. fields=name,created_at. Paginated results can be retrieved using the limit and offset parameters.An collection of items contained in the trash is returned. An error is thrown if any of the parameters are invalid.",
          "doc" : ""
        },
        "params" : [
          {
            "name" : "fields",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "  Attribute(s) to include in the response  "
            }
          },
          {
            "name" : "limit",
            "type" : "integer (default=100, max=1000)",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "  The number of items to return  "
            }
          },
          {
            "name" : "offset",
            "type" : "integer (default=0)",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "  The item at which to begin the response  "
            }
          }
        ]
      },
      {
        "httpMethod" : "GET",
        "path" : "/folders/{folder id}/trash",
        "displayName" : "/folders/{folder id}/trash",
        "category" : "folders",
        "doc" : {
          "t" : "Retrieves an item that has been moved to the trash.The full item will be returned, including information about when the it was moved to the trash.",
          "doc" : ""
        },
        "params" : [ ]
      },
      {
        "httpMethod" : "DELETE",
        "path" : "/folders/{folder id}/trash",
        "displayName" : "/folders/{folder id}/trash",
        "category" : "folders",
        "doc" : {
          "t" : "Permanently deletes an item that is in the trash. The item will no longer exist in Box. This action cannot be undone.An empty 204 No Content response will be returned upon successful deletion",
          "doc" : ""
        },
        "params" : [ ]
      },
      {
        "httpMethod" : "POST",
        "path" : "/folders/{folder id}",
        "displayName" : "/folders/{folder id}",
        "category" : "folders",
        "doc" : {
          "t" : "Restores an item that has been moved to the trash. Default behavior is to restore the item to the folder it was in before it was moved to the trash. If that parent folder no longer exists or if there is now an item with the same name in that parent folder, the new parent folder and/or new name will need to be included in the request.The full item will be returned with a 201 Created status. By default it is restored to the parent folder it was in before it was trashed.",
          "doc" : ""
        },
        "params" : [ ]
      },
      {
        "httpMethod" : "GET",
        "path" : "/files/{file id}",
        "displayName" : "/files/{file id}",
        "category" : "files",
        "doc" : {
          "t" : "Used to retrieve the metadata about a file.A full file object is returned if the ID is valid and if the user has access to the file.",
          "doc" : ""
        },
        "params" : [
          {
            "name" : "None are taken",
            "type" : "",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : ""
            }
          }
        ]
      },
      {
        "httpMethod" : "PUT",
        "path" : "/files/{file id}",
        "displayName" : "/files/{file id}",
        "category" : "files",
        "doc" : {
          "t" : "Used to update individual or multiple fields in the file object, including renaming the file, changing it’s description, and creating a shared link for the file. To move a file, change the ID of its parent folder. An optional If-Match header can be included to ensure that client only updates the file if it knows about the latest version. A full file object is returned if the ID is valid and if the update is successful.",
          "doc" : ""
        },
        "params" : [
          {
            "name" : "If-Match",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "This is in the ‘etag’ field of the file object."
            }
          },
          {
            "name" : "name",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The new name for the file."
            }
          },
          {
            "name" : "description",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The new description for the file."
            }
          },
          {
            "name" : "parent",
            "type" : "object",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The parent folder of this file."
            }
          },
          {
            "name" : "id",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The ID of the parent folder."
            }
          },
          {
            "name" : "shared_link",
            "type" : "object",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "An object representing this item’s shared link and associated permissions."
            }
          },
          {
            "name" : "access",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The level of access required for this shared link. Can be open, company, collaborators."
            }
          },
          {
            "name" : "unshared_at",
            "type" : "timestamp",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The day that this link should be disabled at. Timestamps are rounded off to the given day."
            }
          },
          {
            "name" : "permissions",
            "type" : "object",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The set of permissions that apply to this link."
            }
          },
          {
            "name" : "permissions.download",
            "type" : "boolean",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "Whether this link allows downloads."
            }
          },
          {
            "name" : "permissions.preview",
            "type" : "boolean",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "Whether this link allows previews."
            }
          },
          {
            "name" : "tags",
            "type" : "",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "All tags attached to this file. To add/remove a tag to/from a file, you can first get the file’s current tags (be sure to specify ?fields=tags, since the tags field is not returned by default); then modify the list as required; and finally, set the file’s entire list of tags.\nType: array of strings"
            }
          }
        ]
      },
      {
        "httpMethod" : "GET",
        "path" : "/files/{file id}/content",
        "displayName" : "/files/{file id}/content",
        "category" : "files",
        "doc" : {
          "t" : "Retrieves the actual data of the file. An optional version parameter can be set to download a previous version of the file.If the file is available to be downloaded, the response will be a 302 Found to a URL at dl.boxcloud.com. The dl.boxcloud.com URL is not persistent. Clients will need to follow the redirect in order to actually download the file. The raw data of the file is returned unless the file ID is invalid or the user does not have access to it.If the file is not ready to be downloaded (i.e. in the case where the file was uploaded immediately before the download request), a response with an HTTP status of 202 Accepted will be returned with a Retry-After header indicating the time in seconds after which the file will be available for the client to download.",
          "doc" : ""
        },
        "params" : [
          {
            "name" : "version",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The ID specific version of this file to download."
            }
          }
        ]
      },
      {
        "httpMethod" : "POST",
        "path" : "/https://upload.box.com/api/2.0/files/content",
        "displayName" : "https://upload.box.com/api/2.0/files/content",
        "category" : "files",
        "doc" : {
          "t" : "Use the Uploads API to allow users to add a new file. The user can then upload a file by specifying the destination folder for the file.  If the user provides a file name that  already exists in the destination folder, the user will receive an error.  \nA different Box URL, https://upload.box.com/api/2.0/files/content, handles uploads. This API uses the multipart post method to complete all upload tasks. You can optionally specify a Content-MD5 header with the SHA1 hash of the file to ensure that the file is not corrupted in transit.A full file object is returned inside of a collection if the ID is valid and if the update is successful. An error is thrown when a name collision occurs.",
          "doc" : ""
        },
        "params" : [
          {
            "name" : "  Content-MD5",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "  The SHA1 hash of the file  "
            }
          },
          {
            "name" : "filenamerequired",
            "type" : "file",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The name of the file to be uploaded"
            }
          },
          {
            "name" : "parent_idrequired",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The ID of folder where this file should be uploaded "
            }
          },
          {
            "name" : "content_created_at",
            "type" : "timestamp",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The time this file was created on the user’s machine. See here for more details. "
            }
          },
          {
            "name" : "content_modified_at",
            "type" : "timestamp",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The time this file was last modified on the user’s machine. See here for more details. "
            }
          }
        ]
      },
      {
        "httpMethod" : "DELETE",
        "path" : "/files/{file id}",
        "displayName" : "/files/{file id}",
        "category" : "files",
        "doc" : {
          "t" : "Discards a file to the trash. The etag of the file can be included as an ‘If-Match’ header to prevent race conditions.An empty 204 response is sent to confirm deletion of the file. If the If-Match header is sent and fails, a ’412 Precondition Failed’ error is returned.",
          "doc" : ""
        },
        "params" : [
          {
            "name" : "\tIf-Match     \t ",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : " The etag of the file. This is in the ‘etag’ field of the file object."
            }
          }
        ]
      },
      {
        "httpMethod" : "POST",
        "path" : "/https://upload.box.com/api/2.0/files/{file id}/content",
        "displayName" : "https://upload.box.com/api/2.0/files/{file id}/content",
        "category" : "files",
        "doc" : {
          "t" : "Note that uploads are handled through https://upload.box.com. This method is used to upload a new version of an existing file in a user’s account. Similar to regular file uploads, these are performed as multipart form uploads An optional If-Match header can be included to ensure that client only overwrites the file if it knows about the latest version. The filename on Box will remain the same as the previous version. To update the file’s name, use PUT /files/{id}The updated file object will be returned inside of a file collection. Errors may occur due to bad filenames and invalid file IDs.",
          "doc" : ""
        },
        "params" : [
          {
            "name" : "If-Match",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "This is in the ‘etag’ field of the file object."
            }
          },
          {
            "name" : "name",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The name of the file to be uploaded"
            }
          },
          {
            "name" : "content_modified_at",
            "type" : "timestamp",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The time this file was last modified on the user’s machine. See here for more details. "
            }
          }
        ]
      },
      {
        "httpMethod" : "GET",
        "path" : "/files/{file id}/versions",
        "displayName" : "/files/{file id}/versions",
        "category" : "files",
        "doc" : {
          "t" : "If there are previous versions of this file, this method can be used to retrieve metadata about the older versions.An array of version objects are returned. If there are no previous versions of this file, then an empty array will be returned.",
          "doc" : ""
        },
        "params" : [
          {
            "name" : "None are taken",
            "type" : "",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : ""
            }
          }
        ]
      },
      {
        "httpMethod" : "POST",
        "path" : "/files/{file id}/versions/current",
        "displayName" : "/files/{file id}/versions/current",
        "category" : "files",
        "doc" : {
          "t" : "If there are previous versions of this file, this method can be used to promote one of the older versions to the top of the stack.  This actually mints a copy of the old version and puts it on the top of the versions stack.  The file will have the exact same contents, the same SHA1/etag, and the same name as the original.  Other properties such as comments do not get updated to their former values.The newly promoted file_version object is returned, along with a ’201 Created’ status",
          "doc" : ""
        },
        "params" : [
          {
            "name" : "typerequired",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "Must be ‘file_version’ for this request"
            }
          },
          {
            "name" : "idrequired",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The ID of the file_version that you want to make current"
            }
          }
        ]
      },
      {
        "httpMethod" : "DELETE",
        "path" : "/files/{file id}/versions/{version_id}",
        "displayName" : "/files/{file id}/versions/{version_id}",
        "category" : "files",
        "doc" : {
          "t" : "Discards a specific file version to the trash. An empty 204 response is sent to confirm deletion of the file. If the If-Match header is sent and fails, a ’412 Precondition Failed’ error is returned.",
          "doc" : ""
        },
        "params" : [
          {
            "name" : "\tIf-Match     \t ",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : " The etag of the file. This is in the ‘etag’ field of the file object."
            }
          }
        ]
      },
      {
        "httpMethod" : "POST",
        "path" : "/files/{file id}/copy",
        "displayName" : "/files/{file id}/copy",
        "category" : "files",
        "doc" : {
          "t" : "Used to create a copy of a file in another folder. The original version of the file will not be altered.A full file object is returned if the ID is valid and if the update is successful. Errors can be thrown if the destination folder is invalid or if a file-name collision occurs. A 409 will be returned if the intended destination folder is the same, as this will cause a name collision.",
          "doc" : ""
        },
        "params" : [
          {
            "name" : "parentrequired",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "Folder object representing the new location of the file"
            }
          },
          {
            "name" : "idrequired",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The ID of the destination folder"
            }
          },
          {
            "name" : "name",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "An optional new name for the file"
            }
          }
        ]
      },
      {
        "httpMethod" : "GET",
        "path" : "/files/{file id}/thumbnail.extension",
        "displayName" : "/files/{file id}/thumbnail.extension",
        "category" : "files",
        "doc" : {
          "t" : "Retrieves a thumbnail, or smaller image representation, of this file. Sizes of 32x32,  64x64, 128x128, and 256x256 can be returned. Currently thumbnails are only available in .png format and will only be generated for image file formats.There are three success cases that your application needs to account for:If the thumbnail isn’t available yet, a 202 Accepted HTTP status will be returned, including a Location header pointing to a placeholder graphic that can be used until the thumbnail is returned. A Retry-After header will also be returned, indicating the time in seconds after which the thumbnail will be available. Your application should only attempt to get the thumbnail again after Retry-After time.If Box can’t generate a thumbnail for this file type, a 302 Found response will be returned, redirecting to a placeholder graphic in the requested size for this particular file type, e.g. this for a CSV file).If the thumbnail is available, a 200 OK response will be returned with the contents of the thumbnail in the bodyIf Box is unable to generate a thumbnail for this particular file, a 404 Not Found response will be returned with a code of preview_cannot_be_generated. If there are any bad parameters sent in, a standard 400 Bad Request will be returned.",
          "doc" : ""
        },
        "params" : [ ]
      },
      {
        "httpMethod" : "PUT",
        "path" : "/files/{file id}",
        "displayName" : "/files/{file id}",
        "category" : "files",
        "doc" : {
          "t" : "Used to create a shared link for this particular file. Please see here for more information on the permissions available for shared links. In order to get default shared link status, set it to an empty access level, i.e. {\"shared_link\": {}}. In order to disable a shared link, send this same type of PUT request with the value of shared_link set to null, i.e. {\"shared_link\": null} A full file object containing the updated shared link is returned if the ID is valid and if the update is successful.",
          "doc" : ""
        },
        "params" : [ ]
      },
      {
        "httpMethod" : "GET",
        "path" : "/files/{file id}/trash",
        "displayName" : "/files/{file id}/trash",
        "category" : "files",
        "doc" : {
          "t" : "Retrieves an item that has been moved to the trash.The full item will be returned, including information about when the it was moved to the trash.",
          "doc" : ""
        },
        "params" : [ ]
      },
      {
        "httpMethod" : "DELETE",
        "path" : "/files/{file id}/trash",
        "displayName" : "/files/{file id}/trash",
        "category" : "files",
        "doc" : {
          "t" : "Permanently deletes an item that is in the trash. The item will no longer exist in Box. This action cannot be undone.An empty 204 No Content response will be returned upon successful deletion",
          "doc" : ""
        },
        "params" : [ ]
      },
      {
        "httpMethod" : "POST",
        "path" : "/files/{file id}",
        "displayName" : "/files/{file id}",
        "category" : "files",
        "doc" : {
          "t" : "Restores an item that has been moved to the trash. Default behavior is to restore the item to the folder it was in before it was moved to the trash. If that parent folder no longer exists or if there is now an item with the same name in that parent folder, the new parent folder and/or new name will need to be included in the request.The full item will be returned with a 201 Created status. By default it is restored to the parent folder it was in before it was trashed.",
          "doc" : ""
        },
        "params" : [ ]
      },
      {
        "httpMethod" : "GET",
        "path" : "/files/{file id}/comments",
        "displayName" : "/files/{file id}/comments",
        "category" : "files",
        "doc" : {
          "t" : "Retrieves the comments on a particular file, if any exist.A collection of comment objects are returned. If there are no comments on the file, an empty comments array is returned.",
          "doc" : ""
        },
        "params" : [
          {
            "name" : "None are taken",
            "type" : "",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : ""
            }
          }
        ]
      },
      {
        "httpMethod" : "GET",
        "path" : "/files/{id}/tasks",
        "displayName" : "/files/{id}/tasks",
        "category" : "files",
        "doc" : {
          "t" : "Retrieves all of the tasks for given file.A collection of mini task objects is returned. If there are no tasks, an empty collection will be returned.",
          "doc" : ""
        },
        "params" : [ ]
      },
      {
        "httpMethod" : "POST",
        "path" : "/comments",
        "displayName" : "/comments",
        "category" : "comments",
        "doc" : {
          "t" : "Used to add a comment by the user to a specific file or comment (i.e. as a reply comment).The new comment object is returned. Errors may occur if the item id is invalid, the item type is invalid/unsupported, or if the user does not have access to the item being commented on.",
          "doc" : ""
        },
        "params" : [ ]
      },
      {
        "httpMethod" : "PUT",
        "path" : "/comments/{comment id}",
        "displayName" : "/comments/{comment id}",
        "category" : "comments",
        "doc" : {
          "t" : "Used to update the message of the comment.The full updated comment object is returned if the ID is valid and if the user has access to the comment.",
          "doc" : ""
        },
        "params" : [
          {
            "name" : "messagerequired",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The desired text for the comment message"
            }
          }
        ]
      },
      {
        "httpMethod" : "GET",
        "path" : "/comments/{comment id}",
        "displayName" : "/comments/{comment id}",
        "category" : "comments",
        "doc" : {
          "t" : "Used to retrieve the message and metadata about a specific comment. Information about the user who created the comment is also included.A full comment object is returned is the ID is valid and if the user has access to the comment.",
          "doc" : ""
        },
        "params" : [
          {
            "name" : "None are accepted",
            "type" : "",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : ""
            }
          }
        ]
      },
      {
        "httpMethod" : "DELETE/comments/{comment",
        "path" : "/id}",
        "displayName" : "id}",
        "category" : "comments",
        "doc" : {
          "t" : "Permanently deletes a comment.An empty 204 response is returned to confirm deletion of the comment. Errors can be thrown if the ID is invalid or if the user is not authorized to delete this particular comment.",
          "doc" : ""
        },
        "params" : [
          {
            "name" : "None are taken",
            "type" : "",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : ""
            }
          }
        ]
      },
      {
        "httpMethod" : "POST",
        "path" : "/collaborations",
        "displayName" : "/collaborations",
        "category" : "collaborations",
        "doc" : {
          "t" : "Used to add a collaboration for a single user to a folder. Descriptions of the various roles can be found here. Either an email address or a user ID can be used to create the collaboration. The new collaboration object is returned. Errors may occur if the IDs are invalid or if the user does not have permissions to create a collaboration.",
          "doc" : ""
        },
        "params" : [
          {
            "name" : "notify",
            "type" : "boolean",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "Determines if the user should receive email notification of the collaboration."
            }
          },
          {
            "name" : "item",
            "type" : "folder object",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The item to add the collaboration on"
            }
          },
          {
            "name" : "id",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The ID of the item to add the collaboration on"
            }
          },
          {
            "name" : "type",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "Must be folder"
            }
          },
          {
            "name" : "accessible_by",
            "type" : "object",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The user or group who this collaboration applies to"
            }
          },
          {
            "name" : "id",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The ID of this user or group"
            }
          },
          {
            "name" : "type",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "Type of collaborator, must be either user or group"
            }
          },
          {
            "name" : "login",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "An email address (does not need to be a Box user). Omit if this is a group."
            }
          },
          {
            "name" : "role",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The access level of this collaboration (see above for roles)"
            }
          }
        ]
      },
      {
        "httpMethod" : "PUT",
        "path" : "/collaborations/{id}",
        "displayName" : "/collaborations/{id}",
        "category" : "collaborations",
        "doc" : {
          "t" : "Used to edit an existing collaboration. Descriptions of the various roles can be found here.The updated collaboration object is returned. Errors may occur if the IDs are invalid or if the user does not have permissions to edit the collaboration.",
          "doc" : ""
        },
        "params" : [
          {
            "name" : "role",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The access level of this collaboration (see above for roles)"
            }
          },
          {
            "name" : "status",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "Whether this collaboration has been accepted"
            }
          }
        ]
      },
      {
        "httpMethod" : "DELETE",
        "path" : "/collaborations/{id}",
        "displayName" : "/collaborations/{id}",
        "category" : "collaborations",
        "doc" : {
          "t" : "Used to delete a single collaboration.A blank 204 response is returned if the ID is valid, and the user has permissions to remove the collaboration.",
          "doc" : ""
        },
        "params" : [
          {
            "name" : "None are taken",
            "type" : "",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : ""
            }
          }
        ]
      },
      {
        "httpMethod" : "GET",
        "path" : "/collaborations/{id}",
        "displayName" : "/collaborations/{id}",
        "category" : "collaborations",
        "doc" : {
          "t" : "Used to get information about a single collaboration. All collaborations for a single folder can be retrieved through GET /folders/{id}/collaborations. A complete list of the user’s pending collaborations can also be retrieved.The collaboration object is returned. Errors may occur if the IDs are invalid or if the user does not have permissions to see the collaboration.",
          "doc" : ""
        },
        "params" : [
          {
            "name" : "status",
            "type" : "",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "  Can only be pending"
            }
          }
        ]
      },
      {
        "httpMethod" : "GET",
        "path" : "/collaborations?status=pending",
        "displayName" : "/collaborations?status=pending",
        "category" : "collaborations",
        "doc" : {
          "t" : "Used to retrieve all pending collaboration invites for this user.A collection of pending collaboration objects are returned. If the user has no pending collaborations, the collection will be empty.",
          "doc" : ""
        },
        "params" : [
          {
            "name" : "statusrequired",
            "type" : "",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "  Must be pending"
            }
          }
        ]
      },
      {
        "httpMethod" : "GET",
        "path" : "/events?stream_position=0",
        "displayName" : "/events?stream_position=0",
        "category" : "events",
        "doc" : {
          "t" : "Use this to get events for a given user. A chunk of event objects is returned for the user based on the parameters passed in. Parameters indicating how many chunks are left as well as the next stream_position are also returned.\nA collection of events is returned. See the above table for descriptions of the event types.",
          "doc" : ""
        },
        "params" : [
          {
            "name" : "stream_position",
            "type" : "string (default=0)",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The location in the event stream at which you want to start receiving events. Can specify special case ‘now’ to get 0 events and the latest stream position for initialization."
            }
          },
          {
            "name" : "stream_type",
            "type" : "• all: returns everything\n• changes: returns tree changes\n• sync: returns tree changes only for sync folders string (default=all):",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "Limits the type of events returned"
            }
          },
          {
            "name" : "limit",
            "type" : "integer (default=100 max=10,000)",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "Limits the number of events returned"
            }
          }
        ]
      },
      {
        "httpMethod" : "OPTIONS",
        "path" : "/events",
        "displayName" : "/events",
        "category" : "events",
        "doc" : {
          "t" : "To get real-time notification of activity in a Box account, use the long poll feature of the /events API. To do so, first call the /events API with an OPTIONS call to retrieve the long poll URL to use. Next, make a GET request to the provided URL to begin listening for events. If an event occurs within an account you are monitoring, you will receive a response with the value new_change. It’s important to note that this response will not come with any other details, but should serve as a prompt to take further action such as calling the /events endpoint with your last known stream_position. After sending this response, the server will close the connection and you will need to repeat the long poll process to begin listening for events again.If no events occur for a period of time after you make the GET request to the long poll URL, you will receive a response with the value reconnect. When you receive this response, you’ll make another OPTIONS call to the /events endpoint and repeat the long poll process.If you receive no events in retry_timeout seconds, you should make another GET request to the real time server (i.e. URL in the response). This might be necessary in case you do not receive the reconnect message in the face of network errors.If you receive max_retries error when making GET requests to the real time server, you should make another OPTIONS request.For a better understanding of the long poll process, please review this short tutorial.",
          "doc" : ""
        },
        "params" : [ ]
      },
      {
        "httpMethod" : "GET",
        "path" : "/events?stream_type=admin_logs",
        "displayName" : "/events?stream_type=admin_logs",
        "category" : "events",
        "doc" : {
          "t" : "Retrieves events for all users in an enterprise. Upper and lower bounds as well as filters can be applied to the results. A list of valid values for event_type can be found here.",
          "doc" : ""
        },
        "params" : [
          {
            "name" : "stream_type",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "Must be admin_logs"
            }
          },
          {
            "name" : "limit",
            "type" : "integer (default=100 max=500)",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "Limits the number of events returned"
            }
          },
          {
            "name" : "stream_position",
            "type" : "string (default=0)",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The starting position for fetching the events. This is used in combination with the limit to determine which events to return to the caller. Use the results from the next_stream_position of your last call to get the next set of events."
            }
          },
          {
            "name" : "event_type",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "A comma-separated list of events to filter by"
            }
          },
          {
            "name" : "created_after",
            "type" : "timestamp",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "A lower bound on the timestamp of the events returned"
            }
          },
          {
            "name" : "created_before",
            "type" : "timestamp",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "An upper bound on the timestamp of the events returned"
            }
          }
        ]
      },
      {
        "httpMethod" : "GET",
        "path" : "/search?query=SEARCH_QUERY",
        "displayName" : "/search?query=SEARCH_QUERY",
        "category" : "search",
        "doc" : {
          "t" : "The search endpoint provides a simple way of finding items that are accessible in a given user’s Box account.A collection of search results is returned. If there are no matching search results, the entries array will be empty.",
          "doc" : ""
        },
        "params" : [ ]
      },
      {
        "httpMethod" : "GET",
        "path" : "/users/me",
        "displayName" : "/users/me",
        "category" : "users",
        "doc" : {
          "t" : "Retrieves information about the user who is currently logged in i.e. the user for whom this auth token was generated.Returns a single complete user object. An error is returned if a valid auth token is not included in the API request.",
          "doc" : ""
        },
        "params" : [ ]
      },
      {
        "httpMethod" : "GET",
        "path" : "/users",
        "displayName" : "/users",
        "category" : "users",
        "doc" : {
          "t" : "Returns a list of all users for the Enterprise along with their user_id, public_name, and login.Returns the list of all users for the Enterprise with their user_id, public_name, and login if the user is an enterprise admin.",
          "doc" : ""
        },
        "params" : [
          {
            "name" : "   filter_term  ",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "   A string used to filter the results to only users starting with the filter_term in either the name or the login     "
            }
          },
          {
            "name" : "   limit  ",
            "type" : "integer (default=100, max=1000)",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "   The number of records to return.     "
            }
          },
          {
            "name" : "   offset  ",
            "type" : "integer (default=0)",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "   The record at which to start     "
            }
          }
        ]
      },
      {
        "httpMethod" : "POST",
        "path" : "/users",
        "displayName" : "/users",
        "category" : "users",
        "doc" : {
          "t" : "Used to provision a new user in an enterprise. This method only works for enterprise admins.Returns the full user object for the newly created user. Errors may be thrown when the fields are invalid or this API call is made from a non-admin account.",
          "doc" : ""
        },
        "params" : [
          {
            "name" : "   login   required  ",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "   The email address this user uses to login     "
            }
          },
          {
            "name" : "   name   required  ",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "   The name of this user     "
            }
          },
          {
            "name" : "   role  ",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "   This user’s enterprise role. Can be coadmin or user     "
            }
          },
          {
            "name" : "   language  ",
            "type" : "ISO 639-1 Language Code",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "   The language of this user     "
            }
          },
          {
            "name" : "   is_sync_enabled  ",
            "type" : "boolean",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "   Whether or not this user can use Box Sync     "
            }
          },
          {
            "name" : "   job_title  ",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "   The user’s job title     "
            }
          },
          {
            "name" : "   phone  ",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "   The user’s phone number     "
            }
          },
          {
            "name" : "   address  ",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "   The user’s address     "
            }
          },
          {
            "name" : "   space_amount  ",
            "type" : "float",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "   The user’s total available space amount in bytes     "
            }
          },
          {
            "name" : "   tracking_codes  ",
            "type" : "array",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "   An array of key/value pairs set by the user’s admin     "
            }
          },
          {
            "name" : "   can_see_managed_users  ",
            "type" : "boolean",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "   Whether this user can see other enterprise users in its contact list     "
            }
          },
          {
            "name" : "   status  ",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "   Can be active or inactive     "
            }
          },
          {
            "name" : "   is_exempt_from_device_limits  ",
            "type" : "boolean",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "   Whether to exempt this user from Enterprise device limits      "
            }
          },
          {
            "name" : "   is_exempt_from_login_verification  ",
            "type" : "boolean",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "   Whether or not this user must use two-factor authentication     "
            }
          }
        ]
      },
      {
        "httpMethod" : "PUT",
        "path" : "/users/{id}",
        "displayName" : "/users/{id}",
        "category" : "users",
        "doc" : {
          "t" : "Used to edit the settings and information about a user. This method only works for enterprise admins. To roll a user out of the enterprise (and convert them to a standalone free user), update the special enterprise attribute to be nullReturns the a full user object for the updated user. Errors may be thrown when the fields are invalid or this API call is made from a non-admin account.",
          "doc" : ""
        },
        "params" : [
          {
            "name" : "notify",
            "type" : "",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "Whether the user should receive an email when they are rolled out of an enterprise"
            }
          },
          {
            "name" : "enterprise",
            "type" : "",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "Setting this to null will roll the user out of the enterprise and make them a free user"
            }
          },
          {
            "name" : "name",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The name of this user"
            }
          },
          {
            "name" : "role",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "This user’s enterprise role. Can be coadmin or user"
            }
          },
          {
            "name" : "language",
            "type" : "ISO 639-1 Language Code",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The language of this user"
            }
          },
          {
            "name" : "is_sync_enabled",
            "type" : "boolean",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "Whether or not this user can use Box Sync"
            }
          },
          {
            "name" : "job_title",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The user’s job title"
            }
          },
          {
            "name" : "phone",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The user’s phone number"
            }
          },
          {
            "name" : "address",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The user’s address"
            }
          },
          {
            "name" : "space_amount",
            "type" : "float",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "The user’s total available space amount in byte. A value of -1 grants unlimited storage."
            }
          },
          {
            "name" : "tracking_codes",
            "type" : "array",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "An array of key/value pairs set by the user’s admin"
            }
          },
          {
            "name" : "can_see_managed_users",
            "type" : "boolean",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "Whether this user can see other enterprise users in its contact list"
            }
          },
          {
            "name" : "status",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "Can be active or inactive"
            }
          },
          {
            "name" : "is_exempt_from_device_limits",
            "type" : "boolean",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "Whether to exempt this user from Enterprise device limits"
            }
          },
          {
            "name" : "is_exempt_from_login_verification",
            "type" : "boolean",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "Whether or not this user must use two-factor authentication"
            }
          },
          {
            "name" : "is_password_reset_required",
            "type" : "boolean",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "Whether or not the user is required to reset password"
            }
          }
        ]
      },
      {
        "httpMethod" : "DELETE",
        "path" : "/users/{user id}",
        "displayName" : "/users/{user id}",
        "category" : "users",
        "doc" : {
          "t" : "Deletes a user in an enterprise account.An empty 204 response is sent to confirm deletion of the user. If the user still has files in their account and the ‘force’ parameter is not sent, an error is returned.",
          "doc" : ""
        },
        "params" : [
          {
            "name" : "   notify  ",
            "type" : "boolean",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "   Determines if the destination user should receive email notification of the transfer.     "
            }
          },
          {
            "name" : "   force  ",
            "type" : "boolean",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "   Whether or not the user should be deleted even if this user still own files.     "
            }
          }
        ]
      },
      {
        "httpMethod" : "PUT",
        "path" : "/users/{user_id}/folders/{folder_id}",
        "displayName" : "/users/{user_id}/folders/{folder_id}",
        "category" : "users",
        "doc" : {
          "t" : "Moves all of the owned content from within one user’s folder into a new folder in another user’s account.  You can move folders across users as long as the you have administrative permissions and the ‘source’ user owns the folders.  To move everything from the root folder, use “0″ which always represents the root folder of a Box account Returns the information for the newly created destination folder..  An error is thrown if you do not have the necessary permissions to move the folder",
          "doc" : ""
        },
        "params" : [
          {
            "name" : "   owned_by   required  ",
            "type" : "object",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "   The user who the folder will be transferred to     "
            }
          },
          {
            "name" : "  id  \trequired  ",
            "type" : "string",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "  \tThe ID of the user who the folder will be transferred to  \t  "
            }
          },
          {
            "name" : "  \tnotify  ",
            "type" : "boolean",
            "required" : false,
            "style" : "query",
            "curl" : "",
            "category" : "",
            "authentication" : {
              "required" : true
            },
            "doc" : {
              "t" : "  \tDetermines if the destination user should receive email notification of the transfer.  \t  "
            }
          }
        ]
      },
      {
        "httpMethod" : "GET",
        "path" : "/users/{user id}/email_aliases",
        "displayName" : "/users/{user id}/email_aliases",
        "category" : "users",
        "doc" : {
          "t" : "Retrieves all email aliases for this user. The collection of email aliases does not include the primary login for the user; use GET /users/USER_ID to retrieve the login email address.If the user_id is valid a collection of email aliases will be returned.",
          "doc" : ""
        },
        "params" : [ ]
      },
      {
        "httpMethod" : "POST",
        "path" : "/users/{user id}/email_aliases",
        "displayName" : "/users/{user id}/email_aliases",
        "category" : "users",
        "doc" : {
          "t" : "Adds a new email alias to the given user’s account.  Returns the newly created email_alias object. Errors will be thrown if the user_id is not valid or the particular user’s email alias cannot be modified.",
          "doc" : ""
        },
        "params" : [ ]
      },
      {
        "httpMethod" : "DELETE",
        "path" : "/users/{user id}/email_aliases/{email alias id}",
        "displayName" : "/users/{user id}/email_aliases/{email alias id}",
        "category" : "users",
        "doc" : {
          "t" : "Removes an email alias from a user.If the user has permission to remove this email alias, an empty 204 No Content response will be returned to confirm deletion.",
          "doc" : ""
        },
        "params" : [ ]
      },
      {
        "httpMethod" : "GET",
        "path" : "/groups",
        "displayName" : "/groups",
        "category" : "groups",
        "doc" : {
          "t" : "Retrieves all of the groups for given user.A collection of mini group objects is returned. If there are no groups, an empty collection will be returned.",
          "doc" : ""
        },
        "params" : []
      },
      {
        "httpMethod" : "POST",
        "path" : "/groups",
        "displayName" : "/groups",
        "category" : "groups",
        "doc" : {
          "t" : "Used to create a group.A new group object will be returned upon success.",
          "doc" : ""
        },
        "params" : [ ]
      },
      {
        "httpMethod" : "GET",
        "path" : "/groups/{id}/memberships",
        "displayName" : "/groups/{id}/memberships",
        "category" : "groups",
        "doc" : {
          "t" : "Retrieves all of the members for a given group.A collection of group membership objects will be returned upon success.",
          "doc" : ""
        },
        "params" : [ ]
      },
      {
        "httpMethod" : "GET",
        "path" : "/users/{id}/memberships",
        "displayName" : "/users/{id}/memberships",
        "category" : "groups",
        "doc" : {
          "t" : "Retrieves all of the group memberships for a given enterprise.  Note this is only available to group admins.  To get a users groups use the users/me/memberships endpoint.A collection of group membership objects will be returned upon success.",
          "doc" : ""
        },
        "params" : [ ]
      },
      {
        "httpMethod" : "GET",
        "path" : "/group_memberships/{id}",
        "displayName" : "/group_memberships/{id}",
        "category" : "groups",
        "doc" : {
          "t" : "Fetches a specific group membership entry.The specified group_membership object will be returned upon success.",
          "doc" : ""
        },
        "params" : [ ]
      },
      {
        "httpMethod" : "POST",
        "path" : "/group_memberships",
        "displayName" : "/group_memberships",
        "category" : "groups",
        "doc" : {
          "t" : "Used to add a member to a Group.  A new group membership object will be returned upon success.",
          "doc" : ""
        },
        "params" : [ ]
      },
      {
        "httpMethod" : "PUT",
        "path" : "/group_memberships/{id}",
        "displayName" : "/group_memberships/{id}",
        "category" : "groups",
        "doc" : {
          "t" : "Used to update a group membership.A new group membership object will be returned upon success.",
          "doc" : ""
        },
        "params" : [ ]
      },
      {
        "httpMethod" : "DELETE",
        "path" : "/group_memberships/{id}",
        "displayName" : "/group_memberships/{id}",
        "category" : "groups",
        "doc" : {
          "t" : "Deletes a specific group membership.An empty 204 No Content response will be returned upon success.",
          "doc" : ""
        },
        "params" : [ ]
      },
      {
        "httpMethod" : "POST",
        "path" : "/tasks",
        "displayName" : "/tasks",
        "category" : "tasks",
        "doc" : {
          "t" : "Used to create a single task for single user on a single file.A new task object will be returned upon success.",
          "doc" : ""
        },
        "params" : [ ]
      },
      {
        "httpMethod" : "GET",
        "path" : "/tasks/{id}",
        "displayName" : "/tasks/{id}",
        "category" : "tasks",
        "doc" : {
          "t" : "Fetches a specific task.The specified task object will be returned upon success.",
          "doc" : ""
        },
        "params" : [ ]
      },
      {
        "httpMethod" : "PUT",
        "path" : "/tasks/{id}",
        "displayName" : "/tasks/{id}",
        "category" : "tasks",
        "doc" : {
          "t" : "Updates a specific task.The updated task object will be returned upon success.",
          "doc" : ""
        },
        "params" : [ ]
      },
      {
        "httpMethod" : "DELETE",
        "path" : "/tasks/{id}",
        "displayName" : "/tasks/{id}",
        "category" : "tasks",
        "doc" : {
          "t" : "Permanently deletes a specific task.An empty 204 response will be returned upon success.",
          "doc" : ""
        },
        "params" : [ ]
      },
      {
        "httpMethod" : "GET",
        "path" : "/tasks/{id}/assignments",
        "displayName" : "/tasks/{id}/assignments",
        "category" : "tasks",
        "doc" : {
          "t" : "Retrieves all of the assignments for a given task.A collection of task assignment mini objects will be returned upon success.",
          "doc" : ""
        },
        "params" : [ ]
      },
      {
        "httpMethod" : "POST",
        "path" : "/task_assignments",
        "displayName" : "/task_assignments",
        "category" : "tasks",
        "doc" : {
          "t" : "Used to assign a task to a single user. There can be multiple assignments on a given task.A new task assignment object will be returned upon success.",
          "doc" : ""
        },
        "params" : [ ]
      },
      {
        "httpMethod" : "GET",
        "path" : "/task_assignments/{id}",
        "displayName" : "/task_assignments/{id}",
        "category" : "tasks",
        "doc" : {
          "t" : "Fetches a specific task assignment.The specified task assignment object will be returned upon success.",
          "doc" : ""
        },
        "params" : [ ]
      },
      {
        "httpMethod" : "DELETE",
        "path" : "/task_assignments/{id}",
        "displayName" : "/task_assignments/{id}",
        "category" : "tasks",
        "doc" : {
          "t" : "Deletes a specific task assignment.An empty 204 No Content response will be returned upon success.",
          "doc" : ""
        },
        "params" : [ ]
      },
      {
        "httpMethod" : "PUT",
        "path" : "/task_assignments/{id}",
        "displayName" : "/task_assignments/{id}",
        "category" : "tasks",
        "doc" : {
          "t" : "Used to update a task assignment.A new task assignment object will be returned upon success.",
          "doc" : ""
        },
        "params" : [ ]
      }
    ]
  },
  "auth_strategy" : "oauth",
  "documentation" : "http://developers.box.com/docs/",
  "enabled" : true,
  "logo" : "http://cloudtimes.org/wp-content/uploads/2011/08/box_logo.png",
  "name" : "Box",
  "oauth" : {
    "accessTokenURL" : "https://www.box.com/api/oauth2/token",
    "apiKey" : "dzi6sr2jw0kgcmkbb8bdjhe9zvaps8b1",
    "authTokenPath" : "/api/oauth2/authorize",
    "authTokenURL" : "https://www.box.com/api/oauth2/authorize",
    "baseURL" : "https://www.box.com/api",
    "clientId" : "dzi6sr2jw0kgcmkbb8bdjhe9zvaps8b1",
    "grant_type" : "authorization_code",
    "host" : "www.box.com",
    "isManual" : true,
    "key" : "",
    "protocol" : "https",
    "requestTokenURL" : "",
    "scope" : "",
    "secret" : "wimCRfl5cuC2Em8L3vGUZTplxUQWxt6o",
    "tokenMethod" : "bearer",
    "useOAuthLib" : false,
    "version" : "2.0"
  },
  "useCustom" : true
}

db = db.getSiblingDB('meshines');

record = db.apis.findAndModify({
  query: {name: record.name},
  update: {
    $set: record
  },
  new: true,
  upsert: true
});

db.nodetypes.findAndModify({
  query: {name: record.name},
  update: {
    $set: {
      name: record.name,
      logo: record.logo,
      description: record.description,
      skynet: {
        subtype: record.name,
        type: "channel"
      },
      category: "channel",
      enabled: true,
      display: true,
      channel: record
    }
  },
  new: true,
  upsert: true
});
