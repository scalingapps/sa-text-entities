export declare interface EntitiesInfo {
}

export declare interface SaTextEntitiesInterface {
	extractEntities(text: string): Promise<EntitiesInfo>;
}
export declare class SaTextEntities implements SaTextEntitiesInterface {
	extractEntities(text: string): Promise<EntitiesInfo>;
}