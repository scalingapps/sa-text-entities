"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaTextEntities = void 0;
const twitterText = __importStar(require("twitter-text"));
const _ = __importStar(require("underscore"));
//import { WordPOS } from 'wordpos'
const WordPOS = require('wordpos');
class SaTextEntities {
    constructor() {
        this.wordpos = new WordPOS();
    }
    getMessageFromException(e) {
        if (!e) {
            return 'unknown exception';
        }
        return (e.stack ? e.stack.split('\n') : e).toString();
    }
    getPOS(text) {
        return this.wordpos.getPOS(text);
    }
    // extractVerbs(text: string): Promise<string[]> {
    // 	return new Promise<string[]>((resolve) => {
    // 		resolve([])
    // 	})
    // }
    // extractNouns(text: string): Promise<string[]> {
    // 	return new Promise<string[]>((resolve) => {
    // 		resolve([])
    // 	})
    // }
    extractEntities(text) {
        return new Promise((resolve) => {
            const items = twitterText.extractEntitiesWithIndices(text);
            const entities = {
                urls: [],
                hashtags: [],
                mentions: [],
                images: [],
                others: [],
                nouns: [],
                verbs: [],
                adjectives: [],
                adverbs: [],
                rest: []
            };
            items.forEach((e) => {
                if (e.url) {
                    if (e.url.match(/([^\s]+(.jpg|.png|.gif))/gi)) {
                        if (!_.some(entities.images, (item) => item.url.toLowerCase() === e.url.toLowerCase())) {
                            entities.images.push(e);
                        }
                    }
                    else {
                        if (!_.some(entities.urls, (item) => item.url.toLowerCase() === e.url.toLowerCase())) {
                            entities.urls.push(e);
                            e.displayUrl = e.url.length < 100 ? e.url : e.url.substring(0, 96) + '...';
                        }
                    }
                }
                else if (e.screenName) {
                    if (!_.some(entities.mentions, (item) => item.screenName.toLowerCase() === e.screenName.toLowerCase())) {
                        entities.mentions.push(e);
                    }
                }
                else if (e.hashtag) {
                    if (!_.some(entities.hashtags, (item) => item.hashtag.toLowerCase() === e.hashtag.toLowerCase())) {
                        entities.hashtags.push(e);
                    }
                }
                else {
                    entities.others.indexOf(e) === -1 && entities.others.push(e);
                }
            });
            // extract verbs and nouns
            // Promise.all([
            // 	this.extractNouns(text),
            // 	this.extractVerbs(text),
            // 	this.extractAdjectives(text)
            // ])
            // .then((values: any[]) => {
            // 	entities.nouns = values[0]
            // 	entities.verbs = values[1]
            // 	entities.adjectives = values[2]
            // 	//console.log('EntitiesHelper', items);
            // 	resolve(entities)
            // })
            this.getPOS(text)
                .then((pos) => {
                entities.nouns = pos.nouns;
                entities.verbs = pos.verbs;
                entities.adjectives = pos.adjectives;
                entities.adverbs = pos.adverbs;
                entities.rest = pos.rest;
                /*
                nouns:[],       Array of words that are nouns
                verbs:[],       Array of words that are verbs
                adjectives:[],  Array of words that are adjectives
                adverbs:[],     Array of words that are adverbs
                rest:[]         Array of words that are not in dict or could not be categorized as a POS
                */
                //console.log('EntitiesHelper', items);
                resolve(entities);
            });
        });
    }
}
exports.SaTextEntities = SaTextEntities;
//# sourceMappingURL=SaTextEntities.js.map