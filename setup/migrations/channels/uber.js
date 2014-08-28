
var record = {
	"__v" : 0,
	"application" : {
		"base" : "https://api.uber.com",
		"resources" : [
			{
				"httpMethod" : "GET",
				"doc" : {
					"url" : "https://developer.uber.com/v1/endpoints/#product-types"
				},
				"authentication" : {
					"required" : "true"
				},
				"displayName" : "/v1/products",
				"path" : "/v1/products",
				"params" : [
					{
						"name" : "latitude",
						"style" : "query",
						"type" : "number",
						"value" : "",
						"required" : "true"
					},
					{
						"name" : "longitude",
						"style" : "query",
						"type" : "number",
						"value" : "",
						"required" : "true"
					},
					{
						"name" : "product_id",
						"style" : "query",
						"type" : "string",
						"value" : "",
						"required" : "false"
					},
					{
						"name" : "description",
						"style" : "query",
						"type" : "string",
						"value" : "",
						"required" : "false"
					},
					{
						"name" : "display_name",
						"style" : "query",
						"type" : "string",
						"value" : "",
						"required" : "false"
					},
					{
						"name" : "capacity",
						"style" : "query",
						"type" : "number",
						"value" : "",
						"required" : "false"
					},
					{
						"name" : "image",
						"style" : "query",
						"type" : "string",
						"value" : "",
						"required" : "false"
					}
				]
			},
			{
				"httpMethod" : "GET",
				"doc" : {
					"url" : "https://developer.uber.com/v1/endpoints/#price-estimates"
				},
				"authentication" : {
					"required" : "true"
				},
				"displayName" : "/v1/estimates/price",
				"path" : "/v1/estimates/price",
				"params" : [
					{
						"name" : "start_latitude",
						"style" : "query",
						"type" : "number",
						"value" : "",
						"required" : "true"
					},
					{
						"name" : "start_longitude",
						"style" : "query",
						"type" : "number",
						"value" : "",
						"required" : "true"
					},
					{
						"name" : "end_latitude",
						"style" : "query",
						"type" : "number",
						"value" : "",
						"required" : "true"
					},
					{
						"name" : "end_longitude",
						"style" : "query",
						"type" : "number",
						"value" : "",
						"required" : "true"
					},
					{
						"name" : "product_id",
						"style" : "query",
						"type" : "string",
						"value" : "",
						"required" : "false"
					},
					{
						"name" : "currency_code",
						"style" : "query",
						"type" : "string",
						"value" : "",
						"required" : "false"
					},
					{
						"name" : "display_name",
						"style" : "query",
						"type" : "string",
						"value" : "",
						"required" : "false"
					},
					{
						"name" : "estimate",
						"style" : "query",
						"type" : "string",
						"value" : "",
						"required" : "false"
					},
					{
						"name" : "low_estimate",
						"style" : "query",
						"type" : "number",
						"value" : "",
						"required" : "false"
					},
					{
						"name" : "high_estimate",
						"style" : "query",
						"type" : "number",
						"value" : "",
						"required" : "false"
					},
					{
						"name" : "surge_multiplier",
						"style" : "query",
						"type" : "number",
						"value" : "",
						"required" : "false"
					}
				]
			},
			{
				"httpMethod" : "GET",
				"doc" : {
					"url" : "https://developer.uber.com/v1/endpoints/#time-estimates"
				},
				"authentication" : {
					"required" : "true"
				},
				"displayName" : "/v1/estimates/time",
				"path" : "/v1/estimates/time",
				"params" : [
					{
						"name" : "start_latitude",
						"style" : "query",
						"type" : "number",
						"value" : "",
						"required" : "true"
					},
					{
						"name" : "start_longitude",
						"style" : "query",
						"type" : "number",
						"value" : "",
						"required" : "true"
					},
					{
						"name" : "customer_uuid",
						"style" : "query",
						"type" : "string",
						"value" : "",
						"required" : "false"
					},
					{
						"name" : "product_id",
						"style" : "query",
						"type" : "string",
						"value" : "",
						"required" : "false"
					},
					{
						"name" : "product_id",
						"style" : "query",
						"type" : "string",
						"value" : "",
						"required" : "false"
					},
					{
						"name" : "display_name",
						"style" : "query",
						"type" : "number",
						"value" : "",
						"required" : "false"
					},
					{
						"name" : "estimate",
						"style" : "query",
						"type" : "number",
						"value" : "",
						"required" : "false"
					}
				]
			},
			{
				"httpMethod" : "GET",
				"doc" : {
					"url" : "https://developer.uber.com/v1/endpoints"
				},
				"authentication" : {
					"required" : "true"
				},
				"displayName" : "/v1/history",
				"path" : "/v1/history",
				"params" : [
					{
						"name" : "offset",
						"style" : "query",
						"type" : "number",
						"value" : "",
						"required" : "true"
					},
					{
						"name" : "limit",
						"style" : "query",
						"type" : "number",
						"value" : "",
						"required" : "true"
					},
					{
						"name" : "offset",
						"style" : "query",
						"type" : "number",
						"value" : "",
						"required" : "false"
					},
					{
						"name" : "limit",
						"style" : "query",
						"type" : "number",
						"value" : "",
						"required" : "false"
					},
					{
						"name" : "count",
						"style" : "query",
						"type" : "number",
						"value" : "",
						"required" : "false"
					},
					{
						"name" : "history",
						"style" : "query",
						"type" : "string",
						"value" : "",
						"required" : "false"
					}
				]
			},
			{
				"httpMethod" : "GET",
				"doc" : {
					"url" : "https://developer.uber.com/v1/endpoints/#user-profile"
				},
				"authentication" : {
					"required" : "true"
				},
				"displayName" : "/v1/me",
				"path" : "/v1/me",
				"params" : [
					{
						"name" : "first_name",
						"style" : "query",
						"type" : "string",
						"value" : "",
						"required" : "false"
					},
					{
						"name" : "last_name",
						"style" : "query",
						"type" : "string",
						"value" : "",
						"required" : "false"
					},
					{
						"name" : "email",
						"style" : "query",
						"type" : "string",
						"value" : "",
						"required" : "false"
					},
					{
						"name" : "picture",
						"style" : "query",
						"type" : "string",
						"value" : "",
						"required" : "false"
					},
					{
						"name" : "promo_code",
						"style" : "query",
						"type" : "string",
						"value" : "",
						"required" : "false"
					}
				]
			}
		]
	},
	"auth_strategy" : "oauth",
	"custom_tokens" : [ ],
	"description" : "",
	"documentation" : "https://developer.uber.com/v1/endpoints",
	"enabled" : true,
	"logo" : "http://allthingsd.com/files/2013/08/uber-logo.jpg",
	"name" : "UBER",
	"oauth": {
		"development": {
			/*
				CLIENT ID
				k2Hq2mo_disRbyRXuoO45vZkYzIO_ySX
				SERVER TOKEN
				K5wLk0fAYeiFuNqvQLrk4sTmU8VVCjuq1yogCyEY
				SECRET
				LInzLCRPYT97oZXUbRdi5m9ZJbmBf-gkVtt8a4-j
			*/
			"authTokenPath": "/oauth/token",
      "authTokenURL": "https://login.uber.com/oauth/authorize",
      "baseURL": "https://api.uber.com/v1/",
      "clientId": "k2Hq2mo_disRbyRXuoO45vZkYzIO_ySX",
      "secret": "LInzLCRPYT97oZXUbRdi5m9ZJbmBf",
      "scope": "",
      "tokenMethod": "bearer",
      "version": "2.0"
		}
	}
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


