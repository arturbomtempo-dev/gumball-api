import { Controller, Get, Header } from '@nestjs/common';
import { PUBLIC_CACHE_CONTROL } from '../../common/http/cache-control.js';

export const API_INDEX = {
    name: 'The Amazing World of Gumball API',
    description:
        'A free, read-only REST API about The Amazing World of Gumball and The Wonderfully Weird World of Gumball. No authentication required.',
    resources: {
        characters: '/characters',
        locations: '/locations',
        episodes: '/episodes',
        seasons: '/seasons',
        songs: '/songs',
        games: '/games',
        media: '/media',
    },
} as const;

@Controller()
export class RootController {
    @Get()
    @Header('Cache-Control', PUBLIC_CACHE_CONTROL)
    getIndex(): typeof API_INDEX {
        return API_INDEX;
    }
}
