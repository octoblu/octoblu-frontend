var record = {
  "application" : {
    "base" : "https://api-ssl.bitly.com",
    "resources" : [
      {
        "path" : "/v3/highvalue",
        "displayName" : "/v3/highvalue",
        "doc" : {
          "url" : "http://dev.bitly.com/data_apis.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X GET /v3/highvalue?access_token=ACCESS_TOKEN&limit=2",
        "params" : [
          {
            "doc" : {
              "url" : "http://dev.bitly.com/data_apis.html#v3_highvalue"
            },
            "style" : "query",
            "type" : "string",
            "name" : "limit"
          }
        ]
      },
      {
        "path" : "/v3/search",
        "displayName" : "/v3/search",
        "doc" : {
          "url" : "http://dev.bitly.com/data_apis.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X GET /v3/search?access_token=ACCESS_TOKEN&query=obama&domain=nytimes.com&limit=2&fields=aggregate_link%2Ctitle%2Curl",
        "params" : [
          {
            "doc" : {
              "url" : "http://dev.bitly.com/data_apis.html#v3_search"
            },
            "style" : "query",
            "type" : "string",
            "name" : "limit"
          }
        ]
      },
      {
        "path" : "/v3/realtime/bursting_phrases",
        "displayName" : "/v3/realtime/bursting_phrases",
        "doc" : {
          "url" : "http://dev.bitly.com/data_apis.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X GET /v3/realtime/bursting_phrases?access_token=ACCESS_TOKEN",
        "params" : [ ]
      },
      {
        "path" : "/v3/realtime/hot_phrases",
        "displayName" : "/v3/realtime/hot_phrases",
        "doc" : {
          "url" : "http://dev.bitly.com/data_apis.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X GET /v3/realtime/hot_phrases?access_token=ACCESS_TOKEN",
        "params" : [ ]
      },
      {
        "path" : "/v3/realtime/clickrate",
        "displayName" : "/v3/realtime/clickrate",
        "doc" : {
          "url" : "http://dev.bitly.com/data_apis.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X GET /v3/realtime/clickrate?access_token=ACCESS_TOKEN&phrase=obama",
        "params" : [
          {
            "doc" : {
              "url" : "http://dev.bitly.com/data_apis.html#v3_realtime_clickrate"
            },
            "style" : "query",
            "type" : "string",
            "name" : "phrase"
          }
        ]
      },
      {
        "path" : "/v3/link/info",
        "displayName" : "/v3/link/info",
        "doc" : {
          "url" : "http://dev.bitly.com/data_apis.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X GET /v3/link/info?access_token=ACCESS_TOKEN&link=http%3A%2F%2Fbit.ly%2FMwSGaQ",
        "params" : [
          {
            "doc" : {
              "url" : "http://dev.bitly.com/data_apis.html#v3_link_info"
            },
            "style" : "query",
            "type" : "string",
            "name" : "link"
          }
        ]
      },
      {
        "path" : "/v3/link/content",
        "displayName" : "/v3/link/content",
        "doc" : {
          "url" : "http://dev.bitly.com/data_apis.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X GET /v3/link/content?access_token=ACCESS_TOKEN&link=http%3A%2F%2Fbit.ly%2FMwSGaQ",
        "params" : [
          {
            "doc" : {
              "url" : "http://dev.bitly.com/data_apis.html#v3_link_content"
            },
            "style" : "query",
            "type" : "string",
            "name" : "link"
          }
        ]
      },
      {
        "path" : "/v3/link/category",
        "displayName" : "/v3/link/category",
        "doc" : {
          "url" : "http://dev.bitly.com/data_apis.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X GET /v3/link/category?access_token=ACCESS_TOKEN&link=http%3A%2F%2Fbit.ly%2F1234",
        "params" : [
          {
            "doc" : {
              "url" : "http://dev.bitly.com/data_apis.html#v3_link_category"
            },
            "style" : "query",
            "type" : "string",
            "name" : "link"
          }
        ]
      },
      {
        "path" : "/v3/link/social",
        "displayName" : "/v3/link/social",
        "doc" : {
          "url" : "http://dev.bitly.com/data_apis.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X GET /v3/link/social?access_token=ACCESS_TOKEN&link=http%3A%2F%2Fbit.ly%2FMwSGaQ",
        "params" : [
          {
            "doc" : {
              "url" : "http://dev.bitly.com/data_apis.html#v3_link_social"
            },
            "style" : "query",
            "type" : "string",
            "name" : "link"
          }
        ]
      },
      {
        "path" : "/v3/link/location",
        "displayName" : "/v3/link/location",
        "doc" : {
          "url" : "http://dev.bitly.com/data_apis.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X GET /v3/link/location?access_token=ACCESS_TOKEN&link=http%3A%2F%2Fbit.ly%2FMZGoYV",
        "params" : [
          {
            "doc" : {
              "url" : "http://dev.bitly.com/data_apis.html#v3_link_location"
            },
            "style" : "query",
            "type" : "string",
            "name" : "link"
          }
        ]
      },
      {
        "path" : "/v3/link/language",
        "displayName" : "/v3/link/language",
        "doc" : {
          "url" : "http://dev.bitly.com/data_apis.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X GET /v3/link/language?access_token=ACCESS_TOKEN&link=http%3A%2F%2Fbit.ly%2FMwSGaQ",
        "params" : [
          {
            "doc" : {
              "url" : "http://dev.bitly.com/data_apis.html#v3_link_language"
            },
            "style" : "query",
            "type" : "string",
            "name" : "link"
          }
        ]
      },
      {
        "path" : "/v3/expand",
        "displayName" : "/v3/expand",
        "doc" : {
          "url" : "http://dev.bitly.com/links.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/info",
        "displayName" : "/v3/info",
        "doc" : {
          "url" : "http://dev.bitly.com/links.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/link/lookup",
        "displayName" : "/v3/link/lookup",
        "doc" : {
          "url" : "http://dev.bitly.com/links.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/shorten",
        "displayName" : "/v3/shorten",
        "doc" : {
          "url" : "http://dev.bitly.com/links.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [
          {
            "doc" : {
              "url" : "http://dev.bitly.com/links.html#v3_shorten"
            },
            "style" : "query",
            "type" : "string",
            "name" : "longUrl"
          }
        ]
      },
      {
        "path" : "/v3/user/link_edit",
        "displayName" : "/v3/user/link_edit",
        "doc" : {
          "url" : "http://dev.bitly.com/links.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/user/link_lookup",
        "displayName" : "/v3/user/link_lookup",
        "doc" : {
          "url" : "http://dev.bitly.com/links.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/user/link_save",
        "displayName" : "/v3/user/link_save",
        "doc" : {
          "url" : "http://dev.bitly.com/links.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/user/save_custom_domain_keyword",
        "displayName" : "/v3/user/save_custom_domain_keyword",
        "doc" : {
          "url" : "http://dev.bitly.com/links.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/link/clicks",
        "displayName" : "/v3/link/clicks",
        "doc" : {
          "url" : "http://dev.bitly.com/link_metrics.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/link/countries",
        "displayName" : "/v3/link/countries",
        "doc" : {
          "url" : "http://dev.bitly.com/link_metrics.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/link/encoders",
        "displayName" : "/v3/link/encoders",
        "doc" : {
          "url" : "http://dev.bitly.com/link_metrics.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/link/encoders_by_count",
        "displayName" : "/v3/link/encoders_by_count",
        "doc" : {
          "url" : "http://dev.bitly.com/link_metrics.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/link/encoders_count",
        "displayName" : "/v3/link/encoders_count",
        "doc" : {
          "url" : "http://dev.bitly.com/link_metrics.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/link/referrers",
        "displayName" : "/v3/link/referrers",
        "doc" : {
          "url" : "http://dev.bitly.com/link_metrics.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/link/referrers_by_domain",
        "displayName" : "/v3/link/referrers_by_domain",
        "doc" : {
          "url" : "http://dev.bitly.com/link_metrics.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/link/referring_domains",
        "displayName" : "/v3/link/referring_domains",
        "doc" : {
          "url" : "http://dev.bitly.com/link_metrics.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/link/shares",
        "displayName" : "/v3/link/shares",
        "doc" : {
          "url" : "http://dev.bitly.com/link_metrics.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/oauth/app",
        "displayName" : "/v3/oauth/app",
        "doc" : {
          "url" : "http://dev.bitly.com/user_info.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/user/info",
        "displayName" : "/v3/user/info",
        "doc" : {
          "url" : "http://dev.bitly.com/user_info.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/user/link_history",
        "displayName" : "/v3/user/link_history",
        "doc" : {
          "url" : "http://dev.bitly.com/user_info.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/user/network_history",
        "displayName" : "/v3/user/network_history",
        "doc" : {
          "url" : "http://dev.bitly.com/user_info.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/user/tracking_domain_list",
        "displayName" : "/v3/user/tracking_domain_list",
        "doc" : {
          "url" : "http://dev.bitly.com/user_info.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/user/clicks",
        "displayName" : "/v3/user/clicks",
        "doc" : {
          "url" : "http://dev.bitly.com/user_metrics.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/user/countries",
        "displayName" : "/v3/user/countries",
        "doc" : {
          "url" : "http://dev.bitly.com/user_metrics.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/user/popular_earned_by_clicks",
        "displayName" : "/v3/user/popular_earned_by_clicks",
        "doc" : {
          "url" : "http://dev.bitly.com/user_metrics.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/user/popular_earned_by_shortens",
        "displayName" : "/v3/user/popular_earned_by_shortens",
        "doc" : {
          "url" : "http://dev.bitly.com/user_metrics.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/user/popular_links",
        "displayName" : "/v3/user/popular_links",
        "doc" : {
          "url" : "http://dev.bitly.com/user_metrics.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/user/popular_owned_by_clicks",
        "displayName" : "/v3/user/popular_owned_by_clicks",
        "doc" : {
          "url" : "http://dev.bitly.com/user_metrics.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/user/popular_owned_by_shortens",
        "displayName" : "/v3/user/popular_owned_by_shortens",
        "doc" : {
          "url" : "http://dev.bitly.com/user_metrics.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/user/referrers",
        "displayName" : "/v3/user/referrers",
        "doc" : {
          "url" : "http://dev.bitly.com/user_metrics.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/user/referring_domains",
        "displayName" : "/v3/user/referring_domains",
        "doc" : {
          "url" : "http://dev.bitly.com/user_metrics.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/user/share_counts",
        "displayName" : "/v3/user/share_counts",
        "doc" : {
          "url" : "http://dev.bitly.com/user_metrics.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/user/share_counts_by_share_type",
        "displayName" : "/v3/user/share_counts_by_share_type",
        "doc" : {
          "url" : "http://dev.bitly.com/user_metrics.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/user/shorten_counts",
        "displayName" : "/v3/user/shorten_counts",
        "doc" : {
          "url" : "http://dev.bitly.com/user_metrics.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/organization/brand_messages",
        "displayName" : "/v3/organization/brand_messages",
        "doc" : {
          "url" : "http://dev.bitly.com/organization_metrics.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/organization/intersecting_links",
        "displayName" : "/v3/organization/intersecting_links",
        "doc" : {
          "url" : "http://dev.bitly.com/organization_metrics.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/organization/leaderboard",
        "displayName" : "/v3/organization/leaderboard",
        "doc" : {
          "url" : "http://dev.bitly.com/organization_metrics.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/organization/missed_opportunities",
        "displayName" : "/v3/organization/missed_opportunities",
        "doc" : {
          "url" : "http://dev.bitly.com/organization_metrics.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/organization/popular_links",
        "displayName" : "/v3/organization/popular_links",
        "doc" : {
          "url" : "http://dev.bitly.com/organization_metrics.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/bundle/archive",
        "displayName" : "/v3/bundle/archive",
        "doc" : {
          "url" : "http://dev.bitly.com/bundles.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/bundle/bundles_by_user",
        "displayName" : "/v3/bundle/bundles_by_user",
        "doc" : {
          "url" : "http://dev.bitly.com/bundles.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/bundle/clone",
        "displayName" : "/v3/bundle/clone",
        "doc" : {
          "url" : "http://dev.bitly.com/bundles.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/bundle/collaborator_add",
        "displayName" : "/v3/bundle/collaborator_add",
        "doc" : {
          "url" : "http://dev.bitly.com/bundles.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/bundle/collaborator_remove",
        "displayName" : "/v3/bundle/collaborator_remove",
        "doc" : {
          "url" : "http://dev.bitly.com/bundles.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/bundle/contents",
        "displayName" : "/v3/bundle/contents",
        "doc" : {
          "url" : "http://dev.bitly.com/bundles.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/bundle/create",
        "displayName" : "/v3/bundle/create",
        "doc" : {
          "url" : "http://dev.bitly.com/bundles.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/bundle/edit",
        "displayName" : "/v3/bundle/edit",
        "doc" : {
          "url" : "http://dev.bitly.com/bundles.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/bundle/link_add",
        "displayName" : "/v3/bundle/link_add",
        "doc" : {
          "url" : "http://dev.bitly.com/bundles.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/bundle/link_comment_add",
        "displayName" : "/v3/bundle/link_comment_add",
        "doc" : {
          "url" : "http://dev.bitly.com/bundles.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/bundle/link_comment_edit",
        "displayName" : "/v3/bundle/link_comment_edit",
        "doc" : {
          "url" : "http://dev.bitly.com/bundles.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/bundle/link_comment_remove",
        "displayName" : "/v3/bundle/link_comment_remove",
        "doc" : {
          "url" : "http://dev.bitly.com/bundles.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/bundle/link_edit",
        "displayName" : "/v3/bundle/link_edit",
        "doc" : {
          "url" : "http://dev.bitly.com/bundles.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/bundle/link_remove",
        "displayName" : "/v3/bundle/link_remove",
        "doc" : {
          "url" : "http://dev.bitly.com/bundles.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/bundle/link_reorder",
        "displayName" : "/v3/bundle/link_reorder",
        "doc" : {
          "url" : "http://dev.bitly.com/bundles.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/bundle/pending_collaborator_remove",
        "displayName" : "/v3/bundle/pending_collaborator_remove",
        "doc" : {
          "url" : "http://dev.bitly.com/bundles.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/bundle/reorder",
        "displayName" : "/v3/bundle/reorder",
        "doc" : {
          "url" : "http://dev.bitly.com/bundles.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/bundle/view_count",
        "displayName" : "/v3/bundle/view_count",
        "doc" : {
          "url" : "http://dev.bitly.com/bundles.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/user/bundle_history",
        "displayName" : "/v3/user/bundle_history",
        "doc" : {
          "url" : "http://dev.bitly.com/bundles.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/bitly_pro_domain",
        "displayName" : "/v3/bitly_pro_domain",
        "doc" : {
          "url" : "http://dev.bitly.com/domains.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/user/tracking_domain_clicks",
        "displayName" : "/v3/user/tracking_domain_clicks",
        "doc" : {
          "url" : "http://dev.bitly.com/domains.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      },
      {
        "path" : "/v3/user/tracking_domain_shorten_counts",
        "displayName" : "/v3/user/tracking_domain_shorten_counts",
        "doc" : {
          "url" : "http://dev.bitly.com/domains.html"
        },
        "httpMethod" : "GET",
        "curl" : "curl -X ",
        "params" : [ ]
      }
    ]
  },
  "auth_strategy" : "oauth",
  "custom_tokens" : [ ],
  "documentation" : "http://api.bitly.com/v1",
  "enabled" : true,
  "logo" : "http://www.indiesunlimited.com/wp-content/uploads/2013/05/bitly-puffer-fish.png",
  "logobw" : "http://octoblu-api-logos.s3.amazonaws.com/bw/bitly.png",
  "name" : "Bitly",
  "useCustom" : true,
  "oauth" : {
    "isManual" : true,
    "version" : "2.0",
    "clientId" : "INSERT_SECERT_HERE",
    "secret" : "INSERT_SECERT_HERE",
    "baseURL" : "https://bitly.com",
    "accessTokenURL" : "https://api-ssl.bitly.com/oauth/access_token",
    "requestTokenURL" : "https://api-ssl.bitly.com/",
    "authTokenURL" : "https://bitly.com/oauth/authorize",
    "tokenMethod" : "access_token_query",
    "tokenQueryParam" : "access_token",
    "authTokenPath" : "/oauth/authorize",
    "accessTokenIncludeClientInfo" : true,
    "grant_type" : "authorization_code",
    "scope" : "",
    "protocol" : "https",
    "host" : "bitly.com",
    "useOAuthLib" : true
  }
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

