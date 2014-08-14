var record = {
  "application" : {
    "base" : null,
    "resources" : [
      {
        "path" : "/?method=getActivityStream",
        "params" : [
          {
            "name" : "Content-Type",
            "type" : "xsd:string",
            "style" : "header",
            "default" : "application/x-www-form-urlencoded",
            "required" : "true"
          }
        ],
        "doc" : {
          "t" : "Gets the activity events for a user, a user's friends, or everyone on Rdio.The content type corresponding to a HTML form submit, application/x-www-form-urlencoded.",
          "url" : "http://developer.rdio.com/docs/read/rest/Methods#activity"
        },
        "curl" : "curl -X POST  -h 'Content-Type: application/x-www-form-urlencoded' http://api.rdio.com/1/?method=getActivityStream",
        "authentication" : {
          "required" : "false"
        },
        "category" : "Activity and Statistics",
        "displayName" : "Activity and Statistics_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/?method=getTopCharts",
        "params" : [
          {
            "name" : "Content-Type",
            "type" : "xsd:string",
            "style" : "header",
            "default" : "application/x-www-form-urlencoded",
            "required" : "true"
          }
        ],
        "doc" : {
          "t" : "Returns the site-wide most popular items for a given type.The content type corresponding to a HTML form submit, application/x-www-form-urlencoded.",
          "url" : "http://developer.rdio.com/docs/read/rest/Methods#activity"
        },
        "curl" : "curl -X POST  -h 'Content-Type: application/x-www-form-urlencoded' http://api.rdio.com/1/?method=getTopCharts",
        "authentication" : {
          "required" : "false"
        },
        "category" : "Activity and Statistics",
        "displayName" : "Activity and Statistics_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/?method=getNewReleases",
        "params" : [
          {
            "name" : "Content-Type",
            "type" : "xsd:string",
            "style" : "header",
            "default" : "application/x-www-form-urlencoded",
            "required" : "true"
          }
        ],
        "doc" : {
          "t" : "Returns new albums released across a timeframe.The content type corresponding to a HTML form submit, application/x-www-form-urlencoded.",
          "url" : "http://developer.rdio.com/docs/read/rest/Methods#activity"
        },
        "curl" : "curl -X POST  -h 'Content-Type: application/x-www-form-urlencoded' http://api.rdio.com/1/?method=getNewReleases",
        "authentication" : {
          "required" : "false"
        },
        "category" : "Activity and Statistics",
        "displayName" : "Activity and Statistics_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/?method=getHeavyRotation",
        "params" : [
          {
            "name" : "Content-Type",
            "type" : "xsd:string",
            "style" : "header",
            "default" : "application/x-www-form-urlencoded",
            "required" : "true"
          }
        ],
        "doc" : {
          "t" : "Finds the most popular artists or albums for a user, their friends or the whole site.The content type corresponding to a HTML form submit, application/x-www-form-urlencoded.",
          "url" : "http://developer.rdio.com/docs/read/rest/Methods#activity"
        },
        "curl" : "curl -X POST  -h 'Content-Type: application/x-www-form-urlencoded' http://api.rdio.com/1/?method=getHeavyRotation",
        "authentication" : {
          "required" : "false"
        },
        "category" : "Activity and Statistics",
        "displayName" : "Activity and Statistics_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/?method=getAlbumsForArtist",
        "params" : [
          {
            "name" : "Content-Type",
            "type" : "xsd:string",
            "style" : "header",
            "default" : "application/x-www-form-urlencoded",
            "required" : "true"
          }
        ],
        "doc" : {
          "t" : "Returns the albums by (or featuring) an artist.The content type corresponding to a HTML form submit, application/x-www-form-urlencoded.",
          "url" : "http://developer.rdio.com/docs/read/rest/Methods#catalog"
        },
        "curl" : "curl -X POST  -h 'Content-Type: application/x-www-form-urlencoded' http://api.rdio.com/1/?method=getAlbumsForArtist",
        "authentication" : {
          "required" : "false"
        },
        "category" : "Catalog",
        "displayName" : "Catalog_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/?method=getTracksByISRC",
        "params" : [
          {
            "name" : "Content-Type",
            "type" : "xsd:string",
            "style" : "header",
            "default" : "application/x-www-form-urlencoded",
            "required" : "true"
          }
        ],
        "doc" : {
          "t" : "Finds and returns tracks based on their International Standard Recording Code (ISRC).The content type corresponding to a HTML form submit, application/x-www-form-urlencoded.",
          "url" : "http://developer.rdio.com/docs/read/rest/Methods#catalog"
        },
        "curl" : "curl -X POST  -h 'Content-Type: application/x-www-form-urlencoded' http://api.rdio.com/1/?method=getTracksByISRC",
        "authentication" : {
          "required" : "false"
        },
        "category" : "Catalog",
        "displayName" : "Catalog_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/?method=getTracksForArtist",
        "params" : [
          {
            "name" : "Content-Type",
            "type" : "xsd:string",
            "style" : "header",
            "default" : "application/x-www-form-urlencoded",
            "required" : "true"
          }
        ],
        "doc" : {
          "t" : "Gets all of the tracks by this artist.The content type corresponding to a HTML form submit, application/x-www-form-urlencoded.",
          "url" : "http://developer.rdio.com/docs/read/rest/Methods#catalog"
        },
        "curl" : "curl -X POST  -h 'Content-Type: application/x-www-form-urlencoded' http://api.rdio.com/1/?method=getTracksForArtist",
        "authentication" : {
          "required" : "false"
        },
        "category" : "Catalog",
        "displayName" : "Catalog_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/?method=search",
        "params" : [
          {
            "name" : "Content-Type",
            "type" : "xsd:string",
            "style" : "header",
            "default" : "application/x-www-form-urlencoded",
            "required" : "true"
          }
        ],
        "doc" : {
          "t" : "Searches for artists, albums, tracks, users or all kinds of objects.The content type corresponding to a HTML form submit, application/x-www-form-urlencoded.",
          "url" : "http://developer.rdio.com/docs/read/rest/Methods#catalog"
        },
        "curl" : "curl -X POST  -h 'Content-Type: application/x-www-form-urlencoded' http://api.rdio.com/1/?method=search",
        "authentication" : {
          "required" : "false"
        },
        "category" : "Catalog",
        "displayName" : "Catalog_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/?method=searchSuggestions",
        "params" : [
          {
            "name" : "Content-Type",
            "type" : "xsd:string",
            "style" : "header",
            "default" : "application/x-www-form-urlencoded",
            "required" : "true"
          }
        ],
        "doc" : {
          "t" : "Matches the supplied prefix against artists, albums, tracks and people in the Rdio system. Return the first ten matches.The content type corresponding to a HTML form submit, application/x-www-form-urlencoded.",
          "url" : "http://developer.rdio.com/docs/read/rest/Methods#catalog"
        },
        "curl" : "curl -X POST  -h 'Content-Type: application/x-www-form-urlencoded' http://api.rdio.com/1/?method=searchSuggestions",
        "authentication" : {
          "required" : "false"
        },
        "category" : "Catalog",
        "displayName" : "Catalog_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/?method=getAlbumsByUPC",
        "params" : [
          {
            "name" : "Content-Type",
            "type" : "xsd:string",
            "style" : "header",
            "default" : "application/x-www-form-urlencoded",
            "required" : "true"
          }
        ],
        "doc" : {
          "t" : "Finds and returns albums based on their Universal Product Code (UPC).The content type corresponding to a HTML form submit, application/x-www-form-urlencoded.",
          "url" : "http://developer.rdio.com/docs/read/rest/Methods#catalog"
        },
        "curl" : "curl -X POST  -h 'Content-Type: application/x-www-form-urlencoded' http://api.rdio.com/1/?method=getAlbumsByUPC",
        "authentication" : {
          "required" : "false"
        },
        "category" : "Catalog",
        "displayName" : "Catalog_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/?method=addToCollection",
        "params" : [
          {
            "name" : "Content-Type",
            "type" : "xsd:string",
            "style" : "header",
            "default" : "application/x-www-form-urlencoded",
            "required" : "true"
          }
        ],
        "doc" : {
          "t" : "Adds tracks or playlists to the current user's collection.The content type corresponding to a HTML form submit, application/x-www-form-urlencoded.",
          "url" : "http://developer.rdio.com/docs/read/rest/Methods#collection"
        },
        "curl" : "curl -X POST -u 'username:password' -h 'Content-Type: application/x-www-form-urlencoded' http://api.rdio.com/1/?method=addToCollection",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Collection",
        "displayName" : "Collection_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/?method=getAlbumsInCollection",
        "params" : [
          {
            "name" : "Content-Type",
            "type" : "xsd:string",
            "style" : "header",
            "default" : "application/x-www-form-urlencoded",
            "required" : "true"
          }
        ],
        "doc" : {
          "t" : "Gets all of the albums in the user's collection.The content type corresponding to a HTML form submit, application/x-www-form-urlencoded.",
          "url" : "http://developer.rdio.com/docs/read/rest/Methods#collection"
        },
        "curl" : "curl -X POST  -h 'Content-Type: application/x-www-form-urlencoded' http://api.rdio.com/1/?method=getAlbumsInCollection",
        "authentication" : {
          "required" : "false"
        },
        "category" : "Collection",
        "displayName" : "Collection_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/?method=getArtistsInCollection",
        "params" : [
          {
            "name" : "Content-Type",
            "type" : "xsd:string",
            "style" : "header",
            "default" : "application/x-www-form-urlencoded",
            "required" : "true"
          }
        ],
        "doc" : {
          "t" : "Gets all of the artist in a user's collection.The content type corresponding to a HTML form submit, application/x-www-form-urlencoded.",
          "url" : "http://developer.rdio.com/docs/read/rest/Methods#collection"
        },
        "curl" : "curl -X POST  -h 'Content-Type: application/x-www-form-urlencoded' http://api.rdio.com/1/?method=getArtistsInCollection",
        "authentication" : {
          "required" : "false"
        },
        "category" : "Collection",
        "displayName" : "Collection_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/?method=getTracksForAlbumInCollection",
        "params" : [
          {
            "name" : "Content-Type",
            "type" : "xsd:string",
            "style" : "header",
            "default" : "application/x-www-form-urlencoded",
            "required" : "true"
          }
        ],
        "doc" : {
          "t" : "Which tracks on the given album are in the user's collection.The content type corresponding to a HTML form submit, application/x-www-form-urlencoded.",
          "url" : "http://developer.rdio.com/docs/read/rest/Methods#collection"
        },
        "curl" : "curl -X POST  -h 'Content-Type: application/x-www-form-urlencoded' http://api.rdio.com/1/?method=getTracksForAlbumInCollection",
        "authentication" : {
          "required" : "false"
        },
        "category" : "Collection",
        "displayName" : "Collection_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/?method=getTracksForArtistInCollection",
        "params" : [
          {
            "name" : "Content-Type",
            "type" : "xsd:string",
            "style" : "header",
            "default" : "application/x-www-form-urlencoded",
            "required" : "true"
          }
        ],
        "doc" : {
          "t" : "Which tracks from the given artist are in the user's collection.The content type corresponding to a HTML form submit, application/x-www-form-urlencoded.",
          "url" : "http://developer.rdio.com/docs/read/rest/Methods#collection"
        },
        "curl" : "curl -X POST  -h 'Content-Type: application/x-www-form-urlencoded' http://api.rdio.com/1/?method=getTracksForArtistInCollection",
        "authentication" : {
          "required" : "false"
        },
        "category" : "Collection",
        "displayName" : "Collection_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/?method=getTracksInCollection",
        "params" : [
          {
            "name" : "Content-Type",
            "type" : "xsd:string",
            "style" : "header",
            "default" : "application/x-www-form-urlencoded",
            "required" : "true"
          }
        ],
        "doc" : {
          "t" : "Gets all of the tracks in the user's collection.The content type corresponding to a HTML form submit, application/x-www-form-urlencoded.",
          "url" : "http://developer.rdio.com/docs/read/rest/Methods#collection"
        },
        "curl" : "curl -X POST  -h 'Content-Type: application/x-www-form-urlencoded' http://api.rdio.com/1/?method=getTracksInCollection",
        "authentication" : {
          "required" : "false"
        },
        "category" : "Collection",
        "displayName" : "Collection_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/?method=removeFromCollection",
        "params" : [
          {
            "name" : "Content-Type",
            "type" : "xsd:string",
            "style" : "header",
            "default" : "application/x-www-form-urlencoded",
            "required" : "true"
          }
        ],
        "doc" : {
          "t" : "Removes tracks or playlists from the current user's collection.The content type corresponding to a HTML form submit, application/x-www-form-urlencoded.",
          "url" : "http://developer.rdio.com/docs/read/rest/Methods#collection"
        },
        "curl" : "curl -X POST -u 'username:password' -h 'Content-Type: application/x-www-form-urlencoded' http://api.rdio.com/1/?method=removeFromCollection",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Collection",
        "displayName" : "Collection_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/?method=setAvailableOffline",
        "params" : [
          {
            "name" : "Content-Type",
            "type" : "xsd:string",
            "style" : "header",
            "default" : "application/x-www-form-urlencoded",
            "required" : "true"
          }
        ],
        "doc" : {
          "t" : "Marks tracks or playlists for offline syncing.The content type corresponding to a HTML form submit, application/x-www-form-urlencoded.",
          "url" : "http://developer.rdio.com/docs/read/rest/Methods#collection"
        },
        "curl" : "curl -X POST -u 'username:password' -h 'Content-Type: application/x-www-form-urlencoded' http://api.rdio.com/1/?method=setAvailableOffline",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Collection",
        "displayName" : "Collection_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/?method=getAlbumsForArtistInCollection",
        "params" : [
          {
            "name" : "Content-Type",
            "type" : "xsd:string",
            "style" : "header",
            "default" : "application/x-www-form-urlencoded",
            "required" : "true"
          }
        ],
        "doc" : {
          "t" : "Gets the albums in the user's collection by a particular artist.The content type corresponding to a HTML form submit, application/x-www-form-urlencoded.",
          "url" : "http://developer.rdio.com/docs/read/rest/Methods#collection"
        },
        "curl" : "curl -X POST  -h 'Content-Type: application/x-www-form-urlencoded' http://api.rdio.com/1/?method=getAlbumsForArtistInCollection",
        "authentication" : {
          "required" : "false"
        },
        "category" : "Collection",
        "displayName" : "Collection_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/?method=getObjectFromShortCode",
        "params" : [
          {
            "name" : "Content-Type",
            "type" : "xsd:string",
            "style" : "header",
            "default" : "application/x-www-form-urlencoded",
            "required" : "true"
          }
        ],
        "doc" : {
          "t" : "Return the object that the supplied Rdio short-code is a representation of, or null if the short-code is invalid.The content type corresponding to a HTML form submit, application/x-www-form-urlencoded.",
          "url" : "http://developer.rdio.com/docs/read/rest/Methods#core"
        },
        "curl" : "curl -X POST  -h 'Content-Type: application/x-www-form-urlencoded' http://api.rdio.com/1/?method=getObjectFromShortCode",
        "authentication" : {
          "required" : "false"
        },
        "category" : "Core",
        "displayName" : "Core_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/?method=getObjectFromUrl",
        "params" : [
          {
            "name" : "Content-Type",
            "type" : "xsd:string",
            "style" : "header",
            "default" : "application/x-www-form-urlencoded",
            "required" : "true"
          }
        ],
        "doc" : {
          "t" : "Return the object that the supplied Rdio url is a representation of, or null if the url doesn't represent an object.The content type corresponding to a HTML form submit, application/x-www-form-urlencoded.",
          "url" : "http://developer.rdio.com/docs/read/rest/Methods#core"
        },
        "curl" : "curl -X POST  -h 'Content-Type: application/x-www-form-urlencoded' http://api.rdio.com/1/?method=getObjectFromUrl",
        "authentication" : {
          "required" : "false"
        },
        "category" : "Core",
        "displayName" : "Core_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/?method=get",
        "params" : [
          {
            "name" : "Content-Type",
            "type" : "xsd:string",
            "style" : "header",
            "default" : "application/x-www-form-urlencoded",
            "required" : "true"
          }
        ],
        "doc" : {
          "t" : "Fetch one or more objects from Rdio.The content type corresponding to a HTML form submit, application/x-www-form-urlencoded.",
          "url" : "http://developer.rdio.com/docs/read/rest/Methods#core"
        },
        "curl" : "curl -X POST  -h 'Content-Type: application/x-www-form-urlencoded' http://api.rdio.com/1/?method=get",
        "authentication" : {
          "required" : "false"
        },
        "category" : "Core",
        "displayName" : "Core_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/?method=getPlaybackToken",
        "params" : [
          {
            "name" : "Content-Type",
            "type" : "xsd:string",
            "style" : "header",
            "default" : "application/x-www-form-urlencoded",
            "required" : "true"
          }
        ],
        "doc" : {
          "t" : "Gets an playback token. If you are using this for web playback you must supply a domain.The content type corresponding to a HTML form submit, application/x-www-form-urlencoded.",
          "url" : "http://developer.rdio.com/docs/read/rest/Methods#playback"
        },
        "curl" : "curl -X POST  -h 'Content-Type: application/x-www-form-urlencoded' http://api.rdio.com/1/?method=getPlaybackToken",
        "authentication" : {
          "required" : "false"
        },
        "category" : "Playback",
        "displayName" : "Playback_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/?method=setPlaylistCollaborating",
        "params" : [
          {
            "name" : "Content-Type",
            "type" : "xsd:string",
            "style" : "header",
            "default" : "application/x-www-form-urlencoded",
            "required" : "true"
          }
        ],
        "doc" : {
          "t" : "Starts or stops collaborating on this playlist.The content type corresponding to a HTML form submit, application/x-www-form-urlencoded.",
          "url" : "http://developer.rdio.com/docs/read/rest/Methods#playlists"
        },
        "curl" : "curl -X POST -u 'username:password' -h 'Content-Type: application/x-www-form-urlencoded' http://api.rdio.com/1/?method=setPlaylistCollaborating",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Playlists",
        "displayName" : "Playlists_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/?method=setPlaylistCollaborationMode",
        "params" : [
          {
            "name" : "Content-Type",
            "type" : "xsd:string",
            "style" : "header",
            "default" : "application/x-www-form-urlencoded",
            "required" : "true"
          }
        ],
        "doc" : {
          "t" : "Sets the playlist collaboration mode to allow no collaboration (0), collaboration with all Rdio users (1), or collaboration with Rdio users followed by the playlist owner (2).The content type corresponding to a HTML form submit, application/x-www-form-urlencoded.",
          "url" : "http://developer.rdio.com/docs/read/rest/Methods#playlists"
        },
        "curl" : "curl -X POST -u 'username:password' -h 'Content-Type: application/x-www-form-urlencoded' http://api.rdio.com/1/?method=setPlaylistCollaborationMode",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Playlists",
        "displayName" : "Playlists_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/?method=setPlaylistFields",
        "params" : [
          {
            "name" : "Content-Type",
            "type" : "xsd:string",
            "style" : "header",
            "default" : "application/x-www-form-urlencoded",
            "required" : "true"
          }
        ],
        "doc" : {
          "t" : "Sets the name and description for a playlist.The content type corresponding to a HTML form submit, application/x-www-form-urlencoded.",
          "url" : "http://developer.rdio.com/docs/read/rest/Methods#playlists"
        },
        "curl" : "curl -X POST -u 'username:password' -h 'Content-Type: application/x-www-form-urlencoded' http://api.rdio.com/1/?method=setPlaylistFields",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Playlists",
        "displayName" : "Playlists_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/?method=setPlaylistOrder",
        "params" : [
          {
            "name" : "Content-Type",
            "type" : "xsd:string",
            "style" : "header",
            "default" : "application/x-www-form-urlencoded",
            "required" : "true"
          }
        ],
        "doc" : {
          "t" : "Saves the given order of tracks in a given playlist. The new order must have the same tracks as the previous order (this method may not be used to add/remove tracks).The content type corresponding to a HTML form submit, application/x-www-form-urlencoded.",
          "url" : "http://developer.rdio.com/docs/read/rest/Methods#playlists"
        },
        "curl" : "curl -X POST -u 'username:password' -h 'Content-Type: application/x-www-form-urlencoded' http://api.rdio.com/1/?method=setPlaylistOrder",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Playlists",
        "displayName" : "Playlists_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/?method=removeFromPlaylist",
        "params" : [
          {
            "name" : "Content-Type",
            "type" : "xsd:string",
            "style" : "header",
            "default" : "application/x-www-form-urlencoded",
            "required" : "true"
          }
        ],
        "doc" : {
          "t" : "Removes items from a playlist by range (index and count). All track keys to remove must be in the tracks list too. This is to prevent accidental overwriting of playlist changes.The content type corresponding to a HTML form submit, application/x-www-form-urlencoded.",
          "url" : "http://developer.rdio.com/docs/read/rest/Methods#playlists"
        },
        "curl" : "curl -X POST -u 'username:password' -h 'Content-Type: application/x-www-form-urlencoded' http://api.rdio.com/1/?method=removeFromPlaylist",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Playlists",
        "displayName" : "Playlists_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/?method=getPlaylists",
        "params" : [
          {
            "name" : "Content-Type",
            "type" : "xsd:string",
            "style" : "header",
            "default" : "application/x-www-form-urlencoded",
            "required" : "true"
          }
        ],
        "doc" : {
          "t" : "Gets the current user's playlists.The content type corresponding to a HTML form submit, application/x-www-form-urlencoded.",
          "url" : "http://developer.rdio.com/docs/read/rest/Methods#playlists"
        },
        "curl" : "curl -X POST -u 'username:password' -h 'Content-Type: application/x-www-form-urlencoded' http://api.rdio.com/1/?method=getPlaylists",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Playlists",
        "displayName" : "Playlists_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/?method=deletePlaylist",
        "params" : [
          {
            "name" : "Content-Type",
            "type" : "xsd:string",
            "style" : "header",
            "default" : "application/x-www-form-urlencoded",
            "required" : "true"
          }
        ],
        "doc" : {
          "t" : "Deletes a playlist.The content type corresponding to a HTML form submit, application/x-www-form-urlencoded.",
          "url" : "http://developer.rdio.com/docs/read/rest/Methods#playlists"
        },
        "curl" : "curl -X POST -u 'username:password' -h 'Content-Type: application/x-www-form-urlencoded' http://api.rdio.com/1/?method=deletePlaylist",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Playlists",
        "displayName" : "Playlists_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/?method=createPlaylist",
        "params" : [
          {
            "name" : "Content-Type",
            "type" : "xsd:string",
            "style" : "header",
            "default" : "application/x-www-form-urlencoded",
            "required" : "true"
          }
        ],
        "doc" : {
          "t" : "Creates a new playlist in the current user's collection. The new playlist will be returned if the creation is successful, otherwise null will be returned.The content type corresponding to a HTML form submit, application/x-www-form-urlencoded.",
          "url" : "http://developer.rdio.com/docs/read/rest/Methods#playlists"
        },
        "curl" : "curl -X POST -u 'username:password' -h 'Content-Type: application/x-www-form-urlencoded' http://api.rdio.com/1/?method=createPlaylist",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Playlists",
        "displayName" : "Playlists_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/?method=addToPlaylist",
        "params" : [
          {
            "name" : "Content-Type",
            "type" : "xsd:string",
            "style" : "header",
            "default" : "application/x-www-form-urlencoded",
            "required" : "true"
          }
        ],
        "doc" : {
          "t" : "Adds a track to a playlist.The content type corresponding to a HTML form submit, application/x-www-form-urlencoded.",
          "url" : "http://developer.rdio.com/docs/read/rest/Methods#playlists"
        },
        "curl" : "curl -X POST -u 'username:password' -h 'Content-Type: application/x-www-form-urlencoded' http://api.rdio.com/1/?method=addToPlaylist",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Playlists",
        "displayName" : "Playlists_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/?method=userFollowing",
        "params" : [
          {
            "name" : "Content-Type",
            "type" : "xsd:string",
            "style" : "header",
            "default" : "application/x-www-form-urlencoded",
            "required" : "true"
          }
        ],
        "doc" : {
          "t" : "Gets a list of users that a user follows.The content type corresponding to a HTML form submit, application/x-www-form-urlencoded.",
          "url" : "http://developer.rdio.com/docs/read/rest/Methods#social"
        },
        "curl" : "curl -X POST  -h 'Content-Type: application/x-www-form-urlencoded' http://api.rdio.com/1/?method=userFollowing",
        "authentication" : {
          "required" : "false"
        },
        "category" : "Social Network",
        "displayName" : "Social Network_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/?method=addFriend",
        "params" : [
          {
            "name" : "Content-Type",
            "type" : "xsd:string",
            "style" : "header",
            "default" : "application/x-www-form-urlencoded",
            "required" : "true"
          }
        ],
        "doc" : {
          "t" : "Adds a friend to the current user.The content type corresponding to a HTML form submit, application/x-www-form-urlencoded.",
          "url" : "http://developer.rdio.com/docs/read/rest/Methods#social"
        },
        "curl" : "curl -X POST -u 'username:password' -h 'Content-Type: application/x-www-form-urlencoded' http://api.rdio.com/1/?method=addFriend",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Social Network",
        "displayName" : "Social Network_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/?method=currentUser",
        "params" : [
          {
            "name" : "Content-Type",
            "type" : "xsd:string",
            "style" : "header",
            "default" : "application/x-www-form-urlencoded",
            "required" : "true"
          }
        ],
        "doc" : {
          "t" : "Gets information about the currently logged in user.The content type corresponding to a HTML form submit, application/x-www-form-urlencoded.",
          "url" : "http://developer.rdio.com/docs/read/rest/Methods#social"
        },
        "curl" : "curl -X POST -u 'username:password' -h 'Content-Type: application/x-www-form-urlencoded' http://api.rdio.com/1/?method=currentUser",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Social Network",
        "displayName" : "Social Network_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/?method=findUser",
        "params" : [
          {
            "name" : "Content-Type",
            "type" : "xsd:string",
            "style" : "header",
            "default" : "application/x-www-form-urlencoded",
            "required" : "true"
          }
        ],
        "doc" : {
          "t" : "Finds a user either by email address or by their username. Exactly one of email or vanityName must be supplied.The content type corresponding to a HTML form submit, application/x-www-form-urlencoded.",
          "url" : "http://developer.rdio.com/docs/read/rest/Methods#social"
        },
        "curl" : "curl -X POST  -h 'Content-Type: application/x-www-form-urlencoded' http://api.rdio.com/1/?method=findUser",
        "authentication" : {
          "required" : "false"
        },
        "category" : "Social Network",
        "displayName" : "Social Network_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/?method=removeFriend",
        "params" : [
          {
            "name" : "Content-Type",
            "type" : "xsd:string",
            "style" : "header",
            "default" : "application/x-www-form-urlencoded",
            "required" : "true"
          }
        ],
        "doc" : {
          "t" : "Removes a friend from the current user.The content type corresponding to a HTML form submit, application/x-www-form-urlencoded.",
          "url" : "http://developer.rdio.com/docs/read/rest/Methods#social"
        },
        "curl" : "curl -X POST -u 'username:password' -h 'Content-Type: application/x-www-form-urlencoded' http://api.rdio.com/1/?method=removeFriend",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Social Network",
        "displayName" : "Social Network_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/?method=userFollowers",
        "params" : [
          {
            "name" : "Content-Type",
            "type" : "xsd:string",
            "style" : "header",
            "default" : "application/x-www-form-urlencoded",
            "required" : "true"
          }
        ],
        "doc" : {
          "t" : "Gets a list of users following a user.The content type corresponding to a HTML form submit, application/x-www-form-urlencoded.",
          "url" : "http://developer.rdio.com/docs/read/rest/Methods#social"
        },
        "curl" : "curl -X POST  -h 'Content-Type: application/x-www-form-urlencoded' http://api.rdio.com/1/?method=userFollowers",
        "authentication" : {
          "required" : "false"
        },
        "category" : "Social Network",
        "displayName" : "Social Network_POST",
        "httpMethod" : "POST"
      }
    ]
  },
  "auth_strategy" : "oauth",
  "enabled" : false,
  "logo" : "http://cdn.appstorm.net/web.appstorm.net/files/2011/12/App-Store-Rdio.png",
  "logobw" : "http://octoblu-api-logos.s3.amazonaws.com/bw/rdio.png",
  "name" : "Rdio",
  "oauth" : {
    "version" : "1.0",
    "key" : "8xrf6qedwvp2m5zmwrrhbb2j",
    "secret" : "E5EbEc5vdf",
    "accessTokenURL" : "http://api.rdio.com/oauth/access_token",
    "requestTokenURL" : "http://api.rdio.com/oauth/request_token",
    "authTokenURL" : "https://www.rdio.com/oauth/authorize",
    "tokenMethod" : "oauth_signed",
    "scope" : "user"
  },
  "useCustom" : false
};


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

