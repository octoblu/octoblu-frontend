var record = {
  "application" : {
    "base" : "https://api.github.com",
    "resources" : [
      {
        "doc" : {
          "t" : "List public events",
          "url" : "http://developer.github.com/v3/activity/events/"
        },
        "displayName" : "/events",
        "path" : "/events",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "List repository events",
          "url" : "http://developer.github.com/v3/activity/events/"
        },
        "displayName" : "/repos/:owner/:repo/events",
        "path" : "/repos/:owner/:repo/events",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/activity/events/"
        },
        "displayName" : "/repos/:owner/:repo/issues/events",
        "path" : "/repos/:owner/:repo/issues/events",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "List public events for a network of repositories",
          "url" : "http://developer.github.com/v3/activity/events/"
        },
        "displayName" : "/networks/:owner/:repo/events",
        "path" : "/networks/:owner/:repo/events",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "List public events for an organization",
          "url" : "http://developer.github.com/v3/activity/events/"
        },
        "displayName" : "/orgs/:org/events",
        "path" : "/orgs/:org/events",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/activity/events/"
        },
        "displayName" : "/users/:user/received_events",
        "path" : "/users/:user/received_events",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "List public events that a user has received",
          "url" : "http://developer.github.com/v3/activity/events/"
        },
        "displayName" : "/users/:user/received_events/public",
        "path" : "/users/:user/received_events/public",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/activity/events/"
        },
        "displayName" : "/users/:user/events",
        "path" : "/users/:user/events",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "List public events performed by a user",
          "url" : "http://developer.github.com/v3/activity/events/"
        },
        "displayName" : "/users/:user/events/public",
        "path" : "/users/:user/events/public",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/activity/events/"
        },
        "displayName" : "/users/:user/events/orgs/:org",
        "path" : "/users/:user/events/orgs/:org",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/activity/feeds/"
        },
        "displayName" : "/feeds",
        "path" : "/feeds",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/activity/notifications/"
        },
        "displayName" : "/notifications",
        "path" : "/notifications",
        "httpMethod" : "GET",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "all",
            "style" : "body",
            "type" : "boolean",
            "doc" : {
              "t" : "If true, show notifications marked as read. Default: false"
            }
          },
          {
            "name" : "participating",
            "style" : "body",
            "type" : "boolean",
            "doc" : {
              "t" : "If true, only shows notifications in which the user is directly participating or mentioned. Default: false"
            }
          },
          {
            "name" : "since",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Filters out any notifications updated before the given time. This is a timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ. Default: Time.now"
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/activity/notifications/"
        },
        "displayName" : "/repos/:owner/:repo/notifications",
        "path" : "/repos/:owner/:repo/notifications",
        "httpMethod" : "GET",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "all",
            "style" : "body",
            "type" : "boolean",
            "doc" : {
              "t" : "If true, show notifications marked as read. Default: false"
            }
          },
          {
            "name" : "participating",
            "style" : "body",
            "type" : "boolean",
            "doc" : {
              "t" : "If true, only shows notifications in which the user is directly participating or mentioned. Default: false"
            }
          },
          {
            "name" : "since",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Filters out any notifications updated before the given time. This is a timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ. Default: Time.now"
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/activity/notifications/"
        },
        "displayName" : "/notifications",
        "path" : "/notifications",
        "httpMethod" : "PUT",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "last_read_at",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Describes the last point that notifications were checked.  Anything updated since this time will not be updated. This is a timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ. Default: Time.now"
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/activity/notifications/"
        },
        "displayName" : "/repos/:owner/:repo/notifications",
        "path" : "/repos/:owner/:repo/notifications",
        "httpMethod" : "PUT",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "last_read_at",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Describes the last point that notifications were checked.  Anything updated since this time will not be updated. This is a timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ. Default: Time.now"
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "View a single thread",
          "url" : "http://developer.github.com/v3/activity/notifications/"
        },
        "displayName" : "/notifications/threads/:id",
        "path" : "/notifications/threads/:id",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Mark a thread as read",
          "url" : "http://developer.github.com/v3/activity/notifications/"
        },
        "displayName" : "/notifications/threads/:id",
        "path" : "/notifications/threads/:id",
        "httpMethod" : "PATCH",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/activity/notifications/"
        },
        "displayName" : "/notifications/threads/:id/subscription",
        "path" : "/notifications/threads/:id/subscription",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/activity/notifications/"
        },
        "displayName" : "/notifications/threads/:id/subscription",
        "path" : "/notifications/threads/:id/subscription",
        "httpMethod" : "PUT",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "subscribed",
            "style" : "body",
            "type" : "boolean",
            "doc" : {
              "t" : "Determines if notifications should be received from this thread"
            }
          },
          {
            "name" : "ignored",
            "style" : "body",
            "type" : "boolean",
            "doc" : {
              "t" : "Determines if all notifications should be blocked from this thread"
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "Delete a Thread Subscription",
          "url" : "http://developer.github.com/v3/activity/notifications/"
        },
        "displayName" : "/notifications/threads/:id/subscription",
        "path" : "/notifications/threads/:id/subscription",
        "httpMethod" : "DELETE",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "List Stargazers",
          "url" : "http://developer.github.com/v3/activity/starring/"
        },
        "displayName" : "/repos/:owner/:repo/stargazers",
        "path" : "/repos/:owner/:repo/stargazers",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/activity/starring/"
        },
        "displayName" : "/users/:user/starred",
        "path" : "/users/:user/starred",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/activity/starring/"
        },
        "displayName" : "/user/starred",
        "path" : "/user/starred",
        "httpMethod" : "GET",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "sort",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "One of created (when the repository was starred) or updated (when it was last pushed to). Default: created"
            }
          },
          {
            "name" : "direction",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "One of asc (ascending) or desc (descending). Default: desc"
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/activity/starring/"
        },
        "displayName" : "/user/starred/:owner/:repo",
        "path" : "/user/starred/:owner/:repo",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/activity/starring/"
        },
        "displayName" : "/user/starred/:owner/:repo",
        "path" : "/user/starred/:owner/:repo",
        "httpMethod" : "PUT",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/activity/starring/"
        },
        "displayName" : "/user/starred/:owner/:repo",
        "path" : "/user/starred/:owner/:repo",
        "httpMethod" : "DELETE",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "List watchers",
          "url" : "http://developer.github.com/v3/activity/watching/"
        },
        "displayName" : "/repos/:owner/:repo/subscribers",
        "path" : "/repos/:owner/:repo/subscribers",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/activity/watching/"
        },
        "displayName" : "/users/:user/subscriptions",
        "path" : "/users/:user/subscriptions",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/activity/watching/"
        },
        "displayName" : "/user/subscriptions",
        "path" : "/user/subscriptions",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Get a Repository Subscription",
          "url" : "http://developer.github.com/v3/activity/watching/"
        },
        "displayName" : "/repos/:owner/:repo/subscription",
        "path" : "/repos/:owner/:repo/subscription",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Set a Repository Subscription",
          "url" : "http://developer.github.com/v3/activity/watching/"
        },
        "displayName" : "/repos/:owner/:repo/subscription",
        "path" : "/repos/:owner/:repo/subscription",
        "httpMethod" : "PUT",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "subscribed",
            "style" : "body",
            "type" : "boolean",
            "doc" : {
              "t" : "Determines if notifications should be received from this repository."
            }
          },
          {
            "name" : "ignored",
            "style" : "body",
            "type" : "boolean",
            "doc" : {
              "t" : "Determines if all notifications should be blocked from this repository."
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "Delete a Repository Subscription",
          "url" : "http://developer.github.com/v3/activity/watching/"
        },
        "displayName" : "/repos/:owner/:repo/subscription",
        "path" : "/repos/:owner/:repo/subscription",
        "httpMethod" : "DELETE",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/activity/watching/"
        },
        "displayName" : "/user/subscriptions/:owner/:repo",
        "path" : "/user/subscriptions/:owner/:repo",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/activity/watching/"
        },
        "displayName" : "/user/subscriptions/:owner/:repo",
        "path" : "/user/subscriptions/:owner/:repo",
        "httpMethod" : "PUT",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/activity/watching/"
        },
        "displayName" : "/user/subscriptions/:owner/:repo",
        "path" : "/user/subscriptions/:owner/:repo",
        "httpMethod" : "DELETE",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "List comments on a gist",
          "url" : "http://developer.github.com/v3/gists/comments/"
        },
        "displayName" : "/gists/:gist_id/comments",
        "path" : "/gists/:gist_id/comments",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Get a single comment",
          "url" : "http://developer.github.com/v3/gists/comments/"
        },
        "displayName" : "/gists/:gist_id/comments/:id",
        "path" : "/gists/:gist_id/comments/:id",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Create a comment",
          "url" : "http://developer.github.com/v3/gists/comments/"
        },
        "displayName" : "/gists/:gist_id/comments",
        "path" : "/gists/:gist_id/comments",
        "httpMethod" : "POST",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "body",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Required. The comment text."
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "Edit a comment",
          "url" : "http://developer.github.com/v3/gists/comments/"
        },
        "displayName" : "/gists/:gist_id/comments/:id",
        "path" : "/gists/:gist_id/comments/:id",
        "httpMethod" : "PATCH",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "body",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Required. The comment text."
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "Delete a comment",
          "url" : "http://developer.github.com/v3/gists/comments/"
        },
        "displayName" : "/gists/:gist_id/comments/:id",
        "path" : "/gists/:gist_id/comments/:id",
        "httpMethod" : "DELETE",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Get a Blob",
          "url" : "http://developer.github.com/v3/git/blobs/"
        },
        "displayName" : "/repos/:owner/:repo/git/blobs/:sha",
        "path" : "/repos/:owner/:repo/git/blobs/:sha",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Create a Blob",
          "url" : "http://developer.github.com/v3/git/blobs/"
        },
        "displayName" : "/repos/:owner/:repo/git/blobs",
        "path" : "/repos/:owner/:repo/git/blobs",
        "httpMethod" : "POST",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Get a Commit",
          "url" : "http://developer.github.com/v3/git/commits/"
        },
        "displayName" : "/repos/:owner/:repo/git/commits/:sha",
        "path" : "/repos/:owner/:repo/git/commits/:sha",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Create a Commit",
          "url" : "http://developer.github.com/v3/git/commits/"
        },
        "displayName" : "/repos/:owner/:repo/git/commits",
        "path" : "/repos/:owner/:repo/git/commits",
        "httpMethod" : "POST",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "message",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Required. The commit message"
            }
          },
          {
            "name" : "tree",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Required. The SHA of the tree object this commit points to"
            }
          },
          {
            "name" : "parents",
            "style" : "body",
            "type" : "array of strings",
            "doc" : {
              "t" : "Required. The SHAs of the commits that were the parents of this commit.  If omitted or empty, the commit will be written as a root commit.  For a single parent, an array of one SHA should be provided; for a merge commit, an array of more than one should be provided."
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "Get a Reference",
          "url" : "http://developer.github.com/v3/git/refs/"
        },
        "displayName" : "/repos/:owner/:repo/git/refs/:ref",
        "path" : "/repos/:owner/:repo/git/refs/:ref",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/git/refs/"
        },
        "displayName" : "/repos/:owner/:repo/git/refs/heads/skunkworkz/featureA",
        "path" : "/repos/:owner/:repo/git/refs/heads/skunkworkz/featureA",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Get all References",
          "url" : "http://developer.github.com/v3/git/refs/"
        },
        "displayName" : "/repos/:owner/:repo/git/refs",
        "path" : "/repos/:owner/:repo/git/refs",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/git/refs/"
        },
        "displayName" : "/repos/:owner/:repo/git/refs/tags",
        "path" : "/repos/:owner/:repo/git/refs/tags",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Create a Reference",
          "url" : "http://developer.github.com/v3/git/refs/"
        },
        "displayName" : "/repos/:owner/:repo/git/refs",
        "path" : "/repos/:owner/:repo/git/refs",
        "httpMethod" : "POST",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "ref",
            "style" : "body",
            "type" : "type",
            "doc" : {
              "t" : "The name of the fully qualified reference (ie: refs/heads/master). If it doesn’t start with ‘refs’ and have at least two slashes, it will be rejected."
            }
          },
          {
            "name" : "sha",
            "style" : "body",
            "type" : "type",
            "doc" : {
              "t" : "The SHA1 value to set this reference to"
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "Update a Reference",
          "url" : "http://developer.github.com/v3/git/refs/"
        },
        "displayName" : "/repos/:owner/:repo/git/refs/:ref",
        "path" : "/repos/:owner/:repo/git/refs/:ref",
        "httpMethod" : "PATCH",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "sha",
            "style" : "body",
            "type" : "type",
            "doc" : {
              "t" : "The SHA1 value to set this reference to"
            }
          },
          {
            "name" : "force",
            "style" : "body",
            "type" : "boolean",
            "doc" : {
              "t" : "Indicates whether to force the update or to make sure the update is a fast-forward update. Leaving this out or setting it to false will make sure you’re not overwriting work. Default: false"
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "Delete a Reference",
          "url" : "http://developer.github.com/v3/git/refs/"
        },
        "displayName" : "/repos/:owner/:repo/git/refs/:ref",
        "path" : "/repos/:owner/:repo/git/refs/:ref",
        "httpMethod" : "DELETE",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/git/refs/"
        },
        "displayName" : "/repos/octocat/Hello-World/git/refs/heads/feature-a",
        "path" : "/repos/octocat/Hello-World/git/refs/heads/feature-a",
        "httpMethod" : "DELETE",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/git/refs/"
        },
        "displayName" : "/repos/octocat/Hello-World/git/refs/tags/v1.0",
        "path" : "/repos/octocat/Hello-World/git/refs/tags/v1.0",
        "httpMethod" : "DELETE",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Get a Tag",
          "url" : "http://developer.github.com/v3/git/tags/"
        },
        "displayName" : "/repos/:owner/:repo/git/tags/:sha",
        "path" : "/repos/:owner/:repo/git/tags/:sha",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/git/tags/"
        },
        "displayName" : "/repos/:owner/:repo/git/tags",
        "path" : "/repos/:owner/:repo/git/tags",
        "httpMethod" : "POST",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "tag",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The tag"
            }
          },
          {
            "name" : "message",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The tag message"
            }
          },
          {
            "name" : "object",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The SHA of the git object this is tagging"
            }
          },
          {
            "name" : "type",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The type of the object we’re tagging. Normally this is a commit but it can also be a tree or a blob."
            }
          },
          {
            "name" : "tagger",
            "style" : "body",
            "type" : "hash",
            "doc" : {
              "t" : "A hash with information about the individual creating the tag."
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "Get a Tree",
          "url" : "http://developer.github.com/v3/git/trees/"
        },
        "displayName" : "/repos/:owner/:repo/git/trees/:sha",
        "path" : "/repos/:owner/:repo/git/trees/:sha",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Get a Tree Recursively",
          "url" : "http://developer.github.com/v3/git/trees/"
        },
        "displayName" : "/repos/:owner/:repo/git/trees/:sha?recursive=1",
        "path" : "/repos/:owner/:repo/git/trees/:sha?recursive=1",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/git/trees/"
        },
        "displayName" : "/repos/:owner/:repo/git/trees",
        "path" : "/repos/:owner/:repo/git/trees",
        "httpMethod" : "POST",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "tree",
            "style" : "body",
            "type" : "array of hashes",
            "doc" : {
              "t" : "Required. Objects (of path, mode, type, and sha) specifying a tree structure"
            }
          },
          {
            "name" : "base_tree",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The SHA1 of the tree you want to update with new data. If you don’t set this, the commit will be created on top of everything; however, it will only contain your change, the rest of your files will show up as deleted."
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/issues/assignees/"
        },
        "displayName" : "/repos/:owner/:repo/assignees",
        "path" : "/repos/:owner/:repo/assignees",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/issues/assignees/"
        },
        "displayName" : "/repos/:owner/:repo/assignees/:assignee",
        "path" : "/repos/:owner/:repo/assignees/:assignee",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "List comments on an issue",
          "url" : "http://developer.github.com/v3/issues/comments/"
        },
        "displayName" : "/repos/:owner/:repo/issues/:number/comments",
        "path" : "/repos/:owner/:repo/issues/:number/comments",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "List comments in a repository",
          "url" : "http://developer.github.com/v3/issues/comments/"
        },
        "displayName" : "/repos/:owner/:repo/issues/comments",
        "path" : "/repos/:owner/:repo/issues/comments",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Get a single comment",
          "url" : "http://developer.github.com/v3/issues/comments/"
        },
        "displayName" : "/repos/:owner/:repo/issues/comments/:id",
        "path" : "/repos/:owner/:repo/issues/comments/:id",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Create a comment",
          "url" : "http://developer.github.com/v3/issues/comments/"
        },
        "displayName" : "/repos/:owner/:repo/issues/:number/comments",
        "path" : "/repos/:owner/:repo/issues/:number/comments",
        "httpMethod" : "POST",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "body",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Required. The contents of the comment."
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "Edit a comment",
          "url" : "http://developer.github.com/v3/issues/comments/"
        },
        "displayName" : "/repos/:owner/:repo/issues/comments/:id",
        "path" : "/repos/:owner/:repo/issues/comments/:id",
        "httpMethod" : "PATCH",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "body",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Required. The contents of the comment."
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "Delete a comment",
          "url" : "http://developer.github.com/v3/issues/comments/"
        },
        "displayName" : "/repos/:owner/:repo/issues/comments/:id",
        "path" : "/repos/:owner/:repo/issues/comments/:id",
        "httpMethod" : "DELETE",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "List events for an issue",
          "url" : "http://developer.github.com/v3/issues/events/"
        },
        "displayName" : "/repos/:owner/:repo/issues/:issue_number/events",
        "path" : "/repos/:owner/:repo/issues/:issue_number/events",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "List events for a repository",
          "url" : "http://developer.github.com/v3/issues/events/"
        },
        "displayName" : "/repos/:owner/:repo/issues/events",
        "path" : "/repos/:owner/:repo/issues/events",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Get a single event",
          "url" : "http://developer.github.com/v3/issues/events/"
        },
        "displayName" : "/repos/:owner/:repo/issues/events/:id",
        "path" : "/repos/:owner/:repo/issues/events/:id",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "List all labels for this repository",
          "url" : "http://developer.github.com/v3/issues/labels/"
        },
        "displayName" : "/repos/:owner/:repo/labels",
        "path" : "/repos/:owner/:repo/labels",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Get a single label",
          "url" : "http://developer.github.com/v3/issues/labels/"
        },
        "displayName" : "/repos/:owner/:repo/labels/:name",
        "path" : "/repos/:owner/:repo/labels/:name",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Create a label",
          "url" : "http://developer.github.com/v3/issues/labels/"
        },
        "displayName" : "/repos/:owner/:repo/labels",
        "path" : "/repos/:owner/:repo/labels",
        "httpMethod" : "POST",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "name",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Required. The name of the label."
            }
          },
          {
            "name" : "color",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Required.  A 6 character hex code, without the leading #, identifying the color."
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "Update a label",
          "url" : "http://developer.github.com/v3/issues/labels/"
        },
        "displayName" : "/repos/:owner/:repo/labels/:name",
        "path" : "/repos/:owner/:repo/labels/:name",
        "httpMethod" : "PATCH",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "name",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Required. The name of the label."
            }
          },
          {
            "name" : "color",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Required.  A 6 character hex code, without the leading #, identifying the color."
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "Delete a label",
          "url" : "http://developer.github.com/v3/issues/labels/"
        },
        "displayName" : "/repos/:owner/:repo/labels/:name",
        "path" : "/repos/:owner/:repo/labels/:name",
        "httpMethod" : "DELETE",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "List labels on an issue",
          "url" : "http://developer.github.com/v3/issues/labels/"
        },
        "displayName" : "/repos/:owner/:repo/issues/:number/labels",
        "path" : "/repos/:owner/:repo/issues/:number/labels",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Add labels to an issue",
          "url" : "http://developer.github.com/v3/issues/labels/"
        },
        "displayName" : "/repos/:owner/:repo/issues/:number/labels",
        "path" : "/repos/:owner/:repo/issues/:number/labels",
        "httpMethod" : "POST",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Remove a label from an issue",
          "url" : "http://developer.github.com/v3/issues/labels/"
        },
        "displayName" : "/repos/:owner/:repo/issues/:number/labels/:name",
        "path" : "/repos/:owner/:repo/issues/:number/labels/:name",
        "httpMethod" : "DELETE",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Replace all labels for an issue",
          "url" : "http://developer.github.com/v3/issues/labels/"
        },
        "displayName" : "/repos/:owner/:repo/issues/:number/labels",
        "path" : "/repos/:owner/:repo/issues/:number/labels",
        "httpMethod" : "PUT",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Remove all labels from an issue",
          "url" : "http://developer.github.com/v3/issues/labels/"
        },
        "displayName" : "/repos/:owner/:repo/issues/:number/labels",
        "path" : "/repos/:owner/:repo/issues/:number/labels",
        "httpMethod" : "DELETE",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Get labels for every issue in a milestone",
          "url" : "http://developer.github.com/v3/issues/labels/"
        },
        "displayName" : "/repos/:owner/:repo/milestones/:number/labels",
        "path" : "/repos/:owner/:repo/milestones/:number/labels",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "List milestones for a repository",
          "url" : "http://developer.github.com/v3/issues/milestones/"
        },
        "displayName" : "/repos/:owner/:repo/milestones",
        "path" : "/repos/:owner/:repo/milestones",
        "httpMethod" : "GET",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "state",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The state of the milestone. Either open or closed. Default: open"
            }
          },
          {
            "name" : "sort",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "What to sort results by. Either due_date or completeness. Default: due_date"
            }
          },
          {
            "name" : "direction",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The direction of the sort. Either asc or desc. Default: asc"
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "Get a single milestone",
          "url" : "http://developer.github.com/v3/issues/milestones/"
        },
        "displayName" : "/repos/:owner/:repo/milestones/:number",
        "path" : "/repos/:owner/:repo/milestones/:number",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Create a milestone",
          "url" : "http://developer.github.com/v3/issues/milestones/"
        },
        "displayName" : "/repos/:owner/:repo/milestones",
        "path" : "/repos/:owner/:repo/milestones",
        "httpMethod" : "POST",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "title",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Required. The title of the milestone."
            }
          },
          {
            "name" : "state",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The state of the milestone. Either open or closed. Default: open"
            }
          },
          {
            "name" : "description",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "A description of the milestone."
            }
          },
          {
            "name" : "due_on",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The milestone due date. This is a timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ."
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "Update a milestone",
          "url" : "http://developer.github.com/v3/issues/milestones/"
        },
        "displayName" : "/repos/:owner/:repo/milestones/:number",
        "path" : "/repos/:owner/:repo/milestones/:number",
        "httpMethod" : "PATCH",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "title",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The title of the milestone."
            }
          },
          {
            "name" : "state",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The state of the milestone. Either open or closed. Default: open"
            }
          },
          {
            "name" : "description",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "A description of the milestone."
            }
          },
          {
            "name" : "due_on",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The milestone due date. This is a timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ."
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "Delete a milestone",
          "url" : "http://developer.github.com/v3/issues/milestones/"
        },
        "displayName" : "/repos/:owner/:repo/milestones/:number",
        "path" : "/repos/:owner/:repo/milestones/:number",
        "httpMethod" : "DELETE",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/emojis/"
        },
        "displayName" : "/emojis",
        "path" : "/emojis",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/gitignore/"
        },
        "displayName" : "/gitignore/templates",
        "path" : "/gitignore/templates",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/gitignore/"
        },
        "displayName" : "/gitignore/templates/C",
        "path" : "/gitignore/templates/C",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Render an arbitrary Markdown document",
          "url" : "http://developer.github.com/v3/markdown/"
        },
        "displayName" : "/markdown",
        "path" : "/markdown",
        "httpMethod" : "POST",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "text",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Required.The Markdown text to render"
            }
          },
          {
            "name" : "mode",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The rendering mode. Can be either:* markdown to render a document as plain Markdown, just like README files are rendered. * gfm to render a document as user-content, e.g. like user comments or issues are rendered. In GFM mode, hard line breaks are always taken into account, and issue and user mentions are linked accordingly. Default: markdown"
            }
          },
          {
            "name" : "context",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The repository context. Only taken into account when rendering as gfm"
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "Render a Markdown document in raw mode",
          "url" : "http://developer.github.com/v3/markdown/"
        },
        "displayName" : "/markdown/raw",
        "path" : "/markdown/raw",
        "httpMethod" : "POST",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/meta/"
        },
        "displayName" : "/meta",
        "path" : "/meta",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/rate_limit/"
        },
        "displayName" : "/rate_limit",
        "path" : "/rate_limit",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/orgs/members/"
        },
        "displayName" : "/orgs/:org/members",
        "path" : "/orgs/:org/members",
        "httpMethod" : "GET",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "filter",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Filter members returned in the list. Can be one of:* 2fa_disabled: Members without two-factor authentication enabled. Available for owners of organizations with private repositories.* all: All members the authenticated user can see.Default: all"
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/orgs/members/"
        },
        "displayName" : "/orgs/:org/members/:user",
        "path" : "/orgs/:org/members/:user",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/orgs/members/"
        },
        "displayName" : "/orgs/:org/members/:user",
        "path" : "/orgs/:org/members/:user",
        "httpMethod" : "DELETE",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/orgs/members/"
        },
        "displayName" : "/orgs/:org/public_members",
        "path" : "/orgs/:org/public_members",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Check public membership",
          "url" : "http://developer.github.com/v3/orgs/members/"
        },
        "displayName" : "/orgs/:org/public_members/:user",
        "path" : "/orgs/:org/public_members/:user",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/orgs/members/"
        },
        "displayName" : "/orgs/:org/public_members/:user",
        "path" : "/orgs/:org/public_members/:user",
        "httpMethod" : "PUT",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Conceal a user’s membership",
          "url" : "http://developer.github.com/v3/orgs/members/"
        },
        "displayName" : "/orgs/:org/public_members/:user",
        "path" : "/orgs/:org/public_members/:user",
        "httpMethod" : "DELETE",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "List teams",
          "url" : "http://developer.github.com/v3/orgs/teams/"
        },
        "displayName" : "/orgs/:org/teams",
        "path" : "/orgs/:org/teams",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Get team",
          "url" : "http://developer.github.com/v3/orgs/teams/"
        },
        "displayName" : "/teams/:id",
        "path" : "/teams/:id",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/orgs/teams/"
        },
        "displayName" : "/orgs/:org/teams",
        "path" : "/orgs/:org/teams",
        "httpMethod" : "POST",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "name",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Required. The name of the team."
            }
          },
          {
            "name" : "repo_names",
            "style" : "body",
            "type" : "array of strings",
            "doc" : {
              "t" : "The repositories to add the team to."
            }
          },
          {
            "name" : "permission",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The permission to grant the team. Can be one of: * pull - team members can pull, but not push to or administer these repositories. * push - team members can pull and push, but not administer these repositories. * admin - team members can pull, push and administer these repositories.Default: pull"
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/orgs/teams/"
        },
        "displayName" : "/teams/:id",
        "path" : "/teams/:id",
        "httpMethod" : "PATCH",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "name",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Required. The name of the team."
            }
          },
          {
            "name" : "permission",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The permission to grant the team. Can be one of: * pull - team members can pull, but not push to or administer these repositories. * push - team members can pull and push, but not administer these repositories. * admin - team members can pull, push and administer these repositories. Default: pull"
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/orgs/teams/"
        },
        "displayName" : "/teams/:id",
        "path" : "/teams/:id",
        "httpMethod" : "DELETE",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/orgs/teams/"
        },
        "displayName" : "/teams/:id/members",
        "path" : "/teams/:id/members",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/orgs/teams/"
        },
        "displayName" : "/teams/:id/members/:user",
        "path" : "/teams/:id/members/:user",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/orgs/teams/"
        },
        "displayName" : "/teams/:id/members/:user",
        "path" : "/teams/:id/members/:user",
        "httpMethod" : "PUT",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/orgs/teams/"
        },
        "displayName" : "/teams/:id/members/:user",
        "path" : "/teams/:id/members/:user",
        "httpMethod" : "DELETE",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "List team repos",
          "url" : "http://developer.github.com/v3/orgs/teams/"
        },
        "displayName" : "/teams/:id/repos",
        "path" : "/teams/:id/repos",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Check if a team manages a repository",
          "url" : "http://developer.github.com/v3/orgs/teams/"
        },
        "displayName" : "/teams/:id/repos/:owner/:repo",
        "path" : "/teams/:id/repos/:owner/:repo",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/orgs/teams/"
        },
        "displayName" : "/teams/:id/repos/:org/:repo",
        "path" : "/teams/:id/repos/:org/:repo",
        "httpMethod" : "PUT",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/orgs/teams/"
        },
        "displayName" : "/teams/:id/repos/:owner/:repo",
        "path" : "/teams/:id/repos/:owner/:repo",
        "httpMethod" : "DELETE",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/orgs/teams/"
        },
        "displayName" : "/user/teams",
        "path" : "/user/teams",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "List comments on a pull request",
          "url" : "http://developer.github.com/v3/pulls/comments/"
        },
        "displayName" : "/repos/:owner/:repo/pulls/:number/comments",
        "path" : "/repos/:owner/:repo/pulls/:number/comments",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "List comments in a repository",
          "url" : "http://developer.github.com/v3/pulls/comments/"
        },
        "displayName" : "/repos/:owner/:repo/pulls/comments",
        "path" : "/repos/:owner/:repo/pulls/comments",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Get a single comment",
          "url" : "http://developer.github.com/v3/pulls/comments/"
        },
        "displayName" : "/repos/:owner/:repo/pulls/comments/:number",
        "path" : "/repos/:owner/:repo/pulls/comments/:number",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Create a comment",
          "url" : "http://developer.github.com/v3/pulls/comments/"
        },
        "displayName" : "/repos/:owner/:repo/pulls/:number/comments",
        "path" : "/repos/:owner/:repo/pulls/:number/comments",
        "httpMethod" : "POST",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "body",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Required. The text of the comment"
            }
          },
          {
            "name" : "commit_id",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Required. The SHA of the commit to comment on."
            }
          },
          {
            "name" : "path",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Required. The relative path of the file to comment on."
            }
          },
          {
            "name" : "position",
            "style" : "body",
            "type" : "number",
            "doc" : {
              "t" : "Required. The line index in the diff to comment on."
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "Edit a comment",
          "url" : "http://developer.github.com/v3/pulls/comments/"
        },
        "displayName" : "/repos/:owner/:repo/pulls/comments/:number",
        "path" : "/repos/:owner/:repo/pulls/comments/:number",
        "httpMethod" : "PATCH",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "body",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Required. The text of the comment"
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "Delete a comment",
          "url" : "http://developer.github.com/v3/pulls/comments/"
        },
        "displayName" : "/repos/:owner/:repo/pulls/comments/:number",
        "path" : "/repos/:owner/:repo/pulls/comments/:number",
        "httpMethod" : "DELETE",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "List collaborators",
          "url" : "http://developer.github.com/v3/repos/collaborators/"
        },
        "displayName" : "/repos/:owner/:repo/collaborators",
        "path" : "/repos/:owner/:repo/collaborators",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Check if a user is a collaborator",
          "url" : "http://developer.github.com/v3/repos/collaborators/"
        },
        "displayName" : "/repos/:owner/:repo/collaborators/:user",
        "path" : "/repos/:owner/:repo/collaborators/:user",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Add user as a collaborator",
          "url" : "http://developer.github.com/v3/repos/collaborators/"
        },
        "displayName" : "/repos/:owner/:repo/collaborators/:user",
        "path" : "/repos/:owner/:repo/collaborators/:user",
        "httpMethod" : "PUT",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Remove user as a collaborator",
          "url" : "http://developer.github.com/v3/repos/collaborators/"
        },
        "displayName" : "/repos/:owner/:repo/collaborators/:user",
        "path" : "/repos/:owner/:repo/collaborators/:user",
        "httpMethod" : "DELETE",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/repos/comments/"
        },
        "displayName" : "/repos/:owner/:repo/comments",
        "path" : "/repos/:owner/:repo/comments",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "List comments for a single commit",
          "url" : "http://developer.github.com/v3/repos/comments/"
        },
        "displayName" : "/repos/:owner/:repo/commits/:sha/comments",
        "path" : "/repos/:owner/:repo/commits/:sha/comments",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Create a commit comment",
          "url" : "http://developer.github.com/v3/repos/comments/"
        },
        "displayName" : "/repos/:owner/:repo/commits/:sha/comments",
        "path" : "/repos/:owner/:repo/commits/:sha/comments",
        "httpMethod" : "POST",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "sha",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Required. The SHA of the commit to comment on."
            }
          },
          {
            "name" : "body",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Required. The contents of the comment."
            }
          },
          {
            "name" : "path",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Relative path of the file to comment on."
            }
          },
          {
            "name" : "position",
            "style" : "body",
            "type" : "number",
            "doc" : {
              "t" : "Line index in the diff to comment on."
            }
          },
          {
            "name" : "line",
            "style" : "body",
            "type" : "number",
            "doc" : {
              "t" : "Deprecated. Use position parameter instead. Line number in the file to comment on."
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "Get a single commit comment",
          "url" : "http://developer.github.com/v3/repos/comments/"
        },
        "displayName" : "/repos/:owner/:repo/comments/:id",
        "path" : "/repos/:owner/:repo/comments/:id",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Update a commit comment",
          "url" : "http://developer.github.com/v3/repos/comments/"
        },
        "displayName" : "/repos/:owner/:repo/comments/:id",
        "path" : "/repos/:owner/:repo/comments/:id",
        "httpMethod" : "PATCH",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "body",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Required. The contents of the comment"
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "Delete a commit comment",
          "url" : "http://developer.github.com/v3/repos/comments/"
        },
        "displayName" : "/repos/:owner/:repo/comments/:id",
        "path" : "/repos/:owner/:repo/comments/:id",
        "httpMethod" : "DELETE",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "List commits on a repository",
          "url" : "http://developer.github.com/v3/repos/commits/"
        },
        "displayName" : "/repos/:owner/:repo/commits",
        "path" : "/repos/:owner/:repo/commits",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Get a single commit",
          "url" : "http://developer.github.com/v3/repos/commits/"
        },
        "displayName" : "/repos/:owner/:repo/commits/:sha",
        "path" : "/repos/:owner/:repo/commits/:sha",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Compare two commits",
          "url" : "http://developer.github.com/v3/repos/commits/"
        },
        "displayName" : "/repos/:owner/:repo/compare/:base...:head",
        "path" : "/repos/:owner/:repo/compare/:base...:head",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/repos/commits/"
        },
        "displayName" : "/repos/:owner/:repo/compare/user1:branchname...user2:branchname",
        "path" : "/repos/:owner/:repo/compare/user1:branchname...user2:branchname",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/repos/contents/"
        },
        "displayName" : "/repos/:owner/:repo/readme",
        "path" : "/repos/:owner/:repo/readme",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/repos/contents/"
        },
        "displayName" : "/repos/:owner/:repo/contents/:path",
        "path" : "/repos/:owner/:repo/contents/:path",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/repos/contents/"
        },
        "displayName" : "/repos/:owner/:repo/contents/:path",
        "path" : "/repos/:owner/:repo/contents/:path",
        "httpMethod" : "PUT",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "path",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Required. The content path."
            }
          },
          {
            "name" : "message",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Required. The commit message."
            }
          },
          {
            "name" : "content",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Required. The new file content, Base64 encoded."
            }
          },
          {
            "name" : "branch",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The branch name. Default: the repository’s default branch (usually master)"
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/repos/contents/"
        },
        "displayName" : "/repos/:owner/:repo/contents/:path",
        "path" : "/repos/:owner/:repo/contents/:path",
        "httpMethod" : "PUT",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "path",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Required. The content path."
            }
          },
          {
            "name" : "message",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Required. The commit message."
            }
          },
          {
            "name" : "content",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Required. The updated file content, Base64 encoded."
            }
          },
          {
            "name" : "sha",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Required. The blob SHA of the file being replaced."
            }
          },
          {
            "name" : "branch",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The branch name. Default: the repository’s default branch (usually master)"
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/repos/contents/"
        },
        "displayName" : "/repos/:owner/:repo/contents/:path",
        "path" : "/repos/:owner/:repo/contents/:path",
        "httpMethod" : "DELETE",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "path",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Required. The content path."
            }
          },
          {
            "name" : "message",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Required. The commit message."
            }
          },
          {
            "name" : "sha",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Required. The blob SHA of the file being replaced."
            }
          },
          {
            "name" : "branch",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The branch name. Default: the repository’s default branch (usually master)"
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/repos/contents/"
        },
        "displayName" : "/repos/:owner/:repo/:archive_format/:ref",
        "path" : "/repos/:owner/:repo/:archive_format/:ref",
        "httpMethod" : "GET",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "archive_format",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Can be either tarball or zipball. Default: tarball"
            }
          },
          {
            "name" : "ref",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "A valid Git reference. Default: the repository’s default branch (usually master)"
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "List deploy keys",
          "url" : "http://developer.github.com/v3/repos/keys/"
        },
        "displayName" : "/repos/:owner/:repo/keys",
        "path" : "/repos/:owner/:repo/keys",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Get a deploy key",
          "url" : "http://developer.github.com/v3/repos/keys/"
        },
        "displayName" : "/repos/:owner/:repo/keys/:id",
        "path" : "/repos/:owner/:repo/keys/:id",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Add a new deploy key",
          "url" : "http://developer.github.com/v3/repos/keys/"
        },
        "displayName" : "/repos/:owner/:repo/keys",
        "path" : "/repos/:owner/:repo/keys",
        "httpMethod" : "POST",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Remove a deploy key",
          "url" : "http://developer.github.com/v3/repos/keys/"
        },
        "displayName" : "/repos/:owner/:repo/keys/:id",
        "path" : "/repos/:owner/:repo/keys/:id",
        "httpMethod" : "DELETE",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/repos/deployments/"
        },
        "displayName" : "/repos/:owner/:repo/deployments",
        "path" : "/repos/:owner/:repo/deployments",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/repos/deployments/"
        },
        "displayName" : "/repos/:owner/:repo/deployments",
        "path" : "/repos/:owner/:repo/deployments",
        "httpMethod" : "POST",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "ref",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Required. The ref to deploy. This can be a branch, tag, or sha."
            }
          },
          {
            "name" : "force",
            "style" : "body",
            "type" : "boolean",
            "doc" : {
              "t" : "Optional parameter to bypass any ahead/behind checks or commit status checks. Default: false"
            }
          },
          {
            "name" : "payload",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Optional JSON payload with extra information about the deployment. Default: \"\""
            }
          },
          {
            "name" : "auto_merge",
            "style" : "body",
            "type" : "boolean",
            "doc" : {
              "t" : "Optional parameter to merge the default branch into the requested deployment branch if necessary. Default: false"
            }
          },
          {
            "name" : "description",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Optional short description. Default: \"\""
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/repos/deployments/"
        },
        "displayName" : "/repos/:owner/:repo/deployments/:id/statuses",
        "path" : "/repos/:owner/:repo/deployments/:id/statuses",
        "httpMethod" : "GET",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "id",
            "style" : "body",
            "type" : "integer",
            "doc" : {
              "t" : "Required. The Deployment ID to list the statuses from."
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/repos/deployments/"
        },
        "displayName" : "/repos/:owner/:repo/deployments/:id/statuses",
        "path" : "/repos/:owner/:repo/deployments/:id/statuses",
        "httpMethod" : "POST",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "state",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Required. The state of the status. Can be one of pending, success, error, or failure."
            }
          },
          {
            "name" : "target_url",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The target URL to associate with this status.  This URL should contain output to keep the user updated while the task is running or serve as historical information for what happened in the deployment. Default: \"\""
            }
          },
          {
            "name" : "description",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "A short description of the status. Default: \"\""
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "List downloads for a repository",
          "url" : "http://developer.github.com/v3/repos/downloads/"
        },
        "displayName" : "/repos/:owner/:repo/downloads",
        "path" : "/repos/:owner/:repo/downloads",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Get a single download",
          "url" : "http://developer.github.com/v3/repos/downloads/"
        },
        "displayName" : "/repos/:owner/:repo/downloads/:id",
        "path" : "/repos/:owner/:repo/downloads/:id",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Delete a download",
          "url" : "http://developer.github.com/v3/repos/downloads/"
        },
        "displayName" : "/repos/:owner/:repo/downloads/:id",
        "path" : "/repos/:owner/:repo/downloads/:id",
        "httpMethod" : "DELETE",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "List forks",
          "url" : "http://developer.github.com/v3/repos/forks/"
        },
        "displayName" : "/repos/:owner/:repo/forks",
        "path" : "/repos/:owner/:repo/forks",
        "httpMethod" : "GET",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "sort",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The sort order. Can be either newest, oldest, or stargazers. Default: newest"
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/repos/forks/"
        },
        "displayName" : "/repos/:owner/:repo/forks",
        "path" : "/repos/:owner/:repo/forks",
        "httpMethod" : "POST",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "List hooks",
          "url" : "http://developer.github.com/v3/repos/hooks/"
        },
        "displayName" : "/repos/:owner/:repo/hooks",
        "path" : "/repos/:owner/:repo/hooks",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Get single hook",
          "url" : "http://developer.github.com/v3/repos/hooks/"
        },
        "displayName" : "/repos/:owner/:repo/hooks/:id",
        "path" : "/repos/:owner/:repo/hooks/:id",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Create a hook",
          "url" : "http://developer.github.com/v3/repos/hooks/"
        },
        "displayName" : "/repos/:owner/:repo/hooks",
        "path" : "/repos/:owner/:repo/hooks",
        "httpMethod" : "POST",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "name",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Required. The name of the service that is being called. (See /hooks for the list of valid hook names.)"
            }
          },
          {
            "name" : "config",
            "style" : "body",
            "type" : "hash",
            "doc" : {
              "t" : "Required. Key/value pairs to provide settings for this hook.  These settings vary between the services and are defined in the github-services repository. Booleans are stored internally as “1” for true, and “0” for false.  Any JSON true/false values will be converted automatically."
            }
          },
          {
            "name" : "events",
            "style" : "body",
            "type" : "array",
            "doc" : {
              "t" : "Determines what events the hook is triggered for.  Default: [\"push\"]"
            }
          },
          {
            "name" : "active",
            "style" : "body",
            "type" : "boolean",
            "doc" : {
              "t" : "Determines whether the hook is actually triggered on pushes."
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "Edit a hook",
          "url" : "http://developer.github.com/v3/repos/hooks/"
        },
        "displayName" : "/repos/:owner/:repo/hooks/:id",
        "path" : "/repos/:owner/:repo/hooks/:id",
        "httpMethod" : "PATCH",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "config",
            "style" : "body",
            "type" : "hash",
            "doc" : {
              "t" : "Key/value pairs to provide settings for this hook.  Modifying this will replace the entire config object.  These settings vary between the services and are defined in the github-services repository. Booleans are stored internally as “1” for true, and “0” for false.  Any JSON true/false values will be converted automatically."
            }
          },
          {
            "name" : "events",
            "style" : "body",
            "type" : "array",
            "doc" : {
              "t" : "Determines what events the hook is triggered for.  This replaces the entire array of events.  Default: [\"push\"]"
            }
          },
          {
            "name" : "add_events",
            "style" : "body",
            "type" : "array",
            "doc" : {
              "t" : "Determines a list of events to be added to the list of events that the Hook triggers for."
            }
          },
          {
            "name" : "remove_events",
            "style" : "body",
            "type" : "array",
            "doc" : {
              "t" : "Determines a list of events to be removed from the list of events that the Hook triggers for."
            }
          },
          {
            "name" : "active",
            "style" : "body",
            "type" : "boolean",
            "doc" : {
              "t" : "Determines whether the hook is actually triggered on pushes."
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/repos/hooks/"
        },
        "displayName" : "/repos/:owner/:repo/hooks/:id/tests",
        "path" : "/repos/:owner/:repo/hooks/:id/tests",
        "httpMethod" : "POST",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/repos/hooks/"
        },
        "displayName" : "/repos/:owner/:repo/hooks/:id/pings",
        "path" : "/repos/:owner/:repo/hooks/:id/pings",
        "httpMethod" : "POST",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Delete a hook",
          "url" : "http://developer.github.com/v3/repos/hooks/"
        },
        "displayName" : "/repos/:owner/:repo/hooks/:id",
        "path" : "/repos/:owner/:repo/hooks/:id",
        "httpMethod" : "DELETE",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Perform a merge",
          "url" : "http://developer.github.com/v3/repos/merging/"
        },
        "displayName" : "/repos/:owner/:repo/merges",
        "path" : "/repos/:owner/:repo/merges",
        "httpMethod" : "POST",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "base",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Required. The name of the base branch that the head will be merged into."
            }
          },
          {
            "name" : "head",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Required. The head to merge. This can be a branch name or a commit SHA1."
            }
          },
          {
            "name" : "commit_message",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Commit message to use for the merge commit. If omitted, a default message will be used."
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "Get information about a Pages site",
          "url" : "http://developer.github.com/v3/repos/pages/"
        },
        "displayName" : "/repos/:owner/:repo/pages",
        "path" : "/repos/:owner/:repo/pages",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "List Pages builds",
          "url" : "http://developer.github.com/v3/repos/pages/"
        },
        "displayName" : "/repos/:owner/:repo/pages/builds",
        "path" : "/repos/:owner/:repo/pages/builds",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "List latest Pages build",
          "url" : "http://developer.github.com/v3/repos/pages/"
        },
        "displayName" : "/repos/:owner/:repo/pages/builds/latest",
        "path" : "/repos/:owner/:repo/pages/builds/latest",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/repos/releases/"
        },
        "displayName" : "/repos/:owner/:repo/releases",
        "path" : "/repos/:owner/:repo/releases",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Get a single release",
          "url" : "http://developer.github.com/v3/repos/releases/"
        },
        "displayName" : "/repos/:owner/:repo/releases/:id",
        "path" : "/repos/:owner/:repo/releases/:id",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/repos/releases/"
        },
        "displayName" : "/repos/:owner/:repo/releases",
        "path" : "/repos/:owner/:repo/releases",
        "httpMethod" : "POST",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "tag_name",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Required. The name of the tag."
            }
          },
          {
            "name" : "target_commitish",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Specifies the commitish value that determines where the Git tag is created from.  Can be any branch or commit SHA. Unused if the Git tag already exists. Default: the repository’s default branch (usually master)."
            }
          },
          {
            "name" : "name",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The name of the release."
            }
          },
          {
            "name" : "body",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Text describing the contents of the tag."
            }
          },
          {
            "name" : "draft",
            "style" : "body",
            "type" : "boolean",
            "doc" : {
              "t" : "true to create a draft (unpublished) release, false to create a published one. Default: false"
            }
          },
          {
            "name" : "prerelease",
            "style" : "body",
            "type" : "boolean",
            "doc" : {
              "t" : "true to identify the release as a prerelease. false to identify the release as a full release. Default: false"
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/repos/releases/"
        },
        "displayName" : "/repos/:owner/:repo/releases/:id",
        "path" : "/repos/:owner/:repo/releases/:id",
        "httpMethod" : "PATCH",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "tag_name",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The name of the tag."
            }
          },
          {
            "name" : "target_commitish",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Specifies the commitish value that determines where the Git tag is created from.  Can be any branch or commit SHA. Unused if the Git tag already exists. Default: the repository’s default branch (usually master)."
            }
          },
          {
            "name" : "name",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The name of the release."
            }
          },
          {
            "name" : "body",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Text describing the contents of the tag."
            }
          },
          {
            "name" : "draft",
            "style" : "body",
            "type" : "boolean",
            "doc" : {
              "t" : "true makes the release a draft, and false publishes the release."
            }
          },
          {
            "name" : "prerelease",
            "style" : "body",
            "type" : "boolean",
            "doc" : {
              "t" : "true to identify the release as a prerelease, false to identify the release as a full release."
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/repos/releases/"
        },
        "displayName" : "/repos/:owner/:repo/releases/:id",
        "path" : "/repos/:owner/:repo/releases/:id",
        "httpMethod" : "DELETE",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "List assets for a release",
          "url" : "http://developer.github.com/v3/repos/releases/"
        },
        "displayName" : "/repos/:owner/:repo/releases/:id/assets",
        "path" : "/repos/:owner/:repo/releases/:id/assets",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/repos/releases/"
        },
        "displayName" : "https://uploads.github.com/repos/:owner/:repo/releases/:id/assets?name=foo.zip",
        "path" : "/https://uploads.github.com/repos/:owner/:repo/releases/:id/assets?name=foo.zip",
        "httpMethod" : "POST",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Get a single release asset",
          "url" : "http://developer.github.com/v3/repos/releases/"
        },
        "displayName" : "/repos/:owner/:repo/releases/assets/:id",
        "path" : "/repos/:owner/:repo/releases/assets/:id",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/repos/releases/"
        },
        "displayName" : "/repos/:owner/:repo/releases/assets/:id",
        "path" : "/repos/:owner/:repo/releases/assets/:id",
        "httpMethod" : "PATCH",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "name",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Required. The file name of the asset."
            }
          },
          {
            "name" : "label",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "An alternate short description of the asset.  Used in place of the filename."
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "Delete a release asset",
          "url" : "http://developer.github.com/v3/repos/releases/"
        },
        "displayName" : "/repos/:owner/:repo/releases/assets/:id",
        "path" : "/repos/:owner/:repo/releases/assets/:id",
        "httpMethod" : "DELETE",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Get contributors list with additions, deletions, and commit counts",
          "url" : "http://developer.github.com/v3/repos/statistics/"
        },
        "displayName" : "/repos/:owner/:repo/stats/contributors",
        "path" : "/repos/:owner/:repo/stats/contributors",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/repos/statistics/"
        },
        "displayName" : "/repos/:owner/:repo/stats/commit_activity",
        "path" : "/repos/:owner/:repo/stats/commit_activity",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Get the number of additions and deletions per week",
          "url" : "http://developer.github.com/v3/repos/statistics/"
        },
        "displayName" : "/repos/:owner/:repo/stats/code_frequency",
        "path" : "/repos/:owner/:repo/stats/code_frequency",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Get the weekly commit count for the repository owner and everyone else",
          "url" : "http://developer.github.com/v3/repos/statistics/"
        },
        "displayName" : "/repos/:owner/:repo/stats/participation",
        "path" : "/repos/:owner/:repo/stats/participation",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Get the number of commits per hour in each day",
          "url" : "http://developer.github.com/v3/repos/statistics/"
        },
        "displayName" : "/repos/:owner/:repo/stats/punch_card",
        "path" : "/repos/:owner/:repo/stats/punch_card",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/repos/statuses/"
        },
        "displayName" : "/repos/:owner/:repo/statuses/:ref",
        "path" : "/repos/:owner/:repo/statuses/:ref",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/repos/statuses/"
        },
        "displayName" : "/repos/:owner/:repo/statuses/:sha",
        "path" : "/repos/:owner/:repo/statuses/:sha",
        "httpMethod" : "POST",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "state",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Required. The state of the status. Can be one of pending, success, error, or failure."
            }
          },
          {
            "name" : "target_url",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The target URL to associate with this status.  This URL will be linked from the GitHub UI to allow users to easily see the ‘source’ of the Status.For example, if your Continuous Integration system is posting build status, you would want to provide the deep link for the build output for this specific SHA:http://ci.example.com/user/repo/build/sha."
            }
          },
          {
            "name" : "description",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "A short description of the status"
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/search/#search-repositories"
        },
        "displayName" : "/search/repositories",
        "path" : "/search/repositories",
        "httpMethod" : "GET",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "q",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The search keywords, as well as any qualifiers."
            }
          },
          {
            "name" : "sort",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The sort field. One of stars, forks, or updated. Default: results are sorted by best match."
            }
          },
          {
            "name" : "order",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The sort order if sort parameter is provided. One of asc or desc. Default: desc"
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/search/#search-repositories"
        },
        "displayName" : "/search/code",
        "path" : "/search/code",
        "httpMethod" : "GET",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "q",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The search terms."
            }
          },
          {
            "name" : "sort",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The sort field. Can only be indexed, which indicates how recently a file has been indexed by the GitHub search infrastructure. Default: results are sorted by best match."
            }
          },
          {
            "name" : "order",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The sort order if sort parameter is provided. One of asc or desc. Default: desc"
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/search/#search-repositories"
        },
        "displayName" : "/search/issues",
        "path" : "/search/issues",
        "httpMethod" : "GET",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "q",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The search terms."
            }
          },
          {
            "name" : "sort",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The sort field. Can be comments, created, or updated. Default: results are sorted by best match."
            }
          },
          {
            "name" : "order",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The sort order if sort parameter is provided. One of asc or desc. Default: desc"
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/search/#search-repositories"
        },
        "displayName" : "/search/users",
        "path" : "/search/users",
        "httpMethod" : "GET",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "q",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The search terms."
            }
          },
          {
            "name" : "sort",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The sort field. Can be followers, repositories, or joined.  Default: results are sorted by best match."
            }
          },
          {
            "name" : "order",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The sort order if sort parameter is provided. One of asc or desc. Default: desc"
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/search/#search-code"
        },
        "displayName" : "/search/repositories",
        "path" : "/search/repositories",
        "httpMethod" : "GET",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "q",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The search keywords, as well as any qualifiers."
            }
          },
          {
            "name" : "sort",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The sort field. One of stars, forks, or updated. Default: results are sorted by best match."
            }
          },
          {
            "name" : "order",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The sort order if sort parameter is provided. One of asc or desc. Default: desc"
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/search/#search-code"
        },
        "displayName" : "/search/code",
        "path" : "/search/code",
        "httpMethod" : "GET",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "q",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The search terms."
            }
          },
          {
            "name" : "sort",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The sort field. Can only be indexed, which indicates how recently a file has been indexed by the GitHub search infrastructure. Default: results are sorted by best match."
            }
          },
          {
            "name" : "order",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The sort order if sort parameter is provided. One of asc or desc. Default: desc"
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/search/#search-code"
        },
        "displayName" : "/search/issues",
        "path" : "/search/issues",
        "httpMethod" : "GET",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "q",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The search terms."
            }
          },
          {
            "name" : "sort",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The sort field. Can be comments, created, or updated. Default: results are sorted by best match."
            }
          },
          {
            "name" : "order",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The sort order if sort parameter is provided. One of asc or desc. Default: desc"
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/search/#search-code"
        },
        "displayName" : "/search/users",
        "path" : "/search/users",
        "httpMethod" : "GET",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "q",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The search terms."
            }
          },
          {
            "name" : "sort",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The sort field. Can be followers, repositories, or joined.  Default: results are sorted by best match."
            }
          },
          {
            "name" : "order",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The sort order if sort parameter is provided. One of asc or desc. Default: desc"
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/search/#search-issues"
        },
        "displayName" : "/search/repositories",
        "path" : "/search/repositories",
        "httpMethod" : "GET",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "q",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The search keywords, as well as any qualifiers."
            }
          },
          {
            "name" : "sort",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The sort field. One of stars, forks, or updated. Default: results are sorted by best match."
            }
          },
          {
            "name" : "order",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The sort order if sort parameter is provided. One of asc or desc. Default: desc"
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/search/#search-issues"
        },
        "displayName" : "/search/code",
        "path" : "/search/code",
        "httpMethod" : "GET",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "q",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The search terms."
            }
          },
          {
            "name" : "sort",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The sort field. Can only be indexed, which indicates how recently a file has been indexed by the GitHub search infrastructure. Default: results are sorted by best match."
            }
          },
          {
            "name" : "order",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The sort order if sort parameter is provided. One of asc or desc. Default: desc"
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/search/#search-issues"
        },
        "displayName" : "/search/issues",
        "path" : "/search/issues",
        "httpMethod" : "GET",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "q",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The search terms."
            }
          },
          {
            "name" : "sort",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The sort field. Can be comments, created, or updated. Default: results are sorted by best match."
            }
          },
          {
            "name" : "order",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The sort order if sort parameter is provided. One of asc or desc. Default: desc"
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/search/#search-issues"
        },
        "displayName" : "/search/users",
        "path" : "/search/users",
        "httpMethod" : "GET",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "q",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The search terms."
            }
          },
          {
            "name" : "sort",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The sort field. Can be followers, repositories, or joined.  Default: results are sorted by best match."
            }
          },
          {
            "name" : "order",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The sort order if sort parameter is provided. One of asc or desc. Default: desc"
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/search/#search-users"
        },
        "displayName" : "/search/repositories",
        "path" : "/search/repositories",
        "httpMethod" : "GET",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "q",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The search keywords, as well as any qualifiers."
            }
          },
          {
            "name" : "sort",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The sort field. One of stars, forks, or updated. Default: results are sorted by best match."
            }
          },
          {
            "name" : "order",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The sort order if sort parameter is provided. One of asc or desc. Default: desc"
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/search/#search-users"
        },
        "displayName" : "/search/code",
        "path" : "/search/code",
        "httpMethod" : "GET",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "q",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The search terms."
            }
          },
          {
            "name" : "sort",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The sort field. Can only be indexed, which indicates how recently a file has been indexed by the GitHub search infrastructure. Default: results are sorted by best match."
            }
          },
          {
            "name" : "order",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The sort order if sort parameter is provided. One of asc or desc. Default: desc"
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/search/#search-users"
        },
        "displayName" : "/search/issues",
        "path" : "/search/issues",
        "httpMethod" : "GET",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "q",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The search terms."
            }
          },
          {
            "name" : "sort",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The sort field. Can be comments, created, or updated. Default: results are sorted by best match."
            }
          },
          {
            "name" : "order",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The sort order if sort parameter is provided. One of asc or desc. Default: desc"
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/search/#search-users"
        },
        "displayName" : "/search/users",
        "path" : "/search/users",
        "httpMethod" : "GET",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "q",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The search terms."
            }
          },
          {
            "name" : "sort",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The sort field. Can be followers, repositories, or joined.  Default: results are sorted by best match."
            }
          },
          {
            "name" : "order",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The sort order if sort parameter is provided. One of asc or desc. Default: desc"
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/search/legacy/"
        },
        "displayName" : "/legacy/issues/search/:owner/:repository/:state/:keyword",
        "path" : "/legacy/issues/search/:owner/:repository/:state/:keyword",
        "httpMethod" : "GET",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "state",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Indicates the state of the issues to return. Can be either open or closed."
            }
          },
          {
            "name" : "keyword",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The search term."
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/search/legacy/"
        },
        "displayName" : "/legacy/repos/search/:keyword",
        "path" : "/legacy/repos/search/:keyword",
        "httpMethod" : "GET",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "keyword",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The search term"
            }
          },
          {
            "name" : "language",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "Filter results by language"
            }
          },
          {
            "name" : "start_page",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The page number to fetch"
            }
          },
          {
            "name" : "sort",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The sort field. One of stars, forks, or updated. Default: results are sorted by best match."
            }
          },
          {
            "name" : "order",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The sort field. if sort param is provided. Can be either asc or desc."
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/search/legacy/"
        },
        "displayName" : "/legacy/user/search/:keyword",
        "path" : "/legacy/user/search/:keyword",
        "httpMethod" : "GET",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "keyword",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The search term"
            }
          },
          {
            "name" : "start_page",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The page number to fetch"
            }
          },
          {
            "name" : "sort",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The sort field. One of stars, forks, or updated. Default: results are sorted by best match."
            }
          },
          {
            "name" : "order",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The sort field. if sort param is provided. Can be either asc or desc."
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/search/legacy/"
        },
        "displayName" : "/legacy/user/email/:email",
        "path" : "/legacy/user/email/:email",
        "httpMethod" : "GET",
        "params" : [
          {
            "name" : "",
            "style" : "body",
            "type" : "",
            "doc" : {
              "t" : ""
            }
          },
          {
            "name" : "email",
            "style" : "body",
            "type" : "string",
            "doc" : {
              "t" : "The email address"
            }
          }
        ]
      },
      {
        "doc" : {
          "t" : "List email addresses for a user",
          "url" : "http://developer.github.com/v3/users/emails/"
        },
        "displayName" : "/user/emails",
        "path" : "/user/emails",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Add email address(es)",
          "url" : "http://developer.github.com/v3/users/emails/"
        },
        "displayName" : "/user/emails",
        "path" : "/user/emails",
        "httpMethod" : "POST",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Delete email address(es)",
          "url" : "http://developer.github.com/v3/users/emails/"
        },
        "displayName" : "/user/emails",
        "path" : "/user/emails",
        "httpMethod" : "DELETE",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/users/followers/"
        },
        "displayName" : "/users/:user/followers",
        "path" : "/users/:user/followers",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/users/followers/"
        },
        "displayName" : "/user/followers",
        "path" : "/user/followers",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/users/followers/"
        },
        "displayName" : "/users/:user/following",
        "path" : "/users/:user/following",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/users/followers/"
        },
        "displayName" : "/user/following",
        "path" : "/user/following",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Check if you are following a user",
          "url" : "http://developer.github.com/v3/users/followers/"
        },
        "displayName" : "/user/following/:user",
        "path" : "/user/following/:user",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Check if one user follows another",
          "url" : "http://developer.github.com/v3/users/followers/"
        },
        "displayName" : "/users/:user/following/:target_user",
        "path" : "/users/:user/following/:target_user",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Follow a user",
          "url" : "http://developer.github.com/v3/users/followers/"
        },
        "displayName" : "/user/following/:user",
        "path" : "/user/following/:user",
        "httpMethod" : "PUT",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "Unfollow a user",
          "url" : "http://developer.github.com/v3/users/followers/"
        },
        "displayName" : "/user/following/:user",
        "path" : "/user/following/:user",
        "httpMethod" : "DELETE",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "List public keys for a user",
          "url" : "http://developer.github.com/v3/users/keys/"
        },
        "displayName" : "/users/:user/keys",
        "path" : "/users/:user/keys",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "List your public keys",
          "url" : "http://developer.github.com/v3/users/keys/"
        },
        "displayName" : "/user/keys",
        "path" : "/user/keys",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/users/keys/"
        },
        "displayName" : "/user/keys/:id",
        "path" : "/user/keys/:id",
        "httpMethod" : "GET",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/users/keys/"
        },
        "displayName" : "/user/keys",
        "path" : "/user/keys",
        "httpMethod" : "POST",
        "params" : [ ]
      },
      {
        "doc" : {
          "t" : "",
          "url" : "http://developer.github.com/v3/users/keys/"
        },
        "displayName" : "/user/keys/:id",
        "path" : "/user/keys/:id",
        "httpMethod" : "DELETE",
        "params" : [ ]
      },
      {
        "params" : [
          {
            "type" : "string",
            "style" : "body",
            "name" : "files"
          },
          {
            "type" : "string",
            "style" : "body",
            "name" : "description"
          },
          {
            "type" : "boolean",
            "style" : "body",
            "name" : "public"
          }
        ],
        "httpMethod" : "POST",
        "path" : "/gists",
        "displayName" : "/gists",
        "doc" : {
          "url" : "https://developer.github.com/v3/gists/#create-a-gist"
        }
      }
    ]
  },
  "auth_strategy" : "oauth",
  "documentation" : "http://developer.github.com/v3",
  "enabled" : true,
  "logo" : "http://www.grumpyco.in/wp-content/uploads/2014/03/github_logo_128x128.png",
  "logobw" : "http://qaidjacobs.com/wp-content/uploads/2012/11/github_icon-150x150.png",
  "name" : "Github",
  "oauth" : {
    "authTokenPath" : "/oauth/access_token",
    "authTokenURL" : "https://github.com/login",
    "baseURL" : "https://github.com/login",
    "clientId" : "affb37b61d8e598c8ac4",
    "secret" : "bd816507013bafa38571e94d9a1ef66fe7a19660",
    "tokenMethod" : "access_token",
    "version" : "2.0",
    "scope" : "user,repo,repo_deployment,notifications,gist"
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
