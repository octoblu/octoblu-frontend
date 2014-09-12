var record = {
    "auth_strategy": "oauth",
    "description": "",
    "documentation": "https://developer.github.com/v3/",
    "enabled": true,
    "logo": "http://www.revive-adserver.com/media/GitHub.jpg",
    "name": "Github",
    "application": {
        "base": "https://api.github.com",
        "resources": [
            {
                "path": "/events",
                "displayName": "/events",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/activity/events/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/repos/:owner/:repo/events",
                "displayName": "/repos/:owner/:repo/events",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/activity/events/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/repos/:owner/:repo/issues/events",
                "displayName": "/repos/:owner/:repo/issues/events",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/activity/events/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/networks/:owner/:repo/events",
                "displayName": "/networks/:owner/:repo/events",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/activity/events/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/orgs/:org/events",
                "displayName": "/orgs/:org/events",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/activity/events/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/users/:username/received_events",
                "displayName": "/users/:username/received_events",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/activity/events/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/users/:username/received_events/public",
                "displayName": "/users/:username/received_events/public",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/activity/events/"
                },
                "httpMethod": "GET"
            },
            {
                "displayName": "/users/:username/events",
                "path": "/users/:username/events",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/activity/events/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/users/:username/events/public",
                "displayName": "/users/:username/events/public",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/activity/events/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/users/:username/events/orgs/:org",
                "displayName": "/users/:username/events/orgs/:org",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/activity/events/"
                },
                "httpMethod": "GET"
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/activity/feeds/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/feeds",
                "path": "/feeds"
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/activity/notifications/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/notifications",
                "path": "/notifications",
                "params": [
                    {
                        "name": "all",
                        "style": "query",
                        "type": "boolean",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "participating",
                        "style": "query",
                        "type": "boolean",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "since",
                        "style": "query",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    }
                ]
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/activity/notifications/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/notifications",
                "path": "/repos/:owner/:repo/notifications",
                "params": [
                    {
                        "name": "all",
                        "style": "query",
                        "type": "boolean",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "participating",
                        "style": "query",
                        "type": "boolean",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "since",
                        "style": "query",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    }
                ]
            },
            {
                "httpMethod": "PUT",
                "doc": {
                    "url": "https://developer.github.com/v3/activity/notifications/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/notifications",
                "path": "/notifications",
                "params": [
                    {
                        "name": "last_read_at",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    }
                ]
            },
            {
                "httpMethod": "PUT",
                "doc": {
                    "url": "https://developer.github.com/v3/activity/notifications/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/notifications",
                "path": "/repos/:owner/:repo/notifications",
                "params": [
                    {
                        "name": "last_read_at",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    }
                ]
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/activity/notifications/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/notifications/threads/:id",
                "path": "/notifications/threads/:id"
            },
            {
                "httpMethod": "PUT",
                "doc": {
                    "url": "https://developer.github.com/v3/activity/notifications/",
                    "t": "PATCH"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/notifications/threads/:id",
                "path": "/notifications/threads/:id"
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/activity/notifications/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/notifications/threads/:id/subscription",
                "path": "/notifications/threads/:id/subscription"
            },
            {
                "httpMethod": "PUT",
                "doc": {
                    "url": "https://developer.github.com/v3/activity/notifications/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/notifications/threads/:id/subscription",
                "path": "/notifications/threads/:id/subscription",
                "params": [
                    {
                        "name": "subscribed",
                        "style": "body",
                        "type": "boolean",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "ignored",
                        "style": "body",
                        "type": "boolean",
                        "value": "",
                        "required": "false"
                    }
                ]
            },
            {
                "httpMethod": "DELETE",
                "doc": {
                    "url": "https://developer.github.com/v3/activity/notifications/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/notifications/threads/:id/subscription",
                "path": "/notifications/threads/:id/subscription"
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/activity/starring/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/stargazers",
                "path": "/repos/:owner/:repo/stargazers"
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/activity/starring/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/users/:username/starred",
                "path": "/users/:username/starred"
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/activity/starring/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/user/starred",
                "path": "/user/starred",
                "params": [
                    {
                        "name": "sort",
                        "style": "query",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "direction",
                        "style": "query",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    }
                ]
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/activity/starring/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/user/starred/:owner/:repo",
                "path": "/user/starred/:owner/:repo"
            },
            {
                "httpMethod": "PUT",
                "doc": {
                    "url": "https://developer.github.com/v3/activity/starring/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/user/starred/:owner/:repo",
                "path": "/user/starred/:owner/:repo"
            },
            {
                "httpMethod": "DELETE",
                "doc": {
                    "url": "https://developer.github.com/v3/activity/starring/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/user/starred/:owner/:repo",
                "path": "/user/starred/:owner/:repo"
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/activity/watching/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/subscribers",
                "path": "/repos/:owner/:repo/subscribers"
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/activity/watching/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/users/:username/subscriptions",
                "path": "/users/:username/subscriptions"
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/activity/watching/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/user/subscriptions",
                "path": "/user/subscriptions"
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/activity/watching/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/subscription",
                "path": "/repos/:owner/:repo/subscription"
            },
            {
                "httpMethod": "PUT",
                "doc": {
                    "url": "https://developer.github.com/v3/activity/watching/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/subscription",
                "path": "/repos/:owner/:repo/subscription",
                "params": [
                    {
                        "name": "subscribed",
                        "style": "body",
                        "type": "boolean",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "ignored",
                        "style": "body",
                        "type": "boolean",
                        "value": "",
                        "required": "false"
                    }
                ]
            },
            {
                "httpMethod": "DELETE",
                "doc": {
                    "url": "https://developer.github.com/v3/activity/watching/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/subscription",
                "path": "/repos/:owner/:repo/subscription"
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/activity/watching/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/user/subscriptions/:owner/:repo",
                "path": "/user/subscriptions/:owner/:repo"
            },
            {
                "httpMethod": "PUT",
                "doc": {
                    "url": "https://developer.github.com/v3/activity/watching/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/user/subscriptions/:owner/:repo",
                "path": "/user/subscriptions/:owner/:repo"
            },
            {
                "httpMethod": "DELETE",
                "doc": {
                    "url": "https://developer.github.com/v3/activity/watching/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/user/subscriptions/:owner/:repo",
                "path": "/user/subscriptions/:owner/:repo"
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/gists/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/users/:username/gists",
                "path": "/users/:username/gists"
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/gists/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/gists",
                "path": "/gists"
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/gists/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/gists/public",
                "path": "/gists/public"
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/gists/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/gists/starred",
                "path": "/gists/starred",
                "params": [
                    {
                        "name": "since",
                        "style": "query",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "",
                        "style": "",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    }
                ]
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/gists/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/gists/:id",
                "path": "/gists/:id"
            },
            {
                "httpMethod": "POST",
                "doc": {
                    "url": "https://developer.github.com/v3/gists/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/gists",
                "path": "/gists",
                "params": [
                    {
                        "name": "files",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "true"
                    },
                    {
                        "name": "description",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "public",
                        "style": "body",
                        "type": "boolean",
                        "value": "",
                        "required": "false"
                    }
                ]
            },
            {
                "httpMethod": "PUT",
                "doc": {
                    "t": "patch",
                    "url": "https://developer.github.com/v3/gists/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/gists/:id",
                "path": "/gists/:id",
                "params": [
                    {
                        "name": "description",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "files",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "content",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "filename",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    }
                ]
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/gists/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/gists/:id/commits",
                "path": "/gists/:id/commits"
            },
            {
                "httpMethod": "PUT",
                "doc": {
                    "url": "https://developer.github.com/v3/gists/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/gists/:id/star",
                "path": "/gists/:id/star"
            },
            {
                "httpMethod": "DELETE",
                "doc": {
                    "url": "https://developer.github.com/v3/gists/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/gists/:id/star",
                "path": "/gists/:id/star"
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/gists/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/gists/:id/star",
                "path": "/gists/:id/star"
            },
            {
                "httpMethod": "POST",
                "doc": {
                    "url": "https://developer.github.com/v3/gists/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/gists/:id/forks",
                "path": "/gists/:id/forks"
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/gists/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/gists/:id/forks",
                "path": "/gists/:id/forks"
            },
            {
                "httpMethod": "DELETE",
                "doc": {
                    "url": "https://developer.github.com/v3/gists/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/gists/:id",
                "path": "/gists/:id"
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/gists/comments/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/gists/:gist_id/comments",
                "path": "/gists/:gist_id/comments"
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/gists/comments/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/gists/:gist_id/comments/:id",
                "path": "/gists/:gist_id/comments/:id"
            },
            {
                "httpMethod": "POST",
                "doc": {
                    "url": "https://developer.github.com/v3/gists/comments/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/gists/:gist_id/comments",
                "path": "/gists/:gist_id/comments",
                "params": [
                    {
                        "name": "body",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "true"
                    }
                ]
            },
            {
                "httpMethod": "PUT",
                "doc": {
                    "t": "patch",
                    "url": "https://developer.github.com/v3/gists/comments/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/gists/:gist_id/comments/:id",
                "path": "/gists/:gist_id/comments/:id",
                "params": [
                    {
                        "name": "body",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "true"
                    }
                ]
            },
            {
                "httpMethod": "DELETE",
                "doc": {
                    "url": "https://developer.github.com/v3/gists/comments/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/gists/:gist_id/comments/:id",
                "path": "/gists/:gist_id/comments/:id"
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/git/blobs/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/git/blobs/:sha",
                "path": "/repos/:owner/:repo/git/blobs/:sha"
            },
            {
                "httpMethod": "POST",
                "doc": {
                    "url": "https://developer.github.com/v3/git/blobs/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/git/blobs",
                "path": "/repos/:owner/:repo/git/blobs"
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/git/commits/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/git/commits/:sha",
                "path": "/repos/:owner/:repo/git/commits/:sha"
            },
            {
                "httpMethod": "POST",
                "doc": {
                    "url": "https://developer.github.com/v3/git/commits/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/git/commits",
                "path": "/repos/:owner/:repo/git/commits",
                "params": [
                    {
                        "name": "message",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "true"
                    },
                    {
                        "name": "tree",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "true"
                    },
                    {
                        "name": "parents",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "true"
                    },
                    {
                        "name": "name",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "email",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "date",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    }
                ]
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/git/refs/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/git/refs/:ref",
                "path": "/repos/:owner/:repo/git/refs/:ref"
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/git/refs/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/git/refs/heads/skunkworkz/featureA",
                "path": "/repos/:owner/:repo/git/refs/heads/skunkworkz/featureA"
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/git/refs/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/git/refs",
                "path": "/repos/:owner/:repo/git/refs"
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/git/refs/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/git/refs/tags",
                "path": "/repos/:owner/:repo/git/refs/tags"
            },
            {
                "httpMethod": "POST",
                "doc": {
                    "url": "https://developer.github.com/v3/git/refs/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/git/refs",
                "path": "/repos/:owner/:repo/git/refs",
                "params": [
                    {
                        "name": "ref",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "sha",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    }
                ]
            },
            {
                "httpMethod": "PUT",
                "doc": {
                    "t": "patch",
                    "url": "https://developer.github.com/v3/git/refs/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/git/refs/:ref",
                "path": "/repos/:owner/:repo/git/refs/:ref",
                "params": [
                    {
                        "name": "sha",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "force",
                        "style": "body",
                        "type": "boolean",
                        "value": "",
                        "required": "false"
                    }
                ]
            },
            {
                "httpMethod": "DELETE",
                "doc": {
                    "url": "https://developer.github.com/v3/git/refs/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/git/refs/:ref",
                "path": "/repos/:owner/:repo/git/refs/:ref"
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/git/tags/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/git/tags/:sha",
                "path": "/repos/:owner/:repo/git/tags/:sha"
            },
            {
                "httpMethod": "POST",
                "doc": {
                    "url": "https://developer.github.com/v3/git/tags/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/git/tags",
                "path": "/repos/:owner/:repo/git/tags",
                "params": [
                    {
                        "name": "tag",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "message",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "object",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "type",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "tagger",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "name",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "email",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "date",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    }
                ]
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/git/trees/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/git/trees/:sha",
                "path": "/repos/:owner/:repo/git/trees/:sha"
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/git/trees/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/git/trees/:sha?recursive=1",
                "path": "/repos/:owner/:repo/git/trees/:sha?recursive=1"
            },
            {
                "httpMethod": "POST",
                "doc": {
                    "url": "https://developer.github.com/v3/git/trees/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/git/trees",
                "path": "/repos/:owner/:repo/git/trees",
                "params": [
                    {
                        "name": "tree",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "true"
                    },
                    {
                        "name": "base_tree",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "path",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "mode",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "type",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "sha",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "content",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    }
                ]
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/issues/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/issues",
                "path": "/issues"
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/issues/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/user/issues",
                "path": "/user/issues"
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/issues/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/orgs/:org/issues",
                "path": "/orgs/:org/issues",
                "params": [
                    {
                        "name": "filter",
                        "style": "query",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "state",
                        "style": "query",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "labels",
                        "style": "query",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "sort",
                        "style": "query",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "direction",
                        "style": "query",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "since",
                        "style": "query",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    }
                ]
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/issues/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/issues",
                "path": "/repos/:owner/:repo/issues",
                "params": [
                    {
                        "name": "milestone",
                        "style": "query",
                        "type": "number",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "state",
                        "style": "query",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "assignee",
                        "style": "query",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "creator",
                        "style": "query",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "mentioned",
                        "style": "query",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "labels",
                        "style": "query",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "sort",
                        "style": "query",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "direction",
                        "style": "query",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "since",
                        "style": "query",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    }
                ]
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/issues/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/issues/:number",
                "path": "/repos/:owner/:repo/issues/:number"
            },
            {
                "httpMethod": "POST",
                "doc": {
                    "url": "https://developer.github.com/v3/issues/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/issues",
                "path": "/repos/:owner/:repo/issues",
                "params": [
                    {
                        "name": "title",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "body",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "assignee",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "milestone",
                        "style": "body",
                        "type": "number",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "labels",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    }
                ]
            },
            {
                "httpMethod": "PUT",
                "doc": {
                    "t": "patch",
                    "url": "https://developer.github.com/v3/issues/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/issues/:number",
                "path": "/repos/:owner/:repo/issues/:number",
                "params": [
                    {
                        "name": "title",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "body",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "assignee",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "state",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "milestone",
                        "style": "body",
                        "type": "number",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "labels",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    }
                ]
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/issues/assignees/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/assignees",
                "path": "/repos/:owner/:repo/assignees"
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/issues/assignees/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/assignees/:assignee",
                "path": "/repos/:owner/:repo/assignees/:assignee"
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/issues/comments/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/issues/:number/comments",
                "path": "/repos/:owner/:repo/issues/:number/comments"
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/issues/comments/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/issues/comments",
                "path": "/repos/:owner/:repo/issues/comments",
                "params": [
                    {
                        "name": "sort",
                        "style": "query",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "direction",
                        "style": "query",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    },
                    {
                        "name": "since",
                        "style": "query",
                        "type": "string",
                        "value": "",
                        "required": "false"
                    }
                ]
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/issues/comments/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/issues/comments/:id",
                "path": "/repos/:owner/:repo/issues/comments/:id"
            },
            {
                "httpMethod": "POST",
                "doc": {
                    "url": "https://developer.github.com/v3/issues/comments/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/issues/:number/comments",
                "path": "/repos/:owner/:repo/issues/:number/comments",
                "params": [
                    {
                        "name": "body",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "true"
                    }
                ]
            },
            {
                "httpMethod": "PUT",
                "doc": {
                    "t": "patch",
                    "url": "https://developer.github.com/v3/issues/comments/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/issues/comments/:id",
                "path": "/repos/:owner/:repo/issues/comments/:id",
                "params": [
                    {
                        "name": "body",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "true"
                    }
                ]
            },
            {
                "httpMethod": "DELETE",
                "doc": {
                    "url": "https://developer.github.com/v3/issues/comments/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/issues/comments/:id",
                "path": "/repos/:owner/:repo/issues/comments/:id"
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/issues/events/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/issues/:issue_number/events",
                "path": "/repos/:owner/:repo/issues/:issue_number/events"
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/issues/events/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/issues/events",
                "path": "/repos/:owner/:repo/issues/events"
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/issues/events/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/issues/events/:id",
                "path": "/repos/:owner/:repo/issues/events/:id"
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/issues/labels/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/labels",
                "path": "/repos/:owner/:repo/labels"
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/issues/labels/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/labels/:name",
                "path": "/repos/:owner/:repo/labels/:name"
            },
            {
                "httpMethod": "POST",
                "doc": {
                    "url": "https://developer.github.com/v3/issues/labels/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/labels",
                "path": "/repos/:owner/:repo/labels",
                "params": [
                    {
                        "name": "name",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "true"
                    },
                    {
                        "name": "color",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "true"
                    }
                ]
            },
            {
                "httpMethod": "PUT",
                "doc": {
                    "url": "https://developer.github.com/v3/issues/labels/",
                    "t": "patch"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/labels/:name",
                "path": "/repos/:owner/:repo/labels/:name",
                "params": [
                    {
                        "name": "name",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "true"
                    },
                    {
                        "name": "color",
                        "style": "body",
                        "type": "string",
                        "value": "",
                        "required": "true"
                    }
                ]
            },
            {
                "httpMethod": "DELETE",
                "doc": {
                    "url": "https://developer.github.com/v3/issues/labels/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/labels/:name",
                "path": "/repos/:owner/:repo/labels/:name"
            },
            {
                "httpMethod": "GET",
                "doc": {
                    "url": "https://developer.github.com/v3/issues/labels/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/issues/:number/labels",
                "path": "/repos/:owner/:repo/issues/:number/labels"
            },
            {
                "httpMethod": "POST",
                "doc": {
                    "url": "https://developer.github.com/v3/issues/labels/"
                },
                "authentication": {
                    "required": "true"
                },
                "displayName": "/repos/:owner/:repo/issues/:number/labels",
                "path": "/repos/:owner/:repo/issues/:number/labels"
            },
            {
                "path": "/repos/:owner/:repo/issues/:number/labels/:name",
                "displayName": "/repos/:owner/:repo/issues/:number/labels/:name",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/issues/labels/"
                },
                "httpMethod": "DELETE"
            },
            {
                "path": "/repos/:owner/:repo/issues/:number/labels",
                "displayName": "/repos/:owner/:repo/issues/:number/labels",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/issues/labels/"
                },
                "httpMethod": "PUT"
            },
            {
                "path": "/repos/:owner/:repo/issues/:number/labels",
                "displayName": "/repos/:owner/:repo/issues/:number/labels",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/issues/labels/"
                },
                "httpMethod": "DELETE"
            },
            {
                "path": "/repos/:owner/:repo/milestones/:number/labels",
                "displayName": "/repos/:owner/:repo/milestones/:number/labels",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/issues/labels/"
                },
                "httpMethod": "GET"
            },
            {
                "params": [
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "state"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "sort"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "direction"
                    }
                ],
                "path": "/repos/:owner/:repo/milestones",
                "displayName": "/repos/:owner/:repo/milestones",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/issues/milestones/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/repos/:owner/:repo/milestones/:number",
                "displayName": "/repos/:owner/:repo/milestones/:number",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/issues/milestones/"
                },
                "httpMethod": "GET"
            },
            {
                "params": [
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "title"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "state"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "description"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "due_on"
                    }
                ],
                "path": "/repos/:owner/:repo/milestones",
                "displayName": "/repos/:owner/:repo/milestones",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/issues/milestones/"
                },
                "httpMethod": "POST"
            },
            {
                "params": [
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "title"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "state"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "description"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "due_on"
                    }
                ],
                "path": "/repos/:owner/:repo/milestones/:number",
                "displayName": "/repos/:owner/:repo/milestones/:number",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/issues/milestones/",
                    "t": "patch"
                },
                "httpMethod": "PUT"
            },
            {
                "path": "/repos/:owner/:repo/milestones/:number",
                "displayName": "/repos/:owner/:repo/milestones/:number",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/issues/milestones/"
                },
                "httpMethod": "DELETE"
            },
            {
                "path": "/emojis",
                "displayName": "/emojis",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/emojis/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/gitignore/templates",
                "displayName": "/gitignore/templates",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/gitignore/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/gitignore/templates/C",
                "displayName": "/gitignore/templates/C",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/gitignore/"
                },
                "httpMethod": "GET"
            },
            {
                "params": [
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "text"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "mode"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "context"
                    }
                ],
                "path": "/markdown",
                "displayName": "/markdown",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/markdown/"
                },
                "httpMethod": "POST"
            },
            {
                "path": "/markdown/raw",
                "displayName": "/markdown/raw",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/markdown/"
                },
                "httpMethod": "POST"
            },
            {
                "params": [
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "hooks"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "git"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "boolean",
                        "style": "query",
                        "name": "verifiable_password_authentication"
                    }
                ],
                "path": "/meta",
                "displayName": "/meta",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/meta/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/rate_limit",
                "displayName": "/rate_limit",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/rate_limit/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/users/:username/orgs",
                "displayName": "/users/:username/orgs",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/orgs/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/user/orgs",
                "displayName": "/user/orgs",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/orgs/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/orgs/:org",
                "displayName": "/orgs/:org",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/orgs/"
                },
                "httpMethod": "GET"
            },
            {
                "params": [
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "billing_email"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "company"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "email"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "location"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "name"
                    }
                ],
                "path": "/orgs/:org",
                "displayName": "/orgs/:org",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "t": "patch",
                    "url": "https://developer.github.com/v3/orgs/"
                },
                "httpMethod": "PUT"
            },
            {
                "params": [
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "filter"
                    }
                ],
                "path": "/orgs/:org/members",
                "displayName": "/orgs/:org/members",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/orgs/members/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/orgs/:org/members/:username",
                "displayName": "/orgs/:org/members/:username",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/orgs/members/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/orgs/:org/members/:username",
                "displayName": "/orgs/:org/members/:username",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/orgs/members/"
                },
                "httpMethod": "DELETE"
            },
            {
                "path": "/orgs/:org/public_members",
                "displayName": "/orgs/:org/public_members",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/orgs/members/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/orgs/:org/public_members/:username",
                "displayName": "/orgs/:org/public_members/:username",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/orgs/members/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/orgs/:org/public_members/:username",
                "displayName": "/orgs/:org/public_members/:username",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/orgs/members/"
                },
                "httpMethod": "PUT"
            },
            {
                "path": "/orgs/:org/public_members/:username",
                "displayName": "/orgs/:org/public_members/:username",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/orgs/members/"
                },
                "httpMethod": "DELETE"
            },
            {
                "path": "/user/memberships/orgs/:org",
                "displayName": "/user/memberships/orgs/:org",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/orgs/members/"
                },
                "httpMethod": "GET"
            },
            {
                "params": [
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "state"
                    }
                ],
                "path": "/user/memberships/orgs/:org",
                "displayName": "/user/memberships/orgs/:org",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/orgs/members/",
                    "t": "patch"
                },
                "httpMethod": "PUT"
            },
            {
                "params": [
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "state"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "head"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "base"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "sort"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "direction"
                    }
                ],
                "path": "/repos/:owner/:repo/pulls",
                "displayName": "/repos/:owner/:repo/pulls",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/pulls/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/repos/:owner/:repo/pulls/:number",
                "displayName": "/repos/:owner/:repo/pulls/:number",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/pulls/"
                },
                "httpMethod": "GET"
            },
            {
                "params": [
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "title"
                    },
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "head"
                    },
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "base"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "body"
                    },
                    {
                        "required": "true",
                        "value": "",
                        "type": "number",
                        "style": "body",
                        "name": "issue"
                    }
                ],
                "path": "/repos/:owner/:repo/pulls",
                "displayName": "/repos/:owner/:repo/pulls",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/pulls/"
                },
                "httpMethod": "POST"
            },
            {
                "params": [
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "title"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "body"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "state"
                    }
                ],
                "path": "/repos/:owner/:repo/pulls/:number",
                "displayName": "/repos/:owner/:repo/pulls/:number",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/pulls/",
                    "t": "patch"
                },
                "httpMethod": "PUT"
            },
            {
                "path": "/repos/:owner/:repo/pulls/:number/commits",
                "displayName": "/repos/:owner/:repo/pulls/:number/commits",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/pulls/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/repos/:owner/:repo/pulls/:number/files",
                "displayName": "/repos/:owner/:repo/pulls/:number/files",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/pulls/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/repos/:owner/:repo/pulls/:number/merge",
                "displayName": "/repos/:owner/:repo/pulls/:number/merge",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/pulls/"
                },
                "httpMethod": "GET"
            },
            {
                "params": [
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "commit_message"
                    }
                ],
                "path": "/repos/:owner/:repo/pulls/:number/merge",
                "displayName": "/repos/:owner/:repo/pulls/:number/merge",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/pulls/"
                },
                "httpMethod": "PUT"
            },
            {
                "path": "/repos/:owner/:repo/pulls/:number/comments",
                "displayName": "/repos/:owner/:repo/pulls/:number/comments",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/pulls/comments/"
                },
                "httpMethod": "GET"
            },
            {
                "params": [
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "sort"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "direction"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "since"
                    }
                ],
                "path": "/repos/:owner/:repo/pulls/comments",
                "displayName": "/repos/:owner/:repo/pulls/comments",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/pulls/comments/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/repos/:owner/:repo/pulls/comments/:number",
                "displayName": "/repos/:owner/:repo/pulls/comments/:number",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/pulls/comments/"
                },
                "httpMethod": "GET"
            },
            {
                "params": [
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "body"
                    },
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "commit_id"
                    },
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "path"
                    },
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "position"
                    },
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "body"
                    },
                    {
                        "required": "true",
                        "value": "",
                        "type": "number",
                        "style": "body",
                        "name": "in_reply_to"
                    }
                ],
                "path": "/repos/:owner/:repo/pulls/:number/comments",
                "displayName": "/repos/:owner/:repo/pulls/:number/comments",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/pulls/comments/"
                },
                "httpMethod": "POST"
            },
            {
                "params": [
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "body"
                    }
                ],
                "path": "/repos/:owner/:repo/pulls/comments/:number",
                "displayName": "/repos/:owner/:repo/pulls/comments/:number",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/pulls/comments/",
                    "t": "patch"
                },
                "httpMethod": "PUT"
            },
            {
                "path": "/repos/:owner/:repo/pulls/comments/:number",
                "displayName": "/repos/:owner/:repo/pulls/comments/:number",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/pulls/comments/"
                },
                "httpMethod": "DELETE"
            },
            {
                "params": [
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "type"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "sort"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "direction"
                    }
                ],
                "path": "/user/repos",
                "displayName": "/user/repos",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/"
                },
                "httpMethod": "GET"
            },
            {
                "params": [
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "type"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "sort"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "direction"
                    }
                ],
                "path": "/users/:username/repos",
                "displayName": "/users/:username/repos",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/"
                },
                "httpMethod": "GET"
            },
            {
                "params": [
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "type"
                    }
                ],
                "path": "/orgs/:org/repos",
                "displayName": "/orgs/:org/repos",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/"
                },
                "httpMethod": "GET"
            },
            {
                "params": [
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "since"
                    }
                ],
                "path": "/repositories",
                "displayName": "/repositories",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/user/repos",
                "displayName": "/user/repos",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/"
                },
                "httpMethod": "POST"
            },
            {
                "params": [
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "name"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "description"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "homepage"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "boolean",
                        "style": "body",
                        "name": "private"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "boolean",
                        "style": "body",
                        "name": "has_issues"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "boolean",
                        "style": "body",
                        "name": "has_wiki"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "boolean",
                        "style": "body",
                        "name": "has_downloads"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "number",
                        "style": "body",
                        "name": "team_id"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "boolean",
                        "style": "body",
                        "name": "auto_init"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "gitignore_template"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "license_template"
                    }
                ],
                "path": "/orgs/:org/repos",
                "displayName": "/orgs/:org/repos",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/"
                },
                "httpMethod": "POST"
            },
            {
                "path": "/repos/:owner/:repo",
                "displayName": "/repos/:owner/:repo",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/repositories/:id",
                "displayName": "/repositories/:id",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/"
                },
                "httpMethod": "GET"
            },
            {
                "params": [
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "name"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "description"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "homepage"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "boolean",
                        "style": "body",
                        "name": "private"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "boolean",
                        "style": "body",
                        "name": "has_issues"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "boolean",
                        "style": "body",
                        "name": "has_wiki"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "boolean",
                        "style": "body",
                        "name": "has_downloads"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "default_branch"
                    }
                ],
                "path": "/repos/:owner/:repo",
                "displayName": "/repos/:owner/:repo",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/",
                    "t": "patch"
                },
                "httpMethod": "PUT"
            },
            {
                "params": [
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "anon"
                    }
                ],
                "path": "/repos/:owner/:repo/contributors",
                "displayName": "/repos/:owner/:repo/contributors",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/repos/:owner/:repo/languages",
                "displayName": "/repos/:owner/:repo/languages",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/repos/:owner/:repo/teams",
                "displayName": "/repos/:owner/:repo/teams",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/repos/:owner/:repo/tags",
                "displayName": "/repos/:owner/:repo/tags",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/repos/:owner/:repo/branches",
                "displayName": "/repos/:owner/:repo/branches",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/repos/:owner/:repo/branches/:branch",
                "displayName": "/repos/:owner/:repo/branches/:branch",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/repos/:owner/:repo",
                "displayName": "/repos/:owner/:repo",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/"
                },
                "httpMethod": "DELETE"
            },
            {
                "path": "/repos/:owner/:repo/collaborators",
                "displayName": "/repos/:owner/:repo/collaborators",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/collaborators/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/repos/:owner/:repo/collaborators/:username",
                "displayName": "/repos/:owner/:repo/collaborators/:username",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/collaborators/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/repos/:owner/:repo/collaborators/:username",
                "displayName": "/repos/:owner/:repo/collaborators/:username",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/collaborators/"
                },
                "httpMethod": "PUT"
            },
            {
                "displayName": "/repos/:owner/:repo/collaborators/:username",
                "path": "/repos/:owner/:repo/collaborators/:username",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/collaborators/"
                },
                "httpMethod": "DELETE"
            },
            {
                "path": "/repos/:owner/:repo/comments",
                "displayName": "/repos/:owner/:repo/comments",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/comments/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/repos/:owner/:repo/commits/:ref/comments",
                "displayName": "/repos/:owner/:repo/commits/:ref/comments",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/comments/"
                },
                "httpMethod": "GET"
            },
            {
                "params": [
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "sha"
                    },
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "body"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "path"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "number",
                        "style": "body",
                        "name": "position"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "number",
                        "style": "body",
                        "name": "line"
                    }
                ],
                "path": "/repos/:owner/:repo/commits/:sha/comments",
                "displayName": "/repos/:owner/:repo/commits/:sha/comments",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/comments/"
                },
                "httpMethod": "POST"
            },
            {
                "path": "/repos/:owner/:repo/comments/:id",
                "displayName": "/repos/:owner/:repo/comments/:id",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/comments/"
                },
                "httpMethod": "GET"
            },
            {
                "params": [
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "body"
                    }
                ],
                "path": "/repos/:owner/:repo/comments/:id",
                "displayName": "/repos/:owner/:repo/comments/:id",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "t": "patch",
                    "url": "https://developer.github.com/v3/repos/comments/"
                },
                "httpMethod": "PUT"
            },
            {
                "path": "/repos/:owner/:repo/comments/:id",
                "displayName": "/repos/:owner/:repo/comments/:id",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/comments/"
                },
                "httpMethod": "DELETE"
            },
            {
                "params": [
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "sha"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "path"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "author"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "since"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "until"
                    }
                ],
                "path": "/repos/:owner/:repo/commits",
                "displayName": "/repos/:owner/:repo/commits",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/commits/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/repos/:owner/:repo/commits/:sha",
                "displayName": "/repos/:owner/:repo/commits/:sha",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/commits/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/repos/:owner/:repo/compare/:base...:head",
                "displayName": "/repos/:owner/:repo/compare/:base...:head",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/commits/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/repos/:owner/:repo/compare/user1:branchname...user2:branchname",
                "displayName": "/repos/:owner/:repo/compare/user1:branchname...user2:branchname",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/commits/"
                },
                "httpMethod": "GET"
            },
            {
                "params": [
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "ref"
                    }
                ],
                "path": "/repos/:owner/:repo/readme",
                "displayName": "/repos/:owner/:repo/readme",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/contents/"
                },
                "httpMethod": "GET"
            },
            {
                "params": [
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "path"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "ref"
                    }
                ],
                "path": "/repos/:owner/:repo/contents/:path",
                "displayName": "/repos/:owner/:repo/contents/:path",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/contents/"
                },
                "httpMethod": "GET"
            },
            {
                "params": [
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "path"
                    },
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "message"
                    },
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "content"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "branch"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "name"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "email"
                    }
                ],
                "path": "/repos/:owner/:repo/contents/:path",
                "displayName": "/repos/:owner/:repo/contents/:path",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/contents/"
                },
                "httpMethod": "PUT"
            },
            {
                "params": [
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "path"
                    },
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "message"
                    },
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "content"
                    },
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "sha"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "branch"
                    }
                ],
                "path": "/repos/:owner/:repo/contents/:path",
                "displayName": "/repos/:owner/:repo/contents/:path",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/contents/"
                },
                "httpMethod": "PUT"
            },
            {
                "params": [
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "",
                        "name": "path"
                    },
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "",
                        "name": "message"
                    },
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "",
                        "name": "sha"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "",
                        "name": "branch"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "",
                        "name": "name"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "",
                        "name": "email"
                    }
                ],
                "path": "/repos/:owner/:repo/contents/:path",
                "displayName": "/repos/:owner/:repo/contents/:path",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/contents/"
                },
                "httpMethod": "DELETE"
            },
            {
                "params": [
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "archive_format"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "ref"
                    }
                ],
                "path": "/repos/:owner/:repo/:archive_format/:ref",
                "displayName": "/repos/:owner/:repo/:archive_format/:ref",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/contents/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/repos/:owner/:repo/keys",
                "displayName": "/repos/:owner/:repo/keys",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/keys/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/repos/:owner/:repo/keys/:id",
                "displayName": "/repos/:owner/:repo/keys/:id",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/keys/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/repos/:owner/:repo/keys",
                "displayName": "/repos/:owner/:repo/keys",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/keys/"
                },
                "httpMethod": "POST"
            },
            {
                "path": "/repos/:owner/:repo/keys/:id",
                "displayName": "/repos/:owner/:repo/keys/:id",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/keys/"
                },
                "httpMethod": "DELETE"
            },
            {
                "params": [
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "sha"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "ref"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "task"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "environment"
                    }
                ],
                "path": "/repos/:owner/:repo/deployments",
                "displayName": "/repos/:owner/:repo/deployments",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/deployments/"
                },
                "httpMethod": "GET"
            },
            {
                "params": [
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "ref"
                    },
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "task"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "boolean",
                        "style": "body",
                        "name": "auto_merge"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "required_contexts"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "payload"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "environment"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "description"
                    }
                ],
                "path": "/repos/:owner/:repo/deployments",
                "displayName": "/repos/:owner/:repo/deployments",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/deployments/"
                },
                "httpMethod": "POST"
            },
            {
                "params": [
                    {
                        "required": "true",
                        "value": "",
                        "type": "number",
                        "style": "query",
                        "name": "id"
                    }
                ],
                "path": "/repos/:owner/:repo/deployments/:id/statuses",
                "displayName": "/repos/:owner/:repo/deployments/:id/statuses",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/deployments/"
                },
                "httpMethod": "GET"
            },
            {
                "params": [
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "state"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "target_url"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "description"
                    }
                ],
                "path": "/repos/:owner/:repo/deployments/:id/statuses",
                "displayName": "/repos/:owner/:repo/deployments/:id/statuses",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/deployments/"
                },
                "httpMethod": "POST"
            },
            {
                "path": "/repos/:owner/:repo/downloads",
                "displayName": "/repos/:owner/:repo/downloads",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/downloads/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/repos/:owner/:repo/downloads/:id",
                "displayName": "/repos/:owner/:repo/downloads/:id",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/downloads/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/repos/:owner/:repo/downloads/:id",
                "displayName": "/repos/:owner/:repo/downloads/:id",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/downloads/"
                },
                "httpMethod": "DELETE"
            },
            {
                "params": [
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "sort"
                    }
                ],
                "path": "/repos/:owner/:repo/forks",
                "displayName": "/repos/:owner/:repo/forks",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/forks/"
                },
                "httpMethod": "GET"
            },
            {
                "params": [
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "organization"
                    }
                ],
                "path": "/repos/:owner/:repo/forks",
                "displayName": "/repos/:owner/:repo/forks",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/forks/"
                },
                "httpMethod": "POST"
            },
            {
                "path": "/repos/:owner/:repo/hooks",
                "displayName": "/repos/:owner/:repo/hooks",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/hooks/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/repos/:owner/:repo/hooks/:id",
                "displayName": "/repos/:owner/:repo/hooks/:id",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/hooks/"
                },
                "httpMethod": "GET"
            },
            {
                "params": [
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "name"
                    },
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "config"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "events"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "active"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "",
                        "name": ""
                    }
                ],
                "path": "/repos/:owner/:repo/hooks",
                "displayName": "/repos/:owner/:repo/hooks",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/hooks/"
                },
                "httpMethod": "POST"
            },
            {
                "params": [
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "config"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "events"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "add_events"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "remove_events"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "boolean",
                        "style": "body",
                        "name": "active"
                    }
                ],
                "path": "/repos/:owner/:repo/hooks/:id",
                "displayName": "/repos/:owner/:repo/hooks/:id",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/hooks/",
                    "t": "patch"
                },
                "httpMethod": "PUT"
            },
            {
                "path": "/repos/:owner/:repo/hooks/:id/tests",
                "displayName": "/repos/:owner/:repo/hooks/:id/tests",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/hooks/"
                },
                "httpMethod": "POST"
            },
            {
                "path": "/repos/:owner/:repo/hooks/:id/pings",
                "displayName": "/repos/:owner/:repo/hooks/:id/pings",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/hooks/"
                },
                "httpMethod": "POST"
            },
            {
                "path": "/repos/:owner/:repo/hooks/:id",
                "displayName": "/repos/:owner/:repo/hooks/:id",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/hooks/"
                },
                "httpMethod": "DELETE"
            },
            {
                "params": [
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "base"
                    },
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "head"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "commit_message"
                    }
                ],
                "path": "/repos/:owner/:repo/merges",
                "displayName": "/repos/:owner/:repo/merges",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/merging/"
                },
                "httpMethod": "POST"
            },
            {
                "path": "/repos/:owner/:repo/pages",
                "displayName": "/repos/:owner/:repo/pages",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/pages/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/repos/:owner/:repo/pages/builds",
                "displayName": "/repos/:owner/:repo/pages/builds",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/pages/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/repos/:owner/:repo/pages/builds/latest",
                "displayName": "/repos/:owner/:repo/pages/builds/latest",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/pages/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/repos/:owner/:repo/releases",
                "displayName": "/repos/:owner/:repo/releases",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/releases/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/repos/:owner/:repo/releases/:id",
                "displayName": "/repos/:owner/:repo/releases/:id",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/releases/"
                },
                "httpMethod": "GET"
            },
            {
                "params": [
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "tag_name"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "target_commitish"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "name"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "body"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "draft"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "prerelease"
                    }
                ],
                "path": "/repos/:owner/:repo/releases",
                "displayName": "/repos/:owner/:repo/releases",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/releases/"
                },
                "httpMethod": "POST"
            },
            {
                "params": [
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "tag_name"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "target_commitish"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "name"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "body"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "boolean",
                        "style": "body",
                        "name": "draft"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "boolean",
                        "style": "body",
                        "name": "prerelease"
                    }
                ],
                "path": "/repos/:owner/:repo/releases/:id",
                "displayName": "/repos/:owner/:repo/releases/:id",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/releases/",
                    "t": "patch"
                },
                "httpMethod": "PUT"
            },
            {
                "path": "/repos/:owner/:repo/releases/:id",
                "displayName": "/repos/:owner/:repo/releases/:id",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/releases/"
                },
                "httpMethod": "DELETE"
            },
            {
                "path": "/repos/:owner/:repo/releases/:id/assets",
                "displayName": "/repos/:owner/:repo/releases/:id/assets",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/releases/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/repos/:owner/:repo/releases/assets/:id",
                "displayName": "/repos/:owner/:repo/releases/assets/:id",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/releases/"
                },
                "httpMethod": "GET"
            },
            {
                "params": [
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "name"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "label"
                    }
                ],
                "path": "/repos/:owner/:repo/releases/assets/:id",
                "displayName": "/repos/:owner/:repo/releases/assets/:id",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/releases/",
                    "t": "patch"
                },
                "httpMethod": "PUT"
            },
            {
                "path": "/repos/:owner/:repo/releases/assets/:id",
                "displayName": "/repos/:owner/:repo/releases/assets/:id",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/releases/"
                },
                "httpMethod": "DELETE"
            },
            {
                "path": "/repos/:owner/:repo/stats/contributors",
                "displayName": "/repos/:owner/:repo/stats/contributors",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/statistics/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/repos/:owner/:repo/stats/commit_activity",
                "displayName": "/repos/:owner/:repo/stats/commit_activity",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/statistics/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/repos/:owner/:repo/stats/participation",
                "displayName": "/repos/:owner/:repo/stats/participation",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/statistics/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/repos/:owner/:repo/stats/punch_card",
                "displayName": "/repos/:owner/:repo/stats/punch_card",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/statistics/"
                },
                "httpMethod": "GET"
            },
            {
                "params": [
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "state"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "target_url"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "description"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "context"
                    }
                ],
                "path": "/repos/:owner/:repo/statuses/:sha",
                "displayName": "/repos/:owner/:repo/statuses/:sha",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/statuses/"
                },
                "httpMethod": "POST"
            },
            {
                "params": [
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "ref"
                    }
                ],
                "path": "/repos/:owner/:repo/commits/:ref/statuses",
                "displayName": "/repos/:owner/:repo/commits/:ref/statuses",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/statuses/"
                },
                "httpMethod": "GET"
            },
            {
                "params": [
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "ref"
                    }
                ],
                "path": "/repos/:owner/:repo/commits/:ref/status",
                "displayName": "/repos/:owner/:repo/commits/:ref/status",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/repos/statuses/"
                },
                "httpMethod": "GET"
            },
            {
                "params": [
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "q"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "sort"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "order"
                    }
                ],
                "path": "/search/repositories",
                "displayName": "/search/repositories",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/search/"
                },
                "httpMethod": "GET"
            },
            {
                "params": [
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "q"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "sort"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "order"
                    }
                ],
                "path": "/search/code",
                "displayName": "/search/code",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/search/"
                },
                "httpMethod": "GET"
            },
            {
                "params": [
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "q"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "sort"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "order"
                    }
                ],
                "path": "/search/issues",
                "displayName": "/search/issues",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/search/"
                },
                "httpMethod": "GET"
            },
            {
                "params": [
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "q"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "sort"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "order"
                    }
                ],
                "path": "/search/users",
                "displayName": "/search/users",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/search/"
                },
                "httpMethod": "GET"
            },
            {
                "params": [
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "state"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "keyword"
                    }
                ],
                "path": "/legacy/issues/search/:owner/:repository/:state/:keyword",
                "displayName": "/legacy/issues/search/:owner/:repository/:state/:keyword",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/search/legacy/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/legacy/repos/search/:keyword",
                "displayName": "/legacy/repos/search/:keyword",
                "params": [
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "keyword"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "language"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "start_page"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "sort"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "order"
                    }
                ],
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/search/legacy/"
                },
                "httpMethod": "GET"
            },
            {
                "params": [
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "keyword"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "start_page"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "sort"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "order"
                    }
                ],
                "path": "/legacy/user/search/:keyword",
                "displayName": "/legacy/user/search/:keyword",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/search/legacy/"
                },
                "httpMethod": "GET"
            },
            {
                "params": [
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "email"
                    }
                ],
                "path": "/legacy/user/email/:email",
                "displayName": "/legacy/user/email/:email",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/search/legacy/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/users/:username",
                "displayName": "/users/:username",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/users/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/user",
                "displayName": "/user",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/users/"
                },
                "httpMethod": "GET"
            },
            {
                "params": [
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "name"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "email"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "blog"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "company"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "location"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "boolean",
                        "style": "body",
                        "name": "hireable"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "bio"
                    }
                ],
                "path": "/user",
                "displayName": "/user",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/users/",
                    "t": "patch"
                },
                "httpMethod": "PUT"
            },
            {
                "params": [
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "query",
                        "name": "since"
                    }
                ],
                "path": "/users",
                "displayName": "/users",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/users/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/user/emails",
                "displayName": "/user/emails",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/users/emails/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/user/emails",
                "displayName": "/user/emails",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/users/emails/"
                },
                "httpMethod": "POST"
            },
            {
                "path": "/user/emails",
                "displayName": "/user/emails",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/users/emails/"
                },
                "httpMethod": "DELETE"
            },
            {
                "path": "/users/:username/followers",
                "displayName": "/users/:username/followers",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/users/followers/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/user/followers",
                "displayName": "/user/followers",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/users/followers/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/users/:username/following",
                "displayName": "/users/:username/following",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/users/followers/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/user/following",
                "displayName": "/user/following",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/users/followers/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/user/following/:username",
                "displayName": "/user/following/:username",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/users/followers/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/users/:username/following/:target_user",
                "displayName": "/users/:username/following/:target_user",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/users/followers/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/user/following/:username",
                "displayName": "/user/following/:username",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/users/followers/"
                },
                "httpMethod": "PUT"
            },
            {
                "path": "/user/following/:username",
                "displayName": "/user/following/:username",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/users/followers/"
                },
                "httpMethod": "DELETE"
            },
            {
                "path": "/users/:username/keys",
                "displayName": "/users/:username/keys",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/users/keys/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/user/keys",
                "displayName": "/user/keys",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/users/keys/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/user/keys/:id",
                "displayName": "/user/keys/:id",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/users/keys/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/user/keys",
                "displayName": "/user/keys",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/users/keys/"
                },
                "httpMethod": "POST"
            },
            {
                "path": "/user/keys/:id",
                "displayName": "/user/keys/:id",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/users/keys/"
                },
                "httpMethod": "DELETE"
            },
            {
                "path": "/user/:username/site_admin",
                "displayName": "/user/:username/site_admin",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/users/administration/"
                },
                "httpMethod": "PUT"
            },
            {
                "path": "/user/:username/site_admin",
                "displayName": "/user/:username/site_admin",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/users/administration/"
                },
                "httpMethod": "DELETE"
            },
            {
                "path": "/user/:username/suspended",
                "displayName": "/user/:username/suspended",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/users/administration/"
                },
                "httpMethod": "PUT"
            },
            {
                "path": "/user/:username/suspended",
                "displayName": "/user/:username/suspended",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/users/administration/"
                },
                "httpMethod": "DELETE"
            },
            {
                "path": "/enterprise/stats/:type",
                "displayName": "/enterprise/stats/:type",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/enterprise/admin_stats/"
                },
                "httpMethod": "GET"
            },
            {
                "path": "/enterprise/settings/license",
                "displayName": "/enterprise/settings/license",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/enterprise/license/"
                },
                "httpMethod": "GET"
            },
            {
                "params": [
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "target"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "",
                        "name": ""
                    }
                ],
                "path": "/staff/indexing_jobs",
                "displayName": "/staff/indexing_jobs",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/enterprise/search_indexing/"
                },
                "httpMethod": "POST"
            },
            {
                "params": [
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "license"
                    },
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "package"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "settings"
                    }
                ],
                "path": "/setup/api/start",
                "displayName": "/setup/api/start",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/enterprise/management_console/"
                },
                "httpMethod": "POST"
            },
            {
                "params": [
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "license"
                    },
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "package"
                    }
                ],
                "path": "/setup/api/upgrade",
                "displayName": "/setup/api/upgrade",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/enterprise/management_console/"
                },
                "httpMethod": "POST"
            },
            {
                "path": "/setup/api/configcheck",
                "displayName": "/setup/api/configcheck",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/enterprise/management_console/"
                },
                "httpMethod": "GET"
            },
            {
                "params": [
                    {
                        "required": "false",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "complete"
                    }
                ],
                "path": "/setup/api/configure",
                "displayName": "/setup/api/configure",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/enterprise/management_console/"
                },
                "httpMethod": "POST"
            },
            {
                "path": "/setup/api/settings",
                "displayName": "/setup/api/settings",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/enterprise/management_console/"
                },
                "httpMethod": "GET"
            },
            {
                "params": [
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "settings"
                    }
                ],
                "path": "/setup/api/settings",
                "displayName": "/setup/api/settings",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/enterprise/management_console/"
                },
                "httpMethod": "PUT"
            },
            {
                "path": "/setup/api/maintenance",
                "displayName": "/setup/api/maintenance",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/enterprise/management_console/"
                },
                "httpMethod": "GET"
            },
            {
                "params": [
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "maintenance"
                    }
                ],
                "path": "/setup/api/maintenance",
                "displayName": "/setup/api/maintenance",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/enterprise/management_console/"
                },
                "httpMethod": "POST"
            },
            {
                "path": "/setup/api/settings/authorized-keys",
                "displayName": "/setup/api/settings/authorized-keys",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/enterprise/management_console/"
                },
                "httpMethod": "GET"
            },
            {
                "params": [
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "body",
                        "name": "authorized_key"
                    }
                ],
                "path": "/setup/api/settings/authorized-keys",
                "displayName": "/setup/api/settings/authorized-keys",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/enterprise/management_console/"
                },
                "httpMethod": "POST"
            },
            {
                "params": [
                    {
                        "required": "true",
                        "value": "",
                        "type": "string",
                        "style": "",
                        "name": "authorized_key"
                    }
                ],
                "path": "/setup/api/settings/authorized-keys",
                "displayName": "/setup/api/settings/authorized-keys",
                "authentication": {
                    "required": "true"
                },
                "doc": {
                    "url": "https://developer.github.com/v3/enterprise/management_console/"
                },
                "httpMethod": "DELETE"
            }
        ]
    },
    "custom_tokens": []
};

db     = db.getSiblingDB('meshines');

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
