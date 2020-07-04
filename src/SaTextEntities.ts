import * as twitterText from 'twitter-text'
import * as _ from 'underscore'
//import { WordPOS } from 'wordpos'
const WordPOS = require('wordpos')

export interface UrlEntityInterface {
	url: string
	displayUrl: string
	indices: number[]
}

export interface HashtagEntityInterface {
	hashtag: string
	indices: number[]
}

export interface MentionEntityInterface {
	screenName: string
	listSlug: string
	indices: number[]
}

export interface ImageEntityInterface {
	url: string
	indices: number[]
}

export interface EntitiesInfo {
	urls: UrlEntityInterface[]
	hashtags: HashtagEntityInterface[]
	mentions: MentionEntityInterface[]
	images: ImageEntityInterface[]
	others: string[]

	nouns: string[]
	verbs: string[]
	adjectives: string[]
	adverbs: string[]
	rest: string[]
}

export interface SaTextEntitiesInterface {
	//extractVerbs(text: string): Promise<string[]>
	//extractNouns(text: string): Promise<string[]>
	extractEntities(text: string): Promise<EntitiesInfo>
}

export class SaTextEntities implements SaTextEntitiesInterface {
	private getMessageFromException(e: any){
		if (!e) {
			return 'unknown exception';
		}
		return (e.stack ? e.stack.split('\n') : e).toString();
	}

	private wordpos: any

	constructor() {
		this.wordpos = new WordPOS()
	}

	private getPOS(text: string): Promise<any[]> {
		return this.wordpos.getPOS(text)
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

	extractEntities(text: string): Promise<EntitiesInfo> {
		return new Promise<EntitiesInfo>((resolve) => {

			const items: any[] = twitterText.extractEntitiesWithIndices(text)

			const entities: EntitiesInfo = {
				urls: []
				, hashtags: []
				, mentions: []
				, images: []
				, others: []

				, nouns: []
				, verbs: []
				, adjectives: []
				, adverbs: []
				, rest: []
			};

			items.forEach((e: any) => {
				if (e.url) {
					if (e.url.match(/([^\s]+(.jpg|.png|.gif))/gi)) {
						if (!_.some(entities.images, (item: any) => item.url.toLowerCase() === e.url.toLowerCase())) {
							entities.images.push(e);
						}
					} else {
						if (!_.some(entities.urls, (item: any) => item.url.toLowerCase() === e.url.toLowerCase())) {
							entities.urls.push(e);
							e.displayUrl = e.url.length < 100 ? e.url : e.url.substring(0, 96) + '...';
						}
					}
				} else if (e.screenName) {
					if (!_.some(entities.mentions, (item: any) => item.screenName.toLowerCase() === e.screenName.toLowerCase())) {
						entities.mentions.push(e);
					}
				} else if (e.hashtag) {
					if (!_.some(entities.hashtags, (item: any) => item.hashtag.toLowerCase() === e.hashtag.toLowerCase())) {
						entities.hashtags.push(e);
					}
				} else {
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
				.then((pos: any) => {
					entities.nouns = pos.nouns
					entities.verbs = pos.verbs
					entities.adjectives = pos.adjectives
					entities.adverbs = pos.adverbs
					entities.rest = pos.rest

					/*
					nouns:[],       Array of words that are nouns
					verbs:[],       Array of words that are verbs
					adjectives:[],  Array of words that are adjectives
					adverbs:[],     Array of words that are adverbs
					rest:[]         Array of words that are not in dict or could not be categorized as a POS
					*/

					//console.log('EntitiesHelper', items);
					resolve(entities)
				})

		})
	}
}
