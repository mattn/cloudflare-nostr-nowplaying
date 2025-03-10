"use strict";

import {
    UnsignedEvent,
    getPublicKey,
    finishEvent,
    SimplePool,
} from "nostr-tools";

export interface Env {
    BOT_NSEC: string;
    LASTFM_USERNAME: string;
    LASTFM_API_KEY: string;

    nostr_nowplaying: KVNamespace;
}

export default {
    async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext) {
        const lastFmUsername = env.LASTFM_USERNAME;
        const lastFmApiKey = env.LASTFM_API_KEY;
        const nostrPrivateKey = env.BOT_NSEC;

        console.log("Fetching last track");
        const lastFmUrl =
            `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${lastFmUsername}&api_key=${lastFmApiKey}&format=json&limit=1`;
        const response = await fetch(lastFmUrl);
        const data: any = await response.json();
        const track = data.recenttracks.track[0];
        if (!track || !track["@attr"]?.nowplaying) {
            console.log("No track currently playing");
            return;
        }

        const lastStatus = (await env.nostr_nowplaying.get("status")) as string;
        const status = `${track.artist["#text"]} - ${track.name}`
        console.log(status);
        if (status === '' || status === lastStatus) {
            console.log(`No changes ${lastStatus}`);
            return;
        }
        await env.nostr_nowplaying.put("status", status);

        const expiration = Math.floor(Date.now() / 1000) + 60 * 5
        const signedEvent = finishEvent({
            kind: 30315,
            created_at: Math.floor(Date.now() / 1000),
            tags: [["d", "music"], ["expiration", `${expiration}`], ["r", `spotify:search:${encodeURIComponent(status)}`]],
            content: status,
            pubkey: getPublicKey(env.BOT_NSEC),
        } as UnsignedEvent, nostrPrivateKey)

        console.log("Publishing...");
        const relays = [
            "wss://yabu.me",
            //"wss://relay.damus.io",
            //"wss://nos.lol",
            //"wss://nostr.compile-error.net"
            "wss://grelay-jp.nostr.wirednet.jp"
        ];
        const pool = new SimplePool();
        const publishedEvent = await Promise.all(pool.publish(relays, signedEvent));
        console.log("Published event: ", publishedEvent);
    }
};
