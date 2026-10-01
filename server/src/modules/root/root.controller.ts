import { Controller, Get, Header } from '@nestjs/common';
import { PUBLIC_CACHE_CONTROL } from '../../common/http/cache-control.js';

export const RESOURCES = {
    characters: '/characters',
    locations: '/locations',
    episodes: '/episodes',
    seasons: '/seasons',
    songs: '/songs',
    games: '/games',
    media: '/media',
} as const;

@Controller()
export class RootController {
    @Get()
    @Header('Cache-Control', PUBLIC_CACHE_CONTROL)
    listResources(): typeof RESOURCES {
        return RESOURCES;
    }
}
