export declare interface UrlEntityInterface {
	url: string
	displayUrl: string
	indices: number[]
}

export declare interface HashtagEntityInterface {
	hashtag: string
	indices: number[]
}

export declare interface MentionEntityInterface {
	screenName: string
	listSlug: string
	indices: number[]
}

export declare interface ImageEntityInterface {
	url: string
	indices: number[]
}

export declare interface EntitiesInfo {
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

export declare interface SaTextEntitiesInterface {
	extractEntities(text: string): Promise<EntitiesInfo>;
}
export declare class SaTextEntities implements SaTextEntitiesInterface {
	extractEntities(text: string): Promise<EntitiesInfo>;
}