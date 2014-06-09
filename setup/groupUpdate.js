/**
 * groupUpdate.js
 * create an operators group and other group info to use for testing
 */

db.groups.insert(
    {
        "uuid" : "4d066580-ef6f-11e3-979a-abcdb603e80a",
        "type" : "operators",
        "name" : "operators",
        "resource" : {
            "type" : "group",
            "uuid" : "590c3f10-ee86-11e3-979a-abcdb603e80a",
            "owner" : {
                "uuid" : "1a30cad1-dac3-11e3-b4a5-3b1cb50ca061",
                "type" : "user"
            }
        },
        "members" : [
            {
                "uuid" : "e4beb771-d097-11e3-a560-f18d626db23b",
                "type" : "user",
                "properties" : {
                    "email" : "d@octoblu.com",
                    "name" : "Dan Garlick",
                    "token" : "075dafhrdal15rk9bqcphm081m5qm2t9",
                    "uuid" : "e4beb771-d097-11e3-a560-f18d626db23b"
                }
            },

            {
                "uuid" : "48c04c20-cbe8-11e3-8fa5-2726ddcf5e29",
                "type" : "user",
                "properties" : {
                    "email" : "ryan@rxgx.com",
                    "name" : "Ryan Gasparini",
                    "token" : "hmcq0aodwo28olxrx5jdufq11s40wwmi",
                    "uuid" : "48c04c20-cbe8-11e3-8fa5-2726ddcf5e29"
                }
            },
            {
                "uuid" : "a381e8a1-c00b-11e3-887f-2fb56b40c627",
                "type" : "user",
                "properties" : {
                    "email" : "mikegodphx@gmail.com",
                    "name" : "Michael Godlewski",
                    "token" : "00fpsvmarl0xxn7b9akv4t9sryv3rf6r",
                    "uuid" : "a381e8a1-c00b-11e3-887f-2fb56b40c627"
                }

            },
            {
                "uuid" : "d31d1861-abb0-11e3-b70b-e5c6606573a1",
                "type" : "user",
                "properties" : {
                    "email" : "michael.haselton@gmail.com",
                    "name" : "Michael Haselton",
                    "token" : "le4scdtiv8to6r05oqfbcyqlg14i",
                    "uuid" : "d31d1861-abb0-11e3-b70b-e5c6606573a1"
                }
            },
            {
                "uuid" : "8b8b0d71-a31a-11e3-9ce1-09d26fc32383",
                "type" : "user",
                "properties" : {
                    "email" : "anvilhacks@gmail.com",
                    "name" : "Christian Smith",
                    "token" : "a5t8bic4jq44e7b9e9g9f5qdt9yvte29",
                    "uuid" : "8b8b0d71-a31a-11e3-9ce1-09d26fc32383"

                }
            },
            {
                "uuid" : "6ed26941-a0a8-11e3-beac-a3bcfbbc79b6",
                "type" : "user",
                "properties" : {
                    "email" : "koshin@loqwai.com",
                    "name" : "Koshin Mariano",
                    "token" : "vzn6qs7vtqvkj4ivmkld9qxu6fuhaor",
                    "uuid" : "6ed26941-a0a8-11e3-beac-a3bcfbbc79b6"
                }
            },
            {
                "uuid" : "5d092671-99e8-11e3-96a3-0f31529b4ef6",
                "type" : "user",
                "properties" : {
                    "email" : "m3talsmith@gmail.com",
                    "name" : "Michael Christenson II",
                    "token" : "dej3geplnqeyiudi457xekch1vlblnmi",
                    "uuid" : "5d092671-99e8-11e3-96a3-0f31529b4ef6"
                }
            },
            {
                "uuid" : "485c7861-902b-11e3-a463-f9d12a7b428c",
                "type" : "user",
                "properties" : {
                    "email" : "monteslu@gmail.com",
                    "name" : "Luis Montes",
                    "token" : "qky62ks3mbihpvi9oxlw07stsw6ogvi",
                    "uuid" : "485c7861-902b-11e3-a463-f9d12a7b428c"
                }
            }]
    });
