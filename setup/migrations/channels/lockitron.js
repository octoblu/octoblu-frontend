var record = {
  "application": {
    "base": "https://api.twitter.com/1.1",
    "resources": [
      {
        "displayName": "statuses/mentions_timeline",
        "doc": {
          "t": "Returns the 20 most recent mentions (tweets containing a users's @screen_name) for the authenticating user.\n\nThe timeline returned is the equivalent of the one seen when you view your mentions on twitter.com.\n\nThis method can only return up to 800 tweets.\n\nSee Working with Timelines for...",
          "url": "/docs/api/1.1/get/statuses/mentions_timeline"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "count",
            "required": false,
            "style": "query"
          },
          {
            "name": "since_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "max_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "trim_user",
            "required": false,
            "style": "query"
          },
          {
            "name": "contributor_details",
            "required": false,
            "style": "query"
          },
          {
            "name": "include_entities",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/statuses/mentions_timeline.json"
      },
      {
        "displayName": "statuses/user_timeline",
        "doc": {
          "t": "Returns a collection of the most recent Tweets posted by the user indicated by the screen_name or user_id parameters.\n\nUser timelines belonging to protected users may only be requested when the authenticated user either \"owns\" the timeline or is an approved follower of the owner.\n\nThe timeline...",
          "url": "/docs/api/1.1/get/statuses/user_timeline"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "user_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "screen_name",
            "required": false,
            "style": "query"
          },
          {
            "name": "since_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "count",
            "required": false,
            "style": "query"
          },
          {
            "name": "max_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "trim_user",
            "required": false,
            "style": "query"
          },
          {
            "name": "exclude_replies",
            "required": false,
            "style": "query"
          },
          {
            "name": "contributor_details",
            "required": false,
            "style": "query"
          },
          {
            "name": "include_rts",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/statuses/user_timeline.json"
      },
      {
        "displayName": "statuses/home_timeline",
        "doc": {
          "t": "Returns a collection of the most recent Tweets and retweets posted by the authenticating user and the users they follow. The home timeline is central to how most users interact with the Twitter service.\n\nUp to 800 Tweets are obtainable on the home timeline. It is more volatile for users that follow...",
          "url": "/docs/api/1.1/get/statuses/home_timeline"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "count",
            "required": false,
            "style": "query"
          },
          {
            "name": "since_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "max_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "trim_user",
            "required": false,
            "style": "query"
          },
          {
            "name": "exclude_replies",
            "required": false,
            "style": "query"
          },
          {
            "name": "contributor_details",
            "required": false,
            "style": "query"
          },
          {
            "name": "include_entities",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/statuses/home_timeline.json"
      },
      {
        "displayName": "statuses/retweets_of_me",
        "doc": {
          "t": "Returns the most recent tweets authored by the authenticating user that have been retweeted by others. This timeline is a subset of the user's GET statuses/user_timeline.\n\nSee Working with Timelines for instructions on traversing timelines.",
          "url": "/docs/api/1.1/get/statuses/retweets_of_me"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "count",
            "required": false,
            "style": "query"
          },
          {
            "name": "since_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "max_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "trim_user",
            "required": false,
            "style": "query"
          },
          {
            "name": "include_entities",
            "required": false,
            "style": "query"
          },
          {
            "name": "include_user_entities",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/statuses/retweets_of_me.json"
      },
      {
        "displayName": "statuses/retweets/:id",
        "doc": {
          "t": "Returns a collection of the 100 most recent retweets of the tweet specified by the id parameter.",
          "url": "/docs/api/1.1/get/statuses/retweets/%3Aid"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "id",
            "required": true,
            "style": "query"
          },
          {
            "name": "count",
            "required": false,
            "style": "query"
          },
          {
            "name": "trim_user",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/statuses/retweets/{id}.json"
      },
      {
        "displayName": "statuses/show/:id",
        "doc": {
          "t": "Returns a single Tweet, specified by the id parameter. The Tweet's author will also be embedded within the tweet.\n\nSee Embeddable Timelines, Embeddable Tweets, and GET statuses/oembed for tools to render Tweets according to Display Requirements.",
          "url": "/docs/api/1.1/get/statuses/show/%3Aid"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "id",
            "required": true,
            "style": "query"
          },
          {
            "name": "trim_user",
            "required": false,
            "style": "query"
          },
          {
            "name": "include_my_retweet",
            "required": false,
            "style": "query"
          },
          {
            "name": "include_entities",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/statuses/show/{id}.json"
      },
      {
        "displayName": "statuses/destroy/:id",
        "doc": {
          "t": "Destroys the status specified by the required ID parameter. The authenticating user must be the\nauthor of the specified status. Returns the destroyed status if successful.",
          "url": "/docs/api/1.1/post/statuses/destroy/%3Aid"
        },
        "httpMethod": "POST",
        "params": [
          {
            "name": "id",
            "required": true,
            "style": "query"
          },
          {
            "name": "trim_user",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/statuses/destroy/{id}.json"
      },
      {
        "displayName": "statuses/update",
        "doc": {
          "t": "Updates the authenticating user's current status, also known as tweeting. To upload an image to accompany the tweet, use POST statuses/update_with_media.\n\nFor each update attempt, the update text is compared with the authenticating user's recent tweets. Any attempt that would result in duplication...",
          "url": "/docs/api/1.1/post/statuses/update"
        },
        "httpMethod": "POST",
        "params": [
          {
            "name": "status",
            "required": true,
            "style": "query"
          },
          {
            "name": "in_reply_to_status_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "lat",
            "required": false,
            "style": "query"
          },
          {
            "name": "long",
            "required": false,
            "style": "query"
          },
          {
            "name": "place_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "display_coordinates",
            "required": false,
            "style": "query"
          },
          {
            "name": "trim_user",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/statuses/update.json"
      },
      {
        "displayName": "statuses/retweet/:id",
        "doc": {
          "t": "Retweets a tweet. Returns the original tweet with retweet details embedded.",
          "url": "/docs/api/1.1/post/statuses/retweet/%3Aid"
        },
        "httpMethod": "POST",
        "params": [
          {
            "name": "id",
            "required": true,
            "style": "query"
          },
          {
            "name": "trim_user",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/statuses/retweet/{id}.json"
      },
      {
        "displayName": "statuses/update_with_media",
        "doc": {
          "t": "Updates the authenticating user's current status and attaches media for upload. In other words, it creates a Tweet with a picture attached.\n\nUnlike POST statuses/update, this method expects raw multipart data. Your POST request's Content-Type should be set to multipart/form-data with the media[]...",
          "url": "/docs/api/1.1/post/statuses/update_with_media"
        },
        "httpMethod": "POST",
        "params": [
          {
            "name": "status",
            "required": true,
            "style": "query"
          },
          {
            "name": "media[]",
            "required": true,
            "style": "query"
          },
          {
            "name": "possibly_sensitive",
            "required": false,
            "style": "query"
          },
          {
            "name": "in_reply_to_status_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "lat",
            "required": false,
            "style": "query"
          },
          {
            "name": "long",
            "required": false,
            "style": "query"
          },
          {
            "name": "place_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "display_coordinates",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/statuses/update_with_media.json"
      },
      {
        "displayName": "statuses/oembed",
        "doc": {
          "t": "Returns information allowing the creation of an embedded representation of a Tweet on third party sites.  See the oEmbed specification for information about the response format.\n\nWhile this endpoint allows a bit of customization for the final appearance of the embedded Tweet, be aware that the...",
          "url": "/docs/api/1.1/get/statuses/oembed"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "id",
            "required": true,
            "style": "query"
          },
          {
            "name": "url",
            "required": true,
            "style": "query"
          },
          {
            "name": "",
            "required": true,
            "style": "query"
          },
          {
            "name": "",
            "required": true,
            "style": "query"
          },
          {
            "name": "",
            "required": true,
            "style": "query"
          },
          {
            "name": "",
            "required": true,
            "style": "query"
          },
          {
            "name": "",
            "required": true,
            "style": "query"
          },
          {
            "name": "",
            "required": true,
            "style": "query"
          },
          {
            "name": "",
            "required": true,
            "style": "query"
          }
        ],
        "path": "/statuses/oembed.json"
      },
      {
        "displayName": "statuses/retweeters/ids",
        "doc": {
          "t": "Returns a collection of up to 100 user IDs belonging to users who have retweeted the tweet specified by the id parameter.\nThis method offers similar data to GET statuses/retweets/:id and replaces API v1's GET statuses/:id/retweeted_by/ids method.",
          "url": "/docs/api/1.1/get/statuses/retweeters/ids"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "id",
            "required": true,
            "style": "query"
          },
          {
            "name": "cursor",
            "required": true,
            "style": "query"
          },
          {
            "name": "stringify_ids",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/statuses/retweeters/ids.json"
      },
      {
        "displayName": "search/tweets",
        "doc": {
          "t": "Returns a collection of relevant Tweets matching a specified query.\n\nPlease note that Twitter's search service and, by extension, the Search API is not meant to be an exhaustive source of Tweets. Not all Tweets will be indexed or made available via the search interface.\n\nIn API v1.1, the response...",
          "url": "/docs/api/1.1/get/search/tweets"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "q",
            "required": true,
            "style": "query"
          },
          {
            "name": "geocode",
            "required": false,
            "style": "query"
          },
          {
            "name": "lang",
            "required": false,
            "style": "query"
          },
          {
            "name": "locale",
            "required": false,
            "style": "query"
          },
          {
            "name": "result_type",
            "required": false,
            "style": "query"
          },
          {
            "name": "count",
            "required": false,
            "style": "query"
          },
          {
            "name": "until",
            "required": false,
            "style": "query"
          },
          {
            "name": "since_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "max_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "include_entities",
            "required": false,
            "style": "query"
          },
          {
            "name": "callback",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/search/tweets.json"
      },
      {
        "displayName": "statuses/filter",
        "doc": {
          "t": "Returns public statuses that match one or more filter predicates. Multiple parameters may be specified which allows most clients to use a single connection to the Streaming API.  Both GET and POST requests are supported, but GET requests with too many parameters may cause the request to be...",
          "url": "/docs/api/1.1/post/statuses/filter"
        },
        "httpMethod": "POST",
        "params": [
          {
            "name": "follow",
            "required": true,
            "style": "query"
          },
          {
            "name": "track",
            "required": true,
            "style": "query"
          },
          {
            "name": "locations",
            "required": true,
            "style": "query"
          },
          {
            "name": "delimited",
            "required": false,
            "style": "query"
          },
          {
            "name": "stall_warnings",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/statuses/filter.json"
      },
      {
        "displayName": "statuses/sample",
        "doc": {
          "t": "Returns a small random sample of all public statuses.  The Tweets returned by the default access level are the same, so if two different clients connect to this endpoint, they will see the same Tweets.",
          "url": "/docs/api/1.1/get/statuses/sample"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "delimited",
            "required": false,
            "style": "query"
          },
          {
            "name": "stall_warnings",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/statuses/sample.json"
      },
      {
        "displayName": "statuses/firehose",
        "doc": {
          "t": "This endpoint requires special permission to access.\nReturns all public statuses. Few applications require this level of access. Creative use of a combination of other resources and various access levels can satisfy nearly every application use case.",
          "url": "/docs/api/1.1/get/statuses/firehose"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "count",
            "required": false,
            "style": "query"
          },
          {
            "name": "delimited",
            "required": false,
            "style": "query"
          },
          {
            "name": "stall_warnings",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/statuses/firehose.json"
      },
      {
        "displayName": "user",
        "doc": {
          "t": "Streams messages for a single user, as described in User streams.",
          "url": "/docs/api/1.1/get/user"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "delimited",
            "required": false,
            "style": "query"
          },
          {
            "name": "stall_warnings",
            "required": false,
            "style": "query"
          },
          {
            "name": "with",
            "required": false,
            "style": "query"
          },
          {
            "name": "replies",
            "required": false,
            "style": "query"
          },
          {
            "name": "track",
            "required": false,
            "style": "query"
          },
          {
            "name": "locations",
            "required": false,
            "style": "query"
          },
          {
            "name": "stringify_friend_ids",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/user.json"
      },
      {
        "displayName": "site",
        "doc": {
          "t": "Streams messages for a set of users, as described in Site streams.",
          "url": "/docs/api/1.1/get/site"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "follow",
            "required": true,
            "style": "query"
          },
          {
            "name": "delimited",
            "required": false,
            "style": "query"
          },
          {
            "name": "stall_warnings",
            "required": false,
            "style": "query"
          },
          {
            "name": "with",
            "required": false,
            "style": "query"
          },
          {
            "name": "replies",
            "required": false,
            "style": "query"
          },
          {
            "name": "stringify_friend_ids",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/site.json"
      },
      {
        "displayName": "direct_messages",
        "doc": {
          "t": "Returns the 20 most recent direct messages sent to the authenticating user. Includes detailed information about the sender and recipient user. You can request up to 200 direct messages per call, up to a maximum of 800 incoming DMs.\nImportant: This method requires an access token with RWD (read,...",
          "url": "/docs/api/1.1/get/direct_messages"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "since_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "max_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "count",
            "required": false,
            "style": "query"
          },
          {
            "name": "include_entities",
            "required": false,
            "style": "query"
          },
          {
            "name": "skip_status",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/direct_messages.json"
      },
      {
        "displayName": "direct_messages/sent",
        "doc": {
          "t": "Returns the 20 most recent direct messages sent by the authenticating user. Includes detailed information about the sender and recipient user. You can request up to 200 direct messages per call, up to a maximum of 800 outgoing DMs.\nImportant: This method requires an access token with RWD (read,...",
          "url": "/docs/api/1.1/get/direct_messages/sent"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "since_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "max_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "count",
            "required": false,
            "style": "query"
          },
          {
            "name": "page",
            "required": false,
            "style": "query"
          },
          {
            "name": "include_entities",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/direct_messages/sent.json"
      },
      {
        "displayName": "direct_messages/show",
        "doc": {
          "t": "Returns a single direct message, specified by an id parameter. Like the /1.1/direct_messages.format request, this method will include the user objects of the sender and recipient. \nImportant: This method requires an access token with RWD (read, write...",
          "url": "/docs/api/1.1/get/direct_messages/show"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "id",
            "required": true,
            "style": "query"
          }
        ],
        "path": "/direct_messages/show.json"
      },
      {
        "displayName": "direct_messages/destroy",
        "doc": {
          "t": "Destroys the direct message specified in the required ID parameter. The authenticating user must be the recipient of the specified direct message.\n\n\nImportant: This method requires an access token with RWD (read, write...",
          "url": "/docs/api/1.1/post/direct_messages/destroy"
        },
        "httpMethod": "POST",
        "params": [
          {
            "name": "id",
            "required": true,
            "style": "query"
          },
          {
            "name": "include_entities",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/direct_messages/destroy.json"
      },
      {
        "displayName": "direct_messages/new",
        "doc": {
          "t": "Sends a new direct message to the specified user from the authenticating user. Requires both the user and text parameters and must be a POST. Returns the sent message in the requested format if successful.",
          "url": "/docs/api/1.1/post/direct_messages/new"
        },
        "httpMethod": "POST",
        "params": [
          {
            "name": "user_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "screen_name",
            "required": false,
            "style": "query"
          },
          {
            "name": "text",
            "required": true,
            "style": "query"
          }
        ],
        "path": "/direct_messages/new.json"
      },
      {
        "displayName": "friendships/no_retweets/ids",
        "doc": {
          "t": "Returns a collection of user_ids that the currently authenticated user does not want to receive retweets from.\nUse POST friendships/update to set the \"no retweets\" status for a given user account on behalf of the current user.",
          "url": "/docs/api/1.1/get/friendships/no_retweets/ids"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "stringify_ids",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/friendships/no_retweets/ids.json"
      },
      {
        "displayName": "friends/ids",
        "doc": {
          "t": "Returns a cursored collection of user IDs for every user the specified user is following (otherwise known as their \"friends\").\n\nAt this time, results are ordered with the most recent following first \u2014 however, this ordering is subject to unannounced change and eventual consistency issues....",
          "url": "/docs/api/1.1/get/friends/ids"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "user_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "screen_name",
            "required": false,
            "style": "query"
          },
          {
            "name": "cursor",
            "required": true,
            "style": "query"
          },
          {
            "name": "stringify_ids",
            "required": false,
            "style": "query"
          },
          {
            "name": "count",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/friends/ids.json"
      },
      {
        "displayName": "followers/ids",
        "doc": {
          "t": "Returns a cursored collection of user IDs for every user following the specified user.\n\nAt this time, results are ordered with the most recent following first \u2014 however, this ordering is subject to unannounced change and eventual consistency issues. Results are given in groups of 5,000 user...",
          "url": "/docs/api/1.1/get/followers/ids"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "user_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "screen_name",
            "required": false,
            "style": "query"
          },
          {
            "name": "cursor",
            "required": true,
            "style": "query"
          },
          {
            "name": "stringify_ids",
            "required": false,
            "style": "query"
          },
          {
            "name": "count",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/followers/ids.json"
      },
      {
        "displayName": "friendships/incoming",
        "doc": {
          "t": "Returns a collection of numeric IDs for every user who has a pending request to follow the authenticating user.",
          "url": "/docs/api/1.1/get/friendships/incoming"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "cursor",
            "required": true,
            "style": "query"
          },
          {
            "name": "stringify_ids",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/friendships/incoming.json"
      },
      {
        "displayName": "friendships/outgoing",
        "doc": {
          "t": "Returns a collection of numeric IDs for every protected user for whom the authenticating user has a pending follow request.",
          "url": "/docs/api/1.1/get/friendships/outgoing"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "cursor",
            "required": true,
            "style": "query"
          },
          {
            "name": "stringify_ids",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/friendships/outgoing.json"
      },
      {
        "displayName": "friendships/create",
        "doc": {
          "t": "Allows the authenticating users to follow the user specified in the ID parameter.\nReturns the befriended user in the requested format when successful. Returns a string describing the failure condition when unsuccessful. If you are already friends with the user a HTTP 403 may be returned, though for...",
          "url": "/docs/api/1.1/post/friendships/create"
        },
        "httpMethod": "POST",
        "params": [
          {
            "name": "screen_name",
            "required": false,
            "style": "query"
          },
          {
            "name": "user_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "follow",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/friendships/create.json"
      },
      {
        "displayName": "friendships/destroy",
        "doc": {
          "t": "Allows the authenticating user to unfollow the user specified in the ID parameter.\nReturns the unfollowed user in the requested format when successful. Returns a string describing the failure condition when unsuccessful.\nActions taken in this method are asynchronous and changes will be eventually...",
          "url": "/docs/api/1.1/post/friendships/destroy"
        },
        "httpMethod": "POST",
        "params": [
          {
            "name": "screen_name",
            "required": false,
            "style": "query"
          },
          {
            "name": "user_id",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/friendships/destroy.json"
      },
      {
        "displayName": "friendships/update",
        "doc": {
          "t": "Allows one to enable or disable retweets and device notifications from the specified user.",
          "url": "/docs/api/1.1/post/friendships/update"
        },
        "httpMethod": "POST",
        "params": [
          {
            "name": "screen_name",
            "required": false,
            "style": "query"
          },
          {
            "name": "user_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "device",
            "required": false,
            "style": "query"
          },
          {
            "name": "retweets",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/friendships/update.json"
      },
      {
        "displayName": "friendships/show",
        "doc": {
          "t": "Returns detailed information about the relationship between two arbitrary users.",
          "url": "/docs/api/1.1/get/friendships/show"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "source_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "source_screen_name",
            "required": false,
            "style": "query"
          },
          {
            "name": "target_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "target_screen_name",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/friendships/show.json"
      },
      {
        "displayName": "friends/list",
        "doc": {
          "t": "Returns a cursored collection of user objects for every user the specified user is following (otherwise known as their \"friends\").\n\nAt this time, results are ordered with the most recent following first \u2014 however, this ordering is subject to unannounced change and eventual consistency issues...",
          "url": "/docs/api/1.1/get/friends/list"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "user_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "screen_name",
            "required": false,
            "style": "query"
          },
          {
            "name": "cursor",
            "required": true,
            "style": "query"
          },
          {
            "name": "",
            "required": true,
            "style": "query"
          },
          {
            "name": "skip_status",
            "required": false,
            "style": "query"
          },
          {
            "name": "include_user_entities",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/friends/list.json"
      },
      {
        "displayName": "followers/list",
        "doc": {
          "t": "Returns a cursored collection of user objects for users following the specified user.\n\nAt this time, results are ordered with the most recent following first \u2014 however, this ordering is subject to unannounced change and eventual consistency issues. Results are given in groups of 20 users and...",
          "url": "/docs/api/1.1/get/followers/list"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "user_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "screen_name",
            "required": false,
            "style": "query"
          },
          {
            "name": "cursor",
            "required": true,
            "style": "query"
          },
          {
            "name": "",
            "required": true,
            "style": "query"
          },
          {
            "name": "skip_status",
            "required": false,
            "style": "query"
          },
          {
            "name": "include_user_entities",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/followers/list.json"
      },
      {
        "displayName": "friendships/lookup",
        "doc": {
          "t": "Returns the relationships of the authenticating user to the comma-separated list of up to 100 screen_names or user_ids provided. Values for connections can be: following, following_requested, followed_by, none, blocking.",
          "url": "/docs/api/1.1/get/friendships/lookup"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "screen_name",
            "required": false,
            "style": "query"
          },
          {
            "name": "user_id",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/friendships/lookup.json"
      },
      {
        "displayName": "account/settings",
        "doc": {
          "t": "Returns settings (including current trend, geo and sleep time information) for the authenticating user.",
          "url": "/docs/api/1.1/get/account/settings"
        },
        "httpMethod": "GET",
        "params": [],
        "path": "/account/settings.json"
      },
      {
        "displayName": "account/verify_credentials",
        "doc": {
          "t": "Returns an HTTP 200 OK response code and a representation of the requesting user if authentication was successful; returns a 401 status code and an error message if not. Use this method to test if supplied user credentials are valid.",
          "url": "/docs/api/1.1/get/account/verify_credentials"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "include_entities",
            "required": false,
            "style": "query"
          },
          {
            "name": "skip_status",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/account/verify_credentials.json"
      },
      {
        "displayName": "account/settings",
        "doc": {
          "t": "Updates the authenticating user's settings.",
          "url": "/docs/api/1.1/post/account/settings"
        },
        "httpMethod": "POST",
        "params": [
          {
            "name": "trend_location_woeid",
            "required": false,
            "style": "query"
          },
          {
            "name": "sleep_time_enabled",
            "required": false,
            "style": "query"
          },
          {
            "name": "start_sleep_time",
            "required": false,
            "style": "query"
          },
          {
            "name": "end_sleep_time",
            "required": false,
            "style": "query"
          },
          {
            "name": "time_zone",
            "required": false,
            "style": "query"
          },
          {
            "name": "lang",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/account/settings.json"
      },
      {
        "displayName": "account/update_delivery_device",
        "doc": {
          "t": "Sets which device Twitter delivers updates to for the authenticating user. Sending none as the device parameter will disable SMS updates.",
          "url": "/docs/api/1.1/post/account/update_delivery_device"
        },
        "httpMethod": "POST",
        "params": [
          {
            "name": "device",
            "required": true,
            "style": "query"
          },
          {
            "name": "include_entities",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/account/update_delivery_device.json"
      },
      {
        "displayName": "account/update_profile",
        "doc": {
          "t": "Sets values that users are able to set under the \"Account\" tab of their settings page. Only the parameters specified will be updated.",
          "url": "/docs/api/1.1/post/account/update_profile"
        },
        "httpMethod": "POST",
        "params": [
          {
            "name": "name",
            "required": false,
            "style": "query"
          },
          {
            "name": "url",
            "required": false,
            "style": "query"
          },
          {
            "name": "location",
            "required": false,
            "style": "query"
          },
          {
            "name": "description",
            "required": false,
            "style": "query"
          },
          {
            "name": "include_entities",
            "required": false,
            "style": "query"
          },
          {
            "name": "skip_status",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/account/update_profile.json"
      },
      {
        "displayName": "account/update_profile_background_image",
        "doc": {
          "t": "Updates the authenticating user's profile background image. This method can also be used to enable or disable the profile background image.\n\nAlthough each parameter is marked as optional, at least one of image, tile or use must be provided when making this request.",
          "url": "/docs/api/1.1/post/account/update_profile_background_image"
        },
        "httpMethod": "POST",
        "params": [
          {
            "name": "image",
            "required": false,
            "style": "query"
          },
          {
            "name": "tile",
            "required": false,
            "style": "query"
          },
          {
            "name": "include_entities",
            "required": false,
            "style": "query"
          },
          {
            "name": "skip_status",
            "required": false,
            "style": "query"
          },
          {
            "name": "use",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/account/update_profile_background_image.json"
      },
      {
        "displayName": "account/update_profile_colors",
        "doc": {
          "t": "Sets one or more hex values that control the color scheme of the authenticating user's profile page on twitter.com. Each parameter's value must be a valid hexidecimal value, and may be either three or six characters (ex: #fff or #ffffff).",
          "url": "/docs/api/1.1/post/account/update_profile_colors"
        },
        "httpMethod": "POST",
        "params": [
          {
            "name": "profile_background_color",
            "required": false,
            "style": "query"
          },
          {
            "name": "profile_link_color",
            "required": false,
            "style": "query"
          },
          {
            "name": "profile_sidebar_border_color",
            "required": false,
            "style": "query"
          },
          {
            "name": "profile_sidebar_fill_color",
            "required": false,
            "style": "query"
          },
          {
            "name": "profile_text_color",
            "required": false,
            "style": "query"
          },
          {
            "name": "include_entities",
            "required": false,
            "style": "query"
          },
          {
            "name": "skip_status",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/account/update_profile_colors.json"
      },
      {
        "displayName": "account/update_profile_image",
        "doc": {
          "t": "Updates the authenticating user's profile image. Note that this method expects raw multipart data, not a URL to an image.\nThis method asynchronously processes the uploaded file before updating the user's profile image URL. You can either update your local cache the next time you request the user's...",
          "url": "/docs/api/1.1/post/account/update_profile_image"
        },
        "httpMethod": "POST",
        "params": [
          {
            "name": "image",
            "required": true,
            "style": "query"
          },
          {
            "name": "include_entities",
            "required": false,
            "style": "query"
          },
          {
            "name": "skip_status",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/account/update_profile_image.json"
      },
      {
        "displayName": "blocks/list",
        "doc": {
          "t": "Returns a collection of user objects that the authenticating user is blocking.\nImportant On October 15, 2012 this method will become cursored by default, altering the default response format. See Using cursors to navigate collections for more details on how cursoring works.",
          "url": "/docs/api/1.1/get/blocks/list"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "include_entities",
            "required": false,
            "style": "query"
          },
          {
            "name": "skip_status",
            "required": false,
            "style": "query"
          },
          {
            "name": "cursor",
            "required": true,
            "style": "query"
          }
        ],
        "path": "/blocks/list.json"
      },
      {
        "displayName": "blocks/ids",
        "doc": {
          "t": "Returns an array of numeric user ids the authenticating user is blocking.\nImportant On October 15, 2012 this method will become cursored by default, altering the default response format. See Using cursors to navigate collections for more details on how cursoring works.",
          "url": "/docs/api/1.1/get/blocks/ids"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "stringify_ids",
            "required": false,
            "style": "query"
          },
          {
            "name": "cursor",
            "required": true,
            "style": "query"
          }
        ],
        "path": "/blocks/ids.json"
      },
      {
        "displayName": "blocks/create",
        "doc": {
          "t": "Blocks the specified user from following the authenticating user. In addition the blocked user will not show in the authenticating users mentions or timeline (unless retweeted by another user). If a follow or friend relationship exists it is destroyed.",
          "url": "/docs/api/1.1/post/blocks/create"
        },
        "httpMethod": "POST",
        "params": [
          {
            "name": "screen_name",
            "required": false,
            "style": "query"
          },
          {
            "name": "user_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "include_entities",
            "required": false,
            "style": "query"
          },
          {
            "name": "skip_status",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/blocks/create.json"
      },
      {
        "displayName": "blocks/destroy",
        "doc": {
          "t": "Un-blocks the user specified in the ID parameter for the authenticating user. Returns the un-blocked user in the requested format when successful.  If relationships existed before the block was instated, they will not be restored.",
          "url": "/docs/api/1.1/post/blocks/destroy"
        },
        "httpMethod": "POST",
        "params": [
          {
            "name": "screen_name",
            "required": false,
            "style": "query"
          },
          {
            "name": "user_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "include_entities",
            "required": false,
            "style": "query"
          },
          {
            "name": "skip_status",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/blocks/destroy.json"
      },
      {
        "displayName": "users/lookup",
        "doc": {
          "t": "Returns fully-hydrated user objects for up to 100 users per request, as specified by comma-separated values passed to the user_id and/or screen_name parameters.\n\nThis method is especially useful when used in conjunction with collections of user IDs returned from GET friends/ids and GET followers/...",
          "url": "/docs/api/1.1/get/users/lookup"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "screen_name",
            "required": false,
            "style": "query"
          },
          {
            "name": "user_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "include_entities",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/users/lookup.json"
      },
      {
        "displayName": "users/show",
        "doc": {
          "t": "Returns a variety of information about the user specified by the required user_id or screen_name parameter. The author's most recent Tweet will be returned inline when possible.\n\nGET users/lookup is used to retrieve a bulk collection of user objects.",
          "url": "/docs/api/1.1/get/users/show"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "user_id",
            "required": true,
            "style": "query"
          },
          {
            "name": "screen_name",
            "required": true,
            "style": "query"
          },
          {
            "name": "include_entities",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/users/show.json"
      },
      {
        "displayName": "users/search",
        "doc": {
          "t": "Provides a simple, relevance-based search interface to public user accounts on Twitter. Try querying by topical interest, full name, company name, location, or other criteria. Exact match searches are not supported.\n\nOnly the first 1,000 matching results are available.",
          "url": "/docs/api/1.1/get/users/search"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "q",
            "required": true,
            "style": "query"
          },
          {
            "name": "page",
            "required": false,
            "style": "query"
          },
          {
            "name": "count",
            "required": false,
            "style": "query"
          },
          {
            "name": "include_entities",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/users/search.json"
      },
      {
        "displayName": "users/contributees",
        "doc": {
          "t": "Returns a collection of users that the specified user can \"contribute\" to.",
          "url": "/docs/api/1.1/get/users/contributees"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "user_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "screen_name",
            "required": false,
            "style": "query"
          },
          {
            "name": "include_entities",
            "required": false,
            "style": "query"
          },
          {
            "name": "skip_status",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/users/contributees.json"
      },
      {
        "displayName": "users/contributors",
        "doc": {
          "t": "Returns a collection of users who can contribute to the specified account.",
          "url": "/docs/api/1.1/get/users/contributors"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "user_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "screen_name",
            "required": false,
            "style": "query"
          },
          {
            "name": "include_entities",
            "required": false,
            "style": "query"
          },
          {
            "name": "skip_status",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/users/contributors.json"
      },
      {
        "displayName": "account/remove_profile_banner",
        "doc": {
          "t": "Removes the uploaded profile banner for the authenticating user. Returns HTTP 200 upon success.",
          "url": "/docs/api/1.1/post/account/remove_profile_banner"
        },
        "httpMethod": "POST",
        "params": [],
        "path": "/account/remove_profile_banner.json"
      },
      {
        "displayName": "account/update_profile_banner",
        "doc": {
          "t": "Uploads a profile banner on behalf of the authenticating user. For best results, upload an",
          "url": "/docs/api/1.1/post/account/update_profile_banner"
        },
        "httpMethod": "POST",
        "params": [
          {
            "name": "banner",
            "required": true,
            "style": "query"
          },
          {
            "name": "width",
            "required": false,
            "style": "query"
          },
          {
            "name": "height",
            "required": false,
            "style": "query"
          },
          {
            "name": "offset_left",
            "required": false,
            "style": "query"
          },
          {
            "name": "offset_top",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/account/update_profile_banner.json"
      },
      {
        "displayName": "users/profile_banner",
        "doc": {
          "t": "Returns a map of the available size variations of the specified user's profile banner. If the user has not uploaded a profile banner, a HTTP 404 will be served instead. This method can be used instead of string manipulation on the profile_banner_url returned in user objects as described in User...",
          "url": "/docs/api/1.1/get/users/profile_banner"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "user_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "screen_name",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/users/profile_banner.json"
      },
      {
        "displayName": "users/suggestions/:slug",
        "doc": {
          "t": "Access the users in a given category of the Twitter suggested user list.\nIt is recommended that applications cache this data for no more than one hour.",
          "url": "/docs/api/1.1/get/users/suggestions/%3Aslug"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "slug",
            "required": true,
            "style": "query"
          },
          {
            "name": "lang",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/users/suggestions/{slug}.json"
      },
      {
        "displayName": "users/suggestions",
        "doc": {
          "t": "Access to Twitter's suggested user list. This returns the list of suggested user categories. The category can be used in GET users/suggestions/:slug to get the users in that category.",
          "url": "/docs/api/1.1/get/users/suggestions"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "lang",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/users/suggestions.json"
      },
      {
        "displayName": "users/suggestions/:slug/members",
        "doc": {
          "t": "Access the users in a given category of the Twitter suggested user list and return their most recent status if they are not a protected user.",
          "url": "/docs/api/1.1/get/users/suggestions/%3Aslug/members"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "slug",
            "required": true,
            "style": "query"
          }
        ],
        "path": "/users/suggestions/{slug}/members.json"
      },
      {
        "displayName": "favorites/list",
        "doc": {
          "t": "Returns the 20 most recent Tweets favorited by the authenticating or specified user.",
          "url": "/docs/api/1.1/get/favorites/list"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "user_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "screen_name",
            "required": false,
            "style": "query"
          },
          {
            "name": "count",
            "required": false,
            "style": "query"
          },
          {
            "name": "since_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "max_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "include_entities",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/favorites/list.json"
      },
      {
        "displayName": "favorites/destroy",
        "doc": {
          "t": "Un-favorites the status specified in the ID parameter as the authenticating user. Returns the un-favorited status in the requested format when successful.\nThis process invoked by this method is asynchronous. The immediately returned status may not indicate the resultant favorited status of the...",
          "url": "/docs/api/1.1/post/favorites/destroy"
        },
        "httpMethod": "POST",
        "params": [
          {
            "name": "id",
            "required": true,
            "style": "query"
          },
          {
            "name": "include_entities",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/favorites/destroy.json"
      },
      {
        "displayName": "favorites/create",
        "doc": {
          "t": "Favorites the status specified in the ID parameter as the authenticating user. Returns the favorite status when successful.\nThis process invoked by this method is asynchronous. The immediately returned status may not indicate the resultant favorited status of the tweet. A 200 OK response from this...",
          "url": "/docs/api/1.1/post/favorites/create"
        },
        "httpMethod": "POST",
        "params": [
          {
            "name": "id",
            "required": true,
            "style": "query"
          },
          {
            "name": "include_entities",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/favorites/create.json"
      },
      {
        "displayName": "lists/list",
        "doc": {
          "t": "Returns all lists the authenticating or specified user subscribes to, including their own. The user is specified using the user_id or screen_name parameters. If no user is given, the authenticating user is used.\n\nThis method used to be GET lists in version 1.0 of the API and has been renamed for...",
          "url": "/docs/api/1.1/get/lists/list"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "user_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "screen_name",
            "required": false,
            "style": "query"
          },
          {
            "name": "reverse",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/lists/list.json"
      },
      {
        "displayName": "lists/statuses",
        "doc": {
          "t": "Returns a timeline of tweets authored by members of the specified list. Retweets are included by default. Use the include_rts=false parameter to omit retweets.\nEmbedded Timelines is a great way to embed list timelines on your website.",
          "url": "/docs/api/1.1/get/lists/statuses"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "list_id",
            "required": true,
            "style": "query"
          },
          {
            "name": "slug",
            "required": true,
            "style": "query"
          },
          {
            "name": "owner_screen_name",
            "required": false,
            "style": "query"
          },
          {
            "name": "owner_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "since_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "max_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "count",
            "required": false,
            "style": "query"
          },
          {
            "name": "include_entities",
            "required": false,
            "style": "query"
          },
          {
            "name": "include_rts",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/lists/statuses.json"
      },
      {
        "displayName": "lists/members/destroy",
        "doc": {
          "t": "Removes the specified member from the list. The authenticated user must be the list's owner to remove members from the list.",
          "url": "/docs/api/1.1/post/lists/members/destroy"
        },
        "httpMethod": "POST",
        "params": [
          {
            "name": "list_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "slug",
            "required": false,
            "style": "query"
          },
          {
            "name": "user_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "screen_name",
            "required": false,
            "style": "query"
          },
          {
            "name": "owner_screen_name",
            "required": false,
            "style": "query"
          },
          {
            "name": "owner_id",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/lists/members/destroy.json"
      },
      {
        "displayName": "lists/memberships",
        "doc": {
          "t": "Returns the lists the specified user has been added to. If user_id or screen_name are not provided the memberships for the authenticating user are returned.",
          "url": "/docs/api/1.1/get/lists/memberships"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "user_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "screen_name",
            "required": false,
            "style": "query"
          },
          {
            "name": "cursor",
            "required": false,
            "style": "query"
          },
          {
            "name": "filter_to_owned_lists",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/lists/memberships.json"
      },
      {
        "displayName": "lists/subscribers",
        "doc": {
          "t": "Returns the subscribers of the specified list. Private list subscribers will only be shown if the authenticated user owns the specified list.",
          "url": "/docs/api/1.1/get/lists/subscribers"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "list_id",
            "required": true,
            "style": "query"
          },
          {
            "name": "slug",
            "required": true,
            "style": "query"
          },
          {
            "name": "owner_screen_name",
            "required": false,
            "style": "query"
          },
          {
            "name": "owner_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "cursor",
            "required": false,
            "style": "query"
          },
          {
            "name": "include_entities",
            "required": false,
            "style": "query"
          },
          {
            "name": "skip_status",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/lists/subscribers.json"
      },
      {
        "displayName": "lists/subscribers/create",
        "doc": {
          "t": "Subscribes the authenticated user to the specified list.",
          "url": "/docs/api/1.1/post/lists/subscribers/create"
        },
        "httpMethod": "POST",
        "params": [
          {
            "name": "owner_screen_name",
            "required": false,
            "style": "query"
          },
          {
            "name": "owner_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "list_id",
            "required": true,
            "style": "query"
          },
          {
            "name": "slug",
            "required": true,
            "style": "query"
          }
        ],
        "path": "/lists/subscribers/create.json"
      },
      {
        "displayName": "lists/subscribers/show",
        "doc": {
          "t": "Check if the specified user is a subscriber of the specified list. Returns the user if they are subscriber.",
          "url": "/docs/api/1.1/get/lists/subscribers/show"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "owner_screen_name",
            "required": false,
            "style": "query"
          },
          {
            "name": "owner_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "list_id",
            "required": true,
            "style": "query"
          },
          {
            "name": "slug",
            "required": true,
            "style": "query"
          },
          {
            "name": "user_id",
            "required": true,
            "style": "query"
          },
          {
            "name": "screen_name",
            "required": true,
            "style": "query"
          },
          {
            "name": "include_entities",
            "required": false,
            "style": "query"
          },
          {
            "name": "skip_status",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/lists/subscribers/show.json"
      },
      {
        "displayName": "lists/subscribers/destroy",
        "doc": {
          "t": "Unsubscribes the authenticated user from the specified list.",
          "url": "/docs/api/1.1/post/lists/subscribers/destroy"
        },
        "httpMethod": "POST",
        "params": [
          {
            "name": "list_id",
            "required": true,
            "style": "query"
          },
          {
            "name": "slug",
            "required": true,
            "style": "query"
          },
          {
            "name": "owner_screen_name",
            "required": false,
            "style": "query"
          },
          {
            "name": "owner_id",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/lists/subscribers/destroy.json"
      },
      {
        "displayName": "lists/members/create_all",
        "doc": {
          "t": "Adds multiple members to a list, by specifying a comma-separated list of member ids or screen names. The authenticated user must own the list to be able to add members to it. Note that lists can't have more than 5,000 members, and you are limited to adding up to 100 members to a list at a time with...",
          "url": "/docs/api/1.1/post/lists/members/create_all"
        },
        "httpMethod": "POST",
        "params": [
          {
            "name": "list_id",
            "required": true,
            "style": "query"
          },
          {
            "name": "slug",
            "required": true,
            "style": "query"
          },
          {
            "name": "user_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "screen_name",
            "required": false,
            "style": "query"
          },
          {
            "name": "owner_screen_name",
            "required": false,
            "style": "query"
          },
          {
            "name": "owner_id",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/lists/members/create_all.json"
      },
      {
        "displayName": "lists/members/show",
        "doc": {
          "t": "Check if the specified user is a member of the specified list.",
          "url": "/docs/api/1.1/get/lists/members/show"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "list_id",
            "required": true,
            "style": "query"
          },
          {
            "name": "slug",
            "required": true,
            "style": "query"
          },
          {
            "name": "user_id",
            "required": true,
            "style": "query"
          },
          {
            "name": "screen_name",
            "required": true,
            "style": "query"
          },
          {
            "name": "owner_screen_name",
            "required": false,
            "style": "query"
          },
          {
            "name": "owner_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "include_entities",
            "required": false,
            "style": "query"
          },
          {
            "name": "skip_status",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/lists/members/show.json"
      },
      {
        "displayName": "lists/members",
        "doc": {
          "t": "Returns the members of the specified list. Private list members will only be shown if the authenticated user owns the specified list.",
          "url": "/docs/api/1.1/get/lists/members"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "list_id",
            "required": true,
            "style": "query"
          },
          {
            "name": "slug",
            "required": true,
            "style": "query"
          },
          {
            "name": "owner_screen_name",
            "required": false,
            "style": "query"
          },
          {
            "name": "owner_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "cursor",
            "required": true,
            "style": "query"
          },
          {
            "name": "include_entities",
            "required": false,
            "style": "query"
          },
          {
            "name": "skip_status",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/lists/members.json"
      },
      {
        "displayName": "lists/members/create",
        "doc": {
          "t": "Add a member to a list. The authenticated user must own the list to be able to add members to it. Note that lists cannot have more than 5,000 members.",
          "url": "/docs/api/1.1/post/lists/members/create"
        },
        "httpMethod": "POST",
        "params": [
          {
            "name": "list_id",
            "required": true,
            "style": "query"
          },
          {
            "name": "slug",
            "required": true,
            "style": "query"
          },
          {
            "name": "user_id",
            "required": true,
            "style": "query"
          },
          {
            "name": "screen_name",
            "required": true,
            "style": "query"
          },
          {
            "name": "owner_screen_name",
            "required": false,
            "style": "query"
          },
          {
            "name": "owner_id",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/lists/members/create.json"
      },
      {
        "displayName": "lists/destroy",
        "doc": {
          "t": "Deletes the specified list. The authenticated user must own the list to be able to destroy it.",
          "url": "/docs/api/1.1/post/lists/destroy"
        },
        "httpMethod": "POST",
        "params": [
          {
            "name": "owner_screen_name",
            "required": false,
            "style": "query"
          },
          {
            "name": "owner_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "list_id",
            "required": true,
            "style": "query"
          },
          {
            "name": "slug",
            "required": true,
            "style": "query"
          }
        ],
        "path": "/lists/destroy.json"
      },
      {
        "displayName": "lists/update",
        "doc": {
          "t": "Updates the specified list. The authenticated user must own the list to be able to update it.",
          "url": "/docs/api/1.1/post/lists/update"
        },
        "httpMethod": "POST",
        "params": [
          {
            "name": "list_id",
            "required": true,
            "style": "query"
          },
          {
            "name": "slug",
            "required": true,
            "style": "query"
          },
          {
            "name": "name",
            "required": false,
            "style": "query"
          },
          {
            "name": "mode",
            "required": false,
            "style": "query"
          },
          {
            "name": "description",
            "required": false,
            "style": "query"
          },
          {
            "name": "owner_screen_name",
            "required": false,
            "style": "query"
          },
          {
            "name": "owner_id",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/lists/update.json"
      },
      {
        "displayName": "lists/create",
        "doc": {
          "t": "Creates a new list for the authenticated user. Note that you can't create more than 20 lists per account.",
          "url": "/docs/api/1.1/post/lists/create"
        },
        "httpMethod": "POST",
        "params": [
          {
            "name": "name",
            "required": true,
            "style": "query"
          },
          {
            "name": "mode",
            "required": false,
            "style": "query"
          },
          {
            "name": "description",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/lists/create.json"
      },
      {
        "displayName": "lists/show",
        "doc": {
          "t": "Returns the specified list. Private lists will only be shown if the authenticated user owns the specified list.",
          "url": "/docs/api/1.1/get/lists/show"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "list_id",
            "required": true,
            "style": "query"
          },
          {
            "name": "slug",
            "required": true,
            "style": "query"
          },
          {
            "name": "owner_screen_name",
            "required": false,
            "style": "query"
          },
          {
            "name": "owner_id",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/lists/show.json"
      },
      {
        "displayName": "lists/subscriptions",
        "doc": {
          "t": "Obtain a collection of the lists the specified user is subscribed to, 20 lists per page by default.  Does not include the user's own lists.",
          "url": "/docs/api/1.1/get/lists/subscriptions"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "user_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "screen_name",
            "required": false,
            "style": "query"
          },
          {
            "name": "count",
            "required": false,
            "style": "query"
          },
          {
            "name": "cursor",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/lists/subscriptions.json"
      },
      {
        "displayName": "lists/members/destroy_all",
        "doc": {
          "t": "Removes multiple members from a list, by specifying a comma-separated list of member ids or screen names. The authenticated user must own the list to be able to remove members from it. Note that lists can't have more than 500 members, and you are limited to removing up to 100 members to a list at a...",
          "url": "/docs/api/1.1/post/lists/members/destroy_all"
        },
        "httpMethod": "POST",
        "params": [
          {
            "name": "list_id",
            "required": true,
            "style": "query"
          },
          {
            "name": "slug",
            "required": true,
            "style": "query"
          },
          {
            "name": "user_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "screen_name",
            "required": false,
            "style": "query"
          },
          {
            "name": "owner_screen_name",
            "required": false,
            "style": "query"
          },
          {
            "name": "owner_id",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/lists/members/destroy_all.json"
      },
      {
        "displayName": "lists/ownerships",
        "doc": {
          "t": "Returns the lists owned by the specified Twitter user. Private lists will only be shown if the authenticated user is also the owner of the lists.",
          "url": "/docs/api/1.1/get/lists/ownerships"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "user_id",
            "required": false,
            "style": "query"
          },
          {
            "name": "screen_name",
            "required": false,
            "style": "query"
          },
          {
            "name": "count",
            "required": false,
            "style": "query"
          },
          {
            "name": "cursor",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/lists/ownerships.json"
      },
      {
        "displayName": "saved_searches/list",
        "doc": {
          "t": "Returns the authenticated user's saved search queries.",
          "url": "/docs/api/1.1/get/saved_searches/list"
        },
        "httpMethod": "GET",
        "params": [],
        "path": "/saved_searches/list.json"
      },
      {
        "displayName": "saved_searches/show/:id",
        "doc": {
          "t": "Retrieve the information for the saved search represented by the given id. The authenticating user must be the owner of saved search ID being requested.",
          "url": "/docs/api/1.1/get/saved_searches/show/%3Aid"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "id",
            "required": true,
            "style": "query"
          }
        ],
        "path": "/saved_searches/show/{id}.json"
      },
      {
        "displayName": "saved_searches/create",
        "doc": {
          "t": "Create a new saved search for the authenticated user. A user may only have 25 saved searches.",
          "url": "/docs/api/1.1/post/saved_searches/create"
        },
        "httpMethod": "POST",
        "params": [
          {
            "name": "query",
            "required": true,
            "style": "query"
          }
        ],
        "path": "/saved_searches/create.json"
      },
      {
        "displayName": "saved_searches/destroy/:id",
        "doc": {
          "t": "Destroys a saved search for the authenticating user. The authenticating user must be the owner of saved search id being destroyed.",
          "url": "/docs/api/1.1/post/saved_searches/destroy/%3Aid"
        },
        "httpMethod": "POST",
        "params": [
          {
            "name": "id",
            "required": true,
            "style": "query"
          }
        ],
        "path": "/saved_searches/destroy/{id}.json"
      },
      {
        "displayName": "geo/id/:place_id",
        "doc": {
          "t": "Returns all the information about a known place.",
          "url": "/docs/api/1.1/get/geo/id/%3Aplace_id"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "place_id",
            "required": true,
            "style": "query"
          }
        ],
        "path": "/geo/id/:place_id.json"
      },
      {
        "displayName": "geo/reverse_geocode",
        "doc": {
          "t": "Given a latitude and a longitude, searches for up to 20 places that can be used as a place_id when updating a status.\nThis request is an informative call and will deliver generalized results about geography.",
          "url": "/docs/api/1.1/get/geo/reverse_geocode"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "lat",
            "required": true,
            "style": "query"
          },
          {
            "name": "long",
            "required": true,
            "style": "query"
          },
          {
            "name": "accuracy",
            "required": false,
            "style": "query"
          },
          {
            "name": "granularity",
            "required": false,
            "style": "query"
          },
          {
            "name": "max_results",
            "required": false,
            "style": "query"
          },
          {
            "name": "callback",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/geo/reverse_geocode.json"
      },
      {
        "displayName": "geo/search",
        "doc": {
          "t": "Search for places that can be attached to a statuses/update. Given a latitude and a longitude pair, an IP address, or a name, this request will return a list of all the valid places that can be used as the place_id when updating a status.\n\nConceptually, a query can be made from the user's location...",
          "url": "/docs/api/1.1/get/geo/search"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "lat",
            "required": false,
            "style": "query"
          },
          {
            "name": "long",
            "required": false,
            "style": "query"
          },
          {
            "name": "query",
            "required": false,
            "style": "query"
          },
          {
            "name": "ip",
            "required": false,
            "style": "query"
          },
          {
            "name": "granularity",
            "required": false,
            "style": "query"
          },
          {
            "name": "accuracy",
            "required": false,
            "style": "query"
          },
          {
            "name": "max_results",
            "required": false,
            "style": "query"
          },
          {
            "name": "contained_within",
            "required": false,
            "style": "query"
          },
          {
            "name": "attribute:street_address",
            "required": false,
            "style": "query"
          },
          {
            "name": "callback",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/geo/search.json"
      },
      {
        "displayName": "geo/similar_places",
        "doc": {
          "t": "Locates places near the given coordinates which are similar in name.",
          "url": "/docs/api/1.1/get/geo/similar_places"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "lat",
            "required": true,
            "style": "query"
          },
          {
            "name": "long",
            "required": true,
            "style": "query"
          },
          {
            "name": "name",
            "required": true,
            "style": "query"
          },
          {
            "name": "contained_within",
            "required": false,
            "style": "query"
          },
          {
            "name": "attribute:street_address",
            "required": false,
            "style": "query"
          },
          {
            "name": "callback",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/geo/similar_places.json"
      },
      {
        "displayName": "geo/place",
        "doc": {
          "t": "As of December 2nd, 2013, this endpoint is deprecated and retired and no longer functions. Place creation was used infrequently by third party applications and is generally no longer supported on Twitter. Requests will return with status 410 (Gone) with error code 251.\nFollow the discussion about...",
          "url": "/docs/api/1.1/post/geo/place"
        },
        "httpMethod": "POST",
        "params": [
          {
            "name": "name",
            "required": true,
            "style": "query"
          },
          {
            "name": "contained_within",
            "required": true,
            "style": "query"
          },
          {
            "name": "token",
            "required": true,
            "style": "query"
          },
          {
            "name": "lat",
            "required": true,
            "style": "query"
          },
          {
            "name": "long",
            "required": true,
            "style": "query"
          },
          {
            "name": "attribute:street_address",
            "required": false,
            "style": "query"
          },
          {
            "name": "callback",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/geo/place.json"
      },
      {
        "displayName": "trends/place",
        "doc": {
          "t": "Returns the top 10 trending topics for a specific WOEID, if trending information is available for it.\nThe response is an array of \"trend\" objects that encode the name of the trending topic, the query parameter that can be used to search for the topic on Twitter Search, and the Twitter Search URL....",
          "url": "/docs/api/1.1/get/trends/place"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "id",
            "required": true,
            "style": "query"
          },
          {
            "name": "exclude",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/trends/place.json"
      },
      {
        "displayName": "trends/available",
        "doc": {
          "t": "Returns the locations that Twitter has trending topic information for.\nThe response is an array of \"locations\" that encode the location's WOEID and some other human-readable information such as a canonical name and country the location belongs in.\nA WOEID is a Yahoo! Where On Earth ID.",
          "url": "/docs/api/1.1/get/trends/available"
        },
        "httpMethod": "GET",
        "params": [],
        "path": "/trends/available.json"
      },
      {
        "displayName": "trends/closest",
        "doc": {
          "t": "Returns the locations that Twitter has trending topic information for, closest to a specified location.\nThe response is an array of \"locations\" that encode the location's WOEID and some other human-readable information such as a canonical name and country the location belongs in.\nA WOEID is a Yahoo...",
          "url": "/docs/api/1.1/get/trends/closest"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "lat",
            "required": true,
            "style": "query"
          },
          {
            "name": "long",
            "required": true,
            "style": "query"
          }
        ],
        "path": "/trends/closest.json"
      },
      {
        "displayName": "users/report_spam",
        "doc": {
          "t": "Report the specified user as a spam account to Twitter. Additionally performs the equivalent of POST blocks/create on behalf of the authenticated user.",
          "url": "/docs/api/1.1/post/users/report_spam"
        },
        "httpMethod": "POST",
        "params": [
          {
            "name": "screen_name",
            "required": false,
            "style": "query"
          },
          {
            "name": "user_id",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/users/report_spam.json"
      },
      {
        "displayName": "oauth/authenticate",
        "doc": {
          "t": "Allows a Consumer application to use an OAuth request_token to request user authorization. \nThis method is a replacement of Section 6.2 of the OAuth 1.0 authentication flow for applications using the callback authentication flow. The method will use the currently logged in user as the account for...",
          "url": "/docs/api/1/get/oauth/authenticate"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "force_login",
            "required": false,
            "style": "query"
          },
          {
            "name": "screen_name",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/oauth/authenticate.json"
      },
      {
        "displayName": "oauth/authorize",
        "doc": {
          "t": "Allows a Consumer application to use an OAuth Request Token to request user authorization. This method fulfills Section 6.2 of the OAuth 1.0 authentication flow. Desktop applications must use this method (and cannot use GET oauth/authenticate).\nPlease use HTTPS for this method, and all other OAuth...",
          "url": "/docs/api/1/get/oauth/authorize"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "force_login",
            "required": false,
            "style": "query"
          },
          {
            "name": "screen_name",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/oauth/authorize.json"
      },
      {
        "displayName": "oauth/access_token",
        "doc": {
          "t": "Allows a Consumer application to exchange the OAuth Request Token for an OAuth Access Token. This method fulfills Section 6.3 of the OAuth 1.0 authentication flow.\nThe OAuth access token may also be used for xAuth operations.\nPlease use HTTPS for this method, and all other OAuth token negotiation...",
          "url": "/docs/api/1/post/oauth/access_token"
        },
        "httpMethod": "POST",
        "params": [
          {
            "name": "x_auth_password",
            "required": false,
            "style": "query"
          },
          {
            "name": "x_auth_username",
            "required": false,
            "style": "query"
          },
          {
            "name": "x_auth_mode",
            "required": false,
            "style": "query"
          },
          {
            "name": "oauth_verifier",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/oauth/access_token.json"
      },
      {
        "displayName": "oauth/request_token",
        "doc": {
          "t": "Allows a Consumer application to obtain an OAuth Request Token to request user authorization. This method fulfills Section 6.1 of the OAuth 1.0 authentication flow.\nIt is strongly recommended you use HTTPS for all OAuth authorization steps.\nUsage Note: Only ASCII values are accepted for the...",
          "url": "/docs/api/1/post/oauth/request_token"
        },
        "httpMethod": "POST",
        "params": [
          {
            "name": "oauth_callback",
            "required": true,
            "style": "query"
          },
          {
            "name": "x_auth_access_type",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/oauth/request_token.json"
      },
      {
        "displayName": "oauth2/token",
        "doc": {
          "t": "Allows a registered application to obtain an OAuth 2 Bearer Token, which can be used to make API requests on an application's own behalf, without a user context. This is called Application-only authentication.\n\nA Bearer Token may be invalidated using oauth2/invalidate_token. Once a Bearer Token has...",
          "url": "/docs/api/1.1/post/oauth2/token"
        },
        "httpMethod": "POST",
        "params": [
          {
            "name": "grant_type",
            "required": true,
            "style": "query"
          }
        ],
        "path": "/oauth2/token.json"
      },
      {
        "displayName": "oauth2/invalidate_token",
        "doc": {
          "t": "Allows a registered application to revoke an issued OAuth 2 Bearer Token by presenting its client credentials. Once a Bearer Token has been invalidated, new creation attempts will yield a different Bearer Token and usage of the invalidated token will no longer be allowed.\n\nAs with all API v1.1...",
          "url": "/docs/api/1.1/post/oauth2/invalidate_token"
        },
        "httpMethod": "POST",
        "params": [
          {
            "name": "access_token",
            "required": true,
            "style": "query"
          }
        ],
        "path": "/oauth2/invalidate_token.json"
      },
      {
        "displayName": "help/configuration",
        "doc": {
          "t": "Returns the current configuration used by Twitter including twitter.com slugs which are not usernames, maximum photo resolutions, and t.co URL lengths.\n\nIt is recommended applications request this endpoint when they are loaded, but no more than once a day.",
          "url": "/docs/api/1.1/get/help/configuration"
        },
        "httpMethod": "GET",
        "params": [],
        "path": "/help/configuration.json"
      },
      {
        "displayName": "help/languages",
        "doc": {
          "t": "Returns the list of languages supported by Twitter along with their ISO 639-1 code. The ISO 639-1 code is the two letter value to use if you include lang with any of your requests.",
          "url": "/docs/api/1.1/get/help/languages"
        },
        "httpMethod": "GET",
        "params": [],
        "path": "/help/languages.json"
      },
      {
        "displayName": "help/privacy",
        "doc": {
          "t": "Returns Twitter's Privacy Policy.",
          "url": "/docs/api/1.1/get/help/privacy"
        },
        "httpMethod": "GET",
        "params": [],
        "path": "/help/privacy.json"
      },
      {
        "displayName": "help/tos",
        "doc": {
          "t": "Returns the Twitter Terms of Service in the requested format. These are not the same as the Developer Rules of the Road.",
          "url": "/docs/api/1.1/get/help/tos"
        },
        "httpMethod": "GET",
        "params": [],
        "path": "/help/tos.json"
      },
      {
        "displayName": "application/rate_limit_status",
        "doc": {
          "t": "Returns the current rate limits for methods belonging to the specified resource families.\n\nEach 1.1 API resource belongs to a \"resource family\" which is indicated in its method documentation. You can typically determine a method's resource family from the first component of the path after the...",
          "url": "/docs/api/1.1/get/application/rate_limit_status"
        },
        "httpMethod": "GET",
        "params": [
          {
            "name": "resources",
            "required": false,
            "style": "query"
          }
        ],
        "path": "/application/rate_limit_status.json"
      }
    ]
  },
  "auth_strategy": "oauth",
  "description" : "Lockitron lets you replace your keys with your phone.",
  "documentation": "https://api.lockitron.com/v1/docs",
  "enabled": true,
  "logo": "https://s3-us-west-2.amazonaws.com/octoblu-icons/lockitron.png",
  "logobw": "https://s3-us-west-2.amazonaws.com/octoblu-icons/lockitron-bw.png",
  "name": "Lockitron",
  "oauth": {
    "authTokenPath": "/oauth/token",
    "authTokenURL": "https://api.lockitron.com/oauth/authorize",
    "baseURL": "https://api.lockitron.com",
    "clientId": "59e9b56517291cf40a87d3a60a5feb4febe402983e60c528182d32ee23b8576e",
    "scope": "",
    "secret": "ada2e03c69fdf4fb404098a5bb884fb83881912c4f28d52bf83c07ed8b42ae2f",
    "tokenMethod": "access_token",
    "version": "2.0"
  },
  "useCustom": true
}

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

